import axios, { AxiosError } from 'axios';

self.onmessage = async (event) => {
  const data = event.data;

  if (data.type === 'SEND_RECORDS') {
    const { records, token, serverUrl, promiseId } = data;

    for (const record of records) {
      try {
        await sendRecordToServer(record, token, serverUrl);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          // Solo enviamos un mensaje de error simplificado
          const simplifiedError = {
            serverResponse: error.response.data.message,
            message: error.message,
            code: error.code,
            response: {
              status: error.response?.status,
              statusText: error.response?.statusText,
            },
            traceId: record.id
          };

          console.error(`Error al enviar traza ${record.type}:`, simplifiedError);

          self.postMessage({ type: 'ERROR', error: simplifiedError, promiseId, record_id: record.id });
        } else {
          console.error('Error desconocido:', error);
          // En caso de un error desconocido, podrías manejarlo de otra manera.
          self.postMessage({ type: 'ERROR', error: { message: 'Error desconocido' }, promiseId });
        }
        // Continuar con la siguiente traza a pesar del error
      }
    }

    // Después de intentar enviar todas las trazas, informar que se terminó
    self.postMessage({ type: 'RESPONSE', promiseId: promiseId });
  }
};

async function sendRecordToServer(record: { type: string; data: string; id: string }, token: string | { [key: string]: string }, serverUrl: string) {
  console.log(`Enviando traza ${record.type} al servidor...`);
  let headersJaxpi: { [key: string]: string } = {};

  if (serverUrl === "http://localhost:3000/records") {
    headersJaxpi["Content-Type"] = "application/json";
    if (typeof token === "string") headersJaxpi["x-authentication"] = token;
  } else {
    if (typeof token !== "string") headersJaxpi = token;
  }


  const response = await axios.post(serverUrl, record.data, {
    headers: headersJaxpi,
  });

  console.log(`Trazas ${record.type} enviada`);
  console.log(`Respuesta del servidor: ${response.data}`);

  self.postMessage({ type: 'DEQUEUE', record_id: record.id });
}
