(function() {

    function ApplicationJsController($scope, $http, $window, $uibModal, dataProvider, dataService) {

        const URL_BASE = dataService.baseUrl();
        const URL_LOAD_APPS = URL_BASE + '/api/applications';
        const URL_LOAD_TYPE = '/api/application/types';
        const URL_LOAD_FILES = URL_BASE + '/api/application-files/reloadAppFiles';
        const URL_LOAD_REC_FILES = URL_BASE + '/api/reviewer/loadRecFiles';
        const URL_APP_ADD = URL_BASE + '/api/application/add';
        const URL_APP_EDIT = '/api/application/edit';
        const URL_APP_DELETE = URL_BASE + '/api/application/delete';
        const URL_EDIT_DOSSIER_SECTION = URL_BASE + '/application-form/editDossierSection';
        const URL_ADD_DOSSIER_SECTION = URL_BASE + '/application-form/addDossierSection';
        const URL_DELETE_DOSSIER_SECTION = URL_BASE + '/api/application-section/delete';
        const URL_EDIT_FILE = URL_BASE + '/application-form/editFileInfo';
        const URL_DELETE_FILE = URL_BASE + '/api/application-file/delete';
        const URL_UPLOAD_FILE = URL_BASE + '/application/fileUpload';
        const URL_UPLOAD_RECOMMENDATION = URL_BASE + '/reviewer/recommendationUpload';
        const URL_SAVE_RECOMMENDATION = URL_BASE + '/api/reviewer/saveRecommendation';
        const URL_FIND_UNLINKED_GOOGLE_FILES = URL_BASE + '/api/application/findUnlinkedGoogleFiles';
        const URL_LINK_GOOGLE_FILE = URL_BASE + '/application/linkGoogleFile';
        const URL_CREATE_FILE = URL_BASE + '/application/addNewDoc';
        const URL_DELETE_UPLOADED_RECOMMENDATION = URL_BASE + '/api/reviewer/deleteRecommendationFile';
        const URL_UPDATE_SORT_ORDER = URL_BASE + '/application/changeSortOrder';
        const URL_RECOMMENDATION_COMPLETED = URL_BASE + '/api/reviewer/forwardToNextCommittee';

        $scope.applications = [];
        $scope.applicationTypes = [];
        $scope.applicationYears = [];
        $scope.offices = [];
        $scope.appFiles = [];
        $scope.recFiles = [];
        $scope.dossierExpandAll = true;
        $scope.files = [];

        $scope.init = function(apps) {
            $scope.applications = apps;
        }

        $scope.init = function(apps, appTypes, appYears, appOffices) {
            $scope.applications = apps;
            $scope.applicationTypes = appTypes;
            $scope.applicationYears = appYears;
            $scope.offices = appOffices;
        }

        $scope.initApps = function() {
            dataProvider.loadData(function(data) {
                $scope.applications = data;
            }, URL_LOAD_APPS);
        };

        $scope.initTypes = function() {
            dataService.loadData(function(data) {
                $scope.types = data;
            }, URL_LOAD_TYPE);
        };

        $scope.initAppfiles = function(application) {
            var appId = application.id;
            $scope.appFiles = dataProvider.loadData(function(data) {
                $scope.appFiles = data;
            }, URL_LOAD_FILES + '/' + appId);
        }

        $scope.initRecFiles = function(application) {
            var appId = application.id;
            $scope.fileId = null;

            $scope.recFiles = dataProvider.loadData(function(data) {
                $scope.recFiles = data;
            }, URL_LOAD_REC_FILES + '/' + appId);

            if (document.getElementById("recommend") != null) {
                $scope.recValue = document.getElementById("recommend").value;
            }
            if (document.getElementById("fileId") != null) {
                $scope.fileId = document.getElementById("fileId").value;
            }
        }

        $scope.wApplication = function() {
            return $window.applicationx;
        };

        $scope.isEmpty = function(obj) {
            for ( var i in obj)
                if (obj.hasOwnProperty(i)) {
                    return false;
                }
            return true;
        };

        $scope.add = function(apps, appTypes, appYears, appOffices, coordOffice) {
            $scope.types = appTypes;
            $scope.applicationType = appTypes[0];
            $scope.years = appYears;
            // 1 is the current year
            $scope.year = appYears[1];

            $scope.offices = appOffices;
            if (coordOffice == null) {
                $scope.selectedOffice = 0;
            } else {
                for (let i = 0; i < appOffices.length; i++) {
                    if (appOffices[i].campus.description === coordOffice.campus.description) {
                        $scope.selectedOffice = i;
                        $scope.office = offices[i];
                    }
                }
            }

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ApplicationAddTemplateId',
                controller: 'ApplicationAddDialog',
                scope: $scope,
                resolve: {
                    uhUuid: function() {
                        return $scope.uhUuid;
                    },
                    applicationType: function() {
                        return $scope.applicationType;
                    },
                    office: function() {
                        return $scope.office;
                    },
                    year: function() {
                        return $scope.year;
                    }
                }
            });
            modalInstance.result.then(function(data) {
                dataProvider.saveData(function(data) {
                    $scope.applications.unshift(data);
                }, URL_APP_ADD, data);
            }, function() {
                console.log('Add Application dismissed at: ' + new Date());
            });
        };

        $scope.addSection = function() {
            console.log('Add dossier section to: ' + document.getElementById("applicationId").value);
            var appId = document.getElementById("applicationId").value;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'AddSectionModalTemplateId',
                controller: 'AddSectionDialog',
                scope: $scope,
                resolve: {
                    section: function() {
                        return $scope.section;
                    },
                    appId: function() {
                        return appId;
                    }
                }
            });
            modalInstance.result.then(function(data) {
                console.log('Add Section closed at: ' + new Date());
                dataProvider.saveData(function(data) {
                    $scope.appFiles.push(data);
                }, URL_ADD_DOSSIER_SECTION, data);
            }, function() {
                console.log('Add Section dismissed at: ' + new Date());
            });
        };

        $scope.deleteSection = function(dossier) {
            console.log('Delete dossier section clicked on; dossier: ', dossier);
            var toBeDeleted = dossier;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'DeleteSectionModalTemplate',
                controller: 'DeleteDossierSectionDialog',
                scope: $scope,
                resolve: {
                    dossier: function() {
                        return toBeDeleted;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                console.log('A. Delete Section closed; data: ', data);
                dataProvider.delData(function(data) {
                    console.log('B. Delete Section closed; data: ', data);
                    var index = $scope.appFiles.indexOf(toBeDeleted);
                    console.log('C. Delete Section closed; index: ' + index);
                    console.log(toBeDeleted.sectionName);
                    if (index != -1) {
                        $scope.appFiles.splice(index, 1);
                    }
                }, URL_DELETE_DOSSIER_SECTION + '/' + toBeDeleted.id, data);
            }, function(data) {
                console.log('Delete Section dismissed; data: ', data);
            });
        };

        $scope.editSection = function(dossier) {
            $scope.dossier = dossier;
            var modalInstance = $uibModal.open({
                animation: true,
                size: 'md',
                templateUrl: 'EditDossierSectionModalTemplateId',
                controller: 'EditDossierSectionDialog',
                scope: $scope,
                resolve: {
                    dossier: function() {
                        console.log("NEFARIOUSLY!!!!!");
                        return $scope.dossier;
                    }
                }
            });
            modalInstance.result.then(function(data) {
                dataProvider.saveData(function(data) {
                }, URL_EDIT_DOSSIER_SECTION, data);
            }, function() {
                console.log('Edit section dismissed at: ' + new Date() + data);
            });
        }

        $scope.editFile = function(appFile) {
            $scope.appFile = appFile;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'EditFileModalTemplateId',
                controller: 'EditFileDialog',
                scope: $scope,
                resolve: {
                    appFile: function() {
                        return $scope.appFile;
                    }
                }
            });
            modalInstance.result.then(function(data) {
                dataProvider.saveData(function(data) {
                }, URL_EDIT_FILE, data);
            }, function() {
                console.log('Edit file dismissed at: ' + new Date());
            });
        }

        $scope.deleteFile = function(data) {
            console.log('Delete file clicked: ' + data.id);
            var dtaObj = data;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'DeleteFileModalTemplate',
                controller: 'DeleteFileDialog',
                scope: $scope,
                resolve: {
                    file: function() {
                        return data;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                dataProvider.delData(function(data) {
                    for (var i = 0; i < $scope.appFiles.length; i++) {
                        if ($scope.appFiles[i].id === dtaObj.applicationDossierId) {
                            for (var j = 0; j < $scope.appFiles[i].applicationFiles.length; j++) {
                                if ($scope.appFiles[i].applicationFiles[j].id === dtaObj.id) {
                                    var index = $scope.appFiles[i].applicationFiles
                                            .indexOf($scope.appFiles[i].applicationFiles[j]);
                                    console.log('index: ' + index);
                                    $scope.appFiles[i].applicationFiles.splice(index, 1);
                                }
                            }
                        }
                    }
                }, URL_DELETE_FILE + '/' + dtaObj.id, data);
            }, function() {
                console.log('Delete file dismissed at: ' + new Date());
            });
        }

        $scope.uploadFile = function(data) {
            $scope.afile = data;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'UploadFileModalTemplateId',
                controller: 'UploadFileDialog',
                scope: $scope,
                resolve: {
                    afile: function() {
                        return $scope.afile;
                    }
                }
            });

            modalInstance.result.then(function(formData) {
                console.log('Upload file closed: ' + new Date());
                console.log('-- Upload -- URL_UPLOAD_FILE: ', URL_UPLOAD_FILE);

                // changing cursor and showing temporary
                // progress bar
                $("body").css("cursor", "progress");
                var $modal = $('.js-loading-bar'), $bar = $modal.find('.progress-bar');
                $modal.modal('show');
                $bar.addClass('animate');

                $http({
                    method: 'POST',
                    url: URL_UPLOAD_FILE,
                    headers: {
                        'Content-Type': undefined
                    },
                    data: formData,
                    transformRequest: angular.identity
                }).success(function(data, status) {
                    console.log('File uploaded successfully, update UI');
                    for (var i = 0; i < $scope.appFiles.length; i++) {
                        if ($scope.appFiles[i].id === data.applicationDossierId) {
                            $scope.appFiles[i].applicationFiles.push(data);
                        }
                    }
                    // changing cursor back and
                    // removing progress bar
                    $("body").css("cursor", "default");
                    $bar.removeClass('animate');
                    $modal.modal('hide');
                });
                console.log('Upload file closed at: ' + new Date());
            }, function() {
                console.log('Upload file dismissed at: ' + new Date());
            });
        };
        
        $scope.linkFile = function(data) {
            var appId = document.getElementById("applicationId").value;
            console.log('Link file clicked- dossier ' + data.id + ' application ' + appId);
            
            $scope.appId = appId;
            $scope.dossierId = data.id;
            
            var i=0;
            $scope.files = dataProvider.loadData(function(data) {
                $scope.googleFiles = data;
                console.log("scope length:" + $scope.googleFiles.length);
                $scope.googleFile = null;
                $scope.comment = null;
                if ($scope.googleFiles.length > 0) {
                    $scope.filesExist = true;
                    $scope.noFilesExist = false;
                } else {
                    $scope.filesExist = false;
                    $scope.noFilesExist = true;
                } 
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'LinkFileToDossierModalTemplateId',
                    controller: 'LinkFileToDossierDialog',
                    scope: $scope,
                    resolve: {
                        application: function() {
                            return ;
                        }
                    }
                });
                
                modalInstance.result.then(function(data) {
                    console.log(data);
                    dataProvider.saveData(function(data) {
                        console.log('back from saving link');
                        console.log(data);
                        
                        for (var i = 0; i < $scope.appFiles.length; i++) {
                            if ($scope.appFiles[i].id === data.applicationDossierId) {
                                $scope.appFiles[i].applicationFiles.push(data);
                            }
                        }
                        
                    }, URL_LINK_GOOGLE_FILE, data);
                }, function() {
                    console.log('link google file dismissed at: ' + new Date());
                });
                
            }, URL_FIND_UNLINKED_GOOGLE_FILES + '/' + appId);
        }

        $scope.createFile = function(data) {
            $scope.afile = data;
            
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'CreateFileModalTemplateId',
                controller: 'CreateFileDialog',
                scope: $scope,
                resolve: {
                    afile: function() {
                        return $scope.afile;
                    }
                }
            });

            modalInstance.result.then(function(formData) {
                console.log('create file closed: ' + new Date());
                
                // changing cursor and showing temporary
                // progress bar
                $("body").css("cursor", "progress");
                var $modal = $('.js-creating-new-bar'), $bar = $modal.find('.progress-bar');
                $modal.modal('show');
                $bar.addClass('animate');
             
                $http({
                    method: 'POST',
                    url: URL_CREATE_FILE,
                    headers: {
                        'Content-Type': undefined
                    },
                    data: formData,
                    transformRequest: angular.identity
                }).success(function(data, status) {
                    console.log('File created successfully, update UI');
                    for (var i = 0; i < $scope.appFiles.length; i++) {
                        if ($scope.appFiles[i].id === data.applicationDossierId) {
                            $scope.appFiles[i].applicationFiles.push(data);
                        }
                    }
                    // changing cursor back and
                    // removing progress bar
                    $("body").css("cursor", "default");
                    $bar.removeClass('animate');
                    $modal.modal('hide');
                });
                console.log('create file closed at: ' + new Date());
            }, function() {
                console.log('create file dismissed at: ' + new Date());
            });
        };
        
        // Remove Application Dialog.
        $scope.removeApplication = function(application) {
            $scope.application = application;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ApplicationDeleteModalTemplateId',
                controller: 'ApplicationDeleteDialog',
                resolve: {
                    application: function() {
                        return $scope.application;
                    }
                }
            });
            modalInstance.result.then(function(dataObj) {
                var postUrl = URL_APP_DELETE + '/' + dataObj.id
                dataProvider.delData(function(data) {
                    var index = $scope.applications.indexOf(dataObj);
                    $scope.applications.splice(index, 1);
                }, postUrl);
                console.log("ApplicationDeleteDialog.remove; id: ", dataObj.id)
            }, function() {
                console.log('ApplicationDeleteDialog; modal canceled.');
            });
        };

        // Edit Application Dialog.
        $scope.editApplication = function(application, applicationTypes, appYears, offices) {
            console.log('editApplication: ', application);
            $scope.application = application;
            $scope.name = application.applicant.name;
            $scope.types = applicationTypes;
            for (let i = 0; i < applicationTypes.length; i++) {
                if (applicationTypes[i].description === application.applicationType.description) {
                    $scope.selectedType = i;
                    $scope.applicationType = applicationTypes[i];
                }
            }
            $scope.years = appYears;
            for (let i = 0; i < appYears.length; i++) {
                if (parseInt(appYears[i].description) === application.year) {
                    $scope.selectedYear = i;
                    $scope.year = appYears[i];
                }
            }
            $scope.offices = offices;
            for (let i = 0; i < offices.length; i++) {
                if (offices[i].campus.description === application.office.campus.description) {
                    $scope.selectedOffice = i;
                    $scope.office = offices[i];
                }
            }

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ApplicationEditModalTemplateId',
                controller: 'ApplicationEditDialog',
                scope: $scope,
                resolve: {
                    application: function() {
                        return $scope.application;
                    },
                    applicationType: function() {
                        return $scope.applicationType;
                    },
                    applicationTypeId: function() {
                        return $scope.applicationType.id;
                    },
                    office: function() {
                        return $scope.office;
                    },
                    year: function() {
                        return $scope.year;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                console.log('editApplication result then:', data);
                dataService.saveData(function(data) {
                    console.log('editApplication -> saveData success.', data);
                    // Maybe do something here?
                }, URL_APP_EDIT, data);
            }, function() {
                console.log('EditApplication Modal dismissed at: ' + new Date());
            });
        };

        $scope.uploadRecommendation = function(data) {
            console.log('upload recommendation');
            var appId = document.getElementById("applicationId").value;
            var fileInput = document.getElementById('uploadRecommendation');
            if (fileInput.value == "") {
                alert("Choose File before clicking Upload Recommendation");
                return false;
            }
            var file = fileInput.files[0];
            var formData = new FormData();

            formData.append('file', file);
            formData.append('appId', appId);

            $http({
                method: 'POST',
                url: URL_UPLOAD_RECOMMENDATION,
                headers: {
                    'Content-Type': undefined
                },
                data: formData,
                transformRequest: angular.identity
            }).success(function(data, status) {
                $scope.fileId = data;
            });

            console.log('upload completed');

            document.getElementById("uploadRecDiv").style.display = "none";
            document.getElementById("showRecDiv").style.display = "block";
            if ($scope.recValue === 'Y' || $scope.recValue === 'N' || $scope.recValue === 'D') {
                document.getElementById("closure").style.display = "block";
            }

        };

        $scope.saveDecision = function(value) {
            console.log('saving recommendation');
            var form = new FormData();
            form.append('appId', document.getElementById("applicationId").value);
            form.append('approvedYN', value);

            $http({
                method: 'POST',
                url: URL_SAVE_RECOMMENDATION,
                headers: {
                    'Content-Type': undefined
                },
                data: form,
                transformRequest: angular.identity
            });
            console.log('done saving ...');
            if (document.getElementById("showRecDiv").style.display == "block") {
                document.getElementById("closure").style.display = "block";
            }
        };

        $scope.deleteRecommendationFile = function() {
            console.log('delete uploaded recommendation');
            var appId = document.getElementById("applicationId").value;

            $http.post(URL_DELETE_UPLOADED_RECOMMENDATION + "/" + appId).success(function(data) {
                console.log('delete success');
                $scope.fileId = 0;
                document.getElementById("showRecDiv").style.display = "none";
                document.getElementById("uploadRecDiv").style.display = "block";
                document.getElementById("closure").style.display = "none";
            }).error(function(data, status, headers, config) {
                console.log('delete error');
            });
        };

        $scope.recommendationCompleted = function() {
            var appId = document.getElementById("applicationId").value;
            console.log('recommendation completed: ' + new Date());

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ReviewCompletionConfirmationModalTemplate',
                controller: 'ReviewCompletionConfirmationDialog'
            });
            modalInstance.result.then(function() {
                $http.post(URL_RECOMMENDATION_COMPLETED + "/" + appId);
                $window.location.href = URL_BASE + '/mainmenu';
            }, function() {
                console.log('completion dismissed at: ' + new Date());
            });
        };

        $scope.toggleTree = function() {
            var button = document.getElementById('collapseSections');
            if ($scope.dossierExpandAll) {
                button.innerText = "Expand All Sections";
                $scope.$broadcast('angular-ui-tree:collapse-all');
            } else {
                button.innerText = "Collapse All Sections";
                $scope.$broadcast('angular-ui-tree:expand-all');
            }
            $scope.dossierExpandAll = !$scope.dossierExpandAll;
        };

        $scope.dossierTree = {
            accept: function(sourceNodeScope, destNodesScope, destIndex) {
                var dragging = sourceNodeScope.$element.attr('ui-tree-node');
                /*
                 * don't let user drop a file outside the scope of a section,
                 * i.e - a file cannot be listed in the section tree
                 */
                var destType = destNodesScope.$parent.$type;
                console.log(dragging + ' ' + destType);
                if ((dragging === "file" && destType === "uiTree") || (dragging === "section" && destType === "uiTreeNode")) {
                    return false;
                } else {
                    return true;
                }
            },
            dropped: function(e) {
                $http.post(URL_UPDATE_SORT_ORDER, $scope.appFiles).success(function() {
                    console.log('sorting completed');
                }).error(function(response) {
                    console.log('error sorting');
                });
            }
        };

        $scope.searchFilter = function(page) {
            return function(a) {
                var searchText = $scope.searchForApp;
                if (searchText == undefined) {
                    return true;
                }

                searchText = searchText.trim().toLowerCase();
                if (searchText == "") {
                    return true;
                }

                if (a.id.toString().indexOf(searchText) != -1) {
                    return true;
                }
                if (page == "home") {
                    if (a.applicant.name.toLowerCase().indexOf(searchText) != -1) {
                        return true;
                    }
                }
                if (a.year != null && a.year.toString().indexOf(searchText) != -1) {
                    return true;
                }
                if (a.type.description.toLowerCase().indexOf(searchText) != -1) {
                    return true;
                }
                if (a.state.simpleName.toLowerCase().indexOf(searchText) != -1) {
                    return true;
                }
                if (a.office.campus.description.toLowerCase().indexOf(searchText) != -1) {
                    return true;
                }
                if (page == "admin" && a.googleFolderId != null) {
                    if (a.googleFolderId.toLowerCase().indexOf(searchText) != -1) {
                        return true;
                    }
                }

                return false;
            }
        };

        /*
         * The next w functions are just an ugly hack so that the Spring
         * Controllers can send data to the thymeleaf pages using model
         * attributes.
         */
        $scope.wApplications = function() {
            return $window.applications;
        }
        $scope.wApplicationTypes = function() {
            return $window.applicationTypes;
        }
        $scope.wApplicationOffices = function() {
            return $window.offices;
        }
        $scope.wApplicationYears = function() {
            return $window.applicationYears;
        }
        $scope.wAppFiles = function() {
            return $window.appFiles;
        }
        $scope.wCoordOffice = function() {
            return $window.coordOffice;
        }
    }
    tenureApp.controller("ApplicationJsController", ApplicationJsController);

    function ApplicationAddDialog($scope, $http, $uibModalInstance, dataService, uhUuid, applicationType, year, office) {
        const URL_LOOKUP_NAME = '/api/application/lookupName';
        $scope.mydisabled = true;
        $scope.uhUuid = uhUuid;
        $scope.applicationType = applicationType;

        $scope.lookupName = function() {
            var search = $scope.search;
            dataService.loadData(function(data) {
                $scope.name = data.name;
                $scope.uhUuid = data.uhUuid;
                $scope.mydisabled = false;

                if ($scope.uhUuid == null || $scope.uhUuid == "") {
                    $scope.mydisabled = true;
                    $scope.name = "User not found, please try again";
                }
            }, URL_LOOKUP_NAME + '/?search=' + search);
        };

        $scope.ok = function() {
            var dataObj = {
                uhUuid: $scope.uhUuid,
                applicationType: $scope.applicationType,
                year: $scope.year.description,
                office: $scope.office
            };

            $uibModalInstance.close(dataObj);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
    tenureApp.controller("ApplicationAddDialog", ApplicationAddDialog);

    function ApplicationEditDialog($scope, $window, $uibModalInstance, application) {
        console.log('ApplicationEditDialog application: ', application);
        $scope.application = application;
        $scope.offices = $window.offices;
        $scope.applicationTypes = $window.applicationTypes
        $scope.years = $window.applicationYears;
        $scope.officeId = application.office.id;
        $scope.uhUuid = application.uhUuid;
        $scope.isTypeChanged = false;
        $scope.isOfficeChanged = false;
        $scope.isYearChanged = false;

        $scope.officeChange = function(selectedOffice) {
            $scope.isOfficeChanged = (application.office.id != selectedOffice.id);
        };

        $scope.yearChange = function(selectedYear) {
            $scope.isYearChanged = (application.year != selectedYear.description);
        };

        $scope.typeChanged = function(selectedType) {
            $scope.isTypeChanged = (application.applicationType != selectedType);
        };

        $scope.ok = function() {
            var dataObj = application;
            dataObj.id = application.applicationId;
            dataObj.office = $scope.office;
            dataObj.officeId = $scope.office.id;
            dataObj.year = $scope.year.description;
            dataObj.applicationType = $scope.applicationType;
            dataObj.applicationTypeId = $scope.applicationType.id;
            console.log('ApplicationEditDialog.ok; dataObj: ', dataObj);

            $uibModalInstance.close(dataObj);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
    tenureApp.controller('ApplicationEditDialog', ApplicationEditDialog);

    function AddSectionDialog($scope, $http, $uibModalInstance, appId, section) {
        $scope.mydisabled = false;
        $scope.section = section;
        $scope.appId = appId;

        $scope.ok = function() {
            var dataObj = {
                section: $scope.section,
                appId: appId
            };

            $uibModalInstance.close(dataObj);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
    tenureApp.controller("AddSectionDialog", AddSectionDialog);

    function DeleteDossierSectionDialog($scope, $uibModalInstance, dossier) {
        $scope.dossier = dossier;

        $scope.ok = function(data) {
            $uibModalInstance.close(data);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
    tenureApp.controller("DeleteDossierSectionDialog", DeleteDossierSectionDialog);

    function EditDossierSectionDialog($scope, $uibModalInstance, dossier) {
        $scope.dossier = dossier;

        $scope.ok = function(data) {
            var dataObj = {
                id: $scope.dossier.id,
                applicationId: $scope.dossier.applicationId,
                sectionName: $scope.dossier.sectionName,
                orderNum: $scope.dossier.orderNum
            };
            $uibModalInstance.close(dataObj);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
    tenureApp.controller("EditDossierSectionDialog", EditDossierSectionDialog);

    function EditFileDialog($scope, $http, $uibModalInstance, appFile) {

        $scope.appFile = appFile;

        $scope.ok = function(appFile) {

            var dataObj = {
                id: $scope.appFile.id,
                applicationDossierId: $scope.appFile.applicationDossierId,
                fileName: $scope.appFile.fileName,
                type: $scope.appFile.type,
                size: $scope.appFile.size,
                comment: $scope.appFile.comment,
                orderNum: $scope.appFile.orderNum
            };

            $uibModalInstance.close(dataObj);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
    tenureApp.controller("EditFileDialog", EditFileDialog);

    function DeleteFileDialog($scope, $http, $uibModalInstance, file) {
        $scope.file = file;

        $scope.ok = function(data) {
            $uibModalInstance.close(data);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
    tenureApp.controller("DeleteFileDialog", DeleteFileDialog);

    function ApplicationDeleteDialog($scope, $http, $uibModalInstance, application) {
        $scope.application = application;

        $scope.ok = function(application) {
            $uibModalInstance.close(application);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    }
    tenureApp.controller("ApplicationDeleteDialog", ApplicationDeleteDialog);

    function UploadFileDialog($scope, $http, $uibModalInstance, afile) {
        $scope.mydisabled = false;
        $scope.fileNames = '';
        $scope.uploadFile = '';
        $scope.convert = 'N';

        $scope.add = function() {
            $scope.data = 'none';
            $scope.notPass = false;

            var fileInput = document.getElementById('uploadfile');
            var file = fileInput.files[0];
            var formData = new FormData();

            formData.append('file', file);
            formData.append('appId', $scope.afile.applicationId);
            formData.append('dossierId', $scope.afile.id);
            formData.append('convert', $scope.convert);
            formData.append('comment', $scope.comment);
            $uibModalInstance.close(formData);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
    tenureApp.controller("UploadFileDialog", UploadFileDialog);
    
    function CreateFileDialog($scope, $http, $uibModalInstance, afile) {
        $scope.ok = function() {
            var formData = new FormData();

            formData.append('fileName', $scope.fileName);
            formData.append('appId', $scope.afile.applicationId);
            formData.append('dossierId', $scope.afile.id);
            formData.append('comment', $scope.comment);
          
            $uibModalInstance.close(formData);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
    tenureApp.controller("CreateFileDialog", CreateFileDialog);

    function ReviewCompletionConfirmationDialog($scope, $http, $uibModalInstance) {

        $scope.ok = function() {
            $uibModalInstance.close();
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
    tenureApp.controller("ReviewCompletionConfirmationDialog", ReviewCompletionConfirmationDialog);

    function LinkFileToDossierDialog($scope, $http, $uibModalInstance) {
        $scope.ok = function(data) {
            var dataObj = {
                dossierId: $scope.dossierId,
                applicationId: $scope.appId,
                comment: $scope.comment,
                googleFileId: $scope.googleFile.id,
                googleFileName: $scope.googleFile.name,
                goggleFileType: $scope.googleFile.mimeType,
                googleFileLink: $scope.googleFile.webViewLink,
                googleFileSize: $scope.googleFile.size
            };
            $uibModalInstance.close(dataObj);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
    tenureApp.controller("LinkFileToDossierDialog", LinkFileToDossierDialog);
    
})();
