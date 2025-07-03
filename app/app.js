var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'app/views/login.html',
            controller: 'LoginController'
        })
        .when('/register', {
            templateUrl: 'app/views/register.html',
            controller: 'RegisterController'
        })

        .when('/todo', {
            templateUrl: 'app/views/todo.html',
            controller: 'TodoController'
        })
        .when('/checklist/:id', {
            templateUrl: 'app/views/checklist-detail.html',
            controller: 'ChecklistDetailController'
        })
        .otherwise({
            redirectTo: '/login'
        });
});
