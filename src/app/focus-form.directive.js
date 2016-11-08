import angular from 'angular';

export const focusForm = {
    transclude: true,
    restrict: 'E',
    scope: {
        navTitle: "@"
    },
    templateUrl: './focus-form.directive.html',
    controller: function ($scope, $log) {
        $log.log('focusForm');
        $scope.children = [];
        this.addItem = function (name, childCtrl) {
            $scope.children.push({
                name: name,
                controller: childCtrl
            });

            // Give the first child focus
            if ($scope.children.length === 1) {
                $scope.focusOnChild(0, name, childCtrl);
            }

            // Set gradient on the second item
            if ($scope.children.length === 2) {
                childCtrl.setGradient(true, 'down');
            }

            return $scope.children.length - 1;
        };

        $scope.focusOnChild = this.focusOnChild = function (index, name, childCtrl) {
            // Remove focus from previous child (if it exists)
            if (angular.isDefined($scope.currentFocusIndex)) {
                // Remove gradients
                if ($scope.currentFocusIndex > 0) {
                    $scope.children[$scope.currentFocusIndex - 1].controller.setGradient(false);
                }
                if ($scope.currentFocusIndex < $scope.children.length - 1) {
                    $scope.children[$scope.currentFocusIndex + 1].controller.setGradient(false);
                }

                $scope.children[$scope.currentFocusIndex].controller.removeFocus();
            }
            // Set focus on new child
            childCtrl.setFocus();
            $scope.currentFocusIndex = index;

            if (index > 0) {
                $scope.children[index - 1].controller.setGradient(true, 'up');
            }
            if (index < $scope.children.length - 1) {
                $scope.children[index + 1].controller.setGradient(true, 'down');
            }
        };
    }
};

export const focusFormSection = {
    transclude: true,
    restrict: 'E',
    require: ["scFormSection", "^scOuter"],
    scope: {
        name: "@"
    },
    templateUrl: './focus-form-section.directive.html',
    link: function (scope, elem, attr, ctrls) {
        scope.focus = false;
        scope.gradientUp = false;
        scope.gradientDown = false;
        scope.parentCtrl = ctrls[1];
        scope.myCtrl = ctrls[0];

        scope.myIndex = scope.parentCtrl.addItem(scope.name, scope.myCtrl);
    },
    controller: function ($scope, $element, $timeout) {
        let timeout = null;
        this.setFocus = function () {
            $scope.focus = true;
            if (timeout) {
                $timeout.cancel(timeout);
            }
            timeout = $timeout(function () {
                angular.element("body").animate({scrollTop: $element[0].offsetTop - 100}, "slow");
            }, 0);
            $scope.gradientUp = false;
            $scope.gradientDown = false;
        };

        this.removeFocus = function () {
            $scope.focus = false;
        };

        $scope.focusMe = function () {
            $scope.parentCtrl.focusOnChild($scope.myIndex, $scope.name, $scope.myCtrl);
        };

        this.setGradient = function (useGradient, direction) {
            if (useGradient) {
                if (direction === 'up') {
                    $scope.gradientUp = true;
                    $scope.gradientDown = false;
                } else if (direction === 'down') {
                    $scope.gradientUp = false;
                    $scope.gradientDown = true;
                }
            } else {
                $scope.gradientUp = false;
                $scope.gradientDown = false;
            }
        };
    }
};
