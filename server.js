//variáveis da aplicação------------
const express = require("express");
const app = express();
var estados = [];
var estadoInicial = -1;
var estadosFinais = [];
var alfabeto = '';
var alfabetoAuxiliar = '';
var vetorEntradasPossiveis = [];
var transicoes = [];
var palavra = '';
//----------------------------------

//configurações do servidor************************************************
//view engine
app.set('view engine', 'html');

//static
app.use(express.static('./'));
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

//endereço onde o servidor ouve as requisições http://localhost:3000
app.listen(3000, () => {
    console.log("servidor rodando em localhost:3000")
});
//*************************************************************************

//rotas GET ---------------------------------------------------------------------------------------------------------------
app.get("/", (req, res) => {
    res.send('./index.html'); //retorna a página HTML
});

app.get("/alfabeto", (req, res) => { //retorna o vetor do alfabeto
    res.send(alfabeto);
});

app.get("/alfabeto-auxiliar", (req, res) => { //retorna o vetor do alfabeto auxiliar
    res.send(alfabetoAuxiliar);
});

app.get("/estados", (req, res) => { //retorna um vetor contendo todos os estados possíveis
    if (estados.length > 0) {
        res.status(201).send(estados);
    } else {
        res.status(202).send(estados);
    }
});

app.get("/estado-inicial", (req, res) => { //retorna o estado inicial
    if (estadoInicial != -1) {
        res.status(201).send(estadoInicial);
    } else {
        res.status(202).send("estado inicial não definido");
    }

});

app.get("/estados-finais", (req, res) => { //retorna um vetor com todos os estado finais possíveis
    res.send(estadosFinais);
});

app.get("/entradas-possiveis", (req, res) => { //retorna um vetor com todas as entradas possíveis
    vetorEntradasPossiveis = [];
    if (alfabeto != '') {
        vetorEntradasPossiveis.push("@");
        for (var i = 0; i < alfabeto.length; i++) {
            vetorEntradasPossiveis.push(alfabeto[i]);
        }
        for (var i = 0; i < alfabetoAuxiliar.length; i++) {
            vetorEntradasPossiveis.push(alfabetoAuxiliar[i]);
        }
        vetorEntradasPossiveis.push("#");
        res.status(201).send(vetorEntradasPossiveis);
    } else {
        res.status(202).send("vetor vazio");
    }
});

app.get("/transicoes", (req, res) => { //retorna um vetor com todas as transições
    if (transicoes.length > 0) {
        res.status(201).send(transicoes);
    } else {
        res.status(202).send();
    }
});

app.get("/dados-teste-palavra", (req, res) => { //retorna todos os dados necessários para testar se a palavra é aceita
    if (palavra != '' > 0 && estadoInicial != -1 && estadosFinais.length > 0) {
        var dados = { palavra: palavra, transicoes: transicoes, estadoInicial: estadoInicial, estadosFinais: estadosFinais };
        res.status(201).send(dados);
    } else {
        res.status(202).send("dados insuficiêntes para gerar a tabela de testes");
    }
});

//rotas POST +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.post("/salva-alfabeto", (req, res) => { //armazena o alfabeto que o usuário informou
    alfabeto = JSON.stringify(req.body);
    alfabeto = decodeURIComponent(alfabeto)
    alfabeto = alfabeto.substring(2, alfabeto.length - 5)
    res.send(alfabeto);
});

app.post("/salva-alfabeto-auxiliar", (req, res) => { //armazena o alfabeto auxiliar que o usuário informou
    alfabetoAuxiliar = JSON.stringify(req.body);
    alfabetoAuxiliar = decodeURIComponent(alfabetoAuxiliar)
    alfabetoAuxiliar = alfabetoAuxiliar.substring(2, alfabetoAuxiliar.length - 5)
    alfabetoAuxiliar = alfabetoAuxiliar.toUpperCase();
    res.send(alfabetoAuxiliar);
});

app.post("/salva-estados", (req, res) => { //armazena os estados que o usuário informou
    estados = [];
    quantidadeDeEstados = JSON.stringify(req.body);
    quantidadeDeEstados = decodeURIComponent(quantidadeDeEstados)
    quantidadeDeEstados = quantidadeDeEstados.substring(2, quantidadeDeEstados.length - 5)
    if (quantidadeDeEstados > 0) {
        for (var i = 0; i < quantidadeDeEstados; i++) {
            estados.push("q" + i);
        }
        res.status(201).send(estados);
    } else {
        res.status(202).send("Quantidade de estados inválida");
    }
});

app.post("/salva-estado-inicial", (req, res) => { //armazena o estado inicial que o usuário informou
    estadoInicialRecebido = JSON.stringify(req.body);
    estadoInicialRecebido = decodeURIComponent(estadoInicialRecebido);
    estadoInicialRecebido = estadoInicialRecebido.substring(2, estadoInicialRecebido.length - 5)
    if (estados.indexOf(estadoInicialRecebido) != -1 && estadoInicial != estadoInicialRecebido) {
        estadoInicial = estadoInicialRecebido;
        res.status(201).send(estadoInicial);
    } else {
        res.status(202).send(estadoInicial);
    }
});

app.post("/salva-estados-finais", (req, res) => { //armazena os estados finais que o usuário informou
    estadosFinaisRecebidos = JSON.stringify(req.body);
    estadosFinaisRecebidos = decodeURIComponent(estadosFinaisRecebidos)
    estadosFinaisRecebidos = estadosFinaisRecebidos.substring(2, estadosFinaisRecebidos.length - 5)
    estadosFinaisRecebidos = estadosFinaisRecebidos.split(",");
    if (comparaVetores(estadosFinais, estadosFinaisRecebidos)) {
        res.status(202).send(estadosFinais);
    } else {
        estadosFinais = estadosFinaisRecebidos;
        res.status(201).send(estadosFinais);
    }
});

app.post("/salva-transicao", (req, res) => { //armazena cada transição cadastrada pelo usuário
    transicaoRecebida = req.body;
    if (buscaTransicao(transicaoRecebida)) {
        res.status(202).send("");
    } else {
        salvaTransicao(transicaoRecebida);
        res.status(201).send(transicoes);
    }
});

app.post("/salva-palavra", (req, res) => { //armazena a palavra informada pelo usuário
    palavra = '';
    palavra = JSON.stringify(req.body);
    palavra = decodeURIComponent(palavra)
    palavra = palavra.substring(2, palavra.length - 5)
    if (fazParteDoAlfabeto(palavra)) {
        palavra = "@" + palavra + "##";
        res.status(201).send(palavra);
    } else {
        res.status(202).send("Palavra composta de caracteres que não fazem parte do alfabeto");
    }
});

//rotas DELETE ------------------------------------------------------------------------------------------------------------
app.delete("/deleta-transicao", (req, res) => { //deleta determinada transição
    var ok = false;
    var { estado, entrada } = req.body;
    for (i = 0; i < transicoes.length; i++) {
        if (transicoes[i].estado == estado && transicoes[i].entrada == entrada) {
            transicoes.splice(i, 1);
            ok = true;
            break;
        }
    }
    if (ok) {
        res.status(201).send();
    } else {
        res.status(202).send();
    }
});

app.delete("/limpa-dados", (req, res) => { //reseta todas as variáveis
    estados = [];
    estadoInicial = -1;
    estadosFinais = [];
    alfabeto = '';
    alfabetoAuxiliar = '';
    vetorEntradasPossiveis = [];
    transicoes = [];
    palavra = '';
});


//funções auxiliares ****************************************************************************************************
function salvaTransicao(transicao) { //salva determinada transição, sobreescrevendo-a caso ja estivesse cadastrada
    for (i = 0; i < transicoes.length; i++) {
        if (transicoes[i].estado == transicao.estado && transicoes[i].entrada == transicao.entrada) {
            transicoes.splice(i, 1);
            break;
        }
    }
    transicoes.push(transicao);
}

function buscaTransicao(transicao) { //retorna verdadeiro caso a transição ja esteja cadastrada
    var retorno = false;
    transicoes.forEach((elemento) => {
        if (elemento.estado == transicao.estado &&
            elemento.entrada == transicao.entrada &&
            elemento.estadoDestino == transicao.estadoDestino &&
            elemento.entradaSalva == transicao.entradaSalva &&
            elemento.movimento == transicao.movimento) {
            retorno = true;
        }
    });
    return retorno;
}

function fazParteDoAlfabeto(palavra) { //retorna verdadeiro se a palavra informada faz parte do alfabeto cadastrado
    for (i = 0; i < palavra.length; i++) {
        if (alfabeto.indexOf(palavra[i]) == -1) {
            return false;
        }
    }
    return true;
}

const comparaVetores = (vetor1, vetor2) => { //realiza a comparação de dois vetores
    return vetor1.length === vetor2.length &&
        vetor1.every((item, index) => item === vetor2[index])
}
