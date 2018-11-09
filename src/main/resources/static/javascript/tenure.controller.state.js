(function() {

    function StateJsController($scope, $http, dataService) {
        const URL_BASE = dataService.baseUrl();
        const URL_LOAD = '/api/states';
        const URL_APP_STATE = URL_BASE + '/api/reviewer/forwardToNextCommittee/';
        $scope.states = [];

        $scope.init = function() {
            $scope.loadData();
        };

        $scope.loadData = function() {
            dataService.loadData(function(data) {
                $scope.states = data;
            }, URL_LOAD);
        }

        $scope.startReview = function() {
            var appId = document.getElementById('applicationId').value;
            console.log('start review: ' + new Date());
            // Starting review takes a while on the server side hide button 
            document.getElementById('start-review').style.display = 'none';
            document.getElementById('appState').innerHTML = 'Starting Review...';

            $http.post(URL_APP_STATE + appId).success(function(data) {
                console.log('success');
                document.getElementById("appState").innerHTML = "";
            }).error(function(data, status, headers, config) {
                console.log('error');
            });

        }
        
        $scope.continueReview = function() {
            var appId = document.getElementById("applicationId").value;
            console.log('continue review: ' + new Date());
            // Starting review takes a while on the server side hide button 
            document.getElementById("continue-review").style.display = 'none';

            $http.post(URL_APP_STATE + appId).success(function(data) {
                console.log('success');
                document.getElementById("appState").innerHTML = "";
            }).error(function(data, status, headers, config) {
                console.log('error');
            });

        }

    }
    tenureApp.controller('StateJsController', StateJsController);

})();
