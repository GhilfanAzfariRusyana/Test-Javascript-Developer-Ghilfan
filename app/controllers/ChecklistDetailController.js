app.controller('ChecklistDetailController', function($scope, $routeParams, $location, AuthService) {
    const checklistId = parseInt($routeParams.id);
    $scope.checklist = null;
    $scope.items = [];
    $scope.error = '';
    $scope.newItemText = '';

    AuthService.getAllChecklists()
        .then(function(res) {
            const allChecklists = res.data.data || res.data || [];

            $scope.checklist = allChecklists.find(c => c.id === checklistId);

            if (!$scope.checklist) {
                $scope.error = 'Checklist tidak ditemukan';
                return;
            }

            if (!$scope.checklist.items || $scope.checklist.items.length === 0) {
                $scope.items = [];
                return;
            }

            const promises = $scope.checklist.items.map(item =>
                AuthService.getChecklistItem(checklistId, item.id)
                    .then(response => response.data.data || response.data)
                    .catch(err => {
                        console.error('Gagal ambil item', item.id, err);
                        return null;
                    })
            );

            Promise.all(promises).then(results => {
                $scope.items = results.filter(i => i !== null);
                $scope.$applyAsync();
            });

        })
        .catch(function(err) {
            console.error('Gagal ambil daftar checklist', err);
            $scope.error = 'Gagal mengambil data checklist.';
        });

    $scope.loadChecklistItems = function() {
        AuthService.getChecklistById(checklistId)
            .then(function(response) {
                $scope.checklist = response.data.data;  
                $scope.items = $scope.checklist.items || [];
            })
            .catch(function(err) {
                $scope.error = 'Gagal memuat data checklist';
                console.error(err);
            });
    };

    $scope.addItem = function() {
        console.log('addItem dipanggil, newItemText:', $scope.newItemText);

        if (!$scope.newItemText || $scope.newItemText.trim() === '') {
            console.log('newItemText kosong, batal tambah');
            return;
        }

        AuthService.createChecklistItem(checklistId, $scope.newItemText.trim())
            .then(function(response) {
                console.log('response dari createChecklistItem:', response);
                $scope.newItemText = '';

                // Ambil ulang daftar item setelah tambah sukses
                return AuthService.getChecklistItemsbyId(checklistId);
            })
            .then(function(response) {
                const items = response.data.data || response.data || [];
                $scope.items = items;
                $scope.$applyAsync();
            })
            .catch(function(err) {
                $scope.error = 'Gagal menambah item.';
                console.error(err);
            });
    };



    $scope.goBack = function() {
        $location.path('/todo');
    };

    $scope.renameItem = function(item) {
        const updatedText = prompt("Ubah item:", item.text);
        if (!updatedText) return;

        AuthService.renameChecklistItem(checklistId, item.id, updatedText)
            .then(function() {
                item.text = updatedText;
                alert('Nama item berhasil diubah.');
                $scope.$applyAsync();
            })
            .catch(function(err) {
                console.error(err);
                alert('Gagal merename item. Coba lagi.');
            });
    };

    $scope.toggleStatus = function(item) {
        item.completed = !item.completed;
       
    };

    $scope.deleteItem = function(item) {
        alert('Fitur hapus item belum tersedia di API');
    };
});
