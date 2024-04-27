// Import JaxpiLib
import Jaxpi from '../src/index.js'

// Create a new JaxpiLib instance
let jaxpi = new Jaxpi({name: "Student1", mail: "student1@example.com", password: "Pp123456"},"http://localhost:3000/records", "http://localhost:3000/login", undefined, 40);


jaxpi.setContext("Maria","mmaria@bro.com","class_A","UCM",[["patatas",2],["coches",true],["algo","a"]])


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
function random(min, max){
  return Math.random() * (max - min + 1) + min;
}

async function foo(){
    await delay(2000)

    for (let i = 0; i < random(1,7); i++) jaxpi.jumped(1,"1").character("Bro")
    for (let i = 0; i < random(1,7); i++) jaxpi.accepted().mission("Defeat the East Europan Imperial Alliance Army")
    for (let i = 0; i < random(1,7); i++) jaxpi.destroyed().item("Luna +3")
    for (let i = 0; i < random(1,7); i++) jaxpi.used(true).item("Phoenix Feather")
    for (let i = 0; i < random(1,7); i++) jaxpi.unlocked().skill("Soul Lance")
    for (let i = 0; i < random(1,7); i++) jaxpi.completed(1).level("Rainbow Road")
    jaxpi.writeExample("count")


}
  
async function executeActionsWithDelay() {
    await foo();

    //jaxpi.flush();

    // jaxpi.set_lrs(true)
    // jaxpi.accepted().achievement("a1")
    // jaxpi.flush()
}
  
executeActionsWithDelay();

//process.exit(0)