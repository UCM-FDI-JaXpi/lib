import * as jsonArray from "../traces/trazas.json"

interface logStatementInterface {
	actor: {
		id: string;
		account: { 
            homePage: string;
            name: string;
        };
        name: string;
        objectType: "Agent";
	};

	verb: {
		id: string;
		display:{
			[key: string]: string;
		};
	};
	object: {
		id: string;
        definition: {
            name: {
                [key: string]: string;
            },
            description: {
                [key: string]: string;
            }
        },
        objectType: "Activity";
	};
	timestamp: string;
}

export function logStatement(
	verbId: string,
	objectId: string,
	player: Player
): logStatementInterface | undefined {

	let temp = jsonArray.find(callbackfun);
	function callbackfun(object): boolean{
		if (object.verb.display["en-US"] === verbId) return true;
		return false;
	}

	if (temp === undefined) return undefined;
	
	const statement: logStatementInterface = {
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
			id: temp!.verb.id,
			display: {
				"en-US": temp!.verb.display["en-US"]
			},
		},
		object: {
			id: "http://adlnet.gov/expapi/activities/" + objectId,
        	definition: {
				name: {
					"en-US": temp!.object.definition.name["en-US"]
				},
				description: {
					"en-US": temp!.object.definition.description["en-US"],
					"es": temp!.object.definition.description["es"]
				}
        	},
        	objectType: "Activity"
		},
		timestamp: new Date().toISOString()
	};
	return statement;
}

interface statementInterface {
	
	actor: {
		id: string;
		mbox: string;
		name: string;
		objectType: string;
	},

	verb: {
		id: string;
		display: {
			[key: string]: string;
		}
	},

	object: {
		id: string;
		definition: {
			name: {
				[key: string]: string;
			},
			description: {
				[key: string]: string;
			}
		},
		objectType: "Activity"
	}
	
	timestamp: string;
}

export function createStatement(
	verbId: string,
	objectId: string,
	player: Player
	): statementInterface | undefined {

		//var temp = jsonArray[0];

		/*
		jsonArray.forEach(element => {
			if (element.verb.display["en-US"] === verbId) temp = element;
		});
		*/
		let temp = jsonArray.find(callbackfun);
		function callbackfun(object): boolean{
			if (object.verb.display["en-US"] === verbId) return true;
			return false;
		}

		//if (temp !== undefined ){return undefined}			//En caso de un verbo que no exista
		if (temp === undefined) return undefined;

		const statement: statementInterface = {
			actor: {
				id: player.id,
				mbox: player.mail,
				name: player.name,
				objectType: "Agent"
			},
		
			verb: {
				id: temp!.verb.id,								//No se puede asegurar que no sea undefined
				display: {
					"en-US": temp!.verb.display["en-US"]
				}
			},
		
			object: {
				id: "http://example.com/resource/" + objectId,
				definition: {
					name: {
						"en-US": temp!.object.definition.name["en-US"]
					},
					description: {
						"en-US": temp!.object.definition.description["en-US"], 
						"es": temp!.object.definition.description["es"]
					}
				},
				objectType: "Activity"
			},
			timestamp: new Date().toISOString()
		};
		return statement;
	}

export interface Player {
    name: string;
    mail: string;
	id: string;
	accountId: string;
}

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