define(["js/router"], function (router) {
  var $ = Dom7;

  function generateGUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
  }

  function setStatus(id, status) {
    var f7Alarms = localStorage.getItem("f7Alarms");
    var alarms = f7Alarms ? JSON.parse(f7Alarms) : [];
    var newAlarms = [];
    for (var i = 0, len = alarms.length; i < len; i++) {
      var alarm = alarms[i];
      if (alarm.id == id) {
        alarm.status = status;
        console.log(id, status);
      }
      newAlarms.push(alarm);
    }
    localStorage.setItem("f7Alarms", JSON.stringify(newAlarms));
    return newAlarms;
  }
  ;

  function getRandomInt(min, max)
  {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function setTimeString(value) {
    if (value < 10) {
      value = '0' + value;
    }
    return value;
  }
  
  function getTimeString(value) {
    var timeArr = value.split(':');
    return timeArr;
  }

  function setWeekDayString(value) {
    var weekday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return weekday[value];
  }

  function setAlarms() {
    var alarmData = JSON.parse(localStorage.getItem("f7Alarms")) ? JSON.parse(localStorage.getItem("f7Alarms")) : false;
    if (alarmData) {
      // Check platform
      var isiOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
      var audioPath = "file:///android_asset/www/wake_me_eva.wav";

      if (isiOS)
        audioPath = "wake_me_eva.wav";
      var alarms = [];
      
      for (var i = 0; i < alarmData.length; i++) {
        var timeArr = alarmData[i].time.split(':');
        var data = {};
        if (!alarmData[i].sunday && !alarmData[i].monday && !alarmData[i].tuesday && !alarmData[i].wednesday && 
              !alarmData[i].thursday && !alarmData[i].friday && !alarmData[i].saturday) {
          data = {
            type: 'onetime',
            time: {hour: timeArr[0], minute: timeArr[1]},
            id: alarmData[i].id,
            extra: {id: alarmData[i].id},
            sound: audioPath,
            message: alarmData[i].Alarmtitle
          };
        }else{
          var weekData = [];
          if (alarmData[i].sunday)
            weekData.push('sunday');
          if (alarmData[i].monday)
            weekData.push('monday');
          if (alarmData[i].tuesday)
            weekData.push('tuesday');
          if (alarmData[i].wednesday)
            weekData.push('wednesday');
          if (alarmData[i].thursday)
            weekData.push('thursday');
          if (alarmData[i].friday)
            weekData.push('friday');
          if (alarmData[i].saturday)
            weekData.push('saturday');
          data = {
            type: 'daylist',
            time: {hour: timeArr[0], minute: timeArr[1]},
            id: alarmData[i].id,
            extra: {id: alarmData[i].id},
            days: weekData,
            sound: audioPath,
            message: alarmData[i].Alarmtitle
          };
        }
        

        if (alarmData[i].status)
          alarms.push(data);
      }
      if (window.cordova)
        window.wakeuptimer.wakeup(successCallback, errorCallback, {alarms: alarms});
    }
  }

  function successCallback(result) {
    var alarmData = result;
    console.log(localStorage.getItem("f7Alarms"));
    
    if (result.type === 'wakeup')
      alarmActive(alarmData.extra);
  }

  function errorCallback(result) {
    alert('Alarm Error!!!');
  }

  function alarmActive(alarmData) {
    if (!isMediaTurnOn) {      
      setTimeout(function () {
        var alarms = JSON.parse(localStorage.getItem("f7Alarms"));
        alarmData = _.find(alarms, {time: setTimeString(new Date().getHours()) + ':' + setTimeString(new Date().getMinutes())});
        console.log('sdfsdfsdfsdfsdfsdfsdf', alarmData);
        alarmPlay(alarmData);
      }, 3000);
    }
  }

  function alarmPlay(alarmData) {
    require(['js/home/homeController'], function (controller) {
      controller.activeAlarm({id: alarmData.id});
    });
    var isiOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
    var audioPath = "file:///android_asset/www/wake_me_eva.wav";

    if (isiOS) audioPath = "wake_me_eva.wav";
    playAudio(audioPath);
  }
  
  function alarmStop() {
    require(['js/home/homeController'], function (controller) {
      controller.init();
    });
    stopAudio();
  }
  
  function setActivePoint(alarms) {
    if (alarms.length) {
      var tempAlarms = [];
      for (var k = 0; k < alarms.length; k++) {
        var alarm = alarms[k];
        var weekDayArr = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        var currentDate = moment().format();
        var aPointDate = false;
        for (var i = 0; i < 7; i++) {
          var aDate = moment().day(weekDayArr[i]).hour(getTimeString(alarm.time)[0]).minute(getTimeString(alarm.time)[1]).format();
          if (alarm[weekDayArr[i]] && (aDate > currentDate) && !aPointDate) {
            aPointDate = aDate;
            alarm.activePoint = new Date(aPointDate);
            tempAlarms.push(alarm);
          }
        }
        if(!aPointDate){
          var aDate = moment(new Date().setHours(getTimeString(alarm.time)[0], getTimeString(alarm.time)[1])).format();
          if(aDate > currentDate){
            alarm.activePoint = new Date(aPointDate);
          }else{
            alarm.activePoint = new Date('3000-12-31');
          }
          tempAlarms.push(alarm);
        }
      }
      alarms = tempAlarms;
    }
    return alarms;
  }
  
  function alarmSort(a, b) {
    console.log('aed', a);
    return new Date(a.activePoint) - new Date(b.activePoint);
  }


  return {
    generateGUID: generateGUID,
    getRandomInt: getRandomInt,
    setTimeString: setTimeString,
    setStatus: setStatus,
    setWeekDayString: setWeekDayString,
    setAlarms: setAlarms,
    alarmActive: alarmActive,
    getTimeString:getTimeString,
    alarmPlay: alarmPlay,
    alarmStop:alarmStop,
    setActivePoint:setActivePoint,
    alarmSort:alarmSort
  };
});