
import path = require('path');
import * as generate from './generateStatement';
import { checkObject, checkVerb } from './validateStatement';
import { Queue } from 'queue-typescript';

const { Worker } = require('worker_threads');
const { LocalStorage } = require('node-localstorage');


const TIME_INTERVAL_SEND = 5;

//const worker = new Worker('./sendStatement.js');
const workerPath = path.resolve(__dirname, 'sendStatement.js');
//const worker = new Worker(workerPath);
const localStorage = new LocalStorage('./scratch');


export class Jaxpi {
  private player: generate.Player;
  private url: string;
  private statementQueue = new Queue<any>();
  private statementInterval: NodeJS.Timeout | undefined;
  private context: any;
  private promises: Promise<void>[] = [];
  private QUEUE_ID: number = 1;
  private MAX_QUEUE_LENGTH: number = 7;
  private processQueueArray: string[] = [];
  private flagFlush: boolean = false;
  
  

  public verbs = {
    "accepted":{"id":"https://github.com/UCM-FDI-JaXpi/lib/accepted","display":{"en-us":"accepted","es":"aceptado"},"objects":["achievement","award","mission","reward","task"],"description":"The player accepts an object like a task or a reward"},
      "accessed":{"id":"https://github.com/UCM-FDI-JaXpi/lib/accessed","display":{"en-us":"accessed","es":"accedido"},"objects":["chest","door","room","location"],"description":"The player access an object like a room or a new area","extensions":{"https://example.com/game/visited_times":3},"extensions-doc":{"https://example.com/game/visited_times":"Number of times the object has been accessed"}},
      "achieved":{"id":"https://github.com/UCM-FDI-JaXpi/lib/achieved","display":{"en-us":"achieved","es":"logrado"},"objects":["achievement","award","game","goal","level","reward"],"description":"The player achieves something like a level up"},
      "cancelled":{"id":"https://github.com/UCM-FDI-JaXpi/lib/cancelled","display":{"en-us":"cancelled","es":"cancelado"},"objects":["mission","task"],"description":"The player cancels an object like a mission","extensions":{"https://example.com/game/reason":"Obstacle ahead"},"extensions-doc":{"https://example.com/game/reason":"Reason of the cancelation"}},
      "chatted":{"id":"https://github.com/UCM-FDI-JaXpi/lib/chatted","display":{"en-us":"chatted","es":"charló"},"objects":["character"],"description":"The player opens a dialog with an object like a npc"},
      "clicked":{"id":"https://github.com/UCM-FDI-JaXpi/lib/clicked","display":{"en-us":"clicked","es":"clicado"},"objects":["character","item","dialog","door"],"description":"The player interact with an object"},
      "climbed":{"id":"https://github.com/UCM-FDI-JaXpi/lib/climbed","display":{"en-us":"climbed","es":"escalado"},"objects":["location"],"description":"The player climbes an object like a wall"},
      "closed":{"id":"https://w3id.org/xapi/adl/verbs/closed","display":{"en-us":"closed","es":"cerrado"},"objects":["chest","door"],"description":"The player closes an object like a dialog or a door"},
      "combined":{"id":"https://github.com/UCM-FDI-JaXpi/lib/combined","display":{"en-us":"combined","es":"combinado"},"objects":["item"],"description":"The player combines an object with something","extensions":{"https://example.com/game/target":"Item in inventory"},"extensions-doc":{"https://example.com/game/target":"Target of the combination"}},
      "completed":{"id":"https://github.com/UCM-FDI-JaXpi/lib/completed","display":{"en-us":"completed","es":"completado"},"objects":["achievement","game","goal","level","mission","task"],"description":"The player completes an object like a mission or the game","extensions":{"https://example.com/game/score":500},"extensions-doc":{"https://example.com/game/score":"Score reach with the completion"}},
      "connected":{"id":"https://github.com/UCM-FDI-JaXpi/lib/connected","display":{"en-us":"connected","es":"conectado"},"description":"The player connects an object with something"},
      "crafted":{"id":"https://github.com/UCM-FDI-JaXpi/lib/crafted","display":{"en-us":"crafted","es":"elaborado"},"objects":["item"],"description":"The player crafts an object like a new item"},
      "dashed":{"id":"https://github.com/UCM-FDI-JaXpi/lib/dashed","display":{"en-us":"dashed","es":"dash"},"objects":["character"],"description":"The player dashes (no object? or himself?)"},
      "defeated":{"id":"https://github.com/UCM-FDI-JaXpi/lib/defeated","display":{"en-us":"defeated","es":"derrotado"},"objects":["enemy"],"description":"The player defeates an object like a boss"},
      "destroyed":{"id":"https://github.com/UCM-FDI-JaXpi/lib/destroyed","display":{"en-us":"destroyed","es":"destruido"},"objects":["item"],"description":"The player destroys an object like an old item"},
      "died":{"id":"https://github.com/UCM-FDI-JaXpi/lib/died","display":{"en-us":"died","es":"muerto"},"objects":["character","location"],"description":"The player dies (no object? or himself? or what killed him?)"},
      "discovered":{"id":"https://github.com/UCM-FDI-JaXpi/lib/discovered","display":{"en-us":"discovered","es":"descubierto"},"objects":["level","location"],"description":"The player discoveres an object like a new location"},
      "doubleJumped":{"id":"https://github.com/UCM-FDI-JaXpi/lib/double-jumped","display":{"en-us":"double jumped","es":"doble salto"}},
      "earned":{"id":"https://github.com/UCM-FDI-JaXpi/lib/earned","display":{"en-us":"earned","es":"ganado"},"objects":["reward"],"description":"The player earns an object like a reward"},
      "equipped":{"id":"https://github.com/UCM-FDI-JaXpi/lib/equipped","display":{"en-us":"equipped","es":"equipado"},"objects":["item"],"description":"The player equippes an object like a new item"},
      "examined":{"id":"https://github.com/UCM-FDI-JaXpi/lib/examined","display":{"en-us":"examined","es":"examinado"},"objects":["item","room"],"description":"The player examines an object like an item or a room"},
      "exited":{"id":"https://github.com/UCM-FDI-JaXpi/lib/exited","display":{"en-us":"exited","es":"salió"},"objects":["game","level"],"description":"The player exits the game or level"},
      "explored":{"id":"https://github.com/UCM-FDI-JaXpi/lib/explored","display":{"en-us":"explored","es":"explorado"},"objects":["location"],"description":"The player explors an object like a location"},
      "failed":{"id":"https://github.com/UCM-FDI-JaXpi/lib/failed","display":{"en-us":"failed","es":"falló"},"objects":["mission","task","level"],"description":"The player fails an object like a mission"},
      "fellIn":{"id":"https://github.com/UCM-FDI-JaXpi/lib/fellIn","display":{"en-us":"fell in","es":"cayó en"},"objects":["location"],"description":"The player fells in an object like a pit"},
      "jumped":{"id":"https://github.com/UCM-FDI-JaXpi/lib/jumped","display":{"en-us":"jumped","es":"saltado"},"objects":["character","enemy"],"description":"The player jumps (no object? or himself?)","extensions":{"https://github.com/UCM-FDI-JaXpi/distance":5,"https://github.com/UCM-FDI-JaXpi/units":"meters"},"extensions-doc":{"https://github.com/UCM-FDI-JaXpi/distance":"Number of units the object jumped","https://github.com/UCM-FDI-JaXpi/units":"Units in which the distance is expressed"}},
      "launched":{"id":"https://github.com/UCM-FDI-JaXpi/lib/launched","display":{"en-us":"launched","es":"ejecutado"}},
      "loaded":{"id":"https://github.com/UCM-FDI-JaXpi/lib/loaded","display":{"en-us":"loaded","es":"cargado"},"objects":["game","level"],"description":"The player loads the game or a level"},
      "loggedIn":{"id":"https://github.com/UCM-FDI-JaXpi/lib/loggedIn","display":{"en-us":"loggedIn","es":"conectado"}},
      "loggedOut":{"id":"https://github.com/UCM-FDI-JaXpi/lib/loggedOut","display":{"en-us":"loggedOut","es":"desconectado"}},
      "moved":{"id":"https://github.com/UCM-FDI-JaXpi/lib/moved","display":{"en-us":"moved","es":"movido"},"objects":["item"],"description":"The player moves an object like a boulder"},
      "navigated":{"id":"https://github.com/UCM-FDI-JaXpi/lib/navigated","display":{"en-us":"navigated","es":"navegado"},"objects":["location"],"description":"The player navigates a new location"},
      "opened":{"id":"https://github.com/UCM-FDI-JaXpi/lib/opened","display":{"en-us":"opened","es":"abierto"},"objects":["chest","door"],"description":"The player opens an object like a door or a chest"},
      "paused":{"id":"https://github.com/UCM-FDI-JaXpi/lib/paused","display":{"en-us":"paused","es":"pausado"},"objects":["game"],"description":"The player pauses the game"},
      "registered":{"id":"https://github.com/UCM-FDI-JaXpi/lib/registered","display":{"en-us":"registered","es":"registrado"}},
      "rejected":{"id":"https://github.com/UCM-FDI-JaXpi/lib/rejected","display":{"en-us":"rejected","es":"rechazado"}},
      "rotated":{"id":"https://github.com/UCM-FDI-JaXpi/lib/rotated","display":{"en-us":"rotated","es":"rotado"}},
      "shared":{"id":"https://github.com/UCM-FDI-JaXpi/lib/shared","display":{"en-us":"shared","es":"compartido"}},
      "skipped":{"id":"https://github.com/UCM-FDI-JaXpi/lib/skipped","display":{"en-us":"skipped","es":"omitido"},"objects":["dialog"],"description":"The player skips a dialog"},
      "solved":{"id":"https://github.com/UCM-FDI-JaXpi/lib/solved","display":{"en-us":"solved","es":"resuelto"}},
      "sprinted":{"id":"https://github.com/UCM-FDI-JaXpi/lib/sprinted","display":{"en-us":"sprinted","es":"sprint"},"description":"The player jumps (no object? or himself?)"},
      "started":{"id":"https://github.com/UCM-FDI-JaXpi/lib/started","display":{"en-us":"started","es":"empezó"},"objects":["level","game"],"description":"The player starts a level or a new game"},
      "teleported":{"id":"https://github.com/UCM-FDI-JaXpi/lib/teleported","display":{"en-us":"teleported to","es":"teletransportado"},"objects":["location","character"],"description":"The player teleports to a location or a character"},
      "unlocked":{"id":"https://github.com/UCM-FDI-JaXpi/lib/unlocked","display":{"en-us":"unlocked","es":"desbloqueado"},"objects":["chest","skill"],"description":"The player unlocks an object like a chest or a skill"},
      "upgraded":{"id":"https://github.com/UCM-FDI-JaXpi/lib/upgraded","display":{"en-us":"upgraded","es":"mejorado"},"objects":["item"],"description":"The player upgrades an item"},
      "used":{"id":"https://github.com/UCM-FDI-JaXpi/lib/used","display":{"en-us":"used","es":"utilizado"},"objects":["item"],"description":"The player uses an item","extensions":{"https://github.com/UCM-FDI-JaXpi/consumed":false},"extensions-doc":{"https://github.com/UCM-FDI-JaXpi/consumed":"The item is consumed with the use or not"}},
      "watched":{"id":"https://github.com/UCM-FDI-JaXpi/lib/watched","display":{"en-us":"watched","es":"visto"}}
  }


  public objects = {
    "achievement":{"id":"http://example.com/achievements/achievement","definition":{"type":"Achievement","name":{"en-us":"Achievement 1 completed","es":"Achievement 1 completado"},"description":{"en-us":"You completed achievement 1!","es":"¡Has completado el achievement 1!"}}},
      "award":{"id":"http://example.com/achievements/award","definition":{"type":"Special award","name":{"en-us":"Special award","es":"Premio especial"},"description":{"en-us":"Special award earned by achieving a significant milestone in the game","es":"Premio especial obtenido al alcanzar un hito significativo en el juego"}}},
      "character":{"id":"http://example.com/character","definition":{"type":"Playable character","name":{"en-us":"Mario","es":"Mario"},"description":{"en-us":"Mario is the main protagonist of the game","es":"Mario es el protagonista del juego"}}},
      "chest":{"id":"http://example.com/objects/chest","definition":{"type":"Chest","name":{"en-us":"Chest 1","es":"Cofre 1"},"description":{"en-us":"Chest 1 has been closed","es":"El cofre 1 ha sido cerrado"}}},
      "dialog":{"id":"http://example.com/achievements/dialog","definition":{"type":"Dialog","name":{"en-us":"Dialog","es":"Dialogo"},"description":{"en-us":"Dialog the player interacts with.","es":"Dialogo con el que el jugador interacciona."}}},
      "door":{"id":"http://example.com/objects/door","definition":{"type":"Door","name":{"en-us":"Door 1","es":"Puerta 1"},"description":{"en-us":"Door 1 has been closed","es":"La puerta 1 ha sido cerrada"}}},
      "enemy":{"id":"http://example.com/enemy","definition":{"type":"Non-playable character","name":{"en-us":"Bowser","es":"Bowser"},"description":{"en-us":"Bowser is the main antagonist of the game","es":"Bowser es el principal antagonista del juego"}}},
      "game":{"id":"http://example.com/achievements/game","definition":{"type":"Game","name":{"en-us":"Game","es":"Juego"},"description":{"en-us":"Game you are playing.","es":"El juego que estas jugando."}}},
      "goal":{"id":"http://example.com/goals/goal","definition":{"type":"Goal","name":{"en-us":"Goal 1","es":"Objetivo 1"},"description":{"en-us":"You have achieved goal 1","es":"Has logrado el objetivo 1"}}},
      "item":{"id":"http://example.com/achievements/item","definition":{"type":"Item","name":{"en-us":"Item","es":"Objeto"},"description":{"en-us":"Interactable item","es":"Objeto interactuable"}}},
      "level":{"id":"http://example.com/achievements/level","definition":{"type":"Level","name":{"en-us":"Level 1 completed","es":"Nivel 1 completado"},"description":{"en-us":"You completed level 1!","es":"¡Has completado el nivel 1!"}}},
      "location":{"id":"http://example.com/achievements/location","definition":{"type":"Location","name":{"en-us":"Location","es":"Lugar"},"description":{"en-us":"Location in which action ocurrs","es":"Lugar donde ocurre la acción"}}},
      "mission":{"id":"http://example.com/missions/mission","definition":{"type":"Mission","name":{"en-us":"Mission 1","es":"Misión 1"},"description":{"en-us":"You have accepted mission 1","es":"Has aceptado la misión 1"}}},
      "reward":{"id":"http://example.com/rewards/reward","definition":{"type":"Reward","name":{"en-us":"Reward 1","es":"Recompensa 1"},"description":{"en-us":"You have accepted reward 1","es":"Has aceptado la recompensa 1"},"extensions":{"https://example.com/game/accepted_difficulty":"Easy","https://example.com/game/accepted_level":"1","https://example.com/game/accepted_type":"Exploration","https://example.com/game/accepted_importance":"Low","https://example.com/game/achieved_difficulty":"Easy","https://example.com/game/achieved_completion_time":"3 minutes","https://example.com/game/achieved_score":70,"https://example.com/game/achieved_date":"2024-03-07"}}},
      "room":{"id":"http://example.com/rooms/room","definition":{"type":"Room","name":{"en-us":"Room 1","es":"Habitación 1"},"description":{"en-us":"You have accessed room 1","es":"Has accedido a la habitación 1"}}},
      "skill":{"id":"http://example.com/achievements/skill","definition":{"type":"Skill","name":{"en-us":"Skill","es":"Habilidad"},"description":{"en-us":"Character skill","es":"Habilidad del personaje"}}},
      "task":{"id":"http://example.com/tasks/task","definition":{"type":"Task","name":{"en-us":"Task 1","es":"Tarea 1"},"description":{"en-us":"You have accepted task 1","es":"Has aceptado la tarea 1"}}}
  }

  /**
   * @param {Object} player - Structure that contains player data.
   * @param {string} player.name - The name of the player.
   * @param {string} player.mail - The mail of the player.
   * @param {string} url - The url of the server where statements will be sent.
   * @param {string} interval - Boolean that activates an interval to send statements. 
   * @param {string} [time_interval=5] - Number of seconds an interval will try to send the statements to the server. 
   * @param {string} [max_queue=7] - Maximum number of statement per queue before sending. 
   */ 
  constructor(player: generate.Player, url: string, interval: boolean, time_interval?: number, max_queue?: number) {
    this.player = player;
    this.url = url;
    // Inicia el intervalo de envios de traza. default = cada 5 seg 
    if(interval)
      if(time_interval !== undefined)
        this.statementInterval = setInterval(this.flush.bind(this), 1000 * time_interval); 
      else
        this.statementInterval = setInterval(this.flush.bind(this), 1000 * TIME_INTERVAL_SEND); 
    // Registra la función de limpieza para enviar las trazas encoladas cuando el programa finalice
    this.context = undefined;
    this.promises = [];
    if (max_queue)
      this.MAX_QUEUE_LENGTH = max_queue

    // Si quedaron trazas por enviar en caso de error o cierre, se encolan para ser enviadas
    if(localStorage.length){
      for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const value = localStorage.getItem(key);
  
          let recovArray = JSON.parse(value)
          let recovQueue = new Queue<any>;
          recovArray.forEach((element: JSON) => {
              recovQueue.enqueue(element)
          });
          this.promises.push(this.createWorkerLStorage(recovQueue, key))
      }
    }

    process.on('SIGTERM', async () => {
      this.flush()
      await Promise.all(this.promises)
      .then( () => {
          process.exit(0)
      })
      .catch( (error) => {
        console.error("Se produjo un error al resolver las promesas:", error);
        process.exit(1);
      });
    })

    process.on('SIGINT', async () => {
      this.flush()
      await Promise.all(this.promises)
      .then( () => {
          process.exit(0)
      })
      .catch( (error) => {
        console.error("Se produjo un error al resolver las promesas:", error);
        process.exit(1);
      });
    })
    
    process.on('exit', () => {
      if (this.statementQueue.length) {
        let aux = "queue" + this.QUEUE_ID.toString();

        while (localStorage.getItem(aux) !== null){
          this.QUEUE_ID++;
          aux = "queue" + this.QUEUE_ID.toString();
        }

        localStorage.setItem(aux,JSON.stringify(this.statementQueue.toArray(),null,2))
      }
    });
  }
  /**
   * Function to stop the interval to send the statements queue to the server
   */
  public stopStatementInterval() {
    if (this.statementInterval)
      clearInterval(this.statementInterval); // Detiene el temporizador
  }
  /**
   * Function to start the interval to send the statements queue to the server
   */ 
  public startSendingInterval(seconds: number) {
    if (this.statementInterval)
      clearInterval(this.statementInterval);
    this.statementInterval = setInterval(this.flush.bind(this), seconds * 1000); //Crea un intervalo cada 'seconds' segundos
  }

  /**
   * Function to send the statements queue to the server, it also creates a backup if the sending fails
   */ 
  public async flush() : Promise<void>{ //Si cliente quiere enviar las trazas encoladas

    while (this.flagFlush);
    this.flagFlush = true;

    let newQueue = this.statementQueue
    this.statementQueue = new Queue<any>();
    if(localStorage.length){
      for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const value = localStorage.getItem(key);

          if (this.processQueueArray.includes(key))
            continue;
  
          let recovArray = JSON.parse(value)
          let recovQueue = new Queue<any>;
          recovArray.forEach((element: JSON) => {
              recovQueue.enqueue(element)
          });
          this.promises.push(this.createWorkerLStorage(recovQueue, key))
      }
    }
    if (newQueue.length) {
      // Almacena la promesa devuelta por createWorker() en el array de promesas
      this.promises.push(this.createWorker(newQueue));
    } 
    this.flagFlush = false
  }

  private createWorker(queue: Queue<any>) {
    //Mandar al localstorage mando una cola con un id unico
    //Para evitar pisar colas en localstorage con el mismo id
    let aux = "queue" + this.QUEUE_ID.toString();

    while (localStorage.getItem(aux) !== null){
      this.QUEUE_ID++;
      aux = "queue" + this.QUEUE_ID.toString();
    }

    this.processQueueArray.push(aux)
    localStorage.setItem(aux,JSON.stringify(queue.toArray(),null,2))

    //Crea una promesa que se resuelve cuando el hilo termina la ejecucion o en caso de error se rechaza
    let promise = new Promise<void>((resolve, reject) => {
      var worker = new Worker(workerPath);
      worker.postMessage({ url: this.url, statementQueue: queue.toArray(), length: queue.length, queue_id: aux});
      worker.on('message', (message: any) => {
        if (message.error){
          this.processQueueArray.splice(this.processQueueArray.indexOf(aux,1))
          reject(message.error);
        }
        else{
          const { log, queue_id } = message;
          console.log('Mensaje recibido desde el worker:', log);

          //Borrar de localstorage las trazas que se han enviado eliminando la cola con la id adecuada
          localStorage.removeItem(queue_id)

          // Destruye el worker generado una vez finalizada su tarea
          worker.terminate()
          this.processQueueArray.splice(this.processQueueArray.indexOf(aux,1))
          // Resuelve la promesa una vez que se haya procesado la cola de trazas
          resolve();
        }
      });
    });

    // //Vacia la cola actual
    // while (this.statementQueue.length != 0){
    //   this.statementQueue.dequeue()
    // }
    
    return promise.catch((error) => {
      // Manejar el error rechazado aquí para evitar UnhandledPromiseRejectionWarning
      console.error('Error rechazado no capturado:', error);
    });
  }

  private createWorkerLStorage(queue: Queue<any>, key : string){ //Si cliente quiere enviar las trazas encoladas
    //Crea una promesa que se resuelve cuando el hilo termina la ejecucion o en caso de error se rechaza
    return new Promise<void>((resolve, reject) => {
      var worker = new Worker(workerPath);
      worker.postMessage({ url: this.url, statementQueue: queue.toArray(), length: queue.length, queue_id: key});
      worker.on('message', (message: any) => {
        if (message.error){
          reject(message.error);
        }
        else{
          const { log, queue_id } = message;
          console.log('Mensaje recibido desde el worker:', log);

          //Borrar de localstorage las trazas que se han enviado eliminando la cola con la id adecuada
          localStorage.removeItem(queue_id)

          // Destruye el worker generado una vez finalizada su tarea
          worker.terminate()
          // Resuelve la promesa una vez que se haya procesado la cola de trazas
          resolve();
        }
      });
    }).catch((error) => {
      // Manejar el error rechazado aquí para evitar UnhandledPromiseRejectionWarning
      console.error('Error rechazado no capturado:', error);
    });
  }

  /**
   * Function to set the context field of the statement (class / association where it takes places)
   * @param {string} name - Name of the instructor
   * @param {string} mbox - Mail of the instructor
   * @param {string} sessionId - Unique id of the session (class URI)
   * @param {string} groupId - Unique id of the association (college URI)
   * @param {Array<[string,any]>} [parameters] - Extra parameters to add to the statement in context.extensions field
   */ 
  public setContext(name: string, mbox: string, sessionId: string, groupId: string, parameters?: Array<[string,any]>){
    this.context = {
      instructor: {
          name: name,
          mbox: mbox
      },
      contextActivities: {
          parent: { id: "http://example.com/activities/" + sessionId },
          grouping: { id: 'http://example.com/activities/' + groupId }
      },
      extensions: {}
    }
    if (parameters){
      for (let [key, value] of parameters) { 
        if (this.context.extensions !== undefined) {
        let parameter = "http://example.com/activities/" + key;
        (this.context.extensions as { [key: string]: any })[parameter] = value; // Aseguramos a typescript que extensions es del tipo {string : any,...}
        }
      }
    }
  }

/**
 * Function to accept verbs / objects not contemplated in the library
 * @param {string | object} verb - Verb to construct the statement, can be one from jaxpi.verbs list, a JSON with that structure or a simple string
 * @param {string | object} object - Object to construct the statement, can be one from jaxpi.objects list, a JSON with that structure or a simple string
 * @param {Array<[string,any]>} [parameters] - Extra parameters to add to the statement in object.extensions field
 */ 
  customVerb(verb: string | object, object: string | object, parameters?: Array<[string,any]>) {

    if (checkObject(object) || typeof object === "string"){
      if (checkVerb(verb) || typeof verb === "string"){
        const [verbJson, objectJson] = generate.generateStatementFromZero(verb, object, parameters);

        //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: generate.generateStatement(this.player, verbJson, objectJson) });
        this.statementQueue.enqueue(generate.generateStatement(this.player, verbJson, objectJson, undefined, this.context, undefined));
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
      }
      else
        console.warn("Verb parameter type incorrect, please use an string for a verb dummy, choose one from jaxpi.verb list or maintain the structure of this last one")
    }
    else
      console.warn("Object parameter type incorrect, please use an string for an object dummy, choose one from jaxpi.object list or maintain the structure of this last one")

  }




/**
 * The player accepts an object like a task or a reward
 * 
 */ 
accepted(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      achievement: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.achievement, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.accepted, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      award: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.award, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.accepted, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      mission: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.mission, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.accepted, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      reward: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.reward, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.accepted, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      task: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.task, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.accepted, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player access an object like a room or a new area
 * @param {number} visited_times - Number of times the object has been accessed
 */ 
accessed(visited_times : number,extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      chest: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.chest, name, description)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/visited_times'] = visited_times;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.accessed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      door: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.door, name, description)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/visited_times'] = visited_times;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.accessed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      room: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.room, name, description)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/visited_times'] = visited_times;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.accessed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      location: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.location, name, description)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/visited_times'] = visited_times;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.accessed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player achieves something like a level up
 * 
 */ 
achieved(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      achievement: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.achievement, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.achieved, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      award: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.award, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.achieved, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      game: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.game, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.achieved, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      goal: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.goal, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.achieved, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      level: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.level, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.achieved, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      reward: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.reward, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.achieved, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player cancels an object like a mission
 * @param {string} reason - Reason of the cancelation
 */ 
cancelled(reason : string,extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      mission: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.mission, name, description)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/reason'] = reason;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.cancelled, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      task: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.task, name, description)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/reason'] = reason;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.cancelled, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player opens a dialog with an object like a npc
 * 
 */ 
chatted(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      character: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.character, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.chatted, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player interact with an object
 * 
 */ 
clicked(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      character: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.character, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.clicked, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      item: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.item, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.clicked, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      dialog: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.dialog, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.clicked, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      door: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.door, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.clicked, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player climbes an object like a wall
 * 
 */ 
climbed(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      location: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.location, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.climbed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player closes an object like a dialog or a door
 * 
 */ 
closed(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      chest: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.chest, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.closed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      door: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.door, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.closed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player combines an object with something
 * @param {string} target - Target of the combination
 */ 
combined(target : string,extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      item: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.item, name, description)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/target'] = target;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.combined, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player completes an object like a mission or the game
 * @param {number} score - Score reach with the completion
 */ 
completed(score : number,extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      achievement: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.achievement, name, description)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.completed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      game: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.game, name, description)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.completed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      goal: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.goal, name, description)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.completed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      level: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.level, name, description)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.completed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      mission: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.mission, name, description)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.completed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      task: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.task, name, description)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.completed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player connects an object with something
 * 
 */ 
connected(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * The player crafts an object like a new item
 * 
 */ 
crafted(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      item: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.item, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.crafted, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player dashes (no object? or himself?)
 * 
 */ 
dashed(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      character: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.character, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.dashed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player defeates an object like a boss
 * 
 */ 
defeated(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      enemy: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.enemy, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.defeated, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player destroys an object like an old item
 * 
 */ 
destroyed(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      item: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.item, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.destroyed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player dies (no object? or himself? or what killed him?)
 * 
 */ 
died(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      character: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.character, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.died, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      location: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.location, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.died, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player discoveres an object like a new location
 * 
 */ 
discovered(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      level: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.level, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.discovered, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      location: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.location, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.discovered, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * undefined
 * 
 */ 
doubleJumped(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * The player earns an object like a reward
 * 
 */ 
earned(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      reward: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.reward, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.earned, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player equippes an object like a new item
 * 
 */ 
equipped(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      item: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.item, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.equipped, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player examines an object like an item or a room
 * 
 */ 
examined(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      item: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.item, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.examined, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      room: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.room, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.examined, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player exits the game or level
 * 
 */ 
exited(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      game: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.game, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.exited, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      level: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.level, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.exited, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player explors an object like a location
 * 
 */ 
explored(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      location: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.location, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.explored, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player fails an object like a mission
 * 
 */ 
failed(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      mission: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.mission, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.failed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      task: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.task, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.failed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      level: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.level, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.failed, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player fells in an object like a pit
 * 
 */ 
fellIn(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      location: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.location, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.fellIn, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player jumps (no object? or himself?)
 * @param {number} distance - Number of units the object jumped
 * @param {string} units - Units in which the distance is expressed
 */ 
jumped(distance : number,units : string,extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      character: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.character, name, description)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/distance'] = distance;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/units'] = units;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.jumped, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      enemy: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.enemy, name, description)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/distance'] = distance;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/units'] = units;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.jumped, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * undefined
 * 
 */ 
launched(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * The player loads the game or a level
 * 
 */ 
loaded(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      game: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.game, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.loaded, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      level: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.level, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.loaded, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * undefined
 * 
 */ 
loggedIn(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * undefined
 * 
 */ 
loggedOut(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * The player moves an object like a boulder
 * 
 */ 
moved(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      item: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.item, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.moved, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player navigates a new location
 * 
 */ 
navigated(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      location: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.location, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.navigated, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player opens an object like a door or a chest
 * 
 */ 
opened(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      chest: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.chest, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.opened, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      door: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.door, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.opened, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player pauses the game
 * 
 */ 
paused(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      game: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.game, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.paused, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * undefined
 * 
 */ 
registered(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * undefined
 * 
 */ 
rejected(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * undefined
 * 
 */ 
rotated(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * undefined
 * 
 */ 
shared(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * The player skips a dialog
 * 
 */ 
skipped(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      dialog: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.dialog, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.skipped, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * undefined
 * 
 */ 
solved(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * The player jumps (no object? or himself?)
 * 
 */ 
sprinted(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * The player starts a level or a new game
 * 
 */ 
started(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      level: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.level, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.started, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      game: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.game, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.started, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player teleports to a location or a character
 * 
 */ 
teleported(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      location: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.location, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.teleported, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      character: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.character, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.teleported, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player unlocks an object like a chest or a skill
 * 
 */ 
unlocked(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      chest: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.chest, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.unlocked, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      skill: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.skill, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.unlocked, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player upgrades an item
 * 
 */ 
upgraded(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      item: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.item, name, description)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.upgraded, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * The player uses an item
 * @param {boolean} consumed - The item is consumed with the use or not
 */ 
used(consumed : boolean,extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      item: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.item, name, description)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/consumed'] = consumed;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }

        if (objectParameters && objectParameters.length > 0) {
          objectParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player, this.verbs.used, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * undefined
 * 
 */ 
watched(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

}