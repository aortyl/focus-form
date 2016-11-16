export const main = {
  template: require('./main.html'),
  controller($scope) {
    $scope.alert = function () {
      $scope.alertMsg = 'Thanks! We sent your information off to the government for processing.';
    };
  }
};
