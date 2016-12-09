import angular from 'angular';

export const focusForm = function () {
    return {
        transclude: true,
        restrict: 'E',
        scope: {
            navTitle: "@"
        },
        template: require('./focus-form.directive.html'),
        controller($scope, $log, $window) {
            $scope.children = [];
            $scope.lagCount = 0;

            // Set up scroll event capture
            angular.element($window).bind('DOMMouseScroll', _onWheel); // For FF and Opera
            angular.element($window).bind('mousewheel', _onWheel); // For others

            function _onWheel(e) {
                $log.debug("scroll event", e);
                // Update count that counts of often a scroll even occurs, but the page doesn't move.
                if ($scope.scrollLocation === this.pageYOffset) {
                    $scope.lagCount++;
                } else {
                    $scope.lagCount = 0;
                }

                // Get the direction of the scroll
                if (this.pageYOffset > $scope.scrollLocation) {
                    $scope.scrollDirection = 1;
                } else if (this.pageYOffset < $scope.scrollLocation) {
                    $scope.scrollDirection = -1;
                } else if (e.deltaY < 0) {
                    $scope.scrollDirection = -1;
                } else {
                    $scope.scrollDirection = 1;
                }

                // If a number of scroll events have occurred, and the screen hasn't moved, lets move focus.
                if ($scope.lagCount >= 3) {
                    _moveFocus($scope.scrollDirection);
                    $scope.lagCount = 0;
                }

                // If the screen HAS moved, lets look at the child section's locations to determine if one of them gets focus
                if ($scope.lagCount === 0) {
                    angular.forEach($scope.children, (childSection, index) => {
                        $log.debug(index, childSection.controller.getOffsetTop());
                        const childLocation = childSection.controller.getOffsetTop() - this.pageYOffset;
                        if (childLocation > 0 && childLocation < 200) {
                            $scope.focusOnChild(index);
                        }
                    });
                }

                $scope.scrollLocation = this.pageYOffset;
                $log.debug('wheel', $scope.scrollLocation, $scope.scrollDirection, $scope.lagCount);
            }

            this.addItem = function (name, childCtrl) {
                $scope.children.push({
                    name,
                    controller: childCtrl
                });

                // Give the first child focus
                if ($scope.children.length === 1) {
                    $scope.focusOnChild(0, name, childCtrl);
                }

                // Set focus class on the the next two sections if they get added
                if ($scope.children.length === 2) {
                    childCtrl.setFocusClass('focus-plus-one');
                } else if ($scope.children.length === 3) {
                    childCtrl.setFocusClass('focus-plus-two');
                }

                return $scope.children.length - 1;
            };

            function _moveFocus(direction) {
                $scope.focusOnChild($scope.currentFocusIndex + direction);
            }

            $scope.focusOnChild = this.focusOnChild = function (index, scroll) {
                scroll = scroll || false;
                if (index < 0) {
                    index = 0;
                } else if (index >= $scope.children.length) {
                    index = $scope.children.length - 1;
                }
                // Remove focus from previously focused section (if it exists)
                if (angular.isDefined($scope.currentFocusIndex)) {
                    if ($scope.currentFocusIndex - 2 >= 0) {
                        $scope.children[$scope.currentFocusIndex - 2].controller.setFocusClass('', scroll);
                    }
                    if ($scope.currentFocusIndex - 1 >= 0) {
                        $scope.children[$scope.currentFocusIndex - 1].controller.setFocusClass('', scroll);
                    }

                    $scope.children[$scope.currentFocusIndex].controller.setFocusClass('', scroll);

                    if ($scope.currentFocusIndex + 1 < $scope.children.length) {
                        $scope.children[$scope.currentFocusIndex + 1].controller.setFocusClass('', scroll);
                    }
                    if ($scope.currentFocusIndex + 2 < $scope.children.length) {
                        $scope.children[$scope.currentFocusIndex + 2].controller.setFocusClass('', scroll);
                    }
                }

                // Update classes of sections surrounding focused section
                if (index - 2 >= 0) {
                    $scope.children[index - 2].controller.setFocusClass('focus-minus-two', scroll);
                }
                if (index - 1 >= 0) {
                    $scope.children[index - 1].controller.setFocusClass('focus-minus-one', scroll);
                }

                $scope.children[index].controller.setFocusClass('focus', scroll);

                if (index + 1 < $scope.children.length) {
                    $scope.children[index + 1].controller.setFocusClass('focus-plus-one', scroll);
                }
                if (index + 2 < $scope.children.length) {
                    $scope.children[index + 2].controller.setFocusClass('focus-plus-two', scroll);
                }

                // Update current focus index
                $scope.currentFocusIndex = index;
            };
        }
    };
};

export const focusFormSection = function () {
    return {
        transclude: true,
        restrict: 'E',
        require: ["focusFormSection", "^focusForm"],
        scope: {
            name: "@"
        },
        template: require('./focus-form-section.directive.html'),
        link(scope, elem, attr, ctrls) {
            scope.focus = false;
            scope.gradientUp = false;
            scope.gradientDown = false;
            scope.parentCtrl = ctrls[1];
            scope.myCtrl = ctrls[0];

            scope.myIndex = scope.parentCtrl.addItem(scope.name, scope.myCtrl);
        },
        controller($scope, $element, $timeout, $location, $anchorScroll) {
            let timeout = null;
            this.setFocusClass = function (focusClass, isScroll) {
                $scope.focusClass = focusClass;
                if ($scope.focusClass === 'focus') {
                    if (timeout) {
                        $timeout.cancel(timeout);
                    }
                    timeout = $timeout(() => {
                        $location.hash($scope.name);
                        if (isScroll) {
                            $anchorScroll();
                        }
                    }, 0);
                }
            };

            this.getOffsetTop = function () {
                return $element[0].offsetTop;
            };

            $scope.focusMe = function () {
                $scope.parentCtrl.focusOnChild($scope.myIndex, $scope.name, $scope.myCtrl);
            };
        }
    };
};
