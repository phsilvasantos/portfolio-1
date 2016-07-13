angular.module('myApp.controllers')

        .controller('InvoicesEstimatesCtrl', function ($scope, $state, $http, AppConfig, Utils, $ionicScrollDelegate, $rootScope) {
          $scope.isInvoice = $state.includes('app.invoices');
          if ($scope.isInvoice) {
            $scope.getDataUrl = 'invoices';
            $scope.editPageUrl = 'app.edit-invoice';
          } else {
            $scope.getDataUrl = 'estimates';
            $scope.editPageUrl = 'app.edit-estimates';
          }
          $scope.invests = [];
          $scope.searchword = '';
          $scope.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
          $scope.dividers = [];
          $scope.dividedInvests = [];
          $scope.isMoreInvests = true;
          $scope.options = {
            FreeText: '', Status: 1, Skip: 0, Top: 20 /*, OrderBy: 'OrganizationName' */
          };
          Utils.hideIndicator();
          $(document).off('search', '#investSearchForm')
                  .on('search', '#investSearchForm', function () {
                    $scope.options.Skip = 0;
                    $scope.isMoreInvests = false;
                    $scope.loadInvests();
                  });
          // Load Clients with search prefix and scroll loading index
          $scope.loadInvests = function () {
            if ($scope.options.Skip === 0) {
              $ionicScrollDelegate.scrollTop(true);
            }
            $http.get(AppConfig.endpoint + $scope.getDataUrl + '?' + $.param($scope.options))
                    .then(function (response) {
                      $scope.isMoreInvests = false;
                      var invests = response.data;
                      if ($scope.options.Skip === 0) {
                        $scope.invests = invests;
                      } else {
                        $scope.invests = $scope.invests.concat(invests);
                      }
                      $scope.isMoreInvests = invests.length >= $scope.options.Top;

                      $scope.$broadcast('scroll.infiniteScrollComplete');
                      $scope.divideInvests();
                    });
          };
          // Set skip value when down scrolling and load new datas with this value
          $scope.loadMoreInvests = function () {
            if (!$scope.isMoreInvests)
              return;
            if ($scope.invests.length > 0)
              $scope.options.Skip += $scope.options.Top;
            $scope.loadInvests();
          };
          // Add dividers to group with first prefix.
          $scope.divideInvests = function () {
            var invests = $scope.invests;
            invests = _.sortBy(invests, function (c) {
              return c.OrganizationName;
            });
            var tmp = {};
            $scope.dividers = [];
            var re = /[a-zA-Z]/;
            var dividers = [];
            _.each(invests, function (c) {
              var letter = (c.OrganizationName || '').charAt(0).toUpperCase();
              if (!re.test(letter)) {
                letter = '#';
              }
              tmp[letter] = tmp[letter] || [];
              tmp[letter].push(c);
              dividers.push(letter);
            });
            dividers = $.unique(dividers);
            $scope.dividers = dividers;
            $scope.dividedInvests = tmp;
            return tmp;
          };

          $scope.add = function () {
            $state.go($scope.editPageUrl);
          };

          $scope.refresh = function () {
            $scope.options.Skip = 0;
            $scope.isMoreInvests = false;
            $scope.loadInvests();
          };

          $scope.clearSearch = function () {
            $scope.options.FreeText = '';
            $scope.options.Skip = 0;
            $scope.isMoreInvests = false;
            $scope.loadInvests();
          };

          $scope.edit = function (id) {
            $state.go($scope.editPageUrl, {'id': id}, {cache: false});
          };
          //Swipe delete 
          $scope.delete = function (id) {
            Utils.confirm('Are you sure to delete this data.', 'Delete data', function () {
              Utils.showIndicator();
              $http.delete(AppConfig.endpoint + $scope.getDataUrl + '/' + id).then(function (response) {
                if (response.status === 200) {
                  $scope.refresh();
                } else {
                  alert('Data deleting failed.');
                }
                Utils.hideIndicator();
              });
            });
          };

          $rootScope.$on("invoiceDataChanged", function (event, args) {
            $scope.getDataUrl = 'invoices';
            $scope.editPageUrl = 'app.edit-invoice';
            $scope.options.Skip = 0;
            $scope.isMoreInvests = false;
            $scope.loadInvests();
          });
          
          $rootScope.$on("estimateDataChanged", function (event, args) {
            $scope.getDataUrl = 'estimates';
            $scope.editPageUrl = 'app.edit-estimates';
            $scope.options.Skip = 0;
            $scope.isMoreInvests = false;
            $scope.loadInvests();
          });

          $scope.changeDateTimeToDate = function (datetime) {
            return datetime = moment(new Date(datetime)).format(AppConfig.dateFormatString);
          }
        });