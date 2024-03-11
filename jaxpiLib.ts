  import * as generate from './generateStatement';
  import { checkObject, checkVerb } from './validateStatement';
  import axios from 'axios';
  import { Queue } from 'queue-typescript';

  const MAX_QUEUE_LENGTH = 7;
  const TIME_SEND_INTERVAL = 5;

  export class Jaxpi {
    private player: generate.Player;
    private url: string;
    private isSending: boolean;
    private statementQueue = new Queue<any>();
    private queuedPromise: Promise<void> = Promise.resolve(); // Inicializamos una promesa resuelta
    private statementInterval: NodeJS.Timeout;
    private context: object;
    private flagSendError: boolean = false;

    private verbMap = new Map([["accepted",{"id":"https://github.com/UCM-FDI-JaXpi/lib/accepted","display":{"en-us":"accepted","es":"aceptado"}}],
["accessed",{"id":"https://github.com/UCM-FDI-JaXpi/lib/accessed","display":{"en-us":"accessed","es":"accedido"}}],
["achieved",{"id":"https://github.com/UCM-FDI-JaXpi/lib/achieved","display":{"en-us":"achieved","es":"logrado"}}],
["cancelled",{"id":"https://github.com/UCM-FDI-JaXpi/lib/cancelled","display":{"en-us":"cancelled","es":"cancelado"}}],
["chatted",{"id":"https://github.com/UCM-FDI-JaXpi/lib/chatted","display":{"en-us":"chatted","es":"charló"}}],
["clicked",{"id":"https://github.com/UCM-FDI-JaXpi/lib/clicked","display":{"en-us":"clicked","es":"clicado"}}],
["climbed",{"id":"https://github.com/UCM-FDI-JaXpi/lib/climbed","display":{"en-us":"climbed","es":"escalado"}}],
["closed",{"id":"https://w3id.org/xapi/adl/verbs/closed","display":{"en-us":"closed","es":"cerrado"}}],
["combined",{"id":"https://github.com/UCM-FDI-JaXpi/lib/combined","display":{"en-us":"combined","es":"combinado"}}],
["completed",{"id":"https://github.com/UCM-FDI-JaXpi/lib/completed","display":{"en-us":"completed","es":"completado"}}],
["connected",{"id":"https://github.com/UCM-FDI-JaXpi/lib/connected","display":{"en-us":"connected","es":"conectado"}}],
["crafted",{"id":"https://github.com/UCM-FDI-JaXpi/lib/crafted","display":{"en-us":"crafted","es":"elaborado"}}],
["dashed",{"id":"https://github.com/UCM-FDI-JaXpi/lib/dashed","display":{"en-us":"dashed","es":"dash"}}],
["defeated",{"id":"https://github.com/UCM-FDI-JaXpi/lib/defeated","display":{"en-us":"defeated","es":"derrotado"}}],
["died",{"id":"https://github.com/UCM-FDI-JaXpi/lib/died","display":{"en-us":"died","es":"muerto"}}],
["discovered",{"id":"https://github.com/UCM-FDI-JaXpi/lib/discovered","display":{"en-us":"discovered","es":"descubierto"}}],
["doubleJumped",{"id":"https://github.com/UCM-FDI-JaXpi/lib/double-jumped","display":{"en-us":"double jumped","es":"doble salto"}}],
["earned",{"id":"https://github.com/UCM-FDI-JaXpi/lib/earned","display":{"en-us":"earned","es":"ganado"}}],
["equipped",{"id":"https://github.com/UCM-FDI-JaXpi/lib/equipped","display":{"en-us":"equipped","es":"equipado"}}],
["examined",{"id":"https://github.com/UCM-FDI-JaXpi/lib/examined","display":{"en-us":"examined","es":"examinado"}}],
["exited",{"id":"https://github.com/UCM-FDI-JaXpi/lib/exited","display":{"en-us":"exited","es":"salió"}}],
["explored",{"id":"https://github.com/UCM-FDI-JaXpi/lib/explored","display":{"en-us":"explored","es":"explorado"}}],
["failed",{"id":"https://github.com/UCM-FDI-JaXpi/lib/failed","display":{"en-us":"failed","es":"falló"}}],
["fell",{"id":"https://github.com/UCM-FDI-JaXpi/lib/fell","display":{"en-us":"fell","es":"cayó"}}],
["jumped",{"id":"https://github.com/UCM-FDI-JaXpi/lib/jumped","display":{"en-us":"jumped","es":"saltado"}}],
["launched",{"id":"https://github.com/UCM-FDI-JaXpi/lib/launched","display":{"en-us":"launched","es":"ejecutado"}}],
["loggedIn",{"id":"https://github.com/UCM-FDI-JaXpi/lib/loggedIn","display":{"en-us":"loggedIn","es":"conectado"}}],
["loggedOut",{"id":"https://github.com/UCM-FDI-JaXpi/lib/loggedOut","display":{"en-us":"loggedOut","es":"desconectado"}}],
["moved",{"id":"https://github.com/UCM-FDI-JaXpi/lib/moved","display":{"en-us":"moved","es":"movido"}}],
["navigated",{"id":"https://github.com/UCM-FDI-JaXpi/lib/navigated","display":{"en-us":"navigated","es":"navegado"}}],
["opened",{"id":"https://github.com/UCM-FDI-JaXpi/lib/opened","display":{"en-us":"opened","es":"abierto"}}],
["paused",{"id":"https://github.com/UCM-FDI-JaXpi/lib/paused","display":{"en-us":"paused","es":"pausado"}}],
["registered",{"id":"https://github.com/UCM-FDI-JaXpi/lib/registered","display":{"en-us":"registered","es":"registrado"}}],
["rejected",{"id":"https://github.com/UCM-FDI-JaXpi/lib/rejected","display":{"en-us":"rejected","es":"rechazado"}}],
["rotated",{"id":"https://github.com/UCM-FDI-JaXpi/lib/rotated","display":{"en-us":"rotated","es":"rotado"}}],
["shared",{"id":"https://github.com/UCM-FDI-JaXpi/lib/shared","display":{"en-us":"shared","es":"compartido"}}],
["skipped",{"id":"https://github.com/UCM-FDI-JaXpi/lib/skipped","display":{"en-us":"skipped","es":"omitido"}}],
["solvedAPuzzle",{"id":"https://github.com/UCM-FDI-JaXpi/lib/solved-a-puzzle","display":{"en-us":"solved","es":"resuelto"}}],
["sprinted",{"id":"https://github.com/UCM-FDI-JaXpi/lib/sprinted","display":{"en-us":"sprinted","es":"sprint"}}],
["started",{"id":"https://github.com/UCM-FDI-JaXpi/lib/started","display":{"en-us":"started","es":"empezó"}}],
["teleported",{"id":"https://github.com/UCM-FDI-JaXpi/lib/teleported","display":{"en-us":"teleported","es":"teletransportado"}}],
["unlocked",{"id":"https://github.com/UCM-FDI-JaXpi/lib/unlocked","display":{"en-us":"unlocked","es":"desbloqueado"}}],
["upgraded",{"id":"https://github.com/UCM-FDI-JaXpi/lib/upgraded","display":{"en-us":"upgraded","es":"mejorado"}}],
["used",{"id":"https://github.com/UCM-FDI-JaXpi/lib/used","display":{"en-us":"used","es":"utilizado"}}],
["watched",{"id":"https://github.com/UCM-FDI-JaXpi/lib/watched","display":{"en-us":"watched","es":"visto"}}]])

    

    public object = {
      "achievement":{"id":"http://example.com/achievements/achievement","definition":{"type":"Achievement","name":{"en-us":"Achievement 1 completed","es":"Achievement 1 completado"},"description":{"en-us":"You completed achievement 1!","es":"¡Has completado el achievement 1!"},"extensions":{"https://example.com/game/accepted_difficulty":"Easy","https://example.com/game/accepted_level":"1","https://example.com/game/accepted_type":"Exploration","https://example.com/game/accepted_importance":"Medium","https://example.com/game/achieved_difficulty":"Easy","https://example.com/game/achieved_completion_time":"15 minutes","https://example.com/game/achieved_score":500,"https://example.com/game/achieved_date":"2024-03-10","https://example.com/game/completed_time":"5 hours","https://example.com/game/completed_score":10000}}},
      "award":{"id":"http://example.com/achievements/award","definition":{"type":"Special award","name":{"en-us":"Special award","es":"Premio especial"},"description":{"en-us":"Special award earned by achieving a significant milestone in the game","es":"Premio especial obtenido al alcanzar un hito significativo en el juego"},"extensions":{"https://example.com/game/accepted_difficulty":"Hard","https://example.com/game/accepted_level":"10","https://example.com/game/accepted_type":"Combat","https://example.com/game/accepted_importance":"High","https://example.com/game/achieved_difficulty":"Hard","https://example.com/game/achieved_completion_time":"25 minutes","https://example.com/game/achieved_score":1500,"https://example.com/game/achieved_date":"2024-03-09"}}},
      "character":{"id":"http://example.com/character","definition":{"type":"Playable character","name":{"en-us":"Mario","es":"Mario"},"description":{"en-us":"Mario is the main protagonist of the game","es":"Mario es el protagonista del juego"},"extensions":{"https://github.com/UCM-FDI-JaXpi/jumped_distance":5,"https://github.com/UCM-FDI-JaXpi/jumped_units":"meters","https://example.com/game/cancelled_actions":["Jump","Attack"],"https://example.com/game/cancelled_reason":"Obstacle ahead"}}},
      "chest":{"id":"http://example.com/objects/chest","definition":{"type":"Chest","name":{"en-us":"Chest 1","es":"Cofre 1"},"description":{"en-us":"Chest 1 has been closed","es":"El cofre 1 ha sido cerrado"},"extensions":{"https://example.com/game/accessed_locked":true,"https://example.com/game/accessed_lock_type":"Combination","https://example.com/game/accessed_difficulty":"Intermediate","https://example.com/game/accessed_access_time":"2024-03-10T12:00:00","https://example.com/game/accessed_points_earned":50,"https://example.com/game/accessed_items_found":["Gold Coin","Magic Potion"],"https://example.com/game/accessed_visited_times":3,"https://example.com/game/closed_close_time":"2024-03-10T12:15:00","https://example.com/game/opened_open_time":"2024-03-10T12:30:00","https://example.com/game/used_usage_time":"2024-03-10T12:45:00","https://example.com/game/unlocked_time":"2024-03-10T12:50:00"}}},
      "door":{"id":"http://example.com/objects/door","definition":{"type":"Door","name":{"en-us":"Door 1","es":"Puerta 1"},"description":{"en-us":"Door 1 has been closed","es":"La puerta 1 ha sido cerrada"},"extensions":{"https://example.com/game/accessed_locked":true,"https://example.com/game/accessed_lock_type":"Key","https://example.com/game/accessed_difficulty":"Beginner","https://example.com/game/accessed_access_time":"2024-03-10T12:00:00","https://example.com/game/accessed_points_earned":10,"https://example.com/game/accessed_items_found":["Mario"],"https://example.com/game/accessed_visited_times":1,"https://example.com/game/closed_close_time":"2024-03-10T12:15:00","https://example.com/game/opened_open_time":"2024-03-10T12:30:00"}}},
      "enemy":{"id":"http://example.com/enemy","definition":{"type":"Non-playable character","name":{"en-us":"Bowser","es":"Bowser"},"description":{"en-us":"Bowser is the main antagonist of the game","es":"Bowser es el principal antagonista del juego"},"extensions":{"https://github.com/UCM-FDI-JaXpi/jumped_distance":2,"https://github.com/UCM-FDI-JaXpi/jumped_units":"meters","https://example.com/game/cancelled_actions":["Attack"],"https://example.com/game/cancelled_reason":"Insufficient energy"}}},
      "goal":{"id":"http://example.com/goals/goal","definition":{"type":"Goal","name":{"en-us":"Goal 1","es":"Objetivo 1"},"description":{"en-us":"You have achieved goal 1","es":"Has logrado el objetivo 1"},"extensions":{"https://example.com/game/achieved_difficulty":"Easy","https://example.com/game/achieved_completion_time":"4 minutes","https://example.com/game/achieved_score":50,"https://example.com/game/achieved_date":"2024-03-05","https://example.com/game/completed_time":"5 hours","https://example.com/game/completed_score":10000}}},
      "level":{"id":"http://example.com/achievements/level","definition":{"type":"Level","name":{"en-us":"Level 1 completed","es":"Nivel 1 completado"},"description":{"en-us":"You completed level 1!","es":"¡Has completado el nivel 1!"},"extensions":{"https://example.com/game/achieved_difficulty":"Easy","https://example.com/game/achieved_completion_time":"10 minutes","https://example.com/game/achieved_score":700,"https://example.com/game/achieved_date":"2024-03-09","https://example.com/game/completed_time":"5 hours","https://example.com/game/completed_score":10000,"https://example.com/game/started_time":"2024-03-10T08:30:00"}}},
      "mission":{"id":"http://example.com/missions/mission","definition":{"type":"Mission","name":{"en-us":"Mission 1","es":"Misión 1"},"description":{"en-us":"You have accepted mission 1","es":"Has aceptado la misión 1"},"extensions":{"https://example.com/game/accepted_difficulty":"Easy","https://example.com/game/accepted_level":"1","https://example.com/game/accepted_type":"Exploration","https://example.com/game/accepted_importance":"Low","https://example.com/game/completed_time":"5 hours","https://example.com/game/completed_score":10000,"https://example.com/game/cancelled_actions":["Defeat enemy"],"https://example.com/game/cancelled_reason":"Player decision","https://example.com/game/failed_item":"Mission","https://example.com/game/failed_reason":"Failed to locate objective"}}},
      "reward":{"id":"http://example.com/rewards/reward","definition":{"type":"Reward","name":{"en-us":"Reward 1","es":"Recompensa 1"},"description":{"en-us":"You have accepted reward 1","es":"Has aceptado la recompensa 1"},"extensions":{"https://example.com/game/accepted_difficulty":"Easy","https://example.com/game/accepted_level":"1","https://example.com/game/accepted_type":"Exploration","https://example.com/game/accepted_importance":"Low","https://example.com/game/achieved_difficulty":"Easy","https://example.com/game/achieved_completion_time":"3 minutes","https://example.com/game/achieved_score":70,"https://example.com/game/achieved_date":"2024-03-07"}}},
      "room":{"id":"http://example.com/rooms/room","definition":{"type":"Room","name":{"en-us":"Room 1","es":"Habitación 1"},"description":{"en-us":"You have accessed room 1","es":"Has accedido a la habitación 1"},"extensions":{"https://example.com/game/accessed_locked":true,"https://example.com/game/accessed_lock_type":"Combination","https://example.com/game/accessed_difficulty":"Beginner","https://example.com/game/accessed_access_time":"2024-03-10T12:00:00","https://example.com/game/accessed_points_earned":100,"https://example.com/game/accessed_items_found":[""],"https://example.com/game/accessed_visited_times":3,"https://example.com/game/exited_time":"2024-03-10T12:30:00","https://example.com/game/exited_location":"Area 2"}}},
      "task":{"id":"http://example.com/tasks/task","definition":{"type":"Task","name":{"en-us":"Task 1","es":"Tarea 1"},"description":{"en-us":"You have accepted task 1","es":"Has aceptado la tarea 1"},"extensions":{"https://example.com/game/accepted_difficulty":"Easy","https://example.com/game/accepted_level":"1","https://example.com/game/accepted_type":"Exploration","https://example.com/game/accepted_importance":"Low","https://example.com/game/completed_time":"5 hours","https://example.com/game/completed_score":10000,"https://example.com/game/cancelled_actions":["Defeat enemy"],"https://example.com/game/cancelled_reason":"Player decision"}}}
    }


    constructor(player: generate.Player, url: string) {
      this.player = player;
      this.url = url;
      this.isSending = false;
      // Inicia el intervalo de envios de traza cada 5 seg
      this.statementInterval = setInterval(this.statementDequeue.bind(this), TIME_SEND_INTERVAL * 1000); 
      // Registra la función de limpieza para enviar las trazas encoladas cuando el programa finalice
      this.context = {
        instructor: {
            name: 'Irene Instructor', // Esto me lo da server
            mbox: 'mailto:irene@example.com'
        },
        contextActivities: {
            parent: { id: player.sessionId },
            grouping: { id: 'http://example.com/activities/hang-gliding-school' } // player.userId
        },
        extensions: {}
      }
      
      process.on('exit', () => {
        this.statementDequeue();
      });
    }

    private async statementDequeue (){
      try{
        this.isSending = true;
        
        while (this.statementQueue.length != 0 && !this.flagSendError) {
          //console.log("Traza a enviar:\n" + JSON.stringify(this.statementQueue.head, null, 2) + "\n\n");
          const responseReceived = await this.sendStatement()
          // Si no hay respuesta, esperar
          if (!responseReceived) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          console.log("flag = " + this.flagSendError)

          //this.statementQueue.dequeue();
        }
        this.isSending = false;
        this.flagSendError = false;
        console.log("El envio ha terminado, quedan " + this.statementQueue.length + " trazas por enviar");
      } catch (error){
        console.log("error")
      }
    }

    private sendStatement = async () => {
      try {
        if (this.statementQueue.length != 0) {
          const response = await axios.post(this.url, this.statementQueue.head.statement, { // Head es el elemento de la cola que queremos enviar
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 1000
          });
          if (response.status == 201) this.statementQueue.dequeue(); //Si envia exitosamente lo elimina del encolado
          else this.flagSendError = true;  //Si falla activamos la flag para que salga del bucle
          
          console.log('Respuesta:', response.data);
          return true;
        }
      } catch (error) {
          if (axios.isAxiosError(error))
            console.error(error.code);
          this.flagSendError = true;
          console.error('Error al enviar la traza JaXpi sendStatement:', (error as Error).message);
          return false;
      } 
    }

    // Funcion que detiene el intervalo de envios de traza
    public stopStatementInterval() {
      clearInterval(this.statementInterval); // Detiene el temporizador
    }

    public startSendingInterval(seconds: number) {
      clearInterval(this.statementInterval);
      this.statementInterval = setInterval(this.statementDequeue.bind(this), seconds * 1000); //Crea un intervalo cada 'seconds' segundos
    }


    flush = async () => { //Si cliente quiere enviar las trazas encoladas
      await this.queuedPromise;

      if (this.isSending) {
        await this.waitQueue();  // Si se está enviando alguna traza, esperar hasta que se haya completado
      }

      this.statementDequeue();
    }

    private async waitQueue(): Promise<void> {
      return new Promise<void>((resolve) => {
        // Esperar hasta que el envío haya sido completado
        const intervalo = setInterval(() => {
          if (!this.isSending) {
            clearInterval(intervalo);
            resolve();
          }
        }, 100);
      });
    }

    customVerbWithJson(verb: any, object: any) {

      if (checkObject(object) && checkVerb(verb)) {
        //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: generate.generateStatement(this.player, verb, object) });
        this.statementQueue.enqueue(generate.generateStatement(this.player, verb, object, undefined, this.context, undefined));
        if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
      }

    }

    customVerb(verb: string, object: string, parameters: Array<[string,any]>) {

      const [verbJson, objectJson] = generate.generateStatementFromZero(verb, object, parameters);

      //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: generate.generateStatement(this.player, verbJson, objectJson) });
      this.statementQueue.enqueue(generate.generateStatement(this.player, verbJson, objectJson, undefined, this.context, undefined));
      if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
      
    }


    
 
accepted(accepted_difficulty : string,accepted_level : string,accepted_type : string,accepted_importance : string,object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/accepted_difficulty'] = accepted_difficulty;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/accepted_level'] = accepted_level;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/accepted_type'] = accepted_type;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/accepted_importance'] = accepted_importance;
  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/accepted_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("accepted"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
accessed(accessed_locked : boolean,accessed_lock_type : string,accessed_difficulty : string,accessed_access_time : string,accessed_points_earned : number,accessed_items_found : object,accessed_visited_times : number,object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/accessed_locked'] = accessed_locked;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/accessed_lock_type'] = accessed_lock_type;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/accessed_difficulty'] = accessed_difficulty;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/accessed_access_time'] = accessed_access_time;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/accessed_points_earned'] = accessed_points_earned;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/accessed_items_found'] = accessed_items_found;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/accessed_visited_times'] = accessed_visited_times;
  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/accessed_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("accessed"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
achieved(achieved_difficulty : string,achieved_completion_time : string,achieved_score : number,achieved_date : string,object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/achieved_difficulty'] = achieved_difficulty;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/achieved_completion_time'] = achieved_completion_time;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/achieved_score'] = achieved_score;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/achieved_date'] = achieved_date;
  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/achieved_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("achieved"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
cancelled(cancelled_actions : object,cancelled_reason : string,object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/cancelled_actions'] = cancelled_actions;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/cancelled_reason'] = cancelled_reason;
  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/cancelled_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("cancelled"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
chatted(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/chatted_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("chatted"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
clicked(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/clicked_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("clicked"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
climbed(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/climbed_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("climbed"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
closed(closed_close_time : string,object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/closed_close_time'] = closed_close_time;
  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/closed_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("closed"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
combined(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/combined_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("combined"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
completed(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/completed_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("completed"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
connected(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/connected_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("connected"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
crafted(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/crafted_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("crafted"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
dashed(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/dashed_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("dashed"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
defeated(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/defeated_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("defeated"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
died(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/died_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("died"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
discovered(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/discovered_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("discovered"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
doubleJumped(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/doubleJumped_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("doubleJumped"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
earned(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/earned_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("earned"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
equipped(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/equipped_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("equipped"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
examined(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/examined_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("examined"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
exited(exited_time : string,exited_location : string,object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/exited_time'] = exited_time;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/exited_location'] = exited_location;
  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/exited_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("exited"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
explored(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/explored_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("explored"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
failed(failed_item : string,failed_reason : string,object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/failed_item'] = failed_item;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/failed_reason'] = failed_reason;
  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/failed_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("failed"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
fell(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/fell_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("fell"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
jumped(jumped_distance : number,jumped_units : string,object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/jumped_distance'] = jumped_distance;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/jumped_units'] = jumped_units;
  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/jumped_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("jumped"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
launched(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/launched_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("launched"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
loggedIn(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/loggedIn_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("loggedIn"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
loggedOut(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/loggedOut_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("loggedOut"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
moved(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/moved_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("moved"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
navigated(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/navigated_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("navigated"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
opened(opened_open_time : string,object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/opened_open_time'] = opened_open_time;
  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/opened_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("opened"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
paused(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/paused_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("paused"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
registered(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/registered_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("registered"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
rejected(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/rejected_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("rejected"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
rotated(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/rotated_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("rotated"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
shared(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/shared_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("shared"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
skipped(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/skipped_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("skipped"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
solvedAPuzzle(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/solvedAPuzzle_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("solvedAPuzzle"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
sprinted(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/sprinted_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("sprinted"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
started(started_time : string,object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/started_time'] = started_time;
  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/started_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("started"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
teleported(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/teleported_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("teleported"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
unlocked(unlocked_time : string,object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/unlocked_time'] = unlocked_time;
  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/unlocked_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("unlocked"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
upgraded(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/upgraded_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("upgraded"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
used(used_usage_time : string,object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/used_usage_time'] = used_usage_time;
  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/used_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("used"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}
 
watched(object : any,extraParameters?: Array<[string,any]>) { 
  
  if (typeof object === 'string'){
    object = generate.generateObject(object);
  }else if(!checkObject(object))
    throw new Error('El objeto no es valido');
  
  // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
  //   throw new Error('El objeto no esta relacionado con el verbo');
  // }

  if (!object.definition.hasOwnProperty("extensions")) {
    object.definition["extensions"] = {};
  }

  

  if (extraParameters && extraParameters.length > 0) {
    extraParameters.forEach((value, key) => {
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/watched_' + value[0]] = value[1];
    });
  }

  const statement = generate.generateStatement(this.player,this.verbMap.get("watched"), object, undefined, this.context, undefined);
  //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
  this.statementQueue.enqueue(statement);
  if (this.statementQueue.length >= MAX_QUEUE_LENGTH) this.statementDequeue();
}

    }