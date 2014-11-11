angular.module('uaNextGame.controllers', [])

.controller('GamesController', function($scope, $location, $ionicViewService, $firebase) {
  var ref = new Firebase('https://ua-next-game.firebaseio.com/games/Arizona/');

  var sync = $firebase(ref);
  var syncObject = sync.$asArray();

  $scope.games = sync.$asArray();
  $scope.game = {score: '0 - 0'};
  $scope.gametime = new Date();

  var nextGame = {},
      nextGameTime = null,
      prevGametime = null,
      today = new Date(),
      todayHasGame = false;
  today.setHours(0,0,0,0);

  syncObject.$watch(function() {
    _(syncObject).each(function(game, key) {
      var gameTime = new Date(game.gametime),
          gameDay = new Date(game.gametime);
      gameDay.setHours(0,0,0,0);

      if(gameDay.getTime() === today.getTime()) {
        // Game is today
        nextGame = game;
        nextGameTime = gameTime;
        todayHasGame = true;
      } else if(!todayHasGame && (!nextGameTime || gameTime.getTime() < nextGameTime.getTime())) {
        nextGameTime = gameTime;
        nextGame = game;
      }
    });

    $scope.game = nextGame;
    if(!prevGametime || prevGametime.getTime() !== nextGameTime.getTime()) {
      $scope.gametime = nextGameTime;
    }
  });
  // syncObject.$bindTo($scope, 'games');
})