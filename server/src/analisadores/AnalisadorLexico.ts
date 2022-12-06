import { InterfaceMessage } from "../shared/InterfaceMessage";
import Token from "../shared/Token";
import { oFinais as tabelaFinais, oTabela as tabelaGramatica } from "../tabelas/tabelaLexica"; 

type tabelasLexica = {
    [index: string]: any;
}

class AnalisadorLexico implements InterfaceMessage {

    public delta: tabelasLexica;
    public tabelaFinais: tabelasLexica;
    public listaTokens: Array<any>;
    public message: string;

    constructor(){
        this.delta        = tabelaGramatica;
        this.tabelaFinais = tabelaFinais;
        this.listaTokens  = [];
        this.message = '';
    }

    iniciaAnalise(gramaticaEntrada: string){
        let iEstado: string | number = '0';
        let bTokenInvalido = false;
        let iLinha = 1;
        let iColuna = 0;
        let sLexema = '';
        gramaticaEntrada = gramaticaEntrada.toLocaleLowerCase();
        for (let i = 0; i < gramaticaEntrada.length; i++){
            console.log(iEstado);
            if (this.delta[iEstado] && this.delta[iEstado][gramaticaEntrada[i]]){
                iEstado = this.delta[iEstado][gramaticaEntrada[i]];
                // Se for quebra de linha...
                if (iEstado == 18){
                    iLinha++;
                    iColuna = -1;
                }
                iColuna++;
                sLexema += gramaticaEntrada[i].toString();
                
            }
            else {
                if (this.tabelaFinais[iEstado]){
                    if (iEstado != 8 && iEstado != 18){
                        this.listaTokens.push(
                            new Token(this.tabelaFinais[iEstado], sLexema, iLinha, iColuna)
                        );
                    }
                    iEstado = 0;
                    i--;
                    sLexema = '';
                }
                else{
                    bTokenInvalido = true;
                    this.listaTokens.push(
                        new Token('Token não reconhecido.', 'Sync', iLinha, iColuna)
                    );
                    if (this.message.length){
                        this.message += "\n";
                    }
                    this.message += `Token "${gramaticaEntrada[i]}" - Linha ${iLinha} e Coluna ${iColuna} não reconhecido`;
                    iEstado = 0;
                    sLexema = '';
                    // break;
                }
            }
        }
        //Pra adicionar o último estado do for
        if (!bTokenInvalido){
            if (iEstado != 8 && iEstado != 18){
                this.listaTokens.push(
                    new Token(this.tabelaFinais[iEstado], sLexema, iLinha, iColuna)
                ); 
            }
        }

        this.listaTokens.forEach((oToken) => {
            oToken.toString();
        });

        if (bTokenInvalido){
            console.log('Houve um erro...');
        }
        else{
            this.message = 'OK';
        }
        return !bTokenInvalido;
    }

    getMessage(): string {
        return this.message;
    }
}

export default AnalisadorLexico;