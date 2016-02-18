app.controller('TvCtrl', function ($scope, $timeout, $http, $filter, api) {
    var self = $scope;
    var promise;
    
    self.pagetitle = "Tv Search: Find all the actors/actresses that worked in tv shows together";
    
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
                $http.get(api.tv.searchname(query) )
                .then(function(response){
                    self.results = response.data;
                    self.showItems = true;
                });
            }
        }, 1000, false);
    }
    
    /*Clean query for api of special characters*/
    var cleanQuery = function(querystring){
        var tmpstring = querystring;
        tmpstring = tmpstring.replace("&", "and");
        
        return tmpstring;
    }
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
    var objectItems = function(i, tname) {
        $http.get(api.tv.getTvCredits(self.selectedObjects[i].id) )
            .then(function(response){
                self.selectedItem.push({ id: response.data.id, cast: response.data.cast, name: tname });
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
                    self.comparedItem.push({ tvshow1:self.selectedItem[i].name, tvshow2:self.selectedItem[j].name, matchedCast:compareObjects(self.selectedItem[i], self.selectedItem[j]) });
                }
            }
            // Compare all 3 movies
            if(self.selectedItem.length == 3) {
                self.comparedItem.push({ tvshow1:self.selectedItem[0].name, tvshow2:self.selectedItem[1].name, tvshow3:self.selectedItem[2].name, matchedCast:compareAllObjects(self.selectedItem[0], self.selectedItem[1], self.selectedItem[2]) });
            }
            self.cmpresults.colspan = 8 / (self.comparedItem.length);
        }
    }
    
    /*compare two objects*/
    var compareObjects = function(tvshowA, tvshowB) {
        var tmpCast = [];
        for(var i = 0; i < tvshowA.cast.length; i++) {
            for(var j=0; j < tvshowB.cast.length; j++) {
               if(tvshowA.cast[i].id == tvshowB.cast[j].id){
                    tmpCast.push({id: tvshowA.cast[i].id, name: tvshowA.cast[i].name, poster_path: tvshowA.cast[i].poster_path });
                    break;
               }
            }
        }
        return tmpCast;
    }
    /*compare all 3 objects*/
    var compareAllObjects = function(tvshowA, tvshowB, tvshowC) { 
        var tmpCast = [];
        for(var i = 0; i < tvshowA.cast.length; i++) {
            for(var j=0; j < tvshowB.cast.length; j++) {
                for(var k=0; k < tvshowC.cast.length; k++) {
                   if((tvshowA.cast[i].id == tvshowB.cast[j].id) && (tvshowB.cast[j].id == tvshowC.cast[k].id)){
                        tmpCast.push({id: tvshowA.cast[i].id, title: tvshowA.cast[i].title, poster_path: tvshowA.cast[i].poster_path });
                        break;
                   }
                }
            }
        }
        return tmpCast;
    }
    
     /*Add Tv show to List*/
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
    /*Remove Tv Show from List*/
    self.removeObject = function(item) {
        for(var i = 0; i < self.selectedObjects.length; i++) {
            if (self.selectedObjects[i].id == item.id) {
                self.selectedObjects.splice(i, 1);
                break;
            }
        }
    }
});