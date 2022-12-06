window.onload = () =>{

    $('.form_gramatica').on('submit', fnSubmitForm)
}


const fnSubmitForm = function(event){
    event.preventDefault();
    console.log('a');

    const sGramatica = $(this).find('#gramatica').val();
    fetch('http://localhost:3000/api/analisar', {
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify({gramatica: sGramatica})
    })
    .then((oRes) => {
        oRes.json()
        .then((oData) => {
            console.log(oData);
            var oContainer = $('.analise_resultado');
            oContainer.empty();

            let oLexico = $('<div>').html('Analisador Léxico: ');
            oLexico.append($('<span>').html(oData['lexico']));
            oContainer.append(oLexico);

            if (oData['sintatico']){
                let oSintatico = $('<div>').html('Analisador Sintático: ');
                oSintatico.append($('<span>').html(oData['sintatico']));
                oContainer.append(oSintatico);
            }

            if (oData['semantico']){
                let oSemantico = $('<div>').html('Semântico: ');
                oSemantico.append($('<span>').html(oData['semantico']));
                oContainer.append(oSemantico);
            }
            
            if (oData['codigoAssembly']){
                let oAssembly = $('<div>').html('Código Assembly: ');
                let sData = '<br><i>.data</i><br>' + oData['codigoAssembly']['data'].replace(/(?:\r\n|\r|\n)/g, '<br>');
                let sText = '<br><i>.text</i><br>' + oData['codigoAssembly']['text'].replace(/(?:\r\n|\r|\n)/g, '<br>').replace('undefined', '');
                oAssembly.append($('<span>').html(sData));
                oAssembly.append($('<span>').html(sText));
                oContainer.append(oAssembly);
            }
        });
    })
    
}