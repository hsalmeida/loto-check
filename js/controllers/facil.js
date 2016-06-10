loto.controller('FacilCtrl', ['$scope', 'Facil', function ($scope, Facil) {
    $scope.arquivo = "";
    $scope.jogos = [];
    $scope.jogo = {};
    $scope.iszip = false;

    $scope.numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    $scope.totalBolas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    $scope.ganhadora = true;
    $scope.dezenas = 15;

    $scope.predicate = 'concurso';
    $scope.reverse = false;

    $scope.ganhariaJogo1 = 0;
    $scope.ganhariaJogo1_11 = 0;
    $scope.ganhariaJogo1_12 = 0;
    $scope.ganhariaJogo1_13 = 0;
    $scope.ganhariaJogo1_14 = 0;

    $scope.ganhariaJogo2 = 0;
    $scope.ganhariaJogo2_11 = 0;
    $scope.ganhariaJogo2_12 = 0;
    $scope.ganhariaJogo2_13 = 0;
    $scope.ganhariaJogo2_14 = 0;

    $scope.ganhariaJogo3 = 0;
    $scope.ganhariaJogo3_11 = 0;
    $scope.ganhariaJogo3_12 = 0;
    $scope.ganhariaJogo3_13 = 0;
    $scope.ganhariaJogo3_14 = 0;

    $scope.order = function (predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };

    $scope.jogo1 = [];
    $scope.jogo2 = [];
    $scope.jogo3 = [];

    $scope.jogoHist1 = [];
    $scope.jogoHist2 = [];
    $scope.jogoHist3 = [];
    $scope.jogoHist4 = [];

    $scope.proporcao1 = "";
    $scope.proporcao2 = "";
    $scope.proporcao3 = "";
    $scope.proporcao4 = "";

    $scope.filterBola = function (bola, numero, ganhador) {
        return function (item) {
            if (ganhador) {
                return item['bola' + bola] === numero && item['ganhadores15'] > 0;
            } else {
                return item['bola' + bola] === numero;
            }
        }
    };


    $scope.filterBolaOrdenada = function (bola, numero, ganhador) {
        return function (item) {
            if (ganhador) {
                return item['listaBolas'][(bola - 1)] === numero && item['ganhadores15'] > 0;
            } else {
                return item['listaBolas'][(bola - 1)] === numero;
            }
        }
    };

    $scope.getJogos = function () {
        waitingDialog.show();
        $scope.jogosProporcao = [];
        Facil.all({"limit": 2000}).then(function (jogos) {


            $.each(jogos, function () {
                var sorteadoImpares = [];
                var sorteadoPares = [];
                var listaBolas = this.listaBolas;
                for (var b = 0; b < listaBolas.length; b++) {
                    if (listaBolas[b] % 2 !== 0) {
                        sorteadoImpares.push(listaBolas[b]);
                    } else {
                        sorteadoPares.push(listaBolas[b]);
                    }
                }
                if(sorteadoPares.length > 6 && sorteadoImpares.length > 6) {
                    this.impares = sorteadoImpares.length;
                    this.pares = sorteadoPares.length;
                    $scope.jogosProporcao.push(this);
                }
            });

            $scope.jogos = jogos;
            $scope.simularMenorColisao();
            waitingDialog.hide();
        });
    };


    $scope.simularCenarios = function () {
        console.log("que os jogos comecem");
        var loop = 0;
        var jogoHist = $scope.simularJogoGrupos();
        if(jogoHist.qtdGrupos1 >= 14 || jogoHist.qtdGrupos2 >= 14 || jogoHist.qtdGrupos3 >= 14 || jogoHist.qtdGrupos4 >= 14) {
            console.log(jogoHist.jogoHist1);
            console.log(jogoHist.jogoHist2);
            console.log(jogoHist.jogoHist3);
            console.log(jogoHist.jogoHist4);
            console.log(loop + " " + jogoHist.qtdGrupos1 + " " + jogoHist.qtdGrupos2 + " " + jogoHist.qtdGrupos3 + " " + jogoHist.qtdGrupos4);
        }
        while(loop < 4000) {
            jogoHist = $scope.simularJogoGrupos();
            loop++;
            if(jogoHist.qtdGrupos1 >= 14 || jogoHist.qtdGrupos2 >= 14 || jogoHist.qtdGrupos3 >= 14 || jogoHist.qtdGrupos4 >= 14) {
                console.log(jogoHist.jogoHist1);
                console.log(jogoHist.jogoHist2);
                console.log(jogoHist.jogoHist3);
                console.log(jogoHist.jogoHist4);
                console.log(loop + " " + jogoHist.qtdGrupos1 + " " + jogoHist.qtdGrupos2 + " " + jogoHist.qtdGrupos3 + " " + jogoHist.qtdGrupos4);
            }
        }
        console.log("que os jogos terminem");
    };

    $scope.simularJogoGruposTela = function () {
        var jogoHist = $scope.simularJogoGrupos();
        $scope.jogoHist1 = jogoHist.jogoHist1;
        $scope.jogoHist2 = jogoHist.jogoHist2;
        $scope.jogoHist3 = jogoHist.jogoHist3;
        $scope.jogoHist4 = jogoHist.jogoHist4;

        $scope.qtdGrupos1 = jogoHist.qtdGrupos1;
        $scope.qtdGrupos2 = jogoHist.qtdGrupos2;
        $scope.qtdGrupos3 = jogoHist.qtdGrupos3;
        $scope.qtdGrupos4 = jogoHist.qtdGrupos4;

        $scope.gruposFixas = jogoHist.gruposFixas;
        $scope.gruposGrupo1 = jogoHist.gruposGrupo1;
        $scope.gruposGrupo2 = jogoHist.gruposGrupo2;
        $scope.gruposGrupo3 = jogoHist.gruposGrupo3;

        for(var i = 1; i < 5; i++) {
            var lista = $scope['jogoHist'+i];
            var sorteadoImpares = [];
            var sorteadoPares = [];

            for (var b = 0; b < lista.length; b++) {
                if (lista[b] % 2 !== 0) {
                    sorteadoImpares.push(lista[b]);
                } else {
                    sorteadoPares.push(lista[b]);
                }
            }
            $scope['proporcao'+i] = sorteadoPares.length + '/' + sorteadoImpares.length;
        }
    };

    $scope.simularJogoGrupos = function () {
        /*
         estrategia para escolher as dezenas fixas pega do ultimo sorteio
         4 dezenas impares e 4 pares

         1 dezena impar e 1 par do numero que ficou fora do sorteio.
         completa as fixas assim
         */

        var jogoHist = {
            jogoHist1 : [],
            jogoHist2 : [],
            jogoHist3 : [],
            jogoHist4 : [],
            qtdGrupos1 : 0,
            qtdGrupos2 : 0,
            qtdGrupos3 : 0,
            qtdGrupos4 : 0,
            gruposFixas : [],
            gruposGrupo1 : [],
            gruposGrupo2 : [],
            gruposGrupo3 : []
        };

        jogoHist.jogoHist1 = [];
        jogoHist.jogoHist2 = [];
        jogoHist.jogoHist3 = [];
        jogoHist.jogoHist4 = [];

        //var ultimoJogo = $scope.jogos[($scope.jogos.length - 1)];
        var numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
        var numerosNaoSorteados = [];
        var naoSorteadosPares = [];
        var naoSorteadosImpares = [];
        var sorteadoPares = [];
        var sorteadoImpares = [];

        var fixas = [];
        var grupo1 = [];
        var grupo2 = [];
        var grupo3 = [];

        var listaBolas = [3, 4, 5, 9, 10, 11, 12, 13, 14, 16, 17, 18, 21, 22, 24 ];
        var ultimoJogo = [1, 2, 3, 4, 6, 8, 9, 13, 15, 17, 18, 19, 20, 22, 23 ];

        for (var a = 0; a < numeros.length; a++) {
            if (listaBolas.indexOf(numeros[a]) === -1) {
                numerosNaoSorteados.push(numeros[a]);
            }
        }

        //separo os jogos do ultimo sorteio entre pares e impares.
        for (var b = 0; b < listaBolas.length; b++) {
            if (listaBolas[b] % 2 !== 0) {
                sorteadoImpares.push(listaBolas[b]);
            } else {
                sorteadoPares.push(listaBolas[b]);
            }
        }

        //faco as 4 impares das fixas
        for (var c = 0; fixas.length < 4; c++) {

            var numeroImpar = Math.floor(Math.random() * sorteadoImpares.length);
            if (sorteadoImpares[numeroImpar]) {
                //existe e vamos ver se nao esta na lista
                if ($.inArray(sorteadoImpares[numeroImpar], fixas) === -1) {
                    fixas.push(sorteadoImpares[numeroImpar]);
                }
            }
        }
        //faco as 4 pares das fixas
        for (var d = 0; fixas.length < 8; d++) {

            var numeroPar = Math.floor(Math.random() * sorteadoPares.length);
            if (sorteadoPares[numeroPar]) {
                //existe e vamos ver se nao esta na lista
                if ($.inArray(sorteadoPares[numeroPar], fixas) === -1) {
                    fixas.push(sorteadoPares[numeroPar]);
                }
            }
        }

        //faco a impar que nao saiu para a fixa
        for (var e = 0; fixas.length < 9; e++) {
            var unicoImpar = Math.floor(Math.random() * 25) + 1;
            if (unicoImpar % 2 !== 0) {
                if ($.inArray(unicoImpar, fixas) === -1 && $.inArray(unicoImpar, numerosNaoSorteados) !== -1) {
                    fixas.push(unicoImpar);
                }
            }
        }

        //faco a par que nao saiu para a fixa
        for (var f = 0; fixas.length < 10; f++) {
            var unicoPar = Math.floor(Math.random() * 25) + 1;
            if (unicoPar % 2 === 0) {
                if ($.inArray(unicoPar, fixas) === -1 && $.inArray(unicoImpar, numerosNaoSorteados) !== -1) {
                    fixas.push(unicoPar);
                }
            }
        }

        //eu tiro das pares o valor que está na fixa que eu ja usei.
        sorteadoPares = sorteadoPares.filter(function (el) {
            return fixas.indexOf(el) < 0;
        });

        //faco o mesmo para as impares.
        sorteadoImpares = sorteadoImpares.filter(function (el) {
            return fixas.indexOf(el) < 0;
        });

        //tiro agora dos nao sorteados o que eu usei na fixa tambem.
        numerosNaoSorteados = numerosNaoSorteados.filter(function (el) {
            return fixas.indexOf(el) < 0;
        });

        //termina as fixas.
        /*
         2 dezenas impares e 3 dezenas pares das que ficaram de fora do sorteio.
         2 pares e 3 impares
         completar com o que restou no terceiro grupo.
         sortear em 7 / 8 entre pares e impares.
         1 a 3 jogo com as fixas mais cada grupo
         ultimo jogo com somente os grupos
         */

        for (var i = 0; i < numerosNaoSorteados.length; i++) {
            if (numerosNaoSorteados[i] % 2 !== 0) {
                naoSorteadosImpares.push(numerosNaoSorteados[i]);
            } else {
                naoSorteadosPares.push(numerosNaoSorteados[i]);
            }
        }

        for (var g = 0; grupo1.length < 2; g++) {
            var grupo1impar = naoSorteadosImpares[Math.floor(Math.random() * naoSorteadosImpares.length)];
            if ($.inArray(grupo1impar, grupo1) === -1 && $.inArray(grupo1impar, fixas) === -1) {
                //nao tem ainda.
                grupo1.push(grupo1impar);
            }
        }

        //vou mudar para colocar usando um par do jogo que saiu.
        //por isso reduzo para 4 ou inves de 5.
        for (var h = 0; grupo1.length < 4; h++) {
            var grupo1par = naoSorteadosPares[Math.floor(Math.random() * naoSorteadosPares.length)];
            if ($.inArray(grupo1par, grupo1) === -1 && $.inArray(grupo1par, fixas) === -1) {
                //nao tem ainda.
                grupo1.push(grupo1par);
            }
        }
        //agora coloco o par que saiu no final do grupo1.
        for (var z = 0; grupo1.length < 5; z++) {
            var grupo1parJogo = sorteadoPares[Math.floor(Math.random() * sorteadoPares.length)];
            if ($.inArray(grupo1parJogo, grupo1) === -1 && $.inArray(grupo1parJogo, fixas) === -1) {
                grupo1.push(grupo1parJogo);
            }
        }

        /*
        for (var h = 0; grupo1.length < 5; h++) {
            var grupo1par = naoSorteadosPares[Math.floor(Math.random() * naoSorteadosPares.length)];
            if ($.inArray(grupo1par, grupo1) === -1 && $.inArray(grupo1par, fixas) === -1) {
                //nao tem ainda.
                grupo1.push(grupo1par);
            }
        }
        */

        //verifico se tem algum impar no grupo1 e tiro de lá
        sorteadoImpares = sorteadoImpares.filter(function (el) {
            return grupo1.indexOf(el) < 0;
        });

        //retiro dos nao sorteados impares o que ja coloquei no grupo 1
        naoSorteadosImpares = naoSorteadosImpares.filter(function (el) {
            return grupo1.indexOf(el) < 0;
        });

        //retiro dos nao sorteados pares o que ja coloquei no grupo 1
        naoSorteadosPares = naoSorteadosPares.filter(function (el) {
            return grupo1.indexOf(el) < 0;
        });

        //vou pegar só um impar dos grupo de impares sorteados. aleatorio
        var sorteadoImparSolitario = sorteadoImpares[Math.floor(Math.random() * sorteadoImpares.length)];
        var naoSorteadosConcat = naoSorteadosPares;
        //agora eu concateno os dois para criar uma lista unica.
        for(var r = 0; r < naoSorteadosImpares.length; r++) {
            if(naoSorteadosConcat.length === 4) {
                break;
            }
            naoSorteadosConcat.push(naoSorteadosImpares[r]);
        }
        //naoSorteadosConcat = naoSorteadosPares.concat(naoSorteadosImpares);
        //vou colocar tambem o impar solitario.
        if(naoSorteadosConcat.length < 5) {
            naoSorteadosConcat.push(sorteadoImparSolitario);
        }

        //vou ver agora os numeros totais tirando o que saiu das fixas.
        numeros = numeros.filter(function (el) {
            return fixas.indexOf(el) < 0;
        });

        //vou ver agora os numeros totais tirando o que saiu no grupo 1.
        numeros = numeros.filter(function (el) {
            return grupo1.indexOf(el) < 0;
        });

        //enquanto a concatenação dos nao sorteados pares e impares nao tiver o tamanho de 5
        //vou colocando a lista criada anteriormente
        while (naoSorteadosConcat.length < 5) {
            var numero = numeros[Math.floor(Math.random() * numeros.length)];
            if($.inArray(numero, naoSorteadosConcat) === -1) {
                naoSorteadosConcat.push(numero);
            }
        }

        numeros = numeros.filter(function (el) {
            return naoSorteadosConcat.indexOf(el) < 0;
        });

        grupo2 = naoSorteadosConcat;
        grupo3 = numeros;

        jogoHist.jogoHist1 = fixas.concat(grupo1);
        jogoHist.jogoHist2 = fixas.concat(grupo2);
        jogoHist.jogoHist3 = fixas.concat(grupo3);
        jogoHist.jogoHist4 = grupo1.concat(grupo2);
        jogoHist.jogoHist4 = jogoHist.jogoHist4.concat(grupo3);

        jogoHist.jogoHist1.sort(function (a, b) {
            return a - b
        });
        jogoHist.jogoHist2.sort(function (a, b) {
            return a - b
        });
        jogoHist.jogoHist3.sort(function (a, b) {
            return a - b
        });
        jogoHist.jogoHist4.sort(function (a, b) {
            return a - b
        });

        var quantidade1 = 0;
        var quantidade2 = 0;
        var quantidade3 = 0;
        var quantidade4 = 0;

        $(ultimoJogo).each(function () {
            if ($.inArray(Number(this), jogoHist.jogoHist1) !== -1) {
                quantidade1++;
            }
        });
        $(ultimoJogo).each(function () {
            if ($.inArray(Number(this), jogoHist.jogoHist2) !== -1) {
                quantidade2++;
            }
        });
        $(ultimoJogo).each(function () {
            if ($.inArray(Number(this), jogoHist.jogoHist3) !== -1) {
                quantidade3++;
            }
        });
        $(ultimoJogo).each(function () {
            if ($.inArray(Number(this), jogoHist.jogoHist4) !== -1) {
                quantidade4++;
            }
        });

        jogoHist.qtdGrupos1 = quantidade1;
        jogoHist.qtdGrupos2 = quantidade2;
        jogoHist.qtdGrupos3 = quantidade3;
        jogoHist.qtdGrupos4 = quantidade4;

        jogoHist.gruposFixas = fixas;
        jogoHist.gruposGrupo1 = grupo1;
        jogoHist.gruposGrupo2 = grupo2;
        jogoHist.gruposGrupo3 = grupo3;

        return jogoHist;
    };

    /* import */
    $scope.import = function () {
        $.getJSON('js/assets/jogo.json', function (data) {
            var lista = data.lista;
            $(lista).each(function () {
                var facil = new Facil();
                angular.merge(facil, this);
                try {
                    facil.$save().then(function () {
                        console.log('salvo');
                    });
                } catch (err) {
                    console.log(err);
                    return false;
                }
            });
        });
    };
    /* import */


    /* gerar csv */
    $scope.gerarCSV = function () {
        var data = [];
        var cabecalho = "concurso;bola1;bola2;bola3;bola4;bola5;bola6;bola7;bola8;bola9;bola10;bola11;bola12;bola13;bola14;bola15\n";
        data.push(cabecalho);
        $.each($scope.jogos, function () {
            var linha = this.concurso + ";" +
                this.bola1 + ";" +
                this.bola2 + ";" +
                this.bola3 + ";" +
                this.bola4 + ";" +
                this.bola5 + ";" +
                this.bola6 + ";" +
                this.bola7 + ";" +
                this.bola8 + ";" +
                this.bola9 + ";" +
                this.bola10 + ";" +
                this.bola11 + ";" +
                this.bola12 + ";" +
                this.bola13 + ";" +
                this.bola14 + ";" +
                this.bola15 + "\n";
            data.push(linha);
        });

        saveAs(new Blob(data, {type: "application/octet-stream"}), "facil.csv");
    };
    /* */

    /* update jogos */
    $scope.updateJogo = function () {
        waitingDialog.show();
        var q = {
            "sort": {
                "concurso": -1
            },
            "limit": 1
        };
        Facil.query(null, q).then(function (ultimafacil) {
            $($scope.jogos).each(function () {
                if (this.concurso > ultimafacil[0].concurso) {
                    var facil = new Facil();
                    angular.merge(facil, this);
                    try {
                        facil.$save().then(function () {
                            console.log('salvo');
                        });
                    } catch (err) {
                        console.log(err);
                        return false;
                    }
                }
            });
            $scope.iszip = false;
            waitingDialog.hide();
        });
    };
    /* update jogos */

    /*gerador de menor impacto*/
    $scope.simularMenorColisao = function () {
        /*
         1. Escolha seis dezenas e marque-as nas duas primeiras apostas;
         2. Marque outras nove dezenas na primeira aposta;
         3. Marque nove dezenas na segunda aposta que não constem na primeira;
         4. Marque na terceira aposta sete dezenas que constem apenas na primeira
         aposta e mais sete que constem apenas na segunda;
         5. Marque na terceira aposta a dezena que ainda não consta nem na primeira
         e nem na segunda aposta (haverá apenas uma).
         */

        waitingDialog.show();

        $scope.jogo1 = [];
        $scope.jogo2 = [];
        $scope.jogo3 = [];


        var fator = ($scope.dezenas - 15);

        repeticaoSimples($scope.jogo1, (6 + fator));
        repeticaoExclusiva($scope.jogo1, $scope.jogo2, (6 + fator));

        repeticaoExclusiva($scope.jogo2, $scope.jogo1, (15 + fator));

        //repeticaoSimples($scope.jogo1, (15 + fator));

        var naoEstaNoJogo1 = naoExisteNaLista($scope.jogo1);

        var numero = Math.floor((Math.random() * (10 + fator)) + 1);
        naoEstaNoJogo1.splice(numero, 1);

        repeticaoExclusiva2(naoEstaNoJogo1, $scope.jogo2);

        var naoEstaNenhumJogoAinda = naoExisteNenhumaLista($scope.jogo1, $scope.jogo2);

        repeticaoExclusiva2(naoEstaNenhumJogoAinda, $scope.jogo2);

        repeticaoSimples($scope.jogo2, (15 + fator));

        repeticaoExclusiva3($scope.jogo1, $scope.jogo2, $scope.jogo3, (7 + fator));
        repeticaoExclusiva3($scope.jogo2, $scope.jogo1, $scope.jogo3, (14 + fator));

        var naoEstaNenhumJogo = naoExisteNenhumaLista($scope.jogo1, $scope.jogo2);

        if (naoEstaNenhumJogo.length > 0) {
            for (var index3 = 0; index3 < naoEstaNenhumJogo.length; index3++) {
                if ($scope.jogo3.length === (15 + fator)) {
                    break;
                }
                $scope.jogo3.push(naoEstaNenhumJogo[index3]);
            }
        }
        repeticaoSimples($scope.jogo3, (15 + fator));

        $scope.jogo1.sort(function (a, b) {
            return a - b
        });
        $scope.jogo2.sort(function (a, b) {
            return a - b
        });
        $scope.jogo3.sort(function (a, b) {
            return a - b
        });

        $scope.ganhariaJogo1 = 0;
        $scope.ganhariaJogo1_11 = 0;
        $scope.ganhariaJogo1_12 = 0;
        $scope.ganhariaJogo1_13 = 0;
        $scope.ganhariaJogo1_14 = 0;

        $scope.ganhariaJogo2 = 0;
        $scope.ganhariaJogo2_11 = 0;
        $scope.ganhariaJogo2_12 = 0;
        $scope.ganhariaJogo2_13 = 0;
        $scope.ganhariaJogo2_14 = 0;

        $scope.ganhariaJogo3 = 0;
        $scope.ganhariaJogo3_11 = 0;
        $scope.ganhariaJogo3_12 = 0;
        $scope.ganhariaJogo3_13 = 0;
        $scope.ganhariaJogo3_14 = 0;

        if ($scope.jogos.length > 0) {
            /* verificar se ganharia em algum jogo */
            $($scope.jogos).each(function () {
                var quantidade1 = 0;
                var quantidade2 = 0;
                var quantidade3 = 0;
                $(this.listaBolas).each(function () {
                    if ($.inArray(Number(this), $scope.jogo1) !== -1) {
                        quantidade1++;
                    }
                });
                $(this.listaBolas).each(function () {
                    if ($.inArray(Number(this), $scope.jogo2) !== -1) {
                        quantidade2++;
                    }
                });
                $(this.listaBolas).each(function () {
                    if ($.inArray(Number(this), $scope.jogo3) !== -1) {
                        quantidade3++;
                    }
                });
                if (quantidade1 === 11) {
                    $scope.ganhariaJogo1_11++;
                }
                if (quantidade1 === 12) {
                    $scope.ganhariaJogo1_12++;
                }
                if (quantidade1 === 13) {
                    $scope.ganhariaJogo1_13++;
                }
                if (quantidade1 === 14) {
                    $scope.ganhariaJogo1_14++;
                }
                if (quantidade2 === 11) {
                    $scope.ganhariaJogo2_11++;
                }
                if (quantidade2 === 12) {
                    $scope.ganhariaJogo2_12++;
                }
                if (quantidade2 === 13) {
                    $scope.ganhariaJogo2_13++;
                }
                if (quantidade2 === 14) {
                    $scope.ganhariaJogo2_14++;
                }
                if (quantidade3 === 11) {
                    $scope.ganhariaJogo3_11++;
                }
                if (quantidade3 === 12) {
                    $scope.ganhariaJogo3_12++;
                }
                if (quantidade3 === 13) {
                    $scope.ganhariaJogo3_13++;
                }
                if (quantidade3 === 14) {
                    $scope.ganhariaJogo3_14++;
                }
                if (quantidade1 >= 15) {
                    $scope.ganhariaJogo1++;
                }
                if (quantidade2 >= 15) {
                    $scope.ganhariaJogo2++;
                }
                if (quantidade3 >= 15) {
                    $scope.ganhariaJogo3++;
                }
            });
        }

        waitingDialog.hide();

    };

    function naoExisteNenhumaLista(jogo1, jogo2) {
        var naoEstaNenhumJogo = [];
        for (var indice = 1; indice < 25; indice++) {
            if ($.inArray(indice, jogo1) === -1 && $.inArray(indice, jogo2) === -1) {
                naoEstaNenhumJogo.push(indice);
            }
        }
        return naoEstaNenhumJogo;
    }

    function naoExisteNaLista(jogo1) {
        var naoEstaNoJogo1 = [];
        for (var indice = 1; indice < 25; indice++) {
            if ($.inArray(indice, jogo1) === -1) {
                naoEstaNoJogo1.push(indice);
            }
        }
        return naoEstaNoJogo1;
    }

    function repeticaoExclusiva3(jogo1, jogo2, jogo3, repeticao) {

        for (var indice = 0; indice < jogo1.length; indice++) {
            if ($.inArray(jogo1[indice], jogo2) === -1) {
                jogo3.push(jogo1[indice]);
            }
            if (jogo3.length === repeticao) {
                break;
            }
        }
    }

    function repeticaoExclusiva2(jogo, jogo2) {
        for (var indice = 0; indice < jogo.length; indice++) {
            if ($.inArray(jogo[indice], jogo2) === -1) {
                jogo2.push(jogo[indice]);
            }
        }
    }

    function repeticaoExclusiva(jogo1, jogo2, repeticao) {
        while (jogo2.length < repeticao) {
            var numero = Math.floor((Math.random() * 25) + 1);
            if ($.inArray(numero, jogo1) === -1) {
                if ($.inArray(numero, jogo2) === -1) {
                    jogo2.push(numero);
                }
            }
        }
    }

    function repeticaoSimples(jogo, repeticao) {
        while (jogo.length < repeticao) {
            var rNum = Math.floor((Math.random() * 25) + 1);
            if ($.inArray(rNum, jogo) === -1) {
                jogo.push(rNum);
            }
        }
    }


}]).directive('fileread', [function () {
    return {
        scope: {
            fileread: "=",
            jogos: "=",
            iszip: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                waitingDialog.show();
                var reader = new FileReader();
                var f = changeEvent.target.files[0];
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                        var zip = new JSZip(scope.fileread);
                        $.each(zip.files, function (index, zipEntry) {
                            if (zipEntry.name.lastIndexOf('.') > -1) {
                                var indice = zipEntry.name.lastIndexOf('.');
                                var lenName = zipEntry.name.length;
                                var extension = zipEntry.name.substring((indice + 1), lenName);
                                if (extension === 'HTM' || extension === 'HTML') {
                                    var el = document.createElement('html');
                                    var stringText = zipEntry.asText();
                                    stringText.replace(/ /g, '');
                                    el.innerHTML = stringText;
                                    var table = $(el).find('table');
                                    $(table).find('*').removeAttr('style').removeAttr('width').removeAttr('height')
                                        .removeAttr('rowspan').removeAttr('bgcolor');
                                    var trs = $(table).find('tr');
                                    var atual = 0;
                                    var jogos = {
                                        lista: []
                                    };

                                    var regdot = new RegExp("[.]", "gm");

                                    $(trs).each(function () {
                                        var concurso = $(this).find('td:eq(0)').html();
                                        if ($.isNumeric(concurso)) {
                                            if (concurso === atual) {

                                            } else {

                                                atual = concurso;

                                                var data = $(this).find('td:eq(1)').html();
                                                var bola1 = Number($(this).find('td:eq(2)').html());
                                                var bola2 = Number($(this).find('td:eq(3)').html());
                                                var bola3 = Number($(this).find('td:eq(4)').html());
                                                var bola4 = Number($(this).find('td:eq(5)').html());
                                                var bola5 = Number($(this).find('td:eq(6)').html());
                                                var bola6 = Number($(this).find('td:eq(7)').html());
                                                var bola7 = Number($(this).find('td:eq(8)').html());
                                                var bola8 = Number($(this).find('td:eq(9)').html());
                                                var bola9 = Number($(this).find('td:eq(10)').html());
                                                var bola10 = Number($(this).find('td:eq(11)').html());
                                                var bola11 = Number($(this).find('td:eq(12)').html());
                                                var bola12 = Number($(this).find('td:eq(13)').html());
                                                var bola13 = Number($(this).find('td:eq(14)').html());
                                                var bola14 = Number($(this).find('td:eq(15)').html());
                                                var bola15 = Number($(this).find('td:eq(16)').html());
                                                var listaBolas = [];
                                                listaBolas.push(Number(bola1), Number(bola2), Number(bola3),
                                                    Number(bola4), Number(bola5), Number(bola6), Number(bola7),
                                                    Number(bola8), Number(bola9), Number(bola10), Number(bola11),
                                                    Number(bola12), Number(bola13), Number(bola14), Number(bola15));
                                                listaBolas.sort(function (a, b) {
                                                    return a - b
                                                });
                                                var arrecadacaoTotal = $(this).find('td:eq(17)').html();
                                                var ganhadores15 = $(this).find('td:eq(18)').html();
                                                var cidade = $(this).find('td:eq(19)').html().trim();
                                                var uf = $(this).find('td:eq(20)').html().trim();
                                                var ganhadores14 = $(this).find('td:eq(21)').html();
                                                var ganhadores13 = $(this).find('td:eq(22)').html();
                                                var ganhadores12 = $(this).find('td:eq(23)').html();
                                                var ganhadores11 = $(this).find('td:eq(24)').html();

                                                var rateio15 = $(this).find('td:eq(25)').html();
                                                var rateio14 = $(this).find('td:eq(26)').html();
                                                var rateio13 = $(this).find('td:eq(27)').html();
                                                var rateio12 = $(this).find('td:eq(28)').html();
                                                var rateio11 = $(this).find('td:eq(29)').html();

                                                var acumulado15 = $(this).find('td:eq(30)').html();
                                                var estimativa = $(this).find('td:eq(31)').html();
                                                var acumuladorEspecial = $(this).find('td:eq(32)').html();

                                                var jogo = {
                                                    concurso: Number(concurso),
                                                    data: data,
                                                    bola1: bola1,
                                                    bola2: bola2,
                                                    bola3: bola3,
                                                    bola4: bola4,
                                                    bola5: bola5,
                                                    bola6: bola6,
                                                    bola7: bola7,
                                                    bola8: bola8,
                                                    bola9: bola9,
                                                    bola10: bola10,
                                                    bola11: bola11,
                                                    bola12: bola12,
                                                    bola13: bola13,
                                                    bola14: bola14,
                                                    bola15: bola15,
                                                    listaBolas: listaBolas,
                                                    arrecadacaoTotal: Number(arrecadacaoTotal.replace(regdot, '').replace(',', '.')),
                                                    ganhadores15: Number(ganhadores15),
                                                    cidades: [],
                                                    ufs: [],
                                                    ganhadores14: Number(ganhadores14),
                                                    ganhadores13: Number(ganhadores13),
                                                    ganhadores12: Number(ganhadores12),
                                                    ganhadores11: Number(ganhadores11),
                                                    rateio15: Number(rateio15.replace(regdot, '').replace(',', '.')),
                                                    rateio14: Number(rateio14.replace(regdot, '').replace(',', '.')),
                                                    rateio13: Number(rateio13.replace(regdot, '').replace(',', '.')),
                                                    rateio12: Number(rateio12.replace(regdot, '').replace(',', '.')),
                                                    rateio11: Number(rateio11.replace(regdot, '').replace(',', '.')),
                                                    acumulado15: Number(acumulado15.replace(regdot, '').replace(',', '.')),
                                                    estimativa: Number(estimativa.replace(regdot, '').replace(',', '.')),
                                                    acumuladorEspecial: Number(acumuladorEspecial.replace(regdot, '').replace(',', '.'))
                                                };
                                                jogo.cidades.push((cidade.trim()));
                                                jogo.ufs.push((uf.trim()));

                                                jogos.lista.push(jogo);

                                            }
                                        } else {
                                            if (atual !== 0) {
                                                var ufAtual = $(this).find('td:eq(1)').html();
                                                jogos.lista[(jogos.lista.length - 1)].cidades.push(concurso.trim());
                                                jogos.lista[(jogos.lista.length - 1)].ufs.push(ufAtual.trim());
                                            }
                                        }
                                    });
                                    scope.jogos = jogos.lista;
                                    if (scope.jogos.length > 0) {
                                        scope.iszip = true;
                                    }
                                    waitingDialog.hide();
                                }
                            }
                        });
                    });
                };
                reader.readAsArrayBuffer(f);
            });
        }
    }
}]);
