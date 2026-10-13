// TanksGod Mobile Layer - non destructive addon
(function(){
  document.addEventListener('touchmove', function(e){ e.preventDefault(); }, {passive:false});
  let last=0;
  window.addEventListener('touchend', function(e){
    const now=Date.now();
    if(now-last<300) e.preventDefault();
    last=now;
  }, {passive:false});
  document.documentElement.style.setProperty('--mobile-safe-area-top','env(safe-area-inset-top)');
  window.TanksGodMobile={version:'HOME-SCREEN-ULTIMATE', preserved:true};
})();
