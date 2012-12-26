//directive
angular.module('anGrid.directives', ['anGrid.services', 'ngSanitize'], function($compileProvider){
	//directive angrid
	$compileProvider.directive('angrid', function($compile, widthServices) {
		var angrid = {
		    //A transclude linking function pre-bound to the correct transclusion scope:
		    transclude: true,
		    scope: {
		    	option: "=angrid"
		    },
		    controller: function($scope, $element, $attrs, $transclude ) {
		    	var root = this;
				angular.forEach($scope.option.columnDefs, function(col, i){
				    col = angular.extend({
			        	field:                   '',         //data name
			        	displayName:             this.field, //displayname, the title of the columnDefs
			        	cssClass:                '',         //the css of column, defined the width, left ( postion: absolute )
			        	width:                   '',         //the substitutes of cssClass, defined the width from 0% to 100%
			        	sortable:                true,       //column sortable or not
			        	columnFilter:            '',         //costom column filter for a column
			        	cellTemplate:            false,      //if use it, it will replace the default ancell template, you'd better know the structure of angrid
			        	_sortIconflag:           false,      //the flag that decide display the sortIcon or not, you should not set
			        	_style:                  ''
					}, col);
					
					$scope.option.columnDefs.splice(i, 1, col);
				});
				
				widthServices($scope.option.columnDefs);
				
		    	// default config object, config is a global object of angrid
		        this.config = angular.extend({
		        	angridStyle:                 'th-list', //angrid style, such as th-list, th, th-large
			        canSelectRows:               true,      //the flag that decide user can select rows or not
			        multiSelect:                 true,      //the flag that decide user can select multiple rows or not
			        displaySelectionCheckbox:    true,      //the flag that decide checkbox of each line display or not
			        selectWithCheckboxOnly:      false,     //the flag that decide user can only select rows by click checkbox or not
			        multiSelectWithCheckbox:     false,     //the flag that decide user can only multi-select rows by click checkbox or not
			        columnDefs:                  [],        //this is just reminding that option has to have an attr named columnDefs
			        enableSorting:               true,      //This is a main switch that decide user can sort rows by column or not ( however, each column has its own switch )
			        selectedItems:               [],        //return the data of select rows
			        _orderByPredicate:           "",        //the orderby field name
			        _orderByreverse:             false      //the orderby reverse flag
				}, $scope.option);
				
				//bind 
				$scope.option = this.config;
				console.log(this.config);
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
	          '<li ng-click="anrow.toggleSelectedFuc($event)" ng-class="anrow.rowCssClassFuc()" ng-mouseenter="anrow.hovered=true" ng-mouseleave="anrow.hovered=false" ></li>',
	        replace: true,

	        link: function($scope, $element, $attrs, $angridCtrl){
	        	$scope.anrowColumns = $angridCtrl.config.columnDefs;
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
					//multiSelect
					multiSelectFuc: function(){
						if ($scope.anrowData.selected){
							$scope.anrowData.selected = false;
						    var oldselectedItems = $angridCtrl.config.selectedItems;
						    $angridCtrl.config.selectedItems = [];
					    	angular.forEach(oldselectedItems, function(row){
						    	if(row.selected) $angridCtrl.config.selectedItems.push(row);
						    });	
						}else{
							$scope.anrowData.selected = true;
							$angridCtrl.config.selectedItems.push($scope.anrowData);
						}
					},
					//SingleSelect
					singleSelectFuc: function(){
					    if ($scope.anrowData.selected){
					    	$scope.anrowData.selected = false;
					    	$angridCtrl.config.selectedItems = [];
					    }else{
					    	angular.forEach($angridCtrl.config.data, function(rowdata){
						    	rowdata.selected = false;
						    });
					    	$scope.anrowData.selected = true;
					    	$angridCtrl.config.selectedItems = [];
					    	$angridCtrl.config.selectedItems.push($scope.anrowData);
					    		
					    }
					},
					//return selected rows' data to $angridCtrl.config.selectedItems
					
					toggleSelectedFuc: function($event){
						//TODO : maybe we need a selectionService just like ng-grid 1779
				 		if (!$angridCtrl.config.canSelectRows) {
				            return;
				        }
				        if(typeof($scope.anrowData.selected) == undefined){
				        	return;
				        }
				        //we use the attribute named dir to justify user clicked checkbox or not in a row
				        if($angridCtrl.config.selectWithCheckboxOnly && $event.srcElement.dir != "checkbox"){
				        	return;
				        }
						if($angridCtrl.config.multiSelect){
						    if($angridCtrl.config.multiSelectWithCheckbox == true && $event.srcElement.dir != "checkbox" ){
						    	this.singleSelectFuc();
	                        }else{
	                        	this.multiSelectFuc();
	                        }
						}else{
						    this.singleSelectFuc();
						}	
					}
				}, $scope.anrow);
				
				//set the realy row templete
	        	var checkbox = $angridCtrl.config.displaySelectionCheckbox == true ? 
	        	               '<div class="anCheckbox"><span dir="checkbox" ng-class="anrow.checkboxClassFuc()"></span></div>' :
	        	               '';
	        	var row = checkbox + 
	        			  '<ol  class="clearfix">' +
						      '<ancell ng-repeat="col in anrowColumns" row-data="anrowData" col-data="col"></ancell>' + 
						  '</ol>';	
				$element.append($compile(row)($scope)); 
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
							// $scope.colData.cellTemplate ? 
							// $scope.colData.cellTemplate : 
							// '<span ng-bind-html="rowData[colData.field] '+ filter +'"></span>';
		          	    // //Angular's jQuery lite provides the following methods:
		          	    // $element.append($compile(templete)($scope));
                    // }
                // };
            // } 
	        link: function($scope, $element, $attrs, $angridCtrl) {
	        	var filter = $scope.colData.columnFilter == '' ? '' : ' | ' + $scope.colData.columnFilter;
				var templete = 
					$scope.colData.cellTemplate ? 
					$scope.colData.cellTemplate : 
					//ng-bind-html can only accept string argument
					'<span ng-bind-html="rowData[colData.field].toString() '+ filter +'"></span>';
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
		    template: '<li></li>',
	        replace: true,
		    scope: {
		    	sortfield: "=sortField",
		    	sortreverse: "=sortReverse"
		    },
	        link: function($scope, $element, $attrs, $angridCtrl) {
	        	$scope.anhead = angular.extend({
	        		selectAll: false,
	        		columnDefs: $angridCtrl.config.columnDefs,
	        		toggleSelectAllFuc: function(){
		        		if(!$angridCtrl.config.canSelectRows || !$angridCtrl.config.displaySelectionCheckbox ){
		        			return;
		        		}
		        		$angridCtrl.config.selectedItems = [];
		        		if(!this.selectAll){
		        			this.selectAll = true;
		        			angular.forEach($angridCtrl.config.data, function(row){
			        			row.selected = true;
						    	$angridCtrl.config.selectedItems.push(row);
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
		        		
		        		angular.forEach(this.columnDefs, function(c){
		        			c._sortIconflag = false;
		        		});
		        		col._sortIconflag = true;
		        		$scope.sortfield = col.field;
		        		$scope.sortreverse = !$scope.sortreverse;
		        		$scope.caret = $scope.sortreverse ? 'caretdown' : 'caretup';
		        	}
	        	}, $scope.anhead);
	        	
	        	//set the realy head row templete
	        	var checkbox = $angridCtrl.config.displaySelectionCheckbox == true ? 
	        	               '<div class="anCheckbox" ng-click="anhead.toggleSelectAllFuc()"><span class="dijitCheckBox" ng-class="{\'dijitCheckBoxChecked\': anhead.selectAll}"></span></div>' :
	        	               '';
	        	var row = checkbox + 
	        			  '<ol>' +
							  '<li ng-repeat="col in anhead.columnDefs" class="{{col.cssClass}}  ng-class="{\'sortable\': col.sortable}" style="{{col._style}}" ng-click="anhead.sortFuc(col)">{{col.displayName}}<span ng-class="caret" ng-show="col._sortIconflag"></span></li>' +
						  '</ol>';
				$element.append($compile(row)($scope)); 
	        }
	    };
	});
})


//services
angular.module('anGrid.services', [])
	.factory('widthServices', function(){
		return function(columnDefs){
			var left = 0;
			var oldutil = '';
			angular.forEach(columnDefs, function(col, i){
				//only use width without cssClass will not show currect th & th-large style of anGrid
			    //I suppose to use cssClass to set width when you need different angridStyle,
				//so I wish you use width when you only need an simple default list
				var t = parseFloat(col.width);
				if(isNaN(t)){
					//if there is no cssClass or no width, we will set average width for each column
					if(col.cssClass == ''){
						if(col.width == '' || col.width == 'auto'){
							var res = 100 - left;
							var average = (oldutil == "%") ?
								res/(columnDefs.length - i) :
								100/columnDefs.length;
							col._style = 'left: '+ left + '%' +'; width:' + average + '%';
							left += average;
						}else{
							throw "you would better use percentage (\"10%\",\"20%\", etc...) to use remaining width of grid";
						}
					}
				}else{
					//if we set width as cssClass = '20%' or '20px', '20em', 20, etc... 
					var util = col.width.substr(t.toString().length);
					util = (util == '') ? 'px' : util;
					oldutil = (i == 0) ? util : oldutil;
					if(util != oldutil){
						throw "you must set the same util of width, you would better use percentage (\"10%\",\"20%\", etc...)";
					}
					col._style = 'left: '+ left + util +'; width: '+ col.width;
					left += t;
				}
			});
		}	
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
	 
angular.module('anGrid', ['anGrid.services', 'anGrid.directives', 'anGrid.filters']);
