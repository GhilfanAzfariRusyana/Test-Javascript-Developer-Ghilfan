app.controller('TodoController', function($scope, AuthService) {
    $scope.checklists = [];
    $scope.newChecklistName = '';
    $scope.loading = false;
    $scope.error = '';


    $scope.loadChecklists = function() {
    $scope.loading = true;
    $scope.error = '';
    AuthService.getAllChecklists()
        .then(function(response) {
            if (response.data && response.data.data) {
                $scope.checklists = response.data.data;
            } else {
                $scope.checklists = []; // fallback
            }
        })
        .catch(function(err) {
            $scope.error = 'Gagal mengambil data checklist.';
            console.error(err);
        })
        .finally(function() {
            $scope.loading = false;
        });
};



    $scope.addChecklist = function() {
        if (!$scope.newChecklistName) return;
        AuthService.createChecklist({ name: $scope.newChecklistName })
            .then(function(response) {
                $scope.newChecklistName = '';
                $scope.loadChecklists(); 
            })
            .catch(function(err) {
                $scope.error = 'Gagal menambah checklist.';
                console.error(err);
            });
    };


    $scope.deleteChecklist = function(id) {
        if (!confirm('Yakin ingin menghapus checklist ini?')) return;
        AuthService.deleteChecklist(id)
            .then(function(response) {
                $scope.loadChecklists(); 
            })
            .catch(function(err) {
                $scope.error = 'Gagal menghapus checklist.';
                console.error(err);
            });
    };

    $scope.selectedChecklists = [];

$scope.updateSelection = function() {
    $scope.selectedChecklists = $scope.checklists.filter(c => c.selected);
};

$scope.deleteSelectedChecklists = function() {
    if (!confirm('Yakin ingin menghapus semua checklist yang dipilih?')) return;

    const deletePromises = $scope.selectedChecklists.map(item => 
        AuthService.deleteChecklist(item.id)
    );

    Promise.all(deletePromises)
        .then(() => {
            $scope.selectedChecklists = [];
            $scope.loadChecklists();
        })
        .catch(err => {
            $scope.error = 'Gagal menghapus beberapa checklist.';
            console.error(err);
        });
};

    // Initial load
    $scope.loadChecklists();
});
