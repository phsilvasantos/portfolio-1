define(['app'], function (app) {

  function Alarm(values) {
    var date = new Date;
    values = values || {};
    this.id = values['id'] || app.utils.generateGUID();
    this.picId = values['picId'] || app.utils.getRandomInt(1, 10);
    this.createdOn = values['createdOn'] || date;

    this.Alarmtitle = values['Alarmtitle'] || 'No name';
    this.time = values['time'] || app.utils.setTimeString(date.getHours()) + ':' + app.utils.setTimeString(date.getMinutes());
    this.status = (values['status'] == "false" || values['status'] == '')?false : true;
    this.monday = values['monday'] || false;
    this.tuesday = values['tuesday'] || false;
    this.wednesday = values['wednesday'] || false;
    this.thursday = values['thursday'] || false;
    this.friday = values['friday'] || false;
    this.saturday = values['saturday'] || false;
    this.sunday = values['sunday'] || false;
  }

  Alarm.prototype.setValues = function (inputValues) {
    for (var i = 0, len = inputValues.length; i < len; i++) {
      var item = inputValues[i];
      if (item.type === 'checkbox') {
        this[item.id] = item.checked;
      }
      else {
        this[item.id] = item.value;
      }
    }
  };

  Alarm.prototype.validate = function () {
    var result = true;
    if (_.isEmpty(this.Alarmtitle)) {
      result = false;
    }
    return result;
  };

  return Alarm;
});