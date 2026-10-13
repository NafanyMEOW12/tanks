/* TanksGod Mobile Ultimate Systems - additive expansion
   Does not replace original tank engine. */
(function(){
'use strict';
const KEY='TG_ULTIMATE_SAVE_V1';
let save=JSON.parse(localStorage.getItem(KEY)||'null')||{
 level:1,xp:0,coins:500,gems:50,unlockedSkins:['classic'],skin:'classic',upgrades:{damage:1,armor:1,speed:1},achievements:[],completed:[]
};
function store(){localStorage.setItem(KEY,JSON.stringify(save));}
function addXP(n){save.xp+=n;if(save.xp>=save.level*100){save.xp=0;save.level++;save.coins+=100;notify('LEVEL UP! '+save.level);}store();}
function addCoins(n){save.coins+=n;store();}
function buySkin(id,cost){if(save.coins>=cost&&!save.unlockedSkins.includes(id)){save.coins-=cost;save.unlockedSkins.push(id);store();notify('Skin unlocked');}}
function equip(id){if(save.unlockedSkins.includes(id)){save.skin=id;store();}}
const skins={classic:{name:'Classic',cost:0},inferno:{name:'Inferno',cost:500},frost:{name:'Frost',cost:700},shadow:{name:'Shadow',cost:1000},titan:{name:'Titan',cost:1500},cyber:{name:'Cyber',cost:2500},galaxy:{name:'Galaxy',cost:4000}};
const weapons=['Cannon','Rocket','Laser','Plasma','Drone','Mine'];
const missions=[
 'Destroy 20 enemies','Survive 3 minutes','Defeat boss tank','Collect 100 coins','Win without damage'
];
function notify(t){let d=document.createElement('div');d.textContent=t;d.style.cssText='position:fixed;top:70px;left:50%;transform:translateX(-50%);background:#111;color:white;padding:12px 20px;border-radius:12px;z-index:99999;font-weight:bold';document.body.appendChild(d);setTimeout(()=>d.remove(),2500);}
function createBoss(){return {name:'Omega Tank',hp:5000+save.level*500,damage:50+save.level*5};}
function showPanel(){
 let p=document.createElement('div');p.id='tgPanel';p.style.cssText='position:fixed;right:10px;top:10px;background:#111d;color:white;padding:12px;border-radius:15px;z-index:9999;font-family:sans-serif';
 p.innerHTML=`<b>TanksGod Ultimate</b><br>LV ${save.level} XP ${save.xp}<br>🪙 ${save.coins} 💎 ${save.gems}<br>Skin: ${save.skin}`;
 document.body.appendChild(p);
}
window.TG={save,skins,weapons,missions,addXP,addCoins,buySkin,equip,createBoss};
window.addEventListener('load',()=>{showPanel();notify('Ultimate Mobile Mode Loaded');});
// ambient soundtrack placeholder using iOS compatible audio oscillator
let audioStarted=false;
document.addEventListener('touchstart',()=>{if(audioStarted)return;audioStarted=true;try{let c=new AudioContext(),o=c.createOscillator(),g=c.createGain();o.frequency.value=110;g.gain.value=.015;o.connect(g);g.connect(c.destination);o.start();}catch(e){}},{once:true});
})();
