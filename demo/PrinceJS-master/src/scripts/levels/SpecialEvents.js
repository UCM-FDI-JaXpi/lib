import GameState from "../ui/GameState";
import { TILE } from '../Constants';
import jaxpi from "../../main";

class SpecialEvents {

    constructor(scene) {
        this.scene = scene;
    }

    levelStart() {

        switch (GameState.currentLevel) {

            case 1:
                //console.log(localStorage.getItem("jaxpi"))
                jaxpi.started().level("level 1")

                this.scene.kid.charX -= 7;
                this.scene.level.fireEvent(8, TILE.DROP_BUTTON);
                this.scene.kid.specialLand = true;
                break;

        }

    }
    
}

export default SpecialEvents;