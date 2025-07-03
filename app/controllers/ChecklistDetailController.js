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

    $scope.addItem = function() {
        alert('Fitur tambah item belum tersedia di API');
    };

    $scope.deleteItem = function(item) {
        alert('Fitur hapus item belum tersedia di API');
    };
});
