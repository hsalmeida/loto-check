loto
    .factory('Facil', function($mongolabResourceHttp){
        return $mongolabResourceHttp('facil');
    })
    .factory('Mega', function($mongolabResourceHttp){
        return $mongolabResourceHttp('mega');
    });
