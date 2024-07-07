import Phaser, {Game} from 'phaser';
import BootScene from './scripts/scenes/BootScene';
import PreloadScene from './scripts/scenes/PreloadScene';
import TitleScene from './scripts/scenes/TitleScene';
import CutScene from './scripts/scenes/CutScene';
import CreditsScene from './scripts/scenes/CreditsScene';
import GameScene from './scripts/scenes/GameScene';
import EndTitleScene from './scripts/scenes/EndTitleScene';

// Axios library required to connect to the lrs
import axios from 'axios'

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
const response = await axios.post("http://localhost:3000/login", {email: "student1@example.com", password: "Pp123456"}, {
    headers: {
        'Content-Type': 'application/json',
    }
});

let token = response.data.token

// Create a new JaxpiLib instance
let jaxpi = new Jaxpi({name: "Student1", mail: "student1@example.com"},"http://localhost:3000/records", token); // Añadir Token, quitar contraseña

// Export the JaxpiLib instance
export default jaxpi;

const game = new Game(config);