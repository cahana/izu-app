'use strict';
var tenureApp = angular.module('tenureApp', [ 'ui.bootstrap', 'ui.tree', 'ui.bootstrap.datepickerPopup',
        'ui.bootstrap.timepicker' ]);

tenureApp.constant('App', {
    CAMPUS: {
        'MANOA': '7',
        'SYSTEM': '11'
    },
    URL: {
        CAMPUS_LOAD: '/api/campuses',

        APPLICATION_LOAD: '/api/application/',
        APPLICATION_SAVE: '/api/application/save',

        APPOINTMENT_RANK_LOAD: '/api/appointment/ranks',
        APPOINTMENT_TYPE_LOAD: '/api/appointment/types',

        APPROVAL_FILE_LOAD: '/api/application/consideration/',
        APPROVAL_FILE_DELETE: '/api/application/consideration/delete/',
        APPROVAL_FILE_UPLOAD: '/api/application/consideration/upload/',

        COMMITTEE_ADD: '/api/reviewers/add/',
        COMMITTEE_DELETE: '/api/reviewers/delete/',
        COMMITTEE_EDIT: '/api/reviewers/edit/',
        COMMITTEE_LIST: '/api/reviewers/list',

        COORDINATOR_LIST: '/api/coordinators',
        COORDINATOR_ADD: '/api/coordinators/add',
        COORDINATOR_DEL: '/api/coordinators/delete',
        COORDINATOR_EDIT: '/api/coordinators/edit',

        EXCLUSION_ADD: '/api/exclusions/add/',
        EXCLUSION_DELETE: '/api/exclusions/delete/',

        MIME_TYPE_LOAD: '/api/mimetypes',

        LOOKUP_NAME: '/api/application/lookupName/',

        OFFICE_LIST: '/api/offices',

        REVIEWER_LOAD_REC_FILES: '/api/reviewer/loadRecFiles',
        REVIEWER_UPLOAD_RECOMMENDATION: '/reviewer/recommendationUpload',
        REVIEWER_SAVE_RECOMMENDATION: '/api/reviewer/saveRecommendation',
        REVIEWER_DELETE_UPLOADED_RECOMMENDATION: '/api/reviewer/deleteRecommendationFile',
        REVIEWER_RECOMMENDATION_COMPLETED: '/api/reviewer/forwardToNextCommittee',

        ROLE_LIST: '/api/roles',
        ROLE_REVIEWER_LIST: '/api/roles/reviewer',

        SCHEDULE_JOB_LIST: '/api/schedule/job/list',
        SCHEDULE_JOB_ADD: '/api/schedule/job/add',
        SCHEDULE_JOB_DELETE: '/api/schedule/job/delete'
    }
});

tenureApp.directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

tenureApp.directive('convertToNumber', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(val) {
                return parseInt(val, 10);
            });
            ngModel.$formatters.push(function(val) {
                return '' + val;
            });
        }
    };
});

tenureApp.directive('fileModel', [ '$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
} ]);

tenureApp.service('contextService', function($location) {
    this.baseUrl = function() {
        var host = $location.host();

        if (host.indexOf('tenureandpromotion.hawaii.edu') > -1) {
            // Assume production and bail.
            return '/tnp';
        }

        var baseUrl = '';
        var absUrl = $location.absUrl();
        var idx0 = absUrl.indexOf('//');
        if (idx0 != -1) {
            var idx1 = absUrl.indexOf('/', idx0 + 2);
            var path = absUrl.substring(idx1);
            var idx2 = path.indexOf('/');
            if (idx2 > -1) {
                path = path.substring(idx2);
                var idx3 = path.indexOf('/', idx2 + 1);
                if (idx3 > -1) {
                    path = path.substring(idx2, idx3);
                }
            }
            baseUrl = path;
        }

        return baseUrl;
    };
});

tenureApp.factory('fileUpload', function($http, contextService) {
    return {
        uploadFileToUrl: function(callback, errorCallback, file, appId, uploadUrl) {
            var fd = new FormData();
            fd.append('file', file);
            fd.append('appId', appId);
            $http.post(contextService.baseUrl() + uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).success(callback).error(errorCallback);
        }
    };
});

tenureApp.factory('dataService', function($http, contextService) {
    var URL_BASE = contextService.baseUrl();
    return {
        baseUrl: function() {
            return URL_BASE;
        },
        loadData: function(callback, url) {
            $http.get(encodeURI(URL_BASE + url)).success(callback).error(function(data, status) {
                console.log('Error in dataService.loadData; status: ', status);
            });
        },
        delData: function(callback, url) {
            $http.post(encodeURI(URL_BASE + url)).success(callback).error(function(data, status) {
                console.log('Error in dataService.delData; status: ', status);
            });
        },
        saveData: function(callback, url, data) {
            $http.post(encodeURI(URL_BASE + url), data).success(callback).error(function(data, status) {
                console.log('Error in dataService.saveData; status: ', status);
            });
        },
        personSearch: function(callback, search) {
            this.loadData(callback, '/api/application/lookupName?search=' + encodeURI(search));
        }
    };
});
