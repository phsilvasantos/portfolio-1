angular.module('cleverbaby.controllers')
.controller('activityCtrl', ['$rootScope', '$scope', '$timeout', '$window', 'ActivityService', 'NotificationService', '$ionicModal', 'Image', '$ionicActionSheet',
    function ($rootScope, $scope, $timeout, $window, ActivityService, NotificationService, $ionicModal, Image, $ionicActionSheet) {

        $scope.saveActivity = function(type, callback){

            $scope.modal.data.type = type;
            if($scope.modal.mode == 'add'){
                ActivityService.addActivity($scope.modal.data, $rootScope.babyId).then(function(activity){
                    $rootScope.$broadcast('activityAdd', activity);
                    if(callback && angular.isFunction(callback))
                        callback($scope.modal.mode, activity);
                    $scope.modal.hide();
                });
            } else {
                ActivityService.editActivity($scope.modal.data.uuid, $scope.modal.data, $rootScope.babyId).then(function(activity){
                    $rootScope.$broadcast('activityEdit', activity);
                    if(callback && angular.isFunction(callback))
                        callback($scope.modal.mode, activity);
                    $scope.modal.hide();
                });
            }
        };

        $scope.deleteActivity = function (type) {
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                destructiveText: 'Delete',
                titleText: 'Are you sure you want to delete this activity?',
                cancelText: 'Cancel',
                cancel: function() {
                },
                destructiveButtonClicked: function () {
                    $scope.modal.data.type = type;
                    ActivityService.deleteActivity($scope.modal.data.uuid, $scope.modal.data, $rootScope.babyId).then(function(activity){
                        $rootScope.$broadcast('activityDelete', activity);
                        $scope.modal.hide();
                    });
                    hideSheet();
                },
                buttonClicked: function(index) {
                    return true;
                }
            });
        };

        $scope.manual = true;
        $scope.timer = false;

        $scope.$watch('timer', function (isTimer) {
            $scope.manual = !isTimer;
        });

        $scope.switchtimer = function(){
            $scope.manual = !$scope.manual;
            $scope.timer = !$scope.timer;
        };

        $scope.timerStart = function (type, param) {
            $scope.saveActivity(type, function (mode, activity) {
                $rootScope.$broadcast('timerEvent', {
                    'type': 'nurse',
                    'eventName': 'command',
                    'backPropagation': false,
                    'direction': false,
                    'command': 'start-' + param, // start, stop
                    'params': {
                        'timeLeft': activity.nurse_timeleft,
                        'timeRight': activity.nurse_timeright
                    }, // other parameters
                    'activity': activity,
                });
            });
        }
        
        $ionicModal.fromTemplateUrl('templates/modals/addnote.html', {
            animation: 'slide-in-up',
            name: 'noteModal'
        }).then(function(modal) {
            $scope.modalAddNote = modal;            
        });
        $scope.addNote = function(){
            $scope.modalAddNote.comment = $scope.modal.data.comment || "";
            $scope.modalAddNote.show();
        };

        $scope.deleteNote = function(){
            $scope.modal.data.comment = '';
        };

        $scope.closeAddNoteModal = function(){
            $scope.modalAddNote.comment = "";
            $scope.modalAddNote.hide();
        };

//        $scope.addPhoto = function(){
//            $ionicModal.fromTemplateUrl('templates/modals/addphoto.html', {
//                scope: $scope,
//                animation: 'slide-in-up'
//            }).then(function(modal) {
//                $scope.modalAddPhoto = modal;
//                $scope.modalAddPhoto.name = 'photoModal';
//                $scope.modalAddPhoto.show();
//            });
//        };
        
        $scope.captureImageOption = {
            success: function(sourceType){
                $scope.selectCaptureImage(sourceType);
            }
        };

        $scope.selectCaptureImage = function(sourceType){
//            $scope.modalAddPhoto.hide();
            Image.captureImage(sourceType).then(function(imageURI) {
                $scope.modal.data.media.push({
                    displayImage: imageURI,
                    imageType: 'new'
                });
            }, function(err) {
                // error
            });
        };

        $scope.deletePhoto = function(media){
            media.type = 'del';
        };

        $scope.closeAddPhotoModal = function(){
            $scope.modalAddPhoto.hide();
        };

        $scope.closeActivity = function() {
            $scope.modal.hide();
        };

        $scope.submitActivityCheck = function() {
            $timeout(function() {
                angular.element('.btn-mid').trigger('click');
            }, 0);
        }

        $scope.$on('modal.hidden', function(e, a){
            if($scope.modalAddNote && a.name == 'noteModal'){
                if($scope.modalAddNote.comment){
                    $scope.modal.data.comment = $scope.modalAddNote.comment;
                }
            }
        });

        $scope.$on('modal.shown', function (e, a) {
            if(a.mode != 'add' || angular.isUndefined($scope.resetOnShow))
                return;

            if($scope.resetOnShow == 'nurse') {
                $scope.timer = false;
                $scope.modal.data.nurse_timeleft = 0;
                $scope.modal.data.nurse_timeright = 0;
            }
        });

        /**
         * Hides the keyboard when tapping go.
         * @param input
         */
        $scope.hideKeyboard = function(){
            $(document.activeElement).blur();
            return false;
        };

        // Nurse activity specific
        $scope.$watch('modal.data.nurse_timeleft', function (timeleft) {
            if(angular.isUndefined(timeleft))
                return;
            var valL = isNaN(timeleft) ? 0 : timeleft,
                valR = angular.isUndefined($scope.modal.data.nurse_timeright) ? 0 : $scope.modal.data.nurse_timeright;
            $scope.modal.data.nurse_timeboth = Number(valL) + Number(valR);
        });

        $scope.$watch('modal.data.nurse_timeright', function (timeright) {
            if(angular.isUndefined(timeright))
                return;
            var valL = angular.isUndefined($scope.modal.data.nurse_timeleft) ? 0 : $scope.modal.data.nurse_timeleft,
                valR = isNaN(timeright) ? 0 : timeright;
            $scope.modal.data.nurse_timeboth = Number(valL) + Number(valR);
        });

        $scope.getTimeMinutes = function (value, includeUnit) {
            var u = includeUnit ? 'min' : '';
            if(angular.isUndefined(value))
                return (0 + u);
            var b = (value - value % 60) / 60;
            if(isNaN(b))
                return (0 + u);
            return (b + u);
        };
    }
]);

