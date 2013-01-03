//main mudule: instanceApp    
angular.module('instanceApp', ['instanceApp.services', 'commonFilter', 'anGrid'])
    .controller('instanceApp.controller', function ($scope, instancesData) {
	    
	    $scope.myData = [];
    	$scope.mySelections = [];
    	
    	//demo1
    	$scope.angridOptions = {
    		angridStyle:                 "th-list",
    		multiSelect:                 false,  //设置为单选
			data:                        "myData", //数据输入
	        selectedItems:               $scope.mySelections, //返回选中对象
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
   		}
   		
   		$scope.resetData = function(){
   			$scope.myData = [];
   			console.log($scope.myData);
   		}
   		$scope.queryData = function(){
   			$scope.myData = instancesData.query();
   			console.log($scope.myData);
   		}
   		$scope.setTime = 2000;
   		$scope.setTimeData = function(){
   			setTimeout(function () {
				$scope.myData = [{
					      			 name: "time",
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
				      			}];
			   console.log($scope.myData, $scope.setTime);
			   //setTimeout is an eval function, so we need $digest or $apply to process all of the watchers of the current scope and its children
			   $scope.$digest();
			}, $scope.setTime)
   		}
   		
   		$scope.mySelections = $scope.angridOptions.selectedItems;
   		
    	//we must watch attribute in a $scope.object, then the bothway binding will be establish
    	// $scope.$watch("angridOptions.selectedItems", function(newValue, oldValue){
    		// $scope.mySelections = $scope.angridOptions.selectedItems;
		// })
	});
//entrance of this program
angular.bootstrap(document.getElementById("instanceApp"), ["instanceApp"]);