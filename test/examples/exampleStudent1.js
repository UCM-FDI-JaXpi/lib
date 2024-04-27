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
  "timestamp": "2024-04-27T19:30:12.927Z",
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
  "timestamp": "2024-04-27T19:30:13.008Z",
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
  "timestamp": "2024-04-27T19:30:13.014Z",
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
  "timestamp": "2024-04-27T19:30:13.021Z",
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
  "timestamp": "2024-04-27T19:30:13.028Z",
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
  "timestamp": "2024-04-27T19:30:13.036Z",
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
  "timestamp": "2024-04-27T19:30:13.042Z",
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
  "timestamp": "2024-04-27T19:30:13.049Z",
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
  "timestamp": "2024-04-27T19:30:13.056Z",
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
  "timestamp": "2024-04-27T19:30:13.064Z",
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
  "timestamp": "2024-04-27T19:30:13.070Z",
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
  "timestamp": "2024-04-27T19:30:13.077Z",
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
  "timestamp": "2024-04-27T19:30:13.084Z",
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
  "timestamp": "2024-04-27T19:30:13.090Z",
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
  "timestamp": "2024-04-27T19:30:13.097Z",
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
  "timestamp": "2024-04-27T19:30:13.103Z",
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
  "timestamp": "2024-04-27T19:30:13.110Z",
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
  "timestamp": "2024-04-27T19:30:13.116Z",
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
  "timestamp": "2024-04-27T19:30:13.122Z",
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
  "timestamp": "2024-04-27T19:30:13.129Z",
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
  "timestamp": "2024-04-27T19:30:13.136Z",
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
  "timestamp": "2024-04-27T19:30:13.142Z",
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
  "timestamp": "2024-04-27T19:30:13.149Z",
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
  "timestamp": "2024-04-27T19:30:13.155Z",
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
  "timestamp": "2024-04-27T19:30:13.162Z",
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

console.log(statements.length)

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