import { Axios, AxiosError } from "axios";
import { Queue } from "queue-typescript";

const axios = require('axios');
const { parentPort } = require('worker_threads');
let queue = new Queue<any>();

// Escuchar mensajes del hilo principal
parentPort.on('message', async (message: any) => {
  const { url, statementQueue, length, queue_id } = message;

  // console.log('Tipo de statementQueue:', typeof statementQueue)
  // console.log('cola:', statementQueue)

  statementQueue.forEach((item: number) => {
    queue.enqueue(item);
  });

  // console.log('URL recibida en el worker:', url);
  // console.log('statementQueue recibida en el worker:', statementQueue);

  // Lógica para enviar las trazas
  try {
    // console.log("cola de trazas: \n" + queue)
    // console.log("length:"+length)
    // console.log("------------------------------------\nTrazas:")

    for (let i = 0; i < length; i++) {
      // console.log(queue.head)
      await sendStatement(url, queue.head);
      queue.removeHead();
    }

    // console.log("El envío ha terminado, todas las trazas han sido enviadas");
    parentPort.postMessage({log : 'Todas las trazas han sido enviadas', queue_id : queue_id});
  } catch (error) {
    console.error("Error al enviar las trazas:", (error as AxiosError).code);
    //parentPort.error(error)
    parentPort.postMessage({error: (error as AxiosError).code}); // Propaga el error para manejarlo en el código principal si es necesario
  }
});

async function sendStatement(url: any, statement: any) {
  // Lógica para enviar una traza usando axios
  try {
    const response = await axios.post(url, statement, { 
        headers: {
          'Content-Type': 'application/json',
        }
    });
    console.log('Respuesta del servidor:', response.data);
  } catch (error) {
    // console.error('Error al enviar la traza:', error);
    throw error; // Propaga el error para manejarlo en el código principal si es necesario
  }
}
