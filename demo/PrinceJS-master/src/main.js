import Phaser, {Game} from 'phaser';
import BootScene from './scripts/scenes/BootScene';
import PreloadScene from './scripts/scenes/PreloadScene';
import TitleScene from './scripts/scenes/TitleScene';
import CutScene from './scripts/scenes/CutScene';
import CreditsScene from './scripts/scenes/CreditsScene';
import GameScene from './scripts/scenes/GameScene';
import EndTitleScene from './scripts/scenes/EndTitleScene';

import { SERVER_URL, ACTOR_NAME, ACTOR_MAIL, GAME_TOKEN_POP } from "./scripts/Config";


const config = {
  type: Phaser.AUTO,
  pixelart: true,
  scale: {
    mode: Phaser.Scale.NONE,
    parent: 'gameContainer',
    width: 320,
    height: 200,
    zoom: 2
  },
  fps: {
    target: 15,
    forceSetTimeOut: true
  },
  scene: [
    BootScene,
    PreloadScene,
    TitleScene,
    CutScene,
    CreditsScene,
    GameScene,
    EndTitleScene
  ]
};

// Import JaxpiLib
const Jaxpi = require ('jaxpi').default;


// Event listeners para los botones del menú
document.getElementById('playWithKey').addEventListener('click', async () => {
  const playerKey = document.getElementById('playerKey').value;

  if (playerKey.length !== 6) {
    alert('La clave debe tener 6 valores');
  } else {
    const valid = await jaxpi.validateKey(playerKey);
    console.log(valid);
    
    if (!valid) {
      alert('La clave no es correcta');

    } else {
      jaxpi.setKey(playerKey)
      startGame()
    }
  }
});

document.getElementById('playWithoutKey').addEventListener('click', async () => {
  startGame()
});



// Create a new JaxpiLib instance
let jaxpi = new Jaxpi({name: ACTOR_NAME, mail: ACTOR_MAIL}, SERVER_URL, GAME_TOKEN_POP); // Añadir Token, quitar contraseña

// Export the JaxpiLib instance
export default jaxpi;

function startGame(){
  // Ocultar el menú y mostrar el contenedor del juego
  document.getElementById('menu').style.display = 'none';
  document.getElementById('gameContainer').style.display = 'block';
  jaxpi.started().game("Prince of JS")

  // Iniciar Juego
  const game = new Game(config);
}
