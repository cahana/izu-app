(function() {

    function DetailJsController($scope, $http, $window, $uibModal, dataService, App) {
        $scope.submissionSuccess = false;
        $scope.application = {};
        $scope.appointmentTypes = []
        $scope.campuses = {};
        $scope.isCoordinator = false;
        $scope.considerationFile;

        $scope.uploadConsiderationFile = function(application) {
            $scope.application = application;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ConsiderationDialogTemplateId',
                controller: 'ConsiderationEditDialog',
                scope: $scope,
                resolve: {
                    application: function() {
                        return $scope.application;
                    },
                    considerationFile: function() {
                        return $scope.considerationFile;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                $scope.considerationFile = data.considerationFile;
            }, function() {
                // An error occurred.
                console.log('Error occurred in modal.');
            });
        };

        $scope.showMemoField = function(application) {
            if (application.detail == null) {
                return false;
            }
            var consideration = application.detail.consideration;
            return consideration === 'before' || consideration === 'after';
        };

        $scope.showCollegeFields = function(application) {
            if (application.detail == null) {
                return false;
            }
            //var consideration = application.detail.consideration;
            //return consideration === 'before' || consideration === 'after';
            console.log('application.detail.campus: ' + application.detail.campus.isCommunityCollege);
            return false;
        };

        $scope.init = function(application, isCoordinator) {
            $scope.isCoordinator = isCoordinator;
            $scope.submissionSuccess = false;
            $scope.application = application;

            $scope.loadCampusData();
            $scope.loadAppointmentTypeData();
            $scope.loadAppointmentRankData();
            $scope.loadApplication(application.id);
            $scope.loadConsiderationFile(application.detail);
        };

        $scope.loadApplication = function(id) {
            dataService.loadData(function(data) {
                $scope.application = data;
            }, App.URL.APPLICATION_LOAD + id);
        }

        $scope.loadCampusData = function() {
            dataService.loadData(function(data) {
                $scope.campuses = data;
            }, App.URL.CAMPUS_LOAD);
        }

        $scope.loadAppointmentTypeData = function() {
            dataService.loadData(function(data) {
                $scope.appointmentTypes = data;
            }, App.URL.APPOINTMENT_TYPE_LOAD);
        };

        $scope.loadAppointmentRankData = function() {
            dataService.loadData(function(data) {
                $scope.appointmentRanks = data;
            }, App.URL.APPOINTMENT_RANK_LOAD);
        };

        $scope.save = function(application) {
            dataService.saveData(function(data) {
                console.log('save -> saveData success.');
                $scope.detailForm.$setPristine();
                $scope.submissionSuccess = true;
            }, App.URL.APPLICATION_SAVE, application);
        };

        $scope.loadConsiderationFile = function(detail) {
            if (detail != undefined) {
                if (detail.id != undefined && detail.id != null) {
                    dataService.loadData(function(data) {
                        $scope.considerationFile = data;
                    }, App.URL.APPROVAL_FILE_LOAD + detail.id);
                }
            }
        }

        /*
         * The next functions are just a hack so that the Spring
         * Controllers can send data to the thymeleaf pages using 
         * model attributes.
         */
        $scope.wApplication = function() {
            return $window.applicationx;
        };
        $scope.wIsCoordinator = function() {
            return $window.isCoordinator;
        }
    }
    tenureApp.controller("DetailJsController", DetailJsController);

    function ConsiderationEditDialog($scope, $uibModalInstance, App, dataService, application, fileUpload, considerationFile) {
        $scope.application = application;
        $scope.uploading = false;
        $scope.errored = false;
        console.log('ConsiderationEditDialog; considerationFile: ', considerationFile);

        $scope.showUpload = (considerationFile == undefined || considerationFile.name == undefined);
        $scope.considerationFile = considerationFile;

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };

        $scope.uploadFile = function() {
            $scope.uploading = true;
            var file = $scope.considerationFile;
            var uploadUrl = App.URL.APPROVAL_FILE_UPLOAD;
            fileUpload.uploadFileToUrl(function(data, status) {
                $scope.considerationFile = data;
                $scope.uploading = false;
                $scope.showUpload = false;
                var dataObj = {
                    considerationFile: $scope.considerationFile
                };
                $uibModalInstance.close(dataObj);
            }, function(data, status) {
                console.error('fileUpload ERROR; status: ' + status + ', data: ', data);
                $scope.errored = true;
            }, file, $scope.application.id, uploadUrl);
        };

        $scope.deleteFile = function(considerationFile) {
            var postUrl = App.URL.APPROVAL_FILE_DELETE + considerationFile.id;
            dataService.delData(function(data) {
                // Empty.
            }, postUrl);

            considerationFile.name = null;
            var dataObj = {
                considerationFile: considerationFile
            };
            $uibModalInstance.close(dataObj);
        };
    }
    tenureApp.controller("ConsiderationEditDialog", ConsiderationEditDialog);

})();
