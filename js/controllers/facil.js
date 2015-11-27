loto.controller('FacilCtrl', ['$scope', function($scope){
    JSZipUtils.getBinaryContent('http://www1.caixa.gov.br/loterias/_arquivos/loterias/D_lotfac.zip', function(err, data) {
        if(err) {
            throw err; // or handle err
        }

        var zip = new JSZip(data);
    });
}]);
