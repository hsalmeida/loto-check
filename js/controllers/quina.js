loto.controller('QuinaCtrl', ['$scope', function ($scope) {

    $scope.octantes = [];

    $scope.octantes.push([1, 2, 11, 12, 21, 22, 31, 32]);
    $scope.octantes.push([3, 4, 13, 14, 23, 24, 33, 34]);
    $scope.octantes.push([5, 6, 15, 16, 25, 26, 35, 36]);
    $scope.octantes.push([7, 8, 17, 18, 27, 28, 37, 38]);
    $scope.octantes.push([9, 10, 19, 20, 29, 30, 39, 40]);
    $scope.octantes.push([41, 42, 51, 52, 61, 62, 71, 72]);
    $scope.octantes.push([43, 44, 53, 54, 63, 64, 73, 74]);
    $scope.octantes.push([45, 46, 55, 56, 65, 66, 75, 76]);
    $scope.octantes.push([47, 48, 57, 58, 67, 68, 77, 78]);
    $scope.octantes.push([49, 50, 59, 60, 69, 70, 79, 80]);

    $scope.jogos = [];

    $scope.dezenas = 5;
    $scope.qtdJogos = 1;

    $scope.jogar = function () {
        $scope.jogos = [];
        for(var jogos = 0; jogos < $scope.qtdJogos; jogos++) {
            console.log(jogos);
            var lista = [];
            for (var loop = 0; loop < $scope.dezenas; loop++) {
                var indice = (Math.floor(Math.random() * 10) + 1) - 1;
                var octante = $scope.octantes[indice];
                var estaNoJogo = true;
                while (estaNoJogo) {

                    var indiceNaOctante = (Math.floor(Math.random() * 8) + 1) - 1;
                    var numeroNaOctante = octante[indiceNaOctante];

                    if ($.inArray(numeroNaOctante, lista) === -1) {
                        lista.push(numeroNaOctante);
                        estaNoJogo = false;
                    }
                }
            }
            lista.sort(function(a, b){return a-b});
            $scope.jogos.push(lista);
        }
    };


}]);