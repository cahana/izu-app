'use strict';
var izuApp = angular.module('izuApp', [ 'ui.bootstrap', 'ui.tree' ]);

izuApp.constant('App', {

    URL: {
        TYPE_LIST: '/api/types',
        CUSTOMER_LIST: '/api/customers',
        CUSTOMER_ADD: '/api/customers/add',
        CUSTOMER_EDIT: '/api/customers/edit',
        CUSTOMER_DELETE: '/api/customers/delete'

    }
});

izuApp.service('contextService', function($location) {
    this.baseUrl = function() {
        var host = $location.host();

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

izuApp.factory('dataService', function($http, contextService) {
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
        }
    };
});

izuApp.factory('dataProvider', function($http) {
    return {
        loadData: function(callback, url) {
            $http.get(encodeURI(url)).success(callback).error(function(data, status) {
                console.log('Error in dataProvider; status: ', status);
            });
        },
        delData: function(callback, url) {
            $http.post(encodeURI(url)).success(callback).error(function(data, status) {
                console.log('Error in dataProvider; status: ', status);
            });
        },
        saveData: function(callback, url, data) {
            $http.post(encodeURI(url), data).success(callback).error(function(data, status) {
                console.log('Error in dataProvider; status: ', status);
            });
        }
    }
});