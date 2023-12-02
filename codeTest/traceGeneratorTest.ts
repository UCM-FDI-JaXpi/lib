
interface JaXpiTrace {
	actor: {
		mbox: string;
        name: string;
        objectType: "Agent";
	};

	verb: {
		id: string;
		display:{
			[key: string]: string;
		};
	};
	object: {};
	timestamp: string;
}

function createJaXpiTrace(
	verbId: string,
	verbDisplayEN: string,
	verbDisplayES: string
): JaXpiTrace {
	const statement: JaXpiTrace = {
		actor: {
			name: foo().name,
			mbox: foo().mail,
			objectType: "Agent",
		},
		verb: {
			id: verbId,
			display: {
				"en-US": verbDisplayEN,
				"es": verbDisplayES,
			},
		},
		object: {},
		timestamp: new Date().toString()
	};
	return statement;
}

interface Player {
    name: string;
    mail: string;
}

function foo(): Player { 
    return {
        name: "Player",
    	mail: "player@mail.com"
    };
}

const temp = createJaXpiTrace(
	"Test",
	"This is a test",
	"Esto es un test"
);

console.log(JSON.stringify(temp, null, 2));
