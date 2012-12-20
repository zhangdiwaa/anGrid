'use strict';
angular.module('SecurityGroupService', [])
    .factory('check_rule', function () {
        var rule_in_group = function (rule, rule_group) {
            // check if a rule in a given rule_group
            var result = false; //flag ,whether rule is in group
            angular.forEach(rule_group, function (item, index) {
                var protocol = item.protocol;
                if (protocol === 'icmp') {
                    if (rule.code === item.code && rule.type === item.type &&
                            rule.source == item.source) {
                        result = true;
                    }
                } else { //tcp or udp
                    if (rule.port_range === item.port_range &&
                            rule.source === item.source) {
                        result = true;
                    }
                }
            });
            return result;
        },
            get_current_rule = function ($scope) {
                // get rule from add rule area
                var protocol = $scope.protocol;
                if (protocol == 'icmp') {
                    var code = $scope.code,
                        type = $scope.type,
                        source = $scope.source;
                    return {
                        'protocol': protocol,
                        'code': code,
                        'type': type,
                        'source': source
                    };
                } else { //udp or tcp
                    var port_range = $scope.port_range,
                        source = $scope.source;
                    return {
                        'protocol': protocol,
                        'port_range': port_range,
                        'source': source
                    };
                }
            },
            check_port_range = function (port) {
                var min = 1, max = 65535;
                return port >= min && port <= max;
            };
        return {
            'rule_in_group': rule_in_group,
            'get_current_rule': get_current_rule,
            'check_port_range': check_port_range
        };
    })
    .factory('error_handle', function ($window) {
        // error handle
        var win_alert = function (msg) {
            $window.alert(msg);
        };
        return {
            "alert": win_alert,
        };
    })
    .factory('add_rule', function (check_rule, error_handle) {
        var add_rule_to_right = function (rule, $scope) {
            // add rule to right
            var MAX_RULES = 10;
            if ($scope.icmp_rules.length + $scope.tcp_rules.length + $scope.udp_rules.length > 10) {
                error_handle.alert($scope.msg.rule_overflow);
                return false;
            }
            if (rule.protocol === 'icmp') {
                if (check_rule.rule_in_group(rule, $scope.icmp_rules)) {
                    error_handle.alert($scope.msg.rule_exist);
                    return false;
                }
                $scope.icmp_rules.push(rule);
            } else if (rule.protocol == 'tcp') {
                if (check_rule.rule_in_group(rule, $scope.tcp_rules)) {
                    error_handle.alert($scope.msg.rule_exist);
                    return false;
                }
                $scope.tcp_rules.push(rule);
            } else { // udp
                if (check_rule.rule_in_group(rule, $scope.udp_rules)) {
                    error_handle.alert($scope.msg.rule_exist);
                    return false;
                }
                $scope.udp_rules.push(rule);
            }
        };
        return {
            'add_rule_to_right': add_rule_to_right
        };
    })
    .factory('is_num', function () {
        // check whether a value is num
        return function (value) {
            var match = value.match(/^[0-9]+$/);
            if (match == null) {
                return false;
            }
            return true;
        };
    });


angular.module('SecurityCommon', ['SecurityGroupService'])
    .factory('test', function () {
        return {
            'console': function (){console.log('ok');},
        };
    })
    .controller('ComCtrl', function ($scope, check_rule, error_handle, add_rule) {
        $scope.tcp_rules = [];
        $scope.udp_rules = [];
        $scope.icmp_rules = [];
        $scope.msg = {
            'rule_exist': "rule already exist",
            'rule_overflow': "rule count over the max"
        };
        $scope.quick_rules_1 = [{
            "name": "SAE Bridge",
            "protocol": "tcp",
            "port_range": "1-65535",
            "source": "0.0.0.0/0"
        }, {
            "name": "All TCP",
            "protocol": "tcp",
            "port_range": "1-65535",
            "source": "0.0.0.0/0"
        }, {
            "name": "All UDP",
            "protocol": "udp",
            "port_range": "1-65535",
            "source": "0.0.0.0/0"
        }, {
            "name": "All ICMP",
            "protocol": "icmp",
            "type": "-1",
            "code": "-1",
            "source": "0.0.0.0/0"
        }];
        $scope.quick_rules_2 = [{
            "name": "SSH",
            "protocol": "tcp",
            "port_range": "22",
            "source": "0.0.0.0/0"
        }, {
            "name": "MySQL",
            "protocol": "tcp",
            "port_range": "3306",
            "source": "0.0.0.0/0"
        }, {
            "name": "DNS",
            "protocol": "udp",
            "port_range": "53",
            "source": "0.0.0.0/0"
        }, {
            "name": "RDP",
            "protocol": "tcp",
            "port_range": "3389",
            "source": "0.0.0.0/0"
        }];
        $scope.quick_rules_3 = [{
            "name": "HTTP",
            "protocol": "tcp",
            "port_range": "80",
            "source": "0.0.0.0/0"
        }, {
            "name": "HTTPS",
            "protocol": "tcp",
            "port_range": "443",
            "source": "0.0.0.0/0"
        }, {
            "name": "POP3",
            "protocol": "tcp",
            "port_range": "110",
            "source": "0.0.0.0/0"
        }, {
            "name": "POP3S",
            "protocol": "tcp",
            "port_range": "995",
            "source": "0.0.0.0/0"
        }];
        $scope.quick_rules_4 = [{
            "name": "SMTP",
            "protocol": "tcp",
            "port_range": "25",
            "source": "0.0.0.0/0"
        }, {
            "name": "SMTPS",
            "protocol": "tcp",
            "port_range": "465",
            "source": "0.0.0.0/0"
        }, {
            "name": "IMAP",
            "protocol": "tcp",
            "port_range": "143",
            "source": "0.0.0.0/0"
        }, {
            "name": "IMAPS",
            "protocol": "tcp",
            "port_range": "993",
            "source": "0.0.0.0/0"
        }];
        $scope.new_rule = function (evt) {
            evt.preventDefault(); //button cause form submitted ?
            // add new rule to right
            var rule = check_rule.get_current_rule($scope);
            add_rule.add_rule_to_right(rule, $scope);
        };
        $scope.remove_rule = function (rule) {
            // remove rule in right
            var protocol = rule.protocol;
            if (protocol === 'icmp') {
                var index = $scope.icmp_rules.indexOf(rule);
                $scope.icmp_rules.pop(index);
            } else if (protocol === 'tcp') {
                var index = $scope.tcp_rules.indexOf(rule);
                $scope.tcp_rules.pop(index);
            } else { //udp
                var index = $scope.udp_rules.indexOf(rule);
                $scope.udp_rules.pop(index);
            }
        };
        $scope.add_rule_valid = function (form) {
            // test whether the form is valid
            var rule = check_rule.get_current_rule($scope);
            if (rule.protocol == 'icmp') {
                return !(form.type.$valid && form.code.$valid && form.source.$valid);
            } else {
                return !(form.port_range.$valid && form.source.$valid);
            }
        };
        $scope.add_quick_rule = function (rule) {
            add_rule.add_rule_to_right(rule, $scope);
        };
    })
    .directive('swsAddRules', function () {
        // add rules area
        return {
            restrict: 'A',
            replace: true,
            templateUrl: "/static/sws/js/app/angular_template/security_group/_add_rules.html",
        };
    })
    //.directive('swsQuickRule', function () {
    //    // quick rules item
    //    return {
    //        restrict: 'A',
    //        replace: true,
    //        scope: {name: '@name',
    //                protocol: '@protocol',
    //                portRange: '@portRange',
    //                source: '@source'},
    //        template: "<a class='quick_rule'>{{name}}</a>",
    //        link: function (scope, element, attrs) {
    //            element.bind('click', function () {
    //                var protocol = attrs.protocol;
    //                if (protocol === "icmp") {

    //                } else {

    //                }
    //            });
    //        }
    //    };
    //})
    .directive('swsRules', function () {
        // right rules area
        return {
            restrict: 'A',
            replace: true,
            //templateUrl: "/static/sws/js/app/angular_template/security_group/_rules.html",
            templateUrl: "../../angular_template/security_group/_rules.html",
        };
    })
    .directive('swsPortRangeValid', function (check_rule) {
        // directive for check port range in form
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                ctrl.$parsers.unshift(function (value) {
                    var PORT_RANGE_REG = /^(\d+)$|^(\d+)\s*-\s*(\d+)$/,
                        match = PORT_RANGE_REG.exec(value);
                    if (match != null) {
                        if (match[1] != undefined) {
                        //only enter one port
                            if (!check_rule.check_port_range(match[1])) {
                                ctrl.$setValidity('port_range_valid', false);
                                return undefined;
                            }
                        } else {
                        //enter two port
                            if (!check_rule.check_port_range(match[2])
                                    || !check_rule.check_port_range(match[3])) {

                                ctrl.$setValidity('port_range_valid', false);
                                return undefined;
                            }
                            if (match[2] >= match[3]) {
                                ctrl.$setValidity('port_range_valid', false);
                                return undefined;
                            }
                        }
                        ctrl.$setValidity('port_range_valid', true);
                        return value;
                    }
                    ctrl.$setValidity('port_range_valid', false);
                    return undefined;
                });
            }
        };
    })
    .directive('swsSourceValid', function () {
        // directive for check source format
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                ctrl.$parsers.unshift(function (value) {
                    var SOURCE_REG = /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}\/(3[0-2]|[1-2]?\d)$/;
                    if (SOURCE_REG.test(value)) {
                        ctrl.$setValidity('source_valid', true);
                        return value;
                    }
                    ctrl.$setValidity('source_valid', false);
                    return undefined;
                });
            }
        };
    })
    .directive('swsIntRange', function (is_num) {
        // check whether a num is in range
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                var range = angular.fromJson(attrs.swsIntRange),
                    min = range[0],
                    max = range[1];
                ctrl.$parsers.unshift(function (value) {
                    if (!is_num(value)) {
                        ctrl.$setValidity('int_valid', false);
                        return undefined;
                    }
                    if (value < min  || value > max) {
                        ctrl.$setValidity('int_valid', false);
                        return undefined;
                    }
                    ctrl.$setValidity('int_valid', true);
                    return value;
                });
            }
        };
    });
