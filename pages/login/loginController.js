// poi controller
angular.module("myApp")
.controller("loginController", function ($scope, $http, $location, $rootScope, $window) {

    //arrya of questions
    var arrQuestions= new Array("Which city did you born in?","What is the name of your pet?","What is your mother's phone number?","What was the name of your heighschool?","Where are you working?");
    
    var findSelectedQuestionNum = function(qustion){
        if (qustion === "Which city did you born in?")
            return 1;
        else if (qustion === "What is the name of your pet?")
            return 2;
        else if (qustion === "What is your mother's phone number?")
            return 3;
        else if (qustion === "What was the name of your heighschool?")
            return 4;
        else if (qustion === "Where are you working?")
            return 5;
    } 
    // Check if username and password are correct and saeved in DB. If yes, user is logged in. 
    $scope.tryLogin = function(){
        var data =JSON.parse('{ "username": "'.concat($scope.usernameInput,'" ,"password": "',$scope.password,'"}')) 
        $http.post('http://localhost:3000/login', data).then(function successCallback(response){
            $rootScope.token=response.data;
            $rootScope.username = $scope.usernameInput;
            $rootScope.isLogedIn = true;
            $location.path('/')
            $window.sessionStorage.clear();
            $window.sessionStorage.setItem("username", $rootScope.username); 
            $window.sessionStorage.setItem("token",$rootScope.token); 

            //tal
            var req = {
                method: 'GET',
                url: 'http://localhost:3000/getSavedPOI',
                headers: {
                  'x-out-token': $rootScope.token
                }
            }   
            $http(req).then(function successCallback (response){
                $rootScope.savedPOIs = response.data;
                $window.sessionStorage.setItem("favoritePOIForSession", JSON.stringify( $rootScope.savedPOIs)); 
                $rootScope.favoritePOIsSize = $rootScope.savedPOIs.length;
                $rootScope.message ="";
            },function errorCallback (){
                $rootScope.savedPOIs = [];
                $window.sessionStorage.setItem("favoritePOIForSession", JSON.stringify( $rootScope.savedPOIs)); 
                $rootScope.favoritePOIsSize = $rootScope.savedPOIs.length; 
                $rootScope.message = "You haven't saved any favorite point of interest yet."          
            });
                //tal


        }, function errorCallback(response){
            $scope.loginMessage=response.data;
        });
    };

    // Return user varification questions in order to resore password
    $scope.getUsersVarQuestions = function(){
        $http.get('http://localhost:3000/getVerQuestions/'.concat($scope.usernameForPassRestore)).then(
            function successCallback(response){
                //$scope.varQuestions = response.data;
                $scope.varQuestions =  [arrQuestions[response.data[0].first_question_num-1], arrQuestions[response.data[0].second_question_num-1]];
                $scope.secondQuestionNum =  response.data[0].second_question_num;
            }, function errorCallback(response){
                $scope.varQuestions = response.data;
        });
    }

    // Check with the server if user answers are correct and return password.
    $scope.restorePassword = function(){
        var data =JSON.parse('{ "username": "'.concat($scope.usernameForPassRestore,
            '" ,"questionNum": "',findSelectedQuestionNum($scope.selectedVarQuestion),'" , "answer": "',$scope.answerForPassRestore,'"}'))
        $http.post('http://localhost:3000/restorePass', data).then(function successCallback(response){
            $scope.restoredPassword=response.data[0].password;
        }, function errorCallback(response){
            $scope.restoredPassword=response.data;
        });
    };

    // Change rootScop to login
    $scope.changeIsLogedIn = function(){
        $rootScope.isLogedIn = !$rootScope.isLogedIn;
        $rootScope.username = "";
        $rootScope.token=null;
        $window.sessionStorage.clear();

    }
        
});