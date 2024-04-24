export class Queue {
    items = [];
    enqueue(item) {
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
}
