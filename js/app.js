var loto = angular.module('loto', ['ui.router'])
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
    })
    ;
