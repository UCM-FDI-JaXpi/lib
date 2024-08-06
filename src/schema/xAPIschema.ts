// Define un tipo para las extensiones
interface ContextExtensions {
  session?: string;
  [key: string]: any;  // Permite otras propiedades en el futuro
}

export interface XAPIStatement {
    actor: {
      name: string;
      mbox: string;
    };
    verb: {
      id: string;
      display: object;
    };
    object: {
      id: string;
      definition: {
        type: string;
        name: object;
        description: object;
        extensions?: object;
      };
    };
    result?: {
      completion: boolean;
      success: boolean;
      score:{
        scaled: number;
      };
      extensions: object;
    };
    context?: {
      instructor:{
        name: string;
        mbox: string;
      };
      contextActivities:{
        parent: {
          id: string;
        };
        grouping: {
          id: string;
        };
      };
      extensions: ContextExtensions;
    };
    timestamp: string;
    authority?:{
      name: string;
      mbox: string;
    }
  }