// worker.ts
import axios from 'axios';
//const axios = require('axios')
self.onmessage = async (event) => {
    const data = event.data;
    if (data.type === 'SEND_TRACES') {
        const { traces, serverUrl } = data;
        for (const trace of traces) {
            await sendTraceToServer(trace, serverUrl);
        }
        self.postMessage({ type: 'RESPONSE' });
    }
};
async function sendTraceToServer(trace, serverUrl) {
    try {
        console.log(`Enviando traza ${trace.type} al servidor...`);
        // Aquí utilizamos Axios para enviar la traza al servidor
        console.log(trace.data);
        //await axios.post(serverUrl, trace.data);
        await axios.post(serverUrl, trace.data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        self.postMessage({ type: 'DEQUEUE', stat_id: trace.id });
        console.log(`Trazas ${trace.type} enviada`);
    }
    catch (error) {
        console.error('Error al enviar traza:', error);
        self.postMessage({ type: 'ERROR', error });
    }
}
