import axios from 'axios'
let statements = [
{
  "actor": {
    "mbox": "mailto:student1@example.com",
    "name": "Student1"
  },
  "verb": {
    "id": "https://github.com/UCM-FDI-JaXpi/lib/started",
    "display": {
      "en-US": "started",
      "es": "empezó"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 4",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-27T21:09:31.396Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/exited",
    "display": {
      "en-US": "exited",
      "es": "salió"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 4",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-27T21:09:33.408Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/loaded",
    "display": {
      "en-US": "loaded",
      "es": "cargado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 4",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {
        "https://github.com/UCM-FDI-JaXpi/id_load": "save 14"
      }
    }
  },
  "timestamp": "2024-04-27T21:09:35.428Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/exited",
    "display": {
      "en-US": "exited",
      "es": "salió"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 4",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-27T21:09:37.448Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/loaded",
    "display": {
      "en-US": "loaded",
      "es": "cargado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 4",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {
        "https://github.com/UCM-FDI-JaXpi/id_load": "save 24"
      }
    }
  },
  "timestamp": "2024-04-27T21:09:39.458Z",
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
        "en-US": "level 4",
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
  "timestamp": "2024-04-27T21:09:41.478Z",
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
        "en-US": "level 4",
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
  "timestamp": "2024-04-27T21:09:41.486Z",
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
        "en-US": "level 4",
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
  "timestamp": "2024-04-27T21:09:41.491Z",
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
        "en-US": "level 4",
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
  "timestamp": "2024-04-27T21:09:41.495Z",
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
        "en-US": "level 4",
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
  "timestamp": "2024-04-27T21:09:41.498Z",
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
        "en-US": "level 4",
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
  "timestamp": "2024-04-27T21:09:41.503Z",
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
        "en-US": "level 4",
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
  "timestamp": "2024-04-27T21:09:41.506Z",
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
        "en-US": "level 4",
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
  "timestamp": "2024-04-27T21:09:41.509Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/started",
    "display": {
      "en-US": "started",
      "es": "empezó"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 5",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-27T21:09:41.514Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/exited",
    "display": {
      "en-US": "exited",
      "es": "salió"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 5",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-27T21:09:43.518Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/loaded",
    "display": {
      "en-US": "loaded",
      "es": "cargado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 5",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {
        "https://github.com/UCM-FDI-JaXpi/id_load": "save 15"
      }
    }
  },
  "timestamp": "2024-04-27T21:09:45.525Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/exited",
    "display": {
      "en-US": "exited",
      "es": "salió"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 5",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-27T21:09:47.538Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/loaded",
    "display": {
      "en-US": "loaded",
      "es": "cargado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 5",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {
        "https://github.com/UCM-FDI-JaXpi/id_load": "save 25"
      }
    }
  },
  "timestamp": "2024-04-27T21:09:49.554Z",
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
        "en-US": "level 5",
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
  "timestamp": "2024-04-27T21:09:51.576Z",
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
        "en-US": "level 5",
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
  "timestamp": "2024-04-27T21:09:51.583Z",
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
        "en-US": "level 5",
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
  "timestamp": "2024-04-27T21:09:51.585Z",
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
        "en-US": "level 5",
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
  "timestamp": "2024-04-27T21:09:51.588Z",
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
        "en-US": "level 5",
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
  "timestamp": "2024-04-27T21:09:51.590Z",
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
        "en-US": "level 5",
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
  "timestamp": "2024-04-27T21:09:51.592Z",
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
        "en-US": "level 5",
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
  "timestamp": "2024-04-27T21:09:51.595Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/started",
    "display": {
      "en-US": "started",
      "es": "empezó"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 6",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-27T21:09:51.597Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/exited",
    "display": {
      "en-US": "exited",
      "es": "salió"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 6",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-27T21:09:53.610Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/loaded",
    "display": {
      "en-US": "loaded",
      "es": "cargado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 6",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {
        "https://github.com/UCM-FDI-JaXpi/id_load": "save 16"
      }
    }
  },
  "timestamp": "2024-04-27T21:09:55.619Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/exited",
    "display": {
      "en-US": "exited",
      "es": "salió"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 6",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {}
    }
  },
  "timestamp": "2024-04-27T21:09:57.637Z",
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
    "id": "https://github.com/UCM-FDI-JaXpi/lib/loaded",
    "display": {
      "en-US": "loaded",
      "es": "cargado"
    }
  },
  "object": {
    "id": "http://example.com/achievements/level",
    "definition": {
      "type": "https://github.com/UCM-FDI-JaXpi/object",
      "name": {
        "en-US": "level 6",
        "es": "Nivel por defecto"
      },
      "description": {
        "en-US": "A stage or section in the game",
        "es": "Una etapa o sección del juego"
      },
      "extensions": {
        "https://github.com/UCM-FDI-JaXpi/id_load": "save 26"
      }
    }
  },
  "timestamp": "2024-04-27T21:09:59.647Z",
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
        "en-US": "level 6",
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
  "timestamp": "2024-04-27T21:10:01.662Z",
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
        "en-US": "level 6",
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
  "timestamp": "2024-04-27T21:10:01.669Z",
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
        "en-US": "level 6",
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
  "timestamp": "2024-04-27T21:10:01.671Z",
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
        "en-US": "level 6",
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
  "timestamp": "2024-04-27T21:10:01.673Z",
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
        "en-US": "level 6",
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
  "timestamp": "2024-04-27T21:10:01.676Z",
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
        "en-US": "level 6",
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
  "timestamp": "2024-04-27T21:10:01.678Z",
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
        "en-US": "level 6",
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
  "timestamp": "2024-04-27T21:10:01.681Z",
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