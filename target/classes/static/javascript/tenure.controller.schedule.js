(function() {

    function ScheduleAddDialog($scope, $uibModalInstance, $log, initialDate, jobCode, App) {
        $scope.jobCode = jobCode;
        $scope.initialDate = initialDate;

        $scope.hstep = 1;
        $scope.mstep = 1;
        $scope.ismeridian = true;

        $scope.ok = function() {
            var dataObj = {
                jobCode: $scope.jobCode,
                initialDate: $scope.initialDate
            };
            $uibModalInstance.close(dataObj);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };

        $scope.popup1 = {
            opened: false
        };
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };
        $scope.changed = function() {
            $log.debug('e. Time changed to: ' + $scope.initialDate);
        };
        // Disable weekend selection.
        function disabled(data) {
            var date = data.date, mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }
        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1,
            showWeeks: false
        };
        $scope.formats = [ 'MM/dd/yyyy', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate' ];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = [ 'M!/d!/yyyy' ];

        function getDayClass(data) {
            var date = data.date, mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
            return '';
        }

    }
    tenureApp.controller("ScheduleAddDialog", ScheduleAddDialog);

    function ScheduleDeleteDialog($scope, $uibModalInstance, schedule) {
        $scope.schedule = schedule;

        $scope.ok = function(schedule) {
            $uibModalInstance.close(schedule);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss("cancel");
        };
    }
    tenureApp.controller("ScheduleDeleteDialog", ScheduleDeleteDialog);

    function ScheduleJsController($scope, $uibModal, $log, dataService, App) {

        $scope.schedules = [];

        $scope.init = function() {
            dataService.loadData(function(data) {
                $scope.schedules = data;
            }, App.URL.SCHEDULE_JOB_LIST);
        };

        // Add Schedule Dialog.
        $scope.addSchedule = function() {
            $scope.initialDate = new Date();
            $scope.initialDate.setSeconds(0);
            $scope.jobCode = 'J1';

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ScheduleAddModalTemplateId',
                controller: 'ScheduleAddDialog',
                scope: $scope,
                resolve: {
                    initialDate: function() {
                        return $scope.initialDate;
                    },
                    jobCode: function() {
                        return $scope.jobCode;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                dataService.saveData(function(data) {
                    $scope.schedules.push(data);
                }, App.URL.SCHEDULE_JOB_ADD, data);
            }, function() {
                $log.debug('Add Schedule dismissed at: ' + new Date());
            });

        };

        // Remove Schedule Dialog.
        $scope.removeSchedule = function(schedule) {
            $scope.schedule = schedule;

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ScheduleDeleteModalTemplateId',
                controller: 'ScheduleDeleteDialog',
                resolve: {
                    schedule: function() {
                        return $scope.schedule;
                    }
                }
            });

            modalInstance.result.then(function(dataObj) {
                var key = encodeURI(dataObj.jobName);
                var postUrl = App.URL.SCHEDULE_JOB_DELETE + '/' + key + '/';
                dataService.delData(function(data) {
                    $log.debug("ScheduleJsController.remove; id: >" + dataObj.jobName + "<")
                    var index = $scope.schedules.indexOf(dataObj);
                    $scope.schedules.splice(index, 1);
                }, postUrl);
            }, function() {
                $log.debug('ScheduleJsController; modal canceled.');
            });
        };
    }
    tenureApp.controller("ScheduleJsController", ScheduleJsController);

})();
