var domain = "http://www.finder-lbs.com";
// var domain = "http://192.168.1.32:8888";

angular.module('controllers', ['leaflet-directive','angles'])

.controller('TestCtrl', function($scope, $state,$rootScope,$ionicPopup,$state,$stateParams,$http) {
    if(true) { ga_storage._trackPageview("First Page (Test) Controller"); }
    if(window.localStorage['gmailLogin']=='true'){
        $scope.email = window.localStorage['gmailEmail'];
        $scope.name = window.localStorage['gmailName'];
        $scope.logged_in=window.localStorage['gmailLogin'];
        $scope.show = true;
        //$state.go('setup');

    }
    else {
        $scope.show = false;
    }

    $scope.data = {
        email:$scope.email,
        logged_in:$scope.logged_in
    };

    $scope.response = $http({
        method: 'GET',
        url: domain+'/app/auth/login?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in,
        //data: $scope.data,
        headers: {'Content-Type':'application/json;charset=UTF-8'}
        //headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
    }).success(
        function(result){
            if(window.localStorage['gmailLogin']=='true'){
                $scope.show = true;
                //$ionicPopup.alert({"title":"The email is:"+JSON.stringify(result)});
                //$state.go('app.setup');
            }
            else {
                $scope.show = false;
            }
            return result;
        }
    );


    $rootScope.$on('logging.in',function(){
        //$ionicPopup.alert({"title":"The email is:"+window.localStorage["gmailEmail"]});
       $scope.$apply(function(){
            $scope.email = window.localStorage['gmailEmail'];
            $scope.name = window.localStorage['gmailName'];
            $scope.logged_in = window.localStorage['gmailLogin'];

            $scope.response = $http({
                method: 'GET',
                url: domain+'/app/auth/login?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in,
                //data: $scope.data,
                headers: {'Content-Type':'application/json;charset=UTF-8'}
                //headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
            }).success(
                function(result){
                    if(window.localStorage['gmailLogin']=='true'){
                        //$ionicPopup.alert({"title":"The email is:"+JSON.stringify(result)});
                        $scope.show = true;
                        $state.go('intro');
                    }
                    else {
                        $scope.show = false;
                    }
                    return result;
                }
            );

            if(window.localStorage['gmailLogin']=='true'){
                $scope.show = true;
                //$state.go('app.setup');
                
                //$state.go('intro');
            }
            else {
                $scope.show = false;
            }
       });
    
    });
    
    $scope.getMember = function(id) {
        console.log(id);
    };
    $scope.test = function(){
        $ionicPopup.alert({"title":"Clicked"});
    }

    $scope.call_google = function(){
        googleapi.authorize({
        client_id: '817013901832-k9l3p8vt3qiscb2uhfqfc9oev7s6mj67.apps.googleusercontent.com',
        client_secret: 'xofXKuysOMoZzUQith8loj7b',
        redirect_uri: 'http://localhost',
        //scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'
        scope: 'email'
        }).done(function(data) {
            accessToken=data.access_token;
            // $loginStatus.html('Access Token: ' + data.access_token);
            console.log(data.access_token);
            //$ionicPopup.alert({"title":JSON.stringify(data)});
            $scope.getDataProfile();
        }).fail(function(data) {
            console.log(data.error);
        });
    };
    $scope.getDataProfile = function(){
        var term=null;
        //  alert("getting user data="+accessToken);
        $.ajax({
               url:'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+accessToken,
               type:'GET',
               data:term,
               dataType:'json',
               error:function(jqXHR,text_status,strError){
               },
               success:function(data)
               {
               var item;

               console.log(JSON.stringify(data));
// Save the userprofile data in your localStorage.
               
               window.localStorage['gmailLogin']="true";
               window.localStorage['gmailID']=data.id;
               window.localStorage['gmailEmail']=data.email;
               window.localStorage['gmailFirstName']=data.given_name;
               window.localStorage['gmailLastName']=data.family_name;
               window.localStorage['gmailProfilePicture']=data.picture;
               window.localStorage['gmailGender']=data.gender;
               window.localStorage['gmailName']=data.name;
               $rootScope.$broadcast('logging.in');
               //$ionicPopup.alert({"title":""+JSON.stringify(data)});
               /*
               $scope.$apply(function(){
                    $scope.email = window.localStorage['gmailEmail'];
                    $scope.name = window.localStorage['gmailName'];
                    $scope.logged_in = window.localStorage['gmailLogin'];
               });
               $state.go('setup');
               */
               }
            });
            //$scope.disconnectUser();
    };
    $scope.disconnectUser = function() {
      var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token='+accessToken;

      // Perform an asynchronous GET request.
      $.ajax({
        type: 'GET',
        url: revokeUrl,
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(nullResponse) {
          // Do something now that user is disconnected
          // The response is always undefined.
          accessToken=null;
          console.log(JSON.stringify(nullResponse));
          console.log("-----signed out..!!----"+accessToken);
        },
        error: function(e) {
          // Handle the error
          // console.log(e);
          // You could point users to manually disconnect if unsuccessful
          // https://plus.google.com/apps
        }
      });
    };


})

.controller('DeviceListCtrl', function($scope) {
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.playlists = [
        { title: 'Reggae', id: 1 },
        { title: 'Chill', id: 2 },
        { title: 'Dubstep', id: 3 },
        { title: 'Indie', id: 4 },
        { title: 'Rap', id: 5 },
        { title: 'Cowbell', id: 6 }
    ];
})
.controller('IntroCtrl', function($scope,$state,$http, $ionicSlideBoxDelegate,CheckIfUserIsPaid) {
    if(true) { ga_storage._trackPageview("Intro Controller"); }
    $scope.has_device=true;
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];
    $scope.next = function() {
        $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
        $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
    };

    CheckIfUserIsPaid.queryforuser($scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.user_pay = messages[0];
        console.log(JSON.stringify($scope.user_pay));
        if($scope.user_pay.has_paid){
            window.localStorage['user_is_paid'] = "true";
        }
        else {
            window.localStorage['user_is_paid'] = "false";
        }

    });
    $scope.organization_for_user = $http({
        method: 'GET',
        url: domain+'/app/checkfororganization?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in,
        headers: {'Content-Type':'application/json;charset=UTF-8'}
    }).success(
        function(result){
            //$ionicPopup.alert({"title":JSON.stringify(result)});
            if(result[0]["has_org"]){
                $scope.has_org = true;
            }
            else {
                $scope.has_org = false;
            }
            //$rootScope.$broadcast('check_device');
            return result;
        }
    );

    $scope.assets_for_user = $http({
        method: 'GET',
        url: domain+'/app/checkforassets?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in,
        headers: {'Content-Type':'application/json;charset=UTF-8'}
    }).success(
        function(result){
            window.plugins.DeviceInfo.imeiNumber(function(imei){
                //$ionicPopup.alert({"title":"Imei is:"+imei});
                $scope.device_id = imei;
                if(result[0]["number_of_assets"]==0){
                    $scope.has_device = false;
                    console.log("Assets"+JSON.stringify(result[0]["assets"]));
                }
                else {
                    $scope.has_device = true;
                    for(var k=0;k<result[0]["assets"].length;k++){
                        $scope.combined_device_id = "XMVT"+$scope.device_id;
                        if($scope.combined_device_id!=result[0]["assets"][k]["device_number"]){
                            $scope.has_device = false;
                            console.log("Unmatched"+JSON.stringify(result[0]["assets"][k]["device_number"])+"===="+$scope.combined_device_id);

                        }
                        else {
                            $scope.has_device = true;
                            console.log("Matched"+JSON.stringify(result[0]["assets"][k]["device_number"])+"===="+$scope.combined_device_id);                            
                            break;
                        }
                    }
                }        
                return imei;
            });

    
            //$rootScope.$broadcast('check_device');
            return result;
        }
    );
})
.controller('AppCtrl', function($scope,$state,$http,CheckIfUserIsPaid,MobileGetMyInvitations) {
    if(true) { ga_storage._trackPageview("Menu Controller"); }
    $scope.has_device=true;
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];

    MobileGetMyInvitations.query($scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.invitation_list = messages;
        $scope.numbers = $scope.invitation_list.length;
    });
    CheckIfUserIsPaid.queryforuser($scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.user_pay = messages[0];
        console.log(JSON.stringify($scope.user_pay));
        if($scope.user_pay.has_paid){
            window.localStorage['user_is_paid'] = "true";
        }
        else {
            window.localStorage['user_is_paid'] = "false";
        }

    });
    $scope.organization_for_user = $http({
        method: 'GET',
        url: domain+'/app/checkfororganization?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in,
        headers: {'Content-Type':'application/json;charset=UTF-8'}
    }).success(
        function(result){
            //$ionicPopup.alert({"title":JSON.stringify(result)});
            if(result[0]["has_org"]){
                $scope.has_org = true;
            }
            else {
                $scope.has_org = false;
            }
            //$rootScope.$broadcast('check_device');
            return result;
        }
    );

    // $scope.assets_for_user = $http({
    //     method: 'GET',
    //     url: domain+'/app/checkforassets?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in,
    //     headers: {'Content-Type':'application/json;charset=UTF-8'}
    // }).success(
    //     function(result){
    //         window.plugins.DeviceInfo.imeiNumber(function(imei){
    //             //$ionicPopup.alert({"title":"Number of Device:"+result[0]["number_of_assets"]});
    //             $scope.device_id = imei;
    //             //alert();
    //             if(result[0]["number_of_assets"]==0){
    //                 $scope.has_device = false;
    //                 console.log("Assets"+JSON.stringify(result[0]["assets"]));
    //             }
    //             else {
    //                 $scope.has_device = true;
    //                 for(var k=0;k<result[0]["assets"].length;k++){
    //                     $scope.combined_device_id = "XMVT"+$scope.device_id;
    //                     if($scope.combined_device_id!=result[0]["assets"][k]["device_number"]){
    //                         $scope.has_device = false;
    //                         console.log("Unmatched"+JSON.stringify(result[0]["assets"][k]["device_number"])+"===="+$scope.combined_device_id);

    //                     }
    //                     else {
    //                         $scope.has_device = true;
    //                         console.log("Matched"+JSON.stringify(result[0]["assets"][k]["device_number"])+"===="+$scope.combined_device_id);                            
    //                         break;
    //                     }
    //                 }
    //             }        
    //             return imei;
    //         });

    
    //         //$rootScope.$broadcast('check_device');
    //         return result;
    //     }
    // );
})

.controller('SettingsCtrl', function($scope, $stateParams) {
    $scope.logged_in = null;
})
.controller('SetupCtrl', function($scope, $state, $stateParams, $ionicSideMenuDelegate, $ionicPopup,$ionicPlatform,MobileAsset,ShareStatus,$http,RequestMigration,$ionicModal) {
    if(true) { ga_storage._trackPageview("Setup Controller"); }
    $scope.has_device = true;
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];
    $scope.device_id = ""+window.device['uuid'];
    $scope.has_org = true;
    $scope.internet = false;
        
    init();
    $scope.share = {
        "checked": false
    };
    $ionicModal.fromTemplateUrl('modalRequest.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
    });
    $scope.requestMigration = function(){
        console.log("clicked");
        RequestMigration.query(JSON.stringify({"client_id":$scope.client_id,"number_plate":$scope.number_plate}))
        .$promise.then(function(messages){
            console.log(JSON.stringify(messages));
            $ionicPopup.alert({"title":messages["message"]});
            $scope.modal.hide();
        });
    }

    $scope.addAnotherAsset = function(){
        $scope.has_device = false;
    }

    $scope.checkAssetIsRegistered = function(){
        return true;        
    }

    window.plugins.DeviceInfo.imeiNumber(function(imei){
        //$ionicPopup.alert({"title":"Imei is:"+imei});
        $scope.device_id = imei;        

        ShareStatus.query($scope.device_id,$scope.name,$scope.email,$scope.logged_in).then(function(messages){
            $scope.details_of_asset = messages;
            // $ionicPopup.alert({"title":"ShareStatus is:"+JSON.stringify($scope.details_of_asset.shared)});
            $scope.internet = true;
            if ($scope.details_of_asset.shared){
                $scope.share = {
                    "checked": true
                };
            }
            else {
                $scope.share = {
                    "checked": false
                };
            }

        });    

        window.plugins.GcmPlugin.gcm(function(reg){
            //$ionicPopup.alert({"title":"Imei is:"+imei});
            $scope.reg_id = reg;
            console.log("REG ID in reg_id:"+$scope.reg_id);
            window.plugins.SharedPrefs.getData(function(result){
                //$ionicPopup.alert({"title":"Could I retrieve the data? Ans:"+result});
                $scope.reg_id = result;
                console.log("REG ID:"+$scope.reg_id);
                return result;
            },"","FinderPrefs","registration_id");    
            
            $scope.assets_for_user = $http({
                method: 'GET',
                url: domain+'/app/checkforassets?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in,
                headers: {'Content-Type':'application/json;charset=UTF-8'}
            }).success(
                function(result){
                    //$ionicPopup.alert({"title":"Number of Assets:"+result[0]["number_of_assets"]});
                        //$ionicPopup.alert({"title":"Number of Assets:"+result[0]["number_of_assets"]});
                    $scope.internet = true;
                    $scope.device_id = imei;
                    if(result[0]["number_of_assets"]==0){
                        $scope.has_device = false;
                        console.log("Assets"+JSON.stringify(result[0]["number_of_assets"]));
                        $scope.saveAssetAuto();
                    }
                    else {
                        $scope.has_device = true;
                        for(var k=0;k<result[0]["assets"].length;k++){
                            $scope.combined_device_id = "XMVT"+$scope.device_id;
                            if($scope.combined_device_id!=result[0]["assets"][k]["device_number"]){
                                $scope.has_device = false;
                                console.log("Unmatched"+JSON.stringify(result[0]["assets"][k]["device_number"])+"===="+$scope.combined_device_id);
                                $scope.saveAssetAuto();
                            }
                            else {
                                $scope.has_device = true;
                                $scope.addAssetRegId(result[0]["assets"][k]["_id"]["$oid"],$scope.reg_id);
                                console.log("Matched"+JSON.stringify(result[0]["assets"][k]["device_number"])+"===="+$scope.combined_device_id);                            
                                break;
                            }
                        }
                    }        
                return result;
            });

            return reg;
        });

        
        return imei;
    });

    $scope.asset = {
            "sim_number":"",
            "name":"",
            "device_id":window.device['uuid']
            };

    $scope.settingsList = [
        { text: "Start Tracking", checked: false }
        //{ text: "Email Notification", checked: false }
    ];
    window.plugins.SharedPrefs.getData(function(result){

        $scope.save_result = result;
        console.log("Location Service GET DATA:"+result);
        if (result=="on") {
            $scope.locationService=true;
            $scope.settingsList = [
                { text: "Start Tracking", checked: true }
            ];
        }
        else {
            $scope.locationService=false;
            $scope.settingsList = [
                { text: "Start Tracking", checked: false }
            ];
        }
        return result;
    },"","FinderPrefs","location_service");
    
    $scope.saveChange = function(index){
        //$scope.item_name = item_name;
        //$scope.item_checked = item_checked;
        
        if ($scope.settingsList[index].checked) {
            console.log("Location Service"+$scope.settingsList[index].checked);
            window.plugins.SharedPrefs.saveData(function(result){
                $scope.save_result = result;
                $scope.locationService = true;
                //$scope.$broadcast('updateTrackingStatus',"on");
                console.log("Location Service"+result);
                return result;
            },"","FinderPrefs","location_service","on");
        }
        else {
            console.log("Location Service"+$scope.settingsList[index].checked);
            window.plugins.SharedPrefs.saveData(function(result){
                $scope.save_result = result;
                $scope.locationService = false;
                console.log("Location Service"+result);
                //$scope.$broadcast('updateTrackingStatus',"off");
                return result;
            },"","FinderPrefs","location_service","off");
        }
    }

    $scope.shareChange = function(shared){
        //$scope.item_name = item_name;
        //$scope.item_checked = item_checked;
        $scope.share_response = $http({
            method: 'GET',
            url: domain+'/app/assets/share?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in+'&choice='+shared+'&id='+$scope.device_id,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(
            function(result){
                $ionicPopup.alert({"title":result["message"]});
                //$rootScope.$broadcast('check_device');
                if(shared){
                    $scope.settingsList = [
                            { text: "Start Tracking", checked: true }
                        ];
                    window.plugins.SharedPrefs.saveData(function(result){
                        $scope.save_result = result;
                        $scope.locationService = true;
                        console.log("Saving Location Tracking");
                        $scope.settingsList = [
                            { text: "Start Tracking", checked: true }
                        ];
                        //$scope.$broadcast('updateTrackingStatus',"on");
                        return result;
                    },"","FinderPrefs","location_service","on");
                }
                return result;
            }
        );        
    }

    window.plugins.LocationInfo.locationData(function(loc){
        $scope.loc_id = loc;
        return loc;
    });

    // window.plugins.TelephoneNumber.line1Number(function(line){
    //     //$ionicPopup.alert({"title":"Number is:"+line});
    //     $scope.asset.sim_number = line;
    //     return line;
    // });
    /*
    window.plugins.SharedPrefs.saveData(function(result){
        //$ionicPopup.alert({"title":"Has it been saved? Ans:"+JSON.stringify(result)});
        $scope.save_result = result;
        return result;
    },"","FinderPrefs","interval","50000");
    */
    window.plugins.SharedPrefs.getData(function(result){
        //$ionicPopup.alert({"title":"Could I retrieve the data? Ans:"+result});
        $scope.result = result;
        return result;
    },"","FinderPrefs","interval");
    
    $scope.org = {
        "name":"",
        "address":"",
        "city":"",
        "country":"",
        "tel":"",
        "web":""
    };
    // $ionicPopup.alert({"title":""+window.HelloWorld.get_imei});

    $scope.data = MobileAsset.query({'email':$scope.email,'name':$scope.name,'logged_in':$scope.logged_in});
    $scope.assets = $scope.data;
    $scope.getData = function(){
        $scope.data = MobileAsset.query({'email':$scope.email,'name':$scope.name,'logged_in':$scope.logged_in});
    }
    
    $scope.organization_for_user = $http({
        method: 'GET',
        url: domain+'/app/checkfororganization?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in,
        headers: {'Content-Type':'application/json;charset=UTF-8'}
    }).success(
        function(result){
            $scope.internet = true;
            //$ionicPopup.alert({"title":JSON.stringify(result)});
            if(result[0]["has_org"]){
                $scope.has_org = true;
            }
            else {
                $scope.has_org = false;
            }
            //$rootScope.$broadcast('check_device');
            return result;
        }
    );
    $scope.saveOrg = function(){
        //$ionicPopup.alert({"title":"Button Pressed"+$scope.org});
        
        $scope.org_response = $http({
            method: 'GET',
            url: domain+'/app/organization/add?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in+'&org_name='+$scope.org.name+'&org_address='+$scope.org.address,//+'&org_city='+$scope.org.city+'&org_country='+$scope.org.country+'&org_tel='+$scope.org.tel+'&org_web='+$scope.org.web,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(
            function(result){
                //$ionicPopup.alert({"title":JSON.stringify(result)});
                //$rootScope.$broadcast('check_device');
                $state.reload();
                if(result["success"]){
                    $scope.has_org = true;
                    // alert("Organization Added");    
                    $ionicPopup.alert({"title":"Organization Added"});
                }
                else {
                    $scope.has_org = false;
                    //alert("Organization could not be Added");        
                    $ionicPopup.alert({"title":"Organization could not be Added"});
                }

                return result;
            }
        );
    }
    $scope.saveAsset = function(){
        //$ionicPopup.alert({"title":"Button Pressed"});
        
        $scope.asset_response = $http({
            method: 'GET',
            url: domain+'/app/assets/add?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in+'&device_id='+$scope.device_id+'&asset_name='+$scope.asset.name+'&sim_number='+$scope.asset.sim_number,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(
            function(result){
                //$ionicPopup.alert({"title":JSON.stringify(result)});
                //$rootScope.$broadcast('check_device');
                
                //alert(JSON.stringify(result));
                if(result["success"]){
                    $scope.has_device = true;
                    //alert("Device Added");    
                    $ionicPopup.alert({"title":"Device Added"});
                    $state.reload();
                }
                else {
                    $scope.has_device = false;
                    //alert("Device could not be Added");        
                    $ionicPopup.alert({"title":"Device could not be Added"});
                }
                
                return result;
            }
        );
    }
    $scope.saveAssetAuto = function(){
        //$ionicPopup.alert({"title":"Button Pressed"});
        
        $scope.asset_response = $http({
            method: 'GET',
            url: domain+'/app/assets/add?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in+'&device_id='+$scope.device_id+'&asset_name='+$scope.asset.name+'&sim_number='+$scope.asset.sim_number+'&reg_id='+$scope.reg_id,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(
            function(result){
                //$ionicPopup.alert({"title":JSON.stringify(result)});
                //$rootScope.$broadcast('check_device');
                
                //alert(JSON.stringify(result));
                console.log("Asset Add:"+JSON.stringify(result));
                if(result["success"]){
                    $scope.has_device = true;
                    console.log("Device Add SUCCESS");
                    //alert("Device Added");    
                    // $ionicPopup.alert({"title":result["message"]});
                    //$state.reload();
                }
                else {
                    console.log("Device Add FAILED");
                    //$ionicPopup.alert({"title":result["message"]});
                }
                return result;
            }
        );
    }
    $scope.addAssetRegId = function(asset_id,reg_id){
        //$ionicPopup.alert({"title":"Button Pressed"});
        
        $scope.asset_response = $http({
            method: 'GET',
            url: domain+'/app/registrations/add?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in+'&asset_id='+asset_id+'&reg_id='+reg_id,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(
            function(result){
                return result;
            }
        );
    }    
})
.controller('AssetEditCtrl', function($scope,$state, $stateParams,$ionicPopup, $rootScope, $interval, $http, leafletData, GetMobileAsset, MobileTrafficList,MobileShareList,MobilePublicMessage,MobilePrivateMessage,MobileEventList,MobileSavedLocationList,CheckIfUserIsPaid, Organization) {
    if(true) { ga_storage._trackPageview("Detail Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];
    $scope.asset_id = $stateParams.assetId;
    console.log("Inside Asset Edit");
    GetMobileAsset.query($scope.asset_id,$scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.details_of_asset = messages;
    });
    $scope.saveEdit = function(){
        $scope.asset_response = $http({
            method: 'GET',
            url: domain+'/app/assets/edit?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in+'&device_id='+$scope.details_of_asset[0].asset_detail.device_number+'&asset_name='+$scope.details_of_asset[0].asset_detail.name+'&sim_number='+$scope.details_of_asset[0].asset_detail.sim_number,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(
            function(result){

                if(result["success"]){
                    //alert("Device Added");    
                    $ionicPopup.alert({"title":"Edited successfully"});
                    //$state.go();
                    //$state.go("app.detail",{ "assetId":asset_id});
                }

                return result;
            }
        );   
    }
})   
.controller('SharedDetailCtrl', function($scope,$state, $stateParams,$ionicModal, $rootScope, $http, $interval,$ionicPopup, leafletData, GetMobileSharedAsset, MobileTrafficList,MobileShareList,MobilePublicMessage,MobilePrivateMessage,MobileEventList,MobileSavedLocationList,CheckIfUserIsPaid, Organization,GoogleShorten,TempLink,GetTempLink) {
    if(true) { ga_storage._trackPageview("Shared Detail Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];
    $scope.asset_id = $stateParams.assetId;
    $scope.shared_link = $stateParams.sharedId;
    $scope.counter = 0;
    console.log("Inside the SharedDetailCtrl"+$scope.shared_link);
    $scope.hrs = 0;
    $scope.dys = 0;

    GetTempLink.query({"shared_link": $scope.shared_link})
    .$promise.then(function(message){
        console.log(JSON.stringify(message));
        if(message["messages"]!=null){
            $scope.asset_id = message["messages"]["asset"]["$oid"];
            GetMobileSharedAsset.query($scope.asset_id,$scope.name,$scope.email,$scope.logged_in).then(function(messages){
                $scope.details_of_asset = messages;
                $scope.$watch($scope.details_of_asset,function(newValue,oldValue){
                    if($scope.details_of_asset) $scope.singleAssetLoadOnMap($scope.details_of_asset[0]);
                });
            });            
        }
        else {
            $ionicPopup.alert({"title":"The link has expired probably. Please contact the person who shared the link for resending!"});    
        }

    });

    console.log("Asset ID thru parameter: "+$scope.asset_id);
    window.plugins.SharedPrefs.getData(function(result){
        //$ionicPopup.alert({"title":"Could I retrieve the data? Ans:"+result});
        $scope.last_loc = result;
        console.log("Last Loc:"+$scope.last_loc);
        $scope.loc_saved = $scope.last_loc.split(",");
        $scope.coords = {lat:parseFloat($scope.loc_saved[0]), lon:parseFloat($scope.loc_saved[1])};
        $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
            $rootScope.$broadcast("loc.found",$scope.coords);
            $rootScope.$broadcast("loc.center",$scope.coords);
        });
        return result;
    },"","FinderPrefs","last_loc");

    
    navigator.geolocation.getCurrentPosition(function (data) {
        //$scope.loading.hide();
        $scope.coords = {lat:data.coords.latitude, lon:data.coords.longitude};
        $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
            $rootScope.$broadcast("loc.found",$scope.coords);
            $rootScope.$broadcast("loc.center",$scope.coords);
        });
    }, function (error) {

      alert('Unable to get location: ' + error.message);
    });
    
    $scope.$on("loc.found",function(event,coords){
        $scope.coords = coords;
        $scope.markers["me"] = {
                    lat: $scope.coords.lat,
                    lng: $scope.coords.lon,
                    icon: {
                        iconUrl: "img/finder 50px.png",
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                        popupAnchor: [0, 0],
                        shadowUrl: "img/finder 50px.png",
                        shadowSize:[0,0]

                    }
                };
    });
    
    $scope.$on("loc.center",function(event,coords){
        $scope.coords = coords;

        angular.extend($scope, {
            london: {
                lat: $scope.coords.lat,
                lng: $scope.coords.lon,
                zoom: 15
            }
        });

    });
    angular.extend($scope, {
            london: {
                lat: 23,
                lng: 90,
                zoom: 4
            },
            geojson: {},
            markers: {},
            paths: {
                p1: {
                    color: '#996666',
                    weight: 1,
                    latlngs: [
                    ],
                }
            },
            layers: {
                baselayers: {
                    /*cloudmade2: {
                        name: 'Cloudmade',
                        type: 'xyz',
                        url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
                        layerParams: {
                            key: '007b9471b4c74da4a6ec7ff43552b16f',
                            styleId: 7
                        }
                    },*/
                    osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                    },
                    googleTerrain: {
                        name: 'Google Terrain',
                        layerType: 'TERRAIN',
                        type: 'google'
                    },
                    googleHybrid: {
                        name: 'Google Hybrid',
                        layerType: 'HYBRID',
                        type: 'google'
                    },
                    googleRoadmap: {
                        name: 'Google Streets',
                        layerType: 'ROADMAP',
                        type: 'google'
                    }
                }
            },
            defaults: {
                    //tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                    scrollWheelZoom: false,
            }
        });
    
    $scope.doRefresh = function(){
        $scope.stopUpdate();
        $scope.update();
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.singleAssetLoadOnMap = function(asset_details){
        $scope.counter = $scope.counter+1;
        $scope.asset_details = asset_details;
        // alert($scope.asset_details['asset']['_id']['$oid']);
        // $scope.$broadcast('viewMessages',$scope.asset_details['asset_detail']['_id']['$oid']);
        $scope.$watch($scope.asset_details,function(newValue,oldValue){
            if($scope.asset_details['last_data']['speed']<=5){$scope.icon = "img/marker0.png";}
            if(($scope.asset_details['last_data']['speed']>5)&&($scope.asset_details['last_data']['speed']<=25)){$scope.icon = "img/marker5.png";}
            if(($scope.asset_details['last_data']['speed']>25)&&($scope.asset_details['last_data']['speed']<=60)){$scope.icon = "img/marker25.png";}
            if(($scope.asset_details['last_data']['speed']>60)&&($scope.asset_details['last_data']['speed']<=80)){$scope.icon = "img/marker60.png";}
            if(($scope.asset_details['last_data']['speed']>80)&&($scope.asset_details['last_data']['speed']<=110)){$scope.icon = "img/marker80.png";}
            if($scope.asset_details['last_data']['speed']>110){$scope.icon = "img/marker110.png";}
            angular.extend($scope, {
                markers: {
                    asset: {
                        lat: $scope.asset_details['last_data']['loc']['coordinates'][1],//51.505,
                        lng: $scope.asset_details['last_data']['loc']['coordinates'][0],//-0.09,
                        message:"<h4>"+$scope.asset_details['asset_detail']['name']+"</h4>"+"<h4>Speed:"+$scope.asset_details['last_data']['speed']+"kmph</h4><h4>Time:"+new Date($scope.asset_details['last_data']['time']['$date'])+"</h4>",
                        icon: {
                            iconUrl: $scope.icon,
                            iconSize: [20, 20],
                            iconAnchor: [10, 10],
                            popupAnchor: [0, 0],
                            shadowUrl: $scope.icon,
                            shadowSize:[0,0],
                            iconAngle:$scope.asset_details['last_data']['bearing']
                        }
                    }
                },
                london: {
                    lat: $scope.asset_details['last_data']['loc']['coordinates'][1],//51.505,
                    lng: $scope.asset_details['last_data']['loc']['coordinates'][0],//-0.09,
                    zoom: 15
                },
            });

            $scope.time_of_data = new Date($scope.asset_details['last_data']['time']['$date']);
        });

        navigator.geolocation.getCurrentPosition(function (data) {
            //$scope.loading.hide();
            $scope.coords = {lat:data.coords.latitude, lon:data.coords.longitude};
            $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
                $rootScope.$broadcast("loc.found",$scope.coords);
            });
        }, function (error) {
          //alert('Unable to get location: ' + error.message);
        });

    }
    var stop;
    $scope.update = function() {
        // Don't start a new fight if we are already fighting
        if ( angular.isDefined(stop) ) return;

        stop = $interval(function() {
            GetMobileSharedAsset.query($scope.asset_id).then(function(messages){
                $scope.details_of_asset = messages;
                $scope.$watch($scope.details_of_asset,function(newValue,oldValue){
                    if($scope.details_of_asset) $scope.singleAssetLoadOnMap($scope.details_of_asset[0]);
                });
            });

            
        }, 10000);
    };

    $scope.stopUpdate = function() {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    };

    // $scope.stopUpdate();
    // $scope.update();




}) 
.controller('DetailCtrl', function($scope,$state, $stateParams,$ionicModal, $rootScope, $http, $interval,$ionicPopup, leafletData, GetMobileAsset, MobileTrafficList,MobileShareList,MobilePublicMessage,MobilePrivateMessage,MobileEventList,MobileSavedLocationList,CheckIfUserIsPaid, Organization,GoogleShorten,TempLink,GetNominatimOSM,AssetRouteData) {
    if(true) { ga_storage._trackPageview("Detail Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];
    $scope.asset_id = $stateParams.assetId;
    $scope.counter = 0;
    $scope.posted = false;
    
    $scope.hrs = 0;
    $scope.dys = 0;
    $scope.pauseUpdates = false;
    CheckIfUserIsPaid.queryforasset($scope.name,$scope.email,$scope.logged_in,$scope.asset_id).then(function(messages){
        $scope.asset_pay = messages[0];
        console.log("If Asset is paid? "+JSON.stringify($scope.asset_pay));
    });

    $scope.share = {checked : false};
    $scope.types_of_asset = [
        { id:"human",name:"Mobile"},
        { id:"taxi",name:"Taxi"},
        { id:"car",name:"Car"},
        { id:"cng",name:"Three Wheeler"},
        { id:"elemu",name:"Ambulance"},
        { id:"bus",name:"Bus"},
        { id:"cvan",name:"Covered Van"},
        { id:"van",name:"Van/Microbus"},
        { id:"pickup",name:"Truck"},
        { id:"motorbike",name:"Motorbike"},
        { id:"cycle",name:"Cycle"},
    ];
    $scope.shareChange = function(shared){
        //$scope.item_name = item_name;
        //$scope.item_checked = item_checked;
        
        $scope.share_response = $http({
            method: 'GET',
            url: domain+'/app/assets/share?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in+'&choice='+shared+'&id='+$scope.device_id,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(
            function(result){
                //$ionicPopup.alert({"title":result["message"]});
                //$rootScope.$broadcast('check_device');
                if(shared){
                    $scope.fbmsg = "I have just made one of my "+$scope.asset_details.asset_detail.asset_type+" Available for Hire on FinderGPSTracking . "+ 
                    "For Vehicle Tracking, Personal Tracking, Updates about the Road Conditions, "+
                    " Or Finding a Hire, use the FinderGPSTracking App on Google PlayStore."+
                    " Try it out with your GPS turned on.","https://www.facebook.com/finder.vehicle.tracking";
                    $scope.msg = result["message"]+'. Posting on Facebook will let others know that you have a '+$scope.asset_details.asset_detail.asset_type+' available for Hire.';
                    $scope.showConfirm($scope.msg,$scope.fbmsg);
                }
                return result;
            }
        );        
    }
    $scope.typeChange = function(){
        //$scope.item_name = item_name;
        //$scope.item_checked = item_checked;
        console.log("SELECTED FOR TYPE CHANGE"+$scope.asset_details.asset_detail.asset_type);
        $scope.type_response = $http({
            method: 'GET',
            url: domain+'/app/assets/type?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in+'&asset_type='+$scope.asset_details.asset_detail.asset_type+'&id='+$scope.device_id,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(
            function(result){
                $ionicPopup.alert({"title":result["message"]});
                //$rootScope.$broadcast('check_device');
                
                return result;
            }
        );        
    }
    $scope.showRoute = function(asset_id,start_time,end_time){
        $scope.length=0;
        $scope.cnt=0;
        console.log("Start Date:"+new Date(Date.parse(start_time)).toUTCString());
        console.log("End Date:"+new Date(Date.parse(end_time)).toUTCString());

        AssetRouteData.query($scope.name,$scope.email,$scope.logged_in,new Date(Date.parse(start_time)).toUTCString(),new Date(Date.parse(end_time)).toUTCString(),asset_id).then(function(messages){
            $scope.route_data = messages;
            console.log("#################");
            console.log(JSON.stringify($scope.route_data));
            // $scope.$broadcast('viewMessagesOnRoute',$scope.asset_details['asset']['_id']['$oid'],new Date(Date.parse($('#datetimepicker_from').val())).toUTCString(),new Date(Date.parse($('#datetimepicker_to').val())).toUTCString());

            $scope.$watch($scope.route_data,function(newValue,oldValue){
                $scope.removeMarkers();
                $scope.stopUpdate();
                $scope.pauseUpdates = true;
                $scope.stopUpdateAnimation();
                $scope.stopUpdate();
                $scope.icon = "img/marker.png"
                $scope.length = $scope.route_data[0].last_data.length;
                //for(var imk = 0;imk<$scope.route_data[0].last_data.length;imk++){
                $scope.updateAnimation($scope.route_data);
                // $scope.icon = "img/marker.png";
                // for(var imk = 0;imk<$scope.route_data[0].last_data.length;imk++){
                //     //$scope.animatePath($scope.route_data);
                //     if($scope.route_data[0]['last_data'][imk]['last_data']['speed']<=5){$scope.icon = "img/marker0.png";}
                //     if(($scope.route_data[0]['last_data'][imk]['last_data']['speed']>5)&&($scope.route_data[0]['last_data'][imk]['last_data']['speed']<=25)){$scope.icon = "img/marker5.png";}
                //     if(($scope.route_data[0]['last_data'][imk]['last_data']['speed']>25)&&($scope.route_data[0]['last_data'][imk]['last_data']['speed']<=60)){$scope.icon = "img/marker25.png";}
                //     if(($scope.route_data[0]['last_data'][imk]['last_data']['speed']>60)&&($scope.route_data[0]['last_data'][imk]['last_data']['speed']<=80)){$scope.icon = "img/marker60.png";}
                //     if(($scope.route_data[0]['last_data'][imk]['last_data']['speed']>80)&&($scope.route_data[0]['last_data'][imk]['last_data']['speed']<=110)){$scope.icon = "img/marker80.png";}
                //     if($scope.route_data[0]['last_data'][imk]['last_data']['speed']>110){$scope.icon = "img/marker110.png";}
                //     //alert($scope.route_data[0]['last_data'][imk]['last_data']['bearing']);
                //     $scope.markers[$scope.route_data[0]['last_data'][imk]['last_data']['_id']['$oid']]={
                //             lat:$scope.route_data[0]['last_data'][imk]['last_data']['loc']['coordinates'][1],
                //             lng:$scope.route_data[0]['last_data'][imk]['last_data']['loc']['coordinates'][0],
                //             // message:"<h4>Asset:"+$scope.asset_details['asset_detail']['name']+"</h4>"
                //             //     +"<h4>Time:"+new Date($scope.route_data[0]['last_data'][imk]['last_data']['time']) +"</h4>",
                //             icon: {
                //                 iconUrl: $scope.icon,
                //                 iconSize: [20, 20],
                //                 iconAnchor: [20, 20],
                //                 popupAnchor: [0, 0],
                //                 shadowUrl: $scope.icon,
                //                 shadowSize:[0,0],
                //                 iconAngle:90+$scope.route_data[0]['last_data'][imk]['last_data']['bearing'],
                //             }
                //     };
                //     $scope.paths['p1']['latlngs'].push({
                //             lat:$scope.route_data[0]['last_data'][imk]['last_data']['loc']['coordinates'][1],
                //             lng:$scope.route_data[0]['last_data'][imk]['last_data']['loc']['coordinates'][0]
                //         });
                //     $scope.london['lat']=$scope.route_data[0]['last_data'][imk]['last_data']['loc']['coordinates'][1];
                //     $scope.london['lng']=$scope.route_data[0]['last_data'][imk]['last_data']['loc']['coordinates'][0];
                // }
            });
        });
    };

    $scope.animatePath = function(routeData){
        $scope.route_data = routeData;
        if($scope.cnt<$scope.length){

            if($scope.route_data[0]['last_data'][$scope.cnt]['last_data']['speed']<=5){$scope.icon = "img/marker0.png"};
            if(($scope.route_data[0]['last_data'][$scope.cnt]['last_data']['speed']>5)&&($scope.route_data[0]['last_data'][$scope.cnt]['last_data']['speed']<=25)){$scope.icon = "img/marker5.png"};
            if(($scope.route_data[0]['last_data'][$scope.cnt]['last_data']['speed']>25)&&($scope.route_data[0]['last_data'][$scope.cnt]['last_data']['speed']<=60)){$scope.icon = "img/marker25.png"};
            if(($scope.route_data[0]['last_data'][$scope.cnt]['last_data']['speed']>60)&&($scope.route_data[0]['last_data'][$scope.cnt]['last_data']['speed']<=80)){$scope.icon = "img/marker60.png"};
            if(($scope.route_data[0]['last_data'][$scope.cnt]['last_data']['speed']>80)&&($scope.route_data[0]['last_data'][$scope.cnt]['last_data']['speed']<=110)){$scope.icon = "img/marker80.png"};
            if($scope.route_data[0]['last_data'][$scope.cnt]['last_data']['speed']>110){$scope.icon = "img/marker110.png"};
            //alert($scope.route_data[0]['last_data'][imk]['last_data']['bearing']);
            $scope.markers['asset']={
                    lat:$scope.route_data[0]['last_data'][$scope.cnt]['last_data']['loc']['coordinates'][1],
                    lng:$scope.route_data[0]['last_data'][$scope.cnt]['last_data']['loc']['coordinates'][0],
                    icon: {
                        iconUrl: $scope.icon,
                        iconSize: [20, 20],
                        iconAnchor: [20, 20],
                        popupAnchor: [0, 0],
                        shadowUrl: $scope.icon,
                        shadowSize:[0,0],
                        iconAngle:90+$scope.route_data[0]['last_data'][$scope.cnt]['last_data']['bearing'],
                    }
            };
            $scope.paths['p1']['latlngs'].push({
                    lat:$scope.route_data[0]['last_data'][$scope.cnt]['last_data']['loc']['coordinates'][1],
                    lng:$scope.route_data[0]['last_data'][$scope.cnt]['last_data']['loc']['coordinates'][0],
                });
            $scope.london['lat']=$scope.route_data[0]['last_data'][$scope.cnt]['last_data']['loc']['coordinates'][1];
            $scope.london['lng']=$scope.route_data[0]['last_data'][$scope.cnt]['last_data']['loc']['coordinates'][0];
            $scope.london['zoom']=13;

            $scope.asset_details.last_data.speed = $scope.route_data[0]['last_data'][$scope.cnt]['last_data']['speed'];
            $scope.time_of_data = new Date($scope.route_data[0]['last_data'][$scope.cnt]['last_data']['time']['$date']);
        }
        else {
            $scope.stopUpdateAnimation();
            $ionicPopup.alert({"title":"Animation Complete!"});
            $scope.update();
        }
        $scope.cnt = $scope.cnt+1;
    }
    //The following code is for animation on map
    var stopAnimation;
    $scope.updateAnimation = function(routeData) {
      // Don't start a new fight if we are already fighting
      if ( angular.isDefined(stopAnimation) ) return;
        //alert("pressed");
      stopAnimation = $interval(function() {
        //$scope.singleAssetLoadOnMap(asset_details);
          //$scope.i=imk;
          $scope.animatePath(routeData);
      }, 500);
    };

    $scope.stopUpdateAnimation = function() {
      if (angular.isDefined(stopAnimation)) {
        $interval.cancel(stopAnimation);
        stopAnimation = undefined;
      }
    };

    $scope.$on('$destroy', function() {
      // Make sure that the interval is destroyed too
      $scope.stopUpdateAnimation();
    });
    $scope.removeMarkers = function() {
        $scope.markers = {};
        $scope.paths['p1']['latlngs'] = [];
    }
    $ionicModal.fromTemplateUrl('modal.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
    });
    $scope.doRefresh = function(){
        $scope.stopUpdateAnimation();
        $scope.stopUpdate();
        $scope.update();
        $scope.$broadcast('scroll.refreshComplete');
    }
    $scope.callShares = function(hrs,dys){
        //var message = 
        TempLink.query({"logged_in":$scope.logged_in,"email":$scope.email,"name":$scope.name,"asset_id": $scope.asset_id,"hrs":hrs,"dys":dys})
        .$promise.then(function(message){
            //Do something
            console.log(JSON.stringify(message));
            GoogleShorten.query(JSON.stringify({"longUrl": 'http://www.finder-lbs.com/gpstracking#/app/shareddetail/'+message["messages"]["link"]}))
            .$promise.then(function(message){
                window.plugins.socialsharing.share(message["id"]);
            });
            //$ionicModal.hide();
        });
    }
    // window.plugins.GcmPlugin.gcm(function(reg){
    //     //$ionicPopup.alert({"title":"Imei is:"+imei});
    //     $scope.reg_id = reg;
    //     console.log("REG ID inside DetailCtrl: "+$scope.reg_id);
    //     $scope.addAssetRegId($scope.asset_id,$scope.reg_id);
    //     window.plugins.SharedPrefs.getData(function(result){
    //         //$ionicPopup.alert({"title":"Could I retrieve the data? Ans:"+result});
    //         $scope.reg_id = result;
    //         console.log("REG ID:"+$scope.reg_id);
            
    //         return result;
    //     },"","FinderPrefs","registration_id");    
        
    //     return reg;
    // });
    console.log("Asset ID thru parameter: "+$scope.asset_id);
    $scope.traffic = {checked:false};
    $scope.shares = {checked:false};
    $scope.events = {checked:false};
    $scope.private_msg = {checked:false};
    $scope.public_msg = {checked:false};
    $scope.custom_location = {checked:false};

    $scope.is_asset_in_org = false;
    CheckIfUserIsPaid.queryforuser($scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.user_pay = messages[0];
        console.log(JSON.stringify($scope.user_pay));
    });
    $scope.getData = function(){
        AssetRouteData.query($scope.name,$scope.email,$scope.logged_in,$scope.tf,$scope.tt,$scope.asset_id).then(function(messages){
            console.log(messages);
        });
    }
    Organization.query($scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.organization = messages[0];
        console.log("Organization is: "+JSON.stringify($scope.organization.assets));
        for (var i=0;i<$scope.organization.assets.length;i++){
            if($scope.asset_id==$scope.organization.assets[i]["$oid"]){
                $scope.is_asset_in_org = true;
                break;
            }
            else {
                $scope.is_asset_in_org = false;   
            }
        }
        console.log("ASSET IN ORG:"+$scope.is_asset_in_org);
    });

    GetMobileAsset.query($scope.asset_id,$scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.details_of_asset = messages;
        $scope.$watch($scope.details_of_asset,function(newValue,oldValue){
            if($scope.details_of_asset) $scope.singleAssetLoadOnMap($scope.details_of_asset[0]);
        });
    });
    window.plugins.SharedPrefs.getData(function(result){
        //$ionicPopup.alert({"title":"Could I retrieve the data? Ans:"+result});
        $scope.last_loc = result;
        console.log("Last Loc:"+$scope.last_loc);
        $scope.loc_saved = $scope.last_loc.split(",");
        $scope.coords = {lat:parseFloat($scope.loc_saved[0]), lon:parseFloat($scope.loc_saved[1])};
        $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
            $rootScope.$broadcast("loc.found",$scope.coords);
            $rootScope.$broadcast("loc.center",$scope.coords);
        });
        return result;
    },"","FinderPrefs","last_loc");

    navigator.geolocation.getCurrentPosition(function (data) {
        //$scope.loading.hide();
        $scope.coords = {lat:data.coords.latitude, lon:data.coords.longitude};
        $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
            $rootScope.$broadcast("loc.found",$scope.coords);
            $rootScope.$broadcast("loc.center",$scope.coords);
        });
    }, function (error) {

      alert('Unable to get location: ' + error.message);
    });
    
    $scope.$on("loc.found",function(event,coords){
        $scope.coords = coords;
        $scope.markers["me"] = {
                    lat: $scope.coords.lat,
                    lng: $scope.coords.lon,
                    icon: {
                        iconUrl: "img/finder 50px.png",
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                        popupAnchor: [0, 0],
                        shadowUrl: "img/finder 50px.png",
                        shadowSize:[0,0]

                    }
                };
    });
    
    $scope.$on("loc.center",function(event,coords){
        $scope.coords = coords;

        angular.extend($scope, {
            london: {
                lat: $scope.coords.lat,
                lng: $scope.coords.lon,
                zoom: 15
            }
        });

    });
    angular.extend($scope, {
            london: {
                lat: 23,
                lng: 90,
                zoom: 4
            },
            geojson: {},
            markers: {},
            paths: {
                p1: {
                    color: '#996666',
                    weight: 1,
                    latlngs: [
                    ],
                }
            },
            layers: {
                baselayers: {
                    /*cloudmade2: {
                        name: 'Cloudmade',
                        type: 'xyz',
                        url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
                        layerParams: {
                            key: '007b9471b4c74da4a6ec7ff43552b16f',
                            styleId: 7
                        }
                    },*/
                    osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                    },
                    googleTerrain: {
                        name: 'Google Terrain',
                        layerType: 'TERRAIN',
                        type: 'google'
                    },
                    googleHybrid: {
                        name: 'Google Hybrid',
                        layerType: 'HYBRID',
                        type: 'google'
                    },
                    googleRoadmap: {
                        name: 'Google Streets',
                        layerType: 'ROADMAP',
                        type: 'google'
                    }
                }
            },
            defaults: {
                    //tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                    scrollWheelZoom: false,
            }
        });


    $scope.time_of_data = new Date();
    $scope.chart = {
        labels : [$scope.time_of_data.getHours()+":"+$scope.time_of_data.getMinutes()],
        datasets : [
            {
                fillColor : "rgba(151,187,205,0)",
                strokeColor : "#e67e22",
                pointColor : "rgba(151,187,205,0)",
                pointStrokeColor : "#e67e22",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data : [0]
            },
        ], 
    };
    $scope.singleAssetLoadOnMap = function(asset_details){
        $scope.counter = $scope.counter+1;
        $scope.asset_details = asset_details;

        // alert($scope.asset_details['asset']['_id']['$oid']);
        // $scope.$broadcast('viewMessages',$scope.asset_details['asset_detail']['_id']['$oid']);
        $scope.$watch($scope.asset_details,function(newValue,oldValue){

            if($scope.asset_details['last_data']['speed']<=5){$scope.icon = "img/marker0.png";}
            if(($scope.asset_details['last_data']['speed']>5)&&($scope.asset_details['last_data']['speed']<=25)){$scope.icon = "img/marker5.png";}
            if(($scope.asset_details['last_data']['speed']>25)&&($scope.asset_details['last_data']['speed']<=60)){$scope.icon = "img/marker25.png";}
            if(($scope.asset_details['last_data']['speed']>60)&&($scope.asset_details['last_data']['speed']<=80)){$scope.icon = "img/marker60.png";}
            if(($scope.asset_details['last_data']['speed']>80)&&($scope.asset_details['last_data']['speed']<=110)){$scope.icon = "img/marker80.png";}
            if($scope.asset_details['last_data']['speed']>110){$scope.icon = "img/marker110.png";}
            if($scope.asset_details['last_data']['loc']['coordinates'][1]>0 && $scope.asset_details['last_data']['loc']['coordinates'][0]>0) {
                angular.extend($scope, {
                    markers: {
                        asset: {
                            lat: $scope.asset_details['last_data']['loc']['coordinates'][1],//51.505,
                            lng: $scope.asset_details['last_data']['loc']['coordinates'][0],//-0.09,
                            message:"<h4>"+$scope.asset_details['asset_detail']['name']+"</h4>"+"<h4>Speed:"+$scope.asset_details['last_data']['speed']+"kmph</h4><h4>Time:"+new Date($scope.asset_details['last_data']['time']['$date'])+"</h4>",
                            icon: {
                                iconUrl: $scope.icon,
                                iconSize: [20, 20],
                                iconAnchor: [10, 10],
                                popupAnchor: [0, 0],
                                shadowUrl: $scope.icon,
                                shadowSize:[0,0],
                                iconAngle:$scope.asset_details['last_data']['bearing']
                            }
                        }
                    },
                    london: {
                        lat: $scope.asset_details['last_data']['loc']['coordinates'][1],//51.505,
                        lng: $scope.asset_details['last_data']['loc']['coordinates'][0],//-0.09,
                        zoom: 15
                    },
                });
                
                $scope.time_of_data = new Date($scope.asset_details['last_data']['time']['$date']);
                $scope.$broadcast("getosm",$scope.asset_details['last_data']['loc']['coordinates'][0],$scope.asset_details['last_data']['loc']['coordinates'][1],$scope.asset_details['nlm']);
                $scope.$broadcast("gettraffic",$scope.traffic.checked,$scope.asset_details['last_data']['loc']['coordinates'][0],$scope.asset_details['last_data']['loc']['coordinates'][1]);
                $scope.$broadcast("getevents",$scope.events.checked,$scope.asset_details['last_data']['loc']['coordinates'][0],$scope.asset_details['last_data']['loc']['coordinates'][1]);
                $scope.$broadcast("getshares",$scope.shares.checked,$scope.asset_details['last_data']['loc']['coordinates'][0],$scope.asset_details['last_data']['loc']['coordinates'][1]);
                $scope.$broadcast("getprivatemsg",$scope.private_msg.checked,$scope.asset_details['last_data']['loc']['coordinates'][0],$scope.asset_details['last_data']['loc']['coordinates'][1],$scope.asset_details['asset_detail']['_id']['$oid'],$scope.asset_details['asset_detail']['name']);
                $scope.$broadcast("getpublicmsg",$scope.public_msg.checked,$scope.asset_details['last_data']['loc']['coordinates'][0],$scope.asset_details['last_data']['loc']['coordinates'][1]);
                $scope.$broadcast("getsavedlocations",$scope.custom_location.checked,$scope.asset_details['last_data']['loc']['coordinates'][0],$scope.asset_details['last_data']['loc']['coordinates'][1]);
                //$scope.message = "<h4>"+$scope.asset_details['asset_detail']['name']+"</h4>"+"<h4>Speed:"+$scope.asset_details['last_data']['speed']+"kmph</h4><h4>Time:"+new Date($scope.asset_details['last_data']['time']['$date'])+"</h4>";
                $scope.chart["labels"].push($scope.time_of_data.getHours()+":"+$scope.time_of_data.getMinutes());
                $scope.chart["datasets"][0].data.push($scope.asset_details['last_data']['speed']);
                if($scope.chart["datasets"][0].data.length>20){
                    $scope.chart["datasets"][0].data.shift();
                    $scope.chart["labels"].shift();
                }
            }

        });
        window.plugins.SharedPrefs.getData(function(result){
            //$ionicPopup.alert({"title":"Could I retrieve the data? Ans:"+result});
            $scope.last_loc = result;
            console.log("Last Loc:"+$scope.last_loc);
            $scope.loc_saved = $scope.last_loc.split(",");
            $scope.coords = {lat:parseFloat($scope.loc_saved[0]), lon:parseFloat($scope.loc_saved[1])};
            $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
                $rootScope.$broadcast("loc.found",$scope.coords);
                //$rootScope.$broadcast("loc.center",$scope.coords);
            });
            return result;
        },"","FinderPrefs","last_loc");

        navigator.geolocation.getCurrentPosition(function (data) {
            //$scope.loading.hide();
            $scope.coords = {lat:data.coords.latitude, lon:data.coords.longitude};
            $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
                $rootScope.$broadcast("loc.found",$scope.coords);
            });
        }, function (error) {

          //alert('Unable to get location: ' + error.message);
        });

    }
    var stop;
    $scope.update = function() {
        // Don't start a new fight if we are already fighting
        if ( angular.isDefined(stop) ) return;

        stop = $interval(function() {
            GetMobileAsset.query($scope.asset_id,$scope.name,$scope.email,$scope.logged_in).then(function(messages){
                $scope.details_of_asset = messages;
    
                $scope.$watch($scope.details_of_asset,function(newValue,oldValue){
                    if($scope.details_of_asset) {
                        $scope.singleAssetLoadOnMap($scope.details_of_asset[0]);
                        if($scope.details_of_asset[0].asset_detail.device_number.substring(0,4)=="XMVT"){
                            is_mvt = true;
                            $scope.device_id = $scope.details_of_asset[0].asset_detail.device_number.split("XMVT")[1];
                        }
                        else {
                            $scope.device_id = $scope.details_of_asset[0].asset_detail.device_number;
                        } 
                        console.log("Sharing Status: "+$scope.details_of_asset[0].asset_detail.sharing);
                        $scope.share.checked = $scope.details_of_asset[0].asset_detail.sharing;            

                    }
                });
            });

            
        }, 10000);
    };

    $scope.stopUpdate = function() {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    };

    $scope.stopUpdate();
    $scope.update();

    //$scope.update(details_of_asset);
    getMessageDetails = function(message_id){
        console.log("Reached from Button");
        console.log(message_id);
        $state.go("app.messageView",{ "messageId":message_id});
    }
    getDetails = function(asset_id){
        console.log("Reached from Button");
        console.log(asset_id);
        $state.go("app.sharedetail",{ "assetId":asset_id});
    }

    $scope.$on("getosm",function(event,lon,lat,nlm){
        GetNominatimOSM.query({lon:lon,lat:lat,zoom:"18",format:"json",addressdetails:"1"}).$promise.then(function(message){

            console.log(JSON.stringify(message));
            $scope.osm_place = {
                    'description': '',
                    'loc': {'coordinates': [parseFloat(message["lon"]), parseFloat(message["lat"])],
                    'type': 'Point'},
                    'name': message["display_name"]
                };
            $scope.asset_details['nlm'].push($scope.osm_place);
                
        });
    });

    $scope.$on("gettraffic",function(event,checked,lon,lat){
        if (checked){
            MobileTrafficList.query($scope.name,$scope.email,$scope.logged_in,lat,lon).then(function(messages){
                $scope.traffic_list = messages;

                for(var i=0;i<$scope.traffic_list.shared_list.length;i++){
                    // alert(eval($scope.traffic_list.shared_list[i].loc.coordinates)[0]+" and "+eval(scope.share_list.shared_list[i].loc.coordinates)[1]);
                    // $ionicPopup.alert({"title":eval($scope.traffic_list.shared_list[i].loc.coordinates)[0]+" and "+eval(scope.share_list.shared_list[i].loc.coordinates)[1]});
                    $scope.shares[i] = {
                        "type":"Point",
                        "coordinates":[eval($scope.traffic_list.shared_list[i].loc.coordinates)[0],eval($scope.traffic_list.shared_list[i].loc.coordinates)[1]]
                    };
                    console.log("Traffic Data:"+JSON.stringify($scope.traffic_list.shared_list[i]["loc"])+"||Speed:"+$scope.traffic_list.shared_list[i]["speed"]);
                    $scope.traffic_list.shared_list[i]["loc"] = $scope.shares[i]; 
                    if(((Math.abs($scope.traffic_list.shared_list[i]['loc']['coordinates'][1]-lat)<2) && 
                        Math.abs($scope.traffic_list.shared_list[i]['loc']['coordinates'][0]-lon)<2)&&
                        (parseFloat($scope.traffic_list.shared_list[i]["speed"])>=5)&&
                        (parseFloat($scope.traffic_list.shared_list[i]["speed"])<30)) {
                        $scope.markers[$scope.traffic_list.shared_list[i]["_id"]] = {
                                        lat: $scope.traffic_list.shared_list[i]['loc']['coordinates'][1],//51.505,
                                        lng: $scope.traffic_list.shared_list[i]['loc']['coordinates'][0],//-0.09,
                                        //message:"<h4>"+$scope.asset_details['asset_detail']['name']+"</h4>"+"<h4>Speed:"+$scope.asset_details['last_data']['speed']+"kmph</h4><h4>Time:"+new Date($scope.asset_details['last_data']['time']['$date'])+"</h4>",
                                        icon: {
                                            iconUrl: "img/jam.png",
                                            iconSize: [50, 50],
                                            iconAnchor: [10, 10],
                                            popupAnchor: [0, 0],
                                            shadowUrl: "img/jam.png",
                                            shadowSize:[0,0]
                                        }
                                    };
                    }
                    if(((Math.abs($scope.traffic_list.shared_list[i]['loc']['coordinates'][1]-lat)<2) && 
                        Math.abs($scope.traffic_list.shared_list[i]['loc']['coordinates'][0]-lon)<2)&&
                        (parseFloat($scope.traffic_list.shared_list[i]["speed"])>=30)) {
                        $scope.markers[$scope.traffic_list.shared_list[i]["_id"]] = {
                                        lat: $scope.traffic_list.shared_list[i]['loc']['coordinates'][1],//51.505,
                                        lng: $scope.traffic_list.shared_list[i]['loc']['coordinates'][0],//-0.09,
                                        //message:"<h4>"+$scope.asset_details['asset_detail']['name']+"</h4>"+"<h4>Speed:"+$scope.asset_details['last_data']['speed']+"kmph</h4><h4>Time:"+new Date($scope.asset_details['last_data']['time']['$date'])+"</h4>",
                                        icon: {
                                            iconUrl: "img/free.png",
                                            iconSize: [50, 50],
                                            iconAnchor: [10, 10],
                                            popupAnchor: [0, 0],
                                            shadowUrl: "img/free.png",
                                            shadowSize:[0,0]
                                        }
                                    };
                    }
                }
                
            });            
        }

    });
    $scope.$on("getevents",function(event,checked,lon,lat){
        if (checked){
            MobileEventList.query($scope.name,$scope.email,$scope.logged_in,lat,lon).then(function(messages){
                    $scope.event_list = messages["messages"];
                    for (var i=0;i<$scope.event_list.length;i++) {
                        if($scope.event_list[i]["event_type"]=="rw"){
                            $scope.icon_marker = "img/road_work_marker.png";
                        }
                        else if($scope.event_list[i]["event_type"]=="mg"){
                            $scope.icon_marker = "img/mugging_marker.png";
                        }
                        else if($scope.event_list[i]["event_type"]=="rl"){
                            $scope.icon_marker = "img/rally_marker.png";
                        }
                        else if($scope.event_list[i]["event_type"]=="cl"){
                            $scope.icon_marker = "img/celebration_marker.png";
                        }
                        else if($scope.event_list[i]["event_type"]=="ac"){
                            $scope.icon_marker = "img/accident_marker.png";
                        }
                        else if($scope.event_list[i]["event_type"]=="jm"){
                            $scope.icon_marker = "img/jam_marker.png";
                        }
                        $scope.markers[$scope.event_list[i]["_id"]["$oid"]] = {
                                        lat: $scope.event_list[i]['loc']['coordinates'][1],//51.505,
                                        lng: $scope.event_list[i]['loc']['coordinates'][0],//-0.09,
                                        icon: {
                                            iconUrl: $scope.icon_marker,
                                            iconSize: [40, 40],
                                            iconAnchor: [10, 10],
                                            popupAnchor: [0, 0],
                                            shadowUrl: $scope.icon_marker,
                                            shadowSize:[0,0]
                                        }
                                    };
                    }
                });
            if(!$scope.posted){
                $scope.fbmsg = "I am using FinderGPSTracking on the Google PlayStore to Post and Receive Updates about Road Events around me."+ 
                " This is a community, where everybody is participating for a better city. For Vehicle Tracking, Personal Tracking, Updates about the Road Conditions, "+
                " Or Finding a Hire, use the FinderGPSTracking App on Google PlayStore."+
                " Try it out with your GPS turned on.","https://www.facebook.com/finder.vehicle.tracking";
                $scope.msg = 'Posting on Facebook will help to build a vibrant and helpful community of Finder Users.';
                $scope.showConfirm($scope.msg,$scope.fbmsg);
            }
        }        
    });
    $scope.$on("getprivatemsg",function(event,checked,lon,lat,asset_id,asset_name){
        if (checked){
            MobilePrivateMessage.query($scope.name,$scope.email,$scope.logged_in,lat,lon,asset_id,asset_name).then(function(messages){
                    $scope.message_list = messages["messages"];
                    for (var i=0;i<$scope.message_list.length;i++) {
                        $scope.markers[$scope.message_list[i]["_id"]["$oid"]] = {
                                        lat: $scope.message_list[i]['loc']['coordinates'][1],//51.505,
                                        lng: $scope.message_list[i]['loc']['coordinates'][0],//-0.09,
                                        message:"<a class='button button-clear button-assertive' onclick='getMessageDetails(\""+$scope.message_list[i]['_id']["$oid"]+"\")'>View Details</a>",
                                        icon: {
                                            iconUrl: "img/message.png",
                                            iconSize: [40, 40],
                                            iconAnchor: [10, 10],
                                            popupAnchor: [0, 0],
                                            shadowUrl: "img/message.png",
                                            shadowSize:[0,0]
                                        }
                                    };
                    }
                });
        } 
    });
    $scope.$on("getpublicmsg",function(event,checked,lon,lat){
        if (checked){
            MobilePublicMessage.query($scope.name,$scope.email,$scope.logged_in,lat,lon).then(function(messages){
                    $scope.message_list = messages["messages"];
                    for (var i=0;i<$scope.message_list.length;i++) {
                        $scope.markers[$scope.message_list[i]["_id"]["$oid"]] = {
                                        lat: $scope.message_list[i]['loc']['coordinates'][1],//51.505,
                                        lng: $scope.message_list[i]['loc']['coordinates'][0],//-0.09,
                                        message:"<a class='button button-clear button-assertive' onclick='getMessageDetails(\""+$scope.message_list[i]['_id']["$oid"]+"\")'>View Details</a>",
                                        icon: {
                                            iconUrl: "img/message.png",
                                            iconSize: [40, 40],
                                            iconAnchor: [10, 10],
                                            popupAnchor: [0, 0],
                                            shadowUrl: "img/message.png",
                                            shadowSize:[0,0]
                                        }
                                    };
                    }
                });
        }
    });
    $scope.$on("getshares",function(event,checked,lon,lat){
        if (checked){
            MobileShareList.query($scope.name,$scope.email,$scope.logged_in,lat,lon).then(function(messages){
                $scope.share_list = messages;

                for(var i=0;i<$scope.share_list.shared_list.length;i++){
                    // $scope.shares[i] = {
                    //     "type":"Point",
                    //     "coordinates":[eval($scope.share_list.shared_list[i].loc.coordinates)[0],eval($scope.share_list.shared_list[i].loc.coordinates)[1]]
                    // };
                    // $scope.share_list.shared_list[i]["loc"] = $scope.shares[i]; 

                    // console.log("Share Loc:"+JSON.stringify($scope.share_list.shared_list[i]['loc']));
                    // console.log("Self Loc:"+lon+","+lat);
                    // console.log("Diff Lat:"+(parseFloat($scope.share_list.shared_list[i]['loc']['coordinates'][1])-lat));
                    // console.log("Diff Lon:"+(parseFloat($scope.share_list.shared_list[i]['loc']['coordinates'][0])-lon));
                    if(((Math.abs($scope.share_list.shared_list[i]['loc']['coordinates'][1]-lat)<2) && Math.abs($scope.share_list.shared_list[i]['loc']['coordinates'][0]-lon)<2)) {
                        // console.log("Share Loc:"+JSON.stringify($scope.share_list.shared_list[i]['loc']));
                        // console.log("Self Loc:"+lon+","+lat);
                        // console.log("Diff Lat:"+(parseFloat($scope.share_list.shared_list[i]['loc']['coordinates'][1])-lat));
                        // console.log("Diff Lon:"+(parseFloat($scope.share_list.shared_list[i]['loc']['coordinates'][0])-lon));
    
                        console.log("Asset Type:"+$scope.share_list.shared_list[i]['asset_type']);
                        $scope.share_icon = "img/hire.png";
                        if($scope.share_list.shared_list[i]['asset_type']=="human"){$scope.share_icon = "img/humanh.png";}
                        if($scope.share_list.shared_list[i]['asset_type']=="taxi"){$scope.share_icon = "img/taxih.png";}
                        if($scope.share_list.shared_list[i]['asset_type']=="car"){$scope.share_icon = "img/carh.png";}
                        if($scope.share_list.shared_list[i]['asset_type']=="cng"){$scope.share_icon = "img/cngh.png";}
                        if($scope.share_list.shared_list[i]['asset_type']=="elemu"){$scope.share_icon = "img/elemuh.png";}
                        if($scope.share_list.shared_list[i]['asset_type']=="bus"){$scope.share_icon = "img/bush.png";}
                        if($scope.share_list.shared_list[i]['asset_type']=="cvan"){$scope.share_icon = "img/cvanh.png";}
                        if($scope.share_list.shared_list[i]['asset_type']=="van"){$scope.share_icon = "img/microh.png";}
                        if($scope.share_list.shared_list[i]['asset_type']=="pickup"){$scope.share_icon = "img/pickuph.png";}
                        if($scope.share_list.shared_list[i]['asset_type']=="motorbike"){$scope.share_icon = "img/motorbikeh.png";}
                        if($scope.share_list.shared_list[i]['asset_type']=="cycle"){$scope.share_icon = "img/cycleh.png";}
                        
                        var aid = 0;
                        aid = $scope.share_list.shared_list[i]['_id'];
                        $scope.markers[aid] = {
                                        lat: $scope.share_list.shared_list[i]['loc']['coordinates'][1],//51.505,
                                        lng: $scope.share_list.shared_list[i]['loc']['coordinates'][0],//-0.09,
                                        message:"<a class='button button-clear button-assertive' onclick='getDetails(\""+$scope.share_list.shared_list[i]['_id']+"\")'>View Details</a>",
                                        icon: {
                                            iconUrl: $scope.share_icon,
                                            iconSize: [40, 40],
                                            iconAnchor: [10, 10],
                                            popupAnchor: [0, 0],
                                            shadowUrl: "img/hire.png",
                                            shadowSize:[0,0]
                                        }
                                    };

                    }

                }
                
            });
            if(!$scope.posted){
                $scope.fbmsg = "I am using FinderGPSTracking on the Google PlayStore to find Available cars for Hire around me."+ 
                " This is a community, where everybody is participating for a better city. For Vehicle Tracking, Personal Tracking, Updates about the Road Conditions, "+
                " Or Finding a Hire, use the FinderGPSTracking App on Google PlayStore."+
                " Try it out with your GPS turned on.","https://www.facebook.com/finder.vehicle.tracking";
                $scope.msg = 'Posting on Facebook will help to build a vibrant and helpful community of Finder Users.';
                $scope.showConfirm($scope.msg,$scope.fbmsg);
            }
        }        
    });
    $scope.$on("getsavedlocations",function(event,checked,lon,lat){
        if (checked){
            MobileSavedLocationList.query($scope.name,$scope.email,$scope.logged_in,lat,lon).then(function(messages){
                    $scope.saved_location_list = messages["messages"];
                    for (var i=0;i<$scope.saved_location_list.length;i++) {
                        $scope.icon_marker = "img/marker-icon.png";
                        //console.log("lat:"+$scope.saved_location_list[i]['loc']['coordinates'][1]);
                        //console.log("lng:"+$scope.saved_location_list[i]['loc']['coordinates'][0]);
                        $scope.markers[$scope.saved_location_list[i]["_id"]["$oid"]] = {
                                        lat: $scope.saved_location_list[i]['loc']['coordinates'][1],//51.505,
                                        lng: $scope.saved_location_list[i]['loc']['coordinates'][0],//-0.09,
                                        message: "<label>"+$scope.saved_location_list[i]["name"]+"</label>",
                                        icon: {
                                            iconUrl: $scope.icon_marker,
                                            //iconSize: [40, 40],
                                            iconAnchor: [10, 10],
                                            popupAnchor: [0, 0],
                                            //shadowUrl: $scope.icon_marker,
                                            //shadowSize:[0,0]
                                        }
                                    };
                    }
                });
        }        
    });
    $scope.showConfirm = function(msg,fbmsg) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Post on Facebook?',
            template: '<label style="color:black">'+msg+' Would you like to post on Facebook?</label>'
        });
        confirmPopup.then(function(res) {
            if(res) {
                $scope.postToFB(fbmsg,"https://www.facebook.com/finder.vehicle.tracking");
                console.log('You are sure');
                window.localStorage["fbposted"] = "true";
                $scope.posted = true;
            } else {
               console.log('You are not sure');
               //if(window.localStorage["fbposted"] == "true") 
               $scope.posted = false;
            }
        });
    };
    $scope.connectFB = function(){
        facebookConnectPlugin.login(["public_profile","email","user_friends"],
            fbLoginSuccess,
            function (error) { console.log("" + JSON.stringify(error)) }
        );
    }
    var fbLoginSuccess = function (userData) {
        console.log("FB UserInfo: " + JSON.stringify(userData));
        $scope.response = userData;
    }
    $scope.postToFB = function(desc,ref){
        // facebookConnectPlugin.login(["public_profile","email","user_friends"],
        //     fbLoginSuccess,
        //     function (error) { alert("" + error) }
        // );
        facebookConnectPlugin.getLoginStatus(
            function (status) {
                console.log("current status: " + JSON.stringify(status));

                var options = { 
                    method:"share",
                    description:desc,
                    href: ref
                };
                // var options = { 
                //     method:"share_open_graph",
                //     action_properties: 'likes'
                // };
                facebookConnectPlugin.showDialog(options,
                    function (result) {
                        console.log("Posted. " + JSON.stringify(result));             },
                function (e) {
                    console.log("Failed: " + e);
                });
            }, function(e){
                $scope.connectFB();
            }
        );
    }
})
.controller('FacebookCtrl', function($window, $scope, $stateParams,$ionicPopup, $rootScope, $interval, leafletData, GetMobileAsset, UserListInOrg, UserShareAsset,CheckIfUserIsPaid) {
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];
    $scope.asset_id = $stateParams.assetId;

    // CheckIfUserIsPaid.queryforasset($scope.name,$scope.email,$scope.logged_in,$scope.asset_id).then(function(messages){
    //     $scope.asset_pay = messages;
    // });

    var fbLoginSuccess = function (userData) {
        console.log("FB UserInfo: " + JSON.stringify(userData));
        $scope.response = userData;
    }
    $scope.connectFB = function(){
        facebookConnectPlugin.login(["public_profile","email","user_friends"],
            fbLoginSuccess,
            function (error) { console.log("" + JSON.stringify(error)) }
        );
    }

    $scope.postToFB = function(){
        facebookConnectPlugin.login(["public_profile","email","user_friends"],
            fbLoginSuccess,
            function (error) { alert("" + error) }
        );
        facebookConnectPlugin.getLoginStatus(
            function (status) {
                console.log("current status: " + JSON.stringify(status));

                var options = { 
                    method:"share",
                    description:"I am using Finder to Hire a Car, are you?",
                    href: 'https://www.facebook.com/finder.vehicle.tracking'
                };
                // var options = { 
                //     method:"share_open_graph",
                //     action_properties: 'likes'
                // };
                facebookConnectPlugin.showDialog(options,
                    function (result) {
                        console.log("Posted. " + JSON.stringify(result));             },
                function (e) {
                    console.log("Failed: " + e);
                });
            }, function(e){
                $scope.connectFB();
            }
        );
    }
 })   

.controller('ViewerCtrl', function($scope,$state, $stateParams,$ionicPopup, $rootScope, $interval, leafletData, GetMobileAsset, UserListInOrg, UserShareAsset,CheckIfUserIsPaid) {
    if(true) { ga_storage._trackPageview("Viewer Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];
    $scope.asset_id = $stateParams.assetId;
    GetMobileAsset.query($scope.asset_id,$scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.details_of_asset = messages;
    });
    UserListInOrg.query($scope.name,$scope.email,$scope.logged_in,$scope.asset_id).then(function(messages){
        $scope.user_list = messages;
    });
    CheckIfUserIsPaid.queryforasset($scope.name,$scope.email,$scope.logged_in,$scope.asset_id).then(function(messages){
        $scope.asset_pay = messages[0];
        console.log("If Asset is paid? "+JSON.stringify($scope.asset_pay));
    });
    $scope.shareWithUser = function(u){
        UserShareAsset.query($scope.name,$scope.email,$scope.logged_in,$scope.asset_id,u["email"],u["checked"]).then(function(messages){
            $scope.response = messages;
        });
    }
 })  
 .controller('OrgEditCtrl', function($scope,$state, $stateParams,$ionicPopup, $rootScope, $interval, $http, leafletData, Organization, GetMobileAsset, UserListInOrg, UserAdminPermission,CheckIfUserIsPaid) {
    if(true) { ga_storage._trackPageview("OrgEdit Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];
    Organization.query($scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.organization = messages;
    });

    CheckIfUserIsPaid.queryforuser($scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.user_pay = messages[0];
        console.log(JSON.stringify($scope.user_pay));
    });
    
    $scope.editOrg = function(){
        // UserAdminPermission.query($scope.name,$scope.email,$scope.logged_in,u["email"],u["checked"]).then(function(messages){
        //     $scope.response = messages;
        // });
        $scope.org_response = $http({
            method: 'GET',
            url: domain+'/app/organization/edit?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in+'&org_id='+$scope.organization[0]["_id"]["$oid"]+'&org_name='+$scope.organization[0].name+'&org_address='+$scope.organization[0].address,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(
            function(result){

                if(result["success"]){
                    //alert("Device Added");    
                    $ionicPopup.alert({"title":"Edited successfully"});
                    //$state.go();
                    //$state.go("app.detail",{ "assetId":asset_id});
                }

                return result;
            }
        );  
    }
 })    
.controller('UserAdminCtrl', function($scope,$state, $stateParams,$ionicPopup, $rootScope, $interval, leafletData, Organization, GetMobileAsset, UserListInOrg, UserAdminPermission,CheckIfUserIsPaid) {
    if(true) { ga_storage._trackPageview("User Admin Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];
    Organization.query($scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.organization = messages;
    });

    CheckIfUserIsPaid.queryforuser($scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.user_pay = messages[0];
        console.log(JSON.stringify($scope.user_pay));
    });
    
    GetMobileAsset.query($scope.asset_id,$scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.details_of_asset = messages;

    });
    UserListInOrg.queryall($scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.user_list = messages;
    });

    $scope.adminUser = function(u){
        UserAdminPermission.query($scope.name,$scope.email,$scope.logged_in,u["email"],u["checked"]).then(function(messages){
            $scope.response = messages;
        });
    }
 })   
.controller('SubscribeAssetCtrl', function($scope, $state, $stateParams,$ionicPopup, $rootScope, $http, Plan,GetMobileAsset,Organization) {
    if(true) { ga_storage._trackPageview("SubscribeAsset Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];
    $scope.asset_id = $stateParams.assetId;
    $scope.bdt = "BDT";
    GetMobileAsset.query($scope.asset_id,$scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.details_of_asset = messages;
    });
    Organization.query($scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.organization = messages;
    });
    Plan.query().then(function(messages){
        $scope.plans = messages;    
    });

    $scope.subscribe = function(p){
        //alert(p.number_of_devices*p.price);
        $scope.data = {
            "plan_id":p._id.$oid,
            "plan_name":p.plan_name,
            "plan_validity_period_days":p.plan_validity_period_days,
            "price":p.price,
            "number_of_devices":p.number_of_devices,
            "number_of_users":p.number_of_users,
            "currency":p.currency
        };

        $http({
            method: 'POST',
            url: domain+'/app/payment?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in,
            data: $scope.data,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
            //headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
        }).success(
            function(result){
                return result;
            }
        );
    }
    $scope.ifForeign = function(currency){
        if(currency=='USD'){
            return true;
        }
        else {
            return false;
        }
    };
    $scope.payBkash = function(p,trxid){

        $scope.bkash_response = $http({
            method: 'GET',
            url: domain+'/app/bkashpayment?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in+'&asset_id='+$scope.asset_id+'&plan_id='+p._id.$oid+'&plan_name='+p.plan_name+'&plan_validity_period_days='+p.plan_validity_period_days+'&price='+p.price+'&number_of_devices=1'+'&number_of_users=1'+'&currency='+p.currency+'&trxid='+trxid,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
            //headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
        }).success(
            function(result){
                // alert(result["message"]);
                $ionicPopup.alert({"title":result["message"]});
                return result;
            }
        );
    
    };
    $scope.payBkashBalance = function(p){

        $scope.bkash_response = $http({
            method: 'GET',
            url: domain+'/app/bkashpayment/existingbalance?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in+'&asset_id='+$scope.asset_id+'&plan_id='+p._id.$oid+'&plan_name='+p.plan_name+'&plan_validity_period_days='+p.plan_validity_period_days+'&price='+p.price+'&number_of_devices=1'+'&number_of_users=1'+'&currency='+p.currency,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
            //headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
        }).success(
            function(result){
                // alert(result["message"]);
                $ionicPopup.alert({"title":result["message"]});
                return result;
            }
        );
    };
    var fbLoginSuccess = function (userData) {
        console.log("FB UserInfo: " + JSON.stringify(userData));
        $scope.response = userData;
    }
    $scope.postToFB = function(desc,ref){
        facebookConnectPlugin.login(["public_profile","email","user_friends"],
            fbLoginSuccess,
            function (error) { alert("" + error) }
        );
        facebookConnectPlugin.getLoginStatus(
            function (status) {
                console.log("current status: " + JSON.stringify(status));

                var options = { 
                    method:"share",
                    description:desc,
                    href: ref
                };
                // var options = { 
                //     method:"share_open_graph",
                //     action_properties: 'likes'
                // };
                facebookConnectPlugin.showDialog(options,
                    function (result) {
                        console.log("Posted. " + JSON.stringify(result));             },
                function (e) {
                    console.log("Failed: " + e);
                });
            }, function(e){
                $scope.connectFB();
            }
        );
    }
})

.controller('SubscriptionCtrl', function($scope, $state, $stateParams, $rootScope,$ionicPopup, $http, Plan) {
    if(true) { ga_storage._trackPageview("Subscription Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];

    Plan.query().then(function(messages){
        $scope.plans = messages;    
    });

    $scope.subscribe = function(p){
        //alert(p.number_of_devices*p.price);
        $scope.data = {
            "plan_id":p._id.$oid,
            "plan_name":p.plan_name,
            "plan_validity_period_days":p.plan_validity_period_days,
            "price":p.price,
            "number_of_devices":p.number_of_devices,
            "number_of_users":p.number_of_users,
            "currency":p.currency
        };

        $http({
            method: 'POST',
            url: '/payment',
            data: $scope.data,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
            //headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
        }).success(
            function(result){
                return result;
            }
        );
    }
    $scope.ifForeign = function(currency){
        if(currency=='USD'){
            return true;
        }
        else {
            return false;
        }
    };
    $scope.payBkash = function(p,trxid){
        $scope.data = {
            "plan_id":p._id.$oid,
            "plan_name":p.plan_name,
            "plan_validity_period_days":p.plan_validity_period_days,
            "price":p.price,
            "number_of_devices":p.number_of_devices,
            "number_of_users":p.number_of_users,
            "currency":p.currency,
            "trxid":trxid
        };

        $scope.bkash_response = $http({
            method: 'POST',
            url: '/bkashpayment',
            data: $scope.data,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
            //headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
        }).success(
            function(result){
                
                return result;
            }
        );
    
    };
    $scope.payBkashBalance = function(p){
        $scope.data = {
            "plan_id":p._id.$oid,
            "plan_name":p.plan_name,
            "plan_validity_period_days":p.plan_validity_period_days,
            "price":p.price,
            "number_of_devices":p.number_of_devices,
            "number_of_users":p.number_of_users,
            "currency":p.currency
        };

        $scope.bkash_response = $http({
            method: 'POST',
            url: '/bkashpayment/existingbalance',
            data: $scope.data,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
            //headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
        }).success(
            function(result){
                return result;
            }
        );
    
    };
})

.controller('OrderCtrl', function($scope, $state, $stateParams, $rootScope,$ionicPopup, $http, Organization,GetDevicePlans) {
    if(true) { ga_storage._trackPageview("OrderCtrl"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];

    $scope.dscs = [];

    Organization.query($scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.organization = messages;
    });
    
    GetDevicePlans.query().$promise.then(function(messages){
        $scope.plans = messages["device_plans"];
        $scope.discounts = messages["discount_plans"];
        for (var i=0;i<$scope.plans.length;i++){
            $scope.plans[i].number_of_devices = 0;
            $scope.plans[i].total_discount = 0;
            $scope.plans[i].final_price = 0;          
        }
        for (var i=0;i<$scope.discounts.length;i++) {
            $scope.dscs.push($scope.discounts[i]["min_qty"]);
        }
        $scope.largest = Math.max.apply(Math, $scope.dscs);
        console.log("Highest Qty:"+$scope.largest);
    });
    $scope.onChange = function(p){
        console.log("Ordered qty:"+p["number_of_devices"]);
        for (var i=0;i<$scope.discounts.length;i++) {
            if((p["number_of_devices"]==$scope.discounts[i]["min_qty"])){
                p["total_discount"] = p["price"]*p["number_of_devices"]*$scope.discounts[i]["discount"];
                p["final_price"] = (p["price"]*p["number_of_devices"])-p["total_discount"];
                p["discount_plan_id"] = $scope.discounts[i]["_id"]["$oid"];
                break;
            }
            if(($scope.largest==$scope.discounts[i]["min_qty"])&&(p["number_of_devices"]>$scope.largest)){
                p["total_discount"] = p["price"]*p["number_of_devices"]*$scope.discounts[i]["discount"];
                p["final_price"] = (p["price"]*p["number_of_devices"])-p["total_discount"];   
                p["discount_plan_id"] = $scope.discounts[i]["_id"]["$oid"];
                break;
            }
        };
    };
    $scope.ifForeign = function(currency){
        if(currency=='USD'){
            return true;
        }
        else {
            return false;
        }
    };
    $scope.payBkash = function(p,trxid){
        $scope.bkash_response = $http({
            method: 'GET',
            url: domain+'/app/bkashdevicepayment?email='+$scope.email
                +'&name='+$scope.name
                +'&logged_in='+$scope.logged_in
                +'&device_plan_id='+p._id.$oid
                +'&plan_name='+p.name
                +'&final_price='+p.final_price
                +'&price='+p.price
                +'&number_of_devices='+p.number_of_devices
                +'&total_discount='+p.total_discount
                +'&discount_plan_id='+p.discount_plan_id
                +'&currency='+p.currency
                +'&trxid='+trxid,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
            //headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
        }).success(
            function(result){
                // alert(result["message"]);
                $ionicPopup.alert({"title":result["message"]});
                return result;
            }
        );
    };
    $scope.payBkashBalance = function(p){

        $scope.bkash_response = $http({
            method: 'GET',
            url: domain+'/app/bkashdevicepayment/existingbalance?email='+$scope.email
                +'&name='+$scope.name
                +'&logged_in='+$scope.logged_in
                +'&device_plan_id='+p._id.$oid
                +'&plan_name='+p.name
                +'&final_price='+p.final_price
                +'&price='+p.price
                +'&number_of_devices='+p.number_of_devices
                +'&total_discount='+p.total_discount
                +'&discount_plan_id='+p.discount_plan_id
                +'&currency='+p.currency,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
            //headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
        }).success(
            function(result){
                // alert(result["message"]);
                $ionicPopup.alert({"title":result["message"]});
                return result;
            }
        );
    
    };
})
.controller('NoticeCtrl', function($scope, $stateParams,$ionicPopup, $rootScope, $interval, $http, leafletData, GetNotice) {
    if(true) { ga_storage._trackPageview("Message Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];
    $scope.notice_id = $stateParams.noticeId;
    $scope.counter = 0;
    $scope.image_loc = $scope.domain;
    GetNotice.query($scope.name,$scope.email,$scope.logged_in,$scope.notice_id).then(function(messages){
        $scope.notice = messages;
        $scope.image_loc = domain+"/static/"+$scope.notice.notice.image;
        console.log(JSON.stringify($scope.notice));
        console.log($scope.image_loc);
    });

})
.controller('MessageCtrl', function($scope, $stateParams,$ionicPopup, $rootScope, $interval, $http,$timeout, leafletData, GetMobileAsset) {
    if(true) { ga_storage._trackPageview("Message Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];
    $scope.asset_id = $stateParams.assetId;
    $scope.counter = 0;

    GetMobileAsset.query($scope.asset_id,$scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.details_of_asset = messages;
        $scope.$watch($scope.details_of_asset,function(newValue,oldValue){
            if($scope.details_of_asset) $scope.singleAssetLoadOnMap($scope.details_of_asset[0]);
        });
    });
    window.plugins.SharedPrefs.getData(function(result){
        //$ionicPopup.alert({"title":"Could I retrieve the data? Ans:"+result});
        $scope.last_loc = result;
        console.log("Last Loc:"+$scope.last_loc);
        $scope.loc_saved = $scope.last_loc.split(",");
        $scope.coords = {lat:parseFloat($scope.loc_saved[0]), lon:parseFloat($scope.loc_saved[1])};
        $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
            $rootScope.$broadcast("loc.found",$scope.coords);
            $rootScope.$broadcast("loc.center",$scope.coords);
        });
        return result;
    },"","FinderPrefs","last_loc");

    navigator.geolocation.getCurrentPosition(function (data) {
        //$scope.loading.hide();
        $scope.coords = {lat:data.coords.latitude, lon:data.coords.longitude};
        $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
            $rootScope.$broadcast("loc.found",$scope.coords);
            $rootScope.$broadcast("loc.center",$scope.coords);
        });
    }, function (error) {

      // alert('Unable to get location: ' + error.message);
      $ionicPopup.alert({"title":'Unable to get location: ' + error.message});
    });
    
    $scope.$on("loc.found",function(event,coords){
        $scope.coords = coords;
        $scope.markers["me"] = {
                    lat: $scope.coords.lat,
                    lng: $scope.coords.lon,
                    icon: {
                        iconUrl: "img/finder 50px.png",
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                        popupAnchor: [0, 0],
                        shadowUrl: "img/finder 50px.png",
                        shadowSize:[0,0]

                    }
                };

        $scope.markers["start"] = {
                    lat: $scope.coords.lat,
                    lng: $scope.coords.lon,
                    icon: {
                        iconUrl: "img/start.png",
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                        popupAnchor: [0, 0],
                        shadowUrl: "img/start.png",
                        shadowSize:[0,0]

                    },
                    message: "Use me for the starting location for your message",
                    draggable: true
                };
        $scope.markers["end"] = {
                    lat: $scope.coords.lat,
                    lng: $scope.coords.lon,
                    icon: {
                        iconUrl: "img/end.png",
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                        popupAnchor: [0, 0],
                        shadowUrl: "img/end.png",
                        shadowSize:[0,0]

                    },
                    message: "Use me for the end location for your message",
                    draggable: true
                };

    });
    
    $scope.$on("loc.center",function(event,coords){
        $scope.coords = coords;

        angular.extend($scope, {
            london: {
                lat: $scope.coords.lat,
                lng: $scope.coords.lon,
                zoom: 15
            }
        });

    });
    angular.extend($scope, {
            london: {
                lat: 23,
                lng: 90,
                zoom: 4
            },
            geojson: {},
            markers: {},
            paths: {
                p1: {
                    color: '#996666',
                    weight: 1,
                    latlngs: [
                    ],
                }
            },
            layers: {
                baselayers: {
                    /*cloudmade2: {
                        name: 'Cloudmade',
                        type: 'xyz',
                        url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
                        layerParams: {
                            key: '007b9471b4c74da4a6ec7ff43552b16f',
                            styleId: 7
                        }
                    },*/
                    osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                    },
                    googleTerrain: {
                        name: 'Google Terrain',
                        layerType: 'TERRAIN',
                        type: 'google'
                    },
                    googleHybrid: {
                        name: 'Google Hybrid',
                        layerType: 'HYBRID',
                        type: 'google'
                    },
                    googleRoadmap: {
                        name: 'Google Streets',
                        layerType: 'ROADMAP',
                        type: 'google'
                    }
                }
            },
            defaults: {
                    //tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                    scrollWheelZoom: false,
            }
        });

    $scope.singleAssetLoadOnMap = function(asset_details){
        $scope.counter = $scope.counter+1;
        $scope.asset_details = asset_details;
        // alert($scope.asset_details['asset']['_id']['$oid']);
        // $scope.$broadcast('viewMessages',$scope.asset_details['asset_detail']['_id']['$oid']);
        $scope.$watch($scope.asset_details,function(newValue,oldValue){
            if($scope.asset_details['last_data']['speed']<=5){$scope.icon = "img/marker0.png";}
            if(($scope.asset_details['last_data']['speed']>5)&&($scope.asset_details['last_data']['speed']<=25)){$scope.icon = "img/marker5.png";}
            if(($scope.asset_details['last_data']['speed']>25)&&($scope.asset_details['last_data']['speed']<=60)){$scope.icon = "img/marker25.png";}
            if(($scope.asset_details['last_data']['speed']>60)&&($scope.asset_details['last_data']['speed']<=80)){$scope.icon = "img/marker60.png";}
            if(($scope.asset_details['last_data']['speed']>80)&&($scope.asset_details['last_data']['speed']<=110)){$scope.icon = "img/marker80.png";}
            if($scope.asset_details['last_data']['speed']>110){$scope.icon = "img/marker110.png";}
            angular.extend($scope, {
                markers: {
                    asset: {
                        lat: $scope.asset_details['last_data']['loc']['coordinates'][1],//51.505,
                        lng: $scope.asset_details['last_data']['loc']['coordinates'][0],//-0.09,
                        message:"<h4>"+$scope.asset_details['asset_detail']['name']+"</h4>"+"<h4>Speed:"+$scope.asset_details['last_data']['speed']+"kmph</h4><h4>Time:"+new Date($scope.asset_details['last_data']['time']['$date'])+"</h4>",
                        icon: {
                            iconUrl: $scope.icon,
                            iconSize: [20, 20],
                            iconAnchor: [10, 10],
                            popupAnchor: [0, 0],
                            shadowUrl: $scope.icon,
                            shadowSize:[0,0],
                            iconAngle:$scope.asset_details['last_data']['bearing']
                        }
                    }
                },
                london: {
                    lat: $scope.asset_details['last_data']['loc']['coordinates'][1],//51.505,
                    lng: $scope.asset_details['last_data']['loc']['coordinates'][0],//-0.09,
                    zoom: 15
                },
            });
            $scope.time_of_data = new Date($scope.asset_details['last_data']['time']['$date']);  
            //$scope.message = "<h4>"+$scope.asset_details['asset_detail']['name']+"</h4>"+"<h4>Speed:"+$scope.asset_details['last_data']['speed']+"kmph</h4><h4>Time:"+new Date($scope.asset_details['last_data']['time']['$date'])+"</h4>";
        });
        window.plugins.SharedPrefs.getData(function(result){
            //$ionicPopup.alert({"title":"Could I retrieve the data? Ans:"+result});
            $scope.last_loc = result;
            console.log("Last Loc:"+$scope.last_loc);
            $scope.loc_saved = $scope.last_loc.split(",");
            $scope.coords = {lat:parseFloat($scope.loc_saved[0]), lon:parseFloat($scope.loc_saved[1])};
            $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
                $rootScope.$broadcast("loc.found",$scope.coords);
                $rootScope.$broadcast("loc.center",$scope.coords);
            });
            return result;
        },"","FinderPrefs","last_loc");

        navigator.geolocation.getCurrentPosition(function (data) {
            //$scope.loading.hide();
            $scope.coords = {lat:data.coords.latitude, lon:data.coords.longitude};
            $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
                $rootScope.$broadcast("loc.found",$scope.coords);
            });
        }, function (error) {
          //alert('Unable to get location: ' + error.message);
        });
    }

    GetMobileAsset.query($scope.asset_id,$scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.details_of_asset = messages;
        $scope.$watch($scope.details_of_asset,function(newValue,oldValue){
            if($scope.details_of_asset) $scope.singleAssetLoadOnMap($scope.details_of_asset[0]);
        });
    });

    $scope.sendMessage = function(asset_id,message,message_time){
        // alert("UTC:"+moment.utc(new Date(message_time)).format("ddd MMM DD YYYY HH:MM Z(z)"));
        // alert("General:"+moment.utc(new Date(message_time)).format("MM/DD/YYYY HH:MMZ"));
        // alert("General:"+message_time);
        // "Wed Jul 09 2014 17:44:36 GMT+0600"
        $scope.message_response = $http({
            method: 'GET',
            url: domain+'/app/messages/send?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in+'&to_asset='+asset_id+'&message='+message+'&scheduled_date='+message_time+'&loc='+[$scope.markers.start.lng,$scope.markers.start.lat]+'&loc_end='+[$scope.markers.end.lng,$scope.markers.end.lat],
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(
            function(result){
                //$ionicPopup.alert({"title":JSON.stringify(result)});
                $rootScope.$broadcast('Message.query');
                // alert(JSON.stringify(result));
                $ionicPopup.alert({"title":result["message"]});
                return result;
            }
        );
    };
    $scope.sendOpenMessage = function(asset_id,message,message_time){
        // alert("UTC:"+moment.utc(new Date(message_time)).format("ddd MMM DD YYYY HH:MM Z(z)"));
        // alert("General:"+moment.utc(new Date(message_time)).format("MM/DD/YYYY HH:MMZ"));
        // alert("General:"+message_time);
        // "Wed Jul 09 2014 17:44:36 GMT+0600"
        console.log(message_time);
        $scope.message_response = $http({
            method: 'GET',
            url: domain+'/app/messages/opensend?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in+'&message='+message+'&scheduled_date='+message_time+'&loc='+[$scope.markers.start.lng,$scope.markers.start.lat]+'&loc_end='+[$scope.markers.end.lng,$scope.markers.end.lat],
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(
            function(result){
                //$ionicPopup.alert({"title":JSON.stringify(result)});
                $rootScope.$broadcast('Message.query');
                // alert(JSON.stringify(result));
                //$ionicPopup.alert({"title":result["message"]});
                $scope.showConfirm(result["message"]);
                return result;
            }
        );
    };
    //$scope.update(details_of_asset);
    $scope.posted = false;
    var fbLoginSuccess = function (userData) {
        console.log("FB UserInfo: " + JSON.stringify(userData));
        $scope.response = userData;
    }
    $scope.postToFB = function(desc,ref){
        facebookConnectPlugin.login(["public_profile","email","user_friends"],
            fbLoginSuccess,
            function (error) { alert("" + error) }
        );
        facebookConnectPlugin.getLoginStatus(
            function (status) {
                console.log("current status: " + JSON.stringify(status));

                var options = { 
                    method:"share",
                    description:desc,
                    href: ref
                };
                // var options = { 
                //     method:"share_open_graph",
                //     action_properties: 'likes'
                // };
                facebookConnectPlugin.showDialog(options,
                    function (result) {
                        console.log("Posted. " + JSON.stringify(result));
                        $scope.posted = true;
                     },
                function (e) {
                    console.log("Failed: " + e);
                    $scope.posted = false;
                });
            }, function(e){
                $scope.connectFB();
            }
        );
    }
    $scope.showConfirm = function(msg) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Post on Facebook?',
            template: '<label style="color:black">'+msg+'. Posting on Facebook will let others know, regarding your message. Would you like to post on Facebook?</label>'
        });
        confirmPopup.then(function(res) {
            if(res) {
                $scope.postToFB("I just posted a message on FinderGPSTracking. "+ 
                    "For Vehicle Tracking, Personal Tracking, Updates about the Road Conditions,"+
                    " Or Finding a Hire, use the FinderGPSTracking App on Google PlayStore."+
                    " Try it out with your GPS Location turned ON.","https://www.facebook.com/finder.vehicle.tracking");
                console.log('You are sure');
            } else {
               console.log('You are not sure');
            }
        });
    };

})
.controller('MessageListCtrl', function($scope, $state, $stateParams,$ionicPopup, $rootScope, $http, leafletData, MobileMessage) {
    if(true) { ga_storage._trackPageview("MessageList Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];

    MobileMessage.query($scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.message_list = messages;
    });
    $rootScope.$on('Message.query', function(event) { $scope.message_list = MobileMessage.query()});
    $scope.doRefresh = function(){
        MobileMessage.query($scope.name,$scope.email,$scope.logged_in).then(function(messages){
            $scope.message_list = messages;
        });
    }
    $scope.deliver = function(id,delivered){
        $scope.response = $http({
            method: 'GET',
            url: domain+'/app/messages/to/delivered?id='+id+'&delivered='+delivered+"&email="+$scope.email+"&name="+$scope.name+"&logged_in="+$scope.logged_in,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(
            function(result){
                return result;
            }
        );
    }
})

.controller('PublicMessageCtrl', function($scope, $state, $stateParams,$ionicPopup, $rootScope, $http, leafletData, MobilePublicMessage) {
    if(true) { ga_storage._trackPageview("PublicMessage Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];

    $scope.doRefresh = function(){
        $rootScope.$broadcast("loc.center",$scope.coords);
    }
    window.plugins.SharedPrefs.getData(function(result){
        //$ionicPopup.alert({"title":"Could I retrieve the data? Ans:"+result});
        $scope.last_loc = result;
        console.log("Last Loc:"+$scope.last_loc);
        $scope.loc_saved = $scope.last_loc.split(",");
        $scope.coords = {lat:parseFloat($scope.loc_saved[0]), lon:parseFloat($scope.loc_saved[1])};
        $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
            $rootScope.$broadcast("loc.found",$scope.coords);
            $rootScope.$broadcast("loc.center",$scope.coords);
        });
        return result;
    },"","FinderPrefs","last_loc");

    navigator.geolocation.getCurrentPosition(function (data) {
        //$scope.loading.hide();
        $scope.coords = {lat:data.coords.latitude, lon:data.coords.longitude};
        $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
            $rootScope.$broadcast("loc.found",$scope.coords);
            $rootScope.$broadcast("loc.center",$scope.coords);
        });
    }, function (error) {

      // alert('Unable to get location: ' + error.message);
      $ionicPopup.alert({"title":'Unable to get location: ' + error.message});
    });    
    
    $scope.$on("loc.found",function(event,coords){
        $scope.coords = coords;
        $scope.markers["me"] = {
                    lat: $scope.coords.lat,
                    lng: $scope.coords.lon,
                    icon: {
                        iconUrl: "img/finder 50px.png",
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                        popupAnchor: [0, 0],
                        shadowUrl: "img/finder 50px.png",
                        shadowSize:[0,0]

                    }
                };

    });
    
    $scope.$on("loc.center",function(event,coords){
        $scope.coords = coords;

        angular.extend($scope, {
            london: {
                lat: $scope.coords.lat,
                lng: $scope.coords.lon,
                zoom: 15
            }
        });

    });

    angular.extend($scope, {
            london: {
                lat: 23,
                lng: 90,
                zoom: 4
            },
            geojson: {},
            markers: {},
            paths: {
                p1: {
                    color: '#996666',
                    weight: 1,
                    latlngs: [
                    ],
                }
            },
            layers: {
                baselayers: {
                    /*cloudmade2: {
                        name: 'Cloudmade',
                        type: 'xyz',
                        url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
                        layerParams: {
                            key: '007b9471b4c74da4a6ec7ff43552b16f',
                            styleId: 7
                        }
                    },*/
                    osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                    },
                    googleTerrain: {
                        name: 'Google Terrain',
                        layerType: 'TERRAIN',
                        type: 'google'
                    },
                    googleHybrid: {
                        name: 'Google Hybrid',
                        layerType: 'HYBRID',
                        type: 'google'
                    },
                    googleRoadmap: {
                        name: 'Google Streets',
                        layerType: 'ROADMAP',
                        type: 'google'
                    }
                }
            },
            defaults: {
                    //tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                    scrollWheelZoom: false,
            }
        });
    $scope.shares = [];
    getMessageDetails = function(message_id){
        console.log("Reached from Button");
        console.log(message_id);
        $state.go("app.messageView",{ "messageId":message_id});
    }
    $scope.$on("loc.center",function(event,coords){
        MobilePublicMessage.query($scope.name,$scope.email,$scope.logged_in,$scope.coords.lat,$scope.coords.lon).then(function(messages){
                $scope.message_list = messages["messages"];
                for (var i=0;i<$scope.message_list.length;i++) {
                    $scope.markers[$scope.message_list[i]["_id"]["$oid"]] = {
                                    lat: $scope.message_list[i]['loc']['coordinates'][1],//51.505,
                                    lng: $scope.message_list[i]['loc']['coordinates'][0],//-0.09,
                                    message:"<a class='button button-clear button-assertive' onclick='getMessageDetails(\""+$scope.message_list[i]['_id']["$oid"]+"\")'>View Details</a>",
                                    icon: {
                                        iconUrl: "img/message.png",
                                        iconSize: [40, 40],
                                        iconAnchor: [10, 10],
                                        popupAnchor: [0, 0],
                                        shadowUrl: "img/message.png",
                                        shadowSize:[0,0]
                                    }
                                };
                }
            });
    });

})
.controller('MessageViewCtrl', function($scope, $stateParams,$ionicPopup, $rootScope, $interval, leafletData, GetMobileAsset, MobileMessageDetail,CheckIfUserIsPaid) {
    if(true) { ga_storage._trackPageview("MessageView Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];
    $scope.message_id = $stateParams.messageId;

    // CheckIfUserIsPaid.queryforuser($scope.name,$scope.email,$scope.logged_in).then(function(messages){
    //     $scope.user_pay = messages[0];
    //     console.log(JSON.stringify($scope.user_pay));
    // });    
    angular.extend($scope, {
            london: {
                lat: 23,
                lng: 90,
                zoom: 4
            },
            geojson: {},
            markers: {},
            paths: {
                p1: {
                    color: '#996666',
                    weight: 1,
                    latlngs: [
                    ],
                }
            },
            layers: {
                baselayers: {
                    /*cloudmade2: {
                        name: 'Cloudmade',
                        type: 'xyz',
                        url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
                        layerParams: {
                            key: '007b9471b4c74da4a6ec7ff43552b16f',
                            styleId: 7
                        }
                    },*/
                    osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                    },
                    googleTerrain: {
                        name: 'Google Terrain',
                        layerType: 'TERRAIN',
                        type: 'google'
                    },
                    googleHybrid: {
                        name: 'Google Hybrid',
                        layerType: 'HYBRID',
                        type: 'google'
                    },
                    googleRoadmap: {
                        name: 'Google Streets',
                        layerType: 'ROADMAP',
                        type: 'google'
                    }
                }
            },
            defaults: {
                    //tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                    scrollWheelZoom: false,
            }
        });
    MobileMessageDetail.query($scope.name,$scope.email,$scope.logged_in,$scope.message_id).then(function(messages){
        $scope.message_detail = messages;
        angular.extend($scope, {
                markers: {
                    start: {
                        lat: $scope.message_detail.message['loc']['coordinates'][1],//51.505,
                        lng: $scope.message_detail.message['loc']['coordinates'][0],//-0.09,
                        //message:"<h4>"+$scope.asset_details['asset_detail']['name']+"</h4>"+"<h4>Speed:"+$scope.asset_details['last_data']['speed']+"kmph</h4><h4>Time:"+new Date($scope.asset_details['last_data']['time']['$date'])+"</h4>",
                        icon: {
                            iconUrl: "img/start.png",
                            iconSize: [20, 20],
                            iconAnchor: [10, 10],
                            popupAnchor: [0, 0],
                            shadowUrl: "img/start.png",
                            shadowSize:[0,0]
                        }
                    }
                },
                london: {
                    lat: $scope.message_detail.message['loc']['coordinates'][1],//51.505,
                    lng: $scope.message_detail.message['loc']['coordinates'][0],//-0.09,
                    zoom: 15
                },
            });
        angular.extend($scope, {
                markers: {
                    end: {
                        lat: $scope.message_detail.message['loc_end']['coordinates'][1],//51.505,
                        lng: $scope.message_detail.message['loc_end']['coordinates'][0],//-0.09,
                        //message:"<h4>"+$scope.asset_details['asset_detail']['name']+"</h4>"+"<h4>Speed:"+$scope.asset_details['last_data']['speed']+"kmph</h4><h4>Time:"+new Date($scope.asset_details['last_data']['time']['$date'])+"</h4>",
                        icon: {
                            iconUrl: "img/end.png",
                            iconSize: [20, 20],
                            iconAnchor: [10, 10],
                            popupAnchor: [0, 0],
                            shadowUrl: "img/end.png",
                            shadowSize:[0,0]
                        }
                    }
                },
                london: {
                    lat: $scope.message_detail.message['loc_end']['coordinates'][1],//51.505,
                    lng: $scope.message_detail.message['loc_end']['coordinates'][0],//-0.09,
                    zoom: 15
                },
            });
    });
})

.controller('NotificationCtrl', function($scope, $state, $stateParams,$ionicPopup, $rootScope, $http, leafletData, MobileMessage, MobileGetMyInvitations) {
    if(true) { ga_storage._trackPageview("Notification Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];


    MobileGetMyInvitations.query($scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.invitation_list = messages;
    });

    $scope.acceptInvitation = function(invitation_id,organization,accepted,declined){

        //alert($scope.data["id"])
        $scope.response = $http({
            method: 'GET',
            url: domain+'/app/user/invitations/response?email='+$scope.email+'&name='+$scope.name+'&logged_in='+$scope.logged_in+'&id='+invitation_id+'&organization='+organization+'&accepted='+accepted+'&declined='+declined,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
            //headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
        }).success(
            function(result){
                return result;
            }
        );

        //$scope.$emit('GetInvitedUsers.query');
    };

    // MobileMessage.query($scope.name,$scope.email,$scope.logged_in).then(function(messages){
    //     $scope.message_list = messages;
    // });
    // $rootScope.$on('Message.query', function(event) { $scope.message_list = MobileMessage.query()});

    // $scope.deliver = function(id,delivered){
    //     $scope.response = $http({
    //         method: 'GET',
    //         url: domain+'/app/messages/to/delivered?id='+id+'&delivered='+delivered+"&email="+$scope.email+"&name="+$scope.name+"&logged_in="+$scope.logged_in,
    //         headers: {'Content-Type':'application/json;charset=UTF-8'}
    //     }).success(
    //         function(result){
    //             return result;
    //         }
    //     );
    // }

})
.controller('ShareCtrl', function($scope, $state, $stateParams,$ionicPopup, $rootScope, $interval, leafletData, GetMobileAsset, MobileShareList) {
    if(true) { ga_storage._trackPageview("Share Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];
    window.plugins.SharedPrefs.getData(function(result){
        //$ionicPopup.alert({"title":"Could I retrieve the data? Ans:"+result});
        $scope.last_loc = result;
        console.log("Last Loc:"+$scope.last_loc);
        $scope.loc_saved = $scope.last_loc.split(",");
        $scope.coords = {lat:parseFloat($scope.loc_saved[0]), lon:parseFloat($scope.loc_saved[1])};
        $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
            $rootScope.$broadcast("loc.found",$scope.coords);
            $rootScope.$broadcast("loc.center",$scope.coords);
        });
        return result;
    },"","FinderPrefs","last_loc");

    navigator.geolocation.getCurrentPosition(function (data) {
        //$scope.loading.hide();
        $scope.coords = {lat:data.coords.latitude, lon:data.coords.longitude};
        $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
            $rootScope.$broadcast("loc.found",$scope.coords);
            $rootScope.$broadcast("loc.center",$scope.coords);
        });
    }, function (error) {

      // alert('Unable to get location: ' + error.message);
      $ionicPopup.alert({"title":'Unable to get location: ' + error.message});

    });    
    
    $scope.$on("loc.found",function(event,coords){
        $scope.coords = coords;
        $scope.markers["me"] = {
                    lat: $scope.coords.lat,
                    lng: $scope.coords.lon,
                    icon: {
                        iconUrl: "img/finder 50px.png",
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                        popupAnchor: [0, 0],
                        shadowUrl: "img/finder 50px.png",
                        shadowSize:[0,0]

                    }
                };

    });
    
    $scope.$on("loc.center",function(event,coords){
        $scope.coords = coords;

        angular.extend($scope, {
            london: {
                lat: $scope.coords.lat,
                lng: $scope.coords.lon,
                zoom: 15
            }
        });

    });

    angular.extend($scope, {
            london: {
                lat: 23,
                lng: 90,
                zoom: 4
            },
            geojson: {},
            markers: {},
            paths: {
                p1: {
                    color: '#996666',
                    weight: 1,
                    latlngs: [
                    ],
                }
            },
            layers: {
                baselayers: {
                    /*cloudmade2: {
                        name: 'Cloudmade',
                        type: 'xyz',
                        url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
                        layerParams: {
                            key: '007b9471b4c74da4a6ec7ff43552b16f',
                            styleId: 7
                        }
                    },*/
                    osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                    },
                    googleTerrain: {
                        name: 'Google Terrain',
                        layerType: 'TERRAIN',
                        type: 'google'
                    },
                    googleHybrid: {
                        name: 'Google Hybrid',
                        layerType: 'HYBRID',
                        type: 'google'
                    },
                    googleRoadmap: {
                        name: 'Google Streets',
                        layerType: 'ROADMAP',
                        type: 'google'
                    }
                }
            },
            defaults: {
                    //tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                    scrollWheelZoom: false,
            }
        });
    $scope.shares = [];

    getDetails = function(asset_id){
        console.log("Reached from Button");
        console.log(asset_id);
        $state.go("app.sharedetail",{ "assetId":asset_id});
    }
    $scope.$on("loc.center",function(event,coords){
        MobileShareList.query($scope.name,$scope.email,$scope.logged_in,$scope.coords.lat,$scope.coords.lon).then(function(messages){
            $scope.share_list = messages;

            for(var i=0;i<$scope.share_list.shared_list.length;i++){
                $scope.shares[i] = {
                    "type":"Point",
                    "coordinates":[eval($scope.share_list.shared_list[i].loc.coordinates)[0],eval($scope.share_list.shared_list[i].loc.coordinates)[1]]
                };
                $scope.share_list.shared_list[i]["loc"] = $scope.shares[i]; 
                if(((Math.abs($scope.share_list.shared_list[i]['loc']['coordinates'][1]-$scope.coords.lat)<2) && Math.abs($scope.share_list.shared_list[i]['loc']['coordinates'][0]-$scope.coords.lon)<2)) {
                    var aid = 0;
                    aid = $scope.share_list.shared_list[i]['_id'];

                    console.log("Asset Type:"+$scope.share_list.shared_list[i]['asset_type']);
                    $scope.share_icon = "img/hire.png";
                    if($scope.share_list.shared_list[i]['asset_type']=="human"){$scope.share_icon = "img/humanh.png";}
                    if($scope.share_list.shared_list[i]['asset_type']=="taxi"){$scope.share_icon = "img/taxih.png";}
                    if($scope.share_list.shared_list[i]['asset_type']=="car"){$scope.share_icon = "img/carh.png";}
                    if($scope.share_list.shared_list[i]['asset_type']=="cng"){$scope.share_icon = "img/cngh.png";}
                    if($scope.share_list.shared_list[i]['asset_type']=="elemu"){$scope.share_icon = "img/elemuh.png";}
                    if($scope.share_list.shared_list[i]['asset_type']=="bus"){$scope.share_icon = "img/bush.png";}
                    if($scope.share_list.shared_list[i]['asset_type']=="cvan"){$scope.share_icon = "img/cvanh.png";}
                    if($scope.share_list.shared_list[i]['asset_type']=="van"){$scope.share_icon = "img/microh.png";}
                    if($scope.share_list.shared_list[i]['asset_type']=="pickup"){$scope.share_icon = "img/pickuph.png";}
                    if($scope.share_list.shared_list[i]['asset_type']=="motorbike"){$scope.share_icon = "img/motorbikeh.png";}
                    if($scope.share_list.shared_list[i]['asset_type']=="cycle"){$scope.share_icon = "img/cycleh.png";}

                    $scope.markers[aid] = {
                                    lat: $scope.share_list.shared_list[i]['loc']['coordinates'][1],//51.505,
                                    lng: $scope.share_list.shared_list[i]['loc']['coordinates'][0],//-0.09,
                                    message:"<a class='button button-clear button-assertive' onclick='getDetails(\""+$scope.share_list.shared_list[i]['_id']+"\")'>View Details</a>",
                                    icon: {
                                        iconUrl: $scope.share_icon,
                                        iconSize: [40, 40],
                                        iconAnchor: [10, 10],
                                        popupAnchor: [0, 0],
                                        shadowUrl: "img/hire.png",
                                        shadowSize:[0,0]
                                    }
                                };

                }

            }
            
        });
    });
    var fbLoginSuccess = function (userData) {
        console.log("FB UserInfo: " + JSON.stringify(userData));
        $scope.response = userData;
    }
    $scope.postToFB = function(desc,ref){
        facebookConnectPlugin.login(["public_profile","email","user_friends"],
            fbLoginSuccess,
            function (error) { alert("" + error) }
        );
        facebookConnectPlugin.getLoginStatus(
            function (status) {
                console.log("current status: " + JSON.stringify(status));

                var options = { 
                    method:"share",
                    description:desc,
                    href: ref
                };
                // var options = { 
                //     method:"share_open_graph",
                //     action_properties: 'likes'
                // };
                facebookConnectPlugin.showDialog(options,
                    function (result) {
                        console.log("Posted. " + JSON.stringify(result));             },
                function (e) {
                    console.log("Failed: " + e);
                });
            }, function(e){
                $scope.connectFB();
            }
        );
    }

})

.controller('TrafficCtrl', function($scope,$state, $stateParams, $rootScope, $ionicPopup, $interval, $timeout, leafletData, GetMobileAsset, MobileTrafficList) {
    if(true) { ga_storage._trackPageview("Traffic Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];
    $scope.item = { text: "Start Tracking", checked: false };
    window.plugins.SharedPrefs.getData(function(result){

        $scope.save_result = result;
        if (result=="on") {
            $scope.locationService=true;
            $scope.item = { text: "Start Tracking", checked: true };
        }
        else {
            $scope.locationService=false;
            $scope.item = { text: "Start Tracking", checked: false };
        }
        return result;
    },"","FinderPrefs","location_service");

    $scope.doRefresh = function(){
        $state.go($state.current, {}, {reload: true});
        $scope.$broadcast('scroll.refreshComplete');
    }
    $scope.saveChange = function(item){
        //$scope.item_name = item_name;
        //$scope.item_checked = item_checked;
        
        if (item["checked"]) {
            window.plugins.SharedPrefs.saveData(function(result){
                $scope.save_result = result;
                $scope.locationService = true;
                console.log("Saving Location Tracking");
                //$scope.$broadcast('updateTrackingStatus',"on");
                return result;
            },"","FinderPrefs","location_service","on");
        }
        else {
            window.plugins.SharedPrefs.saveData(function(result){
                $scope.save_result = result;
                $scope.locationService = false;
                console.log("Saving Location Tracking");
                //$scope.$broadcast('updateTrackingStatus',"off");
                return result;
            },"","FinderPrefs","location_service","off");
        }
    }

    $scope.showPopup = function() {
        $scope.data = {}

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<label>Contribute to the Traffic Congestion Data to give better results for viewing traffic congestion. Bring in more friends to get even better results by building the community.</label><br /><ion-checkbox ng-model="item.checked" ng-checked="item.checked">{[{ item.text }]}</ion-checkbox>',
            title: 'Start Tracking Mode to view Traffic Congestion',
            subTitle: 'Contribute Tracking Data for a better view of traffic jam',
            scope: $scope,
            buttons: [
                { 
                    text: 'Cancel', 
                    onTap: function(e) {
                        if (!$scope.item.checked) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                            $state.go('app.setup');
                        } else {
                            return $scope.item.checked;
                        }
                    }
                },
                {
                    text: '<b>Start</b>',
                    type: 'button-assertive',
                    onTap: function(e) {
                        $scope.saveChange($scope.item);
                        if (!$scope.item.checked) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            return $scope.item.checked;
                        }
                    }
                },
            ]
        });
        myPopup.then(function(res) {
            console.log('Tapped!', res);
        });
        // $timeout(function() {
        //     myPopup.close(); //close the popup after 3 seconds for some reason
        //     //$state.go('app.setup');             
        // }, 5000);
    };
    if($scope.item.checked==false){
        $scope.showPopup();
    }
    window.plugins.SharedPrefs.getData(function(result){
        //$ionicPopup.alert({"title":"Could I retrieve the data? Ans:"+result});
        $scope.last_loc = result;
        console.log("Last Loc:"+$scope.last_loc);
        $scope.loc_saved = $scope.last_loc.split(",");
        $scope.coords = {lat:parseFloat($scope.loc_saved[0]), lon:parseFloat($scope.loc_saved[1])};
        $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
            $rootScope.$broadcast("loc.found",$scope.coords);
            $rootScope.$broadcast("loc.center",$scope.coords);
        });
        return result;
    },"","FinderPrefs","last_loc");

    navigator.geolocation.getCurrentPosition(function (data) {
        //$scope.loading.hide();
        $scope.coords = {lat:data.coords.latitude, lon:data.coords.longitude};
        $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
            $rootScope.$broadcast("loc.found",$scope.coords);
            $rootScope.$broadcast("loc.center",$scope.coords);
        });
    }, function (error) {
      // alert('Unable to get location: ' + error.message);
      $ionicPopup.alert({"title":'Unable to get location: ' + error.message});
    });    
    
    $scope.$on("loc.found",function(event,coords){
        $scope.coords = coords;
        $scope.markers["me"] = {
                    lat: $scope.coords.lat,
                    lng: $scope.coords.lon,
                    icon: {
                        iconUrl: "img/finder 50px.png",
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                        popupAnchor: [0, 0],
                        shadowUrl: "img/finder 50px.png",
                        shadowSize:[0,0]

                    }
                };

    });
    
    $scope.$on("loc.center",function(event,coords){
        $scope.coords = coords;

        angular.extend($scope, {
            london: {
                lat: $scope.coords.lat,
                lng: $scope.coords.lon,
                zoom: 15
            }
        });

    });

    angular.extend($scope, {
            london: {
                lat: 23,
                lng: 90,
                zoom: 4
            },
            geojson: {},
            markers: {},
            paths: {
                p1: {
                    color: '#996666',
                    weight: 1,
                    latlngs: [
                    ],
                }
            },
            layers: {
                baselayers: {
                    /*cloudmade2: {
                        name: 'Cloudmade',
                        type: 'xyz',
                        url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
                        layerParams: {
                            key: '007b9471b4c74da4a6ec7ff43552b16f',
                            styleId: 7
                        }
                    },*/
                    osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                    },
                    googleTerrain: {
                        name: 'Google Terrain',
                        layerType: 'TERRAIN',
                        type: 'google'
                    },
                    googleHybrid: {
                        name: 'Google Hybrid',
                        layerType: 'HYBRID',
                        type: 'google'
                    },
                    googleRoadmap: {
                        name: 'Google Streets',
                        layerType: 'ROADMAP',
                        type: 'google'
                    }
                }
            },
            defaults: {
                    //tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                    scrollWheelZoom: false,
            }
        });
    $scope.shares = [];
    $scope.$on("loc.center",function(event,coords){
        MobileTrafficList.query($scope.name,$scope.email,$scope.logged_in,$scope.coords.lat,$scope.coords.lon).then(function(messages){
            $scope.share_list = messages;

            for(var i=0;i<$scope.share_list.shared_list.length;i++){
                // alert(eval($scope.share_list.shared_list[i].loc.coordinates)[0]+" and "+eval(scope.share_list.shared_list[i].loc.coordinates)[1]);
                // $ionicPopup.alert({"title":eval($scope.share_list.shared_list[i].loc.coordinates)[0]+" and "+eval(scope.share_list.shared_list[i].loc.coordinates)[1]});
                $scope.shares[i] = {
                    "type":"Point",
                    "coordinates":[eval($scope.share_list.shared_list[i].loc.coordinates)[0],eval($scope.share_list.shared_list[i].loc.coordinates)[1]]
                };
                $scope.share_list.shared_list[i]["loc"] = $scope.shares[i]; 
                if(((Math.abs($scope.share_list.shared_list[i]['loc']['coordinates'][1]-$scope.coords.lat)<2) && 
                    Math.abs($scope.share_list.shared_list[i]['loc']['coordinates'][0]-$scope.coords.lon)<2)&&
                    (parseFloat($scope.share_list.shared_list[i]["speed"])>=5)&&
                    (parseFloat($scope.share_list.shared_list[i]["speed"])<30)) {
                    $scope.markers[$scope.share_list.shared_list[i]["_id"]] = {
                                    lat: $scope.share_list.shared_list[i]['loc']['coordinates'][1],//51.505,
                                    lng: $scope.share_list.shared_list[i]['loc']['coordinates'][0],//-0.09,
                                    //message:"<h4>"+$scope.asset_details['asset_detail']['name']+"</h4>"+"<h4>Speed:"+$scope.asset_details['last_data']['speed']+"kmph</h4><h4>Time:"+new Date($scope.asset_details['last_data']['time']['$date'])+"</h4>",
                                    icon: {
                                        iconUrl: "img/jam.png",
                                        iconSize: [50, 50],
                                        iconAnchor: [10, 10],
                                        popupAnchor: [0, 0],
                                        shadowUrl: "img/jam.png",
                                        shadowSize:[0,0]
                                    }
                                };
                }
                if(((Math.abs($scope.share_list.shared_list[i]['loc']['coordinates'][1]-$scope.coords.lat)<2) && 
                    Math.abs($scope.share_list.shared_list[i]['loc']['coordinates'][0]-$scope.coords.lon)<2)&&
                    (parseFloat($scope.share_list.shared_list[i]["speed"])>=30)) {
                    $scope.markers[$scope.share_list.shared_list[i]["_id"]] = {
                                    lat: $scope.share_list.shared_list[i]['loc']['coordinates'][1],//51.505,
                                    lng: $scope.share_list.shared_list[i]['loc']['coordinates'][0],//-0.09,
                                    //message:"<h4>"+$scope.asset_details['asset_detail']['name']+"</h4>"+"<h4>Speed:"+$scope.asset_details['last_data']['speed']+"kmph</h4><h4>Time:"+new Date($scope.asset_details['last_data']['time']['$date'])+"</h4>",
                                    icon: {
                                        iconUrl: "img/free.png",
                                        iconSize: [50, 50],
                                        iconAnchor: [10, 10],
                                        popupAnchor: [0, 0],
                                        shadowUrl: "img/free.png",
                                        shadowSize:[0,0]
                                    }
                                };
                }
            }
            
        });
    });
    var fbLoginSuccess = function (userData) {
        console.log("FB UserInfo: " + JSON.stringify(userData));
        $scope.response = userData;
    }
    $scope.postToFB = function(desc,ref){
        facebookConnectPlugin.login(["public_profile","email","user_friends"],
            fbLoginSuccess,
            function (error) { alert("" + error) }
        );
        facebookConnectPlugin.getLoginStatus(
            function (status) {
                console.log("current status: " + JSON.stringify(status));

                var options = { 
                    method:"share",
                    description:desc,
                    href: ref
                };
                // var options = { 
                //     method:"share_open_graph",
                //     action_properties: 'likes'
                // };
                facebookConnectPlugin.showDialog(options,
                    function (result) {
                        console.log("Posted. " + JSON.stringify(result));             },
                function (e) {
                    console.log("Failed: " + e);
                });
            }, function(e){
                $scope.connectFB();
            }
        );
    }
})

.controller('EventCtrl', function($scope, $state,$stateParams,$ionicPopup, $rootScope, $interval, leafletData, AddLocEvent,AddLocation) {
    if(true) { ga_storage._trackPageview("Event Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];

    $scope.addLocEvent = function(type){
        console.log(type+","+$scope.coords.lat+","+$scope.coords.lon);
        console.log($scope.markers["me"]["lat"],$scope.markers["me"]["lng"]);
        AddLocEvent.set($scope.name,$scope.email,$scope.logged_in,type,$scope.markers["me"]["lat"],$scope.markers["me"]["lng"]).then(function(messages) {
                // alert("Done");
                // $ionicPopup.alert({"title":'Done'});
                if(type=="rw") $scope.eventtype = "Roadwork";
                if(type=="mg") $scope.eventtype = "Mugging";
                if(type=="rl") $scope.eventtype = "Rally";
                if(type=="cl") $scope.eventtype = "Celebration";
                if(type=="ac") $scope.eventtype = "Accident";
                if(type=="jm") $scope.eventtype = "Traffic Jam";
                $scope.showConfirm("Done",$scope.eventtype);
            });
    }

    $scope.addLocation = function(locname){
        console.log(locname+","+$scope.coords.lat+","+$scope.coords.lon);
        AddLocation.set($scope.name,$scope.email,$scope.logged_in,locname,$scope.markers["me"]["lat"],$scope.markers["me"]["lng"]).then(function(messages) {
                // alert("Done");
                $ionicPopup.alert({"title":'Done'});
            });
    }

    window.plugins.SharedPrefs.getData(function(result){
        //$ionicPopup.alert({"title":"Could I retrieve the data? Ans:"+result});
        $scope.last_loc = result;
        console.log("Last Loc:"+$scope.last_loc);
        $scope.loc_saved = $scope.last_loc.split(",");
        $scope.coords = {lat:parseFloat($scope.loc_saved[0]), lon:parseFloat($scope.loc_saved[1])};
        
        $scope.$watch($scope.loc_saved,function(newValue,oldValue,$scope){
            $rootScope.$broadcast("loc.found",{lat:parseFloat($scope.loc_saved[0]), lon:parseFloat($scope.loc_saved[1])});
            $rootScope.$broadcast("loc.center",{lat:parseFloat($scope.loc_saved[0]), lon:parseFloat($scope.loc_saved[1])});
        });
        return result;
    },"","FinderPrefs","last_loc");
    navigator.geolocation.getCurrentPosition(function (data) {
        //$scope.loading.hide();
        $scope.coords = {lat:data.coords.latitude, lon:data.coords.longitude};
        console.log("Internal Web Loc:"+JSON.stringify($scope.coords));
        $scope.$watch($scope.coords,function(newValue,oldValue,$scope){
            $rootScope.$broadcast("loc.found",{lat:data.coords.latitude, lon:data.coords.longitude});
            $rootScope.$broadcast("loc.center",{lat:data.coords.latitude, lon:data.coords.longitude});
        });
    }, function (error) {
      // alert('Unable to get location: ' + error.message);
        $ionicPopup.alert({"title":'Unable to get location: ' + error.message + '. Taking location from history if available.'});

    });    
    
    $scope.$on("loc.found",function(event,coords){
        console.log("Location Found");
        $scope.coords = coords;
        $scope.markers["me"] = {
                    lat: coords.lat,
                    lng: coords.lon,
                    icon: {
                        iconUrl: "img/finder 50px.png",
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                        popupAnchor: [0, 0],
                        shadowUrl: "img/finder 50px.png",
                        shadowSize:[0,0]

                    },
                    message: "Drag me to your event location",
                    draggable: true
                };
        $scope.$watch($scope.markers.me,function(newValue,oldValue,$scope){
            $rootScope.$broadcast("loc.changed",$scope.markers.me);
        });

    });
    // $scope.$watch($scope.markers.me,function(newValue,oldValue,$scope){
    //     $rootScope.$broadcast("loc.changed",$scope.markers.me);
    // });
    $scope.$on("loc.changed",function(event,coords){
        $scope.coords = {lat:coords.lat, lon:coords.lng};
    });
    $scope.$on("loc.center",function(event,coords){
        coords;

        angular.extend($scope, {
            london: {
                lat: coords.lat,
                lng: coords.lon,
                zoom: 15
            }
        });

    });

    angular.extend($scope, {
            london: {
                lat: 23,
                lng: 90,
                zoom: 4
            },
            geojson: {},
            markers: {},
            paths: {
                p1: {
                    color: '#996666',
                    weight: 1,
                    latlngs: [
                    ],
                }
            },
            layers: {
                baselayers: {
                    /*cloudmade2: {
                        name: 'Cloudmade',
                        type: 'xyz',
                        url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
                        layerParams: {
                            key: '007b9471b4c74da4a6ec7ff43552b16f',
                            styleId: 7
                        }
                    },*/
                    osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz'
                    },
                    googleTerrain: {
                        name: 'Google Terrain',
                        layerType: 'TERRAIN',
                        type: 'google'
                    },
                    googleHybrid: {
                        name: 'Google Hybrid',
                        layerType: 'HYBRID',
                        type: 'google'
                    },
                    googleRoadmap: {
                        name: 'Google Streets',
                        layerType: 'ROADMAP',
                        type: 'google'
                    }
                }
            },
            defaults: {
                    //tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                    scrollWheelZoom: false,
            }
        });
    var fbLoginSuccess = function (userData) {
        console.log("FB UserInfo: " + JSON.stringify(userData));
        $scope.response = userData;
    }
    $scope.postToFB = function(desc,ref){
        facebookConnectPlugin.login(["public_profile","email","user_friends"],
            fbLoginSuccess,
            function (error) { alert("" + error) }
        );
        facebookConnectPlugin.getLoginStatus(
            function (status) {
                console.log("current status: " + JSON.stringify(status));

                var options = { 
                    method:"share",
                    description:desc,
                    href: ref
                };
                // var options = { 
                //     method:"share_open_graph",
                //     action_properties: 'likes'
                // };
                facebookConnectPlugin.showDialog(options,
                    function (result) {
                        console.log("Posted. " + JSON.stringify(result));             },
                function (e) {
                    console.log("Failed: " + e);
                });
            }, function(e){
                $scope.connectFB();
            }
        );
    }
    $scope.showConfirm = function(msg,evt) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Post on Facebook?',
            template: '<label style="color:black">'+msg+' posting the '+evt+'. Posting on Facebook will alert others regarding the '+evt+'. Would you like to post on Facebook?</label>'
        });
        confirmPopup.then(function(res) {
            if(res) {
                $scope.postToFB("I just found a "+evt+" going on and posted it on FinderGPSTracking. "+ 
                    "For Vehicle Tracking, Personal Tracking, Updates about the Road Conditions,"+
                    " Or Finding a Hire, use the FinderGPSTracking App on Google PlayStore."+
                    " Try it out with your GPS Location turned ON.","https://www.facebook.com/finder.vehicle.tracking");
                console.log('You are sure');
            } else {
               console.log('You are not sure');
            }
        });
    };
})

.controller('InvitationCtrl', function($scope, $state, $stateParams,$ionicPopup, $rootScope, $http, leafletData, MobileGetMyInvitations, ContactManager,MobileInviteUsers) {
    if(true) { ga_storage._trackPageview("Invitation Controller"); }
    $scope.logged_in = window.localStorage['gmailLogin']||null;
    $scope.name = window.localStorage['gmailName'];
    $scope.email = window.localStorage['gmailEmail'];

    // document.addEventListener("deviceready", onDeviceReady, false);
    console.log("After addEventListener");    

    $scope.contacts = [];
    $scope.name = "";
    // ContactManager.query().then(function(_result){
    //     $scope.contacts = _result;
    // }, function(_error){
    //     console.log(JSON.stringify(_error));
    // });
    $scope.last_access_time = new Date("1970-01-01");
    $scope.next_is_true = true;
    $scope.prev_is_true = false;
    $scope.startIndex = 1;
    $scope.number_per_page = 300;
    $scope.qdata = "";
    var qdata = "";

    $scope.init_specs = function(qdata){
        $scope.next_is_true = true;
        $scope.prev_is_true = false;
        $scope.startIndex = 1;
        //$scope.qdata = qdata;
        window.localStorage['qdata'] = qdata;
    }
    $scope.call_google = function(){
        // window.localStorage['qdata'] = $scope.qdata;
        if((new Date()-$scope.last_access_time)>3600*1000) {
            googleapi.authorize({
            client_id: '817013901832-k9l3p8vt3qiscb2uhfqfc9oev7s6mj67.apps.googleusercontent.com',
            client_secret: 'xofXKuysOMoZzUQith8loj7b',
            redirect_uri: 'http://localhost',
            //scope: 'https://www.googleapis.com/auth/plus.login https://www.google.com/m8/feeds'
            scope: 'https://www.google.com/m8/feeds'
            }).done(function(data) {
                accessTokenContact=data.access_token;
                refreshTokenContact=data.refresh_token;
                $scope.qdata = window.localStorage['qdata'];
                // $loginStatus.html('Access Token: ' + data.access_token);
                console.log("Access Token against call_google: "+data.access_token);
                console.log("Refresh Token against call_google: "+data.refresh_token);
                console.log("Access Token Expires in: "+data.expires_in);
                console.log("Query: "+$scope.qdata);
                $scope.last_access_time = new Date();
                //$ionicPopup.alert({"title":JSON.stringify(data)});
                
                ContactManager.query(accessTokenContact,$scope.startIndex,$scope.number_per_page,window.localStorage['qdata']).then(function(_result){
                    $scope.contacts = _result;
                    for(var c=0;c<$scope.contacts.feed.entry.length;c++){
                        $scope.contacts.feed.entry[c].checked = false;
                    }
                    console.log("Contacts:"+JSON.stringify(_result.feed.entry));
                }, function(_error){
                    console.log(JSON.stringify(_error));
                });
                //$scope.getContactData();
            });
        }
        else {
            $scope.qdata = window.localStorage['qdata'];
            console.log("Query: "+$scope.qdata);
            console.log("Query: "+qdata);
            ContactManager.query(accessTokenContact,$scope.startIndex,$scope.number_per_page,window.localStorage['qdata']).then(function(_result){
                $scope.contacts = _result;
                for(var c=0;c<$scope.contacts.feed.entry.length;c++){
                    $scope.contacts.feed.entry[c].checked = false;
                }
                console.log("Contacts:"+JSON.stringify(_result.feed.entry));
            }, function(_error){
                console.log(JSON.stringify(_error));
            });
        }

    };

    $scope.next_google = function(){
        $scope.startIndex = $scope.startIndex + $scope.number_per_page;
        if ($scope.startIndex>1) {$scope.prev_is_true = true;}
        else {$scope.prev_is_true = false;}
        // window.localStorage['qdata'] = $scope.qdata;
        if((new Date()-$scope.last_access_time)>3600*1000) {
            googleapi.authorize({
            client_id: '817013901832-k9l3p8vt3qiscb2uhfqfc9oev7s6mj67.apps.googleusercontent.com',
            client_secret: 'xofXKuysOMoZzUQith8loj7b',
            redirect_uri: 'http://localhost',
            //scope: 'https://www.googleapis.com/auth/plus.login https://www.google.com/m8/feeds'
            scope: 'https://www.google.com/m8/feeds'
            }).done(function(data) {
                accessTokenContact=data.access_token;
                refreshTokenContact=data.refresh_token;
                $scope.qdata = window.localStorage['qdata'];
                // $loginStatus.html('Access Token: ' + data.access_token);
                console.log("Access Token against call_google: "+data.access_token);
                console.log("Refresh Token against call_google: "+data.refresh_token);
                console.log("Access Token Expires in: "+data.expires_in);
                console.log("Query: "+$scope.qdata);
                
                $scope.last_access_time = new Date();
                //$ionicPopup.alert({"title":JSON.stringify(data)});
                
                ContactManager.query(accessTokenContact,$scope.startIndex,$scope.number_per_page,window.localStorage['qdata']).then(function(_result){
                    $scope.contacts = _result;
                    for(var c=0;c<$scope.contacts.feed.entry.length;c++){
                        $scope.contacts.feed.entry[c].checked = false;
                    }
                    console.log("Contacts:"+JSON.stringify(_result.feed.entry));
                }, function(_error){
                    console.log(JSON.stringify(_error));
                });
                //$scope.getContactData();
            });
        }
        else {
            $scope.qdata = window.localStorage['qdata'];
            console.log("Query: "+$scope.qdata);
            
            ContactManager.query(accessTokenContact,$scope.startIndex,$scope.number_per_page,window.localStorage['qdata']).then(function(_result){
                $scope.contacts = _result;
                for(var c=0;c<$scope.contacts.feed.entry.length;c++){
                    $scope.contacts.feed.entry[c].checked = false;
                }
                console.log("Contacts:"+JSON.stringify(_result.feed.entry));
            }, function(_error){
                console.log(JSON.stringify(_error));
            });
        }
    }
    $scope.prev_google = function(){
        $scope.startIndex = $scope.startIndex - $scope.number_per_page;
        if ($scope.startIndex>1) {$scope.prev_is_true = true;}
        else {$scope.prev_is_true = false;}
        // window.localStorage['qdata'] = $scope.qdata;
        if((new Date()-$scope.last_access_time)>3600*1000) {
            googleapi.authorize({
            client_id: '817013901832-k9l3p8vt3qiscb2uhfqfc9oev7s6mj67.apps.googleusercontent.com',
            client_secret: 'xofXKuysOMoZzUQith8loj7b',
            redirect_uri: 'http://localhost',
            //scope: 'https://www.googleapis.com/auth/plus.login https://www.google.com/m8/feeds'
            scope: 'https://www.google.com/m8/feeds'
            }).done(function(data) {
                accessTokenContact=data.access_token;
                refreshTokenContact=data.refresh_token;
                $scope.qdata = window.localStorage['qdata'];
                // $loginStatus.html('Access Token: ' + data.access_token);
                console.log("Access Token against call_google: "+data.access_token);
                console.log("Refresh Token against call_google: "+data.refresh_token);
                console.log("Access Token Expires in: "+data.expires_in);
                console.log("Query: "+$scope.qdata);
                
                $scope.last_access_time = new Date();
                //$ionicPopup.alert({"title":JSON.stringify(data)});
                
                ContactManager.query(accessTokenContact,$scope.startIndex,$scope.number_per_page,window.localStorage['qdata']).then(function(_result){
                    $scope.contacts = _result;
                    for(var c=0;c<$scope.contacts.feed.entry.length;c++){
                        $scope.contacts.feed.entry[c].checked = false;
                    }
                    console.log("Contacts:"+JSON.stringify(_result.feed.entry));
                }, function(_error){
                    console.log(JSON.stringify(_error));
                });
                //$scope.getContactData();
            });
        }
        else {
            $scope.qdata = window.localStorage['qdata'];
            console.log("Query: "+$scope.qdata);
            
            ContactManager.query(accessTokenContact,$scope.startIndex,$scope.number_per_page,window.localStorage['qdata']).then(function(_result){
                $scope.contacts = _result;
                for(var c=0;c<$scope.contacts.feed.entry.length;c++){
                    $scope.contacts.feed.entry[c].checked = false;
                }
                console.log("Contacts:"+JSON.stringify(_result.feed.entry));
            }, function(_error){
                console.log(JSON.stringify(_error));
            });
        }
    }

    $scope.invite_user = [];
    $scope.add_users_to_list = function(){
        // Do something
    }
    $scope.invite_users = function(){
        // Do something
        console.log("clicked");
        for(var c=0;c<$scope.contacts.feed.entry.length;c++){
            // console.log(c+": clicked "+$scope.contacts.feed.entry[c]["checked"]);
            if($scope.contacts.feed.entry[c]["checked"]) {
                console.log("NAME:"+$scope.contacts.feed.entry[c]["title"]["$t"]);
                console.log("Mail:"+JSON.stringify($scope.contacts.feed.entry[c]["gd$email"]));
                for(var j=0;j<$scope.contacts.feed.entry[c]["gd$email"].length;j++){
                    $scope.invite_user.push($scope.contacts.feed.entry[c]["gd$email"][j]["address"]);
                }
            }
        }
        console.log("clicked emails:"+$scope.invite_user);
        MobileInviteUsers.query($scope.name,$scope.email,$scope.logged_in,$scope.invite_user).then(function(messages){
            //alert("Done:"+messages);
            $ionicPopup.alert({"title":messages["message"]});

        });
    }
    $scope.getContactData = function(){
        var term=null;
        console.log("Inside getContactData");
        //  alert("getting user data="+accessToken);
        $.ajax({
               url:'https://www.google.com/m8/feeds/contacts/default/full?alt=json&access_token='+accessTokenContact,
               type:'GET',
               data:term,
               dataType:'json',
                error:function(jqXHR,text_status,strError){
                    console.log("Error is:"+strError);
                },
                success:function(data)
                {
                    var item;
                    console.log("Got Data"+JSON.stringify(data));
                    $scope.contacts = data;
                   
                }
            });
    };

    // $scope.contacts = ContactManager.getContacts($scope.name).then(function(_result){
    //     $scope.contacts = _result;
    // }, function(_error){
    //     console.log(_error);
    // });
    
        
    // ionic.Platform.ready(function(){
    //     console.log("Cordova is ready, let's do this!");

    // });
    // $scope.filterContacts = function(){
    //     $scope.contacts = ContactManager.getContacts($scope.name).then(function(_result){
    //         console.log("Inside the Service Call");
    //         $scope.contacts = _result;
    //     }, function(_error){
    //         console.log(_error);
    //     }); 

    // }
    // $scope.createContact = function(){
    //     var myContact = navigator.contacts.create({"name": "Halloooa","displayName": "Halloooa"});
    //     console.log("Halloooa created");
    // }

    // function onSuccess(contacts) {
    //     $scope.contacts = contacts;
    //     $scope.test = contacts.length;
    //     console.log("INSIDE SUCCESS");
    //     for (var i=0; i<contacts.length; i++) {
            
    //         console.log("DisplayName: " + contacts[i].displayName);
    //          // for (var j=0; j<contacts[i].email.length; j++) {
    //          //                     console.log("Email Value: "  + contacts[i].email[j].value);
    //          // }    
    //     }

    // };
    // function onError(contactError) {
    //     console.log("####################Inside onError Function####################");
        
    //     alert('onError');
    // };    

    // function onDeviceReady() {
    //     console.log("onDeviceReady");
    //     var options = new ContactFindOptions();
    //     options.filter=""; 
    //     options.multiple=true;
    //     var filter = ["*"];
    //     navigator.contacts.find(filter, onSuccess, onError, options);
    //     console.log("After calling navigator.contacts");
    // }
    MobileGetMyInvitations.query($scope.name,$scope.email,$scope.logged_in).then(function(messages){
        $scope.invitation_list = messages;
    });

    $scope.$on('invitations.query',function(event){
        MobileGetMyInvitations.query($scope.name,$scope.email,$scope.logged_in).then(function(messages){
            $scope.invitation_list = messages;
        });
    });
    $scope.accept = function(id,organization,accepted,declined){
        $scope.response = $http({
            method: 'GET',
            url: domain+'/app/user/invitations/response?id='+id+'&organization='+organization+'&declined='+declined+'&accepted='+accepted+"&email="+$scope.email+"&name="+$scope.name+"&logged_in="+$scope.logged_in,
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(
            function(result){
                $scope.$broadcast('invitations.query');
                return result;
            }
        );
    }
})