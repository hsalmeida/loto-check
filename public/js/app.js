var loto = angular.module('loto', ['ui.router', 'mongolabResourceHttp'])
    .constant('MONGOLAB_CONFIG',{API_KEY:'YXgR-q92vuVCKlSm-ji3nplDTE7rHIQh', DB_NAME:'ltdb'})
    .controller('LotoCtrl', ['$scope', function($scope){

    }])
    .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "views/home.html"
            })
            .state('facil', {
                url: "/facil",
                templateUrl: "views/facil.html",
                controller: 'FacilCtrl'
            })
            .state('mega', {
                url: "/mega",
                templateUrl: "views/mega.html",
                controller: 'MegaCtrl'
            })
            .state('quina', {
                url: "/quina",
                templateUrl: "views/quina.html",
                controller: 'QuinaCtrl'
            });
    });
