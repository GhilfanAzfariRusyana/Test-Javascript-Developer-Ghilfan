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
        const updatedText = prompt("Ubah item:", item.name);
        if (!updatedText) return;

        AuthService.renameChecklistItem(checklistId, item.id, updatedText)
            .then(function() {
                item.name = updatedText;
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
        const konfirmasi = confirm(`Yakin ingin menghapus item "${item.name}"?`);
        if (!konfirmasi) return;

        AuthService.deleteChecklistItem(checklistId, item.id)
            .then(function() {
                return AuthService.getChecklistItemsbyId(checklistId);
            })
            .then(function(response) {
                $scope.items = response.data.data || response.data || [];
                $scope.$applyAsync();
                alert('Item berhasil dihapus.');
            })
            .catch(function(err) {
                console.error(err);
                alert('Gagal menghapus item.');
            });
    };

    $scope.selectedItems = [];
    $scope.updateSelectedItems = function () {
        $scope.selectedItems = $scope.items.filter(item => item.selected);
    };
    $scope.deleteSelectedItems = function() {
        const selectedItems = $scope.items.filter(item => item.selected);

        if (selectedItems.length === 0) {
            alert('Tidak ada item yang dipilih untuk dihapus.');
            return;
        }

        const konfirmasi = confirm(`Yakin ingin menghapus ${selectedItems.length} item?`);
        if (!konfirmasi) return;

        const deletePromises = selectedItems.map(item =>
            AuthService.deleteChecklistItem(checklistId, item.id)
                .catch(err => {
                    console.error(`Gagal hapus item ID ${item.id}`, err);
                    return null;
                })
        );

        Promise.all(deletePromises)
            .then(() => {
                return AuthService.getChecklistItemsbyId(checklistId);
            })
            .then(function(response) {
                $scope.items = response.data.data || response.data || [];
                $scope.updateSelectedItems();
                $scope.$applyAsync();
                alert('Item yang dipilih berhasil dihapus.');
            })
            .catch(function(err) {
                console.error(err);
                alert('Terjadi kesalahan saat menghapus item.');
            });
    };

    $scope.viewItemDetail = function(item) {
        $location.path(`/checklist/${checklistId}/item/${item.id}`);
    };
});
