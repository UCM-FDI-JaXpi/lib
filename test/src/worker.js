// worker.ts
import axios from 'axios';
//const axios = require('axios')

process.on('message', async (event) => {
    const data = event.data;
    if (data.type === 'SEND_TRACES') {
        const { traces, token, serverUrl } = data;
        for (const trace of traces) {
            await sendTraceToServer(trace, token, serverUrl);
        }
        process.send({ type: 'RESPONSE' });
    }
    if (data.type === 'LOGIN') {
        const { credentials, serverUrl } = data;
        await login(credentials, serverUrl);
        process.send({ type: 'RESPONSE' });
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
        if (typeof window !== undefined)
            self.postMessage({ type: 'DEQUEUE', stat_id: trace.id });
        else
            process.send({ type: 'DEQUEUE', stat_id: trace.id });
        console.log(`Trazas ${trace.type} enviada`);
        console.log(`Respuesta del servidor: ${response.data}`);
    }
    catch (error) {
        console.error('Error al enviar traza:', error);
        if (typeof window !== undefined)
            self.postMessage({ type: 'ERROR', error });
        else
            process.send({ type: 'ERROR', error });
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
        if (typeof window !== undefined)
            self.postMessage({ type: 'LOGIN', token: response.data.token });
        else
            process.send({ type: 'LOGIN', token: response.data.token });
    }
    catch (error) {
        console.error('Error al enviar traza:', error);
        if (typeof window !== undefined)
            self.postMessage({ type: 'ERROR', error });
        else
            process.send({ type: 'ERROR', error });
    }
}
