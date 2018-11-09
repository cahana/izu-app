(function() {

    function RoleJsController($scope, dataService) {
        const URL_LOAD = '/api/roles';
        $scope.roles = [];

        $scope.init = function() {
            $scope.loadData();
        };

        $scope.loadData = function() {
            dataService.loadData(function(data) {
                $scope.roles = data;
            }, URL_LOAD);
        }
    }
    tenureApp.controller("RoleJsController", RoleJsController);

})();
