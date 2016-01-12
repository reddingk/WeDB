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
    
    /*Select Movie*/
    self.selectObjectMatch = function(movieitem) {
        self.selected_Object = movieitem;
        self.searchText = movieitem.title + " ( " + $filter('date')(movieitem.release_date, "MMM dd, yyyy") +" )";
    }
    
    /*Add Movie to List*/
    self.addObject = function() {
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