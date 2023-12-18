import {Jaxpi} from './JaxpiLib';

let jaxpi = new Jaxpi({name: "Jugador1", mail: "mail@test.com", userId:"a", sessionId:"b"},"http://localhost:3000/traza-jaxpi");
jaxpi.achieved();