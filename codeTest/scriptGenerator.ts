// script-generate-code.ts
// import a library for file writing
import * as fs from 'fs';
import axios from 'axios';


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

          //console.log(url);
          //console.log(statement);

          if (statement.object.definition.extensions !== undefined) {
            for (let field in statement.object.definition.extensions) {
              parameters += field.substring(field.lastIndexOf("/") + 1) + " : " 
                + typeof statement.object.definition.extensions[field] + ",";
            }
            parameters = parameters.slice(0, -1);
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
    let arraystring = parameters.split(",");
    for (let field of Object.values(arraystring)) {
      code += "data.object.extensions['https://github.com/UCM-FDI-JaXpi/" + field.substring(0,field.lastIndexOf(":") - 1) + "'] = " + field.substring(0,field.lastIndexOf(":") - 1) + ";" + "\n";
    }
  }

  return code;
}


// This function returns a string with the class with a method for each xapi trace 
async function generateClassWithFunctions(verbs: VerbUrlMap): Promise<string> {

  const methodPromises = Object.entries(verbs).map(async ([key, value]) => {
    const parameters = await getParameters(value);
    
    return ` ${key}(${parameters}) { 
      getDataFromURL("${value}")
      .then((data) => {             // data es un objeto JSON
        
        // cambiamos el valor de los campos de actor para el player especifico
        data.actor.mbox = this.player.mail;
        data.actor.name = this.player.name;
        data.timestamp = new Date().toString();
        `
        +
        setStatement(parameters)
        +
        `
        
        try {
          const statement = generateStatement(data);
          statementEnqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
        } catch (error) {
          console.error("Error al generar el statement:", error);
        }

      })
      .catch((error) => {
          console.error('Error al obtener datos:', error);
      });
    }`;
  });

  const methods = await Promise.all(methodPromises);
   
  let codeBody = `import axios from 'axios';\n
  import { Queue } from 'queue-typescript';

  const statementQueue = new Queue<any>();

  function statementEnqueue(traza: any){
    statementQueue.enqueue(traza);
  }

  function generateStatement(data: any) : XAPIStatement{

    if (!data.actor || !data.actor.mbox || !data.actor.name || !data.verb || !data.verb.id || !data.verb.display || !data.object || !data.object.id || !data.object.definition || !data.object.definition.type || !data.object.definition.name || !data.object.definition.description || !data.timestamp) {
      throw new Error('Faltan datos requeridos para generar el statement.');
    }

    const statement: XAPIStatement = {
      actor: {
        mbox: data.actor.mbox,
        name: data.actor.name,
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
      timestamp: data.timestamp,
    };

    if (data.object.definition.extensions !== undefined) statement.object.definition.extensions = data.object.definition.extensions;
    if (data.result !== undefined) statement.result = data.result;
    if (data.context !== undefined) statement.context = data.context;
    if (data.authority !== undefined) statement.authority = data.authority;

    return statement;
  }
  \n` +
  `interface Player {
    name: string;
    mail: string;
	  userId: string;
	  sessionId: string;
  }\n\n` +
  `async function getDataFromURL(url: string) {
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
  }\n\n` +
  `export class Jaxpi {
    private player: Player;
    private url: string;\n
    constructor(player: Player, url: string) {
      this.player = player;
      this.url = url;
    }\n\n` +
    `private sendStatement = async () => {
      try {
        let statement = null;
        while (!(statementQueue.length != 0)) {
          statement = statementQueue.dequeue();
        }
        const response = await axios.post(this.url, statement, {
        headers: {
          'Content-Type': 'application/json',
        },
        });
        console.log('Respuesta:', response.data);
      } catch (error) {
        console.error('Error al enviar la traza JaXpi:', (error as Error).message);
      }
    };\n\n`+
    `\n${methods.join('\n')}\n
  }`;

  return codeBody;
}

// URL de la API de GitHub para obtener el contenido de la carpeta de los verbos
const githubApiUrl = 'https://api.github.com/repos/UCM-FDI-JaXpi/lib/contents/statements';

function checkXAPI(json: any): boolean{
  // Verificar si la traza tiene los campos requeridos
  if (!json.actor || !json.actor.name || !json.actor.mbox ||
        !json.verb || !json.verb.id || !json.verb.display ||
          !json.object || !json.object.id || !json.object.definition || 
            !json.object.definition.type || !json.object.definition.name || !json.object.definition.description) {
    return false;
  }

  // Validar los tipos y estructuras de los campos
  if (typeof json.actor.name !== 'string' || typeof json.actor.mbox !== 'string' ||
        typeof json.verb.id !== 'string' || 
          typeof json.object.id !== 'string' || typeof json.object.definition.type !== 'string') {
    return false;
  }

  // Verificar campo opcional 'result'
  if (json.result !== undefined) {
    if (typeof json.result.completion !== 'boolean' || 
        typeof json.result.success !== 'boolean' ||
        typeof json.result.score?.scaled !== 'number') { // Verificar campo opcional 'score'
        return false;
    }
  }

  // Verificar campo opcional 'context'
  if (json.context !== undefined) {
      if (typeof json.context.instructor?.name !== 'string' || 
          typeof json.context.instructor?.mbox !== 'string' ||
          typeof json.context.contextActivities?.parent?.id !== 'string' ||
          typeof json.context.contextActivities?.grouping?.id !== 'string') {
          return false;
      }
  }

  // Verificar campo opcional 'authority'
  if (json.authority !== undefined) {
      if (typeof json.authority.name !== 'string' || typeof json.authority.mbox !== 'string') {
          return false;
      }
  }

  // Si pasó todas las validaciones, devolver verdadero
  return true;
}


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
