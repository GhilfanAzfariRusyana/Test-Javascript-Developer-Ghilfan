app.controller('ItemDetailController', function($scope, $routeParams, $location, AuthService) {
    const checklistId = parseInt($routeParams.checklistId);
    const itemId = parseInt($routeParams.itemId);

    $scope.itemDetail = null;
    $scope.error = '';

    AuthService.getChecklistItemDetail(checklistId, itemId)
        .then(function(response) {
            $scope.itemDetail = response.data.data || response.data;
            $scope.$applyAsync();
        })
        .catch(function(err) {
            console.error(err);
            $scope.error = 'Gagal memuat detail item.';
        });

    $scope.goBack = function() {
        $location.path(`/checklist/${checklistId}`);
    };
});
