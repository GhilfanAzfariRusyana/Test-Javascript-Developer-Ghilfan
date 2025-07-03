app.controller('RegisterController', function($scope, AuthService, $location) {
    $scope.registerData = {};

    $scope.register = function() {
        AuthService.register($scope.registerData).then(function(response) {
            alert('Registrasi berhasil!');
            console.log(response.data);
            $location.path('/login'); // Arahkan ke halaman login
        }).catch(function(error) {
            alert('Registrasi gagal!');
            console.log(error);
        });
    };
});