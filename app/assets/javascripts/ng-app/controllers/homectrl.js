/*Controllers*/
app.controller('HomeCtrl', function ($scope, $timeout, $http, $filter, api) {
    var self = $scope;
    var promise;
    
    self.selectedCard="";
    self.cards = [
            {order: '2', row: '1', col:'3', title:'Cast', controller:'', type:'cast', cardclass:'c2' },
            {order: '1', row: '1', col:'3', title:'Movie', controller:'MovieCtrl', type:'movie', cardclass:'c1' },
            {order: '3', row: '1', col:'3', title:'Tv', controller:'', type:'tv', cardclass:'c3' },
            {order: '4', row: '1', col:'3', title:'Special', controller:'SpecialCtrl', type:'special', cardclass:'c4' }
        ];
    
    self.toggleCard = function(card) {
        if(card.col < '6'){
            self.selectedCard = card.title;
            // Change other cards
            var tmpOrder= card.order;
            for(var i=0; i< self.cards.length;i++) {
                if(card.order != 1 && self.cards[i].order == 1){
                    self.cards[i].order = tmpOrder;
                }
                if(self.cards[i].title != card.title) {
                    self.cards[i].col = '2';
                    self.cards[i].row = '1';
                }
            }
            // Set selected card
            card.order = '1';
            card.col = '6';
            card.row = '3';
        }
        else {
            self.selectedCard = "";
            for(var i=0; i< self.cards.length;i++) {
                    self.cards[i].col = '3';
                    self.cards[i].row = '1';
            }
        }
    }
    
});