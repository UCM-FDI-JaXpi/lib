import {Jaxpi} from '../jaxpiLib';

let jaxpi = new Jaxpi({name: "maria", mail: "mailto:maria@gmail.com", userId:"a", sessionId:"hang-gliding-class-a"},"http://localhost:3000/records", false);

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

let verb = {
    "id": "https://github.com/UCM-FDI-JaXpi/lib/bolo",
    "display": {
        "en-us": "eres un",
        "es": "bolo"
    }
}

let wrongObject = {
    "id": "https://github.com/UCM-FDI-JaXpi/lib/bolo",
    "display": {
        "en-us": "eres un",
        "es": "bolo"
    }
}

let wrongVerb = {
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


let mapa = new Map([["patatas",2],["coches",3]])

let extraParameters: Array<[string, any]> = [["patatas",2],["coches",true],["algo","a"]]


jaxpi.setContext("Maria","mmaria@bro.com","class_A","UCM",[["patatas",2],["coches",true],["algo","a"]])

//jaxpi.startStatementInterval(5)
//jaxpi.stopStatementInterval()


/*jaxpi.accepted().award("patata")
jaxpi.accessed(0).door("Door 1")
jaxpi.exited().game("Super Mario")
jaxpi.discovered().location("Paleta Town")
jaxpi.died() //Deberia no devolver nada sin un objeto anidado
jaxpi.customVerb(jaxpi.verbs.cancelled, jaxpi.objects.character) //Se pueden cambiar los parametros a string y añadir un campo mas para extensions
jaxpi.customVerb(verb, object, extraParameters)
jaxpi.customVerb("verb", "object")

jaxpi.customVerb(wrongVerb,wrongObject) // Deberia fallar dando un warning por mala estructura
*/


function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
async function executeActionsWithDelay() {
    await delay(2000);
    jaxpi.started().level("Level 1");

    await delay(3000);
    jaxpi.exited().level("Level 1");

    await delay(2000);
    jaxpi.loaded("Guardado 1").level("Level 1");

    await delay(2100);
    jaxpi.exited().level("Level 1");

    await delay(4000);
    jaxpi.loaded("Guardado 1").level("Level 1");

    await delay(5000);
    jaxpi.completed(90).level("Level 1");
    jaxpi.started().level("Level 2");

    await delay(2000);
    jaxpi.jumped(20, "meters").enemy("Enemy 1");
    jaxpi.completed(98).level("Level 2");

    await delay(5000);
    jaxpi.started().level("Level 1");

    await delay(5000);
    jaxpi.started().level("Level 1");

    await delay(2000);
    jaxpi.completed(100).level("Level 1");

    jaxpi.flush();

    // jaxpi.set_lrs(true)
    // jaxpi.accepted().achievement("a1")
    // jaxpi.flush()
}
  
executeActionsWithDelay();

//process.exit(0)