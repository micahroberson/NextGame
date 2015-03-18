angular.module('uaNextGame.controllers', [])

.controller('GamesController', function($scope, $location, $ionicViewService, $firebase) {
  var ref = new Firebase('https://ua-next-game.firebaseio.com/games/Arizona/'),
      sync = $firebase(ref);

  $scope.games = sync.$asArray();
  $scope.game = {};
  $scope.gametime = new moment();

  var nextGame = {},
      nextGameTime = null,
      prevGametime = null,
      today = new moment(),
      todayHasGame = false,
      timezoneOffset = (new Date).getTimezoneOffset();

  // today.zone(timezoneOffset);

  $scope.hasGameStarted = function() {
    if($scope.game && $scope.game.zonedGameTime) {
      new moment($scope.game.GameTime + '-0400').isBefore(today);
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

  // var notify = function(score) {
  //   if("Notification" in window) {
  //     if(Notification.permission !== 'granted' && Notification.permission !== 'denied') {
  //       Notification.requestPermission(function (permission) {
  //         if (!('permission' in Notification)) {
  //           Notification.permission = permission;
  //         }
  //       });
  //     }
  //     if (Notification.permission === 'granted') {
  //       var options = {
  //             body: "",
  //             icon: "icon.jpg",
  //             dir : "ltr"
  //         };
  //       var notification = new Notification("Hi there",options);
  //     }
  //   }
  // }

  $scope.games.$loaded().then(function() {
    var tempNextgame;
    _($scope.games).each(function(game) {
      var
        gameTime = new moment(game.GameTime + '-0400'),
        gameDay = new moment(game.GameTime + '-0400');

      if(gameDay.isSame(today, 'day')) {
        // Game is today
        tempNextgame = game;
        nextGameTime = gameTime;
        todayHasGame = true;
      } else if(!todayHasGame && gameTime.isAfter(today, 'day') && (!nextGameTime || gameTime.isBefore(nextGameTime))) {
        tempNextgame = game;
        nextGameTime = gameTime;
      }

      game.zonedGameTime = new moment(gameTime);
      game.zonedGameTime.zone(timezoneOffset);
      game.score = {AwayScore: '0', HomeScore: '0', $value: null};

      if(!gameDay.isSame(today, 'day') && !gameTime.isAfter(today, 'day')) {
        var gameRef = new Firebase('https://ua-next-game.firebaseio.com/Scores/' + game.$id),
            gameSync = $firebase(gameRef),
            gameSyncObject = gameSync.$asObject();

        gameSyncObject.$loaded().then(function() {
          game.score = gameSyncObject;
        });
      }
    });
    setNextGame(tempNextgame);
  });

  // syncObject.$watch(function(e) {
  //   var game = syncObject.$getRecord(e.key),
  //       gameTime = new moment(game.GameTime + '-0400'),
  //       gameDay = new moment(game.GameTime + '-0400');

  //   if(gameDay.isSame(today, 'day')) {
  //     // Game is today
  //     setNextGame(game);
  //     nextGameTime = gameTime;
  //     todayHasGame = true;
  //   } else if(!todayHasGame && gameTime.isAfter(today, 'day') && (!nextGameTime || gameTime.isBefore(nextGameTime))) {
  //     nextGameTime = gameTime;
  //     setNextGame(game);
  //   }

  //   game.zonedGameTime = new moment(gameTime);
  //   game.zonedGameTime.zone(timezoneOffset);
  //   game.score = {AwayScore: '0', HomeScore: '0'};

  //   // if(!gameDay.isSame(today, 'day') && !gameTime.isAfter(today, 'day')) {
  //   //   var gameRef = new Firebase('https://ua-next-game.firebaseio.com/Scores/' + game.$id),
  //   //       gameSync = $firebase(gameRef),
  //   //       gameSyncObject = gameSync.$asObject();

  //   //   gameSyncObject.$loaded().then(function() {
  //   //     game.score = gameSyncObject;
  //   //   });
  //   // }
  // });
  // syncObject.$bindTo($scope, 'games');
})