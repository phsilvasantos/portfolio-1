angular.module('cleverbaby')
.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/app.html",
        controller: 'AppCtrl'
    })

    .state('app.calendar', {
        url: "/calendar",
        cache: false,
        views: {
            'calendar': {
                templateUrl: "templates/calendar.html",
                controller: 'CalendarCtrl'
            }
        }
    })

    .state('app.timeline', {
        url: "/timeline",
        cache: false,
        views: {
            'home': {
                templateUrl: "templates/timeline.html",
                controller: 'TimelineCtrl'
            }
        }
    })

    .state('app.diary', {
        url: "/diary",
        cache: false,
        views: {
            'home': {
                templateUrl: "templates/diary.html",
                controller: 'DiaryCtrl'
            }
        }
    })
    .state('app.chart', {
        url: "/chart",
        cache: false,
        views: {
            'chart': {
                templateUrl: "templates/chart.html",
                controller: 'ChartCtrl'
            }
        }
    })
    .state('app.more', {
       url: "/more",
       views: {
           'more': {
               templateUrl: "templates/more.html",
               controller: "MoreCtrl"
           }
       }
    })
    .state('app.inviteothers', {
        url: "/inviteothers",
        views: {
            'more': {
                templateUrl: "templates/more/invite-others.html",
                controller: "MoreInviteOthersCtrl",
                resolve: {
                    userList: ["BabyService", "$rootScope", function(BabyService, $localStorage){

                        for(var key in $localStorage.babies){
                            if($localStorage.babies.hasOwnProperty(key)){
                                if($localStorage.babies[key].permission == '1'){
                                    return BabyService.getUsersList($localStorage.babies[key].uuid);
                                }
                            }
                        }
                    }]
                }
            }
        }
    })
    .state('app.inviteothers2', {
        url: "/inviteothers/:uuid/:type",
        views: {
            'more': {
                templateUrl: "templates/more/invite-others2.html",
                controller: "MoreInviteOthers2Ctrl",
                resolve: {
                    shareData: ["BabyService", "$stateParams", function(BabyService, $stateParams){
                        return BabyService.inviteData($stateParams.uuid, $stateParams.type);
                    }]
                }
            }
        }
    })
    .state('app.activatebabyaccesspin', {
        url: "/activatebabyaccesspin",
        views: {
            'more': {
                templateUrl: "templates/more/activate-baby-access-pin.html",
                controller: "MoreActivateBabyAccessPinCtrl"
            }
        }
    })
    .state('app.measures', {
        url: "/measures",
        views: {
            'more': {
                templateUrl: "templates/more/measures.html",
                controller: 'MoreMeasuresCtrl'
            }
        }
    })
    .state('app.help', {
        url: "/help/:helpId",
        views: {
            'more': {
                templateUrl: "templates/more/help.html",
                controller: 'MoreHelpCtrl'
            }
        }
    })
    .state('app.about', {
        url: "/about",
        views: {
            'more': {
                templateUrl: "templates/more/about.html",
                controller: 'MoreAboutCtrl'
            }
        }
    })
    .state('app.youraccount', {
        url: "/youraccount",
        views: {
            'more': {
                templateUrl: "templates/more/youraccount.html",
                controller: 'MoreYourAccountCtrl'
            }
        }
    })
    .state('app.feedback', {
        url: "/feedback",
        views: {
            'more': {
                templateUrl: "templates/more/feedback.html",
                controller: 'MoreFeedbackCtrl'
            }
        }
    })
    .state('app.followus', {
        url: "/followus",
        views: {
            'more': {
                templateUrl: "templates/more/followus.html",
                controller: 'MoreFollowusCtrl'
            }
        }
    })
    .state('auth', {
        url: "/auth",
        abstract: true,
        templateUrl: "templates/auth.html"
    })
    .state('auth.signin', {
        url: '/signin',
        views: {
            'auth-signin': {
                templateUrl: 'templates/auth-signin.html',
                controller: 'SignInCtrl'
            }
        }
    })
    .state('auth.signup', {
        url: '/signup',
        views: {
            'auth-signup': {
                templateUrl: 'templates/auth-signup.html',
                controller: 'SignUpCtrl'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/diary');
});
