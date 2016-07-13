//Class declaration
function DailyNation() {
  that = this;
}

//Database setup
DailyNation.prototype.setup = function(callback) {	
	this.db = window.openDatabase("myDB", 1, "DN DB", 2 * 1024 * 1024);
	this.db.transaction(this.initDB, this.dbErrorHandler, callback);
}

//Error handler callback
DailyNation.prototype.dbErrorHandler = function(e) {
	console.log('DB Error');
	console.dir(e);
}

//Db structure initialization
DailyNation.prototype.initDB = function(t) {
	t.executeSql('CREATE TABLE IF NOT EXISTS DailyNationDb (title, story, photo, author)');
}

//Method to get all entries
DailyNation.prototype.getEntries = function(start,callback) {
	console.log('Running getEntries');
	if(arguments.length === 1) callback = arguments[0];

	this.db.transaction(
		function(t) {
			t.executeSql('SELECT * FROM DailyNationDb',[],
				function(t,results) {
					callback(that.fixResults(results));
				},this.dbErrorHandler);
		}, this.dbErrorHandler);

}

//Method to get single entry by passing id and callback method name
DailyNation.prototype.getEntry = function(title, callback) {

	this.db.transaction(
		function(t) {
			t.executeSql('SELECT * FROM DailyNationDb WHERE title = ?', [title],
				function(t, results) {
					callback(that.fixResult(results));
				}, this.dbErrorHandler);
			}, this.dbErrorHandler);

}

//Method to save the entry by passing data as a object and callback method name
DailyNation.prototype.saveEntry = function(data, callback) {
	//console.dir(data);
	this.db.transaction(
		function(t) {
			t.executeSql('INSERT INTO DailyNationDb (title, story, photo, author) VALUES ( ?, ?, ?, ?)', 
			[ data.title, data.story, data.photo, data.author],
			function() { 
				callback();
			}, this.dbErrorHandler);
		}, this.dbErrorHandler);
}

//Method to update entry by passing id and callback method name
DailyNation.prototype.deleteEntries = function(callback) {
	//console.dir(title);
	this.db.transaction(
		function(t) {
			t.executeSql('DELETE FROM DailyNationDb',[],
				function(t, results) {
					callback();
				}, this.dbErrorHandler);
			}, this.dbErrorHandler);

}

//To convert record sets into array objects
DailyNation.prototype.fixResults = function(res) {
	var result = [];
	for(var i=0, len=res.rows.length; i<len; i++) {
		var row = res.rows.item(i);
		result.push(row);
	}
	return result;
}

// To get single entry and returns single object
DailyNation.prototype.fixResult = function(res) {
	if(res.rows.length) {
		return res.rows.item(0);
	} else return {};
}