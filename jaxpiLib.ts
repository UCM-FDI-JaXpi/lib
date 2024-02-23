 
  import axios from 'axios';
  import { Queue } from 'queue-typescript';
  import { XAPIStatement } from './xAPIschema';
  import {checkXAPI} from './validateStatement';

  const statementQueue = new Queue<any>();

  function statementEnqueue(traza: any){
    statementQueue.enqueue(traza);
  }
  
interface Player {
    name: string;
    mail: string;
	  userId: string;
	  sessionId: string;
  }

async function getDataFromURL(url: string) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('No se pudo obtener el archivo JSON');
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error('Error al obtener datos de la url:', error);
        return null;
    }
  }

export class Jaxpi {
    private player: Player;
    private url: string;
    private isSending: boolean;
    private statementQueue = new Queue<any>();
    private statementInterval: NodeJS.Timeout;


    constructor(player: Player, url: string) {
      this.player = player;
      this.url = url;
      this.isSending = false;

      this.statementInterval = setInterval(this.sendStatementsInterval.bind(this), 300); // Inicia el intervalo de envios de traza cada 5 seg
    }

    private generateStatement(data: any) : XAPIStatement{

      if (!data.actor || !data.actor.mbox || !data.actor.name || !data.verb || !data.verb.id || !data.verb.display || !data.object || !data.object.id || !data.object.definition || !data.object.definition.type || !data.object.definition.name || !data.object.definition.description || !data.timestamp) {
        throw new Error('Faltan datos requeridos para generar el statement.');
      }
  
      const statement: XAPIStatement = {
        actor: {
          mbox: this.player.mail,
          name: this.player.name,
        },
        verb: {
          id: data.verb.id,
          display: data.verb.display,
        },
        object: {
          id: data.object.id,
          definition: {
            type: data.object.definition.type,
            name: data.object.definition.name,
            description: data.object.definition.description,
          }
        },
        timestamp: new Date().toISOString(),
      };
  
      if (data.object.definition.extensions !== undefined) statement.object.definition.extensions = data.object.definition.extensions;
      if (data.result !== undefined) statement.result = data.result;
      if (data.context !== undefined) statement.context = data.context;
      if (data.authority !== undefined) statement.authority = data.authority;
  
      return statement;
    }
      
  
    private generateStatementFromZero(verbId: string, objectId: string, parameters: Map<string,any>) : XAPIStatement{
  
      let parameter = "";
      const header = "http://example.com/";
      const statement: XAPIStatement = {
        actor: {
          mbox: this.player.mail,
          name: this.player.name,
        },
        verb: {
          id: header+verbId,
          display: {},
        },
        object: {
          id: header+objectId,
          definition: {
            type: "",
            name: {},
            description: {},
            extensions: {}
          }
        },
        timestamp: new Date().toISOString(),
      };
  
      for (let [key, value] of parameters) {
        if (statement.object.definition.extensions !== undefined) {
          parameter = header + key;
          (statement.object.definition.extensions as { [key: string]: any })[parameter] = value; // Aseguramos a typescript que extensions es del tipo {string : any,...}
        }
        
      }
  
      return statement;
    }

  private sendStatement = async () => {
    try {
      if (!(this.statementQueue.length != 0)) {
        this.isSending = true;

        const response = await axios.post(this.url, this.statementQueue.tail, { //Entiendo que tail es el elemento de la cola que queremos enviar
        headers: {
          'Content-Type': 'application/json',
        },
        });
        if(response.status == 201)  this.statementQueue.dequeue(); //Si envia exitosamente lo elimina del encolado
                                                                  //Si falla no hacemos nada
        console.log('Respuesta:', response.data);
      }
    } catch (error) {
      console.error('Error al enviar la traza JaXpi:', (error as Error).message);
    }
    this.isSending = false;
  };

  private sendStatementsInterval() {
    this.sendStatement();
  }

  // Funcion que detiene el intervalo de envios de traza
  public stopStatementInterval() {
    clearInterval(this.statementInterval); // Detiene el temporizador
  }

  flush = async () => { //Si cliente quiere limpiar el encolado por lo que sea
      if (this.isSending) {
        await this.waitQueue();  // Si se está enviando alguna traza, esperar hasta que se haya completado
      }

      this.isSending = true;

      while (!(this.statementQueue.length != 0)) {
        this.statementQueue.dequeue();
      }

      this.isSending = false;
  };

  private async waitQueue(): Promise<void> {
    return new Promise<void>((resolve) => {
      // Esperar hasta que el envío haya sido completado
      const intervalo = setInterval(() => {
        if (!this.isSending) {
          clearInterval(intervalo);
          resolve();
        }
      }, 100);
    });
}

  customVerbWithJson(json: any) { 
    
    if (checkXAPI(json)){
      statementEnqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: this.generateStatement(json) });
    }
  
  }

  customVerb(verb: string, object: string, parameters: Map<string,any>) { 

    let statement = this.generateStatementFromZero(verb, object, parameters);

    statementEnqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: this.generateStatement(statement) });

  }


 jumped(distance : number,units : string,customObject? : object) { 
      getDataFromURL("https://raw.githubusercontent.com/UCM-FDI-JaXpi/lib/main/statements/jumped.json")
      .then((data) => {             // data es un objeto JSON
        
        // Cambiamos el objeto si usuario nos pasa uno y actualizamos los parametros
        if(customObject !== undefined) data.object = customObject;
        data.object.extensions['https://github.com/UCM-FDI-JaXpi/distance'] = distance;
data.object.extensions['https://github.com/UCM-FDI-JaXpi/units'] = units;

        
        try {
          const statement = this.generateStatement(data);
          statementEnqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
        } catch (error) {
          console.error("Error al generar el statement:", error);
        }

      })
      .catch((error) => {
          console.error('Error al obtener datos:', error);
      });
    }

  }