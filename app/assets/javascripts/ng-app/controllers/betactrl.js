/*Controllers*/
app.controller('BetaCtrl', function ($scope, $timeout, $http, $filter, api) {
    var self = $scope;
    var promise;
    var pagenumber =1;
    
    self.pagetitle = "Movie Search: Find all the actors that worked in movies together";
    self.selectedMovies =[];
    self.selectedCast = [];
    self.comparedCast = [];
    
    self.compare = false;
    
    /*Search for Movie Matches*/
    self.getMatches = function(query) {
        $timeout.cancel(promise);
        
        promise = $timeout( function(){
            pagenumber = 1 ;
            self.results = "";
            if(query != ""){
                query = cleanQuery(query);
                $http.get(api.movie.searchname(query) )
                .then(function(response){
                    self.testapi = api.movie.searchname(query);
                    self.results = response.data;
                });
            }
        }, 1000, false);
    }
    /*Select Movie*/
    self.selectMovieMatch = function(movieitem) {
        self.selectedItem = movieitem;
        self.searchText = movieitem.title + " ( " + $filter('date')(movieitem.release_date, "MMM dd, yyyy") +" )";
    }
    /*Add Movie to List*/
    self.addMovie = function() {
        if(self.selectedMovies.length < 3 && self.selectedItem != null) {
            // Check Array if object is in list
            var found = false;
            for(var i = 0; i < self.selectedMovies.length; i++) {
                if (self.selectedMovies[i].id == self.selectedItem.id) {
                    found = true;
                    break;
                }
            }
            if(!found) 
                { self.selectedMovies.push(self.selectedItem); }
        }
    }
    
    /*Movie Actor Compare*/
    /*Compare Actors from each movie and create new list*/
    self.compareCasts = function() {
        getActors();
    }
    /*compare selected list of cast members*/
    self.getCompareCasts = function() {
        if(self.selectedMovies.length > 0){
            self.comparedCast.length = 0;
            for(var i = 0; i < self.selectedCast.length; i++) {
                for(var j=i+1; j < self.selectedCast.length; j++) {
                    self.comparedCast.push({ movie1:self.selectedCast[i].title, movie2:self.selectedCast[j].title, matchedCast:compareMovies(self.selectedCast[i], self.selectedCast[j]) });
                }
            }
        }
    }
    /*compare two objects*/
    var compareMovies = function(movieA, movieB) {
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
    var getActors = function() {
        if(self.selectedMovies.length > 0) {
            self.selectedCast.length = 0;
            for(var i=0; i< self.selectedMovies.length; i++){
                itemCast(i, self.selectedMovies[i].title);
            }
        }
    }
    
    /*get movie cast*/
    var itemCast = function(i, mtitle) {
        $http.get(api.movie.getMovieCredits(self.selectedMovies[i].id) )
            .then(function(response){
                self.selectedCast.push({ id: response.data.id, cast: response.data.cast, title: mtitle });
            }).finally(function() {
                if((i+1) == self.selectedMovies.length) {
                    self.getCompareCasts();
                }
            });
    }
    
    var cleanQuery = function(querystring){
        var tmpstring = querystring;
        tmpstring = tmpstring.replace("&", "and");
        
        return tmpstring;
    }
});