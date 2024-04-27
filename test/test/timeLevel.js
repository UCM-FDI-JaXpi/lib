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
    for(let j = 1; j < 7; j++){
      jaxpi.started().level(`level ${j}`)
      await delay(2000)
      jaxpi.exited().level(`level ${j}`)
      await delay(2000)
      jaxpi.loaded(`save 1${j}`).level(`level ${j}`)
      await delay(2000)
      jaxpi.exited().level(`level ${j}`)
      await delay(2000)
      jaxpi.loaded(`save 2${j}`).level(`level ${j}`)
      await delay(2000)
      for (let i = 0; i < random(5,10); i++){
        switch(random()){
          case 1:
            jaxpi.completed(1).level(`level ${j}`)
            jaxpi.started().level(`level ${j}`)
            for (let k = 0; k < random(1,3); k++) await delay(2000)
            break;
          case 2:
            jaxpi.completed(1).level(`level ${j}`)
            jaxpi.loaded(`save 1${j}`).level(`level ${j}`)
            for (let k = 0; k < random(1,3); k++) await delay(2000)
            break;
          case 3:
            jaxpi.completed(1).level(`level ${j}`)
            jaxpi.loaded(`save 2${j}`).level(`level ${j}`)
            for (let k = 0; k < random(1,3); k++) await delay(2000)
            break;
          case 4:
            jaxpi.completed(1).level(`level ${j}`)
            jaxpi.overloaded(`save 1${j}`).level(`level ${j}`)
            for (let k = 0; k < random(1,3); k++) await delay(2000)
            break;
          case 5:
            jaxpi.exited().level(`level ${j}`)
            jaxpi.loaded(`save 1${j}`).level(`level ${j}`)
            for (let k = 0; k < random(1,3); k++) await delay(2000)
            break;
          case 6:
            jaxpi.exited().level(`level ${j}`)
            jaxpi.started().level(`level ${j}`)
            for (let k = 0; k < random(1,3); k++) await delay(2000)
            break;
          case 7:
            jaxpi.exited().level(`level ${j}`)
            jaxpi.overloaded(`save 1${j}`).level(`level ${j}`)
            for (let k = 0; k < random(1,3); k++) await delay(2000)
            break;
        }
        jaxpi.completed(1).level(`level ${j}`)
      }
    }

    jaxpi.writeExample("tlevel")


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