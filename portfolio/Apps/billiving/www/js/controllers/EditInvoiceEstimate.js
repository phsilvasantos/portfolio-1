angular.module('myApp.controllers')

        .controller('EditInvoiceEstimateCtrl', function ($scope, $state, $http, $stateParams, $timeout, Utils, $ionicNavBarDelegate, AppConfig, $ionicModal, $ionicScrollDelegate, $window, $rootScope) {

          $scope.selectedInvoice = {};
          $scope.selectedInvoice.Discount = 0;
          $scope.selectedInvoice.Shipping = 0;
          $scope.clients = [];
          $scope.lineitem = {};

          $scope.summaryData = {subTotal: 0, Tax: 0, Total: 0};
          $scope.docItemList = [];
          $scope.isCreatePage = ($stateParams.id) ? $stateParams.id : '';

          $scope.isInvoice = $state.includes('app.edit-invoice');
          if ($scope.isInvoice) {
            $scope.dataUrl = 'invoices/';
            $scope.previousPageUrl = 'app.invoices';
          } else {
            $scope.dataUrl = 'estimates/';
            $scope.previousPageUrl = 'app.estimates';
          }
          Utils.hideIndicator();
          $scope.options = {
            FreeText: '', StatusId: 1 /*, OrderBy: 'OrganizationName' */
          };
          $scope.currencySimbol = AppConfig.currencySimbolString;
          $scope.currencyID = AppConfig.currencyID;

          $scope.selectedInvoice.IssueDate = new Date();
          $scope.selectedInvoice.Due = 0;

          $scope.save = function () {
            Utils.showIndicator();

            if (!$scope.isCreatePage) {
              $scope.selectedInvoice.CurrencyId = $scope.currencyID;
              $scope.selectedInvoice.LanguageId = AppConfig.languageID;
            }

            console.log($scope.selectedInvoice);
            var callback = function (response) {
              if (response.status === 200) {
                if ($scope.isInvoice) {
                  $rootScope.$broadcast("invoiceDataChanged");
                } else {
                  $rootScope.$broadcast("estimateDataChanged");
                }

                if ($scope.isCreatePage) {
                  //Utils.alert("Success!");
                } else {
                  $scope.isCreatePage = response.data.Id;
                  //Utils.alert("Create Success!");
                }
              }
              Utils.hideIndicator();
            };
            $scope.selectedInvoice.DocItems = $scope.docItemList;

            if (!$scope.isCreatePage) {
              $http.post(AppConfig.endpoint + $scope.dataUrl, $scope.selectedInvoice).then(callback);
            } else {
              $http.put(AppConfig.endpoint + $scope.dataUrl + $scope.isCreatePage, $scope.selectedInvoice).then(callback);
            }
          };

          $scope.delete = function () {
            Utils.confirm('Are you sure to delete this data.', 'Delete data', function () {
              if ($scope.isCreatePage) {
                Utils.showIndicator();
                $http.delete(AppConfig.endpoint + $scope.dataUrl + $scope.isCreatePage).then(function (response) {
                  if (response.status === 200) {
                    $window.history.back();
                  } else {
                    alert('Data deleting failed.');
                  }
                  Utils.hideIndicator();
                });
              } else {
                $scope.selectedInvoice = {};
              }
            });
          };

          $scope.add = function () {
            $scope.isCreatePage = '';
          };

          $scope.send = function () {
            $state.go('app.send-mail', {'id': $scope.isCreatePage, dataurl: $scope.dataUrl});
          };

          $scope.goBack = function () {
            $ionicNavBarDelegate.back();
          };

          $scope.loadSelectedInvoice = function () {
            Utils.showIndicator();
            $http.get(AppConfig.endpoint + $scope.dataUrl + $scope.isCreatePage)
                    .then(function (response) {
                      var InvoiceInfo = response.data;

                      //Selected Invoice or Estimate Information Object.
                      InvoiceInfo.Discount *= 1;
                      InvoiceInfo.Shipping *= 1;
                      console.log(InvoiceInfo);
                      $scope.selectedInvoice = InvoiceInfo;

                      $scope.currencySimbol = Utils.getCurrencyName(InvoiceInfo.CurrencyId);
                      //Convert IssueDate String to valid date type.
                      $scope.selectedInvoice.IssueDate = new Date($scope.selectedInvoice.IssueDate);
                      $scope.dateChange();

                      //Line Items of Invoice or Estimate in Response.
                      $scope.docItemList = ($scope.selectedInvoice.DocItems) ? $scope.selectedInvoice.DocItems : [];
                      $scope.setSumaryData();
                      $http.get(AppConfig.endpoint + 'clients/' + InvoiceInfo.ClientId)
                              .then(function (response) {
                                var clientInfo = response.data;
                                $scope.selectedClient = clientInfo;
                                $scope.selectedClient.displayNameForThis = (clientInfo.OrganizationName) || (clientInfo.Email);
                                Utils.hideIndicator();
                              });
                    });
          };
          // Get Tax, SubTotal and Total.
          $scope.setSumaryData = function () {
            if ($scope.docItemList.length) {
              $scope.summaryData = {subTotal: 0, Tax: 0, Total: 0};
              for (var i = 0; i < $scope.docItemList.length; i++) {
                var subTotal = 0;
                var taxVal = 0;
                var Total = 0;
                if ($scope.docItemList[i].ItemPrice && $scope.docItemList[i].ItemQuantity) {
                  subTotal = $scope.docItemList[i].ItemPrice * $scope.docItemList[i].ItemQuantity;
                  if ($scope.docItemList[i].TaxId1) {
                    var tax1 = Utils.getTaxById($scope.docItemList[i].TaxId1);
                    if (tax1)
                      taxVal = tax1.Rate / 100 * subTotal;
                  }
                  if ($scope.docItemList[i].TaxId2) {
                    var tax2 = Utils.getTaxById($scope.docItemList[i].TaxId2);
                    if (tax2)
                      taxVal += tax2.Rate / 100 * subTotal;
                  }
                  Total = subTotal + taxVal;
                }
                $scope.summaryData.subTotal += subTotal;
                $scope.summaryData.Tax += taxVal;
                $scope.summaryData.Total += Total;

              }
            } else {
              $scope.summaryData = {subTotal: 0, Tax: 0, Total: 0};
            }
          }

          /****************************************
           *        
           *        Open Select Client Window with search text and infinite scrolling.
           *        
           ****************************************/

          // Open Client list modal when click Client Name field
          $scope.editClient = function () {
            $ionicModal.fromTemplateUrl('templates/partials/select-clients.html', {
              scope: $scope
            }).then(function (modal) {
              $scope.clients = [];
              $scope.isMoreClients = true;
              $scope.clientSearchOptions = {
                FreeText: '', StatusId: 1, Skip: 0, Top: 20, OrderBy: 'OrganizationName'
              };
              $scope.clientsmodal = modal;
              $scope.clientsmodal.show();
            });
          }
          $(document).off('search', '#clientsSearchForm')
                  .on('search', '#clientsSearchForm', function () {
                    $scope.clientSearchOptions.Skip = 0;
                    $scope.isMoreClients = false;
                    $scope.loadClients();
                  });

          $scope.loadMoreClientsEstimate = function () {
            if (!$scope.isMoreClients)
              return;
            if ($scope.clients.length > 0)
              $scope.clientSearchOptions.Skip += $scope.clientSearchOptions.Top;
            $scope.loadClients();
          };

          $scope.clearClientSearch = function () {
            $scope.clientSearchOptions.FreeText = '';
            $scope.loadClients();
          };

          // Get Client List with search value.
          $scope.loadClients = function () {
            if ($scope.clientSearchOptions.Skip === 0) {
              $ionicScrollDelegate.scrollTop(true);
            }
            $http.get(AppConfig.endpoint + 'clients?' + $.param($scope.clientSearchOptions))
                    .then(function (response) {
                      $scope.isMoreClients = false;
                      var clients = response.data;
                      if ($scope.clientSearchOptions.Skip === 0) {
                        $scope.clients = clients;
                      } else {
                        $scope.clients = $scope.clients.concat(clients);
                      }
                      $scope.isMoreClients = clients.length >= $scope.clientSearchOptions.Top;

                      $scope.$broadcast('scroll.infiniteScrollComplete');
                    });
          };
          // Get Informations of selected client
          $scope.select = function (client) {
            $scope.clientSearchOptions = {
              FreeText: '', StatusId: 1, Skip: 0, Top: 20, OrderBy: 'OrganizationName'
            };
            $scope.clientsmodal.remove();
            $scope.clientsmodal = null;
            $scope.isMoreClients = false;

            $scope.selectedClient = client;
            $scope.selectedInvoice.ClientId = client.Id;
            $scope.selectedClient.displayNameForThis = (client.OrganizationName) || (client.Email);

            //when create new invoice or estimate, if there is Due of selected client, is setted that.
            if (!$scope.selectedInvoice.Due && $scope.selectedClient.Due)
              $scope.selectedInvoice.Due = $scope.selectedClient.Due;

          }
          /****************************************
           *        
           *        Open Add Line Item Modal
           *        
           ****************************************/
          $scope.addLineItemModal = function () {
            $scope.lineitem = {};
            $scope.taxes = Utils.getTaxes();
            $ionicModal.fromTemplateUrl('templates/partials/add-line-item.html', {
              scope: $scope
            }).then(function (modal) {
              $scope.addItemModal = modal;
              $scope.addItemModal.show();
            });
          }
          // Update or add Line Item to the Invoice.
          $scope.addLineItem = function () {
            if (!$scope.setTotal()) {
              Utils.alert('Total price is zero. Please check Item price and Quantity.', '', function () {
                return;
              });
            } else {
              // docItemList.unSave is indicated that the Line items is changed or unchanged .
//              $scope.lineitem.unSave = true;
              if ($scope.lineitem.selectedLineItem != null) {
                // This is edit Line Item.
                $scope.docItemList[$scope.lineitem.selectedLineItem] = $scope.lineitem;
              } else {
                // This is add new Line Item.
                $scope.docItemList.push($scope.lineitem);
              }
//              $scope.save();
              $scope.addItemModal.hide();
              $scope.setSumaryData();
            }
          }
          // Get Total value of individual Line Items including Taxes.
          $scope.setTotal = function () {
            var taxValueOne = 0;
            var taxValueTwo = 0;
            if (isNaN($scope.lineitem.ItemPrice))
              return 0;
            if (isNaN($scope.lineitem.ItemQuantity))
              return 0;
            var subTotal = $scope.lineitem.ItemPrice * $scope.lineitem.ItemQuantity;
            if ($scope.lineitem.TaxId1) {
              var tax1 = Utils.getTaxById($scope.lineitem.TaxId1);
              taxValueOne = tax1.Rate / 100 * subTotal;
            }
            if ($scope.lineitem.TaxId2) {
              var tax2 = Utils.getTaxById($scope.lineitem.TaxId2);
              taxValueTwo = tax2.Rate / 100 * subTotal;
            }
            var total = subTotal + taxValueTwo + taxValueOne;
            if (isNaN(total))
              total = 0;

            return total;
          }
          // Swipe Line Item delete
          $scope.deleteLineItem = function (index) {
            Utils.confirm('Are you sure to delete this data.', 'Delete data', function () {
              $scope.docItemList.splice(index, 1);
//              $scope.save();
              $scope.setSumaryData();
            });
          }
          // Swipe Line Item edit
          $scope.editLineItem = function (index) {
            $scope.lineitem = $scope.docItemList[index];
            // if lineitem.selectedLineItem is not null, will be execute the edit event.
            $scope.lineitem.selectedLineItem = index;
            $scope.taxes = Utils.getTaxes();
            $ionicModal.fromTemplateUrl('templates/partials/add-line-item.html', {
              scope: $scope
            }).then(function (modal) {
              $scope.addItemModal = modal;
              $scope.addItemModal.show();
            });
          }
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
/////////Defined events and variables for products modal page.
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
          $scope.productOptions = {
            FreeText: '', StatusId: 1, OrderBy: 'ItemId'
          };

          // Open item modal on add-line-item page.
          $scope.selectProductsModal = function () {
            $scope.taxes = Utils.getTaxes();
//            if ($scope.lineitem.ItemId) {
//              $scope.productOptions.FreeText = $scope.lineitem.ItemId;
//              $scope.loadProducts();
//            }
            $ionicModal.fromTemplateUrl('templates/partials/select-items.html', {
              scope: $scope
            }).then(function (modal) {
              $scope.selectItemModal = modal;
              $scope.loadProducts();
              $scope.selectItemModal.show();
            });
          }

          /*
           This is a event for custom searching of items.
           */
          $scope.productOptions = {
            FreeText: '', StatusId: 1, Skip: 0, Top: 20, OrderBy: 'ShortDescription'
          };
          
          
          $(document).off('search', '#productsSearchForm').
                  on('search', '#productsSearchForm', function () {
            $scope.productOptions.Skip = 0;
            $scope.isMoreItems = false;
            $scope.loadProducts();
          });

          $scope.clearSearch = function () {
            $scope.productOptions.FreeText = '';
            $scope.loadProducts();
          };

          // Get Client List with search value.
          $scope.loadProducts = function () {
            $http.get(AppConfig.endpoint + 'products?' + $.param($scope.productOptions))
                    .then(function (response) {
                      $scope.isMoreItems = false;
                      var products = response.data;
                      if ($scope.productOptions.Skip === 0) {
                        $scope.products = products;
                      } else {
                        $scope.products = $scope.products.concat(products);
                      }

                      $timeout(function () {
                        $scope.isMoreItems = products.length >= $scope.productOptions.Top;
                      }, 1000);
                      $scope.$broadcast('scroll.infiniteScrollComplete');
                      
                      Utils.hideIndicator();
                    });
          };

          $scope.selectProduct = function (product) {
            $scope.lineitem.ItemId = product.ItemId;
            $scope.lineitem.ItemDescription = product.ShortDescription;
            $scope.lineitem.ItemPrice = product.Price;
            $scope.selectItemModal.hide();
          };
          
          $scope.loadMoreItems = function () {
            if (!$scope.isMoreItems)
              return;
            if ($scope.products.length > 0)
              $scope.productOptions.Skip += $scope.productOptions.Top;
            $scope.loadProducts();
          };



          // Open Client list modal when click Client Name field
          $scope.dues = Utils.getDues();

          $scope.focusDate = function () {
            $('#datepicker').focus();
          };

          $scope.dateChange = function () {
            $scope.selectedInvoice.VirtualIssueDate = $scope.changeDateTimeToDate($scope.selectedInvoice.IssueDate);
          }

          $scope.changeDateTimeToDate = function (datetime) {
            return datetime = moment(new Date(datetime)).format(AppConfig.dateFormatString);
          }
          $scope.dateChange();

          // If there is param, load Invoices or Estimates according to selected id
          if ($scope.isCreatePage)
            $scope.loadSelectedInvoice();
        });
