//main mudule: instanceApp
angular.module('instanceApp', ['instanceApp.services', 'commonFilter', 'anGrid'])
	.controller('instanceApp.controller', function ($scope, instancesData) {
		$scope.mySelections = [];
		$scope.myData = [];
		$scope.myData = instancesData.query();
		$scope.coldefs = [
			{ field: 'private_ip', displayName:'内网IP'}
			,{ field: 'flavor_name', displayName:'配置信息'}
			,{ field: 'billing_type', displayName:'计费类型'}
			,{ field: 'status', displayName:'状态', columnFilter: 'instance_status'}
			,{ field: 'ssh_desp', displayName:'公网SSH域名'}
			,{ field: 'floating_ips', displayName:'公网ip'}
			,{ field: 'key', displayName:'秘钥'}
			,{ field: 'security_group', displayName:'安全组'}
			,{ field: 'image', displayName:'镜像'}
			,{ field: 'snap', displayName:'快照'}
		];
		$scope.angridOptions = {
			data:                        'myData', //数据输入
			columnDefs: 				 'coldefs', //用一个对象数组定义每一列
			angridStyle:			     "th-list",
			multiSelectRows:             true, //多选
			multiSelectWithCheckbox:     true, //只能用多选框多选
			selectedItems:                $scope.mySelections //返回选中对象
		}

		//we must watch attribute in a $scope.object, then the bothway binding will be establish
		$scope.$watch("angridOptions.selectedItems", function(newValue, oldValue){
			console.log(newValue);
			$scope.mySelections = $scope.angridOptions.selectedItems;
		})

		$scope.addColFuc = function(){
			var newCol = { field: 'name', displayName:'虚拟机名称', columnTemplete: '<input type="text" ng-model="rowData[colData.field]" class="span1" />'}
			$scope.coldefs.push(newCol);
		}

		$scope.delColFuc = function(){
			$scope.coldefs.pop();
		}

		$scope.addRowFuc = function(){
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
		}

		$scope.delRowFuc = function(){
			angular.forEach($scope.angridOptions.selectedItems, function(selecteditem, key) {
				angular.forEach($scope.myData, function(dataItem, key){
					if(selecteditem.id == dataItem.id){
						$scope.myData.splice(key,1);
					}
				});
			});
			$scope.angridOptions.selectedItems = [];
		}

	});

//entrance of this program
angular.bootstrap(document.getElementById("instanceApp"), ["instanceApp"]);
