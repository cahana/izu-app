describe("AppointmentJsController", function() {

    beforeEach(module('tenureApp'));

    var scope;
    var controller;

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        controller = $controller('AppointmentJsController', {
            $scope: scope
        });
    }));

    it("checkInitTypeFunction", function() {
        spyOn(scope, "loadTypeData").and.callFake(function() {
            scope.types.push({
                "id": "09",
                "description": "9 Month"
            });
            scope.types.push({
                "id": "11",
                "description": "11 Month"
            });
        });

        expect(controller).toBeDefined();
        expect(scope.types).toBeDefined();
        expect(scope.types.length).toEqual(0);

        // What we are testing:
        scope.init_type();

        expect(scope.loadTypeData).toHaveBeenCalled();
        expect(scope.types).toBeDefined();
        expect(scope.types.length).toEqual(2);
        expect(scope.ranks.length).toEqual(0);

        expect(scope.types[0].id).toEqual("09");
        expect(scope.types[0].description).toEqual("9 Month");

        expect(scope.types[1].id).toEqual("11");
        expect(scope.types[1].description).toEqual("11 Month");
    });

    it("checkInitRankFunction", function() {
        spyOn(scope, "loadRankData").and.callFake(function() {
            scope.ranks.push({
                "id": "C2",
                "description": "Instructor"
            });
            scope.ranks.push({
                "id": "C3",
                "description": "Assistant Professor"
            });
            scope.ranks.push({
                "id": "C4",
                "description": "Associate Professor"
            });
            scope.ranks.push({
                "id": "C5",
                "description": "Professor"
            });
        });

        expect(controller).toBeDefined();
        expect(scope.ranks).toBeDefined();
        expect(scope.ranks.length).toEqual(0);

        // What we are testing:
        scope.init_rank();

        expect(scope.loadRankData).toHaveBeenCalled();
        expect(scope.ranks).toBeDefined();
        expect(scope.ranks.length).toEqual(4);
        expect(scope.types.length).toEqual(0);

        expect(scope.ranks[0].id).toEqual("C2");
        expect(scope.ranks[0].description).toEqual("Instructor");

        expect(scope.ranks[1].id).toEqual("C3");
        expect(scope.ranks[1].description).toEqual("Assistant Professor");

        expect(scope.ranks[2].id).toEqual("C4");
        expect(scope.ranks[2].description).toEqual("Associate Professor");

        expect(scope.ranks[3].id).toEqual("C5");
        expect(scope.ranks[3].description).toEqual("Professor");
    });

});
