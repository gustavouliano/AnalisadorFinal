import { InterfaceMessage } from "../shared/InterfaceMessage";
import { tabelaAFD, tabelaGoTo } from "../tabelas/tabelaSintatica";
import AnalisadorLexico from "./AnalisadorLexico";
import GeradorAssembly from "./GeradorAssembly";
import Semantico from "./Semantico";

type tabelasSintatica = {
    [index: number]: any;
}

/**
 * Classe responsável pela implementação do Analisador Sintático Ascendente SLR.
 */
class AnalisadorSintatico implements InterfaceMessage{

    public afd: tabelasSintatica;
    public goto: tabelasSintatica;
    public countToken: number;
    public pilha: Array<any>;
    public lexico: AnalisadorLexico;
    public semantico: Semantico;
    public message: string;

    constructor(lexico: AnalisadorLexico){
        this.afd = tabelaAFD;
        this.goto = tabelaGoTo;
        this.countToken = 0;
        this.pilha = [0];
        this.lexico = lexico;
        this.semantico = new Semantico();
        this.message = '';
    }

    inicia(){
        var bErroSemantico = false;
        
        this.lexico.listaTokens.push({token: '$'});

        for(let i = 0; i < this.lexico.listaTokens.length; i++){
            var sToken = this.lexico.listaTokens[i].token;

            this.semantico.criaEscopo(this.lexico.listaTokens[i]);

            console.log('Token: ' + sToken + ' || Topo: ' + this.getTopoPilha());

            if (this.afd[this.getTopoPilha()][sToken] &&
                this.afd[this.getTopoPilha()][sToken][0] == 'S'){
                var sEstado = this.afd[this.getTopoPilha()][sToken].substr(1);
                this.empilha(sEstado);    
            }
            else if (this.afd[this.getTopoPilha()][sToken] &&
                this.afd[this.getTopoPilha()][sToken][0] == 'R'){
                var iQtdReduce = this.afd[this.getTopoPilha()][sToken].substr(1);

                for(let j = 0; j < iQtdReduce; j++){
                    this.desempilha();
                }
                
                console.log('Feito reduce');
                console.log('Topo atual:' + this.getTopoPilha());
                
                if (!this.semantico.analisaReduce(this.getTopoPilha(), this.lexico.listaTokens, i)){
                    bErroSemantico = true;
                    break;
                }

                this.empilha(this.goto[this.getTopoPilha()][sToken]);
                i--;
            }
            else if(this.afd[this.getTopoPilha()][sToken] == 'ACCEPT'){
                console.log('LINGUAGEM ACEITA.')
                this.message = 'OK';
                break;
            }
            else{
                console.log('--NÃO ACEITO.');
                console.log('Token: ');
                console.log(sToken);
                console.log(this.getTopoPilha());
                this.message = `Houve erro com o token ${sToken}`;
                return false;
            }
        }
        console.log('Acabou...');
        console.log(this.semantico.escopo[0]);
        // console.log(this.semantico.escopo[0]);
        console.log(this.semantico.escopo[0].variaveis)
        if (bErroSemantico){
            console.log('Houve erro semântico...');
            this.message = 'Não finalizado';
        }

        return !bErroSemantico;
    }

    getTopoPilha(){
        if (this.pilha.length){
            return this.pilha[this.pilha.length - 1];
        }
    }

    desempilha(){
        this.pilha.pop();
    }

    empilha(xValor: any){
        this.pilha.push(xValor);
    }
    
    getMessage(): string {
        return this.message;
    }
}

export default AnalisadorSintatico;