loto.controller('FacilCtrl', ['$scope', '$timeout', function($scope, $timeout){
    $scope.arquivo = "";
    $scope.jogos = [];
    $scope.jogo = {};

    $scope.predicate = 'concurso';
    $scope.reverse = false;

    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };

    $scope.jogo1 = [];
    $scope.jogo2 = [];
    $scope.jogo3 = [];

    /*gerador de menor impacto*/
    $scope.simularMenorColisao = function(){
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

        repeticaoSimples($scope.jogo1, 6);
        repeticaoSimples($scope.jogo2, 6);

        repeticaoSimples($scope.jogo1, 15);

        repeticaoExclusiva($scope.jogo1, $scope.jogo2, 15);

        $scope.jogo1.sort(function(a, b){return a-b});
        $scope.jogo2.sort(function(a, b){return a-b});
        $scope.jogo3.sort(function(a, b){return a-b});

        waitingDialog.hide();

        /*

        for(var um = 0; um < 6; um++) {
            inicioRecorrente($scope.jogo1);
            inicioRecorrente($scope.jogo2);
        }
        for(var dois = 0; dois < 9; dois++) {
            inicioRecorrente($scope.jogo1);
        }

        $timeout(function () {
            console.log('timer1');
            try {
                for (var tres = 0; tres < 9; tres++) {
                    inicioRecorrenteInversoExcluviso($scope.jogo1, $scope.jogo2);
                }
            } catch(err) {
                console.log('erro no timer 1');
            }
        }, 2000);


        $timeout(function () {
            console.log('timer2');
            try {
                for(var quatro = 0; quatro < 7; quatro++) {
                    inicioRecorrenteInverso($scope.jogo3, $scope.jogo1, $scope.jogo2);
                }
            }catch(err) {
                console.log('erro no timer 2');
            }
        }, 5000);

        $timeout(function () {
            console.log('timer3');
            try {
                for (var cinco = 0; cinco < 7; cinco++) {
                    inicioRecorrenteInverso($scope.jogo3, $scope.jogo2, $scope.jogo1);
                }
            }catch(err) {
                console.log('erro no timer 3');
            }
        }, 10000);

        $timeout(function () {
            console.log('timer4');
            try {
                for (var seis = 1; seis <= 25; seis++) {
                    if ($.inArray(seis, $scope.jogo1) === -1 && $.inArray(seis, $scope.jogo2) === -1) {
                        $scope.jogo3.push(seis);
                        break;
                    }
                }
                while($scope.jogo3.length < 15) {
                    var rNum = Math.floor((Math.random() * 25) + 1);
                    if($.inArray(rNum, $scope.jogo3) === -1) {
                        $scope.jogo3.push(rNum);
                    }
                }
            }catch(err) {
                console.log('erro no timer 4');
            }
            console.log('sorter');
            $scope.jogo1.sort(function(a, b){return a-b});
            $scope.jogo2.sort(function(a, b){return a-b});
            $scope.jogo3.sort(function(a, b){return a-b});

            waitingDialog.hide();
        }, 15000);
        */

    };

    function repeticaoExclusiva(jogo1, jogo2, repeticao) {
        while(jogo2.length < repeticao) {
            var rNum = Math.floor((Math.random() * 25) + 1);
            if($.inArray(rNum, jogo2) === -1 && $.inArray(rNum, jogo1) === -1) {
                jogo2.push(rNum);
            }
        }
    }

    function repeticaoSimples(jogo, repeticao) {
        while(jogo.length < repeticao) {
            var rNum = Math.floor((Math.random() * 25) + 1);
            if($.inArray(rNum, jogo) === -1) {
                jogo.push(rNum);
            }
        }
    }

    function inicioRecorrente(jogo){
        var numero1 = Math.floor((Math.random() * 25) + 1);
        if($.inArray(numero1, jogo) !== -1) {
            inicioRecorrente(jogo);
        } else {
            jogo.push(numero1);
        }
    }

    function inicioRecorrenteInverso(j0, j1, j2){
        var numero1 = Math.floor((Math.random() * 25) + 1);
        if($.inArray(numero1, j0) === -1 && $.inArray(numero1, j1) !== -1 && $.inArray(numero1, j2) === -1) {
            j0.push(numero1);
        } else {
            inicioRecorrenteInverso(j0, j1, j2);
        }
    }

    function inicioRecorrenteInversoExcluviso(jogo, jogo2){
        var numero1 = Math.floor((Math.random() * 25) + 1);
        if($.inArray(numero1, jogo2) !== -1 && $.inArray(numero1, jogo) !== -1) {
            inicioRecorrenteInversoExcluviso(jogo, jogo2);
        } else {
            jogo2.push(numero1);
        }
    }


}]).directive('fileread', [function () {
    return {
        scope: {
            fileread: "=",
            jogos: "="
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

                                    var achou = false;
                                    var atual = 0;

                                    var jogos = {
                                        lista: []
                                    };

                                    var regdot = new RegExp("[.]","gm");
                                    
                                    $(trs).each(function(){
                                        var concurso = $(this).find('td:eq(0)').html();
                                        if($.isNumeric(concurso)) {
                                            achou = true;
                                            if(concurso === atual) {

                                            } else {

                                                atual = concurso;

                                                var data = $(this).find('td:eq(1)').html();
                                                var bola1 = $(this).find('td:eq(2)').html();
                                                var bola2 = $(this).find('td:eq(3)').html();
                                                var bola3 = $(this).find('td:eq(4)').html();
                                                var bola4 = $(this).find('td:eq(5)').html();
                                                var bola5 = $(this).find('td:eq(6)').html();
                                                var bola6 = $(this).find('td:eq(7)').html();
                                                var bola7 = $(this).find('td:eq(8)').html();
                                                var bola8 = $(this).find('td:eq(9)').html();
                                                var bola9 = $(this).find('td:eq(10)').html();
                                                var bola10 = $(this).find('td:eq(11)').html();
                                                var bola11 = $(this).find('td:eq(12)').html();
                                                var bola12 = $(this).find('td:eq(13)').html();
                                                var bola13 = $(this).find('td:eq(14)').html();
                                                var bola14 = $(this).find('td:eq(15)').html();
                                                var bola15 = $(this).find('td:eq(16)').html();
                                                var listaBolas = [];
                                                listaBolas.push(Number(bola1), Number(bola2), Number(bola3),
                                                    Number(bola4), Number(bola5),Number(bola6), Number(bola7),
                                                    Number(bola8), Number(bola9), Number(bola10), Number(bola11),
                                                    Number(bola12), Number(bola13),Number(bola14), Number(bola15));
                                                listaBolas.sort(function(a, b){return a-b});
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
                                                    data : data,
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
                                                    listaBolas : listaBolas,
                                                    arrecadacaoTotal: arrecadacaoTotal,
                                                    ganhadores15: Number(ganhadores15),
                                                    cidades: [],
                                                    ufs: [],
                                                    ganhadores14: Number(ganhadores14),
                                                    ganhadores13: Number(ganhadores13),
                                                    ganhadores12: Number(ganhadores12),
                                                    ganhadores11: Number(ganhadores11),
                                                    rateio15: Number(rateio15.replace(regdot,'').replace(',','.')),
                                                    rateio14: Number(rateio14.replace(regdot,'').replace(',','.')),
                                                    rateio13: Number(rateio13.replace(regdot,'').replace(',','.')),
                                                    rateio12: Number(rateio12.replace(regdot,'').replace(',','.')),
                                                    rateio11: Number(rateio11.replace(regdot,'').replace(',','.')),
                                                    acumulado15: Number(acumulado15.replace(regdot,'').replace(',','.')),
                                                    estimativa: Number(estimativa.replace(regdot,'').replace(',','.')),
                                                    acumuladorEspecial: Number(acumuladorEspecial.replace(regdot,'').replace(',','.'))
                                                };
                                                jogo.cidades.push(cidade);
                                                jogo.ufs.push(uf);

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
