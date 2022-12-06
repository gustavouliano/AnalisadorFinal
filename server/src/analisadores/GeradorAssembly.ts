import { FunctionClass } from "../shared/FunctionClass";
import { IfClass } from "../shared/IfClass";

type resultAssembly = {
    data: string;
    text: string;
}

class GeradorAssembly {

    public function: FunctionClass;
    public variaveis: Array<any>;
    public result: resultAssembly;

    /**
     * Construtor da classe.
     * @param {FunctionClass} functionClass 
     */
    constructor(functionClass: FunctionClass){
        this.function = functionClass;
        this.variaveis = []; // ['registrador', 'lexema']
        this.result = {'data': '', 'text': ''};
    }

    // @TODO fazer para adicionar a declaracao se for String.
    gerar(){
        this.gerarRecursivo(null, this.function);
        return this.result;
    }

    gerarRecursivo(oBlocoAnterior: any, oBloco: any){
        if (oBloco){
            var oCodigo = oBloco.getAssemblyFormat(this.variaveis);
            this.result.data += this.espaco() + oCodigo.data;
            //Caso seja um If o bloco anterior, teremos que adicioná-lo dentro de um bloco 'label'!
            if (oBlocoAnterior instanceof IfClass){
                this.result.text += this.espaco() + "\nlabel: " + "\n";
                this.result.text += this.espaco(8) + oCodigo.text;
            }
            else{
                this.result.text = this.espaco() + oCodigo.text;
            }
            // Declaração não tem bloco.
            oBloco.blocos && oBloco.blocos.forEach((oNewBloco: any) => {
                this.gerarRecursivo(oBloco, oNewBloco);
            });
        }
    }

    espaco(iQtd = 4){
        let sEspaco = '';
        for (let i = 0; i < iQtd; i++) {
            sEspaco += ' ';
        }
        return sEspaco;
    }

    public static getVariavelFromLexema(lexema: string, variaveis: Array<any>){
        return variaveis.find((aEl) => {
            if (aEl[1] == lexema){
                return true;
            }
        })
    }

    public static getProximoRegistradorLivre(variaveis: Array<any>|null){
        if (!variaveis || !variaveis.length){
            return '$t0';
        }
        let sLastCaractere =  variaveis[variaveis.length - 1][0].slice(-1);
        return '$t' + Number(sLastCaractere + 1);
    }
}

export default GeradorAssembly;