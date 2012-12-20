angular.module('CreateSg', ['SecurityCommon'])
    .controller('SgCtrl', function ($scope) {
        $scope.create_sg_valid = function (form) {
            return form.sg_name.$invalid;
        };
});

angular.bootstrap(document.getElementById("CreateSg"), ['CreateSg']);
