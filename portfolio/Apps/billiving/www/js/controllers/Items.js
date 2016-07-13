angular.module('myApp.controllers')

        .controller('ItemsCtrl', function ($scope, $state, $http, AppConfig, Utils, $ionicScrollDelegate, $rootScope, $timeout) {
          $scope.products = [];
          $scope.searchword = '';
          $scope.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
          $scope.dividers = [];
          $scope.dividedItems = [];
          $scope.isMoreItems = true;

          $scope.itemOptions = {
            FreeText: '', StatusId: 1, Skip: 0, Top: 20, OrderBy: 'ShortDescription'
          };
          Utils.hideIndicator();
//          $scope.currency = AppConfig.currencySimbolString;
          $scope.currencyID = AppConfig.currencyID;
          $scope.currency = Utils.getCurrencyName($scope.currencyID);
          $(document).off('search', '#productsSearchForm').on('search', '#productsSearchForm', function () {
            $scope.itemOptions.Skip = 0;
            $scope.isMoreItems = false;
            $scope.loadItems();
          });
          // Load Items with search prefix and scroll loading index
          $scope.loadItems = function () {
            if ($scope.itemOptions.Skip === 0) {
              $ionicScrollDelegate.scrollTop(true);
            }
            $http.get(AppConfig.endpoint + 'products?' + $.param($scope.itemOptions))
                    .then(function (response) {
                      $scope.isMoreItems = false;
                      var products = response.data;
                      if ($scope.itemOptions.Skip === 0) {
                        $scope.products = products;
                      } else {
                        $scope.products = $scope.products.concat(products);
                      }

                      $timeout(function () {
                        $scope.isMoreItems = products.length >= $scope.itemOptions.Top;
                      }, 1000);
                      $scope.$broadcast('scroll.infiniteScrollComplete');
                      $scope.divideItems();
                    });
          };
          // Set skip value when down scrolling and load new datas with this value
          $scope.loadMoreItems = function () {
            if (!$scope.isMoreItems)
              return;
            if ($scope.products.length > 0)
              $scope.itemOptions.Skip += $scope.itemOptions.Top;
            $scope.loadItems();
          };
          // Add dividers to group with first prefix.
          $scope.divideItems = function () {
            var products = $scope.products;
            products = _.sortBy(products, function (c) {
              return c.ShortDescription;
            });
            var tmp = {};
            $scope.dividers = [];
            var re = /[a-zA-Z]/;
            var dividers = [];
            _.each(products, function (c) {
              var letter = (c.ShortDescription || '').charAt(0).toUpperCase();
              if (!re.test(letter)) {
                letter = '#';
              }
              tmp[letter] = tmp[letter] || [];
              tmp[letter].push(c);
              dividers.push(letter);
            });
            dividers = $.unique(dividers);
            $scope.dividers = dividers;
            $scope.dividedItems = tmp;
            return tmp;
          };

          $scope.add = function () {
            $state.go('app.edit-item');
          };

          $scope.refresh = function () {
            $scope.itemOptions.Skip = 0;
            $scope.isMoreItems = false;
            $scope.loadItems();
          };

          $scope.clearSearch = function () {
            $scope.itemOptions.FreeText = '';
            $scope.itemOptions.Skip = 0;
            $scope.isMoreItems = false;
            $scope.loadItems();
          };

          $scope.edit = function (id) {
            $state.go('app.edit-item', {'id': id});
          };
          //Swipe delete 
          $scope.delete = function (id) {
            Utils.confirm('Are you sure to delete this data.', 'Delete data', function () {
              Utils.showIndicator();
              $http.delete(AppConfig.endpoint + 'products/' + id).then(function (response) {
                if (response.status === 200) {
                  $scope.refresh();
                } else {
                  alert('Data deleting failed.');
                }
                Utils.hideIndicator();
              });
            });

          };
          $rootScope.$on("productDataChanged", function (event, args) {
            $scope.itemOptions.FreeText = '';
            $scope.itemOptions.Skip = 0;
            $scope.isMoreItems = false;
            $scope.currencyID = AppConfig.currencyID;
            $scope.currency = Utils.getCurrencyName($scope.currencyID);
            $scope.loadItems();
          });

        });