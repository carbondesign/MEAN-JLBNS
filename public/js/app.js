'use strict';


// Declare app level module which depends on filters, and services
angular.module('frisb', ['frisb.filters', 'frisb.services', 'frisb.directives', 'frisb.controllers']).
  config(['$routeProvider', function($routeProvider) {
  	$routeProvider.when('/', {templateUrl: 'partials/skills.html', controller: 'skills'});
    $routeProvider.when('/skills', {templateUrl: 'partials/skills.html', controller: 'skills'});
    $routeProvider.when('/users', {templateUrl: 'partials/users.html', controller: 'users'});
    $routeProvider.when('/team', {templateUrl: 'partials/team.html', controller: 'team'});
    $routeProvider.otherwise({redirectTo: '/s'});
  }]);
