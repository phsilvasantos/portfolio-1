angular.module('cleverbaby.data')
    .factory('ActivityService',  ['network', '$localStorage', '$q', '$window', '$sce', function(network, $localStorage, $q, $window, $sce){

        function generetaeUniqueKey(){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 5; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }

        function generateUniqueId(id){
            return id + '-' + new Date().getTime() + '-' + generetaeUniqueKey();
        }

        function filter(data){
            var newData;
            if(data.type == "diaper"){
                newData = {
                    comment: data.comment,
                    time: data.time,
                    diaper_type: data.diaper_type,
                    diaper_color: data.diaper_color,
                    diaper_texture: data.diaper_texture,
                    diaper_amount: data.diaper_amount,
                    diaper_brand: data.diaper_brand,
                    diaper_leaked: data.diaper_leaked,
                    type: "diaper"
                }
            }
            if(data.type == "pump"){
                newData = {
                    note: data.note,
                    time: data.time,
                    pump_side: data.pump_side,
                    pump_amount: data.pump_amount,
                    pump_startside: data.pump_startside,
                    pump_bottlelabel: data.pump_bottlelabel,
                    type: "pump"
                }
            }
            if(data.type == "play"){
                newData = {
                    comment: data.note,
                    time: data.time,
                    play_comment: data.play_comment,
                    play_location: data.play_location,
                    type: "play"
                }
            }
            if(data.type == "diary"){
                newData = {
                    note: data.note,
                    time: data.time,
                    diary_desc: data.diary_desc,
                    type: "diary"
                }
            }
            if(data.type == "vaccination"){
                newData = {
                    note: data.note,
                    time: data.time,
                    vaccination_type: data.vaccination_type,
                    type: "vaccination"
                }
            }
            if(data.type == "growth"){
                newData = {
                    note: data.note,
                    time: data.time,
                    growth_height: data.growth_height,
                    growth_weight: data.growth_weight,
                    growth_headsize: data.growth_headsize,
                    growth_weight_unit: data.growth_weight_unit,
                    growth_height_unit: data.growth_height_unit,
                    growth_headsize_unit: data.growth_headsize_unit,
                    type: "growth"
                }
            }
            if(data.type == "milestone"){
                newData = {
                    comment: data.comment,
                    time: data.time,
                    milestone_type: data.milestone_type,
                    type: "milestone"
                }
            }
            if(data.type == "sick"){
                newData = {
                    note: data.note,
                    time: data.time,
                    sick_symptom: data.sick_symptom,
                    type: "sick"
                }
            }
            if(data.type == "doctor"){
                newData = {
                    note: data.note,
                    time: data.time,
                    doctor_type: data.doctor_type,
                    doctor_name: data.doctor_name || "No Doctor",
                    type: "doctor"
                }
            }
            if(data.type == "bath"){
                newData = {
                    note: data.note,
                    time: data.time,
                    bath_comment: data.bath_comment,
                    bath_temp: data.bath_temp,
                    type: "bath"
                }
            }
            if(data.type == "medication"){
                newData = {
                    note: data.note,
                    time: data.time,
                    medication_drug: data.medication_drug,
                    medication_drugdesc: data.medication_drugdesc,
                    medication_amountgiven: data.medication_amountgiven,
                    medication_prescriptionamount: data.medication_prescriptionamount,
                    medication_prescriptionunit: data.medication_prescriptionunit,
                    medication_prescriptioninterval: data.medication_prescriptioninterval,
                    type: "medication"
                }
            }
            if(data.type == "temperature"){
                newData = {
                    note: data.note,
                    time: data.time,
                    temperature_reminder: data.temperature_reminder,
                    temperature_temp: data.temperature_temp,
                    type: "temperature"
                }
            }
            if(data.type == "mood"){
                newData = {
                    note: data.note,
                    time: data.time,
                    mood_type: data.mood_type,
                    type: "mood"
                }
            }
            if(data.type == "bottle"){
                newData = {
                    note: data.note,
                    time: data.time,
                    bottle_type: data.bottle_type,
                    bottle_amount: data.bottle_amount,
                    bottle_amount_unit: data.bottle_amount_unit,
                    bottle_comment: data.bottle_comment,
                    type: "bottle"
                }
            }
            if(data.type == "todo"){
                newData = {
                    note: data.note,
                    time: data.time,
                    todo_desc: data.todo_desc,
                    type: "todo"
                }
            }
            if(data.type == "nurse"){
                newData = {
                    note: data.note,
                    time: data.time,
                    nurse_timeleft: data.nurse_timeleft,
                    nurse_timeright: data.nurse_timeright,
                    nurse_timeboth: data.nurse_timeboth,
                    nurse_comment: data.nurse_comment,
                    type: "nurse"
                }
            }
            if(data.type == "sleep"){
                newData = {
                    note: data.note,
                    time: data.time,
                    sleep_location: data.sleep_location,
                    sleep_timeend: data.sleep_timeend,
                    sleep_comment: data.sleep_comment,
                    type: "sleep"
                }
            }
            if(data.type == "solid") {
                newData = {
                    note: data.note,
                    time: data.time,
                    solid_foodtype: data.solid_foodtype,
                    type: "solid"
                }
            }
            if(data.type == "allergy"){
                newData = {
                    note: data.note,
                    time: data.time,
                    allergy_source: data.allergy_source,
                    allergy_reaction: data.allergy_reaction,
                    allergy_severity: data.allergy_severity,
                    type: "allergy"
                }
            }
            if(data.type == "moment"){
                newData = {
                    note: data.note,
                    time: data.time,
                    moment_desc: data.moment_desc,
                    moment_daily: data.moment_daily,
                    type: "moment"
                }
            }
            return newData;
        }



        function handleFile(activityUUID, image){
            return $q(function(resolve, reject){
                if(image.imageType == 'new'){
                    $window.resolveLocalFileSystemURL(image.displayImage, function(fileEntry){
                        $window.resolveLocalFileSystemURL(cordova.file.dataDirectory+'/activities', function(dirEntry){
                            fileEntry.moveTo(dirEntry, image.uuid, function(newFileEntry){
                                image.displayImage = $sce.trustAsResourceUrl(newFileEntry.nativeURL) + '?'+Math.random();
                                delete image.imageType;
                                network.upload('/activities/'+ activityUUID + '/media', newFileEntry.nativeURL, generateUniqueId($localStorage.user.id));
                                resolve(image);
                            }, function(err){
                                reject(err);
                            });

                        }, function(err){
                            reject(err);
                        });
                    }, function(err){
                        reject(err);
                    });
                } else{
                    resolve();
                }
            });
        }


        return {
            addActivity: function(data, babies){
                return $q(function(resolve, reject){

                    var medias = data.media;
                    data = filter(data);
                    data.uuid = generateUniqueId($localStorage.user.id);
                    data.babies = babies;

                    network.post({
                        data: data,
                        url: '/activities'
                    });

                    var promises = [];

                    medias.filter(function(x){
                        return x.imageType == 'new';
                    });

                    medias.forEach(function(media){
                        media.uuid = generateUniqueId($localStorage.user.id);
                    });

                    $q.all(medias.map(function(media){
                        return handleFile(data.uuid, media);
                    })).then(function(){
                        data.media = medias;

                        for(var i=0; i<$localStorage.activities[data.babies].length; ++i){
                            if(data.time>$localStorage.activities[data.babies][i].time){
                                break;
                            }
                        }

                        var middle = [];
                        Array.prototype.push.apply(middle, $localStorage.activities[data.babies].slice(0, i));
                        middle.push(data);
                        Array.prototype.push.apply(middle, $localStorage.activities[data.babies].slice(i, $localStorage.activities[data.babies].length));
                        $localStorage.activities[data.babies] = middle;

                        resolve(data);
                    })
                });
            },
            deleteActivity: function (uuid, data, babies) {
                return $q(function(resolve, reject) {
                    var medias = data.media;

                    data = filter(data);
                    data.uuid = uuid;
                    data.babies = babies;

                    network.remove({
                        data: data,
                        url: '/activities/'+uuid
                    });

                    var index = -1;
                    for(var i=0; i < $localStorage.activities[data.babies].length; ++i){
                        if($localStorage.activities[data.babies][i].uuid == data.uuid){
                            index = i;
                            break;
                        }
                    }

                    if(index > 0) {
                        $localStorage.activities[data.babies].splice(index, 1);
                    }
                    resolve(data);
                });
            },
            editActivity: function(uuid, data, babies){
                return $q(function(resolve, reject){

                    var medias = data.media;
                    console.log('middel', data);
                    data = filter(data);
                    data.uuid = uuid;
                    data.babies = babies;
                    console.log('middel', data);
                    network.put({
                        data: data,
                        url: '/activities/'+uuid
                    });


                    var promises = [];

                    medias.forEach(function(media){
                        if(media.imageType == 'new')
                            media.uuid = generateUniqueId($localStorage.user.id);
                    });

                    medias.filter(function(media){
                        if(media.uuid && media.imageType == 'del'){
                            network.delete('/activities/'+data.uuid+'/media/'+media.uuid);
                        }
                        if(media.imageType == 'del'){
                            return false;
                        }
                        return true;
                    });

                    $q.all(medias.map(function(media){

                        if(media.imageType == 'new'){
                            return handleFile(data.uuid, media);
                        } else{
                            return  $q.when();
                        }

                    })).then(function(){
                        data.media = medias;

                        for(var i=0; i<$localStorage.activities[data.babies].length; ++i){
                            if(data.time>$localStorage.activities[data.babies][i].time){
                                break;
                            }
                        }

                        var middle = [];
                        Array.prototype.push.apply(middle, $localStorage.activities[data.babies].slice(0, i));
                        middle.push(data);
                        Array.prototype.push.apply(middle, $localStorage.activities[data.babies].slice(i, $localStorage.activities[data.babies].length));
                        $localStorage.activities[data.babies] = middle;

                        resolve(data);
                    })



                    for(var index = 0; index<$localStorage.activities[data.babies].length; ++index){
                        if($localStorage.activities[data.babies].hasOwnProperty(index)){
                            if($localStorage.activities[data.babies][index].uuid == data.uuid){
                                break;
                            }
                        }
                    }

                    var middle = [];
                    Array.prototype.push.apply(middle, $localStorage.activities[data.babies].slice(0, index));
                    Array.prototype.push.apply(middle, $localStorage.activities[data.babies].slice(index+1, $localStorage.activities[data.babies].length));
                    var activities = middle;

                    for(var i=0; i<activities.length; ++i){
                        if(data.time>activities[i].time){
                            break;
                        }
                    }

                    middle = [];
                    Array.prototype.push.apply(middle, activities.slice(0, i));
                    middle.push(data);
                    Array.prototype.push.apply(middle, activities.slice(i, activities.length));
                    console.log('middel', middle);
                    $localStorage.activities[data.babies] = middle;
                    resolve(data);
                });
            },
            getTodayCount: function(babyId){
                return $q(function(resolve, reject){
                    var count = {
                        nurseCount: 0,
                        diaperCount: 0,
                        bathCount: 0,
                        playCount: 0,
                        sleepCount: 0
                    };
                    $localStorage.activities[babyId].forEach(function(activity){
                        /**
                         * checking for today
                         */
                        if( new Date(activity.time).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0) ){
                            if(activity.type == "nurse"){
                                ++count.nurseCount;
                            } else if(activity.type == "play"){
                                ++count.playCount;
                            } else if(activity.type == "bath"){
                                ++count.bathCount;
                            } else if(activity.type == "diaper"){
                                ++count.diaperCount;
                            } else if(activity.type == "sleep"){
                                ++count.sleepCount;
                            }
                        }
                    });
                    resolve(count);
                });
            },
            getAllActivitiesByBabyId: function(babyId, start, limit, includeFuture){
                return $q(function(resolve, reject){
                    if(typeof includeFuture == 'undefined')
                        includeFuture = true;
                    if(typeof $localStorage.activities == 'undefined' || typeof babyId == 'undefined' || $localStorage.activities[babyId] == 'undefined') {
                        resolve([]);
                        return;
                    }

                    if(includeFuture) {
                        resolve($localStorage.activities[babyId].slice(start, start+limit).map(function(x){
                            x.time = new Date(x.time);
                            return x;
                        }));
                        return;
                    }

                    // sensitive code -- should be optimized
                    resolve($localStorage.activities[babyId].filter(function (obj) {
                        if(moment().diff(moment(obj.time)) >= 0)
                            return true;
                        return false;
                    })
                    .slice(start, start+limit).map(function(x){
                        x.time = new Date(x.time);
                        return x;
                    }));
                });
            },
            getActivitiesByDate: function(babyId, date) {
                return $q(function(resolve, reject){
                    var nDate = date.getTime();
                    resolve($localStorage.activities[babyId].filter(function(item) {
                        if(nDate == (new Date(item.time)).setHours(0,0,0,0))
                            return true;
                        return false;
                    }).map(function(x) {
                        x.time = new Date(x.time);
                        return x;
                    }).sort(function(act1, act2) {
                        var act1special = false,
                            act2special = false;

                        if(act1.type == "todo" || act1.type == "milestone" || act1.type == "doctor" || act1.type == "vaccination")
                            act1special = true;

                        if(act2.type == "todo" || act2.type == "milestone" || act2.type == "doctor" || act2.type == "vaccination")
                            act2special = true;

                        if(act1special && act2special)
                            return 0;
                        if(act1special)
                            return -1;
                        return 1;
                    }));
                });
            },
            getActivityCalendar: function(babyId) {
                // filter for activity calendar circle
                // 1) filter data type = 'todo' 2) milestone 3) doctor 4) vaccination
                return $q(function(resolve, reject){
                    var calendar = [],
                        activities = $localStorage.activities[babyId].slice(0),
                        activity, activityDate;

                    for(var i=0; i<activities.length; i++) {
                        activity = activities[i];
                        if(activity.type == "todo" || activity.type == "milestone" || activity.type == "doctor" || activity.type == "vaccination") {
                            activityDate = (new Date(activity.time)).setHours(0,0,0,0);
                            if(calendar.indexOf(activityDate) === -1)
                                calendar.push(activityDate);
                        }
                    }
                    resolve(calendar);
                });
            },
            getLastActivityByType: function (babyId, activity) {
                var activities = $localStorage.activities[babyId]
                    .sort(function(act1, act2) {
                        if(moment(act1.time) == moment(act2.time))
                            return 0;
                        if(moment(act1.time) > moment(act2.time))
                            return -1;
                        return 1;
                    });

                for(var i = 0; i < activities.length; i++) {
                    if(activity == 'feed') {
                        if(activities[i].type == 'bottle' || activities[i].type == 'nurse' || activities[i].type == 'solid')
                            return activities[i];
                    } else {
                        if(activities[i].type == activity)
                            return activities[i];
                    }
                }
                return null;
            },
            getActivityEtaByType: function (babyId, activity) {
                // calculates difference in last logged activities of specified type
                var activities = $localStorage.activities[babyId]
                    .sort(function(act1, act2) {
                        if(moment(act1.time) == moment(act2.time))
                            return 0;
                        if(moment(act1.time) > moment(act2.time))
                            return -1;
                        return 1;
                    });

                var lastActivity = null,
                    beforeLastActivity = null;

                for(var i = 0; i < activities.length; i++) {
                    // last 48 hours
                    var hours = moment().diff(moment(activities[i].time), 'hours', true);
                    if(hours > 48)
                        break;
                    var hasSameType = false;

                    if(activity == 'feed') {
                        hasSameType = (activities[i].type == 'bottle' || activities[i].type == 'nurse' || activities[i].type == 'solid');
                    } else {
                        hasSameType = (activities[i].type == activity);
                    }

                    if(hasSameType) {
                        if(lastActivity == null) {
                            lastActivity = activities[i];
                            continue;
                        } else {
                            beforeLastActivity = activities[i];
                            break;
                        }
                    }
                }

                if(lastActivity == null || beforeLastActivity == null) {
                    return null;
                }

                return Math.round(moment(lastActivity.time).diff(moment(beforeLastActivity.time), 'minutes', true));
            },
            setActivities: function(babyId, activities){
                return $q(function(resolve, reject){
                    if(!$localStorage.activities){
                        $localStorage.activities = {};
                    }
                    $localStorage.activities[babyId] = activities;
                    resolve(activities);
                });
            }
        };
    }]);
