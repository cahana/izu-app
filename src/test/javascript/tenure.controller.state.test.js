describe('StateJsController', function() {

    beforeEach(module('tenureApp'));

    var scope;
    var controller;

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        controller = $controller('StateJsController', {
            $scope: scope
        });
    }));

    it('checkInitFunction', function() {
        spyOn(scope, 'loadData').and.callFake(function() {
            scope.states.push({
                'id': 1,
                'description': 'initialized'
            });
            scope.states.push({
                'id': 9,
                'description': 'finalized'
            });
        });

        expect(controller).toBeDefined();
        expect(scope.states).toBeDefined();
        expect(scope.states.length).toEqual(0);

        // What we are testing:
        scope.init();

        expect(scope.loadData).toHaveBeenCalled();
        expect(scope.states).toBeDefined();
        expect(scope.states.length).toEqual(2);

        expect(scope.states[0].id).toEqual(1);
        expect(scope.states[0].description).toEqual('initialized');

        expect(scope.states[1].id).toEqual(9);
        expect(scope.states[1].description).toEqual('finalized');
    });

});
