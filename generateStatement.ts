import { XAPIStatement } from './xAPIschema';

export interface Player {
    name: string;
    mail: string;
    userId: string;
    sessionId: string;
}

export function generateStatementFromZero(verbId: string | any, objectId: string | any, parameters?: Array<[string,any]>): [any, any] {

    let parameter = "";
    const header = "http://example.com/";
    let verb;
    let object;

    if (typeof verbId === "string")
        verb = {
            id: header + verbId,
            display: {},
        }
    else
        if (verbId.id)
        verb = {
            id: verbId.id,
            display: verbId.display,
        }

    if (typeof objectId === "string")
        object = {
            id: header + objectId,
            definition: {
                type: "custom",
                name: {},
                description: {},
                extensions: {}
            }
        }
    else
        object = {
            id: objectId.id,
            definition: objectId.definition
        }

    if (parameters){
        if (object.definition.extensions !== undefined)
            object.definition.extensions = {}
    
        for (let [key, value] of parameters) {
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

export function generateObject(objectJson: any, name?: string, description?: string): any {

    const object: {id: string, definition: any} = {
        id: objectJson.id,
        definition: {
            type: objectJson.definition.type,
            name: {...objectJson.definition.name}, // Clono el campo de objectJason para evitar que me sobreescriba con una referencia
            description: {...objectJson.definition.description},
            extensions: {}
        }
        
    };

    if (name)
        object.definition.name["en-us"] = name
        // object.id = object.id.substring(0, object.id.lastIndexOf("/") - 1) + name
    if (description)
        object.definition.description["en-us"] = description
    
    return object;
}