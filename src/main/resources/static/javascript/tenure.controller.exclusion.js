(function() {

    function ExclusionJsController($scope, $uibModal, $window, dataService, App) {
        $scope.application = {};
        $scope.exclusions = [];

        // Init for main view page.
        $scope.init = function(application) {
            $scope.application = application;
            $scope.exclusions = application.exclusions;
        };

        // Add Dialog.
        $scope.add = function(application) {
            $scope.application = application;
            $scope.uhUuid = '';

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ExclusionAddDialogTemplateId',
                controller: 'ExclusionAddDialog',
                scope: $scope,
                resolve: {
                    application: function() {
                        return $scope.application;
                    },
                    uhUuid: function() {
                        return $scope.uhUuid;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                dataService.saveData(function(data) {
                    if (data.valid) {
                        $scope.exclusions.push(data);
                    }
                }, App.URL.EXCLUSION_ADD + data.applicationId, data.person);
            }, function() {
                //- console.log('E. Modal dismissed at: ' + new Date());
            });
        };

        // Remove Exclusion Dialog.
        $scope.remove = function(application, exclusion) {
            $scope.application = application;
            $scope.exclusion = exclusion;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ExclusionDeleteModalTemplateId',
                controller: 'ExclusionDeleteDialog',
                resolve: {
                    application: function() {
                        return $scope.application;
                    },
                    exclusion: function() {
                        return $scope.exclusion;
                    }
                }
            });

            modalInstance.result.then(function(dataObj) {
                var appId = $scope.application.id;
                var postUrl = App.URL.EXCLUSION_DELETE + appId + '/' + dataObj.id;
                dataService.delData(function(data) {
                    var index = $scope.exclusions.indexOf(dataObj);
                    $scope.exclusions.splice(index, 1);
                }, postUrl);
            }, function() {
                console.log('ExclusionJsController; modal canceled.');
            });
        };

        $scope.wApplication = function() {
            return $window.applicationx;
        };
    }

    tenureApp.controller("ExclusionJsController", ExclusionJsController);

    function ExclusionAddDialog($scope, $uibModalInstance, App, dataService, application, uhUuid) {
        $scope.application = application;
        $scope.uhUuid = uhUuid;
        $scope.mydisabled = true;
        $scope.name = '';

        $scope.ok = function() {
            var dataObj = {
                person: {
                    uhUuid: $scope.uhUuid,
                    name: $scope.name
                },
                applicationId: $scope.application.id
            };
            $uibModalInstance.close(dataObj);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };

        $scope.personSearch = function(application) {
            var search = $scope.search;
            var reviewers = application.reviewers;
            var exclusions = application.exclusions;

            dataService.personSearch(function(data) {
                $scope.name = data.name;
                $scope.uhUuid = data.uhUuid;
                $scope.mydisabled = false;

                if ($scope.uhUuid == null || $scope.uhUuid == "") {
                    $scope.mydisabled = true;
                    $scope.name = "User not found, please try again";
                } else if (exists($scope.uhUuid, exclusions)) {
                    $scope.mydisabled = true;
                    $scope.name = "User already in exclusion group!";
                } else if (exists($scope.uhUuid, reviewers)) {
                    $scope.mydisabled = true;
                    $scope.name = "User is not available as an exclusion. [3]";
                } else if ($scope.uhUuid === application.applicant.uhUuid) {
                    $scope.mydisabled = true;
                    $scope.name = "User is not available as a reviewer. [4]";
                }

            }, search);

        };

        function findByUhuId(uhUuid, myArray) {
            for (var i = 0; i < myArray.length; i++) {
                if (myArray[i].person.uhUuid === uhUuid) {
                    return myArray[i];
                }
            }
            return null;
        }

        function exists(uhUuid, myArray) {
            for (var i = 0; i < myArray.length; i++) {
                if (myArray[i].person.uhUuid === uhUuid) {
                    return true;
                }
            }
            return false;
        }
    }
    tenureApp.controller("ExclusionAddDialog", ExclusionAddDialog);

    function ExclusionDeleteDialog($scope, $uibModalInstance, application, exclusion) {
        $scope.application = application;
        $scope.exclusion = exclusion;

        $scope.ok = function(exclusion) {
            $uibModalInstance.close(exclusion);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    }
    tenureApp.controller("ExclusionDeleteDialog", ExclusionDeleteDialog);

})();
