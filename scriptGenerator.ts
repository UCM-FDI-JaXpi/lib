// script-generate-code.ts
// import a library for file writing
import * as fs from 'fs';
import axios from 'axios';
import {checkVerb,checkObject} from './validateStatement';


const verbObjectRelation: Map<string, string[]> = new Map([
  ["accepted", ["award", "mission", "reward", "task"]],
  ["accessed", ["chest", "door", "room"]],
  ["achieved", ["award", "character", "enemy", "gameCompletion", "goal", "level", "reward"]],
  ["cancelled", ["character", "enemy", "mission", "task"]],    
  ["chatted", ["character", "enemy"]],
  ["clicked", [""]],
  ["climbed", [""]],
  ["closed", ["chest", "door"]],
  ["combined", [""]],
  ["completed", ["gameCompletion", "goal", "level", "mission", "task"]],
  ["connected", [""]],
  ["crafted", [""]],
  ["dashed", [""]],
  ["defeated", ["character", "enemy"]],
  ["died", [""]],
  ["discovered", [""]],
  ["doubleJumped", [""]],
  ["earned", [""]],
  ["equipped", [""]],
  ["examined", [""]],
  ["exited", ["room"]],
  ["explored", [""]],
  ["failed", ["mission"]],
  ["fell", [""]],
  ["jumped", ["character", "enemy"]],
  ["launched", [""]],
  ["loggedIn", [""]],
  ["loggedOut", [""]],
  ["moved", [""]],
  ["navigated", [""]],
  ["opened", ["chest", "door"]],
  ["paused", [""]],
  ["registered", [""]],
  ["rejected", [""]],
  ["rotated", [""]],
  ["shared", [""]],
  ["skipped", [""]],
  ["solvedAPuzzle", [""]],
  ["sprinted", [""]],
  ["started", ["level"]],
  ["teleported", [""]],
  ["unlocked", ["chest"]],
  ["upgraded", [""]],
  ["used", ["chest"]],
  ["watched", [""]],
]);

async function getDataFromURL(url: string) {
  try {
      const response = await fetch(url);
      
      if (!response.ok) {
          throw new Error('No se pudo obtener el archivo JSON');
      }

      const data = await response.json();
      
      return data;
  } catch (error) {
      console.error('Error al obtener datos de la url:', error);
      return null;
  }
}

async function getParameters(verb: any, object: any){
  try{
    let parameters = "";

    if(object === undefined) return parameters;
    if (object.definition.extensions !== undefined) {     //Si existen parametros estos estan en el campo extension de json.object
      for (let field in object.definition.extensions) {
        if (field.substring(field.lastIndexOf("/") + 1).split("_")[0] == verb.id.substring(verb.id.lastIndexOf("/") + 1))   //Comprueba si el parametro de extension es relevante para el verbo
          parameters += field.substring(field.lastIndexOf("/") + 1) + " : " 
            + typeof object.definition.extensions[field] + ",";
      }
      //parameters = parameters.slice(0, -1);
    }

    return parameters;
  }catch(error) {
    console.error('Error en getParameters:', error);
    throw error;
  }
}

function setStatement(parameters: string): string {
  try {
    //let parameters = await parametersPromise; // Espera a que se resuelva la promesa de parameters
    let code = "";

    if (parameters !== "") {
      parameters = parameters.slice(0, -1); // Elimina la última coma (necesaria por customObject)
      let arraystring = parameters.split(",");
      for (let field of Object.values(arraystring)) {
        code += "object.definition.extensions['https://github.com/UCM-FDI-JaXpi/" + field.substring(0, field.lastIndexOf(":") - 1) + "'] = " + field.substring(0, field.lastIndexOf(":") - 1) + ";" + "\n  ";
      }
    }

    return code;
  } catch (error) {
    console.error('Error en setStatement:', error);
    throw error; // Propaga el error para que sea manejado externamente
  }
}


// Función para obtener el JSON del objeto relacionado con un verbo
async function getObjectRelatedToVerb(verb: string): Promise<any | undefined> {
  const objects = verbObjectRelation.get(verb);
  if (objects === undefined || !objects[0]) {
    return undefined;
  }

  try {
    const response = await axios.get(githubApiUrlObjects);
    const files = response.data;

    // Filtra y obtiene solo los archivos JSON de la lista de archivos
    const JSONFiles = files.filter((file: any) => file.name.endsWith('.json'));

    // Busca el objeto relacionado con el verbo para obtener su JSON
    for (const file of JSONFiles) {
      if (file.name === objects[0] + ".json") {
        const object = await getDataFromURL(file.download_url);
        return object;
      }
    }

  } catch (error) {
    console.error('Error al obtener datos del repositorio Git:', error);
    throw error; // Propaga el error para que sea manejado externamente
  }

  return undefined;
}

function getExtensionName(extension: string) : string{
  return extension.substring(extension.lastIndexOf("/") + 1);
}


// This function returns a string with the class with a method for each xapi trace 
async function generateClassWithFunctions(verbs: Map<string,any>, objects: Map<string,any>): Promise<string> {
  try{
    const methodPromises = [...verbs.entries()].map(async ([key, value]) => {    //Necesita esperar a las Promise de todos las funciones o las escribe mal al generar el codigo
                                                                                // [...verbs.entries()] Porque es una estructura map y eso lo convierte a un array para posible uso, tambien seria valido Map.prototype.entries() sin cambiar el map
      
      let parameters = ""
      
      if (value.extensions !== undefined) {     //Si existen parametros estos estan en el campo extension de json.object
        for (let field in value.extensions) {
          parameters += field.substring(field.lastIndexOf("/") + 1) + " : " 
            + typeof value.extensions[field] + ",";
        }
      }

      //const object = await getObjectRelatedToVerb(key);
      //const parameters = await getParameters(value,object);
      const parametersUpdate = setStatement(parameters);
      let params = [];

      //console.log(parameters + "\n" + parametersUpdate);
      for (const extension in value.extensions) {
        const description = value["extensions-doc"][extension];
        if (description) {
          params.push(`@param {${typeof(value.extensions[extension])}} ${getExtensionName(extension)} - ${description}`);
        }
      }

      let object: string[] = [];
      if (value.objects)
        value.objects.forEach((element: string) => {
          object.push(`
      ${element}: (name?:string, description?:string, objectParameters?: Array<[string,any]>) => {

        object = generate.generateObject(this.objects.${element}, name, description)
        
        ${parametersUpdate}
      
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
      
        const statement = generate.generateStatement(this.player, this.verbs.${key}, object, undefined, this.context, undefined);
        this.statementQueue.enqueue(statement);
        if (this.statementQueue.length >= this.MAX_QUEUE_LENGTH) this.flush();
        
      
      }
          `)
        });


      return `
/**
 * ${value.description}
 * ${params.join("\n * ")}
 */ 
${key}(${parameters}extraParameters?: Array<[string,any]>) { 
  
  let object: any;

  return {
    ${object.join("\n,")}
  };
}`;
    });

    const methods = await Promise.all(methodPromises);
    const verbsMap = Array.from(verbs.entries()).map(async ([key, value]) => {
      return `"${key}":${JSON.stringify(value)}`;
    });
    const objectsMap = Array.from(objects.entries()).map(async ([key, value]) => {
      return `"${key}":${JSON.stringify(value)}`;
    });
    const [resolvedVerbsMap, resolvedObjectsMap] = await Promise.all([Promise.all(verbsMap), Promise.all(objectsMap)]);

    //private objectMap = new Map([${resolvedObjectsMap.join(',\n')}])\n
    let codeBody = `
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
  
  

  public verbs = {
    ${resolvedVerbsMap.join(',\n      ')}
  }


  public objects = {
    ${resolvedObjectsMap.join(',\n      ')}
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

        localStorage.setItem(aux,JSON.stringify(this.statementQueue.toArray()))
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
    if (this.statementQueue.length) {
      // Almacena la promesa devuelta por createWorker() en el array de promesas
      this.promises.push(this.createWorker());
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

    localStorage.setItem(aux,JSON.stringify(this.statementQueue.toArray(),null,2))

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

  }\n\n
\n${methods.join('\n')}\n
}`;

    return codeBody;
  } catch (error) {
    console.error('Error al generar el código de la clase:', error);
    throw error; // Propaga el error para que sea manejado externamente
  }
}

// URL de la API de GitHub para obtener el contenido de la carpeta de los verbos y otra de objetos
const githubApiUrlVerbs = 'https://api.github.com/repos/UCM-FDI-JaXpi/lib/contents/verbs';
const githubApiUrlObjects = 'https://api.github.com/repos/UCM-FDI-JaXpi/lib/contents/objects';


async function generateMap(): Promise<{ verbJsonMap: Map<string, any>, objectJsonMap: Map<string, any> }> {
  try {
    const response = await axios.get(githubApiUrlVerbs);
    const response2 = await axios.get(githubApiUrlObjects);
    const objectJsonMap: Map<string,any> = new Map();
    const verbJsonMap: Map<string,any> = new Map();

    if (response.status === 200) {
      const files = response.data;
      const JSONFiles = files.filter((file: any) => file.name.endsWith('.json'));    // Filtra y obtiene solo los archivos JSON de la lista de archivos

      for (const file of JSONFiles) { // Construye el mapa de verbos y URLs dinámicamente
        const json = await getDataFromURL(file.download_url);
        if (checkVerb(json)) {
          const verb = file.name.replace('.json', '');
          verbJsonMap.set(verb, json);
        }
      }
    }

    if (response2.status === 200) {
      const files = response2.data;
      const JSONFiles = files.filter((file: any) => file.name.endsWith('.json'));    // Filtra y obtiene solo los archivos JSON de la lista de archivos

      for (const file of JSONFiles) { // Construye el mapa de objetos y URLs dinámicamente
        const json = await getDataFromURL(file.download_url);
        if (checkObject(json)) {
          const object = file.name.replace('.json', '');
          objectJsonMap.set(object, json);
        }
      }
    }

    return { verbJsonMap, objectJsonMap };
  } catch (error) {
    console.error('Error al obtener datos para construir el mapa de verbos:', error);
    let verbJsonMap = new Map();
    let objectJsonMap = new Map();
    return { verbJsonMap, objectJsonMap };
  }
}

// Llama a la función para generar dinámicamente el mapa de verbos
generateMap()
  .then(async (mapaGenerado) => {
    let generatedCode = await generateClassWithFunctions(mapaGenerado.verbJsonMap,mapaGenerado.objectJsonMap);
    fs.writeFileSync('jaxpiLib.ts', generatedCode);  //JaxPiLib
  })
  .catch((error) => {
    console.error('Error al generar el mapa:', error);
  });
