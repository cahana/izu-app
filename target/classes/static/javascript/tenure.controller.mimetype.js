(function() {

    function MimeTypeJsController($scope, App, dataService) {
        $scope.mimeTypes = [];

        $scope.init = function() {
            $scope.loadData();
        };

        $scope.loadData = function() {
            dataService.loadData(function(data) {
                $scope.mimeTypes = data;
            }, App.URL.MIME_TYPE_LOAD);
        };
    }
    tenureApp.controller("MimeTypeJsController", MimeTypeJsController);

})();
