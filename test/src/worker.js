// worker.ts
import axios from 'axios';
import { parentPort } from 'worker_threads';
//const axios = require('axios')
if (parentPort)
parentPort.on('message', async (event) => {
    console.log(event)

    const data = event;
    if (data.type === 'SEND_TRACES') {
        const { traces, token, serverUrl } = data;
        for (const trace of traces) {
            await sendTraceToServer(trace, token, serverUrl);
        }
        parentPort.postMessage({ type: 'RESPONSE' });
    }
    if (data.type === 'LOGIN') {
        const { credentials, serverUrl } = data;
        await login(credentials, serverUrl);
        parentPort.postMessage({ type: 'RESPONSE' });
    }
});

async function sendTraceToServer(trace, token, serverUrl) {
    try {
        // Aquí utilizamos Axios para enviar la traza al servidor
        console.log(`Enviando traza ${trace.type} al servidor...`);
        console.log(trace.data);
        const response = await axios.post(serverUrl, trace.data, {
            headers: {
                'Content-Type': 'application/json',
                'x-authentication': token
            }
        });

        parentPort.postMessage({ type: 'DEQUEUE', stat_id: trace.id });
        console.log(`Trazas ${trace.type} enviada`);
        console.log(`Respuesta del servidor: ${response.data}`);
    }
    catch (error) {
        console.error('Error al enviar traza:', error);
        parentPort.postMessage({ type: 'ERROR', error });
    }
}
async function login(credentials, serverUrl) {
    try {
        // Aquí utilizamos Axios para enviar la traza al servidor
        console.log(`Conectado al servidor`);
        const response = await axios.post(serverUrl, credentials, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log(`Logeado ${credentials.email} al servidor`);
        parentPort.postMessage({ type: 'LOGIN', token: response.data.token });
    }
    catch (error) {
        console.error('Error al enviar traza:', error);
        parentPort.postMessage({ type: 'ERROR', error });
    }
}
