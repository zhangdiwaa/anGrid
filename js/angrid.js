//directive
angular.module('anGrid.directives', ['anGrid.services', 'anGrid.filters', 'ngSanitize'], function($compileProvider){
	//directive angrid
	$compileProvider.directive('angrid', function($compile, widthServices, setDefaultOption) {
		var angrid = {
		    //A transclude linking function pre-bound to the correct transclusion scope:
		    transclude: true,
		    //scope must be true so that we can use $scope.$eval('string')
		    scope: true,
		    controller: function($scope, $element, $attrs, $transclude ) {
		    	var root = this;
		    	//there are there three local variables
		    	//$scope.option  ------ as the children scope of the controller which has angrid
		    	//$scope.theData ------ to update the grid data, we need to $scope.theData = $scope.$eval($scope.option.data)
		    	//this.config ------- set default parameters of angrid, this is this controller's object, can not be read by parent controller
                $scope.option = $scope.$eval($attrs.angrid);
                //set the default params of angrid
				this.config = setDefaultOption($scope.option);
				//set width
				widthServices($scope.option.columnDefs);
				//set the the default params to $scope.option
				//I can not do this by just write "$scope.option = this.config"
				$scope.option.angridStyle =                this.config.angridStyle;
				$scope.option.canSelectRows =              this.config.canSelectRows;
				$scope.option.multiSelect =                this.config.multiSelect;
				$scope.option.displaySelectionCheckbox =   this.config.displaySelectionCheckbox;
				$scope.option.selectWithCheckboxOnly =     this.config.selectWithCheckboxOnly;
				$scope.option.multiSelectWithCheckbox =    this.config.multiSelectWithCheckbox;
				$scope.option.columnDefs =                 this.config.columnDefs;
				$scope.option.enableSorting =              this.config.enableSorting;
				$scope.option.selectedItems =              this.config.selectedItems;
				$scope.option.searchFilter =               this.config.searchFilter;
				$scope.option.showFooter =                 this.config.showFooter;
				$scope.option._orderByPredicate =          this.config._orderByPredicate;
				$scope.option._orderByreverse =            this.config._orderByreverse;
				
				//$scope.angrid is only use in angrid's scope
				$scope.angrid = {};
				$scope.angrid.hasFooterClass = $scope.option.showFooter ? "hasFooter" : "";
				
				console.log("option:", $scope.option );
				console.log("config:", this.config);
				//watch the data change, 
				//To study the ng-grid
				// if it is a string we can watch for data changes. otherwise you won't be able to update the grid data
                var prevlength = 0;
                var dataWatcher = function (a) {
                	if (typeof $scope.option.data == "string") {
	                    prevlength = a ? a.length:0;
	                    $scope.thedata = $scope.$eval($scope.option.data) || [];
	                    root.config.data = $scope.thedata;
	                }
                };
                $scope.$parent.$watch($scope.option.data, dataWatcher);
                $scope.$parent.$watch($scope.option.data + '.length', function(a) {
                    if (a != prevlength) {
                        dataWatcher($scope.$eval($scope.option.data));
                    }
                });
		    },
		    template:
		    	//TODO: to complie templete
		      	'<div class="anGrid instance {{option.angridStyle}}">' +
					'<div class="anHead"><!-- thead -->' +
						'<ul>' +
							'<anhead sort-field="option._orderByPredicate" sort-reverse="option._orderByreverse" selects="option.selectedItems"></anhead>' + 
						'</ul>' +
					'</div>' +
					'<div class="anBody {{angrid.hasFooterClass}}"><!-- tbody -->' +
						'<ul>' +
							'<anrow ng-repeat="rowdata in thedata | orderBy:option._orderByPredicate:option._orderByreverse | filter:search" anrow-data="rowdata" selects="option.selectedItems" ></anrow>' + 
						'</ul>' +
					'</div>' +
					'<div class="anFooter" ng-show="option.showFooter">'+
						'<div class="btn-group filter"><input id="inputIcon" type="text" ng-model="search.$" /><i class="icon-search"></i></div>' +
					'</div>' +
					'<div class="expression">' +
					'{{ search.$ = option.searchFilter }}'+
					'</div>' +
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
		  	    anrowData: "=anrowData",
		  	    selectedItems: "=selects"
		    },
		    template:
	        //TODO: to complie templete
	          '<li ng-click="anrow.toggleSelectedFuc($event)" ng-class="anrow.rowCssClassFuc()" ng-mouseenter="anrow.hovered=true" ng-mouseleave="anrow.hovered=false" ></li>',
	        replace: true,

	        link: function($scope, $element, $attrs, $angridCtrl){
	        	$scope.anrowColumns = $angridCtrl.config.columnDefs;
	        	$scope.anrowData.selected = false;
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
						    $scope.selectedItems = [];
					    	angular.forEach(oldselectedItems, function(row){
						    	if(row.selected) 
						    		$scope.selectedItems.push(row);
						    });	
						}else{
							$scope.anrowData.selected = true;
							$scope.selectedItems.push($scope.anrowData);
						}
					},
					//SingleSelect
					singleSelectFuc: function(){
					    if ($scope.anrowData.selected){
					    	if($scope.selectedItems.length > 1){
					    		angular.forEach($angridCtrl.config.data, function(rowdata){
							    	rowdata.selected = false;
							    });
							    $scope.selectedItems = [];
							    $scope.anrowData.selected = true;
					    		$scope.selectedItems.push($scope.anrowData);
					    	}else{
					    		$scope.anrowData.selected = false;
					    		$scope.selectedItems = [];
					    	}
					    	
					    }else{
					    	angular.forEach($angridCtrl.config.data, function(rowdata){
						    	rowdata.selected = false;
						    });
					    	$scope.anrowData.selected = true;
					    	$scope.selectedItems = [];
					    	$scope.selectedItems.push($scope.anrowData);
					    }
					    
					},
					//return selected rows' data to $angridCtrl.config.selectedItems
					toggleSelectedFuc: function($event){
				 		if (!$angridCtrl.config.canSelectRows) {
				            return;
				        }
				        if(typeof($scope.anrowData.selected) == undefined){
				        	return;
				        }
				        //we use the attribute named dir to justify user clicked checkbox or not in a row
				        if($angridCtrl.config.selectWithCheckboxOnly && $event.target.dir != "checkbox"){
				        	return;
				        }
						if($angridCtrl.config.multiSelect){
						    if($angridCtrl.config.multiSelectWithCheckbox == true && $event.target.dir!= "checkbox" ){
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
	        			  '<ol class="clearfix">' +
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
	        		filter == "" ?
	        		'<span>{{rowData[colData.field]}}</span>':
	        		//ng-bind-html can only accept string argument
	        	 	'<span ng-bind-html="rowData[colData.field]'+ filter +' | tostring"></span>';
				templete = 
					$scope.colData.columnTemplete ? 
					$scope.colData.columnTemplete : 
					templete;
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
		    	sortreverse: "=sortReverse",
		    	selectedItems: "=selects"
		    },
	        link: function($scope, $element, $attrs, $angridCtrl) {
	        	$scope.anhead = angular.extend({
	        		selectAll: false,
	        		columnDefs: $angridCtrl.config.columnDefs,
	        		toggleSelectAllFuc: function(){
		        		if(!$angridCtrl.config.canSelectRows || !$angridCtrl.config.displaySelectionCheckbox ){
		        			return;
		        		}
		        		//$angridCtrl.config.selectedItems = [];
		        		$scope.selectedItems = [];
		        		if(!this.selectAll){
		        			this.selectAll = true;
		        			angular.forEach($angridCtrl.config.data, function(row){
			        			row.selected = true;
						    	//$angridCtrl.config.selectedItems.push(row);
						    	$scope.selectedItems.push(row);
						    });
		        		}else{
		        			this.selectAll = false;
		        			angular.forEach($angridCtrl.config.data, function(row){
			        			row.selected = false;
						    });
		        		}
		        	},
		        	sortFuc : function(col){
		        		if(!$angridCtrl.config.enableSorting || !col.sortable ){
		        			return;
		        		}
		        		
		        		angular.forEach(this.columnDefs, function(c){
		        			c._sortIconflag = false;
		        		});
		        		col._sortIconflag = true;
		        		$scope.sortfield = col.field;
		        		$scope.sortreverse = !$scope.sortreverse;
		        		$scope.caret = $scope.sortreverse ? 'caretdown' : 'caretup';
		        	},
		        	headCellCssFuc : function(col){
		        		var cssClass = col.sortable == true ? "sortable " : " ";
		        		cssClass += col.cssClass;
		        		return cssClass;
		        	}
	        	}, $scope.anhead);
	        	
	        	//set the realy head row templete
	        	var checkbox = $angridCtrl.config.displaySelectionCheckbox == true ? 
	        	               '<div class="anCheckbox" ng-click="anhead.toggleSelectAllFuc()"><span class="dijitCheckBox" ng-class="{\'dijitCheckBoxChecked\': anhead.selectAll}"></span></div>' :
	        	               '';
	        	var row = checkbox + 
	        			  '<ol>' +
							  '<li ng-repeat="col in anhead.columnDefs" ng-class="anhead.headCellCssFuc(col)"  ng-class="{\'sortable\': col.sortable}" style="{{col._style}}" ng-click="anhead.sortFuc(col)">{{col.displayName}}<span ng-class="caret" ng-show="col._sortIconflag"></span></li>' +
						  '</ol>';
				$element.append($compile(row)($scope)); 
	        }
	    };
	});
})


//services
angular.module('anGrid.services', [])
	.factory('setDefaultOption', function(){
		return function(option){
			angular.forEach(option.columnDefs, function(col, i){
			    col = angular.extend({
		        	field:                   '',         //data name
		        	displayName:             this.field, //displayname, the title of the columnDefs
		        	cssClass:                '',         //the css of column, defined the width, left ( postion: absolute )
		        	width:                   '',         //the substitutes of cssClass, defined the width from 0% to 100%
		        	sortable:                true,       //column sortable or not
		        	columnFilter:            '',         //costom column filter for a column
		        	columnTemplete:          false,      //if use it, it will replace the default ancell template, you'd better know the structure of angrid
		        	_sortIconflag:           false,      //the flag that decide display the sortIcon or not, you should not set
		        	_style:                  ''
				}, col);
				option.columnDefs.splice(i, 1, col);
			});
	    	// default config object, config is a global object of angrid
	        option = angular.extend({
	        	//data:                        [],
	        	
	        	angridStyle:                 'th-list', //angrid style, such as th-list, th, th-large
		        canSelectRows:               true,      //the flag that decide user can select rows or not
		        multiSelect:                 true,      //the flag that decide user can select multiple rows or not
		        displaySelectionCheckbox:    true,      //the flag that decide checkbox of each line display or not
		        selectWithCheckboxOnly:      false,     //the flag that decide user can only select rows by click checkbox or not
		        multiSelectWithCheckbox:     false,     //the flag that decide user can only multi-select rows by click checkbox or not
		        columnDefs:                  [],        //this is just reminding that option has to have an attr named columnDefs
		        enableSorting:               true,      //This is a main switch that decide user can sort rows by column or not ( however, each column has its own switch )
		        selectedItems:               [],        //return the data of select rows
		        searchFilter:                "",        //search filter
		        showFooter:                  false,     //show footer or not
		        _orderByPredicate:           "",        //the orderby field name
		        _orderByreverse:             false      //the orderby reverse flag
			}, option);
			
			return option;
		}	
	})
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
	
angular.module('anGrid.filters', [])
	.filter('tostring', function () {
	    return function (input) {
	    	//input type: string, number(int, float, NaN), boolean, object(object, array, null), function, undefined 
	    	switch ( typeof(input)) {
	            case "undefined":
	                return "undefined";
	            case "function": 
	            //you'd better not use function, just use filter
	            	return input();
	            default:
	            	if(input == null){
	            		return "null"
	            	}
	                return input.toString();
	        }
	    };
	})
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
	 /**
 * Wraps the
 * @param text {string} haystack to search through
 * @param search {string} needle to search for
 * @param [caseSensitive] {boolean} optional boolean to use case-sensitive searching
 */
	.filter('highlight', function () {
	    return function (text, search, caseSensitive) {
	        if (search || angular.isNumber(search)) {
		        text = text.toString();
		        search = search.toString();
		        if (caseSensitive) {
		            return text.split(search).join('<span class="ui-match">' + search + '</span>');
		        } else {
		            return text.replace(new RegExp(search, 'gi'), '<span class="ui-match">$&</span>');
		        }
	        } else {
	          return text;
	        }
	    };
	});
	 
angular.module('anGrid', ['anGrid.services', 'anGrid.directives', 'anGrid.filters']);
