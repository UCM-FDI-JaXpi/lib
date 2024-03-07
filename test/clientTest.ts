import {Jaxpi} from '../jaxpiLib';

let jaxpi = new Jaxpi({name: "Jugador1", mail: "mail@test.com", userId:"a", sessionId:"b"},"http://localhost:3000/statements");
//jaxpi.achieved();
let object = {
    "id": "http://example.com/Mario",
    "definition": {
        "type": "Playable character",
        "name": {
            "en-US": "Coprotagonist of the game"
        },
        "description": {
            "en-US": "Mario jumped",
            "es": "Mario ha saltado"
        },
        "extensions": {
            "https://github.com/UCM-FDI-JaXpi/jumped_distance": 5,
            "https://github.com/UCM-FDI-JaXpi/jumped_units": "meters",
            "https://github.com/UCM-FDI-JaXpi/attacked_damage": 15
        }
    }
}
jaxpi.jumped(8000,"pulgadas",object);
jaxpi.flush();



// Actor.jump(Keybind(space)){
//     code jump
//     jaxpi.jump(actor.height,...)
// }


