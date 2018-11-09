(function() {

    function CustomerJsController($scope, $http, $window, $uibModal, dataService, App) {

        const URL_BASE = dataService.baseUrl();
        const URL_LOAD_CUSTOMERS = URL_BASE + '/api/customers';
        const URL_LOAD_TYPES = URL_BASE + '/api/types';

        $scope.customers= [];
        $scope.types= [];

        $scope.init = function() {
        	dataService.loadData(function(data) {
                $scope.customers = data;
            }, App.URL.CUSTOMER_LIST);
        	dataService.loadData(function(data) {
                $scope.types = data;
            }, App.URL.TYPE_LIST);
        }

        $scope.searchFilter = function() {
            return function(a) {
                var searchText = $scope.searchForCustomer;
                if (angular.isUndefined(searchText)) {
                    return true;
                }

                searchText = searchText.trim().toLowerCase();
                if (searchText == "") {
                    return true;
                }

                if (a.id.toString().indexOf(searchText) != -1) {
                    return true;
                }
                if (a.firstName.toLowerCase().indexOf(searchText) != -1) {
                    return true;
                }
                if (a.lastName.toLowerCase().indexOf(searchText) != -1) {
                    return true;
                }
                if (a.email.toLowerCase().indexOf(searchText) != -1) {
                    return true;
                }

                return false;
            }
        };

        $scope.wCustomers = function() {
            return $window.customers;
        }
        $scope.wTypes = function() {
            return $window.types;
        }
        
        // Add Customer Dialog
        $scope.addCustomer = function() {
            $scope.firstName = '';
            $scope.lastName = '';
            $scope.email = '';
            $scope.m1 = '';
            $scope.m2 = '';
            $scope.m3 = '';
            //$scope.offices = offices;
            //$scope.selectedOffice = offices[0];
            //$scope.roless = roles;
            //$scope.selectedRole = roles[1]; // 1 is Coordinator which is more common

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'CustomerAddModalTemplateId',
                controller: 'CustomerAddDialog',
                scope: $scope,
                resolve: {
                    firstName: function() {
                        return $scope.firstName;
                    },
                    lastName: function() {
                        return $scope.lastName;
                    },
                    email: function() {
                        return $scope.email;
                    },
                    m1: function() {
                        return $scope.m1;
                    },
                    m2: function() {
                        return $scope.m2;
                    },
                    m3: function() {
                        return $scope.m3;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                // changing cursor and showing temporary
                // progress bar
                $("body").css("cursor", "progress");
                var $modal = $('.js-loading-bar'), $bar = $modal.find('.progress-bar');
                $modal.modal('show');
                $bar.addClass('animate');
                dataService.saveData(function(data) {
                    console.log('addCustomer -> saveData success.', data);
                    $scope.customers.push(data);
                    // changing cursor back and
                    // removing progress bar
                    $("body").css("cursor", "default");
                    $bar.removeClass('animate');
                    $modal.modal('hide');
                }, App.URL.CUSTOMER_ADD, data);
            }, function() {
                console.log('A. Modal dismissed at: ' + new Date());
            });

        };
    }
    izuApp.controller("CustomerJsController", CustomerJsController);
    
    function CustomerAddDialog($scope, $uibModalInstance, dataService, firstName, lastName, email, m1,
            m2, m3) {
        $scope.firstName = firstName;
        $scope.lastName = lastName;
        $scope.email= email;
        $scope.m1 = m1;
        $scope.m2 = m2;
        $scope.m3 = m3;
        $scope.mydisabled = true;

        $scope.ok = function() {
            var dataObj = {
            	firstName: $scope.firstName,
            	lastName: $scope.lastName,
            	email: $scope.email,
                m1: $scope.m1,
                m2: $scope.m2,
                m3: $scope.m3
            };
            $uibModalInstance.close(dataObj);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

        //function exists(uhUuid, myArray) {
          //  for (var i = 0; i < myArray.length; i++) {
            //    if (myArray[i].person.uhUuid === uhUuid) {
              //      return true;
               // }
            //}
            //return false;
        //}
    }
    izuApp.controller('CustomerAddDialog', CustomerAddDialog);
    
})();
