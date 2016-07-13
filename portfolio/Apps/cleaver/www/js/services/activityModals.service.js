angular
    .module('cleverbaby')
    .service('activityModals', ["$ionicModal", function($ionicModal){

        var exports = {
            modals: {}
        };

        var activityTypes = [
            'nurse',
            'bottle',
            'pump',
            'diaper',
            'solid',
            'sleep',
            'milestone',
            'growth',
            'bath',
            'play',
            'doctor',
            'sick',
            'temperature',
            'medication',
            'vaccination',
            'allergy',
            'mood',
            'moment',
            'diary',
            'todo'
        ];

        activityTypes.forEach(function(x){
            $ionicModal.fromTemplateUrl('templates/activities/'+x+'.html',function(modal){
                exports.modals[x] = modal;
            });
        });

        function initialData() {
            var data = {};
            data.time = new Date();
            data.media = [];
            return data;
        }

        exports.showModal = function(type, showData){

            var x = showData ? angular.copy(showData, x) : initialData(type);

            function showModal(modal){
                modal.mode = showData ? 'edit':'add';
                modal.data = x;
                modal.show();
            }
            exports.modals[type] && showModal(exports.modals[type]);
        };

        return exports;
    }]);
