// script-generate-code.ts
// import a library for file writing
import * as fs from 'fs';
import axios from 'axios';


interface VerbUrlMap {
  [verbId: string]: string;
}


// This function returns a string with the class with a method for each xapi trace 
function generateClassWithFunctions(verbs: VerbUrlMap): string {
  const methods = Object.entries(verbs).map(([key, value]) =>  ` ${key}() { 

    getDataFromURL("${value}")
      .then((data) => {             // data es un objeto JSON
        
        // cambiamos el valor de los campos de actor para el player especifico
        data.actor.mbox = this.player.mail;
        data.actor.name = this.player.name;
        
        this.sendTraza({ user_id: this.player.userId, session_id: this.player.sessionId, traza: data });
        
      })
      .catch((error) => {
          console.error('Error al obtener datos:', error);
      });

   }`);
   
  let codeBody = `import axios from 'axios';\n\n` +
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
    `private sendTraza = async (traza: any) => {
      try {
        const response = await axios.post(this.url, traza, {
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
const githubApiUrl = 'https://api.github.com/repos/UCM-FDI-JaXpi/lib/contents/traces';

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
        const verb = file.name.replace('.json', '');
        verbUrlMap[verb] = file.download_url;
      }

      return verbUrlMap;
    } else {
      throw new Error('No se pudo obtener el contenido del repositorio');
    }
  } catch (error) {
    console.error('Error al obtener datos:', error);
    return {};
  }
}

// Llama a la función para generar dinámicamente el mapa de verbos
generateVerbMap()
  .then((mapaGenerado) => {
    let generatedCode = generateClassWithFunctions(mapaGenerado);
    fs.writeFileSync('JaxpiLib.ts', generatedCode);  //JaxPiLib
  })
  .catch((error) => {
    console.error('Error al generar el mapa:', error);
  });
