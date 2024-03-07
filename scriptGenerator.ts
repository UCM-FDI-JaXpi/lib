// script-generate-code.ts
// import a library for file writing
import * as fs from 'fs';
import axios from 'axios';
import {checkVerb,checkObject} from './validateStatement';


const verbObjectRelation: Map<string, string[]> = new Map([
  ["jumped", ["characterOne", "characterTwo", "enemy"]],
  ["achieved", ["mission", "level1Complete"]],
  ["accepted", ["characterOne", "characterTwo", "enemy"]],
  ["accessed", ["characterOne", "characterTwo", "enemy"]],
  ["achieved", ["characterOne", "characterTwo", "enemy"]],
  ["cancelled", ["characterOne", "characterTwo", "enemy"]],
  ["chatted", ["characterOne", "characterTwo", "enemy"]]
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
        code += "object.definition.extensions['https://github.com/UCM-FDI-JaXpi/" + field.substring(0, field.lastIndexOf(":") - 1) + "'] = " + field.substring(0, field.lastIndexOf(":") - 1) + ";" + "\n";
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


// This function returns a string with the class with a method for each xapi trace 
async function generateClassWithFunctions(verbs: Map<string,any>, objects: Map<string,any>): Promise<string> {
  try{
    const methodPromises = [...verbs.entries()].map(async ([key, value]) => {    //Necesita esperar a las Promise de todos las funciones o las escribe mal al generar el codigo
                                                                                // [...verbs.entries()] Porque es una estructura map y eso lo convierte a un array para posible uso, tambien seria valido Map.prototype.entries() sin cambiar el map
      const object = await getObjectRelatedToVerb(key);
      const parameters = await getParameters(value,object);
      const parametersUpdate = setStatement(parameters);

      //console.log(parameters + "\n" + parametersUpdate);

      return ` ${key}(${parameters}object : any,extraParameters?: Map<string, any>) { 
                  
          if(!checkObject(object))
            throw new Error('El objeto no es valido');
          
          // if(!this.getObjectsRelatedToVerb(object.id.substring(object.id.lastIndexOf("/") + 1))){
          //   throw new Error('El objeto no esta relacionado con el verbo');
          // }
    
          if (!object.definition.hasOwnProperty("extensions")) {
            object.definition["extensions"] = {};
          }

          ${parametersUpdate}

          if (extraParameters && extraParameters.size > 0) {
            extraParameters.forEach((value, key) => {
                object.definition.extensions['https://github.com/UCM-FDI-JaXpi/' + key] = value;
            });
          }
    
          const statement = generateStatement(this.player,this.verbMap.get("${key}"), object);
          this.statementQueue.enqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      }`;
    });

    const methods = await Promise.all(methodPromises);
    const verbsMap = Array.from(verbs.entries()).map(async ([key, value]) => {
      return `["${key}",${JSON.stringify(value)}]`;
    });
    const objectsMap = Array.from(objects.entries()).map(async ([key, value]) => {
      return `["${key}",${JSON.stringify(value)}]`;
    });
    const [resolvedVerbsMap, resolvedObjectsMap] = await Promise.all([Promise.all(verbsMap), Promise.all(objectsMap)]);

    
    let codeBody = `  import { Player, generateStatement, generateStatementFromZero } from './generateStatement';
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

    private verbMap = new Map([${resolvedVerbsMap.join(',\n')}])\n
    private objectMap = new Map([${resolvedObjectsMap.join(',\n')}])\n


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
        console.log("Primera traza a enviar:\\n" + JSON.stringify(this.statementQueue.tail.statement, null, 2) + "\\n\\n");
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

    }\n\n
    \n${methods.join('\n')}\n
    }`;

    return codeBody;
  } catch (error) {
    console.error('Error al generar el código de la clase:', error);
    throw error; // Propaga el error para que sea manejado externamente
  }
}

// URL de la API de GitHub para obtener el contenido de la carpeta de los verbos
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
