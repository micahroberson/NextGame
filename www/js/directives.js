angular.module('uaNextGame.directives', [])

.directive('nextGame', function($rootScope) {
  return {
    restrict: 'E',
    replace: false,
    scope: true,
    templateUrl: "templates/current-game.html"
  }
})

.directive('schedule', function($rootScope) {
  return {
    restrict: 'E',
    replace: false,
    scope: true,
    templateUrl: "templates/schedule.html"
  }
})

.directive('score', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: "templates/score.html",
    link: function(scope, element, attrs) {
      scope.$watch('game.score', function() {
        var scores = scope.game.score.split('-');
        scope.homeScore = scores[0];
        scope.awayScore = scores[1];
      });
    }
  }
});