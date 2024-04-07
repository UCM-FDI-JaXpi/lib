export function checkVerb(json: any): boolean{
  const expectedFieldsInVerb = ["id", "display","objects","extensions","extensions-doc"];
  const requiredFieldsInVerb = ["id", "display"]

  for (const field in json) {
    if (!expectedFieldsInVerb.includes(field)) {
      return false; // Devuelve false si encuentra un campo adicional
    }
  }

  for (const field of requiredFieldsInVerb) {
    if (!json[field]) {
      return false; // Devuelve false si falta algún campo esperado
    }
  }

  if (typeof json.id !== 'string') return false;  // Devuelve false si el tipo no es el esperado
  
  return true;
}

export function checkObject(json: any): boolean{
  const expectedFieldsInDefinition = ["type", "name", "description"];
  const expectedFieldsInObject = ["id", "definition"];

  for (const field in json) {
    if (!expectedFieldsInObject.includes(field)) {
      return false; // Devuelve false si encuentra un campo adicional
    }
  }
  for (const field in json.definition) {
    if (!expectedFieldsInDefinition.includes(field) && field !== "extensions") {
      return false; // Devuelve false si encuentra un campo adicional
    }
  }

  for (const field of expectedFieldsInObject) {
    if (!json[field]) {
      return false; // Devuelve false si falta algún campo esperado
    }
  }
  for (const field of expectedFieldsInDefinition) {
    if (!json.definition[field]) {
      return false; // Devuelve false si falta algún campo esperado
    }
  }

  // Devuelve false si el tipo no es el esperado
  if (typeof json.id !== 'string' || typeof json.definition.type !== 'string') return false;

  return true;
}