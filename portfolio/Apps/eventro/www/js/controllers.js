//key to the local storage that will get a user's favourited events
var FAVOURITED_EVENTS_KEY = "favouritedSchEvents";

//gets the stored data for a given key in local storage, and inteprets it as an array
function getArrayFromLocalStorage(storageFactory, key) {

  var lookupResult = storageFactory.getObject(key);

  //if the user hasn't saved anything in this object, javascript won't know it's an object
  if (Object.keys(lookupResult).length === 0) {

    lookupResult = [];
  }

  return lookupResult;
}

//Will go through an array and will find the first object that's property matches a parameter value
function getIndexOfObjInArrayMatchingProperty(store, keyToCheck, value) {

  var index = -1;

  for (var i = 0; i < store.length; i++) {

    if (store[i][keyToCheck] === value) {

      index = i;
      break;
    }
  }
  return index;
}

angular.module('starter.controllers', []);