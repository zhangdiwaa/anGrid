//common module: dropdownTable
angular.module('dropdownTable',[])
	.directive('dropdowntable', function() {
	    return {
	      restrict: 'E',
	      transclude: true,
	      scope: {
	      	thead : '=dropdowntableThead', //array, title of table thead
	      	data : '=dropdowntableData', //object, content of table tbody
	      	data_attr_name : '=dropdowntableDataAttr', //array, the name of attr which should be show of the data object
	      	model : '=dropdowntableModel'//object, return select object
	      },
	      link: function($scope, $element) {
	        $scope.selecting = function(obj){
				$scope.select_show = false;
				$scope.select_value = obj[$scope.data_attr_name[0]];
				$scope.model = obj;				
			}      
	      },
	      template:
	      '<div>' +
	        '<input type="text" name="flavor_name" class="dropdown-select" ng-model="select_value" ng-init="select_show=false" ng-click="select_show=true" readonly="readonly">' +
	      	'<div  class="dropdown-select-wrapper">' +            	
	            '<table class="dropdown-select-table" ng-show="select_show" ng-model="select_show">' +
	                '<thead>' +
	                    '<tr>' + 
	                        '<th ng-repeat="head in thead">{{head}}</th>' +
	                    '</tr>' +
	                '</thead>' +
	                '<tbody>' + 
                        '<tr ng-repeat="d in data" ng-click="selecting(d)">' +
                        	'<td ng-repeat="n in data_attr_name">{{d[n]}}</td>' +
                        '</tr>' +
                    '</tbody>' +
	            '</table>' +
			'</div>' +
		  '</div>',      
	      replace: true
	    };
  })