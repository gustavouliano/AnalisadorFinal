class Token {

    public token: string;
    public lexema: string;
    public linha: number;
    public coluna: number;

    constructor(token: string, lexema: string, linha: number, coluna: number){
        this.token  = token;
        this.lexema = lexema;
        this.linha  = linha;
        this.coluna = coluna;
    }

    toString(){
        console.log(`Lexema: ${this.lexema.replace('\n', ' ')} | Token: ${this.token} | Linha: ${this.linha} | Coluna: ${this.coluna}`);
    }
}

export default Token;