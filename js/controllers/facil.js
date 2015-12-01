loto.controller('FacilCtrl', ['$scope', function($scope){
    $scope.arquivo = "";
    $scope.jogos = [];
    $scope.jogo = {};

    $scope.predicate = 'concurso';
    $scope.reverse = false;

    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };

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
                                var index = zipEntry.name.lastIndexOf('.');
                                var lenName = zipEntry.name.length;
                                var extension = zipEntry.name.substring((index + 1), lenName);
                                if(extension === 'HTM' || extension === 'HTML') {
                                    var el = document.createElement( 'html' );
                                    var stringText = zipEntry.asText();
                                    stringText.replace(/ /g,'');
                                    el.innerHTML = stringText;
                                    var table = $(el).find('table');
                                    $(table).find('*').removeAttr('style').removeAttr('width').removeAttr('height')
                                        .removeAttr('rowspan').removeAttr('bgcolor');
                                    var trs = $(table).find('tr');
                                    var lenTds = 0;

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
                                    console.log(JSON.stringify(jogos));
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
