import axios from 'axios'
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
  "timestamp": "2024-04-27T21:12:07.422Z",
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
  "timestamp": "2024-04-27T21:12:07.472Z",
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
  "timestamp": "2024-04-27T21:12:07.475Z",
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
  "timestamp": "2024-04-27T21:12:07.477Z",
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
  "timestamp": "2024-04-27T21:12:07.480Z",
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
  "timestamp": "2024-04-27T21:12:07.483Z",
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
  "timestamp": "2024-04-27T21:12:07.486Z",
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
  "timestamp": "2024-04-27T21:12:07.489Z",
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
  "timestamp": "2024-04-27T21:12:07.492Z",
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
  "timestamp": "2024-04-27T21:12:07.495Z",
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
  "timestamp": "2024-04-27T21:12:07.498Z",
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
  "timestamp": "2024-04-27T21:12:07.501Z",
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
  "timestamp": "2024-04-27T21:12:07.503Z",
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
  "timestamp": "2024-04-27T21:12:07.506Z",
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
  "timestamp": "2024-04-27T21:12:07.508Z",
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
  "timestamp": "2024-04-27T21:12:07.510Z",
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
  "timestamp": "2024-04-27T21:12:07.513Z",
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
  "timestamp": "2024-04-27T21:12:07.517Z",
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
  "timestamp": "2024-04-27T21:12:07.519Z",
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
  "timestamp": "2024-04-27T21:12:07.522Z",
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
  "timestamp": "2024-04-27T21:12:07.524Z",
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
  "timestamp": "2024-04-27T21:12:07.527Z",
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
  "timestamp": "2024-04-27T21:12:07.530Z",
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
  "timestamp": "2024-04-27T21:12:07.532Z",
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
  "timestamp": "2024-04-27T21:12:07.535Z",
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
console.log("Student1")
//console.log(JSON.stringify(statements,null,2));