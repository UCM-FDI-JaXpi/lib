import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path'
export class Queue {
    file = "import axios from 'axios'\nlet statements = [\n";
    items = [];
    enqueue(item) {
        //console.log(JSON.stringify(item.data, null, 2))
        //console.log(",")
        this.file += JSON.stringify(item.data, null, 2) + ",\n"
        this.items.push(item);
    }
    dequeue() {
        return this.items.shift();
    }
    peek() {
        return this.items[0];
    }
    removeHead() {
        if (!this.isEmpty()) {
            this.items.shift();
        }
    }
    isEmpty() {
        return this.items.length === 0;
    }
    toArray() {
        return [...this.items];
    }
    get length() {
        return this.items.length;
    }
    get head() {
        return this.items[0];
    }
    writeFile(name, id){
        this.file += `]
        
//console.log(statements.length)

// Número de grupos a crear
// Dividir el array en 7 grupos
const grupos = [];
let i = 0;
const tamGrupo = Math.ceil(statements.length / 7);
for (let i = 0; i < statements.length; i += tamGrupo) {
    grupos.push(statements.slice(i, i + tamGrupo));
}

// Iterar sobre cada grupo y asignar un nuevo valor de timestamp
let nuevoTimestamp = 0;
grupos.forEach((grupo) => {
    const incremento = Math.random() * 1000; // Incremento aleatorio para hacer los grupos diferentes
    grupo.forEach((traza) => {
        traza.timestamp = \`2024-04-\${17 + i}T\${19 + Math.round(Math.random() * (3 - (-7)) + (-7))}:30:12.927Z\`;
    });
    nuevoTimestamp += incremento;
    i++;
});

//statements.sort((a, b) => a.timestamp - b.timestamp);

// statements.forEach(element => {
//   console.log(element.timestamp)
// });

async function foo(){
  const response = await axios.post("http://localhost:3000/login", {email: "student1@example.com", password: "Pp123456"}, {
    headers: {
        'Content-Type': 'application/json',
    }
  });
  
  statements.forEach(async element => {
    await axios.post("http://localhost:3000/records", element, {
      headers: {
          'Content-Type': 'application/json',
          'x-authentication': response.data.token
      }
  });
  });
}

foo();
console.log("Student1")
//console.log(JSON.stringify(statements,null,2));`
        fs.writeFileSync(path.join(dirname(fileURLToPath(import.meta.url)), `../examples/example${name + id}.js`), this.file);
    }
}
