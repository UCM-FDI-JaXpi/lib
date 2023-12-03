import axios from 'axios';
import { Player, logInStatement } from './traceGeneratorTest';

class JaxpiLib {
    private player: Player;
    private url: string;

    constructor(player: Player, url: string) {
        this.player = player;
        this.url = url;
    }

    public start() {
        let json = logInStatement();
        console.log(this.player);
        axios.post(this.url, json, {
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
    }
    

    public advance(): string {
        return this.url;
    }

    public end(): string {
        return this.url;
    }
}
        
let jaxpi = new JaxpiLib({name: "1", mail: "m", id:"b", accountId:"x"},"http://localhost:3000");
jaxpi.start();