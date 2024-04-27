import axios from 'axios'
let statements = [
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
        "en-US": "Tristana",
        "es": "Personaje por defecto"
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
  "timestamp": "2024-04-27T21:11:49.092Z"
},
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
        "en-US": "Tristana",
        "es": "Personaje por defecto"
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
  "timestamp": "2024-04-27T21:11:49.138Z"
},
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
        "en-US": "Tristana",
        "es": "Personaje por defecto"
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
  "timestamp": "2024-04-27T21:11:49.141Z"
},
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
        "en-US": "Tristana",
        "es": "Personaje por defecto"
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
  "timestamp": "2024-04-27T21:11:49.144Z"
},
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
        "en-US": "Tristana",
        "es": "Personaje por defecto"
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
  "timestamp": "2024-04-27T21:11:49.147Z"
},
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
        "en-US": "Tristana",
        "es": "Personaje por defecto"
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
  "timestamp": "2024-04-27T21:11:49.149Z"
},
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
        "en-US": "Tristana",
        "es": "Personaje por defecto"
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
  "timestamp": "2024-04-27T21:11:49.152Z"
},
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
        "en-US": "Tristana",
        "es": "Personaje por defecto"
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
  "timestamp": "2024-04-27T21:11:49.156Z"
},
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
        "en-US": "Tristana",
        "es": "Personaje por defecto"
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
  "timestamp": "2024-04-27T21:11:49.159Z"
},
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
        "en-US": "Tristana",
        "es": "Personaje por defecto"
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
  "timestamp": "2024-04-27T21:11:49.162Z"
},
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
        "en-US": "Tristana",
        "es": "Personaje por defecto"
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
  "timestamp": "2024-04-27T21:11:49.165Z"
},
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
        "en-US": "Tristana",
        "es": "Personaje por defecto"
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
  "timestamp": "2024-04-27T21:11:49.168Z"
},
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
        "en-US": "Tristana",
        "es": "Personaje por defecto"
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
  "timestamp": "2024-04-27T21:11:49.171Z"
},
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
        "en-US": "Tristana",
        "es": "Personaje por defecto"
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
  "timestamp": "2024-04-27T21:11:49.174Z"
},
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
        "en-US": "Tristana",
        "es": "Personaje por defecto"
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
  "timestamp": "2024-04-27T21:11:49.176Z"
},
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
        "en-US": "Tristana",
        "es": "Personaje por defecto"
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
  "timestamp": "2024-04-27T21:11:49.179Z"
},
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
        "en-US": "Tristana",
        "es": "Personaje por defecto"
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
  "timestamp": "2024-04-27T21:11:49.182Z"
},
]

//console.log(statements.length)

// Número de grupos a crear
// Dividir el array en 7 grupos
const grupos = [];
let i = 0;
const tamGrupo = Math.ceil(statements.length / 7);
for (let i = 0; i < statements.length; i += tamGrupo) {
    grupos.push(statements.slice(i, i + tamGrupo));
}

// Iterar sobre cada grupo y asignar un nuevo valor de timestamp
let nuevoTimestamp = 0;
grupos.forEach((grupo) => {
    const incremento = Math.random() * 1000; // Incremento aleatorio para hacer los grupos diferentes
    grupo.forEach((traza) => {
        traza.timestamp = `2024-04-${17 + i}T${19 + Math.round(Math.random() * (3 - (-7)) + (-7))}:30:12.927Z`;
    });
    nuevoTimestamp += incremento;
    i++;
});

//statements.sort((a, b) => a.timestamp - b.timestamp);

// statements.forEach(element => {
//   console.log(element.timestamp)
// });

async function foo(){
  const response = await axios.post("http://localhost:3000/login", {email: "student2@example.com", password: "Pp123456"}, {
    headers: {
        'Content-Type': 'application/json',
    }
  });
  
  statements.forEach(async element => {
    await axios.post("http://localhost:3000/records", element, {
      headers: {
          'Content-Type': 'application/json',
          'x-authentication': response.data.token
      }
  });
  });
}

foo();
console.log("Student2")
//console.log(JSON.stringify(statements,null,2));