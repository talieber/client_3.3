
//defines the app and all the needed dependencies
let app = angular.module('myApp', ["ngRoute"]);

app.config(function($routeProvider)  {

//set all the app's html pages and controlers
    $routeProvider
        // homepage
        .when('/', {
            templateUrl: 'pages/homepage/homepage.html',
            controller : 'homepageController as hpCtrl'
        })
        // about
        .when('/about', {
            templateUrl: 'pages/about/about.html',
            controller : 'aboutController as abtCtrl'
        })
        // login
        .when('/login', {
            templateUrl: 'pages/login/login.html',
            controller : 'loginController as logCtrl'
        })
        //register
        .when('/register', {
            templateUrl: 'pages/register/register.html',
            controller : 'registerController as regCtrl'
        })
        // favorite POIs
        .when('/favoritePOIs', {
            templateUrl: 'pages/favoritePOIs/favoritePOIs.html',
            controller : 'favoritePOIsController as favPOICtrl'
        })
        // poi
        .when('/poi', {
            templateUrl: 'pages/poi/poi.html',
            controller : 'poiController as poiCtrl'
        })
        // selectedPOI
        .when('/selectedPOI/:poiName', {
            templateUrl: 'pages/selectedPOI/selectedPOI.html',
            controller : 'selectedPOIController as selPoiCtrl'
        })
        .when('/httpRequest', {
            templateUrl: 'pages/http/request.html',
            controller : 'httpController as httpCtrl'
        })
        // otherwise
        .otherwise({ redirectTo: '/' });
});