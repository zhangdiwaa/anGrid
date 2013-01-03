//main mudule: instanceApp    
angular.module('instanceApp', ['instanceApp.services', 'commonFilter', 'anGrid'])
    .controller('instanceApp.controller', function ($scope, instancesData) {
	    $scope.mySelections = [];
	    $scope.myData = [];
    	$scope.myData = instancesData.query();

   		//demo2, use width as x%
   		// $scope.angridOptions = {
    		// angridStyle:			     "th-list",
    		// multiSelectRows:             false, //多选
    		// selectWithCheckboxOnly:      true, //只有点击多选框才能选择行
			// data:                        'myData', //数据输入
	        // selectedItems:                $scope.mySelections, //返回选中对象
		    // columnDefs: 					 //用一个对象数组定义每一列
		    // [ 
				// { field: 'name', displayName:'虚拟机名称', width:'8.75%', columnTemplete: '<input type="text" ng-model="rowData[colData.field]" class="span1" />'}
                // ,{ field: 'private_ip', displayName:'内网IP', width:'8.75%'}
                // ,{ field: 'flavor_name', displayName:'配置信息', width:'8.75%'}
                // ,{ field: 'billing_type', displayName:'计费类型', width:'5%'}
                // ,{ field: 'status', displayName:'状态', width:'5%', columnFilter: 'instance_status'}
                // ,{ field: 'ssh_desp', displayName:'公网SSH域名', width:'20%'}
                // ,{ field: 'floating_ips', displayName:'公网ip', width:'8.75%'}
                // ,{ field: 'key', displayName:'秘钥', width:'8.75%'}
                // ,{ field: 'security_group', displayName:'安全组', width:'8.75%'}
                // ,{ field: 'image', displayName:'镜像', width:'8.75%'}
                // ,{ field: 'snap', displayName:'快照', width:'auto'}
			// ]
   		// }
   		
   		//demo3, use default width ( no cssClass & width set ) 
   		$scope.angridOptions = {
    		angridStyle:			     "th-list",
    		multiSelectRows:             false, //多选
    		displaySelectionCheckbox:    false, //不显示多选框
			data:                        'myData', //数据输入
	        selectedItems:                $scope.mySelections, //返回选中对象
		    columnDefs: 					 //用一个对象数组定义每一列
		    [ 
				{ field: 'name', displayName:'虚拟机名称', columnTemplete: '<input type="text" ng-model="rowData[colData.field]" class="span1" />'}
                ,{ field: 'private_ip', displayName:'内网IP'}
                ,{ field: 'flavor_name', displayName:'配置信息'}
                ,{ field: 'billing_type', displayName:'计费类型'}
                ,{ field: 'status', displayName:'状态', columnFilter: 'instance_status'}
                ,{ field: 'ssh_desp', displayName:'公网SSH域名'}
                ,{ field: 'floating_ips', displayName:'公网ip'}
                ,{ field: 'key', displayName:'秘钥'}
                ,{ field: 'security_group', displayName:'安全组'}
                ,{ field: 'image', displayName:'镜像'}
                ,{ field: 'snap', displayName:'快照'}
			]
   		}
    	
    	//we must watch attribute in a $scope.object, then the bothway binding will be establish
    	$scope.$watch("angridOptions.selectedItems", function(newValue, oldValue){
    		$scope.mySelections = $scope.angridOptions.selectedItems;
		})		
	});

//entrance of this program
angular.bootstrap(document.getElementById("instanceApp"), ["instanceApp"]);