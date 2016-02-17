app.factory('api', function(){
    var baseurl = "https://api.themoviedb.org/3/";
    var apikey = "8af02f398b3ff990bab4f71c247c640a";
    
    return {
        movie: {
            searchname: function(query){
                return baseurl + "search/movie?api_key="+apikey+"&query="+query;
            },
            searchName_Page: function(query, page){
                return baseurl + "search/movie?api_key="+apikey+"&page="+ page +"&query="+query;
            },
            getMovieCredits: function(id) {
                return baseurl + "movie/"+id+"/credits?api_key="+apikey;
            },
            getMovieInfo: function(id) {
                return baseurl + "movie/"+id+"?api_key="+apikey;
            }
        },
        cast : {
            searchname: function(query) {
                return  baseurl + "search/person?api_key="+apikey+"&query="+query;
            },
            searchName_Page: function(query, page){
                return baseurl + "search/person?api_key="+apikey+"&page="+ page +"&query="+query;
            },
            getCastCredits: function(id) {
                return baseurl + "person/"+id+"/movie_credits?api_key="+apikey;
            }
        }
    }
});