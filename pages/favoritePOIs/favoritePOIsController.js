// favoritePOIs controller
angular.module("myApp")
.controller("favoritePOIsController", function ($scope, $http, $rootScope, $window) {
    $rootScope.savedPoisNames=[];//array of all poi_names will store in DB 
    $rootScope.savesPoisRanks=[];//array of all poi ranks will store in DB 

   

     //check if user logedin
     if($window.sessionStorage.getItem("username") === null){
        $rootScope.isLogedIn=false;
    }
    else{
        $rootScope.savedPOIs=[];
        $rootScope.isLogedIn=true ;
        returnFromStorage = $window.sessionStorage.getItem("favoritePOIForSession"); //gets favoritePOI user choose in this session
        savedPOIForSession = JSON.parse(returnFromStorage);
        //$scope.test = savedPOIForSession
        temp=[];
        for(i=0;i<savedPOIForSession.length;i++){
            for(j=0;j<savedPOIForSession.length;j++){
                if(!savedPOIForSession[j].hasOwnProperty('poi_place')){
                    check=false;
                    for(k=0; k<temp.length; k++){
                        if (temp[k].poi_name===savedPOIForSession[j].poi_name)
                            check= true;
                    }
                    if(!check){
                        temp.push(savedPOIForSession[j]);
                        break;
                    }
                }
                if(savedPOIForSession[j].poi_place===i+1){
                    $rootScope.savedPOIs[i]=savedPOIForSession[j];
                    break;
                } 
            }
        }


        for(i=0;i<temp.length;i++){
            $rootScope.savedPOIs.push(temp[i]);
        }
        //$scope.test= $rootScope.savedPOIs;
        
        $rootScope.favoritePOIsSize = $rootScope.savedPOIs.length;
        for (i=0; i< $rootScope.savedPOIs.length; i++){
            $rootScope.savedPoisNames.push("".concat($rootScope.savedPOIs[i].poi_name,""))
            $rootScope.savesPoisRanks.push(i+1);
            
        }
    }
    
    //sort favorites pois by category
    $scope.sortByCategory=function(propertyName){
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
    };
    
    //sort favorites pois by rank
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
      };


    //remove site from favorites for the current session.
    $scope.removeFromFavorites=function(poiNameToRemove){
        // $window.sessionStorage.removeItem(poiNameToRemove);
        returnFromStorage =  $window.sessionStorage.getItem("favoritePOIForSession"); //gets favoritePOI user choose in this session
        savedPOIForSession = JSON.parse(returnFromStorage);
        for(i=0;i<savedPOIForSession.length;i++) { 
            if (savedPOIForSession[i].poi_name === poiNameToRemove) {
                savedPOIForSession.splice(i,1);
                $rootScope.savedPoisNames.splice(i,1);
                $rootScope.savesPoisRanks.splice(i,1);
                break;
            }
          }
        $window.sessionStorage.setItem("favoritePOIForSession", JSON.stringify(savedPOIForSession)); 
        $rootScope.favoritePOIsSize=$rootScope.favoritePOIsSize-1;
        $rootScope.savedPOIs=savedPOIForSession;
    };

    //check which icon to show- add icon or love icon
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
    
    //move site down in the favorite list
    $scope.moveDown= function(index){
        temp=$rootScope.savedPOIs[index+1];
        $rootScope.savedPOIs[index+1]=$rootScope.savedPOIs[index];
        $rootScope.savedPOIs[index]=temp;
        $window.sessionStorage.setItem("favoritePOIForSession", JSON.stringify($rootScope.savedPOIs)); 
        temp=$rootScope.savedPoisNames[index+1];
        $rootScope.savedPoisNames[index+1]=$rootScope.savedPoisNames[index];
        $rootScope.savedPoisNames[index]=temp;        
    }

        //move site up in the favorite list
    $scope.moveUp= function(index){
        temp=$rootScope.savedPOIs[index-1];
        $rootScope.savedPOIs[index-1]=$rootScope.savedPOIs[index];
        $rootScope.savedPOIs[index]=temp;
        $window.sessionStorage.setItem("favoritePOIForSession", JSON.stringify($rootScope.savedPOIs)); 
        temp=$rootScope.savedPoisNames[index-1];
        $rootScope.savedPoisNames[index-1]=$rootScope.savedPoisNames[index];
        $rootScope.savedPoisNames[index]=temp; 
    }

    

    //The modal
        // Get the modal
        var modal = document.getElementById("reviewModal");
        // Get the button that opens the modal
        var btn = document.getElementById("Mreview");
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];
        // When the user clicks the button, open the modal
        btn.onclick = function () {
            modal.style.display = "block";
        }
        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
            $scope.message=''
        }
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            var modal = document.getElementById("reviewModal");
            if (event.target === modal) {
                modal.style.display = "none";
                $scope.message=''
            }
        }
        window.addEventListener("keydown", function (event) {
            if (event.code == "Escape") {
                modal.style.display = "none";
                $scope.message=''
            }
        });

        $scope.ranks= new Array("1","2","3","4","5");

        $scope.addAReview = function(siteName){
            modal.style.display = "block";
            $scope.poiForReview=siteName;
        }

    $scope.saveReview = function(){
        if($scope.content===''){
            $scope.content="not for showing"
        }
        var req2 = {
            method: 'POST',
            url: 'http://localhost:3000/addNewReview',
            headers: {
              'x-out-token': $rootScope.token
            },
            data: { POIName: $scope.poiForReview,
                    rank: $scope.choosenRank,
                    content: $scope.content
                }
        } 
        $http(req2).then(function successCallback(response){
            $scope.message=response.data;
        }, function errorCallback(response){
            if (response.status === 404)
                $scope.message = response.data;
            else
                $scope.message="You must enter a rank."
        }); 
        $scope.content=''
        $scope.choosenRank=''
    }

    $scope.saveFavoriteList = function(){
        if ($rootScope.savedPoisNames.length === 0)
            dataJason =JSON.parse(JSON.stringify('{"POIs":'.concat('[', $rootScope.savedPoisNames.join('","') ,']',',"places":','[',$rootScope.savesPoisRanks.join(","),']','}')));
        else
            dataJason =JSON.parse(JSON.stringify('{"POIs":'.concat('[','"' , $rootScope.savedPoisNames.join('","') , '"',']',',"places":','[',$rootScope.savesPoisRanks.join(","),']','}')));

        $http({
            method: 'POST',
            url: 'http://localhost:3000/addSavedAndSortedPOIs',
            headers: {
                'x-out-token': $rootScope.token
            },
                data: dataJason
            }).then(function successCallback(response) {
                $window.alert(response.data);
          }, function errorCallback(response) {
            $window.alert(response.data);
          });
        
            

            
       
    }
});