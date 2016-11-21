angular.module('starter', ['ionic', 'starter.controllers', 'chart.js', 'ionic-native-transitions'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('app', {
    url: '/app',
    templateUrl: 'templates/menu.html',
    abstract: true,
    controller: 'AppCtrl'
  })
  .state('app.details', {
    url: '/details',
    views: {
      'menuContent':{
        templateUrl:'templates/details.html',
        controller: 'DetailsCtrl'
      } 
    }
  })
  .state('login',{
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'

  })
  .state('app.main', {
    url: '/main',
    views: {
      'menuContent':{
        templateUrl:'templates/main.html',
        controller: 'MainCtrl'
      }
    }
  });

 var user_info = localStorage.getItem('loginInfo');
 var initial_route;
 
  if(user_info)
      initial_route = "/app/main";
  else
     initial_route = "/login";

  $urlRouterProvider.otherwise(initial_route);

});
