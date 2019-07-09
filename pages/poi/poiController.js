// poi controller

angular.module("myApp")
.controller("poiController", function ($scope, $http, $rootScope ,$window) {
    self = this;
    $scope.propertyName = 'rank';
    $scope.reverse = true;
    savedPOIForSession=[];
    
     //check if user logedin
     if($window.sessionStorage.getItem("username") === null){
        $rootScope.isLogedIn=false;
    }
    else{
        $rootScope.isLogedIn=true ;
        returnFromStorage = $window.sessionStorage.getItem("favoritePOIForSession"); //gets favoritePOI user choose in this session
        savedPOIForSession = JSON.parse(returnFromStorage);
        $rootScope.favoritePOIsSize = savedPOIForSession.length;
        $scope.direction="up-down"
    }

    $http.get('http://localhost:3000/getAllPoi').then(function(response){
        $rootScope.allPoisToShow=response.data;
        $rootScope.allPois=response.data;
    });
    

    $scope.clear=function(){
        $http.get('http://localhost:3000/getAllPoi').then(function(response){
            $rootScope.allPoisToShow=response.data;
            $scope.allPois=response.data;

        });  
    }

    // Category list
    $scope.categories= new Array("Historic site","Attraction","Restaurant","Piazza");
    
    $scope.isCategorySelected = false
    
    // Shows poi of selected category 
    $scope.select=function(){
        selectedPOI=[];

        for(i=0;i<$scope.allPois.length;i++) { 
            if ($scope.allPois[i].category === $scope.choosenCategory) {
                selectedPOI.push($scope.allPois[i])
            }
          }
        $rootScope.allPoisToShow=selectedPOI;

    }
    // Search poi_name. Return any result that includes the given substring 
    $scope.searchPOI=function(){
        selectedPOI2=[];
        for(i=0;i<$scope.allPois.length;i++) { 
            if ($scope.allPois[i].poi_name.toLowerCase().includes($scope.poiToSearch.toLowerCase())){
                selectedPOI2.push($scope.allPois[i])
            }
          }
        if(selectedPOI2.length===0){
            $window.alert("No results were found");

        }
        else $rootScope.allPoisToShow=selectedPOI2;
        
    }


    //Sort pois by rank
    $scope.sortBy = function(propertyName) {
      $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
      $scope.propertyName = propertyName;
      if($scope.direction==="down-up")
            $scope.direction="up-down"
        else $scope.direction="down-up"
    };

    //Add site to favorite list in the current session
    $scope.addToFavorites=function(poiNameToAdd) {
        // $window.sessionStorage.setItem(poiNameToAdd,"true");
        siteToAdd=findObject(poiNameToAdd);
        savedPOIForSession.push(siteToAdd); //add new favorite poi to session
        $window.sessionStorage.setItem("favoritePOIForSession", JSON.stringify(savedPOIForSession)); 
        $rootScope.favoritePOIsSize=$rootScope.favoritePOIsSize+1;

    };

    // Remove site to favorite list in the current session
    $scope.removeFromFavorites=function(poiNameToRemove){
        // $window.sessionStorage.removeItem(poiNameToRemove);
        returnFromStorage = $window.sessionStorage.getItem("favoritePOIForSession"); //gets favoritePOI user choose in this session
        savedPOIForSession = JSON.parse(returnFromStorage);
        for(i=0;i<savedPOIForSession.length;i++) { 
            if (savedPOIForSession[i].poi_name === poiNameToRemove) {
                savedPOIForSession.splice(i,1);
                break;
            }
          }
        $window.sessionStorage.setItem("favoritePOIForSession", JSON.stringify(savedPOIForSession)); 
        $rootScope.favoritePOIsSize=$rootScope.favoritePOIsSize-1;
    };

    // Return the record of the given poi_name
    findObject=function(poiToFind){
        for(i=0;i<$rootScope.allPoisToShow.length;i++) { 
            if ($rootScope.allPoisToShow[i].poi_name === poiToFind) {
                return $rootScope.allPoisToShow[i]
            }
          }

    };

    // Checks which icon to show- add to favorite icon or love icon
    $scope.toHide=function(poiNameToCheck){
        checkIfExist=false;
        returnFromStorage =  $window.sessionStorage.getItem("favoritePOIForSession"); //gets favoritePOI user choose in this session
        savedPOIForSession = JSON.parse(returnFromStorage);
        for(i=0;i<savedPOIForSession.length;i++){
            if(savedPOIForSession[i].poi_name===poiNameToCheck)
                checkIfExist=true;
        }

        if(checkIfExist)
            return true;
        else return false;

    };

});