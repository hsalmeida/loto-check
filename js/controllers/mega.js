loto.controller('MegaCtrl', ['$scope', 'Mega', function($scope, Mega){
    $scope.jogos = [];
    $scope.iszip = false;
    $scope.arquivo = "";

    $scope.tabelaSorteio = [[]];
    $scope.tabelaOrdenada = [[]];

    $scope.tabelaSorteioVencedora = [[]];
    $scope.tabelaOrdenadaVencedora = [[]];

    $scope.dezenas = 6;
    $scope.qtdJogos = 1;

    $scope.base = "padrao";

    $scope.numeros = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,
    18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,
    38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,
    58,59,60];

    $scope.totalBolas = [1,2,3,4,5,6];

    $scope.ganhadora = true;

    $scope.predicate = 'concurso';
    $scope.reverse = false;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };

    $scope.jogosColisao = [];
    $scope.jogoColisao = [];

    $scope.filterBola = function(bola, numero, ganhador){
        return function(item){
            if(ganhador) {
                return item['bola' + bola] === numero && item['ganhadoressena'] > 0;
            } else {
                return item['bola' + bola] === numero;
            }
        }
    };

    $scope.filterBolaSum = function(numero, ganhador){
        return function(item){
            if(ganhador) {
                return $.inArray(numero, item['listaBolas']) !== -1 && item['ganhadoressena'] > 0;
            } else {
                return $.inArray(numero, item['listaBolas']) !== -1;
            }
        }
    };

    $scope.filterBolaOrdenada = function(bola, numero, ganhador){
        return function(item){
            if(ganhador) {
                return item['listaBolas'][(bola - 1)] === numero && item['ganhadoressena'] > 0;
            } else {
                return item['listaBolas'][(bola - 1)] === numero;
            }
        }
    };

    $scope.updateJogo = function(){
        waitingDialog.show();
        var q = {
            "sort" : {
                "concurso" : -1
            },
            "limit" : 1
        };
        Mega.query(null, q).then(function(ultimamega){
            $($scope.jogos).each(function(){
                if (this.concurso > ultimamega[0].concurso) {
                    var mega = new Mega();
                    angular.merge(mega, this);
                    try {
                        mega.$save().then(function () {
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

    /* import */
    $scope.import = function(){
        $($scope.jogos).each(function(){
            var mega = new Mega();
            angular.merge(mega, this);
            try {
                mega.$save().then(function () {
                    console.log('salvo');
                });
            } catch (err) {
                console.log(err);
                return false;
            }
        });
    };
    /* import */

    $scope.getJogos = function(){
        waitingDialog.show();
        Mega.all({"limit" : 2000}).then(function(jogos){
            $scope.jogos = jogos;

            /* criar tabelas
            * a criacao de tabelas colocar no escopo as tabelas
            * antes feito com filter no angular ..
            * preciso mudar para usar como desvio*/

            inicializaMatrizes();

            criarTabelaPorSorteio();
            criarTabelaPorOrdem();

            criarTabelaPorSorteioVencedora();
            criarTabelaPorOrdemVencedora();

            //$scope.simularMenorColisao();
            waitingDialog.hide();
        });
    };

    function inicializaMatrizes(){
        $.each($scope.numeros, function(indiceNumero, numero){
            $scope.tabelaSorteio[indiceNumero] = [0,0,0,0,0,0];
            $scope.tabelaOrdenada[indiceNumero] = [0,0,0,0,0,0];
            $scope.tabelaSorteioVencedora[indiceNumero] = [0,0,0,0,0,0];
            $scope.tabelaOrdenadaVencedora[indiceNumero] = [0,0,0,0,0,0];
        });
    }

    function criarTabelaPorSorteio(){
        //numeros totalBolas
        $.each($scope.numeros, function(indiceNumero, numero){
            $.each($scope.totalBolas, function(indiceBola, bola){
                $.each($scope.jogos, function(indiceJogo, jogo){
                    if(jogo[('bola' + bola)] === numero) {
                        $scope.tabelaSorteio[indiceNumero][indiceBola]++;
                    }
                });
            });
        });
    }

    function criarTabelaPorOrdem(){
        //numeros totalBolas
        $.each($scope.numeros, function(indiceNumero, numero){
            $.each($scope.totalBolas, function(indiceBola, bola){
                $.each($scope.jogos, function(indiceJogo, jogo){
                    if(jogo.listaBolas[indiceBola] === numero) {
                        $scope.tabelaSorteio[indiceNumero][indiceBola]++;
                    }
                });
            });
        });
    }

    function criarTabelaPorSorteioVencedora(){
        //numeros totalBolas
        $.each($scope.numeros, function(indiceNumero, numero){
            $.each($scope.totalBolas, function(indiceBola, bola){
                $.each($scope.jogos, function(indiceJogo, jogo){
                    if(jogo[('bola' + bola)] === numero && jogo.ganhadoressena > 0) {
                        $scope.tabelaSorteioVencedora[indiceNumero][indiceBola]++;
                    }
                });
            });
        });
    }

    function criarTabelaPorOrdemVencedora(){
        //numeros totalBolas
        $.each($scope.numeros, function(indiceNumero, numero){
            $.each($scope.totalBolas, function(indiceBola, bola){
                $.each($scope.jogos, function(indiceJogo, jogo){
                    if(jogo.listaBolas[indiceBola] === numero  && jogo.ganhadoressena > 0) {
                        $scope.tabelaSorteioVencedora[indiceNumero][indiceBola]++;
                    }
                });
            });
        });
    }

    $scope.simularMenorColisao = function(){

        /*
         PROBABILIDADE POR POSIÇÃO
            	    Probabilidade x Dezenas
         Posição    30%	     50%	 80%
         1	         1 a 4	 1 a 7	 1 a 14
         2	        10 a 16	 7 a 19	 4 a 27
         3	        21 a 28	18 a 31	13 a 38
         4	        33 a 40	30 a 43	23 a 48
         5	        45 a 52	43 a 54	34 a 57
         6	        57 a 60	54 a 60	47 a 60
         */

        $scope.jogosColisao = [];

        //matriz de probabilidades
        //0 igual a 6 dezenas e assim vai
        var probabilidades = [
            [
                {a: 0, b: 14},{a: 3, b: 27},{a: 13, b: 38},{a: 22, b: 48},
                {a: 33, b: 57},{a: 46, b: 60}
            ],
            [
                {a: 0, b: 14},{a: 0, b: 14},{a: 6, b: 20},{a: 9, b: 48},
                {a: 33, b: 57},{a: 46, b: 60},{a: 46, b: 60}
            ],
            [
                {a: 0, b: 14},{a: 3, b: 27},{a: 13, b: 38},{a: 22, b: 48},
                {a: 33, b: 57},{a: 46, b: 60},{a: 46, b: 60},{a: 22, b: 48}
            ],
            [
                {a: 0, b: 14},{a: 3, b: 27},{a: 13, b: 38},{a: 22, b: 48},
                {a: 33, b: 57},{a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},
                {a: 46, b: 60}
            ],
            [
                {a: 0, b: 14},{a: 3, b: 27},{a: 13, b: 38},{a: 22, b: 48},
                {a: 33, b: 57},{a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},
                {a: 46, b: 60},{a: 46, b: 60}
            ],
            [
                {a: 0, b: 14},{a: 3, b: 27},{a: 13, b: 38},{a: 22, b: 48},
                {a: 33, b: 57},{a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},
                {a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60}
            ],
            [
                {a: 0, b: 14},{a: 3, b: 27},{a: 13, b: 38},{a: 22, b: 48},
                {a: 33, b: 57},{a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},
                {a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60}
            ],
            [
                {a: 0, b: 14},{a: 3, b: 27},{a: 13, b: 38},{a: 22, b: 48},
                {a: 33, b: 57},{a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},
                {a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},
                {a: 46, b: 60}
            ],
            [
                {a: 0, b: 14},{a: 3, b: 27},{a: 13, b: 38},{a: 22, b: 48},
                {a: 33, b: 57},{a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},
                {a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},
                {a: 46, b: 60},{a: 46, b: 60}
            ],
            [
                {a: 0, b: 14},{a: 3, b: 27},{a: 13, b: 38},{a: 22, b: 48},
                {a: 33, b: 57},{a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},
                {a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},
                {a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60}
            ],
            [
                {a: 0, b: 14},{a: 3, b: 27},{a: 13, b: 38},{a: 22, b: 48},
                {a: 33, b: 57},{a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},
                {a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},
                {a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60}
            ],
            [
                {a: 0, b: 14},{a: 3, b: 27},{a: 13, b: 38},{a: 22, b: 48},
                {a: 33, b: 57},{a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},
                {a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},
                {a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},{a: 46, b: 60},
                {a: 46, b: 60}
            ]
        ];

        for(var indice = 0; indice < $scope.qtdJogos; indice++) {
            var jogo1 = {
                lista : [],
                acertos: 0
            };

            for(var b = 1;b <= $scope.dezenas; b++) {
                posicao(jogo1, 0, 14, 14, b);
            }

            jogo1.lista.sort(function(a, b){return a-b});

            $scope.jogosColisao.push(jogo1);
        }


    };

    function posicao(jogo, inicio, fim, tamanho, dezena){
        while(jogo.lista.length < dezena) {
            var sub = $scope.numeros.slice(inicio, fim);
            var rNum = Math.floor((Math.random() * tamanho) + 1);
            var valor = sub[(rNum - 1)];
            if ($.inArray(valor, jogo.lista) === -1) {
                jogo.lista.push(valor);
            }
        }
    }

}]).directive('filereadmega', [function () {
    return {
        scope: {
            filereadmega: "=",
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
                        scope.filereadmega = loadEvent.target.result;
                        var zip = new JSZip(scope.filereadmega);
                        $.each(zip.files, function (index, zipEntry) {
                            if(zipEntry.name.lastIndexOf('.') > -1) {
                                var indice = zipEntry.name.lastIndexOf('.');
                                var lenName = zipEntry.name.length;
                                var extension = zipEntry.name.substring((indice + 1), lenName);
                                if(extension === 'HTM' || extension === 'HTML') {
                                    var el = document.createElement( 'html' );
                                    var stringText = zipEntry.asText();
                                    stringText.replace(/ /g,'');


                                    el.innerHTML = stringText;
                                    var table = $(el).find('table');
                                    $(table).find('*').removeAttr('style').removeAttr('width').removeAttr('height')
                                        .removeAttr('rowspan').removeAttr('bgcolor');
                                    var trs = $(table).find('tr');
                                    var atual = 0;
                                    var jogos = {
                                        lista: []
                                    };

                                    var regdot = new RegExp("[.]","gm");

                                    $(trs).each(function(){
                                        var concurso = $(this).find('td:eq(0)').html();
                                        if($.isNumeric(concurso)) {
                                            if(concurso === atual) {

                                            } else {

                                                atual = concurso;

                                                var data = $(this).find('td:eq(1)').html();
                                                var bola1 = Number($(this).find('td:eq(2)').html());
                                                var bola2 = Number($(this).find('td:eq(3)').html());
                                                var bola3 = Number($(this).find('td:eq(4)').html());
                                                var bola4 = Number($(this).find('td:eq(5)').html());
                                                var bola5 = Number($(this).find('td:eq(6)').html());
                                                var bola6 = Number($(this).find('td:eq(7)').html());
                                                var listaBolas = [];
                                                listaBolas.push(Number(bola1), Number(bola2), Number(bola3),
                                                    Number(bola4), Number(bola5),Number(bola6));
                                                listaBolas.sort(function(a, b){return a-b});
                                                var arrecadacaoTotal = $(this).find('td:eq(8)').html();
                                                var ganhadoressena = $(this).find('td:eq(9)').html();
                                                var cidade = $(this).find('td:eq(10)').html().trim();
                                                var uf = $(this).find('td:eq(11)').html().trim();
                                                var rateiosena = $(this).find('td:eq(12)').html();
                                                var ganhadoresquina = $(this).find('td:eq(13)').html();
                                                var rateioquina = $(this).find('td:eq(14)').html();
                                                var ganhadoresquadra = $(this).find('td:eq(15)').html();
                                                var rateioquadra = $(this).find('td:eq(16)').html();
                                                var acumulado = $(this).find('td:eq(17)').html();
                                                var valoracumulado = $(this).find('td:eq(18)').html();
                                                var estimativa = $(this).find('td:eq(19)').html();
                                                var acumuladorEspecial = $(this).find('td:eq(20)').html();

                                                var jogo = {
                                                    concurso: Number(concurso),
                                                    data : data,
                                                    bola1: bola1,
                                                    bola2: bola2,
                                                    bola3: bola3,
                                                    bola4: bola4,
                                                    bola5: bola5,
                                                    bola6: bola6,
                                                    listaBolas : listaBolas,
                                                    arrecadacaoTotal: Number(arrecadacaoTotal.replace(regdot,'').replace(',','.')),
                                                    ganhadoressena: Number(ganhadoressena),
                                                    cidades: [],
                                                    ufs: [],
                                                    ganhadoresquina: Number(ganhadoresquina),
                                                    ganhadoresquadra: Number(ganhadoresquadra),
                                                    rateiosena: Number(rateiosena.replace(regdot,'').replace(',','.')),
                                                    rateioquina: Number(rateioquina.replace(regdot,'').replace(',','.')),
                                                    rateioquadra: Number(rateioquadra.replace(regdot,'').replace(',','.')),
                                                    acumulado: acumulado.trim(),
                                                    valoracumulado: Number(valoracumulado.replace(regdot,'').replace(',','.')),
                                                    estimativa: Number(estimativa.replace(regdot,'').replace(',','.')),
                                                    acumuladorEspecial: Number(acumuladorEspecial.replace(regdot,'').replace(',','.'))
                                                };
                                                jogo.cidades.push((cidade.trim()));
                                                jogo.ufs.push((uf.trim()));

                                                jogos.lista.push(jogo);

                                            }
                                        } else {
                                            if(atual !== 0) {
                                                var ufAtual = $(this).find('td:eq(1)').html();
                                                jogos.lista[(jogos.lista.length - 1)].cidades.push(concurso.trim());
                                                jogos.lista[(jogos.lista.length - 1)].ufs.push(ufAtual.trim());
                                            }
                                        }
                                    });
                                    scope.jogos = jogos.lista;
                                    if(scope.jogos.length > 0) {
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