app.controller('CastCtrl', function ($scope, $timeout, $http, $filter, api) {
    var self = $scope;
    var promise;
    
    self.pagetitle = "Cast Search: Find all the movies that actors/actresses worked in together";
    
    self.selectedObjects =[];
    self.selectedItem = [];
    self.comparedItem = [];
    
    self.compare = false;
    self.showItems = false;
    self.showInfo = false;
    
    self.cmpresults = { rowspan: '1', colspan:'2' };
    
    /*Search for Cast Matches*/
    self.getMatches = function(query) {
        $timeout.cancel(promise);
        
        promise = $timeout( function(){
            self.results = "";
            if(query != ""){
                query = cleanQuery(query);
                $http.get(api.cast.searchname(query) )
                .then(function(response){
                    self.results = response.data;
                    self.showItems = true;
                });
            }
        }, 1000, false);
    }
    
     /*Add Cast to List*/
    self.addObject = function(item) {
        self.showItems = false;
        if(self.selectedObjects.length < 3 && item != null) {
            // Check Array if object is in list
            var found = false;
            for(var i = 0; i < self.selectedObjects.length; i++) {
                if (self.selectedObjects[i].id == item.id) {
                    found = true;
                    break;
                }
            }
            if(!found) { 
                self.selectedObjects.push(item);
                self.searchText = "";
            }
        }
    }
    /*Remove Cast from List*/
    self.removeObject = function(item) {
        for(var i = 0; i < self.selectedObjects.length; i++) {
            if (self.selectedObjects[i].id == item.id) {
                self.selectedObjects.splice(i, 1);
                break;
            }
        }
    }
    
    /*Clean query for api of special characters*/
    var cleanQuery = function(querystring){
        var tmpstring = querystring;
        tmpstring = tmpstring.replace("&", "and");
        
        return tmpstring;
    }
    
    /*Actor Movie Compare*/
    /*Compare Actors from each movie and create new list*/
    self.compareItems = function() {
        getItems();
    }
    
    /*Get Movies for each actor selected*/
    var getItems = function() {
        if(self.selectedObjects.length > 0) {
            self.selectedItem.length = 0;
            for(var i=0; i< self.selectedObjects.length; i++){
                objectItems(i, self.selectedObjects[i].name);
            }
        }
    }
    
    /*Get movie cast for actor based on id from selected Objects list*/
    var objectItems = function(i, cname) {
        $http.get(api.cast.getCastCredits(self.selectedObjects[i].id) )
            .then(function(response){
                self.selectedItem.push({ id: response.data.id, cast: response.data.cast, name: cname });
            }).finally(function() {
                if((i+1) == self.selectedObjects.length) {
                    self.getCompareItems();
                }
            });
    }
    
    /*compare selected list of movies members*/
    self.getCompareItems = function() {
        if(self.selectedObjects.length > 0){
            self.comparedItem.length = 0;
            for(var i = 0; i < self.selectedItem.length; i++) {
                for(var j=i+1; j < self.selectedItem.length; j++) {
                    self.comparedItem.push({ cast1:self.selectedItem[i].name, cast2:self.selectedItem[j].name, matchedCast:compareObjects(self.selectedItem[i], self.selectedItem[j]) });
                }
            }
            // Compare all 3 movies
            if(self.selectedItem.length == 3) {
                self.comparedItem.push({ cast1:self.selectedItem[0].name, cast2:self.selectedItem[1].name, cast3:self.selectedItem[2].name, matchedCast:compareAllObjects(self.selectedItem[0], self.selectedItem[1], self.selectedItem[2]) });
            }
            self.cmpresults.colspan = 8 / (self.comparedItem.length);
        }
    }
    
    /*compare two objects*/
    var compareObjects = function(castA, castB) {
        var tmpCast = [];
        for(var i = 0; i < castA.cast.length; i++) {
            for(var j=0; j < castB.cast.length; j++) {
               if(castA.cast[i].id == castB.cast[j].id){
                    tmpCast.push({id: castA.cast[i].id, title: castA.cast[i].title, poster_path: castA.cast[i].poster_path });
                    console.log("1} " + castA.name + " 2}" + castB.name + " : " + castA.cast[i].title)
                    break;
               }
            }
        }
        return tmpCast;
    }
    /*compare all 3 objects*/
    var compareAllObjects = function(castA, castB, castC) { 
        var tmpCast = [];
        for(var i = 0; i < castA.cast.length; i++) {
            for(var j=0; j < castB.cast.length; j++) {
                for(var k=0; k < castC.cast.length; k++) {
                   if((castA.cast[i].id == castB.cast[j].id) && (castB.cast[j].id == castC.cast[k].id)){
                        tmpCast.push({id: castA.cast[i].id, title: castA.cast[i].title, profile_path: castA.cast[i].poster_path });
                        break;
                   }
                }
            }
        }
        return tmpCast;
    }
    
});