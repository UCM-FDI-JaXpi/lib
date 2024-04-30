import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path'
export class Queue {
    file = "import axios from 'axios'\nlet statements = [\n";
    items = [];
    enqueue(item) {
        this.file += JSON.stringify(item.data, null, 2) + ",\n" // Codigo generativo para ejemplos
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

foo();`
        fs.writeFileSync(path.join(dirname(fileURLToPath(import.meta.url)), `../examples/example${name + id}.js`), this.file);
    }
}
