// TanksGod Absolute Mode expansion
// Additive module: does not replace original game logic.
(function(){
 const key='tg_absolute_save';
 const state=JSON.parse(localStorage.getItem(key)||'{"level":1,"xp":0,"coins":0,"crystals":0,"bosses":0,"skins":[],"weapons":[]}');
 function save(){localStorage.setItem(key,JSON.stringify(state));}
 window.TanksGodAbsolute={
  state,
  addXP(n){state.xp+=n;while(state.xp>=state.level*100){state.xp-=state.level*100;state.level++;state.coins+=100;}save();},
  reward(n){state.coins+=n;save();},
  unlockSkin(s){if(!state.skins.includes(s))state.skins.push(s);save();},
  unlockWeapon(w){if(!state.weapons.includes(w))state.weapons.push(w);save();}
 };
 const missions=[
  'Destroy 50 enemies','Defeat the boss','Survive 5 minutes','Collect battlefield loot','Upgrade your tank'
 ];
 window.TanksGodMissions=missions;
 window.TanksGodBosses=['Omega','Titan','Inferno Lord','Cyber Destroyer','Galaxy King'];
 window.TanksGodLoot=['coins','crystals','armor','damage','speed'];
})();
