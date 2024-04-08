"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateObject = exports.generateStatement = exports.generateStatementFromZero = void 0;
function generateStatementFromZero(verbId, objectId, parameters) {
    var parameter = "";
    var header = "http://example.com/";
    var verb;
    var object;
    if (typeof verbId === "string")
        verb = {
            id: header + verbId,
            display: {},
        };
    else if (verbId.id)
        verb = {
            id: verbId.id,
            display: verbId.display,
        };
    if (typeof objectId === "string")
        object = {
            id: header + objectId,
            definition: {
                type: "custom",
                name: {},
                description: {},
                extensions: {}
            }
        };
    else
        object = {
            id: objectId.id,
            definition: objectId.definition
        };
    if (parameters) {
        if (object.definition.extensions !== undefined)
            object.definition.extensions = {};
        for (var _i = 0, parameters_1 = parameters; _i < parameters_1.length; _i++) {
            var _a = parameters_1[_i], key = _a[0], value = _a[1];
            parameter = header + verbId + "_" + key;
            object.definition.extensions[parameter] = value; // Aseguramos a typescript que extensions es del tipo {string : any,...}
        }
    }
    return [verb, object];
}
exports.generateStatementFromZero = generateStatementFromZero;
function generateStatement(player, verb, object, result, context, authority) {
    var statement = {
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
    if (object.definition.extensions !== undefined)
        statement.object.definition.extensions = object.definition.extensions;
    if (result !== undefined)
        statement.result = result;
    if (context !== undefined)
        statement.context = context;
    if (authority !== undefined)
        statement.authority = authority;
    return statement;
}
exports.generateStatement = generateStatement;
function generateObject(objectJson, name, description) {
    var object = {
        id: objectJson.id,
        definition: {
            type: objectJson.definition.type,
            name: objectJson.definition.name,
            description: objectJson.definition.description,
            extensions: {}
        }
    };
    if (name)
        object.definition.name["en-us"] = name;
    // object.id = object.id.substring(0, object.id.lastIndexOf("/") - 1) + name
    if (description)
        object.definition.description["en-us"] = description;
    return object;
}
exports.generateObject = generateObject;
