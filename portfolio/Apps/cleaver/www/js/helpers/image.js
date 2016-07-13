angular
    .module('cleverbaby.helpers')
    .factory("Image", ["$ionicModal", '$cordovaCamera', '$cordovaFile', '$q', '$http', '$window',
        function($ionicModal, $cordovaCamera, $cordovaFile, $q, $http, $window){

        /**
         * Handles taking an image from the camera or picking an image from the gallery
         * @param sourceType - take image from camera or from gallery.
         * @returns {*} - returns the cordova plugin function.
         */
        function captureImage(sourceType){
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType[sourceType],
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            return $cordovaCamera.getPicture(options);
        }

        return {
            captureImage: captureImage
        }
    }]);