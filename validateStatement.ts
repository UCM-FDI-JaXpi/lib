export function checkXAPI(json: any): boolean{

    // Define los campos esperados en la traza
    const expectedFields = ["actor", "verb", "object"];
    const expectedFieldsInActor = ["name", "mbox"];
    const expectedFieldsInVerb = ["id", "display"];
    const expectedFieldsInDefinition = ["type", "name", "description"];
    const expectedFieldsInObject = ["id", "definition"];
    const opcionalFields = ["result", "context", "authority"];
  
    // Verifica si la traza contiene algún campo adicional que no sea parte de los campos esperados
    for (const field in json) {
      if (!expectedFields.includes(field) && !opcionalFields.includes(field)) {
        return false; // Devuelve false si encuentra un campo adicional
      }
    }

    for (const field in json.actor) {
      if (!expectedFieldsInActor.includes(field)) {
        return false; // Devuelve false si encuentra un campo adicional
      }
    }

    for (const field in json.verb) {
      if (!expectedFieldsInVerb.includes(field)) {
        return false; // Devuelve false si encuentra un campo adicional
      }
    }

    for (const field in json.object) {
      if (!expectedFieldsInObject.includes(field)) {
        return false; // Devuelve false si encuentra un campo adicional
      }
    }

    for (const field in json.object.definition) {
      if (!expectedFieldsInDefinition.includes(field) && field !== "extensions") {
        return false; // Devuelve false si encuentra un campo adicional
      }
    }

  
    // Verifica si todos los campos esperados están presentes en la traza
    for (const field of expectedFields) {
      if (!json[field]) {
        return false; // Devuelve false si falta algún campo esperado
      }
    }
    for (const field of expectedFieldsInActor) {
      if (!json.actor[field]) {
        return false; // Devuelve false si falta algún campo esperado
      }
    }
    for (const field of expectedFieldsInVerb) {
      if (!json.verb[field]) {
        return false; // Devuelve false si falta algún campo esperado
      }
    }
    for (const field of expectedFieldsInObject) {
      if (!json.object[field]) {
        return false; // Devuelve false si falta algún campo esperado
      }
    }
    for (const field of expectedFieldsInDefinition) {
      if (!json.object.definition[field]) {
        return false; // Devuelve false si falta algún campo esperado
      }
    }
  
    // Verificar si la traza tiene los campos requeridos
    if (!json.actor || !json.actor.name || !json.actor.mbox ||
          !json.verb || !json.verb.id || !json.verb.display ||
            !json.object || !json.object.id || !json.object.definition || 
              !json.object.definition.type || !json.object.definition.name || !json.object.definition.description) {
      return false;
    }
  
    // Validar los tipos y estructuras de los campos
    if (typeof json.actor.name !== 'string' || typeof json.actor.mbox !== 'string' ||
          typeof json.verb.id !== 'string' || 
            typeof json.object.id !== 'string' || typeof json.object.definition.type !== 'string') {
      return false;
    }
  
    // Verificar campo opcional 'result'
    if (json.result !== undefined) {
      if (typeof json.result.completion !== 'boolean' || 
          typeof json.result.success !== 'boolean' ||
          typeof json.result.score?.scaled !== 'number') { // Verificar campo opcional 'score'
          return false;
      }
    }
  
    // Verificar campo opcional 'context'
    if (json.context !== undefined) {
        if (typeof json.context.instructor?.name !== 'string' || 
            typeof json.context.instructor?.mbox !== 'string' ||
            typeof json.context.contextActivities?.parent?.id !== 'string' ||
            typeof json.context.contextActivities?.grouping?.id !== 'string') {
            return false;
        }
    }
  
    // Verificar campo opcional 'authority'
    if (json.authority !== undefined) {
        if (typeof json.authority.name !== 'string' || typeof json.authority.mbox !== 'string') {
            return false;
        }
    }
  
    // Si pasó todas las validaciones, devolver verdadero
    return true;
  }