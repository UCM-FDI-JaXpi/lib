// worker.ts
import axios from 'axios';

//const axios = require('axios')

self.onmessage = async (event) => {
  const data = event.data;

  if (data.type === 'SEND_TRACES') {
    const { traces, token, serverUrl } = data;

    for (const trace of traces) {
      await sendTraceToServer(trace, token, serverUrl);
    }

    self.postMessage({ type: 'RESPONSE' });
  }
  if (data.type === 'LOGIN') {
    const { credentials, serverUrl } = data;

    await login(credentials, serverUrl);

    self.postMessage({ type: 'RESPONSE' });
  }
};

async function sendTraceToServer(trace: { type: string; data: string, id: string }, token: string, serverUrl: string) {
  try {
    // Aquí utilizamos Axios para enviar la traza al servidor
    console.log(`Enviando traza ${trace.type} al servidor...`);
    console.log(trace.data)

    const response = await axios.post(serverUrl, trace.data, { 
      headers: {
        'Content-Type': 'application/json',
        'x-authentication': token
      }
    });
    
    self.postMessage({ type: 'DEQUEUE', stat_id: trace.id})

    console.log(`Trazas ${trace.type} enviada`);
    console.log(`Respuesta del servidor: ${response.data}`);

  } catch (error) {
    console.error('Error al enviar traza:', error);
    self.postMessage({ type: 'ERROR', error });
  }
}

async function login(credentials: { email: string; password: string }, serverUrl: string) {
  try {
    // Aquí utilizamos Axios para enviar la traza al servidor
    console.log(`Conectado al servidor`);

    const response = await axios.post(serverUrl, credentials, { //{email: credentials.email, password: credentials.password}
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log(`Logeado ${credentials.email} al servidor`);

    self.postMessage({ type: 'LOGIN', token: response.data.token})

  } catch (error) {
    console.error('Error al conectar al servidor:', error);
    self.postMessage({ type: 'ERROR', error });
  }
}
