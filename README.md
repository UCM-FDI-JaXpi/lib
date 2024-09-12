# Library - JaXpi

The JaXpi library is design to integrate with games developed in JavaScript or TypeScript for e-Learning purposes, allowing the capture of player data through xAPI-formatted traces for later analysis.

## 1. Installation guide
### 1.1. JaXpi module
To install the module, you need previosly installed Node.js and npm, then simply install it from Node:

`$ npm install jaxpi`

and install all the references needed

`$ npm install`

and import the Jaxpi class into your main file.

 ### 1.2. JaXpi File
 You can also download the jaxpi.ts or jaxpi.js files if desired. It does not require additional imports and they're ready for use in global scope projects.

 ## 2. Use guide
 Once installed, create a Jaxpi object in your main file and configure the actor performing the actions in the statement, the server where the statements will be sent, and the authentication token for the server if needed.
```javascript
export const jaxpi = new Jaxpi({name: ACTOR_NAME, mail: ACTOR_MAIL}, SERVER_URL, GAME_TOKEN_POP);
```
 In the constructor, you can also configure the time interval for sending the statements (disabled by default) and the number of statements stored before sending (default is 5). Statements can also be sent manually whenever the developer wants using the `jaxpi.flush()` method.

 Each time the player performs an action you want to analyze, add a line with the Jaxpi function to generate the statement that best fits your needs. These are created with `jaxpi.verb().object()`.

 For example:
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
 If none of the existing functions meet your needs, you can always use `jaxpi.customVerb()`, which accepts a verb and an object parameters in any JSON format. To make it even easier, you can use `jaxpi.verbs.verb` and `jaxpi.objects.object` with the verbs and objects already available in the library, adding whatever you need.

 The statements are configurable, allowing you to add the context, result, and authority fields from the xAPI standard, as well as additional parameters in the `objects.extensions` field in any function that generates a statement, if needed.

 ## 3. Adding Verb-Object Functions to JaXpi
 New functions can be automatically added to the JaXpi library. You just need to add new verbs or objects in JSON format to the verbs or objects folder, respectively, following the format in which they are created, and run the command $ npm run generate.  To add objects to an existing verb, simply add their names in the objects field of the desired verb's JSON.

 JSON examples:
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
 ## 4. Integration with JaXpi Server
 If you want to use the LRS server provided by JaXpi, you should add a way for the user to enter a 6-digit password. This can be validated with `jaxpi.validateKey(key)`, which returns a boolean value. If the key is correct, it should be set in the JaXpi object using the `jaxpi.setKey(key)` method. Additionally, in the JaXpi object constructor, you should use http://localhost:3000/records as the server value and the game token for the authentication token like this:
   ```javascript
let SERVER_URL = 'http://localhost:3000/records';
let GAME_TOKEN = 'cEPTx-GsXov-dJBXe-pY7jc-NPyQ9';
...
const jaxpi = new Jaxpi({name: ACTOR_NAME, mail: ACTOR_MAIL}, SERVER_URL, GAME_TOKEN);
 ```

Follow the steps described at https://github.com/UCM-FDI-JaXpi/server to deploy the server and use it.
