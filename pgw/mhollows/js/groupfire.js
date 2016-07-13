var Groupfire = new function() {
  this.logMessages = [];
  this.log = function(message,group) {
    if(!group) group = 'global';
    if(console) console.log(message);
    this.logMessages.push({
      datetime: new Date(),
       message: message,
         group: group });
  };
};
