import axios from 'axios';
import { Player, logStatement, createStatement } from './traceGeneratorTest';

class JaxpiLib {
    private player: Player;
    private url: string;

    constructor(player: Player, url: string) {
        this.player = player;
        this.url = url;
    }

    public start(account: string) {
      let json = logStatement("logIn", account, this.player);
      if (json !== undefined) {
        console.log(json.object.definition.description["es"])
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
    }
    

    public advance(verb: string, object: string){
      let json = createStatement(verb, object, this.player);
      if (json !== undefined) {
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
    }

    public end(account: string) {
      let json = logStatement("logOut", account, this.player);
      if (json !== undefined) {
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
    }

    public actorUpdate(player: Player) {
      this.player = player;
    }
}
        
let jaxpi = new JaxpiLib({name: "1", mail: "m", id:"b", accountId:"x"},"http://localhost:3000");
jaxpi.start("account");