// script-generate-code.ts
// import a library for file writing
//import * as fs from 'fs';
//const fs = require ('fs');
//const path = require ('fs');
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path'

//const postAxios = require ('../../src/worker.ts')
//import axios from 'axios';
//import axios from "../../node_modules/axios/index";
//const axios = require ('axios');
//const { checkVerb, checkObject } = require('./validateStatement');
import {checkVerb,checkObject} from './validateStatement.js';


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

function getExtensionName(extension: string) : string{
  return extension.substring(extension.lastIndexOf("/") + 1);
}


// This function returns a string with the class with a method for each xapi trace 
async function generateClassWithFunctions(verbs: Map<string,any>, objects: Map<string,any>): Promise<string> {
  try{
    const methodPromises = [...verbs.entries()].map(async ([key, value]) => {    //Necesita esperar a las Promise de todos las funciones o las escribe mal al generar el codigo
                                                                                // [...verbs.entries()] Porque es una estructura map y eso lo convierte a un array para posible uso, tambien seria valido Map.prototype.entries() sin cambiar el map
      
      let parameters = ""
      
      if (value.extensions !== undefined) {     //Si existen parametros estos estan en el campo extension del json verb
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
      /**
        * ${objects.get(element).definition.description["en-US"]}
        * @param {string} name - Unique name that identifies the object
        * @param {string} [description] - Description on the object you are including
        * @param {Array<[string,any]>} [extraParameters] - Extra parameters to add to the statement in object.extensions field
        * @param {any} [context] - Adds a field context for the statement
        * @param {any} [result] - Adds a field result for the statement
        * @param {any} [authority] - Adds a field authority for the statement
        */ 
      ${element}: (name:string, description?:string, extraParameters?: Array<[string,any]>, result?: any, context?: any, authority?: any) => {

        object = generate.generateObject(this.objects.${element}, name, description)
		    let tcontext = this.context;
        if (context) tcontext = context
        
        ${parametersUpdate}
      
        if (extraParameters && extraParameters.length > 0) {
          extraParameters.forEach((value) => {
              object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + value[0]] = value[1];
          });
        }
		
		    console.log(\`JaXpi ${key}/${element} = "\${name}" statement enqueued\`)


        const statement = generate.generateStatement(this.player, this.verbs.${key}, object, this.session_key, result, tcontext, authority);
		    let id = this.statementIdCalc()

        localStorage.setItem(id,JSON.stringify({record: JSON.stringify(statement), attempts: 0, lastAttempt: new Date().toISOString()}))
        //localStorage.setItem(id,JSON.stringify(statement))
        this.records_queue.enqueue({type: '${key}/${element}', data: statement, id: id});
        if (this.records_queue.length >= this.max_queue_length) this.flush();
        
      
      }
          `)
        });


      return `
/**
 * ${value.description}
 * ${params.join("\n * ")}
 */ 
${key}(${parameters}) { 
  
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
    let codeBody = `// index.ts
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
private records_queue: Queue<{ type: string; data: any, id: string }> = new Queue();
private player: generate.Player;
private context: any;
private max_queue_length: number;
private record_id: number = 1;
private promises: Promise<void>[];
private recordsInterval: NodeJS.Timeout | undefined;
// Objeto para realizar el seguimiento de las promesas y sus funciones resolve y reject
private promisesMap: Map<string, { resolve: () => void, reject: (reason?: any) => void }> = new Map();
// private token: string = "-1";
private session_key: string = "";
  
  
  
  
public verbs = {
  ${resolvedVerbsMap.join(',\n  ')}
}


public objects = {
  ${resolvedObjectsMap.join(',\n  ')}
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
      // Actualiza los campos de record en localStorage para controlar el nº de intentos fallidos de envio
      const recordData = JSON.parse(localStorage.getItem(data.record_id)!);
      recordData.attempts += 1;
      recordData.lastAttempt = new Date().toISOString(); // Si la traza se encolo hace mas de 24 horas se borra
      localStorage.setItem(data.record_id, JSON.stringify(recordData));

      const promiseId = data.promiseId;
      const promiseFunctions = this.promisesMap.get(promiseId);
      if (promiseFunctions) {
        promiseFunctions.reject(data.error);
        this.promisesMap.delete(promiseId); // Limpiamos el mapa después de rechazar la promesa
      }
    } else if (data.type === 'DEQUEUE') {
      // Quitar de localStorage la traza enviada
      localStorage.removeItem(data.record_id)
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
    this.recordsInterval = setInterval(this.flush.bind(this), 1000 * this.time_interval);

  const self = this;


  // LogIn con el server para generar el token
  //  this.worker.postMessage({ type: 'LOGIN', credentials:{email: this.player.mail, password: this.player.password}, serverUrl: this.loginUrl });

  // Si quedaron trazas por enviar en caso de error o cierre, se encolan para ser enviadas -> Se encolan cuando se procesan nuevas trazas
  // this.checkLocalStorage()

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
  this.checkLocalStorage()
  const records = this.records_queue.toArray();
  console.log(records)
  if (records.length > 0) {
    const promise = this.sendRecords(records);
    this.records_queue = new Queue(); // Limpiar la cola después de enviar
    this.promises.push(promise);
    try {
      await promise;

      //await this.promises.push(this.sendTraces(traces));
      
    } catch (error) {
      console.error('Error al enviar trazas:', error);
    }
  }
}

private async sendRecords(records: { type: string; data: string }[]) {
  return new Promise<void>((resolve, reject) => {
    // Generamos un ID único para esta promesa
    const promiseId = this.generateUniquePromiseId();
    // Guardamos las funciones resolve y reject en el mapa
    this.promisesMap.set(promiseId, { resolve, reject });

    this.worker.postMessage({ type: 'SEND_RECORDS', records, token: this.token, serverUrl: this.serverUrl, promiseId });
  });
}

// Función para generar un ID único para cada promesa
private generateUniquePromiseId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

private checkLocalStorage(){
  const maxAttempts = 5;
  const maxAgeMs = 24 * 60 * 60 * 1000; // 24 horas

  if (localStorage.length) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      //console.log(/^stat\\d+$/.test(key!))
      console.log(key)
      if (/^stat\\d+$/.test(key!) && !this.records_queue.toArray().some(item => item.id === key)) {
        const value = JSON.parse(localStorage.getItem(key!)!);

        let {record, attempts, lastAttempt} = value // Si supera los intentos permitidos tambien se borra
        record = JSON.parse(record)
        const lastAttemptDate = new Date(lastAttempt);
        const now = new Date();
        const age = now.getTime() - lastAttemptDate.getTime(); // Si la traza se encolo por ultima vez hace mas de 24 horas se borra

        console.log(value)
        console.log(record.verb.display["en-US"])
        console.log(attempts)
        console.log(lastAttempt)

        if (attempts < maxAttempts && age < maxAgeMs) {
          this.records_queue.enqueue({type: \`\${record.verb.display["en-US"]}/\${record.object.definition.name["en-US"]}\`, data: record, id: key!})
      } else {
          // Decidir si eliminar la traza
          console.log(\`Eliminando traza \${key} después de \${attempts} intentos o por exceder el tiempo permitido de 24 horas.\`);
          localStorage.removeItem(key!);
      }

        
        
      }
    }
  }
}

// Función para generar un id unico para cada traza <-----------------------------------------------------------------------------------------------------------------------------------------
private statementIdCalc(): string{
  while (localStorage.getItem(\`stat\${this.record_id}\`) !== null) this.record_id++;
  
  return \`stat\${this.record_id}\`;
}

/**
 * Function to stop the interval to send the statements queue to the server
 */
public stopStatementInterval() {
  if (this.recordsInterval)
    clearInterval(this.recordsInterval); // Detiene el temporizador
}
/**
 * Function to start the interval to send the statements queue to the server
 */
public startSendingInterval(seconds: number) {
  if (this.recordsInterval)
    clearInterval(this.recordsInterval);
  this.recordsInterval = setInterval(this.flush.bind(this), seconds * 1000); //Crea un intervalo cada 'seconds' segundos
}

/**
 * Function to set the session key of an user
 * @param {string} session_key - Key of 6 values that identifies the user
 */
public setKey(session_key: string){
  this.session_key = session_key
}

/**
 * Async function to validate the session key of an user
 * @param {string} sessionKey - Key of 6 values that identifies the user
 * @returns {Promise<boolean>} A promise with the boolean result of the validation
 */
public async validateKey(sessionKey: string): Promise<boolean> {
  try{
    const response = await axios.get(\`http://localhost:3000/publicAPI/key/\${sessionKey}\`)
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
      let statement = generate.generateStatement(this.player, verbJson, objectJson, this.session_key, undefined, this.context, undefined)
      let id = this.statementIdCalc()
  
      localStorage.setItem(id,JSON.stringify({record: JSON.stringify(statement), attempts: 0, lastAttempt: new Date().toISOString()}))
      this.records_queue.enqueue({type: 'accepted/achievement', data: statement, id: id});
      //this.statementQueue.enqueue({type: 'custom', data: statement});
      if (this.records_queue.length >= this.max_queue_length) this.flush();
    }
    else
      console.warn("Verb parameter type incorrect, please use an string for a verb dummy, choose one from jaxpi.verb list or maintain the structure of this last one")
  }
  else
    console.warn("Object parameter type incorrect, please use an string for an object dummy, choose one from jaxpi.object list or maintain the structure of this last one")

}\n\n
\n
${methods.join('\n')}\n
}`;

    return codeBody;
  } catch (error) {
    console.error('Error al generar el código de la clase:', error);
    throw error; // Propaga el error para que sea manejado externamente
  }
}


//const currentDir = path.dirname(new URL(import.meta.url).pathname);
const verbsFolderPath = path.join(dirname(fileURLToPath(import.meta.url)), '../../verbs');
//const verbsFolderPath = './verbs';
//const objectsFolderPath = path.join(currentDir, '../../objects');
const objectsFolderPath = path.join(dirname(fileURLToPath(import.meta.url)), '../../objects');

async function generateMap(): Promise<{ verbJsonMap: Map<string, any>, objectJsonMap: Map<string, any> }> {
  const objectJsonMap: Map<string, any> = new Map();
  const verbJsonMap: Map<string, any> = new Map();

  try {
    // Leer archivos de la carpeta de verbos
    const verbFiles = fs.readdirSync(verbsFolderPath);
    for (const file of verbFiles) {
      if (file.endsWith('.json')) {
        const filePath = path.join(verbsFolderPath, file);
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const json = JSON.parse(jsonData);
        if (checkVerb(json)) {
          const verb = file.replace('.json', '');
          verbJsonMap.set(verb, json);
        }
      }
    }

    // Leer archivos de la carpeta de objetos
    const objectFiles = fs.readdirSync(objectsFolderPath);
    for (const file of objectFiles) {
      if (file.endsWith('.json')) {
        const filePath = path.join(objectsFolderPath, file);
        const jsonData = fs.readFileSync(filePath, 'utf-8');
        const json = JSON.parse(jsonData);
        if (checkObject(json)) {
          const object = file.replace('.json', '');
          objectJsonMap.set(object, json);
        }
      }
    }

    return { verbJsonMap, objectJsonMap };
  } catch (error) {
    console.error('Error al obtener datos para construir el mapa de verbos:', error);
    return { verbJsonMap, objectJsonMap };
  }
}


// Llama a la función para generar dinámicamente el mapa de verbos
generateMap()
  .then(async (mapaGenerado) => {
    let generatedCode = await generateClassWithFunctions(mapaGenerado.verbJsonMap,mapaGenerado.objectJsonMap);
    fs.writeFileSync('./src/index.ts', generatedCode);  //JaxPiLib
  })
  .catch((error) => {
    console.error('Error al generar el mapa:', error);
  });
