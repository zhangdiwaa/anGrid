//directive
angular.module('anGrid.directives', ['anGrid.services', 'anGrid.filters', 'ngSanitize'], function ($compileProvider) {
	//directive angrid
	$compileProvider.directive('angrid', function ($compile, widthServices) {
		var angrid = {
			//A transclude linking function pre-bound to the correct transclusion scope:
			transclude: true,
			//scope must be true so that we can use $scope.$eval('string')
			scope:      true,
			controller: function ($scope, $element, $attrs, $transclude) {
				var root = this;
				//$scope.option  ------ as the children scope of the controller which has angrid
				$scope.option = $scope.$eval($attrs.angrid);
				//this.config ------- set default parameters of angrid, the child controller could use it by $angridCtrl.config
				//set default config
				root.config = angular.extend({
					/*Necessary configuration*/
					data:                     "", //the row data object array, if it is a string we can watch for data changes. otherwise you won't be able to update the grid data
					columnDefs:               "", //the column define object array, if you want to dynamically change the columns, you should use a string, just like data

					/*Optional configuration*/
					selectedItems:            [], //return the data of select rows
					searchFilter:             "", //search filter
					angridStyle:              'th-list', //angrid style, such as th-list, th, th-large
					canSelectRows:            true,  //this flag that decide user can select rows or not
					multiSelect:              true,  //this flag that decide user can select multiple rows or not
					displaySelectionCheckbox: true,  //this flag that decide checkbox of each line display or not
					selectWithCheckboxOnly:   false, //this flag that decide user can only select rows by click checkbox or not
					multiSelectWithCheckbox:  false, //this flag that decide user can only multi-select rows by click checkbox or not
					enableSorting:            true,  //This is a main switch that decide user can sort rows by column or not ( however, each column has its own switch )
					searchHighlight:          false, //search text hightlight
					caseSensitive:            true,  //hightlight case Sensitive
					showFooter:               false, //show footer or not

					/*Private configuration*/
					_orderByPredicate: "",   //the orderby field name
					_orderByreverse:   false //the orderby reverse flag
				}, $scope.option);

				function columnDefsExtends(){
					root.config.columnDefs = $scope.columnDefs;
					//set default config.columnDefs
					angular.forEach(root.config.columnDefs, function (col, i) {
						col = angular.extend({
							/*Necessary configuration*/
							field:          '',          //the field name of row data which you want to show in this column
							/*Optional configuration*/
							displayName:           this.field,  //the title of the column, if not setting the title will be the field name
							cssClass:              '',          //the css class of column, in this css class, you will need to set the width and left skewing
							width:                 '',          //the substitutes of cssClass, defined the width from 0% to 100%, if the cssClass and width are both null, the width of column will be halving.
							sortable:              true,        //column sortable or not
							columnFilter:          '',          //costom column filter for a column
							columnTemplete:        false,       //if use it, it will replace the default ancell template, you'd better know the structure of angrid
							enableCellEditOnFocus: false,       //edit on focus
							/*Private configuration*/
							_sortIconflag:         false,       //this flag that decide display the sortIcon or not, you should not set
							_style:                ''
						}, col);
						root.config.columnDefs.splice(i, 1, col);
						widthServices(root.config.columnDefs);
					});
				}

				//watch the columnDefs change, then we could dynamically change the columns
				//To study the ng-grid
				$scope.columnDefs = [];
				var colslength = 0;
				var colsWatcher = function (a) {
					colslength = a ? a.length : 0;
					$scope.columnDefs = $scope.$eval($scope.option.columnDefs) || [];
					columnDefsExtends();
				};
				if(typeof $scope.option.columnDefs === "string"){
					$scope.$parent.$watch($scope.option.columnDefs, colsWatcher);
					$scope.$parent.$watch($scope.option.columnDefs + '.length', function (a) {
						if (a != colslength) {
							colsWatcher($scope.$eval($scope.option.columnDefs));
						}
					});
				}else{
					$scope.columnDefs = $scope.option.columnDefs;
					columnDefsExtends();
				}
				//set width
				widthServices(root.config.columnDefs);

				//$scope.angrid is only use in angrid's scope
				$scope.angrid = {};
				$scope.angrid.hasFooterClass = $scope.option.showFooter ? "hasFooter" : "";

				//set the the default params to $scope.option
				//I can not do this by just write "$scope.option = this.config"
				$scope.option.angridStyle = root.config.angridStyle;
				$scope.option.canSelectRows = root.config.canSelectRows;
				$scope.option.multiSelect = root.config.multiSelect;
				$scope.option.displaySelectionCheckbox = root.config.displaySelectionCheckbox;
				$scope.option.selectWithCheckboxOnly = root.config.selectWithCheckboxOnly;
				$scope.option.multiSelectWithCheckbox = root.config.multiSelectWithCheckbox;
				$scope.option.enableSorting = root.config.enableSorting;
				$scope.option.selectedItems = root.config.selectedItems;
				$scope.option.searchFilter = root.config.searchFilter;
				$scope.option.searchHighlight = root.config.searchHighlight;
				$scope.option.searchHighlight = root.config.caseSensitive;
				$scope.option.showFooter = root.config.showFooter;
				$scope.option._orderByPredicate = root.config._orderByPredicate;
				$scope.option._orderByreverse = root.config._orderByreverse;

				//unSelectAllRowFuc & selectRowFuc could be used for selecting row manually,
				//but it should be guided by $apply or $timeout
				$scope.option.unSelectAllRowFuc = function () {
					dataWatcher($scope.$eval($scope.option.data));
					angular.forEach($scope.thedata, function (obj, index) {
						obj.selected = false;
					});
				}
				$scope.option.selectRowFuc = function (index, state) {
					dataWatcher($scope.$eval($scope.option.data));
					if ($scope.option.canSelectRows == false) {
						return;
					}
					if ($scope.option.multiSelect == false) {
						$scope.option.unSelectAllRowFuc();
					}
					if ($scope.thedata[index].selected == undefined) { //just for safe
						$scope.thedata[index].selected = state;
					} else {
						$scope.thedata[index].selected = state;
					}
					$scope.option.selectedItems.push($scope.thedata[index]);
				}

				//watch the data change,
				//To study the ng-grid
				//$scope.option.data is a string
				//if it is a string we can watch for data changes. otherwise you won't be able to update the grid data
				//$scope.theData ------ to update the grid data, we need to $scope.theData = $scope.$eval($scope.option.data)
				$scope.thedata = [];
				var prevlength = 0;
				var dataWatcher = function (a) {
					if (typeof $scope.option.data === "string") {
						prevlength = a ? a.length : 0;
						$scope.thedata = $scope.$eval($scope.option.data) || [];
						root.config.data = $scope.thedata;
						//console.log("dataWatcher", $scope.thedata);
					}
				};
				$scope.$parent.$watch($scope.option.data, dataWatcher);
				$scope.$parent.$watch($scope.option.data + '.length', function (a) {
					if (a != prevlength) {
						dataWatcher($scope.$eval($scope.option.data));
					}
				});
			},
			template: //TODO: to complie templete
						'<div class="anGrid instance {{option.angridStyle}}">'
							+ '<div class="anHead"><!-- thead -->'
								+ '<ul>'
									+ '<anhead column-defs="columnDefs" sort-field="option._orderByPredicate" sort-reverse="option._orderByreverse" selects="option.selectedItems"></anhead>'
								+ '</ul>'
							+ '</div>'
							+ '<div class="anBody {{angrid.hasFooterClass}}"><!-- tbody -->'
								+ '<ul>'
									+ '<anrow ng-repeat="rowdata in thedata | orderBy:option._orderByPredicate:option._orderByreverse | filter:search" anrow-data="rowdata" selects="option.selectedItems" search-filter="option.searchFilter" ></anrow>'
								+ '</ul>'
							+ '</div>'
							+ '<div class="anFooter" ng-show="option.showFooter">'
								+ '<div class="btn-group filter"><input id="inputIcon" type="text" ng-model="option.searchFilter" /><i class="icon-search"></i></div>'
							+ '</div>'
							+ '<div class="expression">'
								+ '{{ search.$ = option.searchFilter }}'
							+ '</div>'
						+ '</div>',
			replace:    true
		};
		return angrid;
	});
	//directive anRow, this is part of angrid
	$compileProvider.directive('anrow', function ($compile) {
		return {
			require:    '^angrid',
			restrict:   'E',
			transclude: true,
			scope:      {
				anrowData:     "=anrowData",
				selectedItems: "=selects",
				searchFilter:  "=searchFilter"
			},
			template: //TODO: to complie templete
						'<li ng-click="anrow.toggleSelectedFuc($event)" ng-class="anrow.rowCssClassFuc()" ng-mouseenter="anrow.hovered=true" ng-mouseleave="anrow.hovered=false" ></li>',
			replace:    true,

			link: function ($scope, $element, $attrs, $angridCtrl) {
				$scope.anrowColumns = $angridCtrl.config.columnDefs;
				$scope.anrowData.selected = false;
				// default option object
				$scope.anrow = angular.extend({
					hovered:           false,
					rowCssClassFuc:    function () {
						var rowCssClass = "";
						if (typeof ($scope.anrowData.selected) == undefined)
							return;
						rowCssClass = $scope.anrowData.selected ? "selected" : "";
						rowCssClass += this.hovered ? " hover" : "";
						return rowCssClass;
					},
					checkboxClassFuc:  function () {
						if (typeof ($scope.anrowData.selected) == undefined)
							return;
						return $scope.anrowData.selected ? "dijitCheckBox dijitCheckBoxChecked" : "dijitCheckBox";
					},
					//multiSelect
					multiSelectFuc:    function () {
						if ($scope.anrowData.selected) {
							$scope.anrowData.selected = false;
							var oldselectedItems = $angridCtrl.config.selectedItems;
							$scope.selectedItems = [];
							angular.forEach(oldselectedItems, function (row) {
								if (row.selected)
									$scope.selectedItems.push(row);
							});
						} else {
							$scope.anrowData.selected = true;
							$scope.selectedItems.push($scope.anrowData);
						}
					},
					//SingleSelect
					singleSelectFuc:   function () {
						if ($scope.anrowData.selected) {
							if ($scope.selectedItems.length > 1) {
								angular.forEach($angridCtrl.config.data, function (rowdata) {
									rowdata.selected = false;
								});
								$scope.selectedItems = [];
								$scope.anrowData.selected = true;
								$scope.selectedItems.push($scope.anrowData);
							} else {
								$scope.anrowData.selected = false;
								$scope.selectedItems = [];
							}

						} else {
							angular.forEach($angridCtrl.config.data, function (rowdata) {
								rowdata.selected = false;
							});
							$scope.anrowData.selected = true;
							$scope.selectedItems = [];
							$scope.selectedItems.push($scope.anrowData);
						}

					},
					//return selected rows' data to $angridCtrl.config.selectedItems
					toggleSelectedFuc: function ($event) {
						if (!$angridCtrl.config.canSelectRows) {
							return;
						}
						if (typeof ($scope.anrowData.selected) == undefined) {
							return;
						}
						//we use the attribute named dir to justify user clicked checkbox or not in a row
						if ($angridCtrl.config.selectWithCheckboxOnly && $event.target.dir != "checkbox") {
							return;
						}
						if ($angridCtrl.config.multiSelect) {
							if ($angridCtrl.config.multiSelectWithCheckbox == true && $event.target.dir != "checkbox") {
								this.singleSelectFuc();
							} else {

								this.multiSelectFuc();
							}
						} else {
							this.singleSelectFuc();
						}
					}
				}, $scope.anrow);

				//set the realy row templete
				var checkbox = $angridCtrl.config.displaySelectionCheckbox == true ? '<div class="anCheckbox"><span dir="checkbox" ng-class="anrow.checkboxClassFuc()"></span></div>' : '';
				var row = checkbox + '<ol class="clearfix">' + '<ancell ng-repeat="col in anrowColumns" row-data="anrowData" col-data="col" search-filter="searchFilter"></ancell>' + '</ol>';
				$element.append($compile(row)($scope));
			}
		};
	});
	//directive ancell, this is part of angrid
	$compileProvider.directive('ancell', function ($compile) {
		return {
			require:    '^angrid',
			restrict:   'E',
			transclude: true,
			scope:      {
				rowData:      "=rowData",
				colData:      "=colData",
				searchFilter: "=searchFilter",
				onEdit:       "&"
			},
			template:   '<li></li>',
			replace:    true,
			link:       function ($scope, $element, $attrs, $angridCtrl) {
				//IE do not happy with style="{{colData._style}}" in template, so I should set style by the function as the last:
				$attrs.$set('style', $scope.colData._style);
				$attrs.$set('class', $scope.colData.cssClass);
				$attrs.$set('title', $scope.rowData[$scope.colData.field]);
				//compile with the searchFilter & columnFilter
				if($scope.colData.enableCellEditOnFocus){
					$scope.onEdit = false;
				}

				$scope.caseSensitive = $angridCtrl.config.caseSensitive;
				var filter = $scope.colData.columnFilter == '' ? '' : ' | ' + $scope.colData.columnFilter;
				var cellEditFuc = $scope.colData.enableCellEditOnFocus == true ?
					' ng-click="onEdit = true" ng-hide="onEdit"': "";
				var cellEditElement = $scope.colData.enableCellEditOnFocus == true ?
					'<input type="text" ng-model="rowData[colData.field]" ng-blur="onEdit = false" ng-show="onEdit" focus-me="onEdit" class="cell-edit-input" />': "";
				var templete = filter == "" ?
					//'<span ng-bind-html-unsafe="rowData[colData.field] | highlight:searchFilter:caseSensitive"></span>'
					'<span ng-bind-html="rowData[colData.field] | highlight:searchFilter:caseSensitive | tostring"'+ cellEditFuc +'></span>' + cellEditElement
					:
					//ng-bind-html can only accept string argument
					'<span ng-bind-html="rowData[colData.field]' + filter + ' | tostring"'+ cellEditFuc +'></span>' + cellEditElement;
				templete = $scope.colData.columnTemplete ? $scope.colData.columnTemplete : templete;
				$element.append($compile(templete)($scope));
			}
		};
	});
	//directive anhead, this is part of angrid
	$compileProvider.directive('anhead', function ($compile) {
		return {
			require:    '^angrid',
			restrict:   'E',
			transclude: true,
			template:   '<li></li>',
			replace:    true,
			scope:      {
				columnDefs:    "=columnDefs",
				sortfield:     "=sortField",
				sortreverse:   "=sortReverse",
				selectedItems: "=selects"
			},
			link:       function ($scope, $element, $attrs, $angridCtrl) {
				$scope.anhead = {
					selectAll:          false,
					caret:              '',
					toggleSelectAllFuc: function () {
						if (!$angridCtrl.config.canSelectRows || !$angridCtrl.config.displaySelectionCheckbox) {
							return;
						}
						//$angridCtrl.config.selectedItems = [];
						$scope.selectedItems = [];
						if (!this.selectAll) {
							this.selectAll = true;
							angular.forEach($angridCtrl.config.data, function (row) {
								row.selected = true;
								//$angridCtrl.config.selectedItems.push(row);
								$scope.selectedItems.push(row);
							});
						} else {
							this.selectAll = false;
							angular.forEach($angridCtrl.config.data, function (row) {
								row.selected = false;
							});
						}
					},
					sortFuc:            function (col) {

						if (!$angridCtrl.config.enableSorting || !col.sortable) {
							return;
						}

						angular.forEach(this.columnDefs, function (c) {
							c._sortIconflag = false;
						});
						col._sortIconflag = true;
						$scope.sortfield = col.field;
						$scope.sortreverse = !$scope.sortreverse;
						$scope.anhead.caret = $scope.sortreverse ? 'caretdown' : 'caretup';
					},
					anhcellCssFuc:      function (col) {
						var cssClass = col.sortable == true ? "sortable " : " ";
						cssClass += col.cssClass;
						return cssClass;
					}
				}
				//set the realy head row templete
				var checkbox = $angridCtrl.config.displaySelectionCheckbox ==
					true
					?
					'<div class="anCheckbox" ng-click="anhead.toggleSelectAllFuc()"><span class="dijitCheckBox" ng-class="{\'dijitCheckBoxChecked\': anhead.selectAll}"></span></div>' : '';
				var row = checkbox +
					'<ol>' +
						'<anhcell ng-repeat="col in columnDefs" col-data="col" an-head="anhead" ></anhcell>' +
					'</ol>';
				$element.append($compile(row)($scope));
			}
		};
	});

	//directive ancell, this is part of angrid
	$compileProvider.directive('anhcell', function ($compile) {
		return {
			require:    '^angrid',
			restrict:   'E',
			transclude: true,
			scope:      {
				anHead:  "=anHead",
				colData: "=colData"
			},
			template:   '<li ng-class="anHead.anhcellCssFuc(colData)" ng-click="anHead.sortFuc(colData)">{{colData.displayName}}<span ng-class="anHead.caret" ng-show="colData._sortIconflag"></span></li>',
			replace:    true,
			link:       function ($scope, $element, $attrs, $angridCtrl) {
				//IE do not happy with style="{{colData._style}}" in template, so I should set style by the function as the last:
				$attrs.$set('style', $scope.colData._style);
			}
		};
	});

	$compileProvider.directive('focusMe', function($timeout) {
		return {
			scope: { trigger: '=focusMe' },
			link: function(scope, element) {
				scope.$watch('trigger', function(value) {
					if(value === true) {
						element[0].focus();
						//scope.trigger = false;
					}
				});
			}
		};
	});
});

//services
angular.module('anGrid.services', []).factory('widthServices', function () {
	return function (columnDefs) {
		var left = 0;
		var oldutil = '';
		//console.log("widthServices", columnDefs);
		angular.forEach(columnDefs, function (col, i) {
			//only use width without cssClass will not show currect th & th-large style of anGrid
			//I suppose to use cssClass to set width when you need different angridStyle,
			//so I wish you use width when you only need an simple default list
			var t = parseFloat(col.width);
			if (isNaN(t)) {
				//if there is no cssClass or no width, we will set average width for each column
				if (col.cssClass == '') {
					if (col.width == '' || col.width == 'auto') {
						var res = 100 - left;
						var average = (oldutil == "%") ? res / (columnDefs.length - i) : 100 / columnDefs.length;
						col._style = 'left: ' + left + '%' + '; width:' + average + '%';
						left += average;
					} else {
						throw "you would better use percentage (\"10%\",\"20%\", etc...) to use remaining width of grid";
					}
				}
			} else {
				//if we set width as cssClass = '20%' or '20px', '20em', 20, etc...
				var util = col.width.substr(t.toString().length);
				util = (util == '') ? 'px' : util;
				oldutil = (i == 0) ? util : oldutil;
				if (util != oldutil) {
					throw "you must set the same util of width, you would better use percentage (\"10%\",\"20%\", etc...)";
				}
				col._style = 'left: ' + left + util + '; width: ' + col.width;
				left += t;
			}
			//console.log(col._style)
		});
	};
});

angular.module('anGrid.filters', [])
	.filter('tostring', function () {
		return function (input) {
			//input type: string, number(int, float, NaN), boolean, object(object, array, null), function, undefined
			switch (typeof(input)) {
				case "undefined":
					return "undefined";
				case "function":
					//you'd better not use function, just use filter
					return input();
				default:
					if (input == null) {
						return "null";
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
	.filter('reverse', function () {
		return function (input, uppercase) {
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
 */.filter('highlight', function () {
		return function (text, search, caseSensitive) {
			if (!angular.isString(text)) {
				return text;
			}
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
