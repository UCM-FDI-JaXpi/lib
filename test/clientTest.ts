import {Jaxpi} from '../jaxpiLib';

let jaxpi = new Jaxpi({name: "Jugador1", mail: "mail@test.com", userId:"a", sessionId:"b"},"http://localhost:3000/statements");
//jaxpi.achieved();
jaxpi.jumped(8000,"pulgadas");


// Actor.jump(Keybind(space)){
//     code jump
//     jaxpi.jump(actor.height,...)
// }


