/**
 * Created by fabiolombardi on 15/07/2015.
 */
angular
    .module('org.iimsoft.iimbpmble.storable', [
        'org.iimsoft.iimbpmble',
        'ngStorage'
    ])
    .directive('boStorable', function($localStorage) {
        return {
            restrict: 'A',
            require: '^iimbpmble',
            priority: 1,
            link: function(scope, elt, attr, iimbpmbleCtrl) {
                var storageId = attr.boStorable;
                if (!storageId) {
                    throw new Error('you must set a storageId to bo-storable');
                }

                scope.clearTableStorage = function clearTableStorage(storageId) {
                    delete $localStorage[storageId];
                };

                if (!$localStorage[storageId]) {
                    $localStorage[storageId] = {};
                }
                if ($localStorage[storageId].columns) {
                    scope.$columns = $localStorage[storageId].columns;
                } else {
                    $localStorage[storageId].columns = null;
                }
                if ($localStorage[storageId].sortOptions) {
                    iimbpmbleCtrl.getOptions().property = $localStorage[storageId].sortOptions.property;
                    iimbpmbleCtrl.getOptions().direction = $localStorage[storageId].sortOptions.direction;
                } else {
                    $localStorage[storageId].sortOptions = null;
                }
                if ($localStorage[storageId].itemsPerPage) {
                  scope.pagination.itemsPerPage = $localStorage[storageId].itemsPerPage;
                } else {
                  $localStorage[storageId].itemsPerPage = null;
                }


                scope.$watch(iimbpmbleCtrl.getOptions, function(newValue) {
                    $localStorage[storageId].sortOptions = newValue;
                }, true);

                scope.$watch('$columns', function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $localStorage[storageId].columns = newValue;
                    }
                }, true);

                scope.$watch('pagination.itemsPerPage', function(newValue) {
                  $localStorage[storageId].itemsPerPage = newValue;
                }, true);

                iimbpmbleCtrl.onStorageLoaded();
            }
        };
    });
