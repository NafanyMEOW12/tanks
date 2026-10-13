// TanksGod Mobile Ultimate Legend - expansion layer
// Additive module: keeps original gameplay files untouched.
window.TG_LEGEND = {
  player:{level:1,xp:0,coins:0,crystals:0},
  weapons:['Cannon','Rocket','Laser','Plasma','Drone','Mine'],
  tanks:['Classic','Inferno','Frost','Shadow','Titan','Cyber','Galaxy'],
  bosses:['Omega Tank','Titan Destroyer','Inferno Lord','Cyber Beast'],
  worlds:Array.from({length:10},(_,i)=>({world:i+1,levels:10,unlocked:i===0})),
  achievements:[],
  load(){try{Object.assign(this.player,JSON.parse(localStorage.getItem('tg_legend'))||{})}catch(e){}},
  save(){localStorage.setItem('tg_legend',JSON.stringify(this.player))},
  addXP(v){this.player.xp+=v;while(this.player.xp>=100){this.player.xp-=100;this.player.level++}this.save()}
};
TG_LEGEND.load();
