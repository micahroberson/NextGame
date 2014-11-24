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
    templateUrl: "templates/score.html"
  }
})

.directive('gametime', function($rootScope) {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    templateUrl: "templates/gametime.html"
  }
});