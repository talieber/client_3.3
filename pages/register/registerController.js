// register controller

angular.module("myApp")

.controller("registerController", function ($scope,$http,$rootScope,$location) {

    //map of the verification questions
    $rootScope.questions=new Map();
    $rootScope.questions['1']="Which city did you born in?";
    $rootScope.questions['2']="What is the name of your pet?";
    $rootScope.questions['3']="What is your mother's phone number?";
    $rootScope.questions['4']="What was the name of your heighschool?";
    $rootScope.questions['5']="Where are you working?";

    $scope.arrQuestions= new Array("Which city did you born in?","What is the name of your pet?","What is your mother's phone number?","What was the name of your heighschool?","Where are you working?");
    $scope.fieldsOfInterest= new Array("Historic site","Attraction","Restaurant","Piazza");

    // Return countries from xml file
   $scope.getCountries = function() {
    $scope.countryList=new Array();

       $http.get('http://localhost:3000/getCountries').then(function(response){
        $scope.countryList=response.data;
        });

     }

     // Submit user if all fields are correct and correspond to the rules 
     $scope.submit = function(){
        firstQuestionNum=getKeyByValue($scope.firstSelectedQuestion);
        secondQuestionNum=getKeyByValue($scope.secondSelectedQuestion);
        dataJason =JSON.parse(JSON.stringify('{"username":"'.concat($scope.username,'","firstName":"',$scope.firstName,'","lastName":"',
        $scope.lastName,'", "city": "',$scope.city,'","country":"',$scope.countrySelection,'","email": "',
        $scope.email,'","interestsList": ["',$scope.firstFOI,'", "',$scope.secondFOI,'"],"firstQuestionNum": ',firstQuestionNum,',"firstAnswer": "',
        $scope.firstAns,'","secondQuestionNum": ',secondQuestionNum,',"secondAnswer": "',$scope.secondAns,'","pass": "',$scope.password,'"}')))

        $http.post('http://localhost:3000/addUser', dataJason).then(function successCallback(response){
        $location.path('/login')
      
        }, function errorCallback(response){
            $scope.re=response.data
        });  
    
    }

    getKeyByValue=function(givenValue){
        for(var key in $rootScope.questions) {
            if($rootScope.questions[key] === givenValue) {
                return key;
            }
        }
    }
});//controller

app.directive('validateNotEqual', [
	function() {
		return {
			restrict: 'AE',
			require: '^ngModel',
			link: function(scope, element, attributes, ngModelCtrl) {
				if (!ngModelCtrl) {
					return;
				}
				
				var errorKey = 'notEqual';
				
				ngModelCtrl.$validators[errorKey] = function(value) {
					return value !== attributes.validateNotEqual;
				};
				
				attributes.$observe('validateNotEqual', function(value) {
					ngModelCtrl.$setValidity(
						errorKey,
						value !== ngModelCtrl.$modelValue);
				});
			}
		};
	}
]);
       
        
    
       



              
   
