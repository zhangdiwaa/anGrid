//ngResource: launchInstanceServices
angular.module('launchInstanceServices', ['ngResource'])
    .factory('getInitData', function($resource){
	  return $resource('/nova/instances/launch/', {}, {
	    get: {method:'GET'}
	  });
	});

//Specific business module: launchInstance
angular.module('launchInstance', ['launchInstanceServices', 'dropdownTable'])
    .controller('lauchInstanceCntl', function ($scope, getInitData) {
    	//init, ajax get data				
		getInitData.get({}, function(initdata) {
		    $scope.data = initdata.data;			    
		    console.log( $scope.data ); 
		    //for dropdowntable of flaver_table		    
		    $scope.flover_table_head = ['名称', 'Vcpu', '磁盘', '内存', 'Hourly Price', 'Monthly Price'];
			$scope.flover_table_data_attr = ['name', 'vcpus', 'disk_desp', 'ram_desp', 'hourly_price', 'monthly_price'];
			$scope.$watch("flover_selected", function(newValue, oldValue){
				if(angular.isObject($scope.flover_selected)){
		    		$scope.data.quota_usage[0].add = 1;
					$scope.data.quota_usage[1].add = $scope.flover_selected.vcpus;
					$scope.data.quota_usage[2].add = $scope.flover_selected.disk;
					$scope.data.quota_usage[3].add = $scope.flover_selected.ram;
		    	}
			})			 
		});	
	});
angular.bootstrap(document.getElementById("launch_instance_form"), ["launchInstance"]);