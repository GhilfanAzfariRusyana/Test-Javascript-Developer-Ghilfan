app.controller('LoginController', function($scope, $location, AuthService) {
    $scope.loginData = {};
    $scope.loginError = '';

    $scope.login = function() {
        $scope.loginError = '';
        AuthService.login($scope.loginData)
            .then(function(response) {
                alert('Login berhasil!');
                // Simpan token ke localStorage
                localStorage.setItem('token', response.data.token);
                $location.path('/todo');
            })
            .catch(function(error) {
                if (error.status === 404 || error.data?.message === "User not found") {
                    $scope.loginError = "ID belum terdaftar. Silakan cek username Anda.";
                } else if (error.status === 401 || error.data?.message === "Invalid credentials") {
                    $scope.loginError = "Password salah. Silakan coba lagi.";
                } else {
                    $scope.loginError = "Login gagal. Silakan coba lagi nanti.";
                }
            });
    };
});
