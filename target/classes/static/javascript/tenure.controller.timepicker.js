(function() {

    function TimepickerController($scope, $log) {

        $scope.initialTime = new Date();

        $scope.hstep = 1;
        $scope.mstep = 1;

        $scope.options = {
            hstep: [ 1, 2, 3 ],
            mstep: [ 1, 5, 10, 15, 25, 30 ]
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = !$scope.ismeridian;
        };

        $scope.update = function() {
            var d = new Date();
            d.setHours(14);
            d.setMinutes(0);
            $scope.initialTime = d;
        };

        $scope.changed = function() {
            //- $log.log('Time changed to: ' + $scope.initialTime);
        };

        $scope.clear = function() {
            $scope.initialTime = null;
        };
    }
    tenureApp.controller("TimepickerController", TimepickerController);

})();
