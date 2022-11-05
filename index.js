function salvaAlfabeto() { //função responsável por enviar o alfabeto para o servidor
    var alfabeto = '';
    var alfabetoSemTratamento = document.getElementById("alfabeto").value; //pega o valor do campo
    alfabetoSemTratamento = alfabetoSemTratamento.toLowerCase(); //converte caracteres para minúsculo

    if (alfabetoSemTratamento == '') { //limpa mensagem do alfabeto e mostra mensagem de erro se não informar nada no campo
        axios.get("http://localhost:3000/alfabeto").then((res) => {
            limpaElementosFilhos("alfabeto-salvo");
            var resposta = '';
            if (res.data != '') {
                resposta = "Alfabeto já salvo = " + res.data;
            }
            var text = document.createTextNode("Campo vazio, informe o alfabeto. " + resposta);
            document.getElementById("alfabeto-salvo").appendChild(text);
            document.getElementById("alfabeto-salvo").style.color = 'red'; //exibe mensagem de erro em vermelho
        }).catch((erro) => {
            console.log(erro); //exibe o erro caso ocorra
        });

    } else {// percorre cada caracter do alfabeto e armazena sem repetir caracteres
        for (var i = 0; i < alfabetoSemTratamento.length; i++) {
            if (alfabeto.indexOf(alfabetoSemTratamento[i]) == -1) {
                alfabeto += alfabetoSemTratamento[i];
            }
        }
        alfabeto = alfabeto.replace(/\s/g, '');
        alfabeto = alfabeto.replace(/\%/g, '%25');
        alfabeto = alfabeto.replace(/\\/g, '%5C');
        alfabeto = encodeURIComponent(alfabeto);
        axios.post("http://localhost:3000/salva-alfabeto", alfabeto).then((res) => { //envia o alfabeto para o servidor
            limpaElementosFilhos("alfabeto-salvo");
            var text = document.createTextNode("Alfabeto salvo = " + res.data);
            document.getElementById("alfabeto-salvo").appendChild(text);
            document.getElementById("alfabeto-salvo").style.color = 'green'; //exibe mensagem de sucesso em verde
        }).catch((erro) => {
            console.log(erro); //exibe o erro caso ocorra
        });
    }
}

function salvaAlfabetoAuxiliar() { //função responsável por enviar o alfabeto auxiliar no servidor
    var alfabeto = '';
    var alfabetoSemTratamento = document.getElementById("alfabeto-auxiliar").value; //pega o valor o campo
    alfabetoSemTratamento = alfabetoSemTratamento.toUpperCase();
    if (alfabetoSemTratamento == '') { //limpa mensagem do alfabeto e mostra mensagem de erro se não informar nada no campo
        axios.get("http://localhost:3000/alfabeto-auxiliar").then((res) => {
            limpaElementosFilhos("alfabeto-auxiliar-salvo");
            var resposta = '';
            if (res.data != '') {
                resposta = "Alfabeto auxiliar já salvo = " + res.data;
            }
            var text = document.createTextNode("Campo vazio, informe o alfabeto auxiliar. " + resposta);
            document.getElementById("alfabeto-auxiliar-salvo").appendChild(text);
            document.getElementById("alfabeto-auxiliar-salvo").style.color = 'red'; //exibe mensagem de erro em vermelho
        }).catch((erro) => {
            console.log(erro); //exibe o erro caso ocorra
        });

    } else { //percorre cada cadactere do alfabeto auxiliar e armazena sem repetições 
        for (var i = 0; i < alfabetoSemTratamento.length; i++) {
            if (alfabeto.indexOf(alfabetoSemTratamento[i]) == -1) {
                alfabeto += alfabetoSemTratamento[i];
            }
        }
        alfabeto = alfabeto.replace(/\s/g, '');
        alfabeto = alfabeto.replace(/\%/g, '%25');
        alfabeto = alfabeto.replace(/\\/g, '%5C');
        alfabeto = encodeURIComponent(alfabeto);
        axios.post("http://localhost:3000/salva-alfabeto-auxiliar", alfabeto).then((res) => { //envia o alfabeto auxiliar para o servidor
            limpaElementosFilhos("alfabeto-auxiliar-salvo");
            var text = document.createTextNode("Alfabeto auxiliar salvo = " + res.data);
            document.getElementById("alfabeto-auxiliar-salvo").appendChild(text);
            document.getElementById("alfabeto-auxiliar-salvo").style.color = 'green'; //exibe mensagem de sucesso em verde
        }).catch((erro) => {
            console.log(erro); //exibe o erro caso ocorra
        });
    }
}

function salvaEstados() { //envia os estados possíveis para o servidor
    var estados = document.getElementById("estados").value; //pega do campo a quantidade de estados a serem criados
    if (estados == '' || estados <= 0) {//limpa estados e mostra mensagem de erro caso informe uma quantidade de estados inválida
        axios.get("http://localhost:3000/estados").then((res) => {
            limpaElementosFilhos("estados-salvos");
            var resposta = '';
            if (res.length == 0) {
                resposta = "Estados já salvos = " + res.data;
            }
            var text = document.createTextNode("Informe um valor maior que zero. " + resposta);
            document.getElementById("estados-salvos").appendChild(text);
            document.getElementById("estados-salvos").style.color = 'red';
        }).catch((erro) => {
            console.log(erro);
        });
    } else {
        estados = encodeURIComponent(estados);
        axios.post("http://localhost:3000/salva-estados", estados).then((res) => { //envia os estados possíveis para o servidor
            limpaElementosFilhos("estados-salvos");
            if (res.status == 201) {
                var text = document.createTextNode("Lista de estados = " + res.data);
                document.getElementById("estados-salvos").appendChild(text);
                document.getElementById("estados-salvos").style.color = 'green'; //exibe mensagem de sucesso em verde
                listaValoresNoSelect(res.data, "estado-inicial"); //lista os estados cadatrados no select, para escolher um como estado inicial
                listaEstadosFinais(res.data, "estados-finais"); //lista os estados cadastrados como checkbox, para escolher os estados finais
            } else {
                var text = document.createTextNode(res.data);
                document.getElementById("estados-salvos").appendChild(text);
                document.getElementById("estados-salvos").style.color = 'red'; // exibe mensagem de erro em vermelho
            }
        }).catch((erro) => {
            console.log(erro); //exibe o erro caso ocorra
        });
    }
}

function salvaEstadoInicial() {//função responsável por enviar o estado inicial para o servidor
    var select = document.getElementById("estado-inicial"); //pega o estado selecionado do select
    var estadoInicial = select.options[select.selectedIndex].value;

    if (estadoInicial == '') {//limpa estados e mostra mensagem de erro se não selecionar nenhum estado com inicial
        limpaElementosFilhos("estado-inicial-salvo");
        var text = document.createTextNode("Campo vazio, informe o estado.");
        document.getElementById("estado-inicial-salvo").appendChild(text);
        document.getElementById("estado-inicial-salvo").style.color = 'red'; //exibe mensagem de erro em vermelho
    } else {
        estadoInicial = encodeURIComponent(estadoInicial);
        axios.post("http://localhost:3000/salva-estado-inicial", estadoInicial).then((res) => { //envia o estado inicial para o servidor
            limpaElementosFilhos("estado-inicial-salvo");
            if (res.status == 201) {
                var text = document.createTextNode("Estado inicial = " + res.data);
                document.getElementById("estado-inicial-salvo").appendChild(text);
                document.getElementById("estado-inicial-salvo").style.color = 'green'; //exibe a mensagem de sucesso em verde
            } else {
                var text = document.createTextNode("Estado inicial já cadastrado. Estado inicial = " + res.data);
                document.getElementById("estado-inicial-salvo").appendChild(text);
                document.getElementById("estado-inicial-salvo").style.color = 'red'; //exibe a mensagem de erro em vermelho
            }

        }).catch((erro) => {
            console.log(erro); //exibe o erro caso ocorra
        });
    }
}

function salvaEstadosFinais() { //função responsável por enviar o conjunto de estados finais para o servidor
    var estadosFinaisSpan = document.getElementById("estados-finais");
    var estadosFinais = [];
    for (var i = 0; i < estadosFinaisSpan.children.length; i++) { //verifica quais os estados estão marcados para fazerem parte dos estados finais
        var p = estadosFinaisSpan.children[i];
        for (var j = 0; j < p.children.length; j++) {
            if (p.children[j].getAttribute("type") == "checkbox" && p.children[j].checked == true) {
                if (estadosFinais.indexOf(p.children[j].value) == -1) {
                    estadosFinais.push(p.children[j].value);
                }
            }
        }
    }
    if (estadosFinais.length == 0) {
        axios.get("http://localhost:3000/estados-finais").then((res) => {
            limpaElementosFilhos("estados-finais-salvos"); //limpa mensagem existente
            var text = document.createTextNode("Nenhum estado final selecionado. Lista de estados já salvos = " + res.data);
            document.getElementById("estados-finais-salvos").appendChild(text);
            document.getElementById("estados-finais-salvos").style.color = 'red'; //exibe mensagem de erro em vermelho
        }).catch((erro) => {
            console.log(erro); //exibe o erro caso ocorra
        });

    } else {
        estadosFinais = encodeURIComponent(estadosFinais);
        axios.post("http://localhost:3000/salva-estados-finais", estadosFinais).then((res) => { //envia os estados finais para o servidor
            limpaElementosFilhos("estados-finais-salvos");
            if (res.status == 201) {
                var text = document.createTextNode("Lista de estados finais = " + res.data);
                document.getElementById("estados-finais-salvos").appendChild(text);
                document.getElementById("estados-finais-salvos").style.color = 'green'; //exibe mensagem de sucesso em verde
                desmarcarEstadosFinais();
            } else {
                var text = document.createTextNode("Estados finais já cadastrados. Lista de estados finais = " + res.data);
                document.getElementById("estados-finais-salvos").appendChild(text);
                document.getElementById("estados-finais-salvos").style.color = 'red'; //exibe mensagem de erro em vermelho
            }
        }).catch((erro) => {
            console.log(erro); //exibe o erro caso ocorra
        });
    }
}

function carregarDadosTransicao() { //exibe os campos ocultos, carregando os estados e entradas possíveis, para cadastrar as transições
    axios.get("http://localhost:3000/estados").then((estados) => {
        if (estados.status == 201) {
            listaValoresNoSelect(estados.data, "transicao-estado-original");
            listaValoresNoSelect(estados.data, "remove-transicao-estado");
            listaValoresNoSelect(estados.data, "transicao-estado-destino");
            axios.get("http://localhost:3000/entradas-possiveis").then((entradas) => {
                if (entradas.status == 201) {
                    listaValoresNoSelect(entradas.data, "remove-transicao-entrada");
                    listaValoresNoSelect(entradas.data, "transicao-entrada-original");
                    listaValoresNoSelect(entradas.data, "transicao-entrada-salva");
                    document.getElementById("campos-transicao").style.visibility = "visible";
                    document.getElementById("remover-transicao").style.visibility = "visible";
                }
            }).catch((erro) => {
                console.log(erro);
            });
        }
    }).catch((erro) => {
        console.log(erro);
    });
}

function salvaTransicao() { //função responsável por enviar a transição para o servidor
    limpaElementosFilhos("transicao-salva"); //limpa mensagem existente

    //pega valores de todos os campos para criar a transição
    var estadoOriginal = document.getElementById("transicao-estado-original").options[document.getElementById("transicao-estado-original").selectedIndex].value;
    var entradaOriginal = document.getElementById("transicao-entrada-original").options[document.getElementById("transicao-entrada-original").selectedIndex].value;
    var estadoDestino = document.getElementById("transicao-estado-destino").options[document.getElementById("transicao-estado-destino").selectedIndex].value;
    var entradaSalva = document.getElementById("transicao-entrada-salva").options[document.getElementById("transicao-entrada-salva").selectedIndex].value;
    var movimento;
    for (i = 0; i < document.getElementsByName("movimento").length; i++) { //verifica qual radiobutton do movimento está marcado
        if (document.getElementsByName("movimento")[i].checked) {
            movimento = document.getElementsByName("movimento")[i].value;
        }
    }

    //cria a transição com os dados informados
    var transicao = { estado: estadoOriginal, entrada: entradaOriginal, estadoDestino: estadoDestino, entradaSalva: entradaSalva, movimento: movimento };
    axios.post("http://localhost:3000/salva-transicao", transicao).then((res) => { //envia a transição para o servidor
        if (res.status == 201) {
            insereTransicoesNaTabela();
            var text = document.createTextNode("Transição cadastrada com sucesso");
            document.getElementById("transicao-salva").appendChild(text);
            document.getElementById("transicao-salva").style.color = 'green'; //exibe a mensagem de sucesso em verde
        } else {
            var text = document.createTextNode("Transição já cadastrada");
            document.getElementById("transicao-salva").appendChild(text);
            document.getElementById("transicao-salva").style.color = 'red'; //exibe a mensagem de erro em vermelho
        }
    }).catch((erro) => {
        console.log(erro); //exibe o erro caso ocorra
    });
}

function buscaTransicao(estado, entrada, transicoes, estadosFinais) { //busca uma transição de acordo com o estado e a entrada recebida
    var retorno = { transicao: undefined, erro: false, sucesso: false, mensagem: '' };
    //percorre todas transições em busca de uma transição com o estado e a entrada informada
    transicoes.forEach((transicao) => {
        if (transicao.estado == estado &&
            transicao.entrada == entrada) {
            retorno.transicao = transicao; //se encontrar salva a transição dentro do retorno
        }
    });
    if (estadosFinais.indexOf(estado) != -1 && retorno.transicao == undefined) { //estado final e sem transição = ACEITA
        retorno.erro = false;
        retorno.sucesso = true; //<-------- sucesso = ACEITA
        retorno.mensagem = `Palavra aceita. O estado '${estado}' faz parte dos estados finais, e nele não há transições para a entrada '${entrada}'`;
    } else if (estadosFinais.indexOf(estado) == -1 && retorno.transicao == undefined) { //não esta no estado final e não tem transicao = REJEITA
        retorno.erro = true; //<-------- erro = REJEITA
        retorno.sucesso = false;
        retorno.mensagem = `Palavra rejeitada. No estado '${estado}' o caractere '${entrada}' não tem previsão de movimento`;
    } else if (retorno.transicao != undefined) { //se encontrou transição, retorna a transição para prosseguir nas iterações de teste
        retorno.erro = false;
        retorno.sucesso = false;
    }
    return retorno;
}

function removeTransicao() { //função responsável por remover uma transição
    limpaElementosFilhos("transicao-removida"); //limpa mensagem existente

    //pega o estado e a entrada de onde está cadastrada a tranisção
    var estadoOriginal = document.getElementById("remove-transicao-estado").options[document.getElementById("remove-transicao-estado").selectedIndex].value;
    var entradaOriginal = document.getElementById("remove-transicao-entrada").options[document.getElementById("remove-transicao-entrada").selectedIndex].value;
    var objeto = { estado: estadoOriginal, entrada: entradaOriginal };
    axios.delete("http://localhost:3000/deleta-transicao", { data: objeto }).then((res) => { //solicita que o servidor delete a transição com os dados informados
        if (res.status == 201) {
            removeTransicaoDaTabela(objeto);
            var text = document.createTextNode("Transição removida com sucesso");
            document.getElementById("transicao-removida").appendChild(text);
            document.getElementById("transicao-removida").style.color = 'green'; //exibe mensagem de sucesso em verde
        } else {
            var text = document.createTextNode("Transição não cadastrada");
            document.getElementById("transicao-removida").appendChild(text);
            document.getElementById("transicao-removida").style.color = 'red'; //exibe mensagem de erro em vermelho
        }
    }).catch((erro) => {
        console.log(erro);
    });
}

function criaTabela() { //função responsável por contruir a tabela de transições
    var mensagem = document.getElementById("tabela-vazia");
    limpaElementosFilhos("tabela-vazia"); //limpa mensagem existente
    limpaElementosFilhos("tabela");
    mensagem.style.color = "red";
    axios.get("http://localhost:3000/estados").then((resLinhas) => { //pega a lista de estados
        if (resLinhas.status == 201) {
            axios.get("http://localhost:3000/entradas-possiveis").then((resColunas) => { //pega a lista de entradas possíveis
                if (resColunas.status == 201) {
                    var container = document.getElementById("tabela");
                    var tabela = document.createElement("table"); //cria a tabela
                    var corpo = document.createElement("tbody"); //cria o corpo da tabela
                    for (var j = 0; j <= resLinhas.data.length; j++) {
                        var linha = document.createElement("tr"); //para cada esstado cria uma linha na tabela
                        for (var i = 0; i <= resColunas.data.length; i++) {
                            var celula = document.createElement("td"); //para cada entrada cria uma coluna na linha
                            if (i > 0 && j > 0) {
                                //define como id da celula "estado-entrada" ex: q0-a
                                celula.setAttribute("id", resLinhas.data[j - 1] + "-" + resColunas.data[i - 1]);
                            }
                            celula.style.height = "30px"; //define o tamanho de cada célula
                            celula.style.width = "120px";
                            var textoCelula = document.createTextNode('');
                            if (i == 0 && j > 0) {
                                //lista todos os estados possíveis na primeira coluna da tabela
                                var textoCelula = document.createTextNode(resLinhas.data[j - 1]);
                            }
                            if (j == 0 && i > 0) {
                                //lista todas entradas possíveis na primeira linha da tabela
                                var textoCelula = document.createTextNode(resColunas.data[i - 1]);
                            }
                            celula.appendChild(textoCelula); //salva o texto na celula
                            linha.appendChild(celula); //salva a célula na linha
                        }
                        corpo.appendChild(linha); //salva a linha no corpo da tabela
                    }
                    tabela.appendChild(corpo); //salva o corpo na tabela
                    container.appendChild(tabela); //salva a tabela na div
                    tabela.setAttribute("border", "2"); //define a borda da tabela
                    insereTransicoesNaTabela(); //insere as transições existentes na tabela
                } else {
                    var texto = document.createTextNode("Informe o alfabeto antes de criar a tabela");
                    mensagem.appendChild(texto); //exibe a mensagem de erro em vermelho
                }
            }).catch((erro) => {
                console.log(erro);
            });
        } else {
            var texto = document.createTextNode("Informe os estados possíveis antes de criar a tabela");
            mensagem.appendChild(texto); //exibe a mensagem de erro em vermelho
        }
    }).catch((erro) => {
        console.log(erro);
    });
}

function insereTransicoesNaTabela() { //função responsável por inserir as transições na tabela
    axios.get("http://localhost:3000/transicoes").then((res) => { //pega a lista de transições do servidor
        var transicoes = res.data;
        if (transicoes.length > 0) {
            transicoes.forEach((transicao) => { //cada transição encontrada é inserida na tabela, de acordo com o estado e entrada de origem da transição
                var elemento = document.getElementById(transicao.estado + "-" + transicao.entrada);
                limpaElementosFilhos(transicao.estado + "-" + transicao.entrada);
                var texto = document.createTextNode(transicao.estadoDestino + ", " + transicao.entradaSalva + ", " + transicao.movimento);
                elemento.appendChild(texto);
            });
        }
    }).catch((erro) => {
        console.log(erro);
    });
}

function removeTransicaoDaTabela(transicao) { //função responsável por remover determinda transição da tabela
    limpaElementosFilhos(transicao.estado + "-" + transicao.entrada);
}

function salvaPalavra() { //função responsável por enviar a palavra para o servidor
    var palavra = document.getElementById("palavra").value; //pega a palavra informada no campo
    palavra = palavra.toLowerCase(); //converte a palavra para minúscula

    if (palavra == '') { //limpa mensagem do alfabeto e mostra mensagem de erro, caso a palavra esteja vazia
        limpaElementosFilhos("palavra-salva");
        var text = document.createTextNode("Campo vazio, informe a palavra");
        document.getElementById("palavra-salva").appendChild(text);
        document.getElementById("palavra-salva").style.color = 'red';
    } else {
        palavra = encodeURIComponent(palavra);
        axios.post("http://localhost:3000/salva-palavra", palavra).then((res) => { //envia a palavra para salvar no servidor
            limpaElementosFilhos("palavra-salva");
            if (res.status == 201) {
                var text = document.createTextNode("Palavra salva = " + res.data);
                document.getElementById("palavra-salva").appendChild(text);
                document.getElementById("palavra-salva").style.color = 'green'; //exibe a mensagem de sucesso
            } else {
                var text = document.createTextNode(res.data);
                document.getElementById("palavra-salva").appendChild(text);
                document.getElementById("palavra-salva").style.color = 'red'; //exibe a mensagem de erro
            }
        }).catch((erro) => {
            console.log(erro); //exibe o erro caso ocorra
        });
    }
}

function criaTabelaTestePalavra() { //função responsável por construir a tabela de teste da palavra
    limpaElementosFilhos("tabela-palavra"); //limpa a mensagem existente
    axios.get("http://localhost:3000/dados-teste-palavra").then((res) => { //solicita ao servidor os dados necessários para testar a palavra
        if (res.status == 201) {
            var { palavra, transicoes, estadoInicial, estadosFinais } = res.data;
            var container = document.getElementById("tabela-palavra");
            var tabela = document.createElement("table"); //cria a tabela
            var corpo = document.createElement("tbody"); //cria o corpo da tabela
            corpo.setAttribute("id", "corpo-tabela-teste");
            var linha = document.createElement("tr"); //cria uma linha
            for (var i = -1; i < palavra.length; i++) {
                var celula = document.createElement("td"); //para cada caractere da palavra é criada uma coluna na linha
                celula.style.height = "30px"; //define o tamanho das células
                celula.style.width = "120px";
                if (i == -1) {
                    var textoCelula = document.createTextNode(estadoInicial); //é inserida uma coluna extra no inicio, onde é exibido o estado atual
                    celula.setAttribute("id", estadoInicial);
                } else {
                    var textoCelula = document.createTextNode(palavra[i]); 
                    if (palavra[i] == "@") { //coloca o cabeçote atual no símbolo de início de fita
                        celula.style.background = "lightskyblue"; //pinta o fundo da célula de azul, para mostrar o cabeço te atual
                    }
                }
                celula.appendChild(textoCelula); //salva o texto na célula
                linha.appendChild(celula); //salva a célula na linha
            }
            corpo.appendChild(linha); //salva a linha no corpo
            tabela.appendChild(corpo); //salva o corpo na tabela
            container.appendChild(tabela); //salva a tabela na div
            tabela.setAttribute("border", "2"); //define a borda da tabela
            var transicao = buscaTransicao(estadoInicial, "@", transicoes, estadosFinais); //busca a proxima transição
            testaPalavra(palavra, 0, transicao, transicoes, estadosFinais); //executa o próximo teste
        } else {
            mensagemTestePalavra("erro", res.data); //exibe a mensagem resultante do teste
        }
    }).catch((erro) => {
        console.log(erro);
    });
}

function testaPalavra(palavra, indiceCabecote, transicao, transicoes, estadosFinais) { //função que realiza o teste da palavra, recursivamente
    if (!transicao.erro && !transicao.sucesso) { //se não tem erro e nem sucesso na transição recebida, executa o teste
        //armazena os dados da transição recebida
        var estadoDestino = transicao.transicao.estadoDestino;
        var entradaSalva = transicao.transicao.entradaSalva;
        var movimento = transicao.transicao.movimento;
        var proximoIndiceCabecote;

        //substitui o caractere da palavra pelo que deve ser salvo
        palavra = substituiEntrada(palavra, entradaSalva, indiceCabecote);

        //altera o próximo indice do cabeçote de acordo com o movimento da transição
        if (movimento == "D") {
            proximoIndiceCabecote = indiceCabecote + 1;
        } else {
            proximoIndiceCabecote = indiceCabecote - 1;
        }

        //Adição de linhas na tabela de transição
        var corpo = document.getElementById("corpo-tabela-teste");
        var linha = document.createElement("tr"); //cria linha
        for (var i = -1; i < palavra.length; i++) {
            var celula = document.createElement("td"); //cria uma coluna para cada caractere da palavra e insere na linha
            celula.style.height = "30px"; //define o tamanho da celula
            celula.style.width = "120px";
            if (i == -1) {
                var textoCelula = document.createTextNode(estadoDestino); //a primeira célula é para mostrar o estado
                celula.setAttribute("id", estadoDestino);
            } else {
                var textoCelula = document.createTextNode(palavra[i]);
                if (i == indiceCabecote) {
                    celula.style.color = "red";
                    celula.style.textDecoration = "bold"; //o caractere gravado da palavra é escrito em vermelho com fundo branco
                }
                if (i == proximoIndiceCabecote) {
                    celula.style.background = "lightskyblue"; //o caractere em que está o cabeçote é escrito de preto com fundo azul claro
                }
            }
            celula.appendChild(textoCelula); //salva texto na celula
            linha.appendChild(celula); //salva celula na linha
        }
        corpo.appendChild(linha); //salva a linha no corpo da tabela

        //busca a próxima transição
        var proximaTransicao = buscaTransicao(estadoDestino, palavra[proximoIndiceCabecote], transicoes, estadosFinais);
        if (!proximaTransicao.erro && !proximaTransicao.sucesso) { //se encontrou uma transicao continua a recursão

            //executa o método recursivamente, a cada 1500 ms, inserindo uma nova linha na tabela de testes
            setTimeout(function () { testaPalavra(palavra, proximoIndiceCabecote, proximaTransicao, transicoes, estadosFinais); }, 1500);

        } else if (proximaTransicao.sucesso) { //se a palavra foi aceita exibe a mensagem
            if (proximoIndiceCabecote >= 0 && proximoIndiceCabecote < palavra.length) {
                mensagemTestePalavra("sucesso", proximaTransicao.mensagem); //mensagem se o cabeçote não ultrapassou o tamanho da palavra
            } else {
                //mensagem caso o cabeçote ultrapasse os indices que limitam a palavra
                mensagemTestePalavra("sucesso", "Palavra aceita. Chegou ao estado final e não há mais caracteres para serem testados.");
            }
        } else if (proximaTransicao.erro) { //se deu erro ou sucesso mostra a mensagem e para a recursão
            if (proximoIndiceCabecote >= 0 && proximoIndiceCabecote < palavra.length) {
                mensagemTestePalavra("erro", proximaTransicao.mensagem);//mensagem se o cabeçote não ultrapassou o tamanho da palavra
            } else {
                //mensagem caso o cabeçote ultrapasse os indices que limitam a palavra
                mensagemTestePalavra("erro", "Palavra rejeitada. Não há mais caracteres para serem testados na palavra");
            }
        }
        return;
    } else if (transicao.erro && !transicao.sucesso) { //se a transição recebida tem erro, exibe a mensagem de REJEITADA
        mensagemTestePalavra("erro", transicao.mensagem);
    } else if (!transicao.erro && transicao.sucesso) { //se a transição recebida tem sucesso, exibe a mensagem de ACEITA
        mensagemTestePalavra("sucesso", transicao.mensagem);
    }
    return;
}


//funções auxiliares ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function limpaDadosDoServidor() {
    axios.delete("http://localhost:3000/limpa-dados").then((res) => {
    }).catch((erro) => {
        console.log(erro);
    });
}

function mensagemTestePalavra(tipo, mensagem) {
    var elemento = document.getElementById("erro-palavra");
    limpaElementosFilhos("erro-palavra");
    var texto = document.createTextNode(mensagem);
    if (tipo == "erro") {
        elemento.style.color = "red";
    } else {
        elemento.style.color = "green";
    }
    elemento.appendChild(texto);
}

function substituiEntrada(palavra, entrada, indice) {
    var resultado = '';
    for (var i = 0; i < palavra.length; i++) {
        if (i == indice) {
            resultado += entrada;
        } else {
            resultado += palavra[i];
        }
    }
    return resultado;
}

function desmarcarEstadosFinais() {
    var estadosFinaisSpan = document.getElementById("estados-finais");
    var estadosFinais = [];
    for (var i = 0; i < estadosFinaisSpan.children.length; i++) {
        var p = estadosFinaisSpan.children[i];
        for (var j = 0; j < p.children.length; j++) {
            p.children[j].checked = false;
        }
    }
}

function listaValoresNoSelect(valores, idSelect) {
    limpaElementosFilhos(idSelect);
    valores.forEach(elemento => {
        var opcao = document.createElement("option");
        var valor = document.createTextNode(elemento)
        opcao.appendChild(valor);
        document.getElementById(idSelect).appendChild(opcao);
    });
}

function listaEstadosFinais(estados, idElementoPai) {
    limpaElementosFilhos(idElementoPai);
    var contador = 0;
    var elemento = document.createElement("p");
    var espaco = document.createTextNode('\u00A0\u00A0');
    limpaElementosFilhos("estados-finais-salvos");
    estados.forEach((estado, index) => {
        if (contador == 5) {
            elemento = document.createElement("p");
            contador = 0;
        }
        var caixa = document.createElement("input");
        caixa.setAttribute("type", "checkbox");
        caixa.setAttribute("value", estado);
        elemento.appendChild(caixa);
        var texto = document.createTextNode(estado);
        if (index < 10) {
            elemento.appendChild(texto);
            elemento.appendChild(espaco);
        } else {
            elemento.appendChild(texto);
        }
        document.getElementById(idElementoPai).appendChild(elemento);
        contador++;
    });
}

function maiuscula(elemento) {
    elemento.value = elemento.value.toUpperCase();
}

function limpaElementosFilhos(id) {
    while (document.getElementById(id).lastChild) {
        document.getElementById(id).removeChild(document.getElementById(id).lastChild);
    }

}