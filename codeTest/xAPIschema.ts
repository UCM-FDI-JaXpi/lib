interface XAPIStatement {
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
      extensions: object;
    };
    timestamp: Date;
    authority?:{
      name: string;
      mbox: string;
    }
  }