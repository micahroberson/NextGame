angular.module('uaNextGame.controllers', [])

.controller('GamesController', function($scope, $location, $ionicViewService, $firebase) {
  var ref = new Firebase('https://ua-next-game.firebaseio.com/games/Arizona/');

  var sync = $firebase(ref);
  var syncObject = sync.$asArray();

  $scope.games = sync.$asArray();
  $scope.game = {score: '0 - 0'};
  $scope.gametime = new moment();

  var nextGame = {},
      nextGameTime = null,
      prevGametime = null,
      today = new moment(),
      todayHasGame = false;

  syncObject.$watch(function(e) {
    var game = syncObject.$getRecord(e.key),
        gameTime = new moment(game.gametime + '-0500'),
        gameDay = new moment(game.gametime + '-0500');

    if(gameDay.isSame(today, 'day')) {
      // Game is today
      $scope.game = nextGame = game;
      nextGameTime = gameTime;
      todayHasGame = true;
    } else if(!todayHasGame && (!nextGameTime || gameTime.isBefore(nextGameTime))) {
      nextGameTime = gameTime;
      $scope.game = nextGame = game;
    }

    game.zonedGameTime = new moment(gameTime);
    game.zonedGameTime.zone(new Date().getTimezoneOffset());
  });
  // syncObject.$bindTo($scope, 'games');
})