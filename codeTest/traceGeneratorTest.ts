type verbInfo = {
	name: string;
	descriptionEn: string;
	descriptionEs: string;
	url?: string;
};

let defaultVerb : verbInfo = {
	name: "ERROR, VERB NOT CONTEMPLATED",
	descriptionEn: "ERROR, VERB NOT CONTEMPLATED",
	descriptionEs: "ERROR, VERB NOT CONTEMPLATED"
}

let gitVerbsMap = new Map<string,verbInfo>([
	["clicked",{name:"Interacted Object", descriptionEn: "Indicates that the actor has clicked on the object.", descriptionEs: "Indica que el actor ha hecho click en el objeto."}],
	["interacted",{name:"", descriptionEn: "", descriptionEs: ""}],
	["other",{name:"", descriptionEn: "", descriptionEs: ""}]
]);

let registryVerbsMap = new Map<string,verbInfo>([
	["login",{name:"Log in Activity", descriptionEn: "Indicates that the actor has logged in to some service.", descriptionEs: "Indica que el actor ha iniciado sesión en algún servicio.", url: "http://adlnet.gov/expapi/activities/logInActivity"}],
	["logout",{name:"Log out Activity", descriptionEn: "Indicates that the actor has logged out to some service.", descriptionEs: "Indica que el actor ha terminado sesión en algún servicio.", url: "http://adlnet.gov/expapi/activities/logOutActivity"}],
	["b",{name:"", descriptionEn: "", descriptionEs: "", url: ""}]
]);


interface logInStatementInterface {
	actor: {
		account: { 
            homePage: string;
            name: string;
        };
        name: string;
        objectType: "Agent";
	};

	verb: {
		id: "logIn";
		display:{
			[key: string]: string;
		};
	};
	object: {
		id: "http://adlnet.gov/expapi/activities/logInActivity";
        definition: {
            name: {
                "en-US": "Log in Activity";
            },
            description: {
                "en-US": "Indicates that the actor has logged in to some service.";
                "es": "Indica que el actor ha iniciado sesión en algún servicio.";
            }
        },
        objectType: "Activity";
	};
	timestamp: string;
}

function logInStatement(
): logInStatementInterface {
	const statement: logInStatementInterface = {
		actor: {
			name: playerData().name,
			account: {
				homePage: "https://example.com",
				name: playerData().id
			},
			objectType: "Agent",
		},
		verb: {
			id: "logIn",
			display: {
				"en-US": "logged in"
			},
		},
		object: {
			id: "http://adlnet.gov/expapi/activities/logInActivity",
        	definition: {
            name: {
                "en-US": "Log in Activity"
            },
            description: {
                "en-US": "Indicates that the actor has logged in to some service.",
                "es": "Indica que el actor ha iniciado sesión en algún servicio."
            }
        	},
        	objectType: "Activity"
		},
		timestamp: new Date().toString()
	};
	return statement;
}

interface statementInterface {
	
	actor: {
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

function verbDetails(verb: string) {
		if (gitVerbsMap.has(verb)) return gitVerbsMap.get(verb)!;
		else if (registryVerbsMap.has(verb)) return registryVerbsMap.get(verb)!;
		else return defaultVerb;
	}


function verbRecog(verb: string) {
	if (gitVerbsMap.has(verb)) return "https://github.com/UCM-FDI-JaXpi/" + verb;
	else if (registryVerbsMap.has(verb)) return registryVerbsMap.get(verb)!.url!;
	else return "ERROR, VERB NOT CONTEMPLATED";
}

function createStatement(
	verbId: string,
	objectId: string
	): statementInterface {
		const statement: statementInterface = {
			actor: {
				mbox: playerData().mail,
				name: playerData().name,
				objectType: "Agent"
			},
		
			verb: {
				id: verbRecog(verbId),
				display: {
					"en-US": verbId
				}
			},
		
			object: {
				id: "http://example.com/resource/" + objectId,
				definition: {
					name: {
						"en-US": verbDetails(verbId).name 
					},
					description: {
						"en-US": verbDetails(verbId).descriptionEn, 
						"es": verbDetails(verbId).descriptionEs
					}
				},
				objectType: "Activity"
			},
			timestamp: new Date().toString()
		};
		return statement;
	}

interface Player {
    name: string;
    mail: string;
	id: string;
}

function playerData(): Player { 
    return {
        name: "Player",
    	mail: "mailto:player@mail.com",
		id: "nameAccount"
    };
}

let logIn = createStatement("login", "server");
let clicked = createStatement("clicked", "environment");
let died = createStatement("died", "npc");
let logOut = createStatement("logout", "server");

console.log(JSON.stringify(logIn, null, 2));
console.log(JSON.stringify(clicked, null, 2));
console.log(JSON.stringify(died, null, 2));
console.log(JSON.stringify(logOut, null, 2));
