import axios from 'axios'
let statements = [
{
  "actor": {
    "mbox": "mailto:student1@example.com",
    "name": "Student1"
  },
  "verb": {
    "id": "https://github.com/UCM-FDI-JaXpi/lib/completed",
    "display": {
      "en-US": "completed",
      "es": "completado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 16",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {
        "https://github.com/UCM-FDI-JaXpi/score": 1
      }
    }
  },
  "timestamp": "2024-04-29T15:34:10.511Z",
  "context": {
    "instructor": {
      "name": "Teacher1",
      "mbox": "mailto:teacher1@example.com"
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
},
{
  "actor": {
    "mbox": "mailto:student1@example.com",
    "name": "Student1"
  },
  "verb": {
    "id": "https://github.com/UCM-FDI-JaXpi/lib/completed",
    "display": {
      "en-US": "completed",
      "es": "completado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 16",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {
        "https://github.com/UCM-FDI-JaXpi/score": 1
      }
    }
  },
  "timestamp": "2024-04-29T15:34:10.513Z",
  "context": {
    "instructor": {
      "name": "Teacher1",
      "mbox": "mailto:teacher1@example.com"
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
},
{
  "actor": {
    "mbox": "mailto:student1@example.com",
    "name": "Student1"
  },
  "verb": {
    "id": "https://github.com/UCM-FDI-JaXpi/lib/completed",
    "display": {
      "en-US": "completed",
      "es": "completado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 16",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {
        "https://github.com/UCM-FDI-JaXpi/score": 1
      }
    }
  },
  "timestamp": "2024-04-29T15:34:10.516Z",
  "context": {
    "instructor": {
      "name": "Teacher1",
      "mbox": "mailto:teacher1@example.com"
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
},
{
  "actor": {
    "mbox": "mailto:student1@example.com",
    "name": "Student1"
  },
  "verb": {
    "id": "https://github.com/UCM-FDI-JaXpi/lib/loggedOut",
    "display": {
      "en-US": "loggedOut",
      "es": "desconectado"
    }
  },
  "object": {
    "id": "https://github.com/UCM-FDI-JaXpi/objects/player",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Student1",
        "es": "Jugador que usa Jaxpi"
      },
      "description": {
        "en-US": "Player that connects to the server in wich the statement will be analized",
        "es": "Jugador que se conecta al servidor cuyas trazas seran analizadas"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-29T15:34:10.519Z",
  "context": {
    "instructor": {
      "name": "Teacher1",
      "mbox": "mailto:teacher1@example.com"
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
  const response = await axios.post("http://localhost:3000/login", {email: "student1@example.com", password: "Pp123456"}, {
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
//console.log(JSON.stringify(statements,null,2));