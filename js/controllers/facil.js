loto.controller('FacilCtrl', ['$scope', function($scope){
    $scope.arquivo = "";
    /*
    JSZipUtils.getBinaryContent('', function(err, data) {
        if(err) {
            throw err; // or handle err
        }

        var zip = new JSZip(data);
    });
    */
}]).directive('fileread', [ function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
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
                                    el.innerHTML = zipEntry.asText();
                                    var table = $(el).find('table');
                                    var trs = $(table).find('tr');
                                    var lenTds = 0;
                                    var jogos = "";
                                    $(trs).find('td:first-child').each(function(){
                                        if ($(this).html() !== '' && $.isNumeric($(this).html())) {
                                            lenTds++;
                                            jogos += $(this).html() + ", ";
                                        }
                                    })
                                    console.log(lenTds);
                                    console.log(jogos);
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
