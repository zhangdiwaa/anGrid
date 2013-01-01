//Specific business module: launchInstance
angular.module('instanceApp.services', ['ngResource'])
    .factory('instancesData', function($resource) {
      //false data
      var data = {
      	code : 200,
      	"message": "OK",
      	data: [
      		{
      			 name: "ABC",
	      		 private_ip: "10.0.0.2",
	      		 flavor_name: "m1.tiny",
	      		 billing_type: "包月",
	      		 status: "active",
	      		 ssh_desp: "wawawaaaa.sjdksdjls.sina.sws.com:121001",   
	      		 floating_ips: "124.114.110.14", 
	      		 key: "my sk1",
	      		 security_group: "sg1",
	      		 image: "centOS 64", 
	      		 snap: ""
      		},
      		{
      			 name: "wawa",
	      		 private_ip: "10.0.0.1",
	      		 flavor_name: "m1.tiny",
	      		 billing_type: "计时",
	      		 status: "loading",
	      		 ssh_desp: "wawawaaaa.sjdksdjls.sina.sws.com:121001",   
	      		 floating_ips: "124.114.110.15", 
	      		 key: "my sk2",
	      		 security_group: "sg1",
	      		 image: "centOS 64", 
	      		 snap: ""
      		},
      		{
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
	      		 snap: ""
      		},
      		{
      			 name: "BLACK",
	      		 private_ip: "10.0.0.4",
	      		 flavor_name: "m1.large",
	      		 billing_type: "包月",
	      		 status: "shutdown",
	      		 ssh_desp: "sjdksdjls.sina.sws.com:121001",   
	      		 floating_ips: "124.114.110.16", 
	      		 key: "my sk3",
	      		 security_group: "sg1",
	      		 image: "ubuntu 64", 
	      		 snap: "my ss1"
      		}
      	]
      }

	  var instancesData = {};
	  
	  instancesData.query = function(cb){
	  	  instancesData = data.data;
	      return instancesData;
	  };
 
      instancesData.update = function(cb) {
        //return Project.update({id: this._id.$oid},angular.extend({}, this, {_id:undefined}), cb);
      };
 
      instancesData.destroy = function(cb) {
        //return Project.remove({id: this._id.$oid}, cb);
      };
 
      return instancesData;
    });
    
    
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