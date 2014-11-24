angular.module('uaNextGame.controllers', [])

.controller('GamesController', function($scope, $location, $ionicViewService, $firebase) {
  var ref = new Firebase('https://ua-next-game.firebaseio.com/games/Arizona/'),
      sync = $firebase(ref),
      syncObject = sync.$asArray();

  $scope.games = sync.$asArray();
  $scope.game = {};
  $scope.gametime = new moment();
  $scope.score = '0 - 0';

  var nextGame = {},
      nextGameTime = null,
      prevGametime = null,
      today = new moment(),
      todayHasGame = false,
      timezoneOffset = (new Date).getTimezoneOffset();

  // today.zone(timezoneOffset);

  $scope.hasGameStarted = function() {
    if($scope.game && $scope.game.zonedGameTime) {
      new moment($scope.game.GameTime + '-0500').isBefore(today);
    } else {
      false
    }
  };

  var setNextGame = function(game) {
    $scope.game = nextGame = game;
    var nextGameRef = new Firebase('https://ua-next-game.firebaseio.com/Scores/' + game.$id),
        nextGameSync = $firebase(nextGameRef),
        nextGameSyncObject = nextGameSync.$asObject();
    nextGameSyncObject.$bindTo($scope, 'score');
  };

  syncObject.$watch(function(e) {
    var game = syncObject.$getRecord(e.key),
        gameTime = new moment(game.GameTime + '-0500'),
        gameDay = new moment(game.GameTime + '-0500');

    if(gameDay.isSame(today, 'day')) {
      // Game is today
      setNextGame(game);
      nextGameTime = gameTime;
      todayHasGame = true;
    } else if(!todayHasGame && gameTime.isAfter(today, 'day') && (!nextGameTime || gameTime.isBefore(nextGameTime))) {
      nextGameTime = gameTime;
      setNextGame(game);
    }

    game.zonedGameTime = new moment(gameTime);
    game.zonedGameTime.zone(timezoneOffset);
    game.score = {AwayScore: '0', HomeScore: '0'};

    var gameRef = new Firebase('https://ua-next-game.firebaseio.com/Scores/' + game.$id),
        gameSync = $firebase(gameRef),
        gameSyncObject = gameSync.$asObject();

    gameSyncObject.$loaded().then(function() {
      game.score = gameSyncObject;
    });
  });
  // syncObject.$bindTo($scope, 'games');
})