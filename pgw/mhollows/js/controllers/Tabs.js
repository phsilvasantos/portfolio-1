'use strict';

angular.module('gnApp.controllers')
        .controller('TabsController', function ($scope, $state, $location) {

          $scope.isTabActive = function (stateName) {
            var currPath = $location.path();
            if (stateName === 'app.members' && (currPath.substr(currPath.length - 3) !== 'all')) {
              return false;
            }
            return $state.includes(stateName);
          };

          $scope.openTabItem = function (pageID, pageTitle) {
            //clear view cache
            var cachedPane = $('#view-' + pageID).closest('.pane[nav-view=cached]');
            if(cachedPane.length === 0){
              cachedPane = $('.pane[nav-view=cached]#view-'+pageID);
            }
            cachedPane.remove();

            var stateName = 'app.' + pageID;
            var stateParams = {pageTitle:pageTitle};
            if (pageID === 'members') {
              stateParams.groupId = 'all';
            }
            $state.go(stateName, stateParams);
          };

        });
