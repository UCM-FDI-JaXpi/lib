
  // index.ts
  import './worker.js';
  import { Queue } from './queue.js';
  
  import * as generate from './scripts/generateStatement.js';
  import { checkObject, checkVerb } from './scripts/validateStatement.js';

  import axios, { AxiosError } from 'axios';
  
  
  const TIME_INTERVAL_SEND = 5;
  const MAX_QUEUE_LENGTH = 5;
  let instance: Jaxpi | null = null;
  
  
  export default class Jaxpi {
	private worker: Worker;
	private statementQueue: Queue<{ type: string; data: any, id: string }> = new Queue();
	private player: generate.Player;
	private context: any;
	private max_queue_length: number;
	private stat_id: number = 1;
	private promises: Promise<void>[];
	private statementInterval: NodeJS.Timeout | undefined;
  // Objeto para realizar el seguimiento de las promesas y sus funciones resolve y reject
  private promisesMap: Map<string, { resolve: () => void, reject: (reason?: any) => void }> = new Map();
	// private token: string = "-1";
  private sessionKey: string = "";
  
  
  
  
	public verbs = {
    "accepted":{"id":"https://github.com/UCM-FDI-JaXpi/lib/accepted","display":{"en-US":"accepted","es":"aceptado"},"objects":["achievement","award","mission","reward","task"],"description":"The player accepts an object like a task or a reward"},
      "accessed":{"id":"https://github.com/UCM-FDI-JaXpi/lib/accessed","display":{"en-US":"accessed","es":"accedido"},"objects":["chest","door","room","location"],"description":"The player access an object like a room or a new area","extensions":{"https://example.com/game/visited_times":3},"extensions-doc":{"https://example.com/game/visited_times":"Number of times the object has been accessed"}},
      "achieved":{"id":"https://github.com/UCM-FDI-JaXpi/lib/achieved","display":{"en-US":"achieved","es":"logrado"},"objects":["achievement","award","game","goal","level","reward"],"description":"The player achieves something like a level up"},
      "cancelled":{"id":"https://github.com/UCM-FDI-JaXpi/lib/cancelled","display":{"en-US":"cancelled","es":"cancelado"},"objects":["mission","task"],"description":"The player cancels an object like a mission","extensions":{"https://example.com/game/reason":"Obstacle ahead"},"extensions-doc":{"https://example.com/game/reason":"Reason of the cancelation"}},
      "chatted":{"id":"https://github.com/UCM-FDI-JaXpi/lib/chatted","display":{"en-US":"chatted","es":"charló"},"objects":["character"],"description":"The player opens a dialog with an object like a npc"},
      "clicked":{"id":"https://github.com/UCM-FDI-JaXpi/lib/clicked","display":{"en-US":"clicked","es":"clicado"},"objects":["character","item","dialog","door"],"description":"The player interact with an object"},
      "climbed":{"id":"https://github.com/UCM-FDI-JaXpi/lib/climbed","display":{"en-US":"climbed","es":"escalado"},"objects":["location"],"description":"The player climbes an object like a wall"},
      "closed":{"id":"https://w3id.org/xapi/adl/verbs/closed","display":{"en-US":"closed","es":"cerrado"},"objects":["chest","door"],"description":"The player closes an object like a dialog or a door"},
      "combined":{"id":"https://github.com/UCM-FDI-JaXpi/lib/combined","display":{"en-US":"combined","es":"combinado"},"objects":["item"],"description":"The player combines an object with something","extensions":{"https://example.com/game/target":"Item in inventory"},"extensions-doc":{"https://example.com/game/target":"Target of the combination"}},
      "completed":{"id":"https://github.com/UCM-FDI-JaXpi/lib/completed","display":{"en-US":"completed","es":"completado"},"objects":["achievement","game","goal","level","mission","task"],"description":"The player completes an object like a mission or the game","extensions":{"https://example.com/game/score":500},"extensions-doc":{"https://example.com/game/score":"Score reach with the completion"}},
      "connected":{"id":"https://github.com/UCM-FDI-JaXpi/lib/connected","display":{"en-US":"connected","es":"conectado"},"description":"The player connects an object with something"},
      "crafted":{"id":"https://github.com/UCM-FDI-JaXpi/lib/crafted","display":{"en-US":"crafted","es":"elaborado"},"objects":["item"],"description":"The player crafts an object like a new item"},
      "dashed":{"id":"https://github.com/UCM-FDI-JaXpi/lib/dashed","display":{"en-US":"dashed","es":"dash"},"objects":["character"],"description":"The player dashes (no object? or himself?)"},
      "defeated":{"id":"https://github.com/UCM-FDI-JaXpi/lib/defeated","display":{"en-US":"defeated","es":"derrotado"},"objects":["enemy"],"description":"The player defeates an object like a boss"},
      "destroyed":{"id":"https://github.com/UCM-FDI-JaXpi/lib/destroyed","display":{"en-US":"destroyed","es":"destruido"},"objects":["item"],"description":"The player destroys an object like an old item"},
      "died":{"id":"https://github.com/UCM-FDI-JaXpi/lib/died","display":{"en-US":"died","es":"muerto"},"objects":["character","location"],"description":"The player dies (no object? or himself? or what killed him?)"},
      "discovered":{"id":"https://github.com/UCM-FDI-JaXpi/lib/discovered","display":{"en-US":"discovered","es":"descubierto"},"objects":["level","location"],"description":"The player discoveres an object like a new location"},
      "doubleJumped":{"id":"https://github.com/UCM-FDI-JaXpi/lib/double-jumped","display":{"en-US":"double jumped","es":"doble salto"}},
      "earned":{"id":"https://github.com/UCM-FDI-JaXpi/lib/earned","display":{"en-US":"earned","es":"ganado"},"objects":["reward"],"description":"The player earns an object like a reward"},
      "equipped":{"id":"https://github.com/UCM-FDI-JaXpi/lib/equipped","display":{"en-US":"equipped","es":"equipado"},"objects":["item"],"description":"The player equippes an object like a new item"},
      "examined":{"id":"https://github.com/UCM-FDI-JaXpi/lib/examined","display":{"en-US":"examined","es":"examinado"},"objects":["item","room"],"description":"The player examines an object like an item or a room"},
      "exited":{"id":"https://github.com/UCM-FDI-JaXpi/lib/exited","display":{"en-US":"exited","es":"salió"},"objects":["game","level"],"description":"The player exits the game or level"},
      "explored":{"id":"https://github.com/UCM-FDI-JaXpi/lib/explored","display":{"en-US":"explored","es":"explorado"},"objects":["location"],"description":"The player explors an object like a location"},
      "failed":{"id":"https://github.com/UCM-FDI-JaXpi/lib/failed","display":{"en-US":"failed","es":"falló"},"objects":["mission","task","level"],"description":"The player fails an object like a mission"},
      "fellIn":{"id":"https://github.com/UCM-FDI-JaXpi/lib/fellIn","display":{"en-US":"fell in","es":"cayó en"},"objects":["location"],"description":"The player fells in an object like a pit"},
      "jumped":{"id":"https://github.com/UCM-FDI-JaXpi/lib/jumped","display":{"en-US":"jumped","es":"saltado"},"objects":["character","enemy"],"description":"The player jumps (no object? or himself?)","extensions":{"https://github.com/UCM-FDI-JaXpi/distance":5,"https://github.com/UCM-FDI-JaXpi/units":"meters"},"extensions-doc":{"https://github.com/UCM-FDI-JaXpi/distance":"Number of units the object jumped","https://github.com/UCM-FDI-JaXpi/units":"Units in which the distance is expressed"}},
      "launched":{"id":"https://github.com/UCM-FDI-JaXpi/lib/launched","display":{"en-US":"launched","es":"ejecutado"}},
      "loaded":{"id":"https://github.com/UCM-FDI-JaXpi/lib/loaded","display":{"en-US":"loaded","es":"cargado"},"objects":["game","level"],"description":"The player loads the game or a level","extensions":{"https://github.com/UCM-FDI-JaXpi/lib/id_load":"Save number_17 11-02-2024T14:23:00.140Z"},"extensions-doc":{"https://github.com/UCM-FDI-JaXpi/lib/id_load":"Unique id of the load the players choose, if the player reloads the same save the id would also be the same. Example: Save number_17 11-02-2024T14:23:00.140Z"}},
      "loggedIn":{"id":"https://github.com/UCM-FDI-JaXpi/lib/loggedIn","display":{"en-US":"loggedIn","es":"conectado"},"objects":["player"],"description":"The player starts the session"},
      "loggedOut":{"id":"https://github.com/UCM-FDI-JaXpi/lib/loggedOut","display":{"en-US":"loggedOut","es":"desconectado"},"objects":["player"],"description":"The player finalizes the session"},
      "moved":{"id":"https://github.com/UCM-FDI-JaXpi/lib/moved","display":{"en-US":"moved","es":"movido"},"objects":["item"],"description":"The player moves an object like a boulder"},
      "navigated":{"id":"https://github.com/UCM-FDI-JaXpi/lib/navigated","display":{"en-US":"navigated","es":"navegado"},"objects":["location"],"description":"The player navigates a new location"},
      "opened":{"id":"https://github.com/UCM-FDI-JaXpi/lib/opened","display":{"en-US":"opened","es":"abierto"},"objects":["chest","door"],"description":"The player opens an object like a door or a chest"},
      "overloaded":{"id":"https://github.com/UCM-FDI-JaXpi/lib/overloaded","display":{"en-US":"overloaded","es":"sobrecargado"},"objects":["game","level"],"description":"The player loads the game or a level overriding an old one","extensions":{"https://github.com/UCM-FDI-JaXpi/lib/id_load":"Save number_17 11-02-2024T14:23:00.140Z"},"extensions-doc":{"https://github.com/UCM-FDI-JaXpi/lib/id_load":"Unique id of the load the players choose, if the player reloads the same save the id would also be the same. Example: Save number_17 11-02-2024T14:23:00.140Z"}},
      "paused":{"id":"https://github.com/UCM-FDI-JaXpi/lib/paused","display":{"en-US":"paused","es":"pausado"},"objects":["game"],"description":"The player pauses the game"},
      "registered":{"id":"https://github.com/UCM-FDI-JaXpi/lib/registered","display":{"en-US":"registered","es":"registrado"}},
      "rejected":{"id":"https://github.com/UCM-FDI-JaXpi/lib/rejected","display":{"en-US":"rejected","es":"rechazado"}},
      "rotated":{"id":"https://github.com/UCM-FDI-JaXpi/lib/rotated","display":{"en-US":"rotated","es":"rotado"}},
      "shared":{"id":"https://github.com/UCM-FDI-JaXpi/lib/shared","display":{"en-US":"shared","es":"compartido"}},
      "skipped":{"id":"https://github.com/UCM-FDI-JaXpi/lib/skipped","display":{"en-US":"skipped","es":"omitido"},"objects":["dialog"],"description":"The player skips a dialog"},
      "solved":{"id":"https://github.com/UCM-FDI-JaXpi/lib/solved","display":{"en-US":"solved","es":"resuelto"}},
      "sprinted":{"id":"https://github.com/UCM-FDI-JaXpi/lib/sprinted","display":{"en-US":"sprinted","es":"sprint"},"description":"The player jumps (no object? or himself?)"},
      "started":{"id":"https://github.com/UCM-FDI-JaXpi/lib/started","display":{"en-US":"started","es":"empezó"},"objects":["level","game"],"description":"The player starts a level or a new game"},
      "teleported":{"id":"https://github.com/UCM-FDI-JaXpi/lib/teleported","display":{"en-US":"teleported to","es":"teletransportado"},"objects":["location","character"],"description":"The player teleports to a location or a character"},
      "unlocked":{"id":"https://github.com/UCM-FDI-JaXpi/lib/unlocked","display":{"en-US":"unlocked","es":"desbloqueado"},"objects":["chest","skill"],"description":"The player unlocks an object like a chest or a skill"},
      "upgraded":{"id":"https://github.com/UCM-FDI-JaXpi/lib/upgraded","display":{"en-US":"upgraded","es":"mejorado"},"objects":["item"],"description":"The player upgrades an item"},
      "used":{"id":"https://github.com/UCM-FDI-JaXpi/lib/used","display":{"en-US":"used","es":"utilizado"},"objects":["item"],"description":"The player uses an item","extensions":{"https://github.com/UCM-FDI-JaXpi/consumed":false},"extensions-doc":{"https://github.com/UCM-FDI-JaXpi/consumed":"The item is consumed with the use or not"}},
      "watched":{"id":"https://github.com/UCM-FDI-JaXpi/lib/watched","display":{"en-US":"watched","es":"visto"}}
  }
  
  
  public objects = {
    "achievement":{"id":"https://github.com/UCM-FDI-JaXpi/objects/achievement","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Default achievement","es":"Logro por defecto"},"description":{"en-US":"A recognition or accomplishment gained by meeting certain criteria","es":"Un reconocimiento o logro obtenido al cumplir ciertos criterios"}}},
      "award":{"id":"https://github.com/UCM-FDI-JaXpi/objects/award","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Default award","es":"Premio por defecto"},"description":{"en-US":"A prize or honor given to the player for an achievement","es":"Un premio u honor otorgado al jugador por un logro"}}},
      "character":{"id":"https://github.com/UCM-FDI-JaXpi/objects/character","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Default character","es":"Personaje por defecto"},"description":{"en-US":"A persona or figure in the game","es":"Una persona o figura en el juego"}}},
      "chest":{"id":"https://github.com/UCM-FDI-JaXpi/objects/chest","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Default chest","es":"Cofre por defecto"},"description":{"en-US":"A storage container, often used to hold items or rewards, it can require a key or mechanism to unlock","es":"Un contenedor de almacenamiento, que a menudo se usa para guardar artículos o recompensas, puede requerir una llave o mecanismo para desbloquearlo"}}},
      "dialog":{"id":"https://github.com/UCM-FDI-JaXpi/objects/dialog","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Default dialog","es":"Dialogo por defecto"},"description":{"en-US":"Conversation between characters in the game, or a text box in the game providing information or choices to the player","es":"Conversación entre personajes del juego o un cuadro de texto en el juego que proporciona información u opciones al jugador"}}},
      "door":{"id":"https://github.com/UCM-FDI-JaXpi/objects/door","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Default door","es":"Puerta por defecto"},"description":{"en-US":"A movable barrier used to close off an entrance or exit from a room, building, or vehicle","es":"Una barrera móvil utilizada para cerrar una entrada o salida de una habitación, edificio o vehículo"}}},
      "enemy":{"id":"https://github.com/UCM-FDI-JaXpi/objects/enemy","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Default enemy","es":"Enemigo por defecto"},"description":{"en-US":"A hostile individual or group opposing the protagonist in the game","es":"Un individuo o grupo hostil que se opone al protagonista del juego"}}},
      "game":{"id":"https://github.com/UCM-FDI-JaXpi/objects/game","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Default saved game","es":"Juego guardado por defecto"},"description":{"en-US":"A saved state or instance of a video game, representing progress made by the player","es":"Un estado guardado o instancia de un videojuego, que representa el progreso realizado por el jugador"}}},
      "goal":{"id":"https://github.com/UCM-FDI-JaXpi/objects/goal","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Default goal","es":"Objetivo por defecto"},"description":{"en-US":"An objective or target to be achieved, providing direction and motivation in the game","es":"Un objetivo o meta a alcanzar, proporcionando dirección y motivación en el juego"}}},
      "item":{"id":"https://github.com/UCM-FDI-JaXpi/objects/item","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Default item","es":"Objeto por defecto"},"description":{"en-US":"An object or thing of value, often collectible or usable in the game","es":"Un objeto o cosa de valor, a menudo coleccionable o utilizable en el juego"}}},
      "level":{"id":"https://github.com/UCM-FDI-JaXpi/objects/level","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Default level","es":"Nivel por defecto"},"description":{"en-US":"A stage or section in the game","es":"Una etapa o sección del juego"}}},
      "location":{"id":"https://github.com/UCM-FDI-JaXpi/objects/location","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Default ocation","es":"Lugar por defecto"},"description":{"en-US":"A specific place or position relevant to the action of the game","es":"Un lugar o posición específica relevante para la acción del juego"}}},
      "mission":{"id":"https://github.com/UCM-FDI-JaXpi/objects/mission","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Default mission","es":"Misión por defecto"},"description":{"en-US":"A specific task or objective","es":"Una tarea u objetivo específico"}}},
      "player":{"id":"https://github.com/UCM-FDI-JaXpi/objects/player","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Player who use Jaxpi","es":"Jugador que usa Jaxpi"},"description":{"en-US":"Player that connects to the server in wich the statement will be analized","es":"Jugador que se conecta al servidor cuyas trazas seran analizadas"}}},
      "reward":{"id":"https://github.com/UCM-FDI-JaXpi/objects/reward","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Default reward","es":"Recompensa por defecto"},"description":{"en-US":"Something given in recognition of service, effort, or achievement; often used to incentivize desired behavior or completion of tasks of the player","es":"Algo entregado en reconocimiento al servicio, esfuerzo o logro; A menudo se utiliza para incentivar el comportamiento deseado o la finalización de tareas del jugador"}}},
      "room":{"id":"https://github.com/UCM-FDI-JaXpi/objects/room","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Default room","es":"Habitación por defecto"},"description":{"en-US":"A space within a building or structure like a house or a cave","es":"Un espacio dentro de un edificio o estructura como una casa o una cueva"}}},
      "skill":{"id":"https://github.com/UCM-FDI-JaXpi/objects/skill","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Default skill","es":"Habilidad por defecto"},"description":{"en-US":"A player's capability or expertise in executing particular actions, or a distinct move they can use in combat that either enhances their combat abilities or unlocks advancements in the game","es":"La capacidad o experiencia de un jugador para ejecutar acciones particulares, o un movimiento distinto que puede usar en combate y que mejora sus habilidades de combate o desbloquea avances en el juego"}}},
      "task":{"id":"https://github.com/UCM-FDI-JaXpi/objects/task","definition":{"type":"https://github.com/UCM-FDI-JaXpi/object","name":{"en-US":"Default task","es":"Tarea por defecto"},"description":{"en-US":"A piece of work to be done or undertaken, often part of a larger goal for the player","es":"Un trabajo por hacer o emprender, a menudo parte de un objetivo más amplio para el jugador"}}}
  }
  
  
    // @param {string} logInURL - The url of the server to log in.
	  // @param {string} player.password - The password of the player.
	  // constructor(player: generate.Player, private serverUrl: string, private loginUrl: string, private time_interval?: number, private max_queue?: number) {

  
  /**
   * @param {Object} player - Structure that contains player data.
   * @param {string} player.name - The name of the player.
   * @param {string} player.mail - The mail of the player.
   * @param {string} serverURL - The url of the server where statements will be sent.
   * @param {string} token - The token of authentication the server will use to send the statements.
   * @param {string} [time_interval=5] - Number of seconds an interval will try to send the statements to the server. 
   * @param {string} [max_queue=7] - Maximum number of statement per queue before sending. 
   */
	constructor(player: generate.Player, private serverUrl: string, private token: string, private time_interval?: number, private max_queue?: number) {
	  this.context = undefined;
	  this.player = player;
	  this.worker = new Worker(new URL('./worker.js', import.meta.url));

    

    // Dentro del evento 'message', recuperamos el ID de la promesa y llamamos a la función resolve o reject correspondiente
    this.worker.addEventListener('message', (event: any) => {
      const data = event.data;
      if (data.type === 'RESPONSE') {
        const promiseId = data.promiseId;
        const promiseFunctions = this.promisesMap.get(promiseId);
        if (promiseFunctions) {
          promiseFunctions.resolve();
          this.promisesMap.delete(promiseId); // Limpiamos el mapa después de resolver la promesa
        }
      } else if (data.type === 'ERROR') {
        const promiseId = data.promiseId;
        const promiseFunctions = this.promisesMap.get(promiseId);
        if (promiseFunctions) {
          promiseFunctions.reject(data.error);
          this.promisesMap.delete(promiseId); // Limpiamos el mapa después de rechazar la promesa
        }
      } else if (data.type === 'DEQUEUE') {
        // Quitar de localStorage la traza enviada
        localStorage.removeItem(data.stat_id)
      } 
      // else if (data.type === 'LOGIN') {
      //   this.token = data.token;
      // }
    });
	  this.promises = [];
	  // Inicia el tamaño de la cola de trazas. Por defecto MAX_QUEUE_LENGTH
	  if (this.max_queue) this.max_queue_length = this.max_queue
	  else this.max_queue_length = MAX_QUEUE_LENGTH;
	  // Inicia el intervalo de envios de traza. Pod defecto TIME_INTERVAL_SEND
    if (this.time_interval)
      this.statementInterval = setInterval(this.flush.bind(this), 1000 * this.time_interval);
  
	  const self = this;


    // LogIn con el server para generar el token
    //  this.worker.postMessage({ type: 'LOGIN', credentials:{email: this.player.mail, password: this.player.password}, serverUrl: this.loginUrl });
  
	  // Si quedaron trazas por enviar en caso de error o cierre, se encolan para ser enviadas
		  if (localStorage.length) {
			  for (let i = 0; i < localStorage.length; i++) {
				  const key = localStorage.key(i);
          console.log(/^statd+$/.test(key!))
          console.log(localStorage.getItem(key!))
          if (/^statd+$/.test(key!)) {
            const value = localStorage.getItem(key!);
    
            this.statementQueue.enqueue(JSON.parse(value!))
          }
			  }
		  }
  
	  if (typeof window !== undefined){
		let isListening = false;
	  
		async function handleSIGINT() {
		  console.log('SIGINT received');
		  self.flush()
				  await Promise.all(self.promises)
		  .then(() => {
			  console.log('Promesas resueltas, cerrando la ventana...');
			  window.close();  // Cierra la ventana del navegador
			  return;  // Detiene la ejecución del script
		  })
		  .catch((error) => {
			  console.error("Se produjo un error al resolver las promesas:", error);
		  });
		}
  
		function startListening() {
		  if (!isListening) {
			isListening = true;
			window.addEventListener('beforeunload', handleSIGINT);
		  }
		}
	  
		function stopListening() {
		  if (isListening) {
			isListening = false;
			window.removeEventListener('beforeunload', handleSIGINT);
		  }
		}
	  
		// Iniciar la escucha
		startListening();
	  }
  
	  if (instance) {
		return instance;
	  }
	  instance = this;
	}
  
  
	/**
   * Function to send the statements queue to the server, it also creates a backup if the sending fails
   */
	async flush() {
	  this.processQueue();
	}
  
	private async processQueue() {
	  const traces = this.statementQueue.toArray();
	  console.log(traces)
	  if (traces.length > 0) {
		const promise = this.sendTraces(traces);
		this.promises.push(promise);
		try {
		  await promise;

		  //await this.promises.push(this.sendTraces(traces));
		  this.statementQueue = new Queue(); // Limpiar la cola después de enviar
		} catch (error) {
		  console.error('Error al enviar trazas:', error);
		}
	  }
	}
  
  private async sendTraces(traces: { type: string; data: string }[]) {
    return new Promise<void>((resolve, reject) => {
      // Generamos un ID único para esta promesa
      const promiseId = this.generateUniquePromiseId();
      // Guardamos las funciones resolve y reject en el mapa
      this.promisesMap.set(promiseId, { resolve, reject });
  
      this.worker.postMessage({ type: 'SEND_TRACES', traces, token: this.token, serverUrl: this.serverUrl, promiseId });
    });
  }

  // Función para generar un ID único para cada promesa
  private generateUniquePromiseId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  // Función para generar un id unico para cada traza <-----------------------------------------------------------------------------------------------------------------------------------------
	private statementIdCalc(): string{
	  while (localStorage.getItem(`stat${this.stat_id}`) !== null) this.stat_id++;
	  
	  return `stat${this.stat_id}`;
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
   * Function to set the session key of an user
   * @param {string} sessionKey - Key of 6 values that identifies the user
   */
  public setKey(sessionKey: string){
    this.sessionKey = sessionKey
  }

  /**
   * Async function to validate the session key of an user
   * @param {string} sessionKey - Key of 6 values that identifies the user
   * @returns {Promise<boolean>} A promise with the boolean result of the validation
   */
  public async validateKey(sessionKey: string): Promise<boolean> {
    try{
      const response = await axios.get(`http://localhost:3000/publicAPI/key/${sessionKey}`)
      return response.status === 200;

    }catch (error){
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // El servidor respondió con un estado diferente de 2xx
          console.error('Error:', error.response.status, error.response.data);
        } else if (error.request) {
          // La solicitud fue hecha pero no hubo respuesta
          console.error('Error:', error.request);
        } else {
          // Algo pasó al configurar la solicitud
          console.error('Error:', error.message);
        }
      } else {
        console.error('Error:', error);
      }
      return false
    }
  }
  
  /**
   * Function to set the context field of the statement (class / association where it takes places)
   * @param {string} name - Name of the instructor
   * @param {string} mbox - Mail of the instructor
   * @param {string} sessionId - Unique id of the session (class URI)
   * @param {string} groupId - Unique id of the association (college URI)
   * @param {Array<[string,any]>} [parameters] - Extra parameters to add to the statement in context.extensions field
   */
  public setContext(name: string, mbox: string, sessionId: string, groupId: string, parameters?: Array<[string, any]>) {
    this.context = {
      instructor: {
        name: name,
        mbox: "mailto:" + mbox
      },
      contextActivities: {
        parent: { id: "http://example.com/activities/" + sessionId },
        grouping: { id: 'http://example.com/activities/' + groupId }
      },
      extensions: {}
    }
    if (parameters) {
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
   * @param {string | { [x: string]: any; id: any; }} verb - Verb to construct the statement, can be one from jaxpi.verbs list, a JSON with that structure or a simple string
   * @param {string | { [x: string]: any; definition: { [x: string]: any; type: any; }} object - Object to construct the statement, can be one from jaxpi.objects list, a JSON with that structure or a simple string
   * @param {Array<[string,any]>} [parameters] - Extra parameters to add to the statement in object.extensions field
   * @param {any} [context] - Adds a field context for the statement
   * @param {any} [result] - Adds a field result for the statement
   * @param {any} [authority] - Adds a field authority for the statement
   */
  customVerb(verb: string | { [x: string]: any; id: any; }, object: string | { [x: string]: any; definition: { [x: string]: any; type: any; }; id: any; }, parameters?: Array<[string, any]>, result?: any, context?: any, authority?: any) {

    if (checkObject(object) || typeof object === "string") {
      if (checkVerb(verb) || typeof verb === "string") {
        const [verbJson, objectJson] = generate.generateStatementFromZero(verb, object, parameters);

        //this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: generate.generateStatement(this.player, verbJson, objectJson) });
        let statement = generate.generateStatement(this.player, verbJson, objectJson, this.sessionKey, undefined, this.context, undefined)
        let id = this.statementIdCalc()
    
        this.statementQueue.enqueue({type: 'accepted/achievement', data: statement, id: id});
        //this.statementQueue.enqueue({type: 'custom', data: statement});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
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
accepted() { 
  
  let object: any;

  return {
    
      /**
        * A recognition or accomplishment gained by meeting certain criteria
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      achievement: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.achievement, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi accepted/achievement = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.accepted, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'accepted/achievement', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A prize or honor given to the player for an achievement
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      award: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.award, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi accepted/award = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.accepted, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'accepted/award', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A specific task or objective
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      mission: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.mission, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi accepted/mission = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.accepted, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'accepted/mission', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * Something given in recognition of service, effort, or achievement; often used to incentivize desired behavior or completion of tasks of the player
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      reward: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.reward, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi accepted/reward = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.accepted, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'accepted/reward', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A piece of work to be done or undertaken, often part of a larger goal for the player
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      task: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.task, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi accepted/task = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.accepted, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'accepted/task', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player access an object like a room or a new area
 * @param {number} visited_times - Number of times the object has been accessed
 */ 
accessed(visited_times : number,) { 
  
  let object: any;

  return {
    
      /**
        * A storage container, often used to hold items or rewards, it can require a key or mechanism to unlock
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      chest: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.chest, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/visited_times'] = visited_times;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi accessed/chest = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.accessed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'accessed/chest', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A movable barrier used to close off an entrance or exit from a room, building, or vehicle
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      door: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.door, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/visited_times'] = visited_times;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi accessed/door = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.accessed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'accessed/door', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A space within a building or structure like a house or a cave
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      room: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.room, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/visited_times'] = visited_times;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi accessed/room = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.accessed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'accessed/room', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A specific place or position relevant to the action of the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      location: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.location, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/visited_times'] = visited_times;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi accessed/location = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.accessed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'accessed/location', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player achieves something like a level up
 * 
 */ 
achieved() { 
  
  let object: any;

  return {
    
      /**
        * A recognition or accomplishment gained by meeting certain criteria
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      achievement: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.achievement, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi achieved/achievement = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.achieved, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'achieved/achievement', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A prize or honor given to the player for an achievement
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      award: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.award, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi achieved/award = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.achieved, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'achieved/award', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A saved state or instance of a video game, representing progress made by the player
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      game: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.game, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi achieved/game = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.achieved, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'achieved/game', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * An objective or target to be achieved, providing direction and motivation in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      goal: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.goal, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi achieved/goal = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.achieved, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'achieved/goal', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A stage or section in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      level: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.level, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi achieved/level = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.achieved, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'achieved/level', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * Something given in recognition of service, effort, or achievement; often used to incentivize desired behavior or completion of tasks of the player
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      reward: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.reward, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi achieved/reward = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.achieved, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'achieved/reward', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player cancels an object like a mission
 * @param {string} reason - Reason of the cancelation
 */ 
cancelled(reason : string,) { 
  
  let object: any;

  return {
    
      /**
        * A specific task or objective
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      mission: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.mission, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/reason'] = reason;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi cancelled/mission = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.cancelled, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'cancelled/mission', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A piece of work to be done or undertaken, often part of a larger goal for the player
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      task: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.task, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/reason'] = reason;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi cancelled/task = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.cancelled, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'cancelled/task', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player opens a dialog with an object like a npc
 * 
 */ 
chatted() { 
  
  let object: any;

  return {
    
      /**
        * A persona or figure in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      character: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.character, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi chatted/character = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.chatted, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'chatted/character', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player interact with an object
 * 
 */ 
clicked() { 
  
  let object: any;

  return {
    
      /**
        * A persona or figure in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      character: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.character, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi clicked/character = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.clicked, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'clicked/character', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * An object or thing of value, often collectible or usable in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      item: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.item, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi clicked/item = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.clicked, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'clicked/item', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * Conversation between characters in the game, or a text box in the game providing information or choices to the player
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      dialog: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.dialog, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi clicked/dialog = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.clicked, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'clicked/dialog', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A movable barrier used to close off an entrance or exit from a room, building, or vehicle
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      door: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.door, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi clicked/door = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.clicked, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'clicked/door', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player climbes an object like a wall
 * 
 */ 
climbed() { 
  
  let object: any;

  return {
    
      /**
        * A specific place or position relevant to the action of the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      location: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.location, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi climbed/location = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.climbed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'climbed/location', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player closes an object like a dialog or a door
 * 
 */ 
closed() { 
  
  let object: any;

  return {
    
      /**
        * A storage container, often used to hold items or rewards, it can require a key or mechanism to unlock
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      chest: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.chest, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi closed/chest = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.closed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'closed/chest', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A movable barrier used to close off an entrance or exit from a room, building, or vehicle
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      door: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.door, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi closed/door = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.closed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'closed/door', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player combines an object with something
 * @param {string} target - Target of the combination
 */ 
combined(target : string,) { 
  
  let object: any;

  return {
    
      /**
        * An object or thing of value, often collectible or usable in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      item: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.item, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/target'] = target;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi combined/item = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.combined, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'combined/item', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player completes an object like a mission or the game
 * @param {number} score - Score reach with the completion
 */ 
completed(score : number,) { 
  
  let object: any;

  return {
    
      /**
        * A recognition or accomplishment gained by meeting certain criteria
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      achievement: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.achievement, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi completed/achievement = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.completed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'completed/achievement', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A saved state or instance of a video game, representing progress made by the player
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      game: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.game, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi completed/game = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.completed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'completed/game', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * An objective or target to be achieved, providing direction and motivation in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      goal: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.goal, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi completed/goal = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.completed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'completed/goal', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A stage or section in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      level: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.level, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi completed/level = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.completed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'completed/level', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A specific task or objective
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      mission: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.mission, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi completed/mission = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.completed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'completed/mission', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A piece of work to be done or undertaken, often part of a larger goal for the player
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      task: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.task, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/score'] = score;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi completed/task = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.completed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'completed/task', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player connects an object with something
 * 
 */ 
connected() { 
  
  let object: any;

  return {
    
  };
}

/**
 * The player crafts an object like a new item
 * 
 */ 
crafted() { 
  
  let object: any;

  return {
    
      /**
        * An object or thing of value, often collectible or usable in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      item: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.item, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi crafted/item = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.crafted, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'crafted/item', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player dashes (no object? or himself?)
 * 
 */ 
dashed() { 
  
  let object: any;

  return {
    
      /**
        * A persona or figure in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      character: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.character, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi dashed/character = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.dashed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'dashed/character', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player defeates an object like a boss
 * 
 */ 
defeated() { 
  
  let object: any;

  return {
    
      /**
        * A hostile individual or group opposing the protagonist in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      enemy: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.enemy, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi defeated/enemy = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.defeated, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'defeated/enemy', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player destroys an object like an old item
 * 
 */ 
destroyed() { 
  
  let object: any;

  return {
    
      /**
        * An object or thing of value, often collectible or usable in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      item: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.item, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi destroyed/item = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.destroyed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'destroyed/item', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player dies (no object? or himself? or what killed him?)
 * 
 */ 
died() { 
  
  let object: any;

  return {
    
      /**
        * A persona or figure in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      character: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.character, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi died/character = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.died, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'died/character', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A specific place or position relevant to the action of the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      location: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.location, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi died/location = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.died, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'died/location', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player discoveres an object like a new location
 * 
 */ 
discovered() { 
  
  let object: any;

  return {
    
      /**
        * A stage or section in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      level: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.level, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi discovered/level = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.discovered, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'discovered/level', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A specific place or position relevant to the action of the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      location: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.location, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi discovered/location = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.discovered, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'discovered/location', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * undefined
 * 
 */ 
doubleJumped() { 
  
  let object: any;

  return {
    
  };
}

/**
 * The player earns an object like a reward
 * 
 */ 
earned() { 
  
  let object: any;

  return {
    
      /**
        * Something given in recognition of service, effort, or achievement; often used to incentivize desired behavior or completion of tasks of the player
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      reward: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.reward, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi earned/reward = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.earned, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'earned/reward', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player equippes an object like a new item
 * 
 */ 
equipped() { 
  
  let object: any;

  return {
    
      /**
        * An object or thing of value, often collectible or usable in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      item: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.item, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi equipped/item = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.equipped, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'equipped/item', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player examines an object like an item or a room
 * 
 */ 
examined() { 
  
  let object: any;

  return {
    
      /**
        * An object or thing of value, often collectible or usable in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      item: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.item, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi examined/item = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.examined, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'examined/item', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A space within a building or structure like a house or a cave
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      room: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.room, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi examined/room = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.examined, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'examined/room', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player exits the game or level
 * 
 */ 
exited() { 
  
  let object: any;

  return {
    
      /**
        * A saved state or instance of a video game, representing progress made by the player
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      game: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.game, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi exited/game = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.exited, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'exited/game', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A stage or section in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      level: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.level, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi exited/level = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.exited, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'exited/level', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player explors an object like a location
 * 
 */ 
explored() { 
  
  let object: any;

  return {
    
      /**
        * A specific place or position relevant to the action of the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      location: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.location, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi explored/location = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.explored, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'explored/location', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player fails an object like a mission
 * 
 */ 
failed() { 
  
  let object: any;

  return {
    
      /**
        * A specific task or objective
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      mission: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.mission, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi failed/mission = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.failed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'failed/mission', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A piece of work to be done or undertaken, often part of a larger goal for the player
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      task: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.task, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi failed/task = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.failed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'failed/task', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A stage or section in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      level: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.level, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi failed/level = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.failed, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'failed/level', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player fells in an object like a pit
 * 
 */ 
fellIn() { 
  
  let object: any;

  return {
    
      /**
        * A specific place or position relevant to the action of the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      location: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.location, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi fellIn/location = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.fellIn, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'fellIn/location', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player jumps (no object? or himself?)
 * @param {number} distance - Number of units the object jumped
 * @param {string} units - Units in which the distance is expressed
 */ 
jumped(distance : number,units : string,) { 
  
  let object: any;

  return {
    
      /**
        * A persona or figure in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      character: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.character, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/distance'] = distance;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/units'] = units;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi jumped/character = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.jumped, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'jumped/character', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A hostile individual or group opposing the protagonist in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      enemy: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.enemy, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/distance'] = distance;
  object.definition.extensions['https://github.com/UCM-FDI-JaXpi/units'] = units;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi jumped/enemy = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.jumped, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'jumped/enemy', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * undefined
 * 
 */ 
launched() { 
  
  let object: any;

  return {
    
  };
}

/**
 * The player loads the game or a level
 * @param {string} id_load - Unique id of the load the players choose, if the player reloads the same save the id would also be the same. Example: Save number_17 11-02-2024T14:23:00.140Z
 */ 
loaded(id_load : string,) { 
  
  let object: any;

  return {
    
      /**
        * A saved state or instance of a video game, representing progress made by the player
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      game: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.game, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/id_load'] = id_load;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi loaded/game = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.loaded, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'loaded/game', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A stage or section in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      level: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.level, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/id_load'] = id_load;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi loaded/level = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.loaded, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'loaded/level', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player starts the session
 * 
 */ 
loggedIn() { 
  
  let object: any;

  return {
    
      /**
        * Player that connects to the server in wich the statement will be analized
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      player: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.player, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi loggedIn/player = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.loggedIn, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'loggedIn/player', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player finalizes the session
 * 
 */ 
loggedOut() { 
  
  let object: any;

  return {
    
      /**
        * Player that connects to the server in wich the statement will be analized
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      player: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.player, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi loggedOut/player = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.loggedOut, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'loggedOut/player', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player moves an object like a boulder
 * 
 */ 
moved() { 
  
  let object: any;

  return {
    
      /**
        * An object or thing of value, often collectible or usable in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      item: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.item, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi moved/item = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.moved, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'moved/item', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player navigates a new location
 * 
 */ 
navigated() { 
  
  let object: any;

  return {
    
      /**
        * A specific place or position relevant to the action of the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      location: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.location, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi navigated/location = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.navigated, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'navigated/location', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player opens an object like a door or a chest
 * 
 */ 
opened() { 
  
  let object: any;

  return {
    
      /**
        * A storage container, often used to hold items or rewards, it can require a key or mechanism to unlock
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      chest: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.chest, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi opened/chest = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.opened, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'opened/chest', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A movable barrier used to close off an entrance or exit from a room, building, or vehicle
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      door: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.door, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi opened/door = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.opened, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'opened/door', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player loads the game or a level overriding an old one
 * @param {string} id_load - Unique id of the load the players choose, if the player reloads the same save the id would also be the same. Example: Save number_17 11-02-2024T14:23:00.140Z
 */ 
overloaded(id_load : string,) { 
  
  let object: any;

  return {
    
      /**
        * A saved state or instance of a video game, representing progress made by the player
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      game: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.game, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/id_load'] = id_load;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi overloaded/game = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.overloaded, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'overloaded/game', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A stage or section in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      level: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.level, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/id_load'] = id_load;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi overloaded/level = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.overloaded, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'overloaded/level', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player pauses the game
 * 
 */ 
paused() { 
  
  let object: any;

  return {
    
      /**
        * A saved state or instance of a video game, representing progress made by the player
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      game: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.game, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi paused/game = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.paused, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'paused/game', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * undefined
 * 
 */ 
registered() { 
  
  let object: any;

  return {
    
  };
}

/**
 * undefined
 * 
 */ 
rejected() { 
  
  let object: any;

  return {
    
  };
}

/**
 * undefined
 * 
 */ 
rotated() { 
  
  let object: any;

  return {
    
  };
}

/**
 * undefined
 * 
 */ 
shared() { 
  
  let object: any;

  return {
    
  };
}

/**
 * The player skips a dialog
 * 
 */ 
skipped() { 
  
  let object: any;

  return {
    
      /**
        * Conversation between characters in the game, or a text box in the game providing information or choices to the player
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      dialog: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.dialog, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi skipped/dialog = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.skipped, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'skipped/dialog', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * undefined
 * 
 */ 
solved() { 
  
  let object: any;

  return {
    
  };
}

/**
 * The player jumps (no object? or himself?)
 * 
 */ 
sprinted() { 
  
  let object: any;

  return {
    
  };
}

/**
 * The player starts a level or a new game
 * 
 */ 
started() { 
  
  let object: any;

  return {
    
      /**
        * A stage or section in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      level: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.level, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi started/level = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.started, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'started/level', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A saved state or instance of a video game, representing progress made by the player
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      game: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.game, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi started/game = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.started, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'started/game', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player teleports to a location or a character
 * 
 */ 
teleported() { 
  
  let object: any;

  return {
    
      /**
        * A specific place or position relevant to the action of the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      location: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.location, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi teleported/location = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.teleported, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'teleported/location', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A persona or figure in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      character: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.character, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi teleported/character = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.teleported, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'teleported/character', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player unlocks an object like a chest or a skill
 * 
 */ 
unlocked() { 
  
  let object: any;

  return {
    
      /**
        * A storage container, often used to hold items or rewards, it can require a key or mechanism to unlock
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      chest: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.chest, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi unlocked/chest = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.unlocked, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'unlocked/chest', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
,
      /**
        * A player's capability or expertise in executing particular actions, or a distinct move they can use in combat that either enhances their combat abilities or unlocks advancements in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      skill: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.skill, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi unlocked/skill = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.unlocked, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'unlocked/skill', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player upgrades an item
 * 
 */ 
upgraded() { 
  
  let object: any;

  return {
    
      /**
        * An object or thing of value, often collectible or usable in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      item: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.item, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi upgraded/item = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.upgraded, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'upgraded/item', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * The player uses an item
 * @param {boolean} consumed - The item is consumed with the use or not
 */ 
used(consumed : boolean,) { 
  
  let object: any;

  return {
    
      /**
        * An object or thing of value, often collectible or usable in the game
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      item: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.item, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        object.definition.extensions['https://github.com/UCM-FDI-JaXpi/consumed'] = consumed;
  
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(`JaXpi used/item = "${name}" statement enqueued`)


        const statement = generate.generateStatement(this.player, this.verbs.used, object, this.sessionKey, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify(statement))
        this.statementQueue.enqueue({type: 'used/item', data: statement, id: id});
        if (this.statementQueue.length >= this.max_queue_length) this.flush();
        
      
      }
          
  };
}

/**
 * undefined
 * 
 */ 
watched() { 
  
  let object: any;

  return {
    
  };
}

}