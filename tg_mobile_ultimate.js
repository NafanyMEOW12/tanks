/* TanksGod Mobile Ultimate Expansion - additive only */
(()=>{
'use strict';
const KEY='tg_ultimate_profile';
const defaults={player:'Commander',level:1,xp:0,coins:1000,gems:50,selected:'classic',owned:['classic'],unlockedLevels:10,inventory:[],missions:{kills:0}};
let p=JSON.parse(localStorage.getItem(KEY)||JSON.stringify(defaults));
const save=()=>localStorage.setItem(KEY,JSON.stringify(p));

const tanks={
 classic:{name:'Classic',power:1,price:0},
 inferno:{name:'Inferno🔥',power:1.4,price:500},
 frost:{name:'Frost❄',power:1.7,price:900},
 shadow:{name:'Shadow☠',power:2.1,price:1600},
 titan:{name:'Titan👑',power:3,price:5000}
};
const missions=[
 ['Уничтожить врагов',100],['Пройти уровень',200],['Открыть новый танк',500]
];
function panel(){
 let d=document.createElement('div');d.id='ultimate-panel';
 d.innerHTML=`<b>⚡ TanksGod Mobile Ultimate</b><br>LVL <span id=uLvl></span> | 🪙<span id=uCoins></span><br>💎<span id=uGems></span><br><button id=uShop>Гараж</button><button id=uUpgrade>Прокачка</button><button id=uMusic>🎵</button>`;
 d.style.cssText='position:fixed;left:8px;bottom:8px;z-index:99999;background:#111d;color:white;padding:10px;border-radius:14px;font-family:Arial;font-size:13px';
 document.body.appendChild(d);
 document.getElementById('uShop').onclick=shop;
 document.getElementById('uUpgrade').onclick=upgrade;
 document.getElementById('uMusic').onclick=music;
 render();
}
function render(){['uLvl','uCoins','uGems'].forEach((id,i)=>{let e=document.getElementById(id);if(e)e.textContent=[p.level,p.coins,p.gems][i]})}
function shop(){
 let msg='ГАРАЖ\n';Object.entries(tanks).forEach(([k,v])=>msg+=`${k}: ${v.name} ${v.price}\n`);
 let k=prompt(msg+'\nВведи название'); if(!tanks[k])return;
 if(!p.owned.includes(k)&&p.coins<tanks[k].price)return alert('Недостаточно монет');
 if(!p.owned.includes(k))p.coins-=tanks[k].price,p.owned.push(k);
 p.selected=k;save();render();
}
function upgrade(){if(p.coins>=250){p.coins-=250;p.xp+=100;p.level++;p.unlockedLevels+=2;save();render();alert('Танк усилен! Открыты новые уровни')}}
function music(){try{let C=window.AudioContext||window.webkitAudioContext,a=new C();let t=a.currentTime;[130,164,196,247,330].forEach((n,i)=>{let o=a.createOscillator(),g=a.createGain();o.frequency.value=n;g.gain.value=.03;o.connect(g);g.connect(a.destination);o.start(t+i*.2);o.stop(t+i*.2+.18)})}catch(e){}}
window.TanksGodUltimate={profile:p,save};
window.addEventListener('load',()=>setTimeout(panel,1000));
})();
