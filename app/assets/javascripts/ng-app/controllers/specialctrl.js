app.controller('SpecialCtrl', function ($scope, $timeout, $http, $filter, api) {
    var self = $scope;
    var promise;
    
    self.pagetitle = "Special Box";
    self.specialId = 146304;
    
    self.comparedItem = [];
    self.castWork = [];
    
    self.compare = false;
    self.showItems = false;
    self.showInfo = false;
   
   
   /* Get Movie Info*/
    self.getObjectInfo = function() {
        $timeout.cancel(promise);
        promise = $timeout( function(){
            if(self.specialId != ""){
                $http.get(api.movie.getMovieInfo(self.specialId) )
                .then(function(response){
                    self.movieinfo = response.data;
                    self.showInfo = true;
                });
            }
        }, 1000, false);
    }
    /* Get Movie Cast*/
    self.getObjectItems = function() {
        $http.get(api.movie.getMovieCredits(self.specialId) )
            .then(function(response){
                self.selectedItem = response.data;
                self.showItems = true;
            }).finally(function() {
                self.compareItems();
            });
    }
    
    /* Check cast member similar movies*/
    self.compareItems = function() {
        getItems();
    }
    /*Get Movies for each actor selected*/
    var getItems = function() {
        if(self.selectedItem.cast.length > 0) {
            for(var i=0; i< self.selectedItem.cast.length; i++){
                objectItems(i, self.selectedItem.cast[i].name);
            }
        }
    }
    
    /*Get movie cast for actor based on id from selected Objects list*/
    var objectItems = function(i, cname) {
        $http.get(api.cast.getCastCredits(self.selectedItem.cast[i].id) )
            .then(function(response){
                self.castWork.push({ id: response.data.id, cast: response.data.cast, name: cname });
            }).finally(function() {
                if((i+1) == self.selectedItem.cast.length) {
                    self.getCompareItems();
                }
            });
    }
    
    /*compare selected list of movies members*/
    self.getCompareItems = function() {
        if(self.selectedItem.cast.length > 0){
            self.comparedItem.length = 0;
            for(var i = 0; i < self.castWork.length; i++) {
                for(var j=i+1; j < self.castWork.length; j++) {
                    self.comparedItem.push({ cast1:self.castWork[i].name, cast2:self.castWork[j].name, matchedCast:compareObjects(self.castWork[i], self.castWork[j]) });
                    console.log(" [] 1} " + self.castWork[i].name + " 2}" + self.castWork[j].name);
                }
            }
        }
    }
    
    /*compare two objects*/
    var compareObjects = function(castA, castB) {
        var tmpCast = [];
        for(var i = 0; i < castA.cast.length; i++) {
            for(var j=0; j < castB.cast.length; j++) {
               if(castA.cast[i].id == castB.cast[j].id){
                    tmpCast.push({id: castA.cast[i].id, title: castA.cast[i].title, profile_path: castA.cast[i].profile_path });
                    console.log("1} " + castA.name + " 2}" + castB.name + " : " + castA.cast[i].title);
                    break;
               }
            }
        }
        return tmpCast;
    }
    
    /* Run all info getters*/
    self.getObject = function() {
       self.getObjectInfo();
       self.getObjectItems();
    }()  
    
});