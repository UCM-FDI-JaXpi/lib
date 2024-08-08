import axios, { AxiosError } from 'axios';

self.onmessage = async (event) => {
  const data = event.data;

  if (data.type === 'SEND_TRACES') {
    const { traces, token, serverUrl, promiseId } = data;

    for (const trace of traces) {
      try {
        await sendTraceToServer(trace, token, serverUrl);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          // Solo enviamos un mensaje de error simplificado
          const simplifiedError = {
            server_response: error.response.data.message,
            message: error.message,
            code: error.code,
            response: {
              status: error.response?.status,
              statusText: error.response?.statusText,
            },
            traceId: trace.id
          };

          console.error(`Error al enviar traza ${trace.type}:`, simplifiedError);

          self.postMessage({ type: 'ERROR', error: simplifiedError, promiseId });
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

async function sendTraceToServer(trace: { type: string; data: string; id: string }, token: string, serverUrl: string) {
  console.log(`Enviando traza ${trace.type} al servidor...`);
  const response = await axios.post(serverUrl, trace.data, {
    headers: {
      'Content-Type': 'application/json',
      'x-authentication': token,
    },
  });

  console.log(`Trazas ${trace.type} enviada`);
  console.log(`Respuesta del servidor: ${response.data}`);

  self.postMessage({ type: 'DEQUEUE', stat_id: trace.id });
}
