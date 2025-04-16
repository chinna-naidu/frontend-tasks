


interface TokenType {
    type: "operator" | "number",
    token: string | number
}
export class StingTokenizer {
    #input!: string;
    #index = 0
    #operatorSet = new Set(["+", "-", "*", "/", "^", "=", "<", ">", "%", "(", ")"]);
    #NUM_REGEX = /\d+/i

    constructor(str: string) {
        this.#input = str;
    }

    get #hasMoreTokens() {
        return this.#index < this.#input.length;
    }

    get currentChar() {
        return this.#input.charAt(this.#index);
    }



    #skipWhiteSpaces() {
        while (this.#hasMoreTokens && this.currentChar === " ") {
            this.#index++;
        }
    }

    #matchToken(): TokenType | null {
        // skipping all whitespaces if there are any
        this.#skipWhiteSpaces();


        // checking if the non white space is an operator and returning
        if (this.#hasMoreTokens && this.#operatorSet.has(this.currentChar)) {
            const token = this.currentChar;
            this.#index++;
            return { type: "operator", token }
        }

        // temp buffer to accumulate numbers
        let buffer = "";

        // acummulating all numbers to the buffer until they are numbers
        while (this.#hasMoreTokens && this.#NUM_REGEX.test(this.currentChar)) {
            buffer += this.currentChar;
            this.#index++;
        }


        if (buffer.length > 0 && !Number.isNaN(Number(buffer))) {
            return {
                type: "number",
                token: Number(buffer)
            }
        }


        return null;
    }


    getNextToken(): TokenType | null {
        if (!this.#hasMoreTokens) return null

        const token = this.#matchToken();

        return token
    }

}