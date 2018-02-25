angular
  .module('org.iimsoft.iimbpmble.repeatable', ['org.iimsoft.iimbpmble'])
  .directive('columnTemplate', function($compile, $timeout) {
    return {
      restrict: 'A',
      scope: true,
      link: function(scope, element, attr) {
        element.html(attr.columnTemplate
          .replace('th', 'div')
          .replace('td', 'div'));
        var template = element.contents();
        $compile(template)(scope);
        // wait digest cycle to compile template
        $timeout(function() {
          [].slice.call(template[0].attributes).forEach(function(attribute) {
            element.attr(attribute.name, attribute.value);
          });
          element.append(template.contents());
          template.remove();
        }, 0);
      }
    };
  })
/**
 * @ngdoc directive
 * @name iimbpm.repeatable:boRepeatable
 * @module iimbpm.repeatable
 *
 * @param {String=} boRepeatable a string representing a valid css selector
 *                  matching the thead where the columns are defined. By default the value is
 *                  ``thead tr:last-child``
 *
 * @description
 * Render table content dynamically in order to perform some columns manipulation
 * like show/hide or re-ordering. The directive will reconstruct a ng-repeat
 * under the hood to perform this but allow developper to get rid of it when
 * display the input. No need to add a generic function for cell rendering like
 * you will do when you put 2 ng-repeat directive inside.
 *
 * @example
 *
 * ```html
 *   <table iimbpmble bo-repeatable repeatable-config="colcfg" class="table">
 *     <thead>
 *       <tr>
 *         <td colspan="{{$columns.length}}" class="form-inline">
 *           <pre>{{$columns|json}}</pre>
 *           <label ng-repeat="col in $columns"><input type="checkbox" ng-model="col.visible"/>{{col.name}}</label>
 *         </td>
 *       </tr>
 *       <tr>
 *         <th>name</th>
 *         <th>country</th>
 *         <th data-ignore>action</th>
 *       </tr>
 *     </thead>
 *     <tbody>
 *       <tr ng-repeat="user in users">
 *         <td>{{user.name}}</td>
 *         <td>{{user.country}}</td>
 *         <td><button>&times;</button></td>
 *       </tr>
 *     </tbody>
 *   </table>
 * ```
 * ```javascript
 *   angular
 *     .module('boRepeaterExample', [
 *       'org.iimsoft.iimbpmble',
 *       'org.iimsoft.iimbpmble.repeatable',
 *       'org.iimsoft.templates'
 *     ])
 *     .run(function($scope){
 *       $scope.users = [
 *         {name:'Paul', country:'Uk'},
 *         {name:'Sarah', country:'Fr'},
 *         {name:'Jacques', country:'Us'},
 *         {name:'Joan', country:'Al'},
 *         {name:'Tite', country:'Jp'},
 *       ];
 *       $scope.colcfg =[true, false];
 *     })
 * ```

 */
.directive('boRepeatable', ['$interpolate',
  function($interpolate) {
    return {
      require: 'iimbpmble',
      restrict: 'A',
      compile: function(elem, attr, $scope) {

        var thSelecter = attr[this.name] || 'thead tr:last-child';
        var tdSelecter = 'tr[ng-repeat]';

        var header = elem[0].querySelector(thSelecter);
        var row = elem[0].querySelector(tdSelecter);

        if (!header || !row || header.children.length !== row.children.length) {
          throw new Error('bo-repeatable th number does not correspond to td number. please verify you html table');
        }

        var columns = [];
        var tdCells = row.children;

        var insertIndex;
        [].some.call(header.children, function(th, index) {
          insertIndex = index;
          return th.getAttribute('data-ignore') === null;
        });


        /**
         * filter helper to test if data-ignore attribute is present on a Node
         * @param  {Object} item  an object containing both th and td node
         * @return {Boolean}      true id data-ignore is present
         */
        function filterIgnoreCell(item) {
          return item.th.getAttribute('data-ignore') === null;
        }

        /**
         * dynamic filter function for filtering repeated columns
         * @param  {string}  Prop
         * @param  {Object}  column
         * @return {Boolean}
         */
        function columnFilter(prop, column) {
          return column[prop] === true;
        }
        var prop = attr.visibleProp || 'visible';

        columns = [].map.call(header.children, function(th, index) {
            return {
              th: th,
              td: tdCells[index]
            };
          })
          .filter(filterIgnoreCell)
          .map(function(item) {
            angular.element(item.th).remove();
            angular.element(item.td).remove();
            var o = {
              name: $interpolate(item.th.textContent)($scope),
              header: item.th.outerHTML,
              cell: item.td.outerHTML
            };
            o[prop] = angular.isUndefined(item.th.getAttribute) || angular.isUndefined(item.th.getAttribute(prop)) || ((item.th.getAttribute(prop) === 'false') ? false : true);
            o.toRemoveExpression = item.th.getAttribute('remove-column');
            return o;
          });

        /**
         * create an HTMLElement for column-template which hold the ng-repeat
         * @param  {String} tagName
         * @param  {String} template
         * @return {HTMLElement}
         */
        function createNode(tagName, template) {
          var el = document.createElement(tagName);
          el.setAttribute('column-template', template);
          el.setAttribute('ng-repeat', 'column in $columns | filter:$visibilityFilter');

          return el;
        }
        var thRepeat = createNode('th', '{{::column.header}}');
        var tdRepeat = createNode('td', '{{::column.cell}}');

        header.insertBefore(thRepeat, header.children[insertIndex]);
        row.insertBefore(tdRepeat, row.children[insertIndex]);

        return function($scope) {
          $scope.$columns = columns.filter(isCellNotToRemove);
          $scope.$visibilityFilter = columnFilter.bind(null, prop);

          function isCellNotToRemove(item) {
            return !(!!item.toRemoveExpression && $interpolate(item.toRemoveExpression)($scope) === 'true');
          }
        };
      }
    };
  }
])

/**
   * @ngdoc directive
   * @name iimbpm.repeatable:repeatableConfig
   * @module iimbpm.repeatable
   *
   * @description
   * Allow preseting the visible property for each columns
   *
   * @param {String} visible-prop the name of the visible property to update in $columns arrays
   *
   * @example
    <example module="boRepeatConfigExample">
      <file name="index.html">
        <table iimbpmble bo-repeatable repeatable-config="colcfg" class="table">
          <thead>
            <tr >
              <td  ng-repeat="col in $columns">
                <span>column <strong>{{col.name}}</strong> is {{(col.visible? 'shown':'hided')}}</span>
              </td>
            </tr>
            <tr>
              <th>name</th>
              <th>country</th>
            </tr>
          </thead>
          <tbody>
            <tr ng-repeat="user in users">
              <td>{{user.name}}</td>
              <td>{{user.country}}</td>
            </tr>
          </tbody>
        </table>
      </file>
      <file name="script.js">
        angular
          .module('boRepeatConfigExample', [
            'org.iimsoft.iimbpmble',
            'org.iimsoft.iimbpmble.repeatable',
            'org.iimsoft.templates'
          ])
          .run(function($rootScope){
            $rootScope.users = [
              {name:'Paul', country:'Uk'},
              {name:'Sarah', country:'Fr'},
              {name:'Jacques', country:'Us'},
              {name:'Joan', country:'Al'},
              {name:'Tite', country:'Jp'},
            ];
            $rootScope.colcfg =[true, false];

          })
      </file>
    </example>
   */
.directive('repeatableConfig', function() {
  return {
    priority: 2,
    require: 'iimbpmble',
    link: function(scope, elem, attr) {
      scope.$watch(attr.repeatableConfig, function(visibleConfig) {
        var prop = attr.visibleProp || 'visible';
        if (visibleConfig.length !== scope.$columns.length) {
          throw new Error('repeatable-config size differ from $columns size. Please check your config attr');
        }
        scope.$columns.forEach(function(item, index) {
          item[prop] = visibleConfig[index];
        });
      });
    }
  };
});
