import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path'
export class Queue {
    file = "let statements = [\n";
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
        this.file += "]"
        fs.writeFileSync(path.join(dirname(fileURLToPath(import.meta.url)), `../examples/example${name + id}.js`), this.file);
    }
}
