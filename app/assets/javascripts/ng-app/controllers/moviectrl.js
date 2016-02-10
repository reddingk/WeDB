/*Controllers*/
app.controller('MovieCtrl', function ($scope, $timeout, $http, $filter, api) {
    var self = $scope;
    var promise;
    
    self.pagetitle = "Movie Search: Find all the actors that worked in movies together";
    self.selectedObjects =[];
    self.selectedItem = [];
    self.comparedItem = [];
    
    self.compare = false;
    self.showItems = false;
    self.showInfo = false;
    
    self.cmpresults = { rowspan: '1', colspan:'2' };
    
    /*Search for Movie Matches*/
    self.getMatches = function(query) {
        $timeout.cancel(promise);
        
        promise = $timeout( function(){
            self.results = "";
            if(query != ""){
                query = cleanQuery(query);
                $http.get(api.movie.searchname(query) )
                .then(function(response){
                    self.results = response.data;
                    self.showItems = true;
                });
            }
        }, 1000, false);
    }
    /*Search for Movie Matches by page number */
    self.getMatchesByPage = function(query, page) {
        $timeout.cancel(promise);
        
        promise = $timeout( function(){
            self.results = "";
            if(query != ""){
                query = cleanQuery(query);
                $http.get(api.movie.searchName_Page(query, page) )
                .then(function(response){
                    self.results = response.data;
                    self.showItems = true;
                });
            }
        }, 1000, false);
    }
    
    /*Select Movie*/
    self.selectObjectMatch = function(movieitem) {
        self.selected_Object = movieitem;
        self.searchText = movieitem.title + " ( " + $filter('date')(movieitem.release_date, "MMM dd, yyyy") +" )";
    }
    /*Get Movie Info*/
    self.getObjectInfo = function(movieid) {
        $timeout.cancel(promise);
        promise = $timeout( function(){
            if(movieid != ""){
                $http.get(api.movie.getMovieInfo(movieid) )
                .then(function(response){
                    self.movieinfo = response.data;
                    self.showInfo = true;
                });
            }
        }, 1000, false);
    }
    /*Add Selected Movie to List*/
    self.addSelectedObject = function() {
        self.showItems = false;
        if(self.selectedObjects.length < 3 && self.selected_Object != null) {
            // Check Array if object is in list
            var found = false;
            for(var i = 0; i < self.selectedObjects.length; i++) {
                if (self.selectedObjects[i].id == self.selected_Object.id) {
                    found = true;
                    break;
                }
            }
            if(!found) 
                { self.selectedObjects.push(self.selected_Object); }
        }
    }
    
    /*Add Movie to List*/
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
    /*Remove Movie from List*/
    self.removeObject = function(item) {
        for(var i = 0; i < self.selectedObjects.length; i++) {
            if (self.selectedObjects[i].id == item.id) {
                self.selectedObjects.splice(i, 1);
                break;
            }
        }
    }
    
    /*Movie Actor Compare*/
    /*Compare Actors from each movie and create new list*/
    self.compareItems = function() {
        getItems();
    }
    
    /*compare selected list of cast members*/
    self.getCompareItems = function() {
        if(self.selectedObjects.length > 0){
            self.comparedItem.length = 0;
            for(var i = 0; i < self.selectedItem.length; i++) {
                for(var j=i+1; j < self.selectedItem.length; j++) {
                    self.comparedItem.push({ movie1:self.selectedItem[i].title, movie2:self.selectedItem[j].title, matchedCast:compareObjects(self.selectedItem[i], self.selectedItem[j]) });
                }
            }
            // Compare all 3 movies
            if(self.selectedItem.length == 3) {
                self.comparedItem.push({ movie1:self.selectedItem[0].title, movie2:self.selectedItem[1].title, movie3:self.selectedItem[2].title,matchedCast:compareAllObjects(self.selectedItem[0], self.selectedItem[1], self.selectedItem[2]) });
            }
            self.cmpresults.colspan = 8 / (self.comparedItem.length);
        }
    }
    
    /*compare two objects*/
    var compareObjects = function(movieA, movieB) {
        var tmpCast = [];
        for(var i = 0; i < movieA.cast.length; i++) {
            for(var j=0; j < movieB.cast.length; j++) {
               if(movieA.cast[i].id == movieB.cast[j].id){
                    tmpCast.push({id: movieA.cast[i].id, name: movieA.cast[i].name, profile_path: movieA.cast[i].profile_path });
                    break;
               }
            }
        }
        return tmpCast;
    }
    var compareAllObjects = function(movieA, movieB, movieC) { 
        var tmpCast = [];
        for(var i = 0; i < movieA.cast.length; i++) {
            for(var j=0; j < movieB.cast.length; j++) {
                for(var k=0; k < movieC.cast.length; k++) {
                   if((movieA.cast[i].id == movieB.cast[j].id) && (movieB.cast[j].id == movieC.cast[k].id)){
                        tmpCast.push({id: movieA.cast[i].id, name: movieA.cast[i].name, profile_path: movieA.cast[i].profile_path });
                        break;
                   }
                }
            }
        }
        return tmpCast;
    }
    
    /*Get Actors for each movie selected*/
    var getItems = function() {
        if(self.selectedObjects.length > 0) {
            self.selectedItem.length = 0;
            for(var i=0; i< self.selectedObjects.length; i++){
                objectItems(i, self.selectedObjects[i].title);
            }
        }
    }
    
    /*Get movie cast for movie based on id from selected Objects list*/
    var objectItems = function(i, mtitle) {
        $http.get(api.movie.getMovieCredits(self.selectedObjects[i].id) )
            .then(function(response){
                self.selectedItem.push({ id: response.data.id, cast: response.data.cast, title: mtitle });
            }).finally(function() {
                if((i+1) == self.selectedObjects.length) {
                    self.getCompareItems();
                }
            });
    }
    
    /*Clean query for api of special characters*/
    var cleanQuery = function(querystring){
        var tmpstring = querystring;
        tmpstring = tmpstring.replace("&", "and");
        
        return tmpstring;
    }
    
});