//services
angular.module('anGrid.services', [])
//templete factory, return default templete
	.factory('templete', function() {
		
	})
	
angular.module('anGrid.filters', []);


//directive
angular.module('anGrid.directives', [])
//directive angrid
	.directive('angrid', function() {
		var angrid = {
	    	//<angrid></angrid>
		    restrict: 'E',
		    //A transclude linking function pre-bound to the correct transclusion scope:
		    transclude: true,
		    scope: {
		    	//TODO: maybe ngModel is not a good choose
		    	option: "=option"
		    },
		    link: function($scope, $element, $attr) {
		    	$scope.test = function(obj){
		    		//$scope.option = {};
					$scope.option.SelectedRows = [];			
				} 
		    },
		    controller: function($scope, $element) {
		    	// default config object
		        this.config = angular.extend({
		        	displayCheckbox:             true,
			        canSelectRows:               true,
			        multiSelectRows:             true,
			        selectWithCheckboxOnly:      false,
			        columns:                     [],
			        SelectedRows:                []
				}, $scope.option);
				//default columns
				angular.forEach(this.config.columns, function(col, key){
				    col = angular.extend({
			        	field:                   '', 
			        	displayName:             this.field, 
			        	cssClass:                '',
			        	sortable:                true
					}, col);
				});
				//bind 
				$scope.option = this.config;
				
				// angular.forEach(this.config.data, function(row, key){
					    // row = angular.extend({
				        	// selected:            false
						// }, row);
					// });
		    },
		    template:
		    	//TODO: to complie templete
		      	'<div class="anGrid anList instance">' +
					'<div class="anHead" ng-init="predicate=name; reverse=false;"><!-- thead -->' +
						'<ul>' +
							// '<li>' +
								// '<div class="anCheckbox"><span class="dijitCheckBox"></span></div>' +
								// '<ol>' +
									// '<li ng-repeat="col in option.columns" class="sortable {{col.cssClass}}">{{col.displayName}}</li>' +
								// '</ol>' +												
							// '</li>' +
							'<anhead option="option"></anhead>' + 
						'</ul>' +
					'</div>' +
					'<div class="anBody"><!-- tbody -->' +
						'<ul>' +
							'<anrow ng-repeat="rowdata in option.data | orderBy:predicate:reverse" anrow-data="rowdata" ></anrow>' + 
						'</ul>' +
					'</div>' +
					'<div class="footer"><button ng-click="option.SelectedRows=[]">reset</button><button ng-click="test()">shit</button>{{option.SelectedRows}}</div>' +
				'</div>',
		    replace: true
	    };
	    return angrid;
   })
	//directive anRow, this is part of angrid
	.directive('anrow', function() {
	    return {
		    require: '^angrid',
		    restrict: 'E',
		    transclude: true,
		    scope: { 
		  	    anrowData: "=anrowData"
		    },
		    pre: function ($scope, iElement, iAttrs) {
		    	//add selected attr to the anrowData
				if($angridCtrl.config.canSelectRows){
					$scope.anrowData = angular.extend({
						 selected: false
					}, $scope.anrowData);
				}
		   },
	       link: function($scope, $element, $attrs, $angridCtrl) {
	        	
	        	$scope.anrowColumns = $angridCtrl.config.columns;
			    // default option object
				$scope.anrow = angular.extend({				
					hovered: false,
					rowCssClassFuc: function(){
						var rowCssClass = "";
						if(typeof($scope.anrowData.selected) == undefined)
							return;
						rowCssClass = $scope.anrowData.selected ? "selected" : "";
						rowCssClass += this.hovered ? " hover" : "";
						return rowCssClass;
					},
					checkboxClassFuc: function(){
						if(typeof($scope.anrowData.selected) == undefined)
							return;
						return $scope.anrowData.selected ? "dijitCheckBox dijitCheckBoxChecked" : "dijitCheckBox";
					},
					//return selected rows' data to $angridCtrl.config.SelectedRows
					toggleSelectedFuc: function($event){
				 		if (!$angridCtrl.config.canSelectRows) {
				            return;
				        }
				        var element = event.target || event;
				        //check and make sure its not the bubbling up of our checked 'click' event 
				        if (element.type == "checkbox" && element.parentElement.className == "anCheckbox") {
				            return;
				        } 
				        if ($angridCtrl.config.selectWithCheckboxOnly && element.type != "checkbox"){
				            return;
				        }
				        if (this.selected){
				        	//TODO: maybe we should extend anrowData with attr "selected", then the performance will improve
							$scope.anrowData.selected = false;
						    var oldSelectedRows = $angridCtrl.config.SelectedRows;
						    $angridCtrl.config.SelectedRows = [];
						    angular.forEach(oldSelectedRows, function(row){
						    	if(!row.selected)
						    		$angridCtrl.config.SelectedRows.push(row);
						    });
						}else{
							$scope.anrowData.selected = true;
							$angridCtrl.config.SelectedRows.push($scope.anrowData);
						}
						//console.log($angridCtrl.config.SelectedRows)
					}
				}, $scope.anrow);
	      },    
	      template:
	      //TODO: to complie templete
	          '<li ng-click="anrow.toggleSelectedFuc($event)" ng-class="anrow.rowCssClassFuc()" ng-mouseenter="anrow.hovered=true" ng-mouseleave="anrow.hovered=false" >' +
				  '<div class="anCheckbox"><span ng-class="anrow.checkboxClassFuc()"></span></div>' +
				  '<ol  class="clearfix">' +
				  	  '<li ng-repeat="col in anrowColumns" class="{{col.cssClass}}" title="{{anrowData[col.field]}}">{{anrowData[col.field]}}</li>' +
				  '</ol>' +												
			  '</li>',
	      replace: true
	    };
	})
	//directive anhead, this is part of angrid
	.directive('anhead', function() {
	    return {
		    require: '^angrid',
		    restrict: 'E',
		    transclude: true,
		    scope: { 
		  	    option: "=option"
		    },
	        link: function($scope, $element, $attrs, $angridCtrl) {
	        	// $scope.toggleSelectAll = function(){
	        		// if(!$angridCtrl.config.canSelectRows || !$angridCtrl.config.displayCheckbox ){
	        			// return;
	        		// }
	        		// $angridCtrl.config.data = [];
	        		// angular.forEach($angridCtrl.config.data, function(row){
// 	        			
				    	// if(!angular.equals(row, $scope.anrowData))
				    		// $angridCtrl.config.SelectedRows.push(row);
				    // });
	        	// }
	        },    
	        template:
	        //TODO: to complie templete
			'<li>' +
				'<div class="anCheckbox" ><span class="dijitCheckBox"></span></div>' +
				'<ol>' +
					'<li ng-repeat="col in option.columns" class="sortable {{col.cssClass}}">{{col.displayName}}</li>' +
				'</ol>' +												
			'</li>',
	        replace: true
	    };
	})
angular.module('anGrid', ['anGrid.services', 'anGrid.directives', 'anGrid.filters']);
