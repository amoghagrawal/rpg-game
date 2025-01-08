let canAct = true;
let assetsLoaded = false;
const assets = ['/alagard.ttf', '/background.png'];
function preloadAssets() {
  const loadPromises = [];
  assets.filter(url => url.endsWith('.png')).forEach(imageUrl => {
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = resolve;
      img.onerror = reject;
    });
    loadPromises.push(promise);
  });
  assets.filter(url => url.endsWith('.ttf')).forEach(fontUrl => {
    const promise = new Promise((resolve, reject) => {
      const font = new FontFace('Alagard', `url(${fontUrl})`);
      font.load().then(() => {
        document.fonts.add(font);
        resolve();
      }).catch(reject);
    });
    loadPromises.push(promise);
  });
  return Promise.all(loadPromises).then(() => {
    loadProgress();
    musicEnabled = true;
    backgroundMusic.volume = 0.3;
    musicButton.textContent = 'Music: On';
    backgroundMusic.play().catch(e => {
      console.warn('Music autoplay failed:', e);
      musicEnabled = false;
      musicButton.textContent = 'Music: Off';
    });
  });
}
window.onload = function () {
  document.body.style.opacity = '0.5';
  let musicEnabled = true;
  const backgroundMusic = document.getElementById('background-music');
  backgroundMusic.volume = 0.3;
  preloadAssets().then(() => {
    document.getElementById('toggle-music').addEventListener('click', toggleMusic);
    assetsLoaded = true;
    document.body.style.opacity = '1';
    if (document.getElementById('game-container').style.display === 'block') {
      updateStats();
    }
    loadProgress();
    musicEnabled = true;
    backgroundMusic.volume = 0.3;
    musicButton.textContent = 'Music: On';
    backgroundMusic.play().catch(e => {
      console.warn('Music autoplay failed:', e);
      musicEnabled = false;
      musicButton.textContent = 'Music: Off';
    });
  }).catch(err => {
    console.error('Failed to load assets:', err);
  });
};
function backToMain() {
  hideAllScenes();
  document.getElementById('main-menu').style.display = 'block';
  hideHelp();
  if (musicEnabled && backgroundMusic.paused) {
    backgroundMusic.play().catch(console.warn);
  }
}
function hideAllScenes() {
  const scenes = ['main-menu', 'levels-menu', 'bedroom', 'game-container', 'city-scene', 'spy-house', 'fortnite-scene', 'noob-scene', 'noob-battle', 'sweat-battle', 'lunch-scene', 'eggman-scene'];
  scenes.forEach(scene => {
    document.getElementById(scene).style.display = 'none';
  });
}
function startFromBedroom() {
  if (gameProgress.levelsUnlocked < 1) return;
  hideAllScenes();
  document.getElementById('bedroom').style.display = 'block';
  document.getElementById('dialog-box').innerHTML = 'Heavy wakes up feeling hungry. What should Heavy eat for breakfast?';
  hideHelp();
}
function startFromCity() {
  if (gameProgress.levelsUnlocked < 2) return;
  hideAllScenes();
  document.getElementById('city-scene').style.display = 'block';
  document.getElementById('city-dialog').innerHTML = 'Heavy stands victorious in the city. What should Heavy do now?';
  showHelp('Explore the city and make choices to continue your adventure!');
  player.currentHp = player.maxHp;
  player.sandwiches = 3;
}
function startFromSpyHouse() {
  if (gameProgress.levelsUnlocked < 3) return;
  hideAllScenes();
  document.getElementById('spy-house').style.display = 'block';
  document.getElementById('spy-dialog').innerHTML = 'Welcome to my humble abode, mon ami! What shall we do?';
}
function startFromFortnite() {
  if (gameProgress.levelsUnlocked < 4) return;
  hideAllScenes();
  document.getElementById('fortnite-scene').style.display = 'block';
  document.getElementById('fortnite-dialog').innerHTML = 'After shooting once, a sweat instantly builds an entire house! Heavy is very confused...';
}
function startFromNoobBattle() {
  if (gameProgress.levelsUnlocked < 5) return;
  hideAllScenes();
  document.getElementById('noob-battle').style.display = 'block';
  initNoobBattle();
  document.getElementById('noob-battle-log').innerHTML = 'The remaining noob is angry! He wants revenge!';
}
function startFromSweatBattle() {
  if (gameProgress.levelsUnlocked < 6) return;
  hideAllScenes();
  document.getElementById('sweat-battle').style.display = 'block';
  initSweatBattle();
  document.getElementById('sweat-battle-log').innerHTML = 'The sweat has returned for revenge! He\'s armed with multiple weapons!';
}
function startFromLunch() {
  if (gameProgress.levelsUnlocked < 7) return;
  hideAllScenes();
  document.getElementById('lunch-scene').style.display = 'block';
  document.getElementById('lunch-dialog').innerHTML = 'After defeating the sweat, Heavy returns home to make lunch. What should Heavy eat?';
}
function startFromEggman() {
  if (gameProgress.levelsUnlocked < 8) return;
  hideAllScenes();
  document.getElementById('eggman-scene').style.display = 'block';
  document.getElementById('eggman-dialog').innerHTML = 'Inspired by Eggman\'s heroic sacrifice, Heavy dresses up in a red coat and goggles!\n"I AM EGGMAN WEAPONS GUY!"';
  generateEggmanChoices();
}
function eatFood(food) {
  const buttons = document.querySelectorAll('.bedroom-options .menu-button');
  buttons.forEach(btn => btn.disabled = true);
  const dialogBox = document.getElementById('dialog-box');
  playSound('food-pickup-sound');
  switch (food) {
    case 'chocolate':
      dialogBox.innerHTML = 'Heavy feels sugar rush coming...';
      setTimeout(() => {
        dialogBox.innerHTML = 'Heavy starts shaking uncontrollably!';
        setTimeout(() => {
          dialogBox.innerHTML = 'The chocolate was too powerful!';
          setTimeout(() => {
            dialogBox.innerHTML = 'OH NO! Heavy ate too much chocolate!';
            setTimeout(() => {
              showGameOver('Sugar Overdose... Heavy is dead!');
            }, 2000);
          }, 2000);
        }, 2000);
      }, 2000);
      break;
    case 'steak':
      dialogBox.innerHTML = 'Heavy takes a big bite of steak...';
      setTimeout(() => {
        dialogBox.innerHTML = 'Something feels wrong...';
        setTimeout(() => {
          dialogBox.innerHTML = 'Heavy starts seeing things!';
          setTimeout(() => {
            dialogBox.innerHTML = 'EMERGENCY! Heavy is calling 911 on everything!';
            setTimeout(() => {
              showGameOver('Heavy was taken to special doctor...');
            }, 2000);
          }, 2000);
        }, 2000);
      }, 2000);
      break;
    case 'sandwich':
      dialogBox.innerHTML = 'Heavy unwraps sandwich carefully...';
      setTimeout(() => {
        dialogBox.innerHTML = 'The aroma is perfect!';
        playSound('food-pickup-sound');
        setTimeout(() => {
          dialogBox.innerHTML = 'Heavy takes a big satisfying bite...';
          playSound('heal-sound');
          setTimeout(() => {
            dialogBox.innerHTML = 'PERFECT CHOICE! Sandwich makes Heavy STRONG!';
            playSound('food-complete-sound');
            setTimeout(() => {
              document.getElementById('bedroom').style.display = 'none';
              document.getElementById('game-container').style.display = 'block';
              updateStats();
              log('A wild Scout appears in the distance...');
              setTimeout(() => {
                log('Scout: "You can\'t catch me fatty!"');
                setTimeout(() => {
                  log('Scout: "BONK!"');
                }, 2000);
              }, 2000);
            }, 2000);
          }, 2000);
        }, 2000);
      }, 2000);
      break;
  }
  setTimeout(() => {
    buttons.forEach(btn => btn.disabled = false);
  }, food === 'sandwich' ? 10000 : 8000);
}
const player = {
  maxHp: 300,
  currentHp: 300,
  sandwiches: 3,
  specialCharge: 0
};
const enemy = {
  maxHp: 125,
  currentHp: 125
};
const noobEnemy = {
  maxHp: 75,
  currentHp: 75
};
const sweatEnemy = {
  maxHp: 200,
  currentHp: 200
};
function cityChoice(choice) {
  const buttons = document.querySelectorAll('.city-options .menu-button');
  buttons.forEach(btn => btn.disabled = true);
  const cityDialog = document.getElementById('city-dialog');
  switch (choice) {
    case 'gunshow':
      cityDialog.innerHTML = 'At the gun show, Heavy meets Spy! "Bonjour, my friend! Would you like to visit my house?"';
      playSound('select-sound');
      setTimeout(() => {
        document.getElementById('city-scene').style.display = 'none';
        document.getElementById('spy-house').style.display = 'block';
      }, 2000);
      break;
    case 'fly':
      cityDialog.innerHTML = 'Heavy is flying! Heavy is bird! Ha ha!';
      playSound('flying-sound');
      setTimeout(() => {
        alert('Ending: Flying Heavy');
        location.reload();
      }, 2000);
      break;
    case 'sandwich':
      if (player.sandwiches > 0) {
        player.sandwiches--;
        cityDialog.innerHTML = 'Nom nom nom... Heavy enjoys peaceful snack.';
        document.getElementById('sandwich-count').textContent = player.sandwiches;
        playSound('heal-sound');
      } else {
        cityDialog.innerHTML = 'Heavy has no more sandwiches! This is worst day!';
      }
      break;
    case 'home':
      cityDialog.innerHTML = 'Heavy returns home to make more sandwiches.';
      playSound('food-pickup-sound');
      setTimeout(() => {
        alert('Ending: Home Sweet Home');
        location.reload();
      }, 2000);
      break;
  }
  if (choice !== 'sandwich') {
    setTimeout(() => {
      buttons.forEach(btn => btn.disabled = false);
    }, 2000);
  } else {
    buttons.forEach(btn => btn.disabled = false);
  }
  showHelp('Explore the city and make choices to continue your adventure!');
}
function spyActivity(activity) {
  const buttons = document.querySelectorAll('.spy-options .menu-button');
  buttons.forEach(btn => btn.disabled = true);
  const spyDialog = document.getElementById('spy-dialog');
  let message;
  switch (activity) {
    case 'fortnite':
      message = 'Heavy and Spy play Fortnite. Heavy shoots at player...';
      playSound('attack-sound');
      spyDialog.innerHTML = message;
      setTimeout(() => {
        document.getElementById('spy-house').style.display = 'none';
        document.getElementById('fortnite-scene').style.display = 'block';
      }, 2000);
      break;
    case 'dance':
      message = 'Heavy and Spy do synchronized dance moves. Magnifique!';
      playSound('select-sound');
      spyDialog.innerHTML = message;
      setTimeout(() => {
        alert('Ending: Dance Party');
        location.reload();
      }, 2000);
      break;
    case 'radio':
      message = 'French accordion music plays. Spy is pleased, Heavy questions his life choices.';
      spyDialog.innerHTML = message;
      if (musicEnabled) backgroundMusic.volume = 0.1;
      setTimeout(() => {
        if (musicEnabled) backgroundMusic.volume = 0.3;
        alert('Ending: Musical Evening');
        location.reload();
      }, 2000);
      break;
    case 'laugh':
      message = 'HOHOHO! HON HON HON! Heavy and Spy share hearty laugh!';
      spyDialog.innerHTML = message;
      setTimeout(() => {
        alert('Ending: Friendship');
        location.reload();
      }, 2000);
      break;
  }
  showHelp('Choose activities to do with Spy. Each leads to different outcomes!');
  setTimeout(() => {
    buttons.forEach(btn => btn.disabled = false);
  }, 2000);
}
function fortniteChoice(choice) {
  const buttons = document.querySelectorAll('.fortnite-options .menu-button');
  buttons.forEach(btn => btn.disabled = true);
  const fortniteDialog = document.getElementById('fortnite-dialog');
  let message;
  switch (choice) {
    case 'leave':
      message = 'Heavy rage quits. "This game is STOOPID!"';
      playSound('failed-sound');
      fortniteDialog.innerHTML = message;
      setTimeout(() => {
        alert('Ending: Rage Quit');
        location.reload();
      }, 2000);
      break;
    case 'fight':
      message = 'Heavy destroys sweat with minigun! "CRY SOME MORE!"';
      playSound('attack-sound');
      playSound('enemy-damage-sound');
      fortniteDialog.innerHTML = message;
      setTimeout(() => {
        alert('Ending: Victory Royale');
        location.reload();
      }, 2000);
      break;
    case 'build':
      message = 'Heavy builds entire city! RED and BLU teams arrive to fight!';
      playSound('select-sound');
      fortniteDialog.innerHTML = message;
      setTimeout(() => {
        alert('Ending: Team Battle');
        location.reload();
      }, 2000);
      break;
    case 'walk':
      message = 'Heavy walks away. "I do not understand this game."';
      playSound('flying-sound');
      fortniteDialog.innerHTML = message;
      setTimeout(() => {
        document.getElementById('fortnite-scene').style.display = 'none';
        document.getElementById('noob-scene').style.display = 'block';
      }, 2000);
      break;
  }
  setTimeout(() => {
    buttons.forEach(btn => btn.disabled = false);
  }, 2000);
}
function noobChoice(choice) {
  const buttons = document.querySelectorAll('.noob-options .menu-button');
  buttons.forEach(btn => btn.disabled = true);
  const noobDialog = document.getElementById('noob-dialog');
  let message;
  switch (choice) {
    case 'killboth':
      message = 'Heavy unleashes minigun on both noobs! "YOU ARE NO MATCH FOR ME!"';
      playSound('attack-sound');
      playSound('enemy-damage-sound');
      noobDialog.innerHTML = message;
      setTimeout(() => {
        alert('Ending: Double Kill');
        location.reload();
      }, 2000);
      break;
    case 'killone':
      message = 'Heavy kills one noob. The other one is enraged!';
      playSound('attack-sound');
      playSound('enemy-damage-sound');
      noobDialog.innerHTML = message;
      setTimeout(() => {
        document.getElementById('noob-scene').style.display = 'none';
        document.getElementById('noob-battle').style.display = 'block';
        initNoobBattle();
      }, 2000);
      break;
    case 'walkback':
      message = 'Heavy walks back but the sweat was waiting! Heavy is eliminated!';
      playSound('failed-sound');
      noobDialog.innerHTML = message;
      setTimeout(() => {
        alert('Game Over: Sweat Victory');
        location.reload();
      }, 2000);
      break;
  }
  setTimeout(() => {
    buttons.forEach(btn => btn.disabled = false);
  }, 2000);
}
function initNoobBattle() {
  player.currentHp = player.maxHp;
  noobEnemy.currentHp = noobEnemy.maxHp;
  updateNoobBattleStats();
}
function updateNoobBattleStats() {
  document.getElementById('noob-battle-player-hp').textContent = player.currentHp;
  document.getElementById('noob-battle-enemy-hp').textContent = noobEnemy.currentHp;
  document.getElementById('noob-battle-sandwich-count').textContent = player.sandwiches;
  const playerHealthPercent = player.currentHp / player.maxHp * 100;
  const enemyHealthPercent = noobEnemy.currentHp / noobEnemy.maxHp * 100;
  document.getElementById('noob-battle-player-health').style.width = playerHealthPercent + '%';
  document.getElementById('noob-battle-enemy-health').style.width = enemyHealthPercent + '%';
}
function noobBattleLog(message) {
  const battleLog = document.getElementById('noob-battle-log');
  battleLog.innerHTML += `<div class="battle-message" style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">${message}</div>`;
  battleLog.scrollTop = battleLog.scrollHeight;
}
function noobBattleAttack() {
  const damage = Math.floor(Math.random() * 30) + 20;
  noobEnemy.currentHp = Math.max(0, noobEnemy.currentHp - damage);
  noobBattleLog(`Heavy fires his minigun! Noob takes ${damage} damage!`);
  player.specialCharge += 10;
  checkNoobBattleEnd();
  if (noobEnemy.currentHp > 0) {
    noobEnemyTurn();
  }
  playSound('attack-sound');
  playSound('enemy-damage-sound');
  showHelp('Fight the angry noob! Watch out for their attacks and regeneration!');
}
function noobBattleHeal() {
  if (player.sandwiches > 0) {
    const healing = 100;
    player.currentHp = Math.min(player.maxHp, player.currentHp + healing);
    player.sandwiches--;
    noobBattleLog('Heavy eats a Sandwich. Delicious! (+100 HP)');
    playSound('heal-sound');
    noobEnemyTurn();
  } else {
    noobBattleLog('No more Sandwiches left!');
  }
}
function noobBattleSpecial() {
  if (player.specialCharge >= 100) {
    const damage = Math.floor(Math.random() * 50) + 75;
    noobEnemy.currentHp = Math.max(0, noobEnemy.currentHp - damage);
    noobBattleLog(`POW! HA HA! Critical hit! Noob takes ${damage} damage!`);
    playSound('special-sound');
    player.specialCharge = 0;
    checkNoobBattleEnd();
    if (noobEnemy.currentHp > 0) {
      noobEnemyTurn();
    }
  } else {
    noobBattleLog('Not enough charge! (Need 100%)');
  }
}
function noobBattleTaunt() {
  const taunts = ['CRY SOME MORE!', 'I am full of sandwich, and I am coming for you!', 'What was that, Sandwich? Kill them all? GOOD IDEA!'];
  noobBattleLog(`Heavy: "${taunts[Math.floor(Math.random() * taunts.length)]}"`);
  noobEnemyTurn();
}
function noobEnemyTurn() {
  if (noobEnemy.currentHp <= 0) return;
  const damage = Math.floor(Math.random() * 15) + 5;
  player.currentHp = Math.max(0, player.currentHp - damage);
  noobBattleLog(`Angry Noob attacks! Heavy takes ${damage} damage!`);
  playSound('damage-sound');
  setTimeout(() => {
    noobEnemy.currentHp = Math.min(noobEnemy.maxHp, noobEnemy.currentHp + 7);
    noobBattleLog(`Noob regenerates 7 HP!`);
    updateNoobBattleStats();
    if (player.currentHp <= 0) {
      noobBattleLog('Heavy is dead!');
      setTimeout(() => {
        showGameOver('Heavy is dead!');
      }, 2000);
      return;
    }
  }, 1500);
}
function checkNoobBattleEnd() {
  updateNoobBattleStats();
  if (noobEnemy.currentHp <= 0) {
    noobBattleLog('Victory! The noob has been defeated! But wait...');
    setTimeout(() => {
      if (gameProgress.levelsUnlocked < gameProgress.maxLevels) {
        gameProgress.levelsUnlocked++;
        saveProgress();
      }
      document.getElementById('noob-battle').style.display = 'none';
      document.getElementById('sweat-battle').style.display = 'block';
      initSweatBattle();
      sweatBattleLog('The sweat has returned for revenge!');
    }, 2000);
  }
}
function initSweatBattle() {
  player.currentHp = player.maxHp;
  sweatEnemy.currentHp = sweatEnemy.maxHp;
  updateSweatBattleStats();
}
function updateSweatBattleStats() {
  document.getElementById('sweat-battle-player-hp').textContent = player.currentHp;
  document.getElementById('sweat-battle-enemy-hp').textContent = sweatEnemy.currentHp;
  document.getElementById('sweat-battle-sandwich-count').textContent = player.sandwiches;
  const playerHealthPercent = player.currentHp / player.maxHp * 100;
  const enemyHealthPercent = sweatEnemy.currentHp / sweatEnemy.maxHp * 100;
  document.getElementById('sweat-battle-player-health').style.width = playerHealthPercent + '%';
  document.getElementById('sweat-battle-enemy-health').style.width = enemyHealthPercent + '%';
}
function sweatBattleLog(message) {
  const battleLog = document.getElementById('sweat-battle-log');
  battleLog.innerHTML += `<div class="battle-message" style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">${message}</div>`;
  battleLog.scrollTop = battleLog.scrollHeight;
}
function sweatEnemyTurn() {
  if (sweatEnemy.currentHp <= 0) return;
  const weaponRoll = Math.random() * 100;
  if (weaponRoll < 97) {
    sweatBattleLog('Sweat misses with sniper! "MY AIM IS TRASH!"');
  } else {
    player.currentHp = 0;
    sweatBattleLog('HEADSHOT! Heavy is dead!');
    playSound('damage-sound');
    setTimeout(() => {
      showGameOver('Heavy is dead!');
    }, 2000);
    return;
  }
  if (weaponRoll >= 97 && weaponRoll < 98.5) {
    if (Math.random() < 0.5) {
      player.currentHp = 0;
      sweatBattleLog('Heavy is dead!');
      playSound('damage-sound');
      setTimeout(() => {
        showGameOver('Heavy is dead!');
      }, 2000);
      return;
    } else {
      sweatBattleLog('Sweat misses with shotgun!');
    }
  }
  if (weaponRoll >= 98.5 && weaponRoll < 99) {
    player.currentHp = 1;
    sweatBattleLog('Sweat sprays with SMG! Heavy barely survives with 1 HP!');
    playSound('damage-sound');
  }
  sweatEnemy.currentHp = Math.min(sweatEnemy.maxHp, sweatEnemy.currentHp + 7);
  sweatBattleLog(`Sweat regenerates 7 HP!`);
  updateSweatBattleStats();
}
function sweatBattleAttack() {
  const damage = Math.floor(Math.random() * 30) + 20;
  sweatEnemy.currentHp = Math.max(0, sweatEnemy.currentHp - damage);
  sweatBattleLog(`Heavy fires his minigun! Sweat takes ${damage} damage!`);
  player.specialCharge += 10;
  checkSweatBattleEnd();
  if (sweatEnemy.currentHp > 0) {
    sweatEnemyTurn();
  }
  playSound('attack-sound');
  playSound('enemy-damage-sound');
  showHelp('The sweat is dangerous! They have multiple weapons and can regenerate health!');
}
function sweatBattleHeal() {
  if (player.sandwiches > 0) {
    const healing = 100;
    player.currentHp = Math.min(player.maxHp, player.currentHp + healing);
    player.sandwiches--;
    sweatBattleLog('Heavy eats a Sandwich. Delicious! (+100 HP)');
    playSound('heal-sound');
    sweatEnemyTurn();
  } else {
    sweatBattleLog('No more Sandwiches left!');
  }
}
function sweatBattleSpecial() {
  if (player.specialCharge >= 100) {
    const damage = Math.floor(Math.random() * 50) + 75;
    sweatEnemy.currentHp = Math.max(0, sweatEnemy.currentHp - damage);
    sweatBattleLog(`POW! HA HA! Critical hit! Sweat takes ${damage} damage!`);
    playSound('special-sound');
    player.specialCharge = 0;
    checkSweatBattleEnd();
    if (sweatEnemy.currentHp > 0) {
      sweatEnemyTurn();
    }
  } else {
    sweatBattleLog('Not enough charge! (Need 100%)');
  }
}
function sweatBattleTaunt() {
  const taunts = ['CRY SOME MORE!', 'I am full of sandwich, and I am coming for you!', 'What was that, Sandwich? Kill them all? GOOD IDEA!'];
  sweatBattleLog(`Heavy: "${taunts[Math.floor(Math.random() * taunts.length)]}"`);
  sweatEnemyTurn();
}
function checkSweatBattleEnd() {
  updateSweatBattleStats();
  if (sweatEnemy.currentHp <= 0) {
    sweatBattleLog('Victory! The sweat has been defeated!');
    setTimeout(() => {
      if (gameProgress.levelsUnlocked < gameProgress.maxLevels) {
        gameProgress.levelsUnlocked++;
        saveProgress();
      }
      document.getElementById('sweat-battle').style.display = 'none';
      document.getElementById('lunch-scene').style.display = 'block';
    }, 2000);
  }
}
const battleLog = document.getElementById('battle-log');
function updateStats() {
  document.getElementById('player-hp').textContent = player.currentHp;
  document.getElementById('enemy-hp').textContent = enemy.currentHp;
  document.getElementById('sandwich-count').textContent = player.sandwiches;
  const playerHealthPercent = player.currentHp / player.maxHp * 100;
  const enemyHealthPercent = enemy.currentHp / enemy.maxHp * 100;
  const playerHealthBar = document.getElementById('player-health');
  const enemyHealthBar = document.getElementById('enemy-health');
  if (playerHealthBar && enemyHealthBar) {
    requestAnimationFrame(() => {
      playerHealthBar.style.width = playerHealthPercent + '%';
      enemyHealthBar.style.width = enemyHealthPercent + '%';
    });
  }
  const specialCharge = document.getElementById('special-charge');
  if (specialCharge) {
    const specialChargePercent = player.specialCharge / 100 * 100;
    specialCharge.style.width = specialChargePercent + '%';
  }
}
function log(message) {
  battleLog.innerHTML += `<div class="battle-message" style="color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">${message}</div>`;
  battleLog.scrollTo({
    top: battleLog.scrollHeight,
    behavior: 'smooth'
  });
  const messages = battleLog.children;
  if (messages.length > 50) {
    messages[0].remove();
  }
}
function attack() {
  if (!canAct) return;
  canAct = false;
  const actionButtons = document.querySelectorAll('.action-buttons button');
  actionButtons.forEach(btn => btn.disabled = true);
  const damage = Math.floor(Math.random() * 30) + 20;
  enemy.currentHp = Math.max(0, enemy.currentHp - damage);
  log(`Heavy spins up minigun...`);
  setTimeout(() => {
    log(`"YATATATATATA YATATATATA!"`);
    setTimeout(() => {
      log(`Heavy fires his minigun! Scout takes ${damage} damage!`);
      player.specialCharge += 10;
      checkBattleEnd();
      playSound('enemy-damage-sound');
    }, 1000);
  }, 1000);
  playSound('attack-sound');
  showHelp('Use attacks to damage the enemy. Special attack charges up as you fight!');
  setTimeout(() => {
    if (enemy.currentHp > 0) {
      actionButtons.forEach(btn => btn.disabled = false);
      canAct = true;
      enemyTurn();
    }
  }, 4000);
}
function heal() {
  if (!canAct) return;
  canAct = false;
  const actionButtons = document.querySelectorAll('.action-buttons button');
  actionButtons.forEach(btn => btn.disabled = true);
  if (player.sandwiches > 0) {
    const healing = 100;
    log('Heavy pulls out sandwich...');
    playSound('food-pickup-sound');
    setTimeout(() => {
      log('"Moist and delicious!"');
      playSound('heal-sound');
      setTimeout(() => {
        player.currentHp = Math.min(player.maxHp, player.currentHp + healing);
        player.sandwiches--;
        log('Heavy eats a Sandwich. Delicious! (+100 HP)');
        playSound('food-complete-sound');
        enemyTurn();
      }, 1500);
    }, 1500);
    setTimeout(() => {
      actionButtons.forEach(btn => btn.disabled = false);
      canAct = true;
    }, 4500);
  } else {
    log('No more Sandwiches left!');
    setTimeout(() => {
      actionButtons.forEach(btn => btn.disabled = false);
      canAct = true;
    }, 1000);
  }
  showHelp('Eat sandwiches to restore 100 HP. You have limited sandwiches!');
}
function specialAttack() {
  if (!canAct) return;
  canAct = false;
  const actionButtons = document.querySelectorAll('.action-buttons button');
  actionButtons.forEach(btn => btn.disabled = true);
  if (player.specialCharge >= 100) {
    const damage = Math.floor(Math.random() * 50) + 75;
    log('Heavy winds up his fist...');
    setTimeout(() => {
      log('"POW!"');
      playSound('special-sound');
      setTimeout(() => {
        enemy.currentHp = Math.max(0, enemy.currentHp - damage);
        log(`Critical hit! Scout takes ${damage} damage!`);
        player.specialCharge = 0;
        checkBattleEnd();
        if (enemy.currentHp > 0) {
          enemyTurn();
        }
      }, 1500);
    }, 1500);
    setTimeout(() => {
      actionButtons.forEach(btn => btn.disabled = false);
      canAct = true;
    }, 4500);
  } else {
    log('Not enough charge! (Need 100%)');
    setTimeout(() => {
      actionButtons.forEach(btn => btn.disabled = false);
      canAct = true;
    }, 1000);
  }
  showHelp('Special attack does massive damage when charged to 100%!');
}
function taunt() {
  if (!canAct) return;
  canAct = false;
  const actionButtons = document.querySelectorAll('.action-buttons button');
  actionButtons.forEach(btn => btn.disabled = true);
  const taunts = ['CRY SOME MORE!', 'I am full of sandwich, and I am coming for you!', 'What was that, Sandwich? Kill them all? GOOD IDEA!'];
  log(`Heavy: "${taunts[Math.floor(Math.random() * taunts.length)]}"`);
  enemyTurn();
  setTimeout(() => {
    actionButtons.forEach(btn => btn.disabled = false);
    canAct = true;
  }, 1500);
}
function checkBattleEnd() {
  updateStats();
  if (enemy.currentHp <= 0) {
    log('Scout falls to the ground...');
    setTimeout(() => {
      log('"You win this time, fat man..."');
      setTimeout(() => {
        log('Victory! Scout is dead! Not big surprise!');
        setTimeout(() => {
          if (gameProgress.levelsUnlocked < gameProgress.maxLevels) {
            gameProgress.levelsUnlocked++;
            saveProgress();
          }
          document.getElementById('game-container').style.display = 'none';
          document.getElementById('city-scene').style.display = 'block';
          showHelp('Explore the city and make choices to continue your adventure!');
        }, 2000);
      }, 2000);
    }, 2000);
  }
}
function enemyTurn() {
  if (enemy.currentHp <= 0) return;
  log('Scout drinks BONK! Atomic Punch...');
  setTimeout(() => {
    log('"I\'m a force of nature!"');
    setTimeout(() => {
      const damage = Math.floor(Math.random() * 20) + 10;
      player.currentHp = Math.max(0, player.currentHp - damage);
      log(`Scout attacks! Heavy takes ${damage} damage!`);
      playSound('damage-sound');
      setTimeout(() => {
        enemy.currentHp = Math.min(enemy.maxHp, enemy.currentHp + 7);
        log(`Scout regenerates 7 HP!`);
        updateStats();
        if (player.currentHp <= 0) {
          log('Heavy is dead!');
          setTimeout(() => {
            showGameOver('Heavy is dead!');
          }, 2000);
          return;
        }
      }, 1500);
    }, 1500);
  }, 1500);
}
function makeLunch(choice) {
  const buttons = document.querySelectorAll('.lunch-options .menu-button');
  buttons.forEach(btn => btn.disabled = true);
  const lunchDialog = document.getElementById('lunch-dialog');
  let message;
  playSound('food-pickup-sound');
  switch (choice) {
    case 'chocolate':
      message = 'Not again! Heavy ate too much chocolate! Sugar rush! Heavy destroys entire house!';
      lunchDialog.innerHTML = message;
      setTimeout(() => {
        alert('Ending: Sugar Destruction');
        location.reload();
      }, 2000);
      break;
    case 'steak':
      message = 'Heavy cooks steak perfectly! But instead of paranoia, Heavy decides to watch Sonic 3: The Movie...';
      lunchDialog.innerHTML = message;
      playSound('heal-sound');
      setTimeout(() => {
        message = 'Heavy watches as Sonic fights Shadow in London...<br>Eggman meets his father, but is betrayed...<br>Eggman is forced to kill his own father...<br>In the end, Eggman sacrifices himself to save Earth...';
        lunchDialog.innerHTML += `<br><br>${message}`;
        setTimeout(() => {
          message = '"EGGMAN WAS CREDIT TO TEAM!" *Heavy cries uncontrollably*';
          lunchDialog.innerHTML += `<br><br>${message}`;
          playSound('food-complete-sound');
          setTimeout(() => {
            document.getElementById('lunch-scene').style.display = 'none';
            document.getElementById('eggman-scene').style.display = 'block';
            generateEggmanChoices();
          }, 3000);
        }, 4000);
      }, 2000);
      break;
    case 'sandwich':
      message = 'Perfect lunch! Heavy makes collection of tiny sandwiches!';
      lunchDialog.innerHTML = message;
      playSound('heal-sound');
      setTimeout(() => {
        playSound('food-complete-sound');
        alert('Ending: Sandwich Paradise');
        location.reload();
      }, 2000);
      break;
    case 'sour':
      message = 'BAD CHOICE! Heavy\'s mouth is destroyed! "THIS IS WORSE THAN CHOCOLATE!"';
      lunchDialog.innerHTML = message;
      setTimeout(() => {
        alert('Ending: Sour Defeat');
        location.reload();
      }, 2000);
      break;
  }
  setTimeout(() => {
    buttons.forEach(btn => btn.disabled = false);
  }, 2000);
}
async function generateEggmanChoices() {
  try {
    const eggmanDialog = document.getElementById('eggman-dialog');
    eggmanDialog.innerHTML = 'Inspired by Eggman\'s heroic sacrifice, Heavy dresses up in a red coat and goggles!<br>"I AM EGGMAN WEAPONS GUY!"<br><br><em style="color: rgba(255,255,255,0.7);">(This is the final scene of the demo!)</em>';
    const response = await fetch('/api/ai_completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        prompt: `Generate 4 creative choices for Heavy dressed as Eggman trying to take over the world. Each choice should be humorous and reference both Team Fortress 2 and Sonic themes.

            interface Response {
              choices: Array<{
                text: string;
                outcome: string;
              }>;
            }
            
            {
              "choices": [
                {
                  "text": "Build Robot Sandwiches",
                  "outcome": "Heavy creates an army of mechanical sandwiches that try to feed everyone!"
                }
              ]
            }
            `,
        data: "Heavy dressed as Eggman scenario"
      })
    });
    const data = await response.json();
    const optionsDiv = document.querySelector('.eggman-options');
    optionsDiv.innerHTML = '';
    data.choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.className = 'menu-button';
      button.textContent = choice.text;
      button.onclick = () => eggmanChoice(choice.outcome);
      optionsDiv.appendChild(button);
    });
  } catch (error) {
    console.error('Error generating choices:', error);
  }
}
function eggmanChoice(outcome) {
  const buttons = document.querySelectorAll('.eggman-options .menu-button');
  buttons.forEach(btn => btn.disabled = true);
  const eggmanDialog = document.getElementById('eggman-dialog');
  eggmanDialog.innerHTML = outcome;
  setTimeout(() => {
    alert('End of Demo! Thanks for playing! - Evil Heavy Eggman');
    location.reload();
    buttons.forEach(btn => btn.disabled = false);
  }, 3000);
}
function showGameOver(message) {
  document.getElementById('game-over-overlay').style.display = 'flex';
  document.getElementById('game-over-message').textContent = message;
  document.getElementById('game-over-overlay').style.background = '';
  document.getElementById('game-over-overlay').style.backgroundImage = 'url(\'/background.png\')';
  document.getElementById('game-over-overlay').style.backgroundSize = 'cover';
  document.getElementById('game-over-overlay').style.backgroundPosition = 'center';
  document.getElementById('game-over-overlay').style.backgroundRepeat = 'no-repeat';
  playSound('defeat-sound');
  if (musicEnabled) {
    backgroundMusic.pause();
  }
  requestAnimationFrame(() => {
    document.getElementById('game-over-overlay').classList.add('visible');
    document.getElementById('game-over-popup').classList.add('visible');
  });
}
function showHelp(content) {
  const helpPopup = document.getElementById('help-popup');
  const helpContent = document.getElementById('help-content');
  if (window.helpTimeout) {
    clearTimeout(window.helpTimeout);
  }
  helpContent.textContent = content;
  helpPopup.style.display = 'block';
  helpPopup.offsetHeight;
  helpPopup.classList.add('visible');
  window.helpTimeout = setTimeout(() => {
    hideHelp();
  }, 5000);
}
function hideHelp() {
  const helpPopup = document.getElementById('help-popup');
  helpPopup.classList.remove('visible');
  setTimeout(() => {
    helpPopup.style.display = 'none';
  }, 300);
}
document.getElementById('help-popup').addEventListener('mouseenter', () => {
  if (window.helpTimeout) {
    clearTimeout(window.helpTimeout);
  }
});
document.getElementById('help-popup').addEventListener('mouseleave', () => {
  window.helpTimeout = setTimeout(() => {
    hideHelp();
  }, 5000);
});
function showInstructions() {
  document.getElementById('instructions-overlay').style.display = 'flex';
  playSound('select-sound');
  requestAnimationFrame(() => {
    document.getElementById('instructions-overlay').classList.add('visible');
    document.getElementById('instructions-popup').classList.add('visible');
  });
}
function hideInstructions() {
  document.getElementById('instructions-overlay').classList.remove('visible');
  document.getElementById('instructions-popup').classList.remove('visible');
  setTimeout(() => {
    document.getElementById('instructions-overlay').style.display = 'none';
  }, 300);
}
const gameProgress = {
  levelsUnlocked: 1,
  maxLevels: 8
};
function saveProgress() {
  localStorage.setItem('tfRpgProgress', JSON.stringify(gameProgress));
}
function loadProgress() {
  const saved = localStorage.getItem('tfRpgProgress');
  if (saved) {
    Object.assign(gameProgress, JSON.parse(saved));
  }
}
const frameRate = 1000 / 60;
let lastFrame = 0;
function animate(timestamp) {
  if (timestamp - lastFrame >= frameRate) {
    lastFrame = timestamp;
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
function goToNextLevel() {
  document.getElementById('victory-overlay').classList.remove('visible');
  document.getElementById('victory-popup').classList.remove('visible');
  if (document.getElementById('game-container').style.display === 'block') {
    setTimeout(() => {
      document.getElementById('game-container').style.display = 'none';
      document.getElementById('city-scene').style.display = 'block';
      showHelp('Explore the city and make choices to continue your adventure!');
    }, 300);
  } else if (document.getElementById('noob-battle').style.display === 'block') {
    setTimeout(() => {
      document.getElementById('noob-battle').style.display = 'none';
      document.getElementById('sweat-battle').style.display = 'block';
      initSweatBattle();
      sweatBattleLog('The sweat has returned for revenge!');
    }, 300);
  } else if (document.getElementById('sweat-battle').style.display === 'block') {
    setTimeout(() => {
      document.getElementById('sweat-battle').style.display = 'none';
      document.getElementById('lunch-scene').style.display = 'block';
    }, 300);
  } else if (document.getElementById('lunch-scene').style.display === 'block') {
    setTimeout(() => {
      document.getElementById('lunch-scene').style.display = 'none';
      document.getElementById('eggman-scene').style.display = 'block';
      generateEggmanChoices();
    }, 300);
  } else {
    setTimeout(() => {
      location.reload();
    }, 300);
  }
  if (musicEnabled && backgroundMusic.paused) {
    backgroundMusic.play().catch(console.warn);
  }
  if (musicEnabled && backgroundMusic.paused) {
    backgroundMusic.play().catch(console.warn);
  }
}
let musicEnabled = true;
const backgroundMusic = document.getElementById('background-music');
const musicButton = document.getElementById('toggle-music');
backgroundMusic.volume = 0.3;
function toggleMusic() {
  musicEnabled = !musicEnabled;
  if (musicEnabled) {
    backgroundMusic.volume = 0.3;
    backgroundMusic.play().catch(e => {
      console.warn('Music playback failed:', e);
      musicEnabled = false;
      musicButton.textContent = 'Music: Off';
    });
    musicButton.textContent = 'Music: On';
  } else {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    musicButton.textContent = 'Music: Off';
  }
}
function playSound(id) {
  const sound = document.getElementById(id);
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(e => console.warn('Audio playback failed:', e));
  }
}
function startGame() {
  if (!assetsLoaded) {
    console.warn('Assets still loading...');
    return;
  }
  playSound('select-sound');
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('bedroom').style.display = 'block';
  if (musicEnabled) {
    backgroundMusic.play().catch(console.warn);
  }
  showHelp('Choose what Heavy should eat for breakfast. Choose wisely!');
  playSound('button-sound');
}
function showLevels() {
  if (!assetsLoaded) {
    console.warn('Assets still loading...');
    return;
  }
  playSound('select-sound');
  document.getElementById('main-menu').style.display = 'none';
  document.getElementById('levels-menu').style.display = 'block';
  loadProgress();
  playSound('button-sound');
  const levelButtons = document.querySelectorAll('#levels-menu .menu-button');
  levelButtons.forEach((button, index) => {
    if (index + 1 > gameProgress.levelsUnlocked) {
      button.classList.add('locked');
      button.disabled = true;
    } else {
      button.classList.remove('locked');
      button.disabled = false;
    }
  });
}