// homepage controller
angular.module("myApp")
.controller("homepageController", function ($scope, $http, $rootScope, $window) {
    
    self=this;

    //check if user logedin
    if($window.sessionStorage.getItem("username") === null){
        $rootScope.isLogedIn=false;
    }
    else{
        $rootScope.isLogedIn=true ;
    }
    //get random POIs above rank 2 
    $http.get('http://localhost:3000/getRandomPOI/2').then(function(response){
        $scope.returnPOIs=response.data;
    });

    //default functions only if the user is loged in.
    if ($rootScope.isLogedIn) {
        //get 2 popular POIs of 2 fields of interest of a specific user
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/getPopularPOI',
            headers: {
              'x-out-token': $rootScope.token
            }
        }   
        $http(req).then(function (response){
            $scope.mami=response.data;
            $scope.popularPOIs = [{"poi_name": response.data.split(', ')[0], "picture": response.data.split(', ')[1]},
        {"poi_name": response.data.split(', ')[2], "picture": response.data.split(', ')[3]}]            
        });

        //$scope.message = $rootScope.message;

        // get 2 saved POIs of a specific user, if exists
        // var req = {
        //     method: 'GET',
        //     url: 'http://localhost:3000/getSavedPOI',
        //     headers: {
        //       'x-out-token': $rootScope.token
        //     }
        // }   
        // $http(req).then(function successCallback (response){
        //     $rootScope.savedPOI = response.data; 
        //     $rootScope.favoritePOIsSize= $rootScope.savedPOIs.length;
        //     //$scope.message = "You haven't saved any favorite point of interest yet."          
        // },function errorCallback (){
        //     $rootScope.savedPOI = {};
        //     $rootScope.favoritePOIsSize= $scope.savedPOIs.length;
        //     $scope.message = "You haven't saved any favorite point of interest yet."          
        // });

        //tal
        // var req2 = {
        //     method: 'GET',
        //     url: 'http://localhost:3000/getSavedPOI',
        //     headers: {
        //         'x-out-token': $rootScope.token
        //     }
        // }   
        // $http(req2).then(function successCallback (response){
        //     $rootScope.savedPOIs = response.data;
        //     window.sessionStorage.setItem("favoritePOIForSession", JSON.stringify( $rootScope.savedPOIs)); 
        //     $rootScope.favoritePOIsSize = $rootScope.savedPOIs.length;
        //     //$scope.message = "You haven't saved any favorite point of interest yet."          
        //     $scope.message ="";
        // },function errorCallback (){
        //     $rootScope.savedPOIs = [];
        //     $window.sessionStorage.setItem("favoritePOIForSession", JSON.stringify( $rootScope.savedPOIs)); 
        //     $rootScope.favoritePOIsSize = $rootScope.savedPOIs.length; 
        //     $scope.message = "You haven't saved any favorite point of interest yet."          
        // });
            //tal

    }

});