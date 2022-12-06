import express, {Request, Response} from 'express';
import cors from 'cors';
import AnalisadorLexico from './analisadores/AnalisadorLexico';
import AnalisadorSintatico from './analisadores/AnalisadorSintatico';
import GeradorAssembly from './analisadores/GeradorAssembly';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/analisar', (req: Request, res: Response) => {

    let gramatica: string = req.body.gramatica;
    let retorno = {};

    const lexico = new AnalisadorLexico();
    const resultAnaliseLexica = lexico.iniciaAnalise(gramatica);
    console.log('Resultado Análise Léxica: ' + resultAnaliseLexica);

    if (resultAnaliseLexica){
        const sintatico = new AnalisadorSintatico(lexico);
        const resultAnaliseSintatica = sintatico.inicia();
        console.log('Resultado Análise Sintática: ' + resultAnaliseSintatica);

        Object.assign(retorno, {
            sintatico: sintatico.getMessage(),
            semantico: sintatico.semantico.getMessage(),
        })  
        if (resultAnaliseSintatica){
            const geradorAssembly = new GeradorAssembly(sintatico.semantico.escopo[0]);
            const codigoAssembly = geradorAssembly.gerar();
            console.log(codigoAssembly);
            Object.assign(retorno, {codigoAssembly: codigoAssembly});
        }
    }

    Object.assign(retorno, {
        lexico: lexico.getMessage(),
    });
    return res.json(retorno);
});

app.listen(3000, () => console.log('Rodando na porta 3000...'));