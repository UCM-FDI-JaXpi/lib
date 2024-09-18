import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path'
import {checkVerb,checkObject} from './validateStatement.js';


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
async function generateClassWithFunctions(verbs: Map<string,any>, objects: Map<string,any>): Promise<[string, string]> {
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

      const parametersUpdate = setStatement(parameters);
      let params = [];

      for (const extension in value.extensions) {
        const description = value["extensions-doc"][extension];
        if (description) {
          params.push(`@param {${typeof(value.extensions[extension])}} ${getExtensionName(extension)} - ${description}`);
        }
      }

      let object: string[] = [];
      let object2: string[] = [];
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
        this.records_queue.enqueue({type: \`${key}/\${name}\`, data: statement, id: id});
        if (this.records_queue.length >= this.max_queue_length) this.flush();
        
      
      }
          `);
          
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
private promisesMap: Map<string, { resolve: () => void, reject: (reason?: any) => void }> = new Map();
private session_key: string = "";
  
  
  
public verbs = {
  ${resolvedVerbsMap.join(',\n  ')}
}

public objects = {
  ${resolvedObjectsMap.join(',\n  ')}
}
  

/**
 * @param {Object} player - Structure that contains player data.
 * @param {string} player.name - The name of the player.
 * @param {string} player.mail - The mail of the player.
 * @param {string} serverURL - The url of the server where statements will be sent.
 * @param {string | { [key: string]: string }} token - The headers for the LRS or the auth for Jaxpi server.
 * @param {string} [time_interval=undefined] - Number of seconds an interval will try to send the statements to the server. 
 * @param {string} [max_queue=MAX_QUEUE_LENGTH] - Maximum number of statement per queue before sending. 
 */
constructor(player: generate.Player, private serverUrl: string, private token: string | { [key: string]: string }, private time_interval?: number, private max_queue?: number) {
  this.context = undefined;
  this.player = player;
  this.worker = new Worker(new URL('./worker.js', import.meta.url));

  

  this.worker.addEventListener('message', (event: any) => {
    const data = event.data;
    if (data.type === 'RESPONSE') {
      const promiseId = data.promiseId;
      const promiseFunctions = this.promisesMap.get(promiseId);
      if (promiseFunctions) {
        promiseFunctions.resolve();
        this.promisesMap.delete(promiseId); 
      }
    } else if (data.type === 'ERROR') {
      const recordData = JSON.parse(localStorage.getItem(data.record_id)!);
      recordData.attempts += 1;
      recordData.lastAttempt = new Date().toISOString(); 
      localStorage.setItem(data.record_id, JSON.stringify(recordData));
      console.warn(\`Ultimo intento \${recordData.lastAttempt},  Nº de intentos \${recordData.attempts},  Nº max de intentos 5\`)

      const promiseId = data.promiseId;
      const promiseFunctions = this.promisesMap.get(promiseId);
      if (promiseFunctions) {
        promiseFunctions.reject(data.error);
        this.promisesMap.delete(promiseId); 
      }
    } else if (data.type === 'DEQUEUE') {
      localStorage.removeItem(data.record_id)
    } 

  });
  this.promises = [];
  if (this.max_queue) this.max_queue_length = this.max_queue
  else this.max_queue_length = MAX_QUEUE_LENGTH;
  if (this.time_interval)
    this.recordsInterval = setInterval(this.flush.bind(this), 1000 * this.time_interval);

  //const self = this;


/*
  if (typeof window !== undefined){
  let isListening = false;
  
  async function handleSIGINT() {
    console.log('SIGINT received');
    self.flush()
        await Promise.all(self.promises)
    .then(() => {
      console.log('Promesas resueltas, cerrando la ventana...');
      window.close();
      return;
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
  
  startListening();
  }
*/
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
    this.records_queue = new Queue(); 
    this.promises.push(promise);
    try {
      await promise;
    } catch (error) {
      console.error('Error al enviar trazas:', error);
    }
  }
}

private async sendRecords(records: { type: string; data: string }[]) {
  return new Promise<void>((resolve, reject) => {
    const promiseId = this.generateUniquePromiseId();
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
  const maxAgeMs = 24 * 60 * 60 * 1000; // 24 hours

  if (localStorage.length) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log(key)
      if (/^stat\\d+$/.test(key!) && !this.records_queue.toArray().some(item => item.id === key)) {
        const value = JSON.parse(localStorage.getItem(key!)!);

        let {record, attempts, lastAttempt} = value 
        record = JSON.parse(record)
        const lastAttemptDate = new Date(lastAttempt);
        const now = new Date();
        const age = now.getTime() - lastAttemptDate.getTime(); 

        console.log(value)
        console.log(record.verb.display["en-US"])
        console.log(attempts)
        console.log(lastAttempt)

        if (attempts < maxAttempts && age < maxAgeMs) {
          this.records_queue.enqueue({type: \`\${record.verb.display["en-US"]}/\${record.object.definition.name["en-US"]}\`, data: record, id: key!})
        } else {
          console.log(\`Eliminando traza \${key} después de \${attempts} intentos o por exceder el tiempo permitido de 24 horas.\`);
          localStorage.removeItem(key!);
        }
      }
    }
  }
}

// Función para generar un id unico para cada traza 
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
  this.recordsInterval = setInterval(this.flush.bind(this), seconds * 1000); 
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
        console.error('Error:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('Error:', error.request);
      } else {
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
        (this.context.extensions as { [key: string]: any })[parameter] = value; 
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

      let statement = generate.generateStatement(this.player, verbJson, objectJson, this.session_key, undefined, this.context, undefined)
      let id = this.statementIdCalc()
  
      localStorage.setItem(id,JSON.stringify({record: JSON.stringify(statement), attempts: 0, lastAttempt: new Date().toISOString()}))
      this.records_queue.enqueue({type: 'custom', data: statement, id: id});
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


    let minBody = `
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  removeHead(): void {
    if (!this.isEmpty()) {
      this.items.shift();
    }
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  toArray(): T[] {
    return [...this.items];
  }

  get length(): number {
    return this.items.length;
  }

  get head(): T | undefined {
    return this.items[0];
  }
}

interface ContextExtensions {
  session?: string;
  [key: string]: any; 
}

interface XAPIStatement {
  actor: {
    name: string;
    mbox: string;
  };
  verb: {
    id: string;
    display: object;
  };
  object: {
    id: string;
    definition: {
      type: string;
      name: object;
      description: object;
      extensions?: object;
    };
  };
  result?: {
    completion: boolean;
    success: boolean;
    score: {
      scaled: number;
    };
    extensions: object;
  };
  context?: {
    instructor: {
      name: string;
      mbox: string;
    };
    contextActivities: {
      parent: {
        id: string;
      };
      grouping: {
        id: string;
      };
    };
    extensions: ContextExtensions;
  };
  timestamp: string;
  authority?: {
    name: string;
    mbox: string;
  }
}

interface Player {
  name: string;
  mail: string;
}

function generateStatementFromZero(verbId: string | any, objectId: string | any, parameters?: Array<[string, any]>): [any, any] {

  let parameter = "";
  const header = "http://example.com/";
  let verb;
  let object;

  if (typeof verbId === "string")
    verb = {
      id: header + verbId,
      display: {},
    }
  else
    if (verbId.id)
      verb = {
        id: verbId.id,
        display: verbId.display,
      }

  if (typeof objectId === "string")
    object = {
      id: header + objectId,
      definition: {
        type: "custom",
        name: {},
        description: {},
        extensions: {}
      }
    }
  else
    object = {
      id: objectId.id,
      definition: objectId.definition
    }

  if (parameters) {
    if (object.definition.extensions !== undefined)
      object.definition.extensions = {}

    for (let [key, value] of parameters) {
      parameter = header + verbId + "_" + key;
      (object.definition.extensions as { [key: string]: any })[parameter] = value; 
    }
  }

  return [verb, object];
}

function generateStatement(player: Player, verb: { id: any; display: any; objects?: string[]; description?: string; extensions?: object | undefined; }, object: { id: any; definition: { type: any; name: any; description: any; extensions?: object | undefined; }; }, sessionKey: string, result?: any, context?: any, authority?: any, ): XAPIStatement {

  let statement: XAPIStatement = {
      actor: {
      mbox: "mailto:" + player.mail,
      name: player.name,
      },
      verb: {
      id: verb.id,
      display: verb.display,
      },
      object: {
      id: object.id,
      definition: {
          type: object.definition.type,
          name: object.definition.name,
          description: object.definition.description,
      }
      },
      timestamp: new Date().toISOString(),
  };

  if (object.definition.extensions !== undefined) statement.object.definition.extensions = object.definition.extensions;
  if (result !== undefined) statement.result = result;
  if (context !== undefined) statement.context = context;
  if (authority !== undefined) statement.authority = authority;


  if (sessionKey !== "") {
      const aux: XAPIStatement = {
          actor: statement.actor,
          verb: statement.verb,
          object: statement.object,
          timestamp: statement.timestamp,
          context: {
              instructor: {
                  name: "",
                  mbox: ""
              },
              contextActivities: {
                  parent: {
                      id: ""
                  },
                  grouping: {
                      id: ""
                  }
              },
              extensions: {}
          },
      };
      statement = aux;
      statement.context!.extensions["https://www.jaxpi.com/sessionKey"] = sessionKey;
  }

  return statement;
}

function generateObject(objectJson: any, name?: string, description?: string): any {

  const object: { id: string, definition: any } = {
    id: objectJson.id,
    definition: {
      type: objectJson.definition.type,
      name: { ...objectJson.definition.name }, // Clono el campo de objectJason para evitar que me sobreescriba con una referencia
      description: { ...objectJson.definition.description },
      extensions: {}
    }

  };

  if (name)
    object.definition.name["en-US"] = name
  if (description)
    object.definition.description["en-US"] = description

  return object;
}

function checkVerb(json: { [x: string]: any; id: any; } | string) {
  if (typeof json === 'string') return false;

  const expectedFieldsInVerb = ["id", "display", "objects", "extensions", "extensions-doc", "description"];
  const requiredFieldsInVerb = ["id", "display"];

  for (const field in json) {
    if (expectedFieldsInVerb.indexOf(field) === -1) {
      return false;
    }
  }

  for (const field of requiredFieldsInVerb) {
    if (!json[field]) {
      return false;
    }
  }

  if (typeof json.id !== 'string') return false;

  return true;
}

function checkObject(json: { [x: string]: any; definition: { [x: string]: any; type: any; }; id: any; } | string) {
  if (typeof json === 'string') return false;

  const expectedFieldsInDefinition = ["type", "name", "description"];
  const expectedFieldsInObject = ["id", "definition"];

  for (const field in json) {
    if (expectedFieldsInObject.indexOf(field) === -1) {
        return false;
    }
}
  for (const field in json.definition) {
    if (expectedFieldsInDefinition.indexOf(field) === -1 && field !== "extensions") {
      return false;
    }
  }

  for (const field of expectedFieldsInObject) {
    if (!json[field]) {
      return false;
    }
  }
  for (const field of expectedFieldsInDefinition) {
    if (!json.definition[field]) {
      return false;
    }
  }

  if (typeof json.id !== 'string' || typeof json.definition.type !== 'string') return false;

  return true;
}

// Cuerpo Principal
const MAX_QUEUE_LENGTH = 5;
let instance: Jaxpi | null = null;


class Jaxpi {
  private records_queue: Queue<{ type: string; data: any, id: string }> = new Queue();
  private player: Player;
  private context: any;
  private max_queue_length: number;
  private record_id: number = 1;
  private promises: Promise<void>[];
  private recordsInterval: number | undefined;
  private promisesMap: Map<string, { resolve: () => void, reject: (reason?: any) => void }> = new Map();
  private session_key: string = "";
  private worker: Worker;

  public verbs = {
    ${resolvedVerbsMap.join(',\n  ')}
  }

  public objects = {
    ${resolvedObjectsMap.join(',\n  ')}
  }

  /**
   * @param {Object} player - Structure that contains player data.
   * @param {string} player.name - The name of the player.
   * @param {string} player.mail - The mail of the player.
   * @param {string} serverURL - The url of the server where statements will be sent.
   * @param {string} token - The token of authentication the server will use to send the statements.
   * @param {string} [time_interval=undefined] - Number of seconds an interval will try to send the statements to the server. 
   * @param {string} [max_queue=MAX_QUEUE_LENGTH] - Maximum number of statement per queue before sending. 
   */
  constructor(player: Player, private serverUrl: string, private token: string, private time_interval?: number, private max_queue?: number) {
    this.context = undefined;
    this.player = player;

    const workerCode = \`
        self.onmessage = async (event) => {
            const data = event.data;

            if (data.type === 'SEND_RECORDS') {
                const { records, token, serverUrl, promiseId } = data;

                for (const record of records) {
                    try {
                        await sendRecordToServer(record, token, serverUrl);
                    } catch (error) {
                        if (error instanceof Error) {
                            const simplifiedError = {
                                message: error.message,
                                traceId: record.id
                            };
                            console.error(\\\`Error al enviar traza \\\${record.type}:\\\`, simplifiedError);
                            self.postMessage({ type: 'ERROR', error: simplifiedError, promiseId, record_id: record.id });
                        } else {
                            console.error('Error desconocido:', error);
                            self.postMessage({ type: 'ERROR', error: { message: 'Error desconocido' }, promiseId });
                        }
                    }
                }

                self.postMessage({ type: 'RESPONSE', promiseId: promiseId });
            }
        };

        async function sendRecordToServer(record, token, serverUrl) {
            console.log(\\\`Enviando traza \\\${record.type} al servidor...\\\`);
            let headersJaxpi = {};

            if (serverUrl === "http://localhost:3000/records") {
              headersJaxpi["Content-Type"] = "application/json";
              headersJaxpi["x-authentication"] = token;
            } else {
              headersJaxpi = token;
            }
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: headersJaxpi,
                body: JSON.stringify(record.data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(\\\`HTTP error! status: \\\${response.status} - \\\${errorData.message}\\\`);
            }

            const responseData = await response.json();
            console.log(\\\`Trazas \\\${record.type} enviada\\\`);
            console.log(\\\`Respuesta del servidor: \\\${responseData}\\\`);
            self.postMessage({ type: 'DEQUEUE', record_id: record.id });
        }
        \`;

    const blob = new Blob([workerCode], { type: "application/javascript" });
    const workerBlobURL = URL.createObjectURL(blob);
    this.worker = new Worker(workerBlobURL);



    this.worker.onmessage = (event: MessageEvent) => {
      const data = event.data;
      if (data.type === 'RESPONSE') {
        const promiseId = data.promiseId;
        const promiseFunctions = this.promisesMap.get(promiseId);
        if (promiseFunctions) {
          promiseFunctions.resolve();
          this.promisesMap.delete(promiseId); 
        }
      } else if (data.type === 'ERROR') {
        const recordData = JSON.parse(localStorage.getItem(data.record_id)!);
        recordData.attempts += 1;
        recordData.lastAttempt = new Date().toISOString(); 
        localStorage.setItem(data.record_id, JSON.stringify(recordData));
        console.warn(\`Ultimo intento \${recordData.lastAttempt},  Nº de intentos \${recordData.attempts},  Nº max de intentos 5\`)

        const promiseId = data.promiseId;
        const promiseFunctions = this.promisesMap.get(promiseId);
        if (promiseFunctions) {
          promiseFunctions.reject(data.error);
          this.promisesMap.delete(promiseId); 
        }
      } else if (data.type === 'DEQUEUE') {
        localStorage.removeItem(data.record_id)
      }

    };
    this.promises = [];
    if (this.max_queue) this.max_queue_length = this.max_queue
    else this.max_queue_length = MAX_QUEUE_LENGTH;
    if (this.time_interval)
      this.recordsInterval = setInterval(this.flush.bind(this), 1000 * this.time_interval) as unknown as number;

    const self = this;

    if (typeof window !== undefined) {
      let isListening = false;

      async function handleSIGINT() {
        console.log('SIGINT received');
        self.flush()
        await Promise.all(self.promises)
          .then(() => {
            console.log('Promesas resueltas, cerrando la ventana...');
            window.close();  
            return;  
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
      this.records_queue = new Queue(); 
      this.promises.push(promise);
      try {
        await promise;
      } catch (error) {
        console.error('Error al enviar trazas:', error);
      }
    }
  }

  private async sendRecords(records: { type: string; data: string }[]) {
    return new Promise<void>((resolve, reject) => {
      const promiseId = this.generateUniquePromiseId();
      this.promisesMap.set(promiseId, { resolve, reject });

      this.worker.postMessage({ type: 'SEND_RECORDS', records, token: this.token, serverUrl: this.serverUrl, promiseId });
    });
  }

  // Función para generar un ID único para cada promesa
  private generateUniquePromiseId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private checkLocalStorage() {
    const maxAttempts = 5;
    const maxAgeMs = 24 * 60 * 60 * 1000; // 24 horas

    if (localStorage.length) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(key)
        if (/^stat\\d+$/.test(key!) && !this.records_queue.toArray().some(item => item.id === key)) {
          const value = JSON.parse(localStorage.getItem(key!)!);

          let { record, attempts, lastAttempt } = value // Si supera los intentos permitidos tambien se borra
          record = JSON.parse(record)
          const lastAttemptDate = new Date(lastAttempt);
          const now = new Date();
          const age = now.getTime() - lastAttemptDate.getTime(); 

          console.log(value)
          console.log(record.verb.display["en-US"])
          console.log(attempts)
          console.log(lastAttempt)

          if (attempts < maxAttempts && age < maxAgeMs) {
            this.records_queue.enqueue({ type: \`\${record.verb.display["en-US"]}/\${record.object.definition.name["en-US"]}\`, data: record, id: key! })
          } else {
            console.log(\`Eliminando traza \${key} después de \${attempts} intentos o por exceder el tiempo permitido de 24 horas.\`);
            localStorage.removeItem(key!);
          }

        }
      }
    }
  }

  // Función para generar un id unico para cada traza 
  private statementIdCalc(): string {
    while (localStorage.getItem(\`stat\${this.record_id}\`) !== null) this.record_id++;

    return \`stat\${this.record_id}\`;
  }

  /**
   * Function to stop the interval to send the statements queue to the server
   */
  public stopStatementInterval() {
    if (this.recordsInterval)
      clearInterval(this.recordsInterval); 
  }
  /**
   * Function to start the interval to send the statements queue to the server
   */
  public startSendingInterval(seconds: number) {
    if (this.recordsInterval)
      clearInterval(this.recordsInterval);
    this.recordsInterval = setInterval(this.flush.bind(this), seconds * 1000) as unknown as number; 
  }

  /**
   * Function to set the session key of an user
   * @param {string} session_key - Key of 6 values that identifies the user
   */
  public setKey(session_key: string) {
    this.session_key = session_key
  }

  /**
   * Async function to validate the session key of a user
   * @param {string} sessionKey - Key of 6 values that identifies the user
   * @returns {Promise<boolean>} A promise with the boolean result of the validation
   */
  public async validateKey(sessionKey: string): Promise<boolean> {
    try {
      const response = await fetch(\`http://localhost:3000/publicAPI/key/\${sessionKey}\`);

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        console.error('Error:', response.status, errorData);
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      return false;
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
          (this.context.extensions as { [key: string]: any })[parameter] = value;
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
        const [verbJson, objectJson] = generateStatementFromZero(verb, object, parameters);
        let statement = generateStatement(this.player, verbJson, objectJson, this.session_key, undefined, this.context, undefined)
        let id = this.statementIdCalc()

        localStorage.setItem(id, JSON.stringify({ record: JSON.stringify(statement), attempts: 0, lastAttempt: new Date().toISOString() }))
        this.records_queue.enqueue({ type: 'accepted/achievement', data: statement, id: id });
        if (this.records_queue.length >= this.max_queue_length) this.flush();
      }
      else
        console.warn("Verb parameter type incorrect, please use an string for a verb dummy, choose one from jaxpi.verb list or maintain the structure of this last one")
    }
    else
      console.warn("Object parameter type incorrect, please use an string for an object dummy, choose one from jaxpi.object list or maintain the structure of this last one")

  }

\n
  ${methods.join('\n').replace(/generate\./g, '')}\n
}`;

    return [codeBody, minBody];
  } catch (error) {
    console.error('Error al generar el código de la clase:', error);
    throw error;
  }
}


const verbsFolderPath = path.join(dirname(fileURLToPath(import.meta.url)), '../../verbs');
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
    let [generatedCode, genCodeMin] = await generateClassWithFunctions(mapaGenerado.verbJsonMap,mapaGenerado.objectJsonMap);
    fs.writeFileSync('./src/index.ts', generatedCode);  //JaxPiLib
    fs.writeFileSync('./src/jaxpi.ts', genCodeMin);  //JaxPiLib.min
  })
  .catch((error) => {
    console.error('Error al generar el mapa:', error);
  });
