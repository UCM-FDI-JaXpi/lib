export function checkVerb(json) {
    if (typeof json === 'string')
        return false;
    const expectedFieldsInVerb = ["id", "display", "objects", "extensions", "extensions-doc", "description"];
    const requiredFieldsInVerb = ["id", "display"];
    for (const field in json) {
        if (!expectedFieldsInVerb.includes(field)) {
            return false;
        }
    }
    for (const field of requiredFieldsInVerb) {
        if (!json[field]) {
            return false;
        }
    }
    if (typeof json.id !== 'string')
        return false;
    return true;
}
export function checkObject(json) {
    if (typeof json === 'string')
        return false;
    const expectedFieldsInDefinition = ["type", "name", "description"];
    const expectedFieldsInObject = ["id", "definition"];
    for (const field in json) {
        if (!expectedFieldsInObject.includes(field)) {
            return false;
        }
    }
    for (const field in json.definition) {
        if (!expectedFieldsInDefinition.includes(field) && field !== "extensions") {
            return false;
        }
    }
    for (const field of expectedFieldsInObject) {
        if (!json[field]) {
            return false;
        }
    }
    for (const field of expectedFieldsInDefinition) {
        if (!json.definition[field]) {
            return false;
        }
    }
    if (typeof json.id !== 'string' || typeof json.definition.type !== 'string')
        return false;
    return true;
}
// module.exports = {
//   checkVerb,
//   checkObject
// };
