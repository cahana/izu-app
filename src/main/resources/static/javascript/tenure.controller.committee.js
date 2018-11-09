(function() {

    function CommitteeJsController($scope, $uibModal, $window, dataService, App) {
        $scope.application = {};
        $scope.reviewers = [];
        $scope.roles = [];

        // Init for main view page.
        $scope.init = function(application) {
            $scope.application = application;
            $scope.reviewers = application.reviewers;

            dataService.loadData(function(data) {
                $scope.roles = data;
            }, App.URL.ROLE_REVIEWER_LIST);
        };

        // Init for admin view page.
        $scope.initAll = function() {
            dataService.loadData(function(data) {
                $scope.reviewers = data;
            }, App.URL.COMMITTEE_LIST);
        };

        // Add Dialog.
        $scope.add = function(application) {
            $scope.application = application;
            $scope.uhUuid = '';

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'CommitteeAddDialogTemplateId',
                controller: 'CommitteeAddDialog',
                scope: $scope,
                resolve: {
                    application: function() {
                        return $scope.application;
                    },
                    uhUuid: function() {
                        return $scope.uhUuid;
                    },
                    roles: function() {
                        return $scope.roles;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                dataService.saveData(function(data) {
                    if (data.valid) {
                        $scope.reviewers.push(data);
                    }
                }, App.URL.COMMITTEE_ADD, data);
            }, function() {
                //- console.log('E. Modal dismissed at: ' + new Date());
            });
        };

        // Edit Dialog.
        $scope.edit = function(application, committee) {
            $scope.application = application;
            $scope.committee = committee;
            $scope.selectedRole = findById(committee.role.id, $scope.roles);

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'CommitteeEditModalTemplateId',
                controller: 'CommitteeEditDialog',
                scope: $scope,
                resolve: {
                    application: function() {
                        return $scope.application;
                    },
                    committee: function() {
                        return $scope.committee;
                    },
                    selectedRole: function() {
                        return $scope.selectedRole;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                console.log('editCoordinator -> saveData success.', data);

                dataService.saveData(function(data) {
                    console.log('editCoordinator -> saveData success.', data);
                    // Maybe do something here?
                }, App.URL.COMMITTEE_EDIT, data);

            }, function() {
                //- console.log('B. Modal dismissed at: ' + new Date());
            });
        };

        // Remove Committee Dialog.
        $scope.remove = function(application, committee) {
            $scope.application = application;
            $scope.committee = committee;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'CommitteeDeleteModalTemplateId',
                controller: 'CommitteeDeleteDialog',
                resolve: {
                    application: function() {
                        return $scope.application;
                    },
                    committee: function() {
                        return $scope.committee;
                    }
                }
            });

            modalInstance.result.then(function(dataObj) {
                var appId = $scope.application.id;
                var postUrl = App.URL.COMMITTEE_DELETE + appId + '/' + dataObj.id;
                dataService.delData(function(data) {
                    var index = $scope.reviewers.indexOf(dataObj);
                    $scope.reviewers.splice(index, 1);
                }, postUrl);
            }, function() {
                console.log('CommitteeJsController; modal canceled.');
            });
        };

        function findById(id, myArray) {
            for (var i = 0; i < myArray.length; i++) {
                if (myArray[i].id === id) {
                    return myArray[i];
                }
            }
        }

        $scope.wApplication = function() {
            return $window.applicationx;
        };
    }

    tenureApp.controller("CommitteeJsController", CommitteeJsController);

    function CommitteeAddDialog($scope, $uibModalInstance, dataService, application, uhUuid, roles) {
        $scope.application = application;
        $scope.uhUuid = uhUuid;
        $scope.roles = roles;
        $scope.selectedRole = roles[0];
        $scope.mydisabled = true;
        $scope.name = '';

        $scope.ok = function() {
            var dataObj = {
                person: {
                    uhUuid: $scope.uhUuid,
                    name: $scope.name
                },
                applicationId: $scope.application.id,
                role: $scope.selectedRole
            };
            $uibModalInstance.close(dataObj);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };

        const URL_LOOKUP_NAME = '/api/application/lookupName';
        $scope.lookupName = function() {
            var search = $scope.search;
            var reviewers = application.reviewers;
            var exclusions = application.exclusions;

            dataService.loadData(function(data) {
                $scope.name = data.name;
                $scope.uhUuid = data.uhUuid;
                $scope.mydisabled = false;

                if ($scope.uhUuid == null || $scope.uhUuid == "") {
                    $scope.mydisabled = true;
                    $scope.name = "User not found, please try again";
                } else if (exists($scope.uhUuid, reviewers)) {
                    $scope.mydisabled = true;
                    $scope.name = "User already a committee reviewer.";
                } else if (exists($scope.uhUuid, exclusions)) {
                    $scope.mydisabled = true;
                    $scope.name = "User is not available as a reviewer. [1]";
                } else if ($scope.uhUuid === application.applicant.uhUuid) {
                    $scope.mydisabled = true;
                    $scope.name = "User is not available as a reviewer. [2]";
                }

            }, URL_LOOKUP_NAME + '/?search=' + search);
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
    tenureApp.controller("CommitteeAddDialog", CommitteeAddDialog);

    function CommitteeDeleteDialog($scope, $uibModalInstance, application, committee) {
        $scope.application = application;
        $scope.committee = committee;

        $scope.ok = function(committee) {
            $uibModalInstance.close(committee);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    }
    tenureApp.controller("CommitteeDeleteDialog", CommitteeDeleteDialog);

    function CommitteeEditDialog($scope, $uibModalInstance, application, committee, selectedRole) {
        $scope.application = application;
        $scope.committee = committee;
        $scope.selectedRole = selectedRole;
        $scope.isChanged = false;

        $scope.ok = function(committee) {
            $uibModalInstance.close(committee);
        };

        $scope.ok = function(selectedRole) {
            var dataObj = committee;
            dataObj.role = $scope.selectedRole;
            dataObj.roleId = $scope.selectedRole.id;
            $uibModalInstance.close(dataObj);
        };

        $scope.roleChange = function(selectedRole) {
            $scope.isChanged = (committee.role.id != selectedRole.id);
        }

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    }
    tenureApp.controller("CommitteeEditDialog", CommitteeEditDialog);

})();
