export class Queue<T> {
    private items: T[] = [];
  
    enqueue(item: T): void {
      this.items.push(item);
    }
  
    dequeue(): T | undefined {
      return this.items.shift();
    }
  
    peek(): T | undefined {
      return this.items[0];
    }
  
    removeHead(): void {
      if (!this.isEmpty()) {
        this.items.shift();
      }
    }
  
    isEmpty(): boolean {
      return this.items.length === 0;
    }
  
    toArray(): T[] {
      return [...this.items];
    }
  
    get length(): number {
      return this.items.length;
    }
  
    get head(): T | undefined {
      return this.items[0];
    }
  }