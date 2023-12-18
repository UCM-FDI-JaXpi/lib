interface XAPITrace {
    actor: {
      account?: {
        name: string;
      }
      mbox: string;
      name: string;
      objectType: string;
    };
    verb: {
      id: string;
      display: Record<string, string>;
    };
    object: {
      id: string;
      definition: {
        name: Record<string, string>;
        description: Record<string, string>;
        type?: string;
        interactionType?: string;
        correctResponsesPattern?: [boolean];
      };
      objectType: string;
    };
  }