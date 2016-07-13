angular
    .module('cleverbaby.helpers', [])
    .filter('nameOfActivity', function(){
        var table = {
            'nurse': 'Nurse',
            'bottle': 'Bottle',
            'pump': 'Pump',
            'solid': 'Solid',
            'diaper': 'Diaper change',
            'sleep': 'Sleep',
            'milestone': 'Milestone',
            'growth': 'Growth',
            'bath': 'Bath',
            'play': 'Play',
            'doctor': 'Doctor',
            'sick': 'Sickness',
            'temperature': 'Temperature',
            'medication': 'Medication',
            'vaccination': 'Vaccination',
            'allergy': 'Allergy',
            'mood': 'Mood',
            'moment': 'Activity',
            'diary': 'Diary',
            'todo': 'Todo'
        };

        return function(x){
            return table[x];
        }
    });
