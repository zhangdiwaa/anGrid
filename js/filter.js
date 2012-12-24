angular.module('commonFilter', [])
	//'reverse', reverse the string
	.filter('instance_status', function() {
	    return function(input) {
	      var statusList = {
	      	'active':   '<i class="icon-ok icon-green"></i>'
	      	,'loading':  '<i class="icon-repeat"></i>'
	      	,'danger':  '<i class="icon-remove icon-red"></i>'
	      	,'shutdown':  '<i class="icon-off"></i>'
	      }
	      return statusList[input] || '';
	    }
	 })
