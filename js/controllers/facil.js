loto.controller('FacilCtrl', ['$scope', function($scope){
    $scope.arquivo = "";
    $scope.jogos = "";
}]).directive('fileread', [function () {
    return {
        scope: {
            fileread: "=",
            jogos: "="
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
                                    var stringText = zipEntry.asText();

                                    stringText = decodeURI(stringText);
                                    console.log(stringText.replace(/ /g,''));
                                    el.innerHTML = stringText;
                                    var table = $(el).find('table');
                                    $(table).find('*').removeAttr('style').removeAttr('width').removeAttr('height')
                                        .removeAttr('rowspan').removeAttr('bgcolor');
                                    var trs = $(table).find('tr');
                                    var lenTds = 0;
                                    var jogos = "";
                                    $(trs).find('td:first-child').each(function(){
                                        if ($(this).html() !== '' && $.isNumeric($(this).html())) {
                                            lenTds++;
                                            jogos += $(this).html() + ", ";
                                        }
                                    });
                                    //scope.jogos = $(table);
                                    $('#tabela').html(table)
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
