// selectedPOI controller

angular.module("myApp")

.controller("selectedPOIController", function ($scope, $http, $window, $rootScope) {

    var currentPOI = window.location.href.substr(window.location.href.lastIndexOf('/') + 1)

    $scope.isHiddingFirstReview=true;
    $scope.isHiddingSecondReview=true;
    savedPOIForSession=[];
    poiDeatils=null;
    allPoisToShow=[];

     //check if user logedin
     if($window.sessionStorage.getItem("username") === null){
        $rootScope.isLogedIn=false;
    }
    else{
        $rootScope.isLogedIn=true ;
        returnFromStorage = $window.sessionStorage.getItem("favoritePOIForSession"); //gets favoritePOI user choose in this session
        savedPOIForSession = JSON.parse(returnFromStorage);
        $rootScope.favoritePOIsSize = savedPOIForSession.length;

    }

    // Get poi datails from the server
    $http.get('http://localhost:3000/getPOIDetails/'.concat(currentPOI)).then(function(response){
        // poiDeatils=response.data;
        var POIDetailsAsArray = response.data.split(', ')
        $scope.poi_name=POIDetailsAsArray[0]
        $scope.description=POIDetailsAsArray[1]
        $scope.views_number=POIDetailsAsArray[2]
        $scope.category=POIDetailsAsArray[3]
        $scope.avg_rank=((parseFloat(POIDetailsAsArray[4])*20)).toFixed(2).toString().concat('%')
        $scope.link_to_picture=POIDetailsAsArray[7]
        if (POIDetailsAsArray[5]!=="null" && POIDetailsAsArray[5]!=="not for showing"){
            $scope.isHiddingFirstReview=false;
            $scope.first_review_date='('.concat(POIDetailsAsArray[6].split(' ')[1], ' ',POIDetailsAsArray[6].split(' ')[2], ' ', POIDetailsAsArray[6].split(' ')[3], ' ', POIDetailsAsArray[6].split(' ')[4],')')
            $scope.first_review=POIDetailsAsArray[5]
        }
        if (POIDetailsAsArray.length > 8)
            $scope.link_to_picture=POIDetailsAsArray[9]
        if(POIDetailsAsArray.length > 8 && (POIDetailsAsArray[7]!=="null" && POIDetailsAsArray[7]!=="not for showing")){
            $scope.isHiddingSecondReview=false;
            $scope.second_review_date='('.concat(POIDetailsAsArray[8].split(' ')[1], ' ',POIDetailsAsArray[8].split(' ')[2], ' ', POIDetailsAsArray[8].split(' ')[3], ' ', POIDetailsAsArray[8].split(' ')[4],')')
            $scope.second_review=POIDetailsAsArray[7]
            // $scope.link_to_picture=POIDetailsAsArray[9]
        }  
    });

    $http.get('http://localhost:3000/getAllPoi').then(function(response){
       allPoisToShow=response.data;
    });

    $scope.addToFavorites=function() {
        $window.sessionStorage.setItem(currentPOI,"true");
        foundedPOI=findObject(currentPOI)
        savedPOIForSession.push(foundedPOI); //add new favorite poi to session
        $window.sessionStorage.setItem("favoritePOIForSession", JSON.stringify(savedPOIForSession)); 
        $rootScope.favoritePOIsSize=$rootScope.favoritePOIsSize+1;

    };

    // Remove site to favorite list in the current session
    $scope.removeFromFavorites=function(){
        $window.sessionStorage.removeItem(currentPOI);
        returnFromStorage =  $window.sessionStorage.getItem("favoritePOIForSession"); //gets favoritePOI user choose in this session
        savedPOIForSession = JSON.parse(returnFromStorage);
        for(i=0;i<savedPOIForSession.length;i++) { 
            if (savedPOIForSession[i].poi_name === currentPOI) {
                savedPOIForSession.splice(i,1);
                break;
            }
          }
        $window.sessionStorage.setItem("favoritePOIForSession", JSON.stringify(savedPOIForSession)); 
        $rootScope.favoritePOIsSize=$rootScope.favoritePOIsSize-1;
    };


    // Checks which icon to show- add to favorite icon or love icon
    $scope.toHide=function(){
        checkIfExist=false;
        returnFromStorage =  $window.sessionStorage.getItem("favoritePOIForSession"); //gets favoritePOI user choose in this session
        savedPOIForSession = JSON.parse(returnFromStorage);
        for(i=0;i<savedPOIForSession.length;i++){
            if(savedPOIForSession[i].poi_name===currentPOI)
                checkIfExist=true;
        }
        if(checkIfExist || $window.sessionStorage.getItem(currentPOI)!==null)
            return true;
        else return false;
    };

    findObject=function(poiToFind){
        for(i=0;i<allPoisToShow.length;i++) { 
            if (allPoisToShow[i].poi_name === poiToFind) {
                return allPoisToShow[i]
            }
          }

    };


});//controller
       
        
    
       



              
   
