import { AxiosError } from "axios";
import { Queue } from "queue-typescript";

const TinCan = require('tincanjs');
const axios = require('axios');
// const { parentPort } = require('worker_threads');
let queue = new Queue<any>();

// Escuchar mensajes del hilo principal
onmessage = async (message: any) => {
  const { url, statementQueue, length, queue_id, lrs } = message;

  statementQueue.forEach((item: number) => {
    queue.enqueue(item);
  });


  // Lógica para enviar las trazas
  try {

    for (let i = 0; i < length; i++) {
      await sendStatement(url, queue.head, lrs, queue_id);
      queue.removeHead();
    }
    if (!lrs) postMessage({log : 'Todas las trazas han sido enviadas', queue_id : queue_id});
  } catch (error) {
    console.error("Error al enviar las trazas:", (error as AxiosError));
    postMessage({error: (error as AxiosError).code}); // Propaga el error para manejarlo en el código principal si es necesario
  }
};

async function sendStatement(url: any, statement: any, use_lrs: boolean, queue_id: string) {
  // Lógica para enviar una traza usando axios
  try {
    if (use_lrs) {
      const config = {
        endpoint: 'https://jaxpi.lrs.io/xapi/', // URL del endpoint xAPI
        username: 'pinnak', // Usuario para autenticación básica
        password: 'ilufit', // Contraseña para autenticación básica
        statement: statement
      };
      
      // Inicializa el cliente xAPI
      const lrs = new TinCan.LRS(config);
  
      
      
      // Envia la declaración (statement)
      lrs.saveStatement(new TinCan.Statement(config.statement), {
        callback: function (err: null, xhr: any) {
          if (err !== null) {
            postMessage({error:`Error enviando la declaración: ${err}`});
            console.log('Error enviando la declaración:', err);
            return;
          }

          postMessage({log : 'Todas las trazas han sido enviadas', queue_id : queue_id});
          // if (use_lrs)  console.log('Declaración enviada exitosamente:', xhr);
          // else  console.log(`Respuesta del servidor: Traza ${statement.verb.display["en-us"]}.${statement.object.definition.name["en-us"]}`)
        }
      });

    }else{
      const response = await axios.post(url, statement, { 
        headers: {
          'Content-Type': 'application/json',
        }
      // const response = await axios.post("https://lrs.adlnet.gov/statementvalidator", statement, { 
      //       headers: {
      //         'Content-Type': 'application/json',
      //       }
        
      });
      console.log(`Respuesta del servidor: ${response.status}\n para la traza ${statement.verb.display["en-us"]}.${statement.object.definition.name["en-us"]}`)
      console.log('Respuesta del servidor:', response.status);

    }

  } catch (error) {
    // console.error('Error al enviar la traza:', error);
    console.error("Error al enviar las trazas:", (error as AxiosError));
    postMessage({error: (error as AxiosError).code}); // Propaga el error para manejarlo en el código principal si es necesario
    //throw error; // Propaga el error para manejarlo en el código principal si es necesario
  }
}
