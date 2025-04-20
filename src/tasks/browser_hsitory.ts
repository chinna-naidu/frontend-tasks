export class BrowserHistory {
    #urls: string[] = [];
    #current = -1;


    constructor(url?: string) {
        if (url) {
            this.#urls.push(url);
            this.#current++;
        }
    }

    // when visiting new url all the forward history must be cleared
    visit(url: string) {
        this.#urls = this.#urls.slice(0, this.#current + 1);

        this.#urls.push(url);
        this.#current++;
    }

    forward() {
        // making sure idx is less than length of urls
        this.#current = Math.min(this.#current + 1, this.#urls.length - 1);
        return this.#urls[this.#current];
    }

    backward() {
        // making sure idx is greater than or equal to 0
        this.#current = Math.max(this.#current - 1, 0);
        return this.#urls[this.#current];
    }

}