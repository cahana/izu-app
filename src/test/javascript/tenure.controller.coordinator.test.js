describe("CoordinatorAddDialog", function() {

    beforeEach(module('tenureApp'));

    var scope;
    var controller;
    var dataService;
    var uhUuid = "123";
    var offices;
    var selectedOffice = {
        id: "its"
    };

    function ModalInstance(offices) {
        this.value = null;
        this.close = function(value) {
            this.value = value;
            offices.push(value);
        };
        this.dismiss = function(value) {
            this.value = value;
        };
        this.getValue = function() {
            return this.value;
        }
    }
    var modalInstance;

    // function CoordinatorAddDialog($scope, $uibModalInstance, dataService, uhUuid, offices, selectedOffice) {

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        offices = [];
        modalInstance = new ModalInstance(offices);
        controller = $controller('CoordinatorAddDialog', {
            $scope: scope,
            $uibModalInstance: modalInstance,
            dataService: dataService,
            uhUuid: uhUuid,
            offices: offices,
            selectedOffice: selectedOffice
        });
    }));

    it("check fields", function() {
        expect(controller).toBeDefined();
        expect(scope).toBeDefined();
        expect(scope.uhUuid).toBeDefined();
        expect(scope.selectedOffice).toBeDefined();
        expect(scope.uhUuid).toEqual(uhUuid);
        expect(scope.offices).toBeDefined();
        expect(scope.offices.length).toEqual(0);
        var office = scope.selectedOffice;
        expect(office).toEqual(selectedOffice);
    });

    it("submit ok", function() {
        expect(controller).toBeDefined();
        expect(scope).toBeDefined();

        expect(modalInstance.getValue()).toBeNull();

        // What we are testing:
        scope.ok();

        var data = modalInstance.getValue();
        expect(data).not.toBeNull();
        expect(data.uhUuid).toEqual("123");
        expect(data.officeId).toEqual("its");
        expect(data.office.id).toEqual("its");

        expect(scope.offices.length).toEqual(1);
        expect(scope.offices[0].uhUuid).toEqual("123");
        expect(scope.offices[0].officeId).toEqual("its");
        expect(scope.offices[0].office.id).toEqual("its");

    });

    it("submit cancel", function() {
        expect(controller).toBeDefined();
        expect(scope).toBeDefined();
        expect(modalInstance.getValue()).toBeNull();

        // What we are testing:
        scope.cancel();

        expect(modalInstance.getValue()).toEqual("cancel");
    });
});

describe("CoordinatorEditDialog", function() {

    beforeEach(module('tenureApp'));

    var scope;
    var controller;

    function ModalInstance() {
        this.value = null;
        this.close = function(value) {
            this.value = value;
        };
        this.dismiss = function(value) {
            this.value = value;
        };
        this.getValue = function() {
            return this.value;
        }
    }
    var modalInstance;

    var coordinator = {
        uhUuid: "12345678",
        office: {
            id: 666
        },
        person: {
            id: 333
        }
    };
    var offices = [];
    var selectedOffice = {
        id: 0
    };

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        modalInstance = new ModalInstance();
        controller = $controller('CoordinatorEditDialog', {
            $scope: scope,
            $uibModalInstance: modalInstance,
            coordinator: coordinator,
            offices: offices,
            selectedOffice: selectedOffice

        });
    }));

    it("check fields", function() {
        expect(controller).toBeDefined();
        expect(scope.coordinator).toBeDefined();
        expect(scope.offices).toBeDefined();
        expect(scope.offices.length).toEqual(0);
        expect(scope.uhUuid).toBeDefined();
        expect(scope.isOfficeChanged).toBeDefined();

        expect(scope.uhUuid).toEqual("12345678");
        expect(scope.coordinator.office.id).toEqual(666);
        expect(scope.isOfficeChanged).toEqual(false);
        expect(scope.coordinator.person.id).toEqual(333);
    });

    it("office change", function() {
        expect(controller).toBeDefined();
        expect(scope).toBeDefined();

        expect(scope.isOfficeChanged).toEqual(false);
        expect(scope.coordinator.office.id).toEqual(666);
        var selectedOffice = {
            id: 555
        };
        scope.officeChange(selectedOffice);
        expect(scope.isOfficeChanged).toEqual(true);
    });

    it("submit ok", function() {
        expect(controller).toBeDefined();
        expect(scope).toBeDefined();
        expect(modalInstance).toBeDefined();
        expect(modalInstance.getValue()).toBeNull();
        expect(scope.isOfficeChanged).toEqual(false);

        var selectedOffice = {
            id: 555,
            campus: {
                description: ""
            }
        };
        scope.officeChange(selectedOffice);

        // What we are testing:
        scope.ok(selectedOffice);

        //expect(modalInstance.getValue().id).toEqual(555);
    });

    it("submit cancel", function() {
        expect(controller).toBeDefined();
        expect(scope).toBeDefined();
        expect(modalInstance.getValue()).toBeNull();

        // What we are testing:
        scope.cancel();

        expect(modalInstance.getValue()).toEqual("cancel");
    });
});

describe("CoordinatorDeleteDialog", function() {

    beforeEach(module('tenureApp'));

    var scope;
    var controller;

    function ModalInstance() {
        this.value = null;
        this.close = function(value) {
            this.value = value;
        };
        this.dismiss = function(value) {
            this.value = value;
        };
        this.getValue = function() {
            return this.value;
        }
    }
    var modalInstance;

    var coordinator = {
        uhUuid: "87654321",
        office: {
            id: 999
        }
    };
    var offices = [];
    var selectedOffice;

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        modalInstance = new ModalInstance();
        controller = $controller('CoordinatorDeleteDialog', {
            $scope: scope,
            $uibModalInstance: modalInstance,
            coordinator: coordinator,
            offices: offices
        });
    }));

    it("check fields", function() {
        expect(controller).toBeDefined();
        expect(scope.coordinator).toBeDefined();
        expect(scope.offices).toBeDefined();
        expect(scope.offices.length).toEqual(0);

        expect(scope.coordinator.office.id).toEqual(999);
        expect(scope.coordinator.uhUuid).toEqual("87654321");
    });

    it("submit ok", function() {
        expect(controller).toBeDefined();
        expect(scope).toBeDefined();
        expect(modalInstance).toBeDefined();
        expect(modalInstance.getValue()).toBeNull();

        var coordinator = {
            id: 777
        };

        // What we are testing:
        scope.ok(coordinator);

        expect(modalInstance.getValue().id).toEqual(777);
    });

    it("submit cancel", function() {
        expect(controller).toBeDefined();
        expect(scope).toBeDefined();
        expect(modalInstance.getValue()).toBeNull();

        // What we are testing:
        scope.cancel();

        expect(modalInstance.getValue()).toEqual("cancel");
    });
});
