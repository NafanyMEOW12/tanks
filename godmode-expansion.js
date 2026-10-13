/* TanksGod Mobile GodMode Expansion - additive module
   Does not replace core gameplay. */
(()=>{
'use strict';
const S='tg_godmode_save';
let data=JSON.parse(localStorage.getItem(S)||'{"coins":0,"level":1,"skins":[],"weapon":"basic"}');
const save=()=>localStorage.setItem(S,JSON.stringify(data));
window.TanksGodExpansion={data,save};

function hud(){
 let d=document.createElement('div'); d.id='tg-hud';
 d.innerHTML=`<div>⚔️ GODMODE</div><div>Уровень: <b id="tg-lvl">${data.level}</b></div><div>🪙 <b id="tg-coins">${data.coins}</b></div><button id="tg-shop">🏪 Гараж</button>`;
 d.style.cssText='position:fixed;top:10px;right:10px;z-index:9999;background:#111c;color:#fff;padding:10px;border-radius:12px;font-family:sans-serif';
 document.body.appendChild(d);
 document.getElementById('tg-shop').onclick=shop;
}
function shop(){
 let skins=['🔥 Inferno','❄ Frost','☠ Shadow','👑 Golden'];
 let pick=prompt('МАГАЗИН\n'+skins.map((x,i)=>`${i+1}. ${x} - ${(i+1)*500} монет`).join('\n'));
 let i=Number(pick)-1;
 if(i>=0&&data.coins>=((i+1)*500)){data.coins-=(i+1)*500;data.skins.push(skins[i]);save();alert('Скин открыт: '+skins[i]);}
}

// music generator - no external files needed
let audio;
function music(){
 try{
 audio=new (window.AudioContext||window.webkitAudioContext)();
 let notes=[110,165,220,277,330];let t=audio.currentTime;
 setInterval(()=>{
  let o=audio.createOscillator(),g=audio.createGain();
  o.type='sawtooth';o.frequency.value=notes[Math.floor(Math.random()*notes.length)];
  g.gain.value=.015;o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+.12);t+=.3;
 },500);
 }catch(e){}
}
window.addEventListener('load',()=>{hud();setTimeout(music,1500)});
})();
