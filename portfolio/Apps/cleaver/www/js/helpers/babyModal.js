angular
    .module('cleverbaby.helpers')
    .factory("BabyModal", ["$ionicModal", "BabyService", function($ionicModal, BabyService){
        var babyModal;
        $ionicModal.fromTemplateUrl('templates/modals/baby.html', function(modal){
            babyModal = modal;
        });
        return {
            showModal: function(baby){
                while(!babyModal){}
                babyModal.edit = baby?true:false;
                babyModal.baby = (baby || BabyService.newBaby());
                babyModal.x = Math.random();
                babyModal.show();
            }
        }
    }]);