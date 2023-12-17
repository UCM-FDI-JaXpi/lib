# lib

Si quieres utilizar verbos (trazas) que no estén contempladas en el codigo base solo tienes que:
- Añadir un fichero JSON por cada nuevo verbo con su traza xAPI
- Utilizar npm run generate-code para actualizar la lista de funciones que envian trazas de cada verbo
- Utilizar las nuevas funciones generadas para tus nuevos verbos (objeto.nuevoVerbo())
