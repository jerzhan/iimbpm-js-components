'use strict';

describe('storable directive', function() {
  var scope;
  var storageId = 'testStorage';
  var localStorageContent = [];
  localStorageContent[storageId] = {
    'columns': [{
      'name': 'Index',
      'header': '<th bo-sorter=\'index\'>Index</th>',
      'cell': '<td>{{::item.index}}</td>',
      'visible': true,
      'toRemoveExpression': null
    }, {
      'name': 'Nom',
      'header': '<th bo-sorter=\'name\' bo-sorter-title-desc=\'Sort by name\' bo-sorter-title-asc=\'Sort by name (reverse)\'>Nom</th>',
      'cell': '<td>{{::item.name}}</td>',
      'visible': true,
      'toRemoveExpression': null
    }, {
      'name': 'gender',
      'header': '<th bo-sorter=\'gender\'>gender</th>',
      'cell': '<td>{{::item.gender}}</td>',
      'visible': true,
      'toRemoveExpression': null
    }],
    'sortOptions': {
      'property': 'email',
      'direction': true
    },
    'itemsPerPage': 10
  };


  beforeEach(module('org.iimsoft.iimbpmble'));
  beforeEach(module('org.iimsoft.iimbpmble.storable'));


  beforeEach(inject(function($rootScope, $localStorage) {
    scope = $rootScope.$new();
    //clean up the localstorage values
    delete $localStorage[storageId];
  }));


  it('should throw an exception when no storage id is given', inject(function($document, $compile) {
    var markup = '<div><table iimbpmble bo-storable></table></div>';

    function test() {
      $compile(markup)(scope);
      scope.$digest();
    }
    expect(test).toThrow();
  }));

  it('should init the local storage with the given id', inject(function($document, $compile, $localStorage) {
    //Given
    var markup = '<div>' +
      '<table iimbpmble bo-storable="' + storageId + '">' +
      '  <thead>' +
      '    <tr>' +
      '       <th>ID</th>' +
      '    </tr>' +
      '  </thead>' +
      '</table>' +
      '</div>';
    var tableScope;


    //When
    var elt = $compile(markup)(scope);
    tableScope = elt.find('table[iimbpmble]').scope();

    //Then
    expect($localStorage[storageId]).toBeDefined();
    expect($localStorage[storageId]).toEqual({
      columns: null,
      sortOptions: null,
      itemsPerPage: null
    });
  }));

  it('should set the table scope properties with the local storage values', inject(function($document, $compile, $localStorage) {
    //Given
    //set the localstorage in order to check if the scope gets localstorage values

    $localStorage[storageId] = {};
    $localStorage[storageId].columns = localStorageContent[storageId].columns;
    $localStorage[storageId].sortOptions = localStorageContent[storageId].sortOptions;
    $localStorage[storageId].itemsPerPage = localStorageContent[storageId].itemsPerPage;

    var markup = '<div>' +
      '<table iimbpmble bo-storable="' + storageId + '" sort-options="sortableOptions" on-sort="sortHandler(options)" on-storage-loaded="notifyStorageLoaded()">' +
      '  <thead>' +
      '    <tr>' +
      '       <th>ID</th>' +
      '    </tr>' +
      '  </thead>' +
      '</table>' +
      '</div>';

    var tableScope;

    scope.notifyStorageLoaded = function() {
      scope.storageLoaded = true;
    };

    //When
    scope.sortableOptions = {};
    scope.pagination = {};
    var elt = $compile(markup)(scope);
    var tableElement = elt.find('table[iimbpmble]');
    tableScope = tableElement.scope();

    //Then
    expect(tableScope.$columns).toEqual(localStorageContent[storageId].columns);
    expect(scope.sortableOptions).toEqual(localStorageContent[storageId].sortOptions);
    expect(scope.pagination.itemsPerPage).toEqual(localStorageContent[storageId].itemsPerPage);
    expect(scope.storageLoaded).toBeTruthy();
  }));
});