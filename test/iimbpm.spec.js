'use strict';

describe('iimbpmble directive', function(){
  var element;
  var scope;
  var $timeout;

  beforeEach(module('org.iimsoft.iimbpmble'));

  beforeEach(inject(function($rootScope, $compile, $document) {
    scope = $rootScope.$new();


    var markup =
        '<div>'+
        '<table iimbpmble>'+
        '  <thead>'+
        '    <tr>'+
        '       <th>{{header}}</th>' +
        '    </tr>'+
        '  </thead>'+
        '  <tbody>'+
        '    <tr>'+
        '       <td>{{user}}</td>' +
        '    </tr>'+
        '  </tbody>'+
        '</table>'+
        '</div>';
    scope.header = 'Name';
    scope.user = 'Bob';

    element = $compile(markup)(scope);
    $document.find('body').append(element);
    scope.$digest();
  }));

  it('should transclude table content', function(){
    var th = element.find('thead tr th').text().trim();
    var td = element.find('tbody tr td').text().trim();

    expect(th).toEqual(scope.header);
    expect(td).toEqual(scope.user);
  });

  it('should expose $selectedItems', function(){
    var scope = element.find('table').scope();
    expect(scope.$selectedItems).toEqual([]);
  });

  it('should expose $allSelected', function(){
    var scope = element.find('table').scope();
    expect(scope.$allSelected).toEqual(true);
  });

  it('should expose $toggleAll method', function(){
    var scope = element.find('table').scope();
    expect(Object.prototype.toString.call(scope.$toggleAll)).toMatch(/function/i);
  });

  describe('IimbpmbleController', function(){
    var controller;
    var item = {
      data: 1,
      value: false,
      isChecked:function(){
        return this.value;
      },
      setChecked: function (val) {
        this.value = val === true;
      }
    }, item2 = {
      data: 2,
      value: true,
      isChecked:function(){
        return this.value;
      },
      setChecked: function (val) {
        this.value = val === true;
      }
    };


    beforeEach(inject(function($controller ){
      scope.sortOptions = {property:'user'};
      scope.onSort = jasmine.createSpy('onSort');
      controller = $controller('IimbpmbleController', {'$scope': scope});


      spyOn(controller, 'registerSelector').and.callThrough();

      item.setChecked(false);
    }));

    it('should return options parameter', function(){
      var opt = controller.getOptions();
      expect(opt).toEqual(scope.sortOptions);
    });

    it('should trigger scope.onSort when call onSort', function(){
      var opt = controller.triggerSortHandler('test');
      expect(scope.onSort).toHaveBeenCalledWith({options:'test'});
    });

    it('should expose a registerSelector', function(){
      controller.registerSelector(item);
      expect(controller.registerSelector).toHaveBeenCalledWith(item);
    });

    describe('prepareScope', function(){
      var fakeScope;
      beforeEach(function(){
        fakeScope = {};
        controller.prepareScope(fakeScope);
      });

      it('should expose a $selectedItems', function(){
        expect(fakeScope.$selectedItems.length).toBe(0);
        controller.registerSelector(item);
        item.setChecked(true);
        expect(fakeScope.$selectedItems.length).toBe(1);
        item2.setChecked(true);
        controller.registerSelector(item2);
        expect(fakeScope.$selectedItems.length).toBe(2);
        controller.unregisterSelector(item);
        expect(fakeScope.$selectedItems.length).toBe(1);
        expect(fakeScope.$selectedItems ).toEqual([item2.data]);
      });

      it('should expose $allSelected', function(){
        controller.registerSelector(item);
        controller.registerSelector(item);
        expect(fakeScope.$allSelected).toBe(false);
        item.setChecked(true);
        expect(fakeScope.$allSelected).toBe(true);
      });

      it('should toggle all the items ', function(){
        controller.registerSelector(item);
        controller.registerSelector(item);
        expect(fakeScope.$allSelected).toBe(false);
        fakeScope.$toggleAll();
        expect(fakeScope.$allSelected).toBe(true);
      });

    })


  })

});


