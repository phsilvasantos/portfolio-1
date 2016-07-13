organizate.service('FunctionService', function() {
    this.AddZero = function(num) {
        return (num >= 0 && num < 10) ? "0" + num : num + "";
    }
    this.AddZeroHour = function(num) {
        var resultnum = num % 12;
        if(resultnum == 0) resultnum = 12;
        return (resultnum >= 0 && resultnum < 10) ? "0" + resultnum : resultnum + "";
    }
    this.AddZeroMonth = function(num) {
        if(num == 0) num = 12;
        return (num >= 0 && num < 10) ? "0" + num : num + "";
    }
    this.getAfterPastTime = function(num) {
        return (num >= 0 && num < 12) ? "AM" : "PM";
    }
});