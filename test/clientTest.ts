import {Jaxpi} from '../jaxpiLib';

let jaxpi = new Jaxpi({name: "Jugador1", mail: "mail@test.com", userId:"a", sessionId:"b"},"http://localhost:3000/statements");

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

let objectString = "patata"

let verb = {
    "id": "https://github.com/UCM-FDI-JaXpi/lib/bolo",
    "display": {
        "en-us": "eres un",
        "es": "bolo"
    }
}

let mapa = new Map([["patatas",2],["coches",3]])

let test: Array<[string, any]> = [["patatas",2],["coches",true],["algo","a"]]

console.log(Array.from(mapa.entries()))
console.log(Array.from(test))
// console.log(typeof jaxpi.object)
// console.log(typeof object)
// console.log(typeof jaxpi.object.character.id)

// jaxpi.customVerbWithJson(verb, object)
jaxpi.customVerb("mirar","patata",test)
jaxpi.accepted("Rupias","3 Millones","Rupias","3 Millones","Pot",test)
// jaxpi.accepted("Rupias","3 Millones","Pot")
// jaxpi.jumped(2,"lagos", jaxpi.object.character)
// jaxpi.jumped(8000,"pulgadas",object);
// jaxpi.jumped(77, "metros", objectString)

// jaxpi.flush();

// jaxpi.accepted("Rupias2222","2222 Millones","Pot")
// jaxpi.chatted(jaxpi.object.character)
// jaxpi.cancelled(object);
// jaxpi.jumped(505050,"gurarara", jaxpi.object.character)

process.exit(0)