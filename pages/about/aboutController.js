// about controller
angular.module("myApp")
.controller("aboutController", function ($scope, $window) {
    // button click count

    //check if user logedin
    if($window.sessionStorage.getItem("username") === null){
        $rootScope.isLogedIn=false;
    }
    else{
        $rootScope.isLogedIn=true ;
        returnFromStorage = $window.sessionStorage.getItem("favoritePOIForSession"); //gets favoritePOI user choose in this session
        $rootScope.favoritePOIsSize = $scope.savedPOIs.length;

    }

    $scope.btnCount = 0;
    $scope.myFunc = function() {
        $scope.btnCount++;
    }
});