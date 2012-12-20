//services
angular.module('anGrid.services', [])
//templete factory, return default templete
	.factory('templete', function() {
		//TODO: angrid templete 
	})
	
//TODO:we need filter function for date and chinese character
angular.module('anGrid.filters', [])
//most of filters are custom filter, you should define them yourself and inject them into angrid
//in angrid we only support a little easy filter
    //'checkmark', return character of right or wrong 
	.filter('checkmark', function () {
	    return function (input) {
	        return input ? '\u2714' : '\u2718';
	    };
	})
	//'reverse', reverse the string
	.filter('reverse', function() {
	    return function(input, uppercase) {
	      var out = "";
	      for (var i = 0; i < input.length; i++) {
	        out = input.charAt(i) + out;
	      }
	      // conditional based on optional argument
	      if (uppercase) {
	        out = out.toUpperCase();
	      }
	      return out;
	    }
	 })

//directive
angular.module('anGrid.directives', [], function($compileProvider){
	//directive angrid
	$compileProvider.directive('angrid', function($compile) {
		var angrid = {
		    //A transclude linking function pre-bound to the correct transclusion scope:
		    transclude: true,
		    scope: {
		    	option: "=angrid"
		    },
		    link: function($scope, $element, $attr) {
				//console.log($attr);
		    },
		    controller: function($scope, $element, $attrs, $transclude ) {
		    	console.log($attrs);
		    	var left = 0;
		    	//default columns
				angular.forEach($scope.option.columns, function(col, i){
					
				    col = angular.extend({
			        	field:                   '',         //data name
			        	displayName:             this.field, //displayname, the title of the columns
			        	cssClass:                '',         //the css of column, defined the width, left ( postion: absolute )
			        	width:                   '',         //the substitutes of cssClass, defined the width from 0% to 100%
			        	sortable:                true,       //column sortable or not
			        	columnFilter:            '',         //costom column filter for a column
			        	columnTemplete:          false,      //if use it, it will replace the default ancell template, you'd better know the structure of angrid
			        	_sortIconflag:           false,      //the flag that decide display the sortIcon or not, you should not set
			        	_style:                  ''
					}, col);
					
					
					//TODO: packaging computer the width
					if(col.width != ''){
						var t = parseFloat(col.width);
						//TODO: maybe util is em or cm, what should we do?
						if(isNaN(t)){
							if(col.width == 'auto'){
								var res = 100 - left;
								col._style = 'left: '+ left + "%" +'; width:' + res + "%";
								left += res;
							}else{
								throw "you would better use percentage (\"10%\",\"20%\", etc...) to use remaining width of grid";
							}
						}else{
							var util = (col.width.indexOf("%", col.width.length - 1) !== -1) ? "%" : "px";
							col._style = 'left: '+ left + util +'; width: '+ col.width;
							left += t;
						}
					}
					$scope.option.columns.splice(i, 1, col);
				});
		    	// default config object, config is a global object of angrid
		        this.config = angular.extend({
		        	angridStyle:                 'th-list', //angrid style, such as th-list, th, th-large
		        	displayCheckbox:             true,      //TODO: this attr has not been used
			        canSelectRows:               true,      //the flag that decide user can select rows or not
			        multiSelectRows:             true,      //the flag that decide user can select multiple rows or not
			        selectWithCheckboxOnly:      false,     //TODO: this attr has not been used
			        columns:                     [],        //this is just reminding that option has to have an attr named columns
			        columnSortable:              true,      //This is a main switch that decide user can sort rows by column or not ( however, each column has its own switch )
			        SelectedRows:                [],        //return the data of select rows
			        _orderByPredicate:           "",        //the orderby field name
			        _orderByreverse:             false      //the orderby reverse flag
				}, $scope.option);
				
				//bind 
				$scope.option = this.config;
				
				
		    },
		    template:
		    	//TODO: to complie templete
		      	'<div class="anGrid instance {{option.angridStyle}}">' +
					'<div class="anHead"><!-- thead -->' +
						'<ul>' +
							'<anhead sort-field="option._orderByPredicate" sort-reverse="option._orderByreverse"></anhead>' + 
						'</ul>' +
					'</div>' +
					'<div class="anBody"><!-- tbody -->' +
						'<ul>' +
							'<anrow ng-repeat="rowdata in option.data | orderBy:option._orderByPredicate:option._orderByreverse" anrow-data="rowdata" ></anrow>' + 
						'</ul>' +
					'</div>' +
					'<div class="footer"></div>' +
				'</div>',
		    replace: true
	    };
	    return angrid;
    });
	//directive anRow, this is part of angrid
	$compileProvider.directive('anrow', function($compile) {
	    return {
		    require: '^angrid',
		    restrict: 'E',
		    transclude: true,
		    scope: { 
		  	    anrowData: "=anrowData"
		    },
		    template:
	        //TODO: to complie templete
	          '<li ng-click="anrow.toggleSelectedFuc($event)" ng-class="anrow.rowCssClassFuc()" ng-mouseenter="anrow.hovered=true" ng-mouseleave="anrow.hovered=false" >' +
				  '<div class="anCheckbox"><span ng-class="anrow.checkboxClassFuc()"></span></div>' +
				  '<ol  class="clearfix">' +
				      '<ancell ng-repeat="col in anrowColumns" row-data="anrowData" col-data="col"></ancell>' + 
				  '</ol>' +												
			  '</li>',
	       replace: true,

	       link: function($scope, $element, $attrs, $angridCtrl){
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
						//TODO : maybe we need a selectionService just like ng-grid 1779
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
				        if(typeof($scope.anrowData.selected) == undefined){
				        	return;
				        }
						if($angridCtrl.config.multiSelectRows){
						    //multiSelect
						    if ($scope.anrowData.selected){
								$scope.anrowData.selected = false;
							    var oldSelectedRows = $angridCtrl.config.SelectedRows;
							    $angridCtrl.config.SelectedRows = [];
						    	angular.forEach(oldSelectedRows, function(row){
							    	if(row.selected) $angridCtrl.config.SelectedRows.push(row);
							    });	
							}else{
								$scope.anrowData.selected = true;
								$angridCtrl.config.SelectedRows.push($scope.anrowData);
							}
						}else{
						    //SingleSelection
						    if ($scope.anrowData.selected){
						    	$scope.anrowData.selected = false;
						    	$angridCtrl.config.SelectedRows = [];
						    }else{
						    	angular.forEach($angridCtrl.config.data, function(rowdata){
							    	rowdata.selected = false;
							    });
						    	$scope.anrowData.selected = true;
						    	$angridCtrl.config.SelectedRows = [];
						    	$angridCtrl.config.SelectedRows.push($scope.anrowData);
						    		
						    }
						}	
					}
				}, $scope.anrow);
	        }
	    };
	});
	//directive ancell, this is part of angrid
	$compileProvider.directive('ancell', function($compile) {
	    return {
		    require: '^angrid',
		    restrict: 'E',
		    transclude: true,
		    scope: {
		    	rowData: "=rowData",
		    	colData: "=colData"
		    },
		    template: '<li class="{{colData.cssClass}}" style="{{colData._style}}" title="{{rowData[colData.field]}}"></li>',
	        replace: true,
		    // compile: function () {
                // return {
                    // post: function ($scope, $element, $attr) {
                  	    // var filter = $scope.colData.columnFilter == '' ? '' : ' | ' + $scope.colData.columnFilter;
						// var templete = 
							// $scope.colData.columnTemplete ? 
							// $scope.colData.columnTemplete : 
							// '<span ng-bind-html="rowData[colData.field] '+ filter +'"></span>';
		          	    // //Angular's jQuery lite provides the following methods:
		          	    // $element.append($compile(templete)($scope));
                    // }
                // };
            // } 
	        link: function($scope, $element, $attrs, $angridCtrl) {
	        	var filter = $scope.colData.columnFilter == '' ? '' : ' | ' + $scope.colData.columnFilter;
				var templete = 
					$scope.colData.columnTemplete ? 
					$scope.colData.columnTemplete : 
					'<span ng-bind-html="rowData[colData.field] '+ filter +'"></span>';
          	    //Angular's jQuery lite provides the following methods:
          	    $element.append($compile(templete)($scope));
	        }   
	    };
	});
	//directive anhead, this is part of angrid
	$compileProvider.directive('anhead', function($compile) {
	    return {
		    require: '^angrid',
		    restrict: 'E',
		    transclude: true,
		    scope: {
		    	sortfield: "=sortField",
		    	sortreverse: "=sortReverse"
		    },
	        link: function($scope, $element, $attrs, $angridCtrl) {
	        	$scope.anhead = angular.extend({
	        		selectAll: false,
	        		columns: $angridCtrl.config.columns,
	        		toggleSelectAllFuc: function(){
		        		if(!$angridCtrl.config.canSelectRows || !$angridCtrl.config.displayCheckbox ){
		        			return;
		        		}
		        		$angridCtrl.config.SelectedRows = [];
		        		if(!this.selectAll){
		        			this.selectAll = true;
		        			angular.forEach($angridCtrl.config.data, function(row){
			        			row.selected = true;
						    	$angridCtrl.config.SelectedRows.push(row);
						    });
		        		}else{
		        			this.selectAll = false;
		        			angular.forEach($angridCtrl.config.data, function(row){
			        			row.selected = false;
						    });
		        		}
		        	},
		        	sortFuc : function(col){
		        		if(!$angridCtrl.config.columnSortable || !col.sortable ){
		        			return;
		        		}
		        		
		        		angular.forEach(this.columns, function(c){
		        			c._sortIconflag = false;
		        		});
		        		col._sortIconflag = true;
		        		$scope.sortfield = col.field;
		        		$scope.sortreverse = !$scope.sortreverse;
		        		$scope.caret = $scope.sortreverse ? 'caretdown' : 'caretup';
		        	}
	        	}, $scope.anhead);
	        },    
	        template:
	        //TODO: to complie templete
			'<li>' +
				'<div class="anCheckbox" ng-click="anhead.toggleSelectAllFuc()"><span class="dijitCheckBox" ng-class="{\'dijitCheckBoxChecked\': anhead.selectAll}"></span></div>' +
				'<ol>' +
					'<li ng-repeat="col in anhead.columns" class="{{col.cssClass}}  ng-class="{\'sortable\': col.sortable}" style="{{col._style}}" ng-click="anhead.sortFuc(col)">{{col.displayName}}<span ng-class="caret" ng-show="col._sortIconflag"></span></li>' +
				'</ol>' +												
			'</li>',
	        replace: true
	    };
	});
})

angular.module('anGrid', ['anGrid.services', 'anGrid.directives', 'anGrid.filters']);
