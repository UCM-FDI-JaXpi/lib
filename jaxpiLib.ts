
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
  
  

  private verbMap = new Map([["accepted",{"id":"https://github.com/UCM-FDI-JaXpi/lib/accepted","display":{"en-us":"accepted","es":"aceptado"},"objects":["achievement","award","mission","reward","task"]}],
["accessed",{"id":"https://github.com/UCM-FDI-JaXpi/lib/accessed","display":{"en-us":"accessed","es":"accedido"},"objects":["chest","door","room"],"extensions":{"https://example.com/game/visited_times":3},"extensions-doc":{"https://example.com/game/visited_times":"Number of times the object has been accessed"}}],
["achieved",{"id":"https://github.com/UCM-FDI-JaXpi/lib/achieved","display":{"en-us":"achieved","es":"logrado"},"objects":["achievement","award","game","goal","level","reward"]}],
["cancelled",{"id":"https://github.com/UCM-FDI-JaXpi/lib/cancelled","display":{"en-us":"cancelled","es":"cancelado"},"objects":["mission","task"],"extensions":{"https://example.com/game/reason":"Obstacle ahead"},"extensions-doc":{"https://example.com/game/reason":"Reason of the cancelation"}}],
["chatted",{"id":"https://github.com/UCM-FDI-JaXpi/lib/chatted","display":{"en-us":"chatted","es":"charló"},"objects":["character"]}],
["clicked",{"id":"https://github.com/UCM-FDI-JaXpi/lib/clicked","display":{"en-us":"clicked","es":"clicado"}}],
["climbed",{"id":"https://github.com/UCM-FDI-JaXpi/lib/climbed","display":{"en-us":"climbed","es":"escalado"},"objects":["location"]}],
["closed",{"id":"https://w3id.org/xapi/adl/verbs/closed","display":{"en-us":"closed","es":"cerrado"},"objects":["chest","door"]}],
["combined",{"id":"https://github.com/UCM-FDI-JaXpi/lib/combined","display":{"en-us":"combined","es":"combinado"},"objects":["item"]}],
["completed",{"id":"https://github.com/UCM-FDI-JaXpi/lib/completed","display":{"en-us":"completed","es":"completado"},"objects":["achievement","game","goal","level","mission","task"],"extensions":{"https://example.com/game/score":500},"extensions-doc":{"https://example.com/game/score":"Score reach with the completion"}}],
["connected",{"id":"https://github.com/UCM-FDI-JaXpi/lib/connected","display":{"en-us":"connected","es":"conectado"}}],
["crafted",{"id":"https://github.com/UCM-FDI-JaXpi/lib/crafted","display":{"en-us":"crafted","es":"elaborado"},"objects":["item"]}],
["dashed",{"id":"https://github.com/UCM-FDI-JaXpi/lib/dashed","display":{"en-us":"dashed","es":"dash"},"objects":["character"]}],
["defeated",{"id":"https://github.com/UCM-FDI-JaXpi/lib/defeated","display":{"en-us":"defeated","es":"derrotado"},"objects":["enemy"]}],
["destroyed",{"id":"https://github.com/UCM-FDI-JaXpi/lib/destroyed","display":{"en-us":"destroyed","es":"destruido"},"objects":["item"]}],
["died",{"id":"https://github.com/UCM-FDI-JaXpi/lib/died","display":{"en-us":"died","es":"muerto"},"objects":["character","location"]}],
["discovered",{"id":"https://github.com/UCM-FDI-JaXpi/lib/discovered","display":{"en-us":"discovered","es":"descubierto"},"objects":["level","location"]}],
["doubleJumped",{"id":"https://github.com/UCM-FDI-JaXpi/lib/double-jumped","display":{"en-us":"double jumped","es":"doble salto"}}],
["earned",{"id":"https://github.com/UCM-FDI-JaXpi/lib/earned","display":{"en-us":"earned","es":"ganado"},"objects":["reward"]}],
["equipped",{"id":"https://github.com/UCM-FDI-JaXpi/lib/equipped","display":{"en-us":"equipped","es":"equipado"},"objects":["item"]}],
["examined",{"id":"https://github.com/UCM-FDI-JaXpi/lib/examined","display":{"en-us":"examined","es":"examinado"},"objects":["item","room"]}],
["exited",{"id":"https://github.com/UCM-FDI-JaXpi/lib/exited","display":{"en-us":"exited","es":"salió"},"objects":["location","room"]}],
["explored",{"id":"https://github.com/UCM-FDI-JaXpi/lib/explored","display":{"en-us":"explored","es":"explorado"},"objects":["location"]}],
["failed",{"id":"https://github.com/UCM-FDI-JaXpi/lib/failed","display":{"en-us":"failed","es":"falló"},"objects":["mission","task","level"]}],
["fellIn",{"id":"https://github.com/UCM-FDI-JaXpi/lib/fellIn","display":{"en-us":"fell in","es":"cayó en"},"objects":["location"]}],
["jumped",{"id":"https://github.com/UCM-FDI-JaXpi/lib/jumped","display":{"en-us":"jumped","es":"saltado"},"objects":["character","enemy"],"extensions":{"https://github.com/UCM-FDI-JaXpi/distance":5,"https://github.com/UCM-FDI-JaXpi/units":"meters"},"extensions-doc":{"https://github.com/UCM-FDI-JaXpi/distance":"Number of units the object jumped","https://github.com/UCM-FDI-JaXpi/units":"Units in which the distance is expressed"}}],
["launched",{"id":"https://github.com/UCM-FDI-JaXpi/lib/launched","display":{"en-us":"launched","es":"ejecutado"}}],
["loggedIn",{"id":"https://github.com/UCM-FDI-JaXpi/lib/loggedIn","display":{"en-us":"loggedIn","es":"conectado"}}],
["loggedOut",{"id":"https://github.com/UCM-FDI-JaXpi/lib/loggedOut","display":{"en-us":"loggedOut","es":"desconectado"}}],
["moved",{"id":"https://github.com/UCM-FDI-JaXpi/lib/moved","display":{"en-us":"moved","es":"movido"},"objects":["item"]}],
["navigated",{"id":"https://github.com/UCM-FDI-JaXpi/lib/navigated","display":{"en-us":"navigated","es":"navegado"},"objects":["location"]}],
["opened",{"id":"https://github.com/UCM-FDI-JaXpi/lib/opened","display":{"en-us":"opened","es":"abierto"},"objects":["chest","door"]}],
["paused",{"id":"https://github.com/UCM-FDI-JaXpi/lib/paused","display":{"en-us":"paused","es":"pausado"},"objects":["game"]}],
["registered",{"id":"https://github.com/UCM-FDI-JaXpi/lib/registered","display":{"en-us":"registered","es":"registrado"}}],
["rejected",{"id":"https://github.com/UCM-FDI-JaXpi/lib/rejected","display":{"en-us":"rejected","es":"rechazado"}}],
["rotated",{"id":"https://github.com/UCM-FDI-JaXpi/lib/rotated","display":{"en-us":"rotated","es":"rotado"}}],
["shared",{"id":"https://github.com/UCM-FDI-JaXpi/lib/shared","display":{"en-us":"shared","es":"compartido"}}],
["skipped",{"id":"https://github.com/UCM-FDI-JaXpi/lib/skipped","display":{"en-us":"skipped","es":"omitido"},"objects":["dialog"]}],
["solved",{"id":"https://github.com/UCM-FDI-JaXpi/lib/solved","display":{"en-us":"solved","es":"resuelto"}}],
["sprinted",{"id":"https://github.com/UCM-FDI-JaXpi/lib/sprinted","display":{"en-us":"sprinted","es":"sprint"}}],
["started",{"id":"https://github.com/UCM-FDI-JaXpi/lib/started","display":{"en-us":"started","es":"empezó"},"objects":["level"]}],
["teleported",{"id":"https://github.com/UCM-FDI-JaXpi/lib/teleported","display":{"en-us":"teleported to","es":"teletransportado"},"objects":["location"]}],
["unlocked",{"id":"https://github.com/UCM-FDI-JaXpi/lib/unlocked","display":{"en-us":"unlocked","es":"desbloqueado"},"objects":["chest","skill"]}],
["upgraded",{"id":"https://github.com/UCM-FDI-JaXpi/lib/upgraded","display":{"en-us":"upgraded","es":"mejorado"},"objects":["item"]}],
["used",{"id":"https://github.com/UCM-FDI-JaXpi/lib/used","display":{"en-us":"used","es":"utilizado"},"objects":["chest","item"]}],
["watched",{"id":"https://github.com/UCM-FDI-JaXpi/lib/watched","display":{"en-us":"watched","es":"visto"}}]])



  public object = {
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
   * @param {string} [time_interval] - Number of seconds an interval will try to send the statements to the server. 
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

        localStorage.setItem(aux,JSON.stringify(this.statementQueue.toArray()))
      }
    });
  }

  public stopStatementInterval() {
    if (this.statementInterval)
      clearInterval(this.statementInterval); // Detiene el temporizador
  }

  public startSendingInterval(seconds: number) {
    if (this.statementInterval)
      clearInterval(this.statementInterval);
    this.statementInterval = setInterval(this.flush.bind(this), seconds * 1000); //Crea un intervalo cada 'seconds' segundos
  }


  public async flush() : Promise<void>{ //Si cliente quiere enviar las trazas encoladas
    if (this.statementQueue.length) {
      // Almacena la promesa devuelta por createWorker() en el array de promesas
      this.promises.push(this.createWorker());
    } 
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
  }

  private createWorker() {
    //Mandar al localstorage mando una cola con un id unico
    //Para evitar pisar colas en localstorage con el mismo id
    let aux = "queue" + this.QUEUE_ID.toString();

    while (localStorage.getItem(aux) !== null){
      this.QUEUE_ID++;
      aux = "queue" + this.QUEUE_ID.toString();
    }

    localStorage.setItem(aux,JSON.stringify(this.statementQueue.toArray()))

    //Crea una promesa que se resuelve cuando el hilo termina la ejecucion o en caso de error se rechaza
    let promise = new Promise<void>((resolve, reject) => {
      var worker = new Worker(workerPath);
      worker.postMessage({ url: this.url, statementQueue: this.statementQueue.toArray(), length: this.statementQueue.length, queue_id: aux});
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
  });

    //Vacia la cola actual
    while (this.statementQueue.length != 0){
      this.statementQueue.dequeue()
    }
    
    return promise.catch((error) => {
      // Manejar el error rechazado aquí para evitar UnhandledPromiseRejectionWarning
      console.error('Error rechazado no capturado:', error);
    });
  }

  public createWorkerLStorage(queue: Queue<any>, key : string){ //Si cliente quiere enviar las trazas encoladas
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

  // customVerbWithJson(verb: any, object: any) {

  //   if (checkObject(object) && checkVerb(verb)) {
  //     //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: generate.generateStatement(this.player, verb, object) });
  //     this.statementQueue.enqueue(generate.generateStatement(this.player, verb, object, undefined, this.context, undefined));
  //     if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
  //   }

  // }

  customVerb(verb: string, object: string, parameters: Array<[string,any]>) {

    const [verbJson, objectJson] = generate.generateStatementFromZero(verb, object, parameters);

    //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: generate.generateStatement(this.player, verbJson, objectJson) });
    this.statementQueue.enqueue(generate.generateStatement(this.player, verbJson, objectJson, undefined, this.context, undefined));
    if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
    
  }




/**
 * accepted action.
 * 
 */ 
accepted(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      achievement: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.achievement, name)
        else
          object = generate.generateObject(this.object.achievement)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("accepted"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      award: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.award, name)
        else
          object = generate.generateObject(this.object.award)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("accepted"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      mission: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.mission, name)
        else
          object = generate.generateObject(this.object.mission)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("accepted"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      reward: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.reward, name)
        else
          object = generate.generateObject(this.object.reward)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("accepted"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      task: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.task, name)
        else
          object = generate.generateObject(this.object.task)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("accepted"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * accessed action.
 * @param {number} visited_times - Number of times the object has been accessed
 */ 
accessed(visited_times : number,extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      chest: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.chest, name)
        else
          object = generate.generateObject(this.object.chest)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/visited_times'] = visited_times;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("accessed"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      door: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.door, name)
        else
          object = generate.generateObject(this.object.door)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/visited_times'] = visited_times;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("accessed"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      room: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.room, name)
        else
          object = generate.generateObject(this.object.room)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/visited_times'] = visited_times;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("accessed"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * achieved action.
 * 
 */ 
achieved(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      achievement: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.achievement, name)
        else
          object = generate.generateObject(this.object.achievement)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("achieved"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      award: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.award, name)
        else
          object = generate.generateObject(this.object.award)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("achieved"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      game: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.game, name)
        else
          object = generate.generateObject(this.object.game)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("achieved"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      goal: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.goal, name)
        else
          object = generate.generateObject(this.object.goal)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("achieved"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      level: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.level, name)
        else
          object = generate.generateObject(this.object.level)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("achieved"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      reward: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.reward, name)
        else
          object = generate.generateObject(this.object.reward)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("achieved"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * cancelled action.
 * @param {string} reason - Reason of the cancelation
 */ 
cancelled(reason : string,extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      mission: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.mission, name)
        else
          object = generate.generateObject(this.object.mission)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/reason'] = reason;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("cancelled"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      task: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.task, name)
        else
          object = generate.generateObject(this.object.task)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/reason'] = reason;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("cancelled"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * chatted action.
 * 
 */ 
chatted(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      character: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.character, name)
        else
          object = generate.generateObject(this.object.character)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("chatted"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * clicked action.
 * 
 */ 
clicked(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * climbed action.
 * 
 */ 
climbed(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      location: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.location, name)
        else
          object = generate.generateObject(this.object.location)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("climbed"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * closed action.
 * 
 */ 
closed(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      chest: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.chest, name)
        else
          object = generate.generateObject(this.object.chest)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("closed"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      door: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.door, name)
        else
          object = generate.generateObject(this.object.door)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("closed"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * combined action.
 * 
 */ 
combined(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      item: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.item, name)
        else
          object = generate.generateObject(this.object.item)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("combined"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * completed action.
 * @param {number} score - Score reach with the completion
 */ 
completed(score : number,extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      achievement: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.achievement, name)
        else
          object = generate.generateObject(this.object.achievement)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("completed"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      game: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.game, name)
        else
          object = generate.generateObject(this.object.game)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("completed"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      goal: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.goal, name)
        else
          object = generate.generateObject(this.object.goal)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("completed"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      level: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.level, name)
        else
          object = generate.generateObject(this.object.level)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("completed"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      mission: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.mission, name)
        else
          object = generate.generateObject(this.object.mission)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("completed"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      task: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.task, name)
        else
          object = generate.generateObject(this.object.task)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("completed"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * connected action.
 * 
 */ 
connected(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * crafted action.
 * 
 */ 
crafted(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      item: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.item, name)
        else
          object = generate.generateObject(this.object.item)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("crafted"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * dashed action.
 * 
 */ 
dashed(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      character: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.character, name)
        else
          object = generate.generateObject(this.object.character)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("dashed"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * defeated action.
 * 
 */ 
defeated(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      enemy: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.enemy, name)
        else
          object = generate.generateObject(this.object.enemy)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("defeated"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * destroyed action.
 * 
 */ 
destroyed(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      item: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.item, name)
        else
          object = generate.generateObject(this.object.item)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("destroyed"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * died action.
 * 
 */ 
died(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      character: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.character, name)
        else
          object = generate.generateObject(this.object.character)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("died"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      location: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.location, name)
        else
          object = generate.generateObject(this.object.location)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("died"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * discovered action.
 * 
 */ 
discovered(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      level: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.level, name)
        else
          object = generate.generateObject(this.object.level)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("discovered"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      location: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.location, name)
        else
          object = generate.generateObject(this.object.location)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("discovered"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * double jumped action.
 * 
 */ 
doubleJumped(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * earned action.
 * 
 */ 
earned(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      reward: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.reward, name)
        else
          object = generate.generateObject(this.object.reward)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("earned"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * equipped action.
 * 
 */ 
equipped(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      item: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.item, name)
        else
          object = generate.generateObject(this.object.item)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("equipped"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * examined action.
 * 
 */ 
examined(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      item: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.item, name)
        else
          object = generate.generateObject(this.object.item)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("examined"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      room: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.room, name)
        else
          object = generate.generateObject(this.object.room)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("examined"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * exited action.
 * 
 */ 
exited(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      location: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.location, name)
        else
          object = generate.generateObject(this.object.location)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("exited"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      room: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.room, name)
        else
          object = generate.generateObject(this.object.room)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("exited"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * explored action.
 * 
 */ 
explored(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      location: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.location, name)
        else
          object = generate.generateObject(this.object.location)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("explored"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * failed action.
 * 
 */ 
failed(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      mission: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.mission, name)
        else
          object = generate.generateObject(this.object.mission)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("failed"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      task: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.task, name)
        else
          object = generate.generateObject(this.object.task)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("failed"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      level: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.level, name)
        else
          object = generate.generateObject(this.object.level)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("failed"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * fell in action.
 * 
 */ 
fellIn(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      location: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.location, name)
        else
          object = generate.generateObject(this.object.location)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("fellIn"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * jumped action.
 * @param {number} distance - Number of units the object jumped
 * @param {string} units - Units in which the distance is expressed
 */ 
jumped(distance : number,units : string,extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      character: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.character, name)
        else
          object = generate.generateObject(this.object.character)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/distance'] = distance;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/units'] = units;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("jumped"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      enemy: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.enemy, name)
        else
          object = generate.generateObject(this.object.enemy)
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/distance'] = distance;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/units'] = units;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("jumped"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * launched action.
 * 
 */ 
launched(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * loggedIn action.
 * 
 */ 
loggedIn(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * loggedOut action.
 * 
 */ 
loggedOut(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * moved action.
 * 
 */ 
moved(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      item: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.item, name)
        else
          object = generate.generateObject(this.object.item)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("moved"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * navigated action.
 * 
 */ 
navigated(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      location: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.location, name)
        else
          object = generate.generateObject(this.object.location)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("navigated"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * opened action.
 * 
 */ 
opened(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      chest: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.chest, name)
        else
          object = generate.generateObject(this.object.chest)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("opened"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      door: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.door, name)
        else
          object = generate.generateObject(this.object.door)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("opened"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * paused action.
 * 
 */ 
paused(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      game: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.game, name)
        else
          object = generate.generateObject(this.object.game)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("paused"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * registered action.
 * 
 */ 
registered(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * rejected action.
 * 
 */ 
rejected(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * rotated action.
 * 
 */ 
rotated(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * shared action.
 * 
 */ 
shared(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * skipped action.
 * 
 */ 
skipped(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      dialog: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.dialog, name)
        else
          object = generate.generateObject(this.object.dialog)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("skipped"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * solved action.
 * 
 */ 
solved(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * sprinted action.
 * 
 */ 
sprinted(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

/**
 * started action.
 * 
 */ 
started(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      level: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.level, name)
        else
          object = generate.generateObject(this.object.level)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("started"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * teleported to action.
 * 
 */ 
teleported(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      location: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.location, name)
        else
          object = generate.generateObject(this.object.location)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("teleported"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * unlocked action.
 * 
 */ 
unlocked(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      chest: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.chest, name)
        else
          object = generate.generateObject(this.object.chest)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("unlocked"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      skill: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.skill, name)
        else
          object = generate.generateObject(this.object.skill)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("unlocked"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * upgraded action.
 * 
 */ 
upgraded(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      item: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.item, name)
        else
          object = generate.generateObject(this.object.item)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("upgraded"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * used action.
 * 
 */ 
used(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
      chest: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.chest, name)
        else
          object = generate.generateObject(this.object.chest)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("used"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
,
      item: (name?:string, extraParameters?: Array<[string,any]>) => {

        if (name)
          object = generate.generateObject(this.object.item, name)
        else
          object = generate.generateObject(this.object.item)
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
      
        const statement = generate.generateStatement(this.player,this.verbMap.get("used"), object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          
  };
}

/**
 * watched action.
 * 
 */ 
watched(extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    
  };
}

}