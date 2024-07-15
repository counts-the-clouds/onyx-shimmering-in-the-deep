window.NewGame = (function() {

  function init() {
    X.onClick('#newGame .begin-button', e => { beginGame(); });
    X.onClick('#newGame .back-to-main-button', e => { backToMain(); });
    X.onInput('#newGame input', e => { setTimeout(validateForm, 1); });
  }

  function reset() {
  }

  function backToMain() {
    ClientCommands.send("game.abort");
    MainMenu.show();
  }

  function show() {
    MainContent.show({ path:"client/views/mainMenu/new-game.html", classname:'new-game', background:'new-game-1' }).then(() => {

      MainContent.hideCover({ fadeTime:500 });

    });
  }


  function beginGame() {
    let parameters = {
    };

    ClientCommands.send('game.start', parameters).then(() => {
      MainContent.reset();
    });
  }


  function fadeIn() {
    let newGame = X.first('#newGame');
    let tween = new TWEEN.Tween({ opacity:0 });

    let animate = () => {
      if (tween) {
        requestAnimationFrame(animate);
        TWEEN.update();
      }
    }

    tween.to({ opacity:1 }, 2000);
    tween.easing(TWEEN.Easing.Quadratic.Out)
    tween.onUpdate(t => {
      newGame.setAttribute('style',`opacity:${t.opacity}`);
    });

    tween.onComplete(()=>{
      tween = null;
      newGame.removeAttribute('style');
    });

    setTimeout(() => {
      tween.start();
      animate();
    },500);
  }

  return { init, reset, show, fadeIn };

})();