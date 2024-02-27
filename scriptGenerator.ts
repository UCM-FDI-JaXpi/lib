// script-generate-code.ts
// import a library for file writing
import * as fs from 'fs';
import axios from 'axios';
import {checkXAPI} from './validateStatement';


interface VerbUrlMap {
  [verbId: string]: string;
}

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

async function getParameters(url: any){

  let parameters = "";

  await getDataFromURL(url)
        .then((statement) => {

          if (statement.object.definition.extensions !== undefined) {     //Si existen paramtros estos estan en el campo extension de json.object
            for (let field in statement.object.definition.extensions) {
              if (field.substring(field.lastIndexOf("/") + 1).split("_")[0] == statement.verb.id.substring(statement.verb.id.lastIndexOf("/") + 1))   //Comprueba si el parametro de extension es relevante para el verbo
                parameters += field.substring(field.lastIndexOf("/") + 1) + " : " 
                  + typeof statement.object.definition.extensions[field] + ",";
            }
            //parameters = parameters.slice(0, -1);
          }
        })
        .catch((error) => {
          console.error('Error al ejecutar getparameters:', error);
        });

  return parameters;
}

function setStatement(parameters: string) : string{
  let code = "";

  if(parameters !== ""){   // statement = "distance : "number",units : "string""
    parameters = parameters.slice(0, -1); // elimina la ultima coma (necesaria por customObject)
    let arraystring = parameters.split(",");
    for (let field of Object.values(arraystring)) {
      code += "data.object.definition.extensions['https://github.com/UCM-FDI-JaXpi/" + field.substring(0,field.lastIndexOf(":") - 1) + "'] = " + field.substring(0,field.lastIndexOf(":") - 1) + ";" + "\n";
    }
  }

  return code;
}


// This function returns a string with the class with a method for each xapi trace 
async function generateClassWithFunctions(verbs: VerbUrlMap): Promise<string> {

  const methodPromises = Object.entries(verbs).map(async ([key, value]) => {    //Necesita esperar a las Promise de todos las funciones o las escribe mal al generar el codigo
    const parameters = await getParameters(value);

    return ` ${key}(${parameters}customObject? : object) { 
      this.enqueueAction(async () => {
        const data = await getDataFromURL("${value}");
        // data es un objeto JSON
  
        // Cambiamos el objeto si el usuario nos pasa uno y actualizamos los parámetros
        if (customObject !== undefined) data.object = customObject;
        `
        +
        setStatement(parameters)
        +
        `
        const statement = this.generateStatement(data);
        await this.statementEnqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      });
    }`;
  });

  const methods = await Promise.all(methodPromises);
   
  let codeBody = ` 
import axios from 'axios';
import { Queue } from 'queue-typescript';
import { XAPIStatement } from './xAPIschema';
import { checkXAPI } from './validateStatement';



interface Player {
  name: string;
  mail: string;
  userId: string;
  sessionId: string;
}

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

export class Jaxpi {
  private player: Player;
  private url: string;
  private isSending: boolean;
  private statementQueue = new Queue<any>();


  constructor(player: Player, url: string) {
    this.player = player;
    this.url = url;
    this.isSending = false;
  }

  private queuedPromise: Promise<void> = Promise.resolve(); // Inicializamos una promesa resuelta

  private enqueueAction(action: () => Promise<void>) {
    // Creamos una nueva promesa que se resolverá una vez que la traza se haya encolado
    this.queuedPromise = this.queuedPromise.then(async () => {
      await action();
    });
  }

  private statementEnqueue(traza: any) {
    this.statementQueue.enqueue(traza);
  }

  private generateStatement(data: any): XAPIStatement {

    if (!data.actor || !data.actor.mbox || !data.actor.name || !data.verb || !data.verb.id || !data.verb.display || !data.object || !data.object.id || !data.object.definition || !data.object.definition.type || !data.object.definition.name || !data.object.definition.description) {
      throw new Error('Faltan datos requeridos para generar el statement.');
    }

    const statement: XAPIStatement = {
      actor: {
        mbox: this.player.mail,
        name: this.player.name,
      },
      verb: {
        id: data.verb.id,
        display: data.verb.display,
      },
      object: {
        id: data.object.id,
        definition: {
          type: data.object.definition.type,
          name: data.object.definition.name,
          description: data.object.definition.description,
        }
      },
      timestamp: new Date().toISOString(),
    };

    if (data.object.definition.extensions !== undefined) statement.object.definition.extensions = data.object.definition.extensions;
    if (data.result !== undefined) statement.result = data.result;
    if (data.context !== undefined) statement.context = data.context;
    if (data.authority !== undefined) statement.authority = data.authority;

    return statement;
  }


  private generateStatementFromZero(verbId: string, objectId: string, parameters: Map<string, any>): XAPIStatement {

    let parameter = "";
    const header = "http://example.com/";
    const statement: XAPIStatement = {
      actor: {
        mbox: this.player.mail,
        name: this.player.name,
      },
      verb: {
        id: header + verbId,
        display: {},
      },
      object: {
        id: header + objectId,
        definition: {
          type: "",
          name: {},
          description: {},
          extensions: {}
        }
      },
      timestamp: new Date().toISOString(),
    };

    for (let [key, value] of parameters) {
      if (statement.object.definition.extensions !== undefined) {
        parameter = header + key;
        (statement.object.definition.extensions as { [key: string]: any })[parameter] = value; // Aseguramos a typescript que extensions es del tipo {string : any,...}
      }

    }

    return statement;
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


  flush = async () => { //Si cliente quiere limpiar el encolado por lo que sea
    await this.queuedPromise;

    if (this.isSending) {
      await this.waitQueue();  // Si se está enviando alguna traza, esperar hasta que se haya completado
    }

    this.isSending = true;

    if (this.statementQueue.length != 0) {
      this.sendStatement();
      console.log("Primera traza a enviar:\n" + JSON.stringify(this.statementQueue.tail.statement, null, 2) + "\n\n");
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

  customVerbWithJson(json: any) {

    if (checkXAPI(json)) {
      this.statementEnqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: this.generateStatement(json) });
    }

  }

  customVerb(verb: string, object: string, parameters: Map<string, any>) {

    let statement = this.generateStatementFromZero(verb, object, parameters);

    this.statementEnqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: this.generateStatement(statement) });

  }\n\n`
  +  `\n${methods.join('\n')}\n
  }`;

  return codeBody;
}

// URL de la API de GitHub para obtener el contenido de la carpeta de los verbos
const githubApiUrl = 'https://api.github.com/repos/UCM-FDI-JaXpi/lib/contents/statements';




async function generateVerbMap(): Promise<VerbUrlMap> {
  try {
    const response = await axios.get(githubApiUrl);

    if (response.status === 200) {
      const files = response.data;

      const verbUrlMap: VerbUrlMap = {};

      // Filtra y obtiene solo los archivos JSON de la lista de archivos
      const JSONFiles = files.filter((file: any) => file.name.endsWith('.json'));

      // Construye el mapa de verbos y URLs dinámicamente
      for (const file of JSONFiles) {

        
        await getDataFromURL(file.download_url)
        .then((json) => {
          if(checkXAPI(json)){
            const verb = file.name.replace('.json', '');
            verbUrlMap[verb] = file.download_url;
          }
        })
        .catch((error) => {
          console.error('Error al mostrar el json:', error);
        });

        
      }

      return verbUrlMap;
    } else {
      throw new Error('No se pudo obtener el contenido del repositorio');
    }
  } catch (error) {
    console.error('Error al obtener datos para construir el mapa de verbos:', error);
    return {};
  }
}

// Llama a la función para generar dinámicamente el mapa de verbos
generateVerbMap()
  .then(async (mapaGenerado) => {
    let generatedCode = await generateClassWithFunctions(mapaGenerado);
    fs.writeFileSync('jaxpiLib.ts', generatedCode);  //JaxPiLib
  })
  .catch((error) => {
    console.error('Error al generar el mapa:', error);
  });
