(function() {

    function CampusJsController($scope, dataService, App) {
        $scope.campuses = [];

        $scope.init = function() {
            $scope.loadData();
        };

        $scope.loadData = function() {
            dataService.loadData(function(data) {
                $scope.campuses = data;
            }, App.URL.CAMPUS_LOAD);
        }
    }
    tenureApp.controller("CampusJsController", CampusJsController);

})();
