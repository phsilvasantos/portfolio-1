organizate.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//);
  }])
        .config(function ($cordovaFacebookProvider) {
          var appID = 1616797005210988;
          var version = "v1.0"; // or leave blank and default is v2.0
//          $cordovaFacebookProvider.browserInit(appID, version);
        })
        .config(function ($stateProvider, $urlRouterProvider) {
          $stateProvider
                  .state('first-page', {
                    url: '/first-page',
                    templateUrl: 'templates/first-page.html'
                  })
                  .state('login-page', {
                    url: '/login-page',
                    templateUrl: 'templates/login-page.html'
                  })
                  .state('signup-page', {
                    url: '/signup-page',
                    templateUrl: 'templates/signup-page.html'
                  })
                  .state('app', {
                    url: '',
                    abstract: true,
                    templateUrl: 'templates/menu.html',
                  })
                  .state('app.create-team', {
                    url: '/create-team',
                    views: {'menuContent': {templateUrl: 'templates/create-team.html'}}
                  })
                  .state('app.home-page', {
                    url: '/home-page',
                    views: {'menuContent': {templateUrl: 'templates/home-page.html'}}
                  })
                  .state('app.create-player', {
                    url: '/create-player',
                    views: {'menuContent': {templateUrl: 'templates/create-player.html'}}
                  })
                  .state('app.select-member', {
                    url: '/select-member',
                    views: {'menuContent': {templateUrl: 'templates/select-member.html'}}
                  })
                  .state('app.manage-team', {
                    url: '/manage-team/',
                    views: {'menuContent': {templateUrl: 'templates/manage-team.html'}}
                  })
                  .state('app.game-home', {
                    url: '/game-home',
                    views: {'menuContent': {templateUrl: 'templates/game-home-page.html'}}
                  })
                  .state('app.create-game', {
                    url: '/create-game/:id',
                    views: {'menuContent': {templateUrl: 'templates/create-game.html'}}
                  })
                  .state('app.detail-game', {
                    url: '/detail-game/:id',
                    views: {'menuContent': {templateUrl: 'templates/detail-game.html'}}
                  })
                  .state('app.select-team-member', {
                    url: '/select-team-member',
                    views: {'menuContent': {templateUrl: 'templates/select-team-member.html'}}
                  })
                  .state('app.manage-game-macro', {
                    url: '/manage-game-macro',
                    views: {'menuContent': {templateUrl: 'templates/manage-game-macro.html'}}
                  })
                  .state('app.game-feedback', {
                    url: '/game-feedback',
                    views: {'menuContent': {templateUrl: 'templates/game-feedback.html'}}
                  })
                  .state('app.message-detail', {
                    url: '/message-detail',
                    views: {'menuContent': {templateUrl: 'templates/message-detail.html'}}
                  })
                  .state('app.new-profile', {
                    url: '/new-profile',
                    views: {'menuContent': {templateUrl: 'templates/edit-profile.html'}}
                  })
                  .state('app.user-profile', {
                    url: '/user-profile/:id',
                    views: {'menuContent': {templateUrl: 'templates/user-profile.html'}}
                  })
                  .state('app.personal-profile', {
                    url: '/personal-profile/:id',
                    views: {'menuContent': {templateUrl: 'templates/personal-profile.html'}}
                  })
                  .state('app.message-main', {
                    url: '/message-main',
                    views: {'menuContent': {templateUrl: 'templates/message-main.html'}}
                  })
                  .state('app.message-pick', {
                    url: '/message-pick/:id',
                    views: {'menuContent': {templateUrl: 'templates/message-pick.html'}}
                  })
                  .state('app.special-message-pick', {
                    url: '/special-message-pick/:id',
                    views: {'menuContent': {templateUrl: 'templates/special-message-pick.html'}}
                  })
                  .state('app.message-lineup', {
                    url: '/message-lineup',
                    views: {'menuContent': {templateUrl: 'templates/message-lineup.html'}}
                  })
                  .state('app.message-reminder', {
                    url: '/message-reminder',
                    views: {'menuContent': {templateUrl: 'templates/message-reminder.html'}}
                  })
                  .state('app.game-specific-message', {
                    url: '/game-specific-message',
                    views: {'menuContent': {templateUrl: 'templates/game-specific-message.html'}}
                  })
                  .state('app.game-formation', {
                    url: '/game-formation',
                    views: {'menuContent': {templateUrl: 'templates/game-formation.html'}}
                  })
                  .state('app.personal-team', {
                    url: '/personal-team',
                    views: {'menuContent': {templateUrl: 'templates/personal-team.html'}}
                  })
                  .state('app.personal-game-home', {
                    url: '/personal-game-home',
                    views: {'menuContent': {templateUrl: 'templates/personal-game-home.html'}}
                  })
                  .state('app.message-game-formation', {
                    url: '/message-game-formation',
                    views: {'menuContent': {templateUrl: 'templates/message-game-formation.html'}}
                  })
                  .state('app.roster-member', {
                    url: '/roster-member',
                    views: {'menuContent': {templateUrl: 'templates/roster-member.html'}}
                  })
                  .state('app.select-phonecontact-member', {
                    url: '/select-phonecontact',
                    views: {'menuContent': {templateUrl: 'templates/select-phonecontact-member.html'}}
                  })
                  .state('app.roster-game-member', {
                    url: '/roster-game-member',
                    views: {'menuContent': {templateUrl: 'templates/roster-game-member.html'}}
                  })
                  .state('app.roster-member-view', {
                    url: '/roster-member-view',
                    views: {'menuContent': {templateUrl: 'templates/roster-member-view.html'}}
                  })
                  .state('app.roster-member-message', {
                    url: '/roster-member-message/:id',
                    views: {'menuContent': {templateUrl: 'templates/roster-member-message.html'}}
                  })
                  .state('app.edit-team', {
                    url: '/edit-team',
                    views: {'menuContent': {templateUrl: 'templates/edit-team.html'}}
                  })
                  .state('app.message-view', {
                    url: '/message-view',
                    views: {'menuContent': {templateUrl: 'templates/message-view.html'}}
                  });
          $urlRouterProvider.otherwise('/first-page');
        });