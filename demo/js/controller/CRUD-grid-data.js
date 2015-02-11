//main mudule: instanceApp    
angular.module('instanceApp', ['instanceApp.services', 'commonFilter', 'anGrid'])
    .controller('instanceApp.controller', function ($scope, instancesData) {
    	$scope.mySelections = [];
    	$scope.myData = [];
    	$scope.myData = instancesData.query();
    	//demo1
    	$scope.angridOptions = {
			data:                        "myData", //数据输入
			multiSelectRows:             true, //多选
    		multiSelectWithCheckbox:     true, //只能用多选框多选
	        selectedItems:               $scope.mySelections, //返回选中对象
	        searchFilter:                '',
	        showFooter:                  true,
		    columnDefs: 					 //用一个对象数组定义每一列
		    [ 
				{ field: 'name', displayName:'虚拟机名称', cssClass:'col1', columnTemplete: '<input type="text" ng-model="rowData[colData.field]" class="span1" />'}
                ,{ field: 'private_ip', displayName:'内网IP', cssClass:'col2'}
                ,{ field: 'flavor_name', displayName:'配置信息', cssClass:'col3'}
                ,{ field: 'billing_type', displayName:'计费类型', cssClass:'col4'}
                ,{ field: 'status', displayName:'状态', cssClass:'col5', columnFilter: 'instance_status'}
                ,{ field: 'ssh_desp', displayName:'公网SSH域名', cssClass:'col6'}
                ,{ field: 'floating_ips', displayName:'公网ip', cssClass:'col7'}
                ,{ field: 'key', displayName:'秘钥', cssClass:'col8'}
                ,{ field: 'security_group', displayName:'安全组', cssClass:'col9'}
                ,{ field: 'image', displayName:'镜像', cssClass:'col10'}
                ,{ field: 'snap', displayName:'快照', cssClass:'col11'}
			]
   		};
   		
   		$scope.resetData = function(){
   			$scope.myData = [];
   			console.log($scope.myData);
   		};
   		$scope.queryData = function(){
   			$scope.myData = instancesData.query();
   			console.log(instancesData.query());
   		};
   		$scope.setTime = 100;
   		$scope.setTimeData = function(){
   			setTimeout(function () {
				$scope.queryData();
			    //setTimeout is an eval function, so we need $digest or $apply to process all of the watchers of the current scope and its children
			    $scope.$digest();
			}, $scope.setTime);
   		};
   		
   		$scope.deleteSelectData = function(){
		    angular.forEach($scope.angridOptions.selectedItems, function(selecteditem, key) {
		    	angular.forEach($scope.myData, function(dataItem, key){
		    		if(selecteditem.id == dataItem.id){
		    			$scope.myData.splice(key,1);
		    		}
		    	});
		    });
   			$scope.angridOptions.selectedItems = [];
   		};
   		
   		$scope.insertData = function(){
   			var data = {
      			id: 3,
      			name: "ACE",
	      		private_ip: "10.0.0.3",
	      		flavor_name: "m1.tiny",
	      		billing_type: "计时",
	      		status: "danger",
	      		ssh_desp: "sjdksdjls.sina.sws.com:121001",   
	      		floating_ips: "124.114.110.16", 
	      		key: "my sk3",
	      		security_group: "sg1",
	      		image: "centOS 64", 
	      		snap: 3
      		};
      		$scope.myData.unshift(data);
   		};
   		
   		$scope.updateData = function(){
   			console.log(updateData);
   			if($scope.angridOptions.selectedItems.length > 1){
   				alert('只能修改一行数据/r we can only change one row');
   			};
   			if($scope.angridOptions.selectedItems.length = 1){
   				var selecteditem = $scope.angridOptions.selectedItems[0];
   				
		    	angular.forEach($scope.myData, function(dataItem, key){
		    		
		    		if(selecteditem.id == dataItem.id){
		    			var update = angular.extend(dataItem, {
		    				name: "我变啦",
				      		private_ip: "10.0.0.2",
				      		flavor_name: "m1.tiny",
				      		billing_type: "包月",
				      		status: "active",
				      		ssh_desp: "以后可以改成对话框，或者直接在列表上改",   
				      		floating_ips: "124.114.110.14", 
				      		key: "my sk1",
				      		security_group: "sg1",
				      		image: "centOS 64", 
				      		snap: 1,
				      		//id: $scope.myData.length
		    			});
		    			
		    			console.log(update);
		    			$scope.myData.splice(key, 1, update);
		    			console.log($scope.myData);
		    			return;
		    		}
		    	});
   			}
   		};
   		
   		$scope.mySelections = $scope.angridOptions.selectedItems;
   		
    	//we must watch attribute in a $scope.object, then the bothway binding will be establish
    	$scope.$watch("angridOptions.selectedItems", function(newValue, oldValue){
    		$scope.mySelections = $scope.angridOptions.selectedItems;
		  });
	});
//entrance of this program
angular.bootstrap(document.getElementById("instanceApp"), ["instanceApp"]);