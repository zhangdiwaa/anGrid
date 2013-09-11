#angrid : An Angular DataGrid#

__Contributors:__

zhangdi (zhangdiwaa@163.com)

Dependencies: angular.js.

##About##
version 0.1.0
an easy frontend gird plugin for angularjs
***

##Roadmap##


##Want More?##

##Examples##
just look for:
cell-templete-example.html & cell-templete-example.js
CRUD-grid-data-example.html & CRUD-grid-data-example.js
layout-example.html & layout-example.js
multiSelect-&-widthFuc-example.html & multiSelect-&-widthFuc-example.js
multi-select-onlyby-checkbox-example.html & multi-select-onlyby-checkbox-example.js


##argument detail##
angular.forEach(option.columnDefs, function(col, i) {
			col = angular.extend({
				field : '', //data name
				displayName : this.field, //displayname, the title of the columnDefs
				cssClass : '', //the css of column, defined the width, left ( postion: absolute )
				width : '', //the substitutes of cssClass, defined the width from 0% to 100%
				sortable : true, //column sortable or not
				columnFilter : '', //costom column filter for a column
				columnTemplete : false, //if use it, it will replace the default ancell template, you'd better know the structure of angrid
				columnFuc : function() {
					alert("you need set columnFuc")
				},
				_sortIconflag : false, //the flag that decide display the sortIcon or not, you should not set
				_style : ''
			}, col);
			option.columnDefs.splice(i, 1, col);
		});
		// default config object, config is a global object of angrid
		option = angular.extend({
			angridStyle : 'th-list', //angrid style, such as th-list, th, th-large
			canSelectRows : true, //the flag that decide user can select rows or not
			multiSelect : true, //the flag that decide user can select multiple rows or not
			displaySelectionCheckbox : true, //the flag that decide checkbox of each line display or not
			selectWithCheckboxOnly : false, //the flag that decide user can only select rows by click checkbox or not
			multiSelectWithCheckbox : false, //the flag that decide user can only multi-select rows by click checkbox or not
			columnDefs : [], //this is just reminding that option has to have an attr named columnDefs
			enableSorting : true, //This is a main switch that decide user can sort rows by column or not ( however, each column has its own switch )
			selectedItems : [], //return the data of select rows
			searchFilter : "", //search filter
			searchHighlight : false, //search text hightlight
			caseSensitive : true, //hightlight case Sensitive
			showFooter : false, //show footer or not
			_orderByPredicate : "", //the orderby field name
			_orderByreverse : false //the order
by reverse flag
		}, option);



##Change Log##
