'use strict';

angular.module('myApp.services', [])
        .factory('Utils', function ($q, $ionicLoading, $ionicPopup, AppConfig, $http, $rootScope) {
          var UtilsSrv = {
            config: null,
            countries: [],
            taxes: [],
            dues: [],
            currencies: [],
            languages: [],
            dataformats: [],
            settingData: {},
            showIndicator: function () {
              window.iL = $ionicLoading;
              $ionicLoading.show({
                template: '<span class="preloader preloader-white"></span>'
              });
            },
            hideIndicator: function () {
              $ionicLoading.hide();
            },
            alert: function (msg, title, callback) {
              title = title || AppConfig.organizationName;
              var alertPopup = $ionicPopup.alert({
                title: title,
                template: msg
              });
              if (callback) {
                alertPopup.then(function (res) {
                  callback();
                });
              }
            },
            confirm: function (msg, title, success, cancel) {
              var confirmPopup = $ionicPopup.confirm({
                title: title || AppConfig.organizationName,
                template: msg
              });
              confirmPopup.then(function (res) {
                if (res) {
                  if (success)
                    success();
                } else {
                  if (cancel)
                    cancel();
                }
              });
            },
            correctImageDataURI: function (dataURI) {
              //if mime type is not defined(specifically on samsung galaxy)
              if (/data:;?base64,/.test(dataURI)) {
                dataURI = dataURI.replace(/data:;?base64,/, 'data:image/jpeg;base64,');
              }
              return dataURI;
            },
            detectDevice: function (deviceType) {
              //Return boolean value according to deviceType
              var deviceInfo = window.navigator.userAgent;
              if (deviceInfo.toLowerCase().indexOf(deviceType) >= 0)
                return true
              else
                return false;
            },
            //Get Account setting datas from server and stored in UtilsSrv
            loadSettingData: function () {
              $http.get(AppConfig.endpoint + 'settings').
                      success(function (data, status, headers, config) {
                        if (!$.isEmptyObject(data) && status == 200) {
                          var settingData = data;
                          UtilsSrv.settingData = settingData;
                          AppConfig.dateFormatString = settingData.DateFormatString.toUpperCase();
                          AppConfig.currencySimbolString = settingData.CurrencySymbol;
                          AppConfig.currencyID = settingData.CurrencyId;
                          AppConfig.languageID = settingData.LanguageId;
                          $rootScope.$broadcast("invoiceDataChanged");
                          $rootScope.$broadcast("estimateDataChanged");
                          $rootScope.$broadcast("productDataChanged");
                        }
                      }).
                      error(function (data, status, headers, config) {

                      });
            },
            //Get Settings data from UtilsSrv.settingData
            getSettingData: function () {
              return UtilsSrv.settingData;
            },
            //Get Countries from server and stored in UtilsSrv
            loadCountries: function () {
              $http.get(AppConfig.endpoint + 'definitions/countries')
                      .then(function (response) {
                        var countries = response.data;
                        UtilsSrv.countries = countries;
                        return UtilsSrv.countries;
                      });
            },
            //Get Countries from UtilsSrv.countries
            getCountries: function () {
              if (UtilsSrv.countries.length)
                return UtilsSrv.countries;
              else
                return UtilsSrv.loadCountries();
            },
            //Get Languages from server and stored in UtilsSrv
            loadLanguages: function () {
              $http.get(AppConfig.endpoint + 'definitions/languages')
                      .then(function (response) {
                        var currencies = response.data;
                        UtilsSrv.languages = currencies;
                        return UtilsSrv.languages;
                      });
            },
            //Get Languages from UtilsSrv.languages
            getLanguages: function () {
              if (UtilsSrv.languages.length)
                return UtilsSrv.languages;
              else
                return UtilsSrv.loadLanguages();
            },
            //Get DateFormats from server and stored in UtilsSrv
            loadDateFormats: function () {
//              console.log('dues', UtilsSrv.dues);
              $http.get(AppConfig.endpoint + 'definitions/dateformats')
                      .then(function (response) {
                        var currencies = response.data;
                        UtilsSrv.dateformats = currencies;
                        return UtilsSrv.dateformats;

                      });
            },
            //Get DateFormats from UtilsSrv.dateformats
            getDateFormats: function () {
              if (UtilsSrv.dateformats.length)
                return UtilsSrv.dateformats;
              else
                return UtilsSrv.loadDateFormats();
            },
            //Get Currencies from server and stored in UtilsSrv
            loadCurrencies: function () {
//              console.log('dues', UtilsSrv.dues);
              $http.get(AppConfig.endpoint + 'definitions/currencies')
                      .then(function (response) {
                        var currencies = response.data;
                        UtilsSrv.currencies = currencies;
                        return UtilsSrv.currencies;

                      });
            },
            //Get Currencies from UtilsSrv.currencies
            getCurrencies: function () {
              if (UtilsSrv.currencies.length)
                return UtilsSrv.currencies;
              else
                return UtilsSrv.loadCurrencies();
            },
            //Get Currency Name from UtilsSrv.currencies with currency id
            getCurrencyName: function (currency_id) {
              var CurrencyName = 0;
              if (UtilsSrv.currencies.length) {
                for (var i = 0; i < UtilsSrv.currencies.length; i++) {
                  if (UtilsSrv.currencies[i].Id == currency_id) {
                    CurrencyName = UtilsSrv.currencies[i].Name;
                    break;
                  }
                }
                return CurrencyName;
              }
              else {
                return UtilsSrv.loadCountries();
              }
            },
            //Get Currency ID from UtilsSrv.currencies with currency name
            getCurrencyID: function (currency_name) {
              var CurrencyId = 0;
              if (UtilsSrv.currencies.length) {
                for (var i = 0; i < UtilsSrv.currencies.length; i++) {
                  if (UtilsSrv.currencies[i].Name == currency_name) {
                    CurrencyId = UtilsSrv.currencies[i].Id;
                    break;
                  }
                }
                return CurrencyId;
              }
              else {
                return UtilsSrv.loadCountries();
              }
            },
            //Get Countries from server and stored in UtilsSrv
            loadDues: function () {
              $http.get(AppConfig.endpoint + 'definitions/duedays')
                      .then(function (response) {
                        var dues = response.data;
                        UtilsSrv.dues = dues;
                        return UtilsSrv.dues;

                      });
            },
            //Get Countries from UtilsSrv.countries
            getDues: function () {
              if (UtilsSrv.dues.length)
                return UtilsSrv.dues;
              else
                return UtilsSrv.loadDues();
            },
            //Get Taxes from server and stored in UtilsSrv
            loadTaxes: function () {
              $http.get(AppConfig.endpoint + 'settings/taxes')
                      .then(function (response) {
                        if (response.status == 200) {
                          var taxes = response.data;
                          UtilsSrv.taxes = taxes;
                          return UtilsSrv.taxes;
                        }
                        return false;
                      });
            },
            //Get Taxes from UtilsSrv.countries
            getTaxes: function () {
              if (UtilsSrv.taxes.length) {
                return UtilsSrv.taxes;
              } else {
                return UtilsSrv.loadTaxes();
              }
            },
            //Get a Tax with the taxId
            getTaxById: function (taxId) {
              var returnVal = false;
              if (UtilsSrv.taxes.length)
                for (var i = 0; i < UtilsSrv.taxes.length; i++)
                  if (taxId == UtilsSrv.taxes[i].Id)
                    returnVal = UtilsSrv.taxes[i];

              return returnVal;
            },
            //Load UtilsSrv variables.
            initialize: function () {
              UtilsSrv.loadCountries();
              UtilsSrv.loadTaxes();
              UtilsSrv.loadDues();
              UtilsSrv.loadSettingData();
              UtilsSrv.loadCurrencies();
              UtilsSrv.loadLanguages();
              UtilsSrv.loadDateFormats();
            }
          };

          return UtilsSrv;
        });
