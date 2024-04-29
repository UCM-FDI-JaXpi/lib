import axios from 'axios'
let statements = [
{
  "actor": {
    "mbox": "mailto:student1@example.com",
    "name": "Student1"
  },
  "verb": {
    "id": "https://github.com/UCM-FDI-JaXpi/lib/loggedIn",
    "display": {
      "en-US": "loggedIn",
      "es": "conectado"
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
  "timestamp": "2024-04-29T15:30:41.804Z",
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
        "en-US": "Bro",
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
  "timestamp": "2024-04-29T15:30:41.862Z",
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
        "en-US": "Bro",
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
  "timestamp": "2024-04-29T15:30:41.867Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/accepted",
    "display": {
      "en-US": "accepted",
      "es": "aceptado"
    }
  },
  "object": {
    "id": "http://example.com/missions/mission",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Defeat the East Europan Imperial Alliance Army",
        "es": "Misión por defecto"
      },
      "description": {
        "en-US": "A specific task or objective",
        "es": "Una tarea u objetivo específico"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-29T15:30:41.873Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/accepted",
    "display": {
      "en-US": "accepted",
      "es": "aceptado"
    }
  },
  "object": {
    "id": "http://example.com/missions/mission",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Defeat the East Europan Imperial Alliance Army",
        "es": "Misión por defecto"
      },
      "description": {
        "en-US": "A specific task or objective",
        "es": "Una tarea u objetivo específico"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-29T15:30:41.877Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/accepted",
    "display": {
      "en-US": "accepted",
      "es": "aceptado"
    }
  },
  "object": {
    "id": "http://example.com/missions/mission",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Defeat the East Europan Imperial Alliance Army",
        "es": "Misión por defecto"
      },
      "description": {
        "en-US": "A specific task or objective",
        "es": "Una tarea u objetivo específico"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-29T15:30:41.882Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/accepted",
    "display": {
      "en-US": "accepted",
      "es": "aceptado"
    }
  },
  "object": {
    "id": "http://example.com/missions/mission",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Defeat the East Europan Imperial Alliance Army",
        "es": "Misión por defecto"
      },
      "description": {
        "en-US": "A specific task or objective",
        "es": "Una tarea u objetivo específico"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-29T15:30:41.886Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/accepted",
    "display": {
      "en-US": "accepted",
      "es": "aceptado"
    }
  },
  "object": {
    "id": "http://example.com/missions/mission",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Defeat the East Europan Imperial Alliance Army",
        "es": "Misión por defecto"
      },
      "description": {
        "en-US": "A specific task or objective",
        "es": "Una tarea u objetivo específico"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-29T15:30:41.891Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/destroyed",
    "display": {
      "en-US": "destroyed",
      "es": "destruido"
    }
  },
  "object": {
    "id": "http://example.com/achievements/item",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Luna +3",
        "es": "Objeto por defecto"
      },
      "description": {
        "en-US": "An object or thing of value, often collectible or usable in the game",
        "es": "Un objeto o cosa de valor, a menudo coleccionable o utilizable en el juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-29T15:30:41.896Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/destroyed",
    "display": {
      "en-US": "destroyed",
      "es": "destruido"
    }
  },
  "object": {
    "id": "http://example.com/achievements/item",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Luna +3",
        "es": "Objeto por defecto"
      },
      "description": {
        "en-US": "An object or thing of value, often collectible or usable in the game",
        "es": "Un objeto o cosa de valor, a menudo coleccionable o utilizable en el juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-29T15:30:41.900Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/destroyed",
    "display": {
      "en-US": "destroyed",
      "es": "destruido"
    }
  },
  "object": {
    "id": "http://example.com/achievements/item",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Luna +3",
        "es": "Objeto por defecto"
      },
      "description": {
        "en-US": "An object or thing of value, often collectible or usable in the game",
        "es": "Un objeto o cosa de valor, a menudo coleccionable o utilizable en el juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-29T15:30:41.905Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/destroyed",
    "display": {
      "en-US": "destroyed",
      "es": "destruido"
    }
  },
  "object": {
    "id": "http://example.com/achievements/item",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Luna +3",
        "es": "Objeto por defecto"
      },
      "description": {
        "en-US": "An object or thing of value, often collectible or usable in the game",
        "es": "Un objeto o cosa de valor, a menudo coleccionable o utilizable en el juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-29T15:30:41.910Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/destroyed",
    "display": {
      "en-US": "destroyed",
      "es": "destruido"
    }
  },
  "object": {
    "id": "http://example.com/achievements/item",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Luna +3",
        "es": "Objeto por defecto"
      },
      "description": {
        "en-US": "An object or thing of value, often collectible or usable in the game",
        "es": "Un objeto o cosa de valor, a menudo coleccionable o utilizable en el juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-29T15:30:41.915Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/used",
    "display": {
      "en-US": "used",
      "es": "utilizado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/item",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Phoenix Feather",
        "es": "Objeto por defecto"
      },
      "description": {
        "en-US": "An object or thing of value, often collectible or usable in the game",
        "es": "Un objeto o cosa de valor, a menudo coleccionable o utilizable en el juego"
      },
      "extensions": {
        "https://github.com/UCM-FDI-JaXpi/consumed": true
      }
    }
  },
  "timestamp": "2024-04-29T15:30:41.919Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/used",
    "display": {
      "en-US": "used",
      "es": "utilizado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/item",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Phoenix Feather",
        "es": "Objeto por defecto"
      },
      "description": {
        "en-US": "An object or thing of value, often collectible or usable in the game",
        "es": "Un objeto o cosa de valor, a menudo coleccionable o utilizable en el juego"
      },
      "extensions": {
        "https://github.com/UCM-FDI-JaXpi/consumed": true
      }
    }
  },
  "timestamp": "2024-04-29T15:30:41.924Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/used",
    "display": {
      "en-US": "used",
      "es": "utilizado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/item",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Phoenix Feather",
        "es": "Objeto por defecto"
      },
      "description": {
        "en-US": "An object or thing of value, often collectible or usable in the game",
        "es": "Un objeto o cosa de valor, a menudo coleccionable o utilizable en el juego"
      },
      "extensions": {
        "https://github.com/UCM-FDI-JaXpi/consumed": true
      }
    }
  },
  "timestamp": "2024-04-29T15:30:41.928Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/used",
    "display": {
      "en-US": "used",
      "es": "utilizado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/item",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Phoenix Feather",
        "es": "Objeto por defecto"
      },
      "description": {
        "en-US": "An object or thing of value, often collectible or usable in the game",
        "es": "Un objeto o cosa de valor, a menudo coleccionable o utilizable en el juego"
      },
      "extensions": {
        "https://github.com/UCM-FDI-JaXpi/consumed": true
      }
    }
  },
  "timestamp": "2024-04-29T15:30:41.932Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/used",
    "display": {
      "en-US": "used",
      "es": "utilizado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/item",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Phoenix Feather",
        "es": "Objeto por defecto"
      },
      "description": {
        "en-US": "An object or thing of value, often collectible or usable in the game",
        "es": "Un objeto o cosa de valor, a menudo coleccionable o utilizable en el juego"
      },
      "extensions": {
        "https://github.com/UCM-FDI-JaXpi/consumed": true
      }
    }
  },
  "timestamp": "2024-04-29T15:30:41.937Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/unlocked",
    "display": {
      "en-US": "unlocked",
      "es": "desbloqueado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/skill",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Soul Lance",
        "es": "Habilidad por defecto"
      },
      "description": {
        "en-US": "A player's capability or expertise in executing particular actions, or a distinct move they can use in combat that either enhances their combat abilities or unlocks advancements in the game",
        "es": "La capacidad o experiencia de un jugador para ejecutar acciones particulares, o un movimiento distinto que puede usar en combate y que mejora sus habilidades de combate o desbloquea avances en el juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-29T15:30:41.942Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/unlocked",
    "display": {
      "en-US": "unlocked",
      "es": "desbloqueado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/skill",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Soul Lance",
        "es": "Habilidad por defecto"
      },
      "description": {
        "en-US": "A player's capability or expertise in executing particular actions, or a distinct move they can use in combat that either enhances their combat abilities or unlocks advancements in the game",
        "es": "La capacidad o experiencia de un jugador para ejecutar acciones particulares, o un movimiento distinto que puede usar en combate y que mejora sus habilidades de combate o desbloquea avances en el juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-29T15:30:41.946Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/unlocked",
    "display": {
      "en-US": "unlocked",
      "es": "desbloqueado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/skill",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Soul Lance",
        "es": "Habilidad por defecto"
      },
      "description": {
        "en-US": "A player's capability or expertise in executing particular actions, or a distinct move they can use in combat that either enhances their combat abilities or unlocks advancements in the game",
        "es": "La capacidad o experiencia de un jugador para ejecutar acciones particulares, o un movimiento distinto que puede usar en combate y que mejora sus habilidades de combate o desbloquea avances en el juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-29T15:30:41.950Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/unlocked",
    "display": {
      "en-US": "unlocked",
      "es": "desbloqueado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/skill",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "Soul Lance",
        "es": "Habilidad por defecto"
      },
      "description": {
        "en-US": "A player's capability or expertise in executing particular actions, or a distinct move they can use in combat that either enhances their combat abilities or unlocks advancements in the game",
        "es": "La capacidad o experiencia de un jugador para ejecutar acciones particulares, o un movimiento distinto que puede usar en combate y que mejora sus habilidades de combate o desbloquea avances en el juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-29T15:30:41.955Z",
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
        "en-US": "Rainbow Road",
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
  "timestamp": "2024-04-29T15:30:41.960Z",
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
        "en-US": "Rainbow Road",
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
  "timestamp": "2024-04-29T15:30:41.966Z",
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
        "en-US": "Rainbow Road",
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
  "timestamp": "2024-04-29T15:30:41.970Z",
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
        "en-US": "Rainbow Road",
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
  "timestamp": "2024-04-29T15:30:41.975Z",
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
  "timestamp": "2024-04-29T15:30:41.980Z",
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