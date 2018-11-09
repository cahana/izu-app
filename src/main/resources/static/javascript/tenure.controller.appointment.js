(function() {

    function AppointmentJsController($scope, App, dataService) {
        $scope.types = [];
        $scope.ranks = [];

        $scope.init_rank = function() {
            $scope.loadRankData();
        };

        $scope.init_type = function() {
            $scope.loadTypeData();
        };

        $scope.loadTypeData = function() {
            dataService.loadData(function(data) {
                $scope.types = data;
            }, App.URL.APPOINTMENT_TYPE_LOAD);
        };

        $scope.loadRankData = function() {
            dataService.loadData(function(data) {
                $scope.ranks = data;
            }, App.URL.APPOINTMENT_RANK_LOAD);
        };
    }
    tenureApp.controller("AppointmentJsController", AppointmentJsController);

})();
