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
    
    async function obtenerDatosDesdeURL(url: string) {
      try {
          const response = await fetch(url);
          
          if (!response.ok) {
              throw new Error('No se pudo obtener el archivo JSON');
          }
  
          const data = await response.json();
          
          return data;
      } catch (error) {
          console.error('Error al obtener datos:', error);
          return null;
      }
    }
    
    obtenerDatosDesdeURL("${value}")
      .then((data) => {
        
        //this data is a json object
        data.actor.mbox = this.player.mail;
        data.actor.name = this.player.name;
        
        //we send this trace to the server
        axios.post(this.url, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        // En caso de éxito, imprime la respuesta del servidor
          .then(response => {
            console.log('Respuesta:', response.data);
          })
        // En caso de error, lo imprime
          .catch(error => {
            console.error('Error al enviar la traza JaXpi:', error.message);
          });
        
      })
      .catch((error) => {
          console.error('Error al obtener datos:', error);
      });

   }`);
   
  return `import axios from 'axios';\n` + 
  `import { Player } from './traceGeneratorTest';\n\n` +
  `export class GeneratedVerbs {
    private player: Player;
    private url: string;\n
    constructor(player: Player, url: string) {
      this.player = player;
      this.url = url;
    }
    \n${methods.join('\n')}\n
  }`;
}

// URL de la API de GitHub para obtener el contenido de la carpeta de los verbos
const githubApiUrl = 'https://api.github.com/repos/UCM-FDI-JaXpi/lib/contents/traces';

async function generarMapaDeVerbos(): Promise<VerbUrlMap> {
  try {
    const response = await axios.get(githubApiUrl);

    if (response.status === 200) {
      const archivos = response.data;

      const verbUrlMap: VerbUrlMap = {};

      // Filtra y obtiene solo los archivos JSON de la lista de archivos
      const archivosJSON = archivos.filter((archivo: any) => archivo.name.endsWith('.json'));

      // Construye el mapa de verbos y URLs dinámicamente
      for (const archivo of archivosJSON) {
        const verbo = archivo.name.replace('.json', '');
        verbUrlMap[verbo] = archivo.download_url;
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
generarMapaDeVerbos()
  .then((mapaGenerado) => {
    let generatedCode = generateClassWithFunctions(mapaGenerado);
    fs.writeFileSync('generated-functions.ts', generatedCode);  //JaxPiLib
  })
  .catch((error) => {
    console.error('Error al generar el mapa:', error);
  });
