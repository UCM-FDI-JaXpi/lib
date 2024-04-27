// Import JaxpiLib
import Jaxpi from '../src/index.js'

let statements = [
  {
    "actor": {
      "mbox": "mailto:student1@example.com",
      "name": "Student1"
    },
    "verb": {
      "id": "https://github.com/UCM-FDI-JaXpi/lib/jumped",
      "display": {
        "en-US": "jumped",
        "es": "saltado"
      }
    },
    "object": {
      "id": "http://example.com/character",
      "definition": {
        "type": "https://github.com/UCM-FDI-JaXpi/object",
        "name": {
          "en-US": "Default character",
          "es": "Personaje por defecto",
          "en-us": "Ike"
        },
        "description": {
          "en-US": "A persona or figure in the game",
          "es": "Una persona o figura en el juego"
        },
        "extensions": {
          "https://github.com/UCM-FDI-JaXpi/distance": 1,
          "https://github.com/UCM-FDI-JaXpi/units": "1"
        }
      }
    },
    "timestamp": "2024-04-27T19:01:12.468Z",
    "context": {
      "instructor": {
        "name": "Maria",
        "mbox": "mailto:mmaria@bro.com"
      },
      "contextActivities": {
        "parent": {
          "id": "http://example.com/activities/class_A"
        },
        "grouping": {
          "id": "http://example.com/activities/UCM"
        }
      },
      "extensions": {
        "http://example.com/activities/patatas": 2,
        "http://example.com/activities/coches": true,
        "http://example.com/activities/algo": "a"
      }
    }
  }
  ,
  {
    "actor": {
      "mbox": "mailto:student1@example.com",
      "name": "Student1"
    },
    "verb": {
      "id": "https://github.com/UCM-FDI-JaXpi/lib/jumped",
      "display": {
        "en-US": "jumped",
        "es": "saltado"
      }
    },
    "object": {
      "id": "http://example.com/character",
      "definition": {
        "type": "https://github.com/UCM-FDI-JaXpi/object",
        "name": {
          "en-US": "Default character",
          "es": "Personaje por defecto",
          "en-us": "Ike"
        },
        "description": {
          "en-US": "A persona or figure in the game",
          "es": "Una persona o figura en el juego"
        },
        "extensions": {
          "https://github.com/UCM-FDI-JaXpi/distance": 1,
          "https://github.com/UCM-FDI-JaXpi/units": "1"
        }
      }
    },
    "timestamp": "2024-04-27T19:01:12.495Z",
    "context": {
      "instructor": {
        "name": "Maria",
        "mbox": "mailto:mmaria@bro.com"
      },
      "contextActivities": {
        "parent": {
          "id": "http://example.com/activities/class_A"
        },
        "grouping": {
          "id": "http://example.com/activities/UCM"
        }
      },
      "extensions": {
        "http://example.com/activities/patatas": 2,
        "http://example.com/activities/coches": true,
        "http://example.com/activities/algo": "a"
      }
    }
  }
  ,
  {
    "actor": {
      "mbox": "mailto:student1@example.com",
      "name": "Student1"
    },
    "verb": {
      "id": "https://github.com/UCM-FDI-JaXpi/lib/jumped",
      "display": {
        "en-US": "jumped",
        "es": "saltado"
      }
    },
    "object": {
      "id": "http://example.com/character",
      "definition": {
        "type": "https://github.com/UCM-FDI-JaXpi/object",
        "name": {
          "en-US": "Default character",
          "es": "Personaje por defecto",
          "en-us": "Ike"
        },
        "description": {
          "en-US": "A persona or figure in the game",
          "es": "Una persona o figura en el juego"
        },
        "extensions": {
          "https://github.com/UCM-FDI-JaXpi/distance": 1,
          "https://github.com/UCM-FDI-JaXpi/units": "1"
        }
      }
    },
    "timestamp": "2024-04-27T19:01:12.503Z",
    "context": {
      "instructor": {
        "name": "Maria",
        "mbox": "mailto:mmaria@bro.com"
      },
      "contextActivities": {
        "parent": {
          "id": "http://example.com/activities/class_A"
        },
        "grouping": {
          "id": "http://example.com/activities/UCM"
        }
      },
      "extensions": {
        "http://example.com/activities/patatas": 2,
        "http://example.com/activities/coches": true,
        "http://example.com/activities/algo": "a"
      }
    }
  }
  ,


  {
    "actor": {
      "mbox": "mailto:student3@example.com",
      "name": "Student3"
    },
    "verb": {
      "id": "https://github.com/UCM-FDI-JaXpi/lib/jumped",
      "display": {
        "en-US": "jumped",
        "es": "saltado"
      }
    },
    "object": {
      "id": "http://example.com/character",
      "definition": {
        "type": "https://github.com/UCM-FDI-JaXpi/object",
        "name": {
          "en-US": "Default character",
          "es": "Personaje por defecto",
          "en-us": "Luigi"
        },
        "description": {
          "en-US": "A persona or figure in the game",
          "es": "Una persona o figura en el juego"
        },
        "extensions": {
          "https://github.com/UCM-FDI-JaXpi/distance": 1,
          "https://github.com/UCM-FDI-JaXpi/units": "1"
        }
      }
    },
    "timestamp": "2024-04-27T19:01:12.513Z"
  }
  ,
  {
    "actor": {
      "mbox": "mailto:student3@example.com",
      "name": "Student3"
    },
    "verb": {
      "id": "https://github.com/UCM-FDI-JaXpi/lib/jumped",
      "display": {
        "en-US": "jumped",
        "es": "saltado"
      }
    },
    "object": {
      "id": "http://example.com/character",
      "definition": {
        "type": "https://github.com/UCM-FDI-JaXpi/object",
        "name": {
          "en-US": "Default character",
          "es": "Personaje por defecto",
          "en-us": "Luigi"
        },
        "description": {
          "en-US": "A persona or figure in the game",
          "es": "Una persona o figura en el juego"
        },
        "extensions": {
          "https://github.com/UCM-FDI-JaXpi/distance": 1,
          "https://github.com/UCM-FDI-JaXpi/units": "1"
        }
      }
    },
    "timestamp": "2024-04-27T19:01:12.533Z"
  }
  ,


  {
    "actor": {
      "mbox": "mailto:student2@example.com",
      "name": "Student2"
    },
    "verb": {
      "id": "https://github.com/UCM-FDI-JaXpi/lib/jumped",
      "display": {
        "en-US": "jumped",
        "es": "saltado"
      }
    },
    "object": {
      "id": "http://example.com/character",
      "definition": {
        "type": "https://github.com/UCM-FDI-JaXpi/object",
        "name": {
          "en-US": "Default character",
          "es": "Personaje por defecto",
          "en-us": "Tristana"
        },
        "description": {
          "en-US": "A persona or figure in the game",
          "es": "Una persona o figura en el juego"
        },
        "extensions": {
          "https://github.com/UCM-FDI-JaXpi/distance": 1,
          "https://github.com/UCM-FDI-JaXpi/units": "1"
        }
      }
    },
    "timestamp": "2024-04-27T19:01:12.542Z"
  }
]

// Create a new JaxpiLib instance
let jaxpi = new Jaxpi({name: "Student1", mail: "student1@example.com", password: "Pp123456"},"http://localhost:3000/records", "http://localhost:3000/login", undefined, 40);


jaxpi.setContext("Maria","mmaria@bro.com","class_A","UCM",[["patatas",2],["coches",true],["algo","a"]])


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
function random(min, max){
  return Math.random() * (max - min + 1) + min;
}

async function foo(){
    await delay(2000)

    //jaxpi.loggedIn().player("Student1")
    for (let k = 0; k < 8; k++)
    for(let j = 0; j < random(0,5); j++){
      jaxpi.jumped(1,"1").character("Ike")
    }
    //jaxpi.loggedOut().player("Student1")

    await delay(2000)
    jaxpi.writeExample()

    jaxpi = new Jaxpi({name: "Student3", mail: "student3@example.com", password: "Pp123456"},"http://localhost:3000/records", "http://localhost:3000/login", undefined, 40);
    
    await delay(2000)
    
    //jaxpi.loggedIn().player("maria")
    for (let k = 0; k < 8; k++)
    for(let j = 0; j < random(0,5); j++){
      jaxpi.jumped(1,"1").character("Luigi")
    }
    //jaxpi.loggedOut().player("maria")
    
    await delay(2000)
    jaxpi.writeExample()


    jaxpi = new Jaxpi({name: "Student2", mail: "student2@example.com", password: "Pp123456"},"http://localhost:3000/records", "http://localhost:3000/login", undefined, 40);
    
    await delay(2000)
    
    //jaxpi.loggedIn().player("Student2")
    for (let k = 0; k < 8; k++)
    for(let j = 0; j < random(0,5); j++){
      jaxpi.jumped(1,"1").character("Tristana")
    }
    //jaxpi.loggedOut().player("Student2")

    await delay(2000)
    jaxpi.writeExample()


}
  
async function executeActionsWithDelay() {
    await foo();

    //jaxpi.flush();

    // jaxpi.set_lrs(true)
    // jaxpi.accepted().achievement("a1")
    // jaxpi.flush()
}
  
executeActionsWithDelay();

//process.exit(0)