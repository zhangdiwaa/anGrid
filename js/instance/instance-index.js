//Specific business module: launchInstance
angular.module('instanceApp.services', ['ngResource'])
    .factory('instancesData', function($resource) {
      // var instancesData = $resource('https://api.mongolab.com/api/1/databases' +
          // '/angularjs/collections/projects/:id',
          // { apiKey: '4f847ad3e4b08a2eed5f3b54' }, {
            // update: { method: 'PUT' }
          // }
      // );
     
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
    	
    	//demo1
    	$scope.angridOptions = {
    		multiSelect:                 false,  //设置为单选
			data:                        $scope.myData, //数据输入
	        selectedItems:                $scope.mySelections, //返回选中对象
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
    	//we must watch attribute in a $scope.object, then the bothway binding will be establish
    	$scope.$watch("angridOptions.selectedItems", function(newValue, oldValue){
    		$scope.mySelections = $scope.angridOptions.selectedItems;
		})		
	});

//entrance of this program
angular.bootstrap(document.getElementById("instanceApp"), ["instanceApp"]);