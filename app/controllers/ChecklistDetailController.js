app.controller('ChecklistDetailController', function($scope, $routeParams, $location) {
    const checklistId = $routeParams.id;

    // Ambil semua checklist dari sessionStorage
    const allChecklists = JSON.parse(sessionStorage.getItem('checklists')) || [];
    $scope.checklist = allChecklists.find(c => c.id == checklistId);

    if (!$scope.checklist) {
        alert("Checklist tidak ditemukan!");
        $location.path('/todo');
        return;
    }

    if (!$scope.checklist.items) {
        $scope.checklist.items = [];
    }

    $scope.addItem = function() {
        if (!$scope.newItem) return;
        $scope.checklist.items.push({ text: $scope.newItem, completed: false });
        $scope.newItem = '';
        saveChecklist();
    };

    $scope.toggleStatus = function(item) {
        item.completed = !item.completed;
        saveChecklist();
    };

    $scope.deleteItem = function(item) {
        $scope.checklist.items = $scope.checklist.items.filter(i => i !== item);
        saveChecklist();
    };

    $scope.editItem = function(item) {
        const newText = prompt("Ubah item:", item.text);
        if (newText) {
            item.text = newText;
            saveChecklist();
        }
    };

    function saveChecklist() {
        sessionStorage.setItem('checklists', JSON.stringify(allChecklists));
    }
});
