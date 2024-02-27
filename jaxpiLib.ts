 
  import axios from 'axios';
import { Queue } from 'queue-typescript';
import { XAPIStatement } from './xAPIschema';
import { checkXAPI } from './validateStatement';

const statementQueue = new Queue<any>();



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
  //private statementInterval: NodeJS.Timeout;


  constructor(player: Player, url: string) {
    this.player = player;
    this.url = url;
    this.isSending = false;

    //this.statementInterval = setInterval(this.sendStatementsInterval.bind(this), 300); // Inicia el intervalo de envios de traza cada 5 seg
  }

  private queuedPromise: Promise<void> = Promise.resolve(); // Inicializamos una promesa resuelta

  private enqueueAction(action: () => Promise<void>) {
    // Creamos una nueva promesa que se resolverá una vez que la traza se haya encolado
    this.queuedPromise = this.queuedPromise.then(async () => {
      await action();
    });
  }

  private statementEnqueue(traza: any) {
    this.statementQueue.enqueue(traza);
  }

  private generateStatement(data: any): XAPIStatement {

    if (!data.actor || !data.actor.mbox || !data.actor.name || !data.verb || !data.verb.id || !data.verb.display || !data.object || !data.object.id || !data.object.definition || !data.object.definition.type || !data.object.definition.name || !data.object.definition.description) {
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


  private generateStatementFromZero(verbId: string, objectId: string, parameters: Map<string, any>): XAPIStatement {

    let parameter = "";
    const header = "http://example.com/";
    const statement: XAPIStatement = {
      actor: {
        mbox: this.player.mail,
        name: this.player.name,
      },
      verb: {
        id: header + verbId,
        display: {},
      },
      object: {
        id: header + objectId,
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
      if (this.statementQueue.length != 0) {
        this.isSending = true;

        const response = await axios.post(this.url, this.statementQueue.tail.statement, { //Entiendo que tail es el elemento de la cola que queremos enviar
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status == 201) this.statementQueue.dequeue(); //Si envia exitosamente lo elimina del encolado
        //Si falla no hacemos nada
        console.log('Respuesta:', response.data);

      }
    } catch (error) {
      console.error('Error al enviar la traza JaXpi:', (error as Error).message);
    }
    this.isSending = false;
  };

  // private sendStatementsInterval() {
  //   this.sendStatement();
  // }

  // // Funcion que detiene el intervalo de envios de traza
  // public stopStatementInterval() {
  //   clearInterval(this.statementInterval); // Detiene el temporizador
  // }




  flush = async () => { //Si cliente quiere limpiar el encolado por lo que sea
    await this.queuedPromise;

    if (this.isSending) {
      await this.waitQueue();  // Si se está enviando alguna traza, esperar hasta que se haya completado
    }

    this.isSending = true;

    if (this.statementQueue.length != 0) {
      console.log("Primera traza a enviar:\n" + JSON.stringify(this.statementQueue.tail.statement, null, 2) + "\n\n");
      this.sendStatement()
      
      //this.statementQueue.dequeue();
    }
    else
      console.log("La cola de trazas esta vacia");

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

    if (checkXAPI(json)) {
      this.statementEnqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: this.generateStatement(json) });
    }

  }

  customVerb(verb: string, object: string, parameters: Map<string, any>) {

    let statement = this.generateStatementFromZero(verb, object, parameters);

    this.statementEnqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: this.generateStatement(statement) });

  }


 jumped(jumped_distance : number,jumped_units : string,customObject? : object) { 
      this.enqueueAction(async () => {
        const data = await getDataFromURL("https://raw.githubusercontent.com/UCM-FDI-JaXpi/lib/main/statements/jumped.json");
        // data es un objeto JSON
  
        // Cambiamos el objeto si el usuario nos pasa uno y actualizamos los parámetros
        if (customObject !== undefined) data.object = customObject;
        data.object.definition.extensions['https://github.com/UCM-FDI-JaXpi/jumped_distance'] = jumped_distance;
        data.object.definition.extensions['https://github.com/UCM-FDI-JaXpi/jumped_units'] = jumped_units;

        const statement = this.generateStatement(data);
        await this.statementEnqueue({ user_id: this.player.userId, session_id: this.player.sessionId, statement: statement });
      });
    }

  }