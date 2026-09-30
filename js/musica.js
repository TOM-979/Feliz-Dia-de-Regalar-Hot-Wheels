// Cambia la ruta y el volumen de la musica en js/recuerdos.js.
(()=>{
  'use strict';
  const config=window.GIFT_DATA.music;
  const buttons=[...document.querySelectorAll('.music-toggle')];
  const audio=new Audio(config.src);audio.loop=true;audio.preload='none';
  const volume=Number.isFinite(Number(config.volume))?Math.max(0,Math.min(1,Number(config.volume))):.35;audio.volume=volume;
  let activated=false,enabled=true,pending=false;
  function sync(){
    const on=!audio.paused&&enabled&&!document.hidden;
    buttons.forEach(b=>{b.textContent=on?'Ⅱ Música':'♫ Música';b.setAttribute('aria-label',on?'Pausar música':'Reanudar música');b.setAttribute('aria-pressed',String(on));b.classList.toggle('is-playing',on)});
    // La musica mantiene su volumen mientras los videos se reproducen en silencio.
    audio.volume=volume;
  }
  function resume(){
    if(pending||!enabled||document.hidden)return;
    pending=true;
    audio.play().then(()=>{if(!enabled||document.hidden)audio.pause();sync()}).catch(()=>{
      sync();buttons.forEach(b=>b.title='No se pudo reproducir el audio. Comprueba la ruta del archivo en music.src.');
    }).finally(()=>{pending=false});
  }
  function firstTouch(event){
    if(event.target.closest?.('.music-toggle')||!enabled||document.hidden)return;
    if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;
    if(!activated||audio.paused){activated=true;resume()}
  }
  document.addEventListener('pointerdown',firstTouch,{passive:true});
  document.addEventListener('click',firstTouch,{passive:true});
  document.addEventListener('keydown',firstTouch);
  buttons.forEach(b=>b.addEventListener('click',()=>{
    if(activated&&enabled&&(!audio.paused||pending)){enabled=false;audio.pause();sync()}
    else{activated=true;enabled=true;resume()}
  }));
  ['play','pause','ended','error'].forEach(type=>audio.addEventListener(type,sync));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){audio.pause();sync()}else if(activated&&enabled)resume()});
  ['play','pause','ended','emptied'].forEach(type=>document.addEventListener(type,event=>{if(event.target.tagName==='VIDEO')sync()},true));
})();
