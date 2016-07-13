// Initialize your app
var f7App = new Framework7({
    pushState: false, //hash navigation
    cache: false
});

// Export selectors engine
var $$ = Dom7;

// Add view
var f7MainView = f7App.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});