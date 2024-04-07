import { XAPIStatement } from './xAPIschema';

export interface Player {
    name: string;
    mail: string;
    userId: string;
    sessionId: string;
}

export function generateStatementFromZero(verbId: string, objectId: string, parameters: Array<[string,any]>): [any, any] {

    let parameter = "";
    const header = "http://example.com/";
    const verb = {
        id: header + verbId,
        display: {},
    }
    const object = {
        id: header + objectId,
        definition: {
        type: "custom",
        name: {},
        description: {},
        extensions: {}
        }
    }

    for (let [key, value] of parameters) {
        if (object.definition.extensions !== undefined) {
        parameter = header + verbId + "_" + key;
        (object.definition.extensions as { [key: string]: any })[parameter] = value; // Aseguramos a typescript que extensions es del tipo {string : any,...}
        }

    }

    return [verb,object];
}

export function generateStatement(player: Player, verb: any, object: any, result?: any, context?: any, authority?: any): XAPIStatement {

    const statement: XAPIStatement = {
        actor: {
        mbox: player.mail,
        name: player.name,
        },
        verb: {
        id: verb.id,
        display: verb.display,
        },
        object: {
        id: object.id,
        definition: {
            type: object.definition.type,
            name: object.definition.name,
            description: object.definition.description,
        }
        },
        timestamp: new Date().toISOString(),
    };

    if (object.definition.extensions !== undefined) statement.object.definition.extensions = object.definition.extensions;
    if (result !== undefined) statement.result = result;
    if (context !== undefined) statement.context = context;
    if (authority !== undefined) statement.authority = authority;

    return statement;
}

export function generateObject(objectJson: any, name?: string): any {

    const object: {id: string, definition: any} = {
        id: objectJson.id,
        definition: {
            type: objectJson.definition.type,
            name: objectJson.definition.name,
            description: objectJson.definition.description,
            extensions: {}
        }
        
    };

    if (name)
        object.id = object.id.substring(0, object.id.lastIndexOf("/") - 1) + name
    
    return object;
}