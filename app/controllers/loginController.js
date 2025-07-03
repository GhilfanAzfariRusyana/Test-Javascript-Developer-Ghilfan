app.controller('LoginController', function($scope, $location, AuthService) {
    $scope.loginData = {};
    $scope.loginError = '';

    $scope.login = function() {
        $scope.loginError = '';

        AuthService.login($scope.loginData).then(function(response) {
            alert('Login berhasil!');
            console.log('Response login:', response.data);

            // Cek dan simpan token ke localStorage
            if (response.data && response.data.data && response.data.data.token) {
                localStorage.setItem('token', response.data.data.token); // ✅ simpan token
                $location.path('/todo'); // redirect ke halaman to-do
            } else {
                $scope.loginError = 'Login berhasil, tapi token tidak ditemukan.';
            }

        }).catch(function(error) {
            console.log('Error login:', error);

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
