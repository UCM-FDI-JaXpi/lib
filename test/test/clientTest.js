// // Import JaxpiLib
// import Jaxpi from '../src/index.js'
// import axios from 'axios'


// // Login route to server "http://localhost:3000/login" will get you a token
// const login_response = await axios.post("http://localhost:3000/login", {email: "student1@example.com", password: "Pp123456"}, {
//     headers: {
//         'Content-Type': 'application/json',
//     }
// });

// let token = login_response.data.token

// console.log(token)

// // // Create a new JaxpiLib instance
// let jaxpi = new Jaxpi({name: "Student1", mail: "student1@example.com"},"http://localhost:3000/records", token);


// jaxpi.setContext("Maria","mmaria@bro.com","class_A","UCM",[["patatas",2],["coches",true],["algo","a"]])

// jaxpi.accepted().mission("Defend")
// jaxpi.flush()

// function delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }
  
// async function executeActionsWithDelay() {
//     await delay(2000);
//     jaxpi.started().level("Level 1");

//     await delay(3000);
//     jaxpi.exited().level("Level 1");

//     await delay(2000);
//     jaxpi.loaded("Guardado 1").level("Level 1");

//     await delay(2100);
//     jaxpi.exited().level("Level 1");

//     await delay(4000);
//     jaxpi.loaded("Guardado 1").level("Level 1");

//     await delay(5000);
//     jaxpi.completed(90).level("Level 1");
//     jaxpi.started().level("Level 2");

//     await delay(2000);
//     jaxpi.jumped(20, "meters").enemy("Enemy 1");
//     jaxpi.completed(98).level("Level 2");

//     await delay(5000);
//     jaxpi.started().level("Level 1");

//     await delay(5000);
//     jaxpi.started().level("Level 1");

//     await delay(2000);
//     jaxpi.completed(100).level("Level 1");

//     jaxpi.flush();

//     // jaxpi.set_lrs(true)
//     // jaxpi.accepted().achievement("a1")
//     // jaxpi.flush()
// }
  
// executeActionsWithDelay();

//process.exit(0)
import bcrypt from 'bcrypt'

//console.log(/^stat\d+$/.test("stat44"))

const foo = await bcrypt.hash("prueba", 13)
const foo2 = await bcrypt.hash("prueba", 13)
console.log(foo + "   " + foo2)