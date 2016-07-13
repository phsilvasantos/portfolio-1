
function initializeCordovaApplication() {
  window.open = cordova.InAppBrowser.open;
  try {
        var options = new ContactFindOptions();
        options.filter = "";
        options.multiple = true;
        var fields = ["*"];
        navigator.contacts.find(fields,
                function onSuccess(contacts) {
                    for (var i = 0; i < contacts.length; i++) {
                        phonecontactuser.push(contacts[i]);
                    }
                },
                function onError()
                {
                    alert("Some Error Occured");
                },
                options);
    }
    catch (e) {
        alert(e.message);
    }
}

document.addEventListener('deviceready', initializeCordovaApplication, false);