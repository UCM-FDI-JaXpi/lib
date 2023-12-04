"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStatement = exports.logStatement = void 0;
var jsonArray = require("../traces/trazas.json");
function logStatement(verbId, objectId, player) {
    var temp = jsonArray.find(callbackfun);
    function callbackfun(object) {
        if (object.verb.display["en-US"] === verbId)
            return true;
        return false;
    }
    var temp2 = temp.object.definition.name["en-US"];
    /*
    console.log(temp)
    console.log("Valor del campo definition.name = " + temp?.object.definition.name["en-US"])
    let temp2: string = temp!.object.definition.name["en-US"]
    console.log(temp2)
    */
    console.log(temp2);
    //console.log('Constructed name field:', { "en-US": temp2 });
    var constructedObject = {
        id: "http://adlnet.gov/expapi/activities/" + objectId,
        definition: {
            name: {
                "en-US": temp.object.definition.name["en-US"]
            },
            description: {
                "en-US": temp.object.definition.description["en-US"],
                "es": temp.object.definition.description["es"]
            }
        },
        objectType: "Activity"
    };
    // Log the constructed xAPI object before assignment
    console.log('Constructed xAPI object:', constructedObject);
    var statement = {
        actor: {
            id: player.id,
            name: player.name,
            account: {
                homePage: "https://example.com",
                name: player.accountId
            },
            objectType: "Agent",
        },
        verb: {
            id: temp.verb.id,
            display: {
                "en-US": temp.verb.display["en-US"]
            },
        },
        object: {
            id: "http://adlnet.gov/expapi/activities/" + objectId,
            definition: {
                name: {
                    "en-US": temp2
                },
                description: {
                    "en-US": temp.object.definition.description["en-US"],
                    "es": temp.object.definition.description["es"]
                }
            },
            objectType: "Activity"
        },
        timestamp: new Date().toISOString()
    };
    return statement;
}
exports.logStatement = logStatement;
function createStatement(verbId, objectId, player) {
    //var temp = jsonArray[0];
    /*
    jsonArray.forEach(element => {
        if (element.verb.display["en-US"] === verbId) temp = element;
    });
    */
    var temp = jsonArray.find(callbackfun);
    function callbackfun(object) {
        if (object.verb.display["en-US"] === verbId)
            return true;
        return false;
    }
    //if (temp !== undefined ){return undefined}			//En caso de un verbo que no exista
    var statement = {
        actor: {
            id: player.id,
            mbox: player.mail,
            name: player.name,
            objectType: "Agent"
        },
        verb: {
            id: temp.verb.id, //No se puede asegurar que no sea undefined
            display: {
                "en-US": temp.verb.display["en-US"]
            }
        },
        object: {
            id: "http://example.com/resource/" + objectId,
            definition: {
                name: {
                    "en-US": temp.object.definition.name["en-US"]
                },
                description: {
                    "en-US": temp.object.definition.description["en-US"],
                    "es": temp.object.definition.description["es"]
                }
            },
            objectType: "Activity"
        },
        timestamp: new Date().toISOString()
    };
    return statement;
}
exports.createStatement = createStatement;
/*
let logIn = createStatement("logIn", "server");
let clicked = createStatement("clicked", "environment");
let died = createStatement("died", "npc");
let logOut = createStatement("logout", "server");



console.log(JSON.stringify(logIn, null, 2));
var a;
console.log(a);

console.log(JSON.stringify(jsonArray[0].actor.name));


console.log(JSON.stringify(logIn, null, 2));
console.log(JSON.stringify(clicked, null, 2));
console.log(JSON.stringify(died, null, 2));
console.log(JSON.stringify(logOut, null, 2));
*/ 
