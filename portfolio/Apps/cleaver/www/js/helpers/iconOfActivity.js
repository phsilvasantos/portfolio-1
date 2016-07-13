angular
    .module('cleverbaby.helpers')
    .filter('iconOfActivity', function(){
        var table = {
            'nurse': 'icon-breast-feeding',
            'bottle': 'icon-bottle',
            'pump': 'icon-breast-pumper-line',
            'solid': 'icon-banana-3',
            'diaper': 'icon-diaper',
            'sleep': 'icon-sleepcc',
            'milestone': 'icon-milestones',
            'growth': 'icon-baby-growth',
            'bath': 'icon-bath',
            'play': 'icon-rattle-alias-3',
            'doctor': 'icon-doctor',
            'sick': 'icon-mood-sad',
            'temperature': 'icon-temperature',
            'medication': 'icon-medication',
            'vaccination': 'icon-injection',
            'allergy': 'icon-allergy',
            'mood': 'icon-mood-ok',
            'moment': 'icon-rattle-alias-1',
            'diary': 'icon-diary',
            'todo': 'icon-book-open'
        };
        return function(x){
            return table[x] || "";
        }
    });
