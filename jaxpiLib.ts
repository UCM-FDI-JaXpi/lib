  import { Player, generateStatement, generateStatementFromZero } from './generateStatement';
  import { checkObject, checkVerb } from './validateStatement';
  import axios from 'axios';
  import { Queue } from 'queue-typescript';


  export class Jaxpi {
    private player: Player;
    private url: string;
    private isSending: boolean;
    private statementQueue = new Queue<any>();
    private queuedPromise: Promise<void> = Promise.resolve(); // Inicializamos una promesa resuelta
    //private statementInterval: NodeJS.Timeout;

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
["teleported",{"id":"https://github.com/UCM-FDI-JaXpi/lib/teleported","display":{"en-us":"teleported","es":"teletransportado"}}],
["upgraded",{"id":"https://github.com/UCM-FDI-JaXpi/lib/upgraded","display":{"en-us":"upgraded","es":"mejorado"}}],
["used",{"id":"https://github.com/UCM-FDI-JaXpi/lib/used","display":{"en-us":"used","es":"utilizado"}}],
["watched",{"id":"https://github.com/UCM-FDI-JaXpi/lib/watched","display":{"en-us":"watched","es":"visto"}}]])

    private objectMap = new Map([["characterOne",{"id":"http://example.com/character-one","definition":{"type":"Playable character","name":{"en-us":"Mario","es":"Mario"},"description":{"en-us":"Mario is the main protagonist of the game","es":"Mario es el protagonista del juego"},"extensions":{"https://github.com/UCM-FDI-JaXpi/jumped_distance":5,"https://github.com/UCM-FDI-JaXpi/jumped_units":"meters","https://github.com/UCM-FDI-JaXpi/attacked_damage":15}}}],
["characterTwo",{"id":"http://example.com/character-two","definition":{"type":"Playable character","name":{"en-us":"Luigi","es":"Luigi"},"description":{"en-us":"Luigi is Mario's brother and a playable character","es":"Luigi es el hermano de Mario y un personaje jugable"},"extensions":{"https://github.com/UCM-FDI-JaXpi/jumped_distance":6,"https://github.com/UCM-FDI-JaXpi/jumped_units":"meters","https://github.com/UCM-FDI-JaXpi/attacked_damage":12}}}],
["chest",{"id":"http://example.com/objects/chest","definition":{"type":"Chest","name":{"en-us":"Chest 1","es":"Cofre 1"},"description":{"en-us":"Chest 1 has been closed","es":"El cofre 1 ha sido cerrado"},"extensions":{"https://example.com/game/chest_locked":true,"https://example.com/game/chest_lock_type":"Combination"}}}],
["door",{"id":"http://example.com/objects/door","definition":{"type":"Door","name":{"en-us":"Door 1","es":"Puerta 1"},"description":{"en-us":"Door 1 has been closed","es":"La puerta 1 ha sido cerrada"},"extensions":{"https://example.com/game/door_locked":true,"https://example.com/game/door_lock_type":"Key"}}}],
["enemy",{"id":"http://example.com/enemy","definition":{"type":"Non-playable character","name":{"en-us":"Bowser","es":"Bowser"},"description":{"en-us":"Bowser is the main antagonist of the game","es":"Bowser es el principal antagonista del juego"},"extensions":{"https://github.com/UCM-FDI-JaXpi/attacked_damage":20}}}],
["goal",{"id":"http://example.com/goals/goal","definition":{"type":"Goal","name":{"en-us":"Goal 1","es":"Objetivo 1"},"description":{"en-us":"You have achieved goal 1","es":"Has logrado el objetivo 1"},"extensions":{"https://example.com/game/goal_difficulty":"Hard"}}}],
["level1Complete",{"id":"http://example.com/achievements/level-1-complete","definition":{"type":"Achievement","name":{"en-us":"Level 1 complete","es":"Nivel 1 completado"},"description":{"en-us":"You completed level 1!","es":"¡Has completado el nivel 1!"},"extensions":{"https://example.com/game/level_difficulty":"Easy","https://example.com/game/level_completion_time":"15 minutes","https://example.com/game/level_score":500}}}],
["mission",{"id":"http://example.com/missions/mission","definition":{"type":"Mission","name":{"en-us":"Mission 1","es":"Misión 1"},"description":{"en-us":"You have accepted mission 1","es":"Has aceptado la misión 1"},"extensions":{"https://example.com/game/mission_difficulty":"Medium","https://example.com/game/mission_duration":"30 minutes"}}}],
["reward",{"id":"http://example.com/rewards/reward","definition":{"type":"Reward","name":{"en-us":"Reward 1","es":"Recompensa 1"},"description":{"en-us":"You have accepted reward 1","es":"Has aceptado la recompensa 1"},"extensions":{"https://example.com/game/reward_type":"Experience points","https://example.com/game/reward_value":100}}}],
["room",{"id":"http://example.com/rooms/room","definition":{"type":"Room","name":{"en-us":"Room 1","es":"Habitación 1"},"description":{"en-us":"You have accessed room 1","es":"Has accedido a la habitación 1"},"extensions":{"https://example.com/game/room_difficulty":"Medium","https://example.com/game/room_type":"Puzzle","https://example.com/game/room_visited_times":3}}}],
["specialAward",{"id":"http://example.com/achievements/special-award","definition":{"type":"Special award","name":{"en-us":"Special award","es":"Premio especial"},"description":{"en-us":"Special award earned by achieving a significant milestone in the game","es":"Premio especial obtenido al alcanzar un hito significativo en el juego"},"extensions":{"https://example.com/game/special_award_value":"Gold"}}}],
["task",{"id":"http://example.com/tasks/task","definition":{"type":"Task","name":{"en-us":"Task 1","es":"Tarea 1"},"description":{"en-us":"You have accepted task 1","es":"Has aceptado la tarea 1"},"extensions":{"https://example.com/game/task_difficulty":"Easy","https://example.com/game/task_importance":"High"}}}]])



    constructor(player: Player, url: string) {
      this.player = player;
      this.url = url;
      this.isSending = false;

      //this.statementInterval = setInterval(this.sendStatementsInterval.bind(this), 300); // Inicia el intervalo de envios de traza cada 5 seg
    }


    private enqueueAction(action: () => Promise<void>) {
      // Creamos una nueva promesa que se resolverá una vez que la traza se haya encolado
      this.queuedPromise = this.queuedPromise.then(async () => {
        await action();
      });
    }

    private sendStatement = async () => {
      try {
        if (this.statementQueue.length != 0) {
          this.isSending = true;

          const response = await axios.post(this.url, this.statementQueue.tail.statement, { //Entiendo que tail es el elemento de la cola que queremos enviar
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.status == 201) this.statementQueue.dequeue(); //Si envia exitosamente lo elimina del encolado
          //Si falla no hacemos nada
          console.log('Respuesta:', response.data);

        }
      } catch (error) {
        console.error('Error al enviar la traza JaXpi:', (error as Error).message);
      }
      this.isSending = false;
    };

    // private sendStatementsInterval() {
    //   this.sendStatement();
    // }

    // // Funcion que detiene el intervalo de envios de traza
    // public stopStatementInterval() {
    //   clearInterval(this.statementInterval); // Detiene el temporizador
    // }


    flush = async () => { //Si cliente quiere limpiar el encolado por lo que sea
      await this.queuedPromise;

      if (this.isSending) {
        await this.waitQueue();  // Si se está enviando alguna traza, esperar hasta que se haya completado
      }

      this.isSending = true;

      if (this.statementQueue.length != 0) {
        console.log("Primera traza a enviar:\n" + JSON.stringify(this.statementQueue.tail.statement, null, 2) + "\n\n");
        this.sendStatement()
        
        //this.statementQueue.dequeue();
      }
      else
        console.log("La cola de trazas esta vacia");

      this.isSending = false;
    };

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
        this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: generateStatement(this.player, verb, object) });
      }

    }

    customVerb(verb: string, object: string, parameters: Map<string, any>) {

      const [verbJson, objectJson] = generateStatementFromZero(verb, object, parameters);

      this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: generateStatement(this.player, verbJson, objectJson) });

    }


    
 accepted(object1: string,object? : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("accepted"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 accessed(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("accessed"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 achieved(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("achieved"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 cancelled(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("cancelled"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 chatted(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("chatted"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 clicked(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("clicked"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 climbed(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("climbed"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 closed(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("closed"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 combined(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("combined"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 completed(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("completed"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 connected(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("connected"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 crafted(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("crafted"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 dashed(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("dashed"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 defeated(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("defeated"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 died(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("died"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 discovered(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("discovered"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 doubleJumped(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("doubleJumped"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 earned(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("earned"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 equipped(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("equipped"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 examined(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("examined"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 exited(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("exited"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 explored(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("explored"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 fell(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("fell"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 jumped(jumped_distance : number,jumped_units : string,object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          object.definition.extensions['https://github.com/UCM-FDI-JaXpi/jumped_distance'] = jumped_distance;
object.definition.extensions['https://github.com/UCM-FDI-JaXpi/jumped_units'] = jumped_units;


          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("jumped"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 launched(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("launched"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 loggedIn(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("loggedIn"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 loggedOut(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("loggedOut"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 moved(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("moved"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 navigated(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("navigated"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 opened(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("opened"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 paused(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("paused"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 registered(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("registered"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 rejected(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("rejected"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 rotated(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("rotated"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 shared(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("shared"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 skipped(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("skipped"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 solvedAPuzzle(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("solvedAPuzzle"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 sprinted(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("sprinted"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 teleported(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("teleported"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 upgraded(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("upgraded"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 used(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("used"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }
 watched(object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("watched"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }

    }