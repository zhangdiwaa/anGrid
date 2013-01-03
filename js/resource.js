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
	      		 snap: 1
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
	      		 snap: 2
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
	      		 snap: 3
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