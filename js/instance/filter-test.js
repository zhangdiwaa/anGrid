//main mudule: instanceApp    
angular.module('instanceApp', ['instanceApp.services', 'commonFilter', 'anGrid'])
    .controller('instanceApp.controller', function ($scope, instancesData) {
	    $scope.mySelections = [];
    	$scope.myData = [{
  			 "string": "ABC",
      		 "number": 10.6,
      		 "object": {wa:"wa"},
      		 "array": [1,2,3],
      		 "bolean": true,
      		 "undefined" : undefined,
      		 "Null": null,
      		 "NaN": NaN,
      		 "function": function(){return "wa"},
      		 "withFilter" : "active",
      		 "withTemplete" : "paomian"
  		}];

   		$scope.angridOptions = {
    		angridStyle:			     "th-list",
    		multiSelectRows:             true, //多选
    		multiSelectWithCheckbox:     true, //只能用多选框多选
			data:                        'myData', //数据输入
	        selectedItems:                $scope.mySelections, //返回选中对象
		    columnDefs: 					 //用一个对象数组定义每一列
		    [ 
				{ field: 'string', displayName:'string'}
                ,{ field: 'number', displayName:'number'}
                ,{ field: 'object', displayName:'object'}
                ,{ field: 'array', displayName:'array'}
                ,{ field: 'bolean', displayName:'bolean'}
                ,{ field: 'undefined', displayName:'undefined'}
                ,{ field: 'Null', displayName:'Null'}
                ,{ field: 'NaN', displayName:'NaN'}
                ,{ field: 'function', displayName:'function'}
                ,{ field: 'withFilter', displayName:'withFilter', columnFilter: 'instance_status'}
                ,{ field: 'withTemplete', displayName:'withTemplete', columnTemplete: '<input type="text" ng-model="rowData[colData.field]" class="span1" />' }
			]
   		}
    	
    	console.log([1].toString())
    	//we must watch attribute in a $scope.object, then the bothway binding will be establish
    	$scope.$watch("angridOptions.selectedItems", function(newValue, oldValue){
    		console.log(newValue);
    		$scope.mySelections = $scope.angridOptions.selectedItems;
		})		
	});

//entrance of this program
angular.bootstrap(document.getElementById("instanceApp"), ["instanceApp"]);