# Librería - JaXpi

La librería de JaXpi se integra con juegos desarrollados en JavaScript o TypeScript con propósitos de e-Learning, permitiendo la captura de datos del jugador a través de trazas en formato xAPI para su posterior análisis.

## 1. Guia de instalación
### 1.1. Módulo JaXpi
Para instalar el módulo simplemente se puede instalar desde node

`$ npm install jaxpi`

e importar la clase jaxpi en tu archivo principal.

 ### 1.2. Archivo JaXpi
 Se puede descargar el archivo jaxpi.ts o jaxpi.js también si se desea. Este no requiere de importaciones extra, y viene preparado para su uso en proyectos desarrollados en ámbito global.

 ## 2. Guía de uso
 Una vez instalado, crea un objeto Jaxpi en tu archivo principal y configura el actor que realiza las acciones de la traza, el servidor al que se van a enviar las trazas y el token de autenticación en caso de necesitarlo.
```javascript
export const jaxpi = new Jaxpi({name: ACTOR_NAME, mail: ACTOR_MAIL}, SERVER_URL, GAME_TOKEN_POP);
```
 En el constructor se puede configurar además el intervalo de tiempo en el que se envían las trazas (por defecto desactivado), y el número de trazas que se almacenan antes del envío (por defecto 5). Las trazas también se pueden enviar cada vez que el desarrollador quiera usando el metodo `jaxpi.flush()`.
 
 Cada vez que el jugador realice una acción que quieras analizar, agrega una linea con la función de jaxpi para generar la traza que más se acomode a tus necesidades.
 Estas se crean con `jaxpi.verbo().objeto()`.
 Por ejemplo:
 ```javascript
 function attacked(){
     this.hp -= 1;

     if (this.hp <= 0) {
       jaxpi.died().character(`${this.player.name}`)
       this.hp = 0;
       this.alive = false;
     }
 }
 ```
 Si ninguna de las funciones existentes cumple con las necesidades, siempre se puede utilizar  `jaxpi.customVerb()` que acepta un parámetro verbo y uno objeto en formato JSON cualesquiera.
 Para facilitarlo aún más se pueden utilizar `jaxpi.verbs.verbo` y `jaxpi.objects.objeto` con los verbos y objetos ya existentes en la librería añadiendo lo que necesites.

 Las trazas son configurables, pudiendo añadir los campos context, result y authority del estándard xAPI, además de poder agregar parametros extras en el campo `objects.extensions` en cualquier función que genere una traza si se requiere.

 ## 3. Agregar funciones verbo-objeto a JaXpi
 Se pueden agregar nuevas funciones de manera automática a la librería de JaXpi. Tan sólo se necesitan agregar nuevos verbos u objetos en formato JSON en la carpeta de verbos u objetos respectivamente, respetando el formato en el que están creados y ejecutar el comando `$ npm run generate`. Para agregar objetos a un verbo ya existente, simplemente añade sus nombre en el campo objects del JSON del verbo deseado.
 Ejemplos de JSON:
  ```JSON
{
    "id": "https://github.com/UCM-FDI-JaXpi/lib/accepted",
    "display": {
        "en-US": "accepted",
        "es": "aceptado"
    },
    "objects": ["achievement","award","mission","reward","task"],
    "description": "The player accepts an object like a task or a reward"
}
 ```
  ```JSON
{
    "id": "https://github.com/UCM-FDI-JaXpi/objects/achievement",
    "definition": {
        "type": "https://github.com/UCM-FDI-JaXpi/object",
        "name": {
            "en-US": "Default achievement",
            "es": "Logro por defecto"
        },
        "description": {
            "en-US": "A recognition or accomplishment gained by meeting certain criteria",
            "es": "Un reconocimiento o logro obtenido al cumplir ciertos criterios"
        }
    }
}
 ```
 ## 4. Integración con servidor de JaXpi
 Si se desea utilizar el LRS proporcionado por JaXpi se pide que se agregue una forma al usuario de introducir una contraseña de 6 digitos. Esta se puede validar con `jaxpi.validateKey(key)` que devuelve un valor booleano, en caso de ser correcto se pide que se establezca en el objeto JaXpi con el metodo `jaxpi.setKey(key)`. Además en el constructor del objeto JaXpi se deberá utilizar http://localhost:3000/records como valor del servidor y el token de juego para el token de autenticación.

 Seguir los pasos descritos en https://github.com/UCM-FDI-JaXpi/server para desplegar el servidor y utilizarlo.
