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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.880Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.912Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.915Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.917Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.919Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.922Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.924Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.926Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.929Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.931Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.934Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.936Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.939Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.941Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.943Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.946Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.948Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.951Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.953Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.955Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.957Z",
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
        "en-US": "Ike",
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
  "timestamp": "2024-04-27T21:11:40.960Z",
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
console.log("Student1")
//console.log(JSON.stringify(statements,null,2));