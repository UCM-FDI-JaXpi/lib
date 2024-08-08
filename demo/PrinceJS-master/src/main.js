import Phaser, {Game} from 'phaser';
import BootScene from './scripts/scenes/BootScene';
import PreloadScene from './scripts/scenes/PreloadScene';
import TitleScene from './scripts/scenes/TitleScene';
import CutScene from './scripts/scenes/CutScene';
import CreditsScene from './scripts/scenes/CreditsScene';
import GameScene from './scripts/scenes/GameScene';
import EndTitleScene from './scripts/scenes/EndTitleScene';

// Axios library required to connect to the lrs
//import axios from 'axios'

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


// Dev authenticates with the lrs, the lrs give him a token
// Axios require the library axios to work, it can be done with similar libraries
// const response = await axios.post("http://localhost:3000/login", {email: "student1@example.com", password: "Pp123456"}, {
//     headers: {
//         'Content-Type': 'application/json',
//     }
// });


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
      //localStorage.setItem("jaxpi", playerKey)
      //localStorage.clear()
      jaxpi.setKey(playerKey)
      startGame()
    }
  }
});

document.getElementById('playWithoutKey').addEventListener('click', async () => {
  startGame()
});


//let token = response.data.token
let token = "cEPTx-GsXov-dJBXe-pY7jc-NPyQ8";


// Create a new JaxpiLib instance
let jaxpi = new Jaxpi({name: "Super Mario", mail: "student1@example.com"},"http://localhost:3000/records", token); // Añadir Token, quitar contraseña

// Export the JaxpiLib instance
export default jaxpi;

function startGame(){
  // Ocultar el menú y mostrar el contenedor del juego
  document.getElementById('menu').style.display = 'none';
  document.getElementById('gameContainer').style.display = 'block';

  // Iniciar Juego
  const game = new Game(config);
}
