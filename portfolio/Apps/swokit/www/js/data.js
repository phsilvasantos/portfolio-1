var LocalData = (function () {
  "use strict";
  return {
    GetWorkoutTypes: (function () {
      var workoutData = {
        fullBody : { id: 0, activityWeight: 7, activityMFP: "134026252709869", activityNames: "Full Body", exercises: false, description: "Combination of upper body, core strength and lower body."},
        upperBody : { id: 1, activityWeight: 6, activityMFP: "134026252709869", activityNames: "Upper Body", exercises: ["Push-ups" , "Overhead Press" , "Diamond Push-ups" , "Overhead Arm Clap", "Wide Arm Push-ups" , "Tricep Dips" , "Alternating Push-up Plank", "Wall Push-ups", "One Arm Side Push-up", "Jumping Jacks" , "Dive Bomber Push-ups", "Chest Expander", "Shoulder Tap Push-ups", "T Raise", "Spiderman Push-up", "Lying Triceps Lifts", "Push-up and Rotation", "Power Circles", "Reverse Plank"], description: "Chest, shoulders, biceps, triceps and upper back focused."},
        coreExercise : { id: 2, activityWeight: 6, activityMFP: "134026252709869", activityNames: "Core Strength", exercises: ["Sit-up" , "V Sit-up" , "Elevated Crunches" , "Leg Spreaders" , "Leg Lifts" , "Supine Bicycle" , "Plank" , "Burpees" , "Twisting Crunches", "Inch Worms", "Supermans", "Windmill", "Bent Leg Twist", "Side Bridge", "Quadraplex", "Swimmer", "Mason Twist", "Steam Engine", "In and Out Abs", "Six Inch and Hold", "Scissor Kicks"], description: "Abdominals, oblique and lower back focused."},
        lowerBody : { id: 3, activityWeight: 6, activityMFP: "134026252709869", activityNames: "Lower Body", exercises: ["Squats" , "Jump Squats", "Forward Lunges" , "Rear Lunges" , "Mountain Climbers" , "Front Kicks" , "Running in Place" , "Side Leg Lifts" , "Single Leg Squats", "Reverse V Lunges", "Hip Raise", "High Jumper", "Side to Side Knee Lifts", "Frog Jumps", "Calf Raises", "Genie Sit", "High Knees", "Butt Kickers", "Wall Sit"], description: "Quadriceps, hamstrings, buttocks, lower back and calf focused."},
        stretchExercise : { id: 4, activityWeight: 4, activityMFP: "133478623407981", activityNames: "Full Body Stretch", exercises: ["Quadricep Stretch" , "Hamstring Stretch Standing" , "Kneeling Hip Flexor", "Overhead Arm Pull" , "Chest Stretch" , "Abdominal Stretch" , "Side Stretch" , "Butterfly Stretch" , "Seated Hamstring Stretch" , "Calf Stretch" , "Neck Stretch" , "Lower Back Stretch", "Bending Windmill Stretch", "Bend and Reach", "Arm and Shoulder Stretch", "Shoulder Shrugs", "Hurdlers Stretch", "Ankle on the Knee", "Arm Circles", "Knee to Chest Stretch", "Single Leg Hamstring"], description: "Full combination of all stretches."},
        backStrength : { id: 5, activityWeight: 5, activityMFP: "133476496895469", activityNames: "Back Strengthening", exercises: ["Hip Raise", "Quadraplex", "Side Plank", "Forward Lunges", "Plank", "Lower Back Stretch", "Laying Spinal Twist", "Kneeling Hip Flexor", "Side Stretch", "Genie Sit"], description: "Lower back, hip flexor, buttocks, and core focused."},
        anythingGoes : { id: 6, activityWeight: 5, activityMFP: "134026252709869", activityNames: "Anything Goes - All Exercises", exercises: false, description: "Combination of upper body, core strength, lower body, stretches, back strength and cardio."},
        sunSalutation : { id: 7, activityWeight: 5, activityMFP: "133751232154941", activityNames: "Yoga Sun Salutation", exercises: ["Prayer Pose","Raised Arms Pose","Forward Fold","Low Lunge (Left Forward)","Downward Dog","Plank","Four Limbs Pose","Cobra Pose","Downward Dog","Low Lunge (Right Forward)","Forward Fold","Raised Arms Pose","Prayer Pose","Raised Arms Pose","Forward Fold","Low Lunge (Right Forward)","Downward Dog","Plank","Four Limbs Pose","Cobra Pose","Downward Dog","Low Lunge (Left Forward)","Forward Fold","Raised Arms Pose"], description: "Great sequence for warming up, cooling down or practicing poses."},
        fullSequence : { id: 8, activityWeight: 4, activityMFP: "133751232154941", activityNames: "Yoga Full Sequence", exercises: ["Mountain Pose","Raised Arms Pose","Side Bend Left","Side Bend Right","Forward Fold", "Forward Fold Hands Behind", "Chair Pose", "Chair Pose Twist Left", "Chair Pose Twist Right", "Forward Fold", "Mountain Pose", "Wide Leg Stance", "Wide Leg Stance Arms Up", "Wide Leg Forward Fold", "Wide Leg Stance", "Triangle Left", "Wide Leg Stance", "Triangle Right", "Wide Leg Stance", "Warrior II (Left Forward)", "Side Angle Left", "Wide Leg Stance", "Warrior II (Right Forward)", "Side Angle Right", "Wide Leg Stance", "Mountain Pose", "Forward Fold", "Low Lunge (Left Forward)", "Plank", "Four Limbs Pose", "Cobra Pose", "Downward Dog", "Low Lunge (Right Forward)", "Forward Fold", "Mountain Pose", "Tree Pose Left", "Tree Pose Right", "Head to Knee Left", "Head to Knee Right", "Twist Left", "Twist Right", "Lay on Back", "Prep for Shoulder Stand", "Plow", "Shoulder Stand", "Lay on Back", "Fish Pose", "Lay on Back", "Lay on Back", "Lay on Back", "Lay on Back"], description: "Longer sequence specifically designed for a relaxing, yet challenging, yoga session."},
        bootCamp : { id: 9, activityWeight: 7, activityMFP: "134026252709869", activityNames: "Boot Camp", exercises: ["Push-ups" , "Overhead Press" , "Overhead Arm Clap" , "Jumping Jacks", "Sit-up", "Leg Spreaders" , "Supine Bicycle" , "Windmill" , "Squats" , "Mountain Climbers" , "High Jumper" , "Plank"  , "Front Kicks", "Star Jumps", "Steam Engine", "Diamond Push-ups", "Dive Bomber Push-ups", "Six Inch and Hold", "Swimmer", "Star Jumps", "Squat Jacks"], description: "Intense full body workout based on exercises commonly used for PT in the US Army."},
        rumpRoaster : { id: 10, activityWeight: 6, activityMFP: "134026252709869", activityNames: "Rump Roaster", exercises: ["Leg Spreaders" , "Leg Lifts" , "Squats" , "Mountain Climbers" , "Hip Raise" , "Quadraplex"  , "Bent Leg Twist", "Side Bridge" , "Forward Lunges" , "Rear Lunges", "Kneeling Hip Flexor", "Side Leg Lifts", "Side to Side Knee Lifts", "High Knees", "Squat Jacks"], description:"Highly targeted buttocks workout."},
        cardio : { id: 11, activityWeight: 8, activityMFP: "134026252709869", activityNames: "Cardio - Full Intensity", exercises: ["Fast Feet", "Step Touch", "Power Skip", "High Knees", "Butt Kickers", "Jump Rope Hops", "Side Hops", "Pivoting Upper Cuts", "Squat Jabs", "Skaters", "Single Leg Hops", "Switch Kick", "Jumping Planks", "Star Jumps", "Running in Place", "Jumping Jacks", "Front Kicks", "Windmill", "Sprinter", "Power Jump",  "Single Lateral Hops", "Shoulder Tap Push-ups",  "Squat Jacks", "Lunge Jumps", "Up Downs", "Burpees", "Mountain Climbers"], description:"Full intensity cardio workout used to increase muscle and endurance."},
        bringThePain : { id: 12, activityWeight: 8, activityMFP: "134026252709869", activityNames: "Bring The Pain", exercises: ["Push-ups", "Alternating Push-up Plank", "Tricep Dips", "Dive Bomber Push-ups", "Supine Bicycle", "Burpees", "Spiderman Push-up", "Steam Engine","Six Inch and Hold", "Jump Squats", "Mountain Climbers", "Pivoting Upper Cuts", "Squat Jabs","Sprinter","Power Jump","Up Downs","Shoulder Tap Push-ups", "Lunge Jumps", "Squat Jacks", "Leg Spreaders", "Fast Feet", "Switch Kick"], description: "Only the most challenging and intense exercises for advanced workouts."},
        customWorkout : { id: 13, activityWeight: 6, activityMFP: "134026252709869", activityNames: "Custom Workout", exercises: false, description:"Custom designed workout."},
        headToToe : { id: 14, activityWeight: 4, activityMFP: "133478623407981", activityNames: "Head to Toe Warmup Stretch", exercises: ["Neck Stretch", "Arm and Shoulder Stretch", "Overhead Arm Pull", "Abdominal Stretch", "Chest Stretch", "Quadricep Stretch" , "Hamstring Stretch Standing", "Calf Stretch", "Butterfly Stretch", "Seated Hamstring Stretch" , "Kneeling Hip Flexor"  , "Lower Back Stretch", "Ankle on the Knee"], description:"Non-randomized stretching routine sequence perfect for static warmups or cooldowns."},
        cardioLight : { id: 15, activityWeight: 5, activityMFP: "133476505251693", activityNames: "Cardio - Light Warm Up", exercises: ["Step Touch", "High Knees", "Butt Kickers", "Jump Rope Hops", "Single Leg Hops", "Running in Place", "Jumping Jacks", "Front Kicks", "Windmill", "Bend and Reach", "Calf Raises", "Arm Circles", "Side Hops"], description:"A lighter intensity cardio workout perfect for warmups, cooldowns and beginners."},
        sevenMinute : { id: 16, activityWeight: 7, activityMFP: "134026252709869", activityNames: "7 Minute Workout", exercises: ["Jumping Jacks", "Wall Sit", "Push-ups", "Abdominal Crunch", "Step Ups", "Squats", "Tricep Dips", "Plank", "High Knees", "Lunge", "Push-up and Rotation", "Side Plank"], description:"Based on the Scientific 7 Minute Workout. Automatically sets 30 seconds of activity and 10 seconds of rest for each exercise."},
        standingStretches : { id: 17, activityWeight: 4, activityMFP: "133478623407981", activityNames: "Standing Only Stretch", exercises: ["Quadricep Stretch" , "Hamstring Stretch Standing" , "Overhead Arm Pull" , "Chest Stretch" , "Abdominal Stretch" , "Side Stretch" , "Calf Stretch" , "Neck Stretch" , "Arm and Shoulder Stretch", "Shoulder Shrugs", "Arm Circles"], description:"Low intensity stretches that can be done in any environment or location."},
        pilatesWorkout : { id: 18, activityWeight: 6, activityMFP: "133201476341181", activityNames: "Pilates", exercises: ["Swan", "Double Leg Stretch", "Spine Stretch Forward", "Seated Spine Twist", "Leg Pull Front", "Leg Pull Back", "The Hundred", "Rollover", "Back Arm Rowing", "Swimming", "Double Leg Kick", "Laying Side Kick", "Teaser", "Wag Your Tail", "Corkscrew", "Roll Up", "One Leg Circles"], description:"Improve balance, core strength, and flexibity with a combination of stretching and strength building pilates. Repeat each exercise through entire interval alternating sides when shown. Focus on controlling your breathing while filling your lungs."}
      };

      return workoutData;
    }()),
    GetWorkoutCategories: (function () {
      var workoutCategories = [
        {workoutTypes: ["fullBody", "upperBody", "coreExercise", "lowerBody", "cardioLight", "cardio"], fullName: "Strength & Cardio"},
        {workoutTypes: ["sunSalutation", "fullSequence", "pilatesWorkout", "headToToe", "stretchExercise", "standingStretches", "backStrength", "anythingGoes"], fullName: "Yoga & Stretching"}
      ];
      return workoutCategories;
    }())
  }
}());

var TimingData = (function () {
  "use strict";
  return {
    GetTimingSettings: (function () {
      var timingData = {
        customSet: false,
        breakFreq: 5,
        exerciseTime: 30,
        breakTime: 30,
        transitionTime: 0,
        transition:false,
        randomizationOption: true,
        workoutLength: 15,
        audioOption: true,
        warningAudio: true,
        countdownBeep: true,
        autoPlay: true,
        countdownStyle: true
      };
      return timingData;
    }()),
    GetSevenMinuteSettings: (function () {
      var timingData = {
        customSetSeven: true,
        breakFreqSeven: 0,
        exerciseTimeSeven: 30,
        breakTimeSeven: 0,
        transitionTimeSeven: 10,
        randomizationOptionSeven: false,
        workoutLengthSeven: 7
      };
      return timingData;
    }())
  }
}());

var PersonalData = (function () {
  "use strict";
  return {
    GetUserSettings: (function () {
      var userData = {
        weight: 150,
        weightType: 0,
        kiipRewards: true,
        mPoints: true,
        mfpStatus: false,
        myFitnessReady: false,
        mfpWeight: false,
        mfpAccessToken: false,
        mfpRefreshToken: false,
        videosDownloaded: false,
        downloadDecision: true,
        healthKit: false
      };
      return userData;
    }()),
    GetUserGoals: (function () {
      var userGoals = {
        dailyGoal: 15,
        weeklyGoal: 75
      };
      return userGoals;
    }()),
    GetUserProgress: (function () {
      var userProgress = {
        monthlyTotal: 0,
        weeklyTotal: 0,
        dailyTotal: 0,
        totalCalories: 0,
        totalProgress: 0,
        day: 0,
        week: 0
      };
      return userProgress;
    }()),
    GetCustomWorkouts: (function () {
      var userCustomWorkouts = {
        savedWorkouts: []
      };
      return userCustomWorkouts;
    }()),
    GetWorkoutArray: (function () {
      var userCustomArray = {
        workoutArray: []
      };
      return userCustomArray;
    }())
  }
}());

var LocalHistory = (function () {
  "use strict";
  return {
    getCustomHistory: (function () {
      var lastHomeURL = {
        url: ''
      };
      return lastHomeURL;
    }())
  }
}());

LocalData.SetReminder = {daily: {status:false,time:7,minutes:0}, inactivity: {frequency: 2, status:false,time:7,minutes:0}};

var exerciseObject = {
  "Push-ups" : {"name":"Push-ups","image":"Pushup.jpg","audio":"Pushup.mp3","youtube":"esV_0R3vCgM","switchOption":false,"video":"Pushup.mp4","category":"upper"},
  "Overhead Press" : {"name":"Overhead Press","image":"OverheadPress.jpg","audio":"OverheadPress.mp3","youtube":"qLNO65idcA4","switchOption":false,"video":"OverheadPress.mp4","category":"upper"}, 
  "Overhead Arm Clap" : {"name":"Overhead Arm Clap","image":"OverheadArmClap.jpg","audio":"OverheadArmClap.mp3","youtube":"JAY8z66cWBQ","switchOption":false,"video":"OverheadArmClap.mp4","category":"upper"}, 
  "Diamond Push-ups" : {"name":"Diamond Push-ups","image":"DiamondPushup.jpg","audio":"DiamondPushup.mp3","youtube":"WaZ21WJLMIE","switchOption":false,"video":"DiamondPushup.mp4","category":"upper"}, 
  "Wide Arm Push-ups" : {"name":"Wide Arm Push-ups","image":"WideArmPushup.jpg","audio":"WideArmPushup.mp3","youtube":"dVswcADbKvc","switchOption":false,"video":"WideArmPushup.mp4","category":"upper"}, 
  "Alternating Push-up Plank" : {"name":"Alternating Push-up Plank","image":"PushupToPlank.jpg","audio":"PushupToPlank.mp3","youtube":"XrynicUr9m0","switchOption":false,"video":"PushupToPlank.mp4","category":"upper"}, 
  "Tricep Dips" : {"name":"Tricep Dips","image":"TricepDips.jpg","audio":"TricepDips.mp3","youtube":"EQGJFWcc7ek","switchOption":false,"video":"TricepDips.mp4","category":"upper"},
  "Wall Push-ups" : {"name":"Wall Push-ups","image":"WallPushups.jpg","audio":"WallPushups.mp3","youtube":"mbGj2KULJY4","switchOption":false,"video":"WallPushups.mp4","category":"upper"},
  "Jumping Jacks" : {"name":"Jumping Jacks","image":"JumpingJacks.jpg","audio":"JumpingJacks.mp3","youtube":"JRbClSwzGCo","switchOption":false,"video":"JumpingJacks.mp4","category":"upper"},
  "Chest Expander" : {"name":"Chest Expander","image":"ChestExpander.jpg","audio":"ChestExpander.mp3","youtube":"seWu6TM8Bjw","switchOption":false,"video":"ChestExpander.mp4","category":"upper"},
  "Sit-up" : {"name":"Sit-up","image":"Situps.jpg","audio":"Situps.mp3","youtube":"mOu5pS9LyOo","switchOption":false,"video":"Situps.mp4","category":"core"},
  "V Sit-up" : {"name":"V Sit-up","image":"VSitups.jpg","audio":"VSitups.mp3","youtube":"vbD4wCvseSM","switchOption":false,"video":"VSitups.mp4","category":"core"},
  "Elevated Crunches" : {"name":"Elevated Crunches","image":"Crunches.jpg","audio":"Crunches.mp3","youtube":"a-yY30-DCxk","switchOption":false,"video":"Crunches.mp4","category":"core"},
  "Leg Spreaders" : {"name":"Leg Spreaders","image":"LegSpreaders.jpg","audio":"LegSpreaders.mp3","youtube":"GLOOymmFsaA","switchOption":false,"video":"LegSpreaders.mp4","category":"core"},
  "Leg Lifts" : {"name":"Leg Lifts","image":"LegLifts.jpg","audio":"LegLifts.mp3","youtube":"tOKQ7fdCITc","switchOption":false,"video":"LegLifts.mp4","category":"core"},
  "Supine Bicycle" : {"name":"Supine Bicycle","image":"SupineBicycle.jpg","audio":"SupineBicycle.mp3","youtube":"jDrXvpnuJmA","switchOption":false,"video":"SupineBicycle.mp4","category":"core"},
  "Plank" : {"name":"Plank","image":"Plank1.jpg","audio":"Plank1.mp3","youtube":"aHPf4sBapq0","switchOption":false,"video":"Plank1.mp4","category":"core"},
  "Burpees" : {"name":"Burpees","image":"Burpees.jpg","audio":"Burpees.mp3","youtube":"DDxlDuvVzN0","switchOption":false,"video":"Burpees.mp4","category":"core"},
  "Squats" : {"name":"Squats","image":"Squats.jpg","audio":"Squats.mp3","youtube":"THNv75tfG6E","switchOption":false,"video":"Squats.mp4","category":"lower"},
  "Twisting Crunches" : {"name":"Twisting Crunches","image":"TwistingCrunches.jpg","audio":"TwistingCrunches.mp3","youtube":"dKppHZA4vVg","switchOption":false,"video":"TwistingCrunches.mp4","category":"core"},
  "Wall Sit" : {"name":"Wall Sit","image":"WallSit.jpg","audio":"WallSit.mp3","youtube":"OSkn6l01PWM","switchOption":false,"video":"WallSit.mp4","category":"lower"},
  "Single Leg Squats" : {"name":"Single Leg Squats","image":"SingleLegSquats.jpg","audio":"SingleLegSquats.mp3","youtube":"y_WNGxB7CUw","switchOption":true,"video":"SingleLegSquats.mp4","category":"lower"},
  "Inch Worms" : {"name":"Inch Worms","image":"InchWorms.jpg","audio":"InchWorms.mp3","youtube":"WW6yhvpFTYY","switchOption":false,"video":"InchWorms.mp4","category":"lower"},
  "Hip Raise" : {"name":"Hip Raise","image":"HipRaises.jpg","audio":"HipRaises.mp3","youtube":"w794tAm_vzM","switchOption":false,"video":"HipRaises.mp4","category":"back"},
  "Supermans" : {"name":"Supermans","image":"Supermans.jpg","audio":"Supermans.mp3","youtube":"8e2hBvVtjVE","switchOption":false,"video":"Supermans.mp4","category":"lower"},
  "Spiderman Push-up" : {"name":"Spiderman Push-up","image":"Spidermans.jpg","audio":"Spidermans.mp3","youtube":"p27oRTihzzk","switchOption":false,"video":"Spidermans.mp4","category":"core"},
  "Jump Squats" : {"name":"Jump Squats","image":"JumpSquats.jpg","audio":"JumpSquats.mp3","youtube":"Sr_0y4XS8ws","switchOption":false,"video":"JumpSquats.mp4","category":"lower"},
  "Forward Lunges" : {"name":"Forward Lunges","image":"ForwardLunges.jpg","audio":"ForwardLunges.mp3","youtube":"jSnSKT2g9PY","switchOption":false,"video":"ForwardLunges.mp4","category":"lower"},
  "Rear Lunges" : {"name":"Rear Lunges","image":"RearLunges.jpg","audio":"RearLunges.mp3","youtube":"XN_BYC1OGz4","switchOption":false,"video":"RearLunges.mp4","category":"lower"},
  "Mountain Climbers" : {"name":"Mountain Climbers","image":"MountainClimbers.jpg","audio":"MountainClimbers.mp3","youtube":"l8fgZDP1Nks","switchOption":false,"video":"MountainClimbers.mp4","category":"lower"},
  "Front Kicks" : {"name":"Front Kicks","image":"FrontKicks.jpg","audio":"FrontKicks.mp3","youtube":"2XIndSFscFs","switchOption":false,"video":"FrontKicks.mp4","category":"lower"},
  "Running in Place" : {"name":"Running in Place","image":"RunningInPlace.jpg","audio":"RunningInPlace.mp3","youtube":"REVE_Pt96-4","switchOption":false,"video":"RunningInPlace.mp4","category":"lower"},
  "Side Leg Lifts" : {"name":"Side Leg Lifts","image":"SideLegLifts.jpg","audio":"SideLegLifts.mp3","youtube":"4N_K0PvWUQE","switchOption":true,"video":"SideLegLifts.mp4","category":"lower"},
  "Reverse V Lunges" : {"name":"Reverse V Lunges","image":"ReverseVLunges.jpg","audio":"ReverseVLunges.mp3","youtube":"RPfqyE_BMPc","switchOption":false,"video":"ReverseVLunges.mp4","category":"lower"},
  "Quadricep Stretch" : {"name":"Quadricep Stretch","image":"Quadricep.jpg","audio":"Quadricep.mp3","youtube":"Y-GvduytBmg","switchOption":true,"video":"Quadricep.mp4","category":"stretch"},
  "Hamstring Stretch Standing" : {"name":"Hamstring Stretch Standing","image":"HamstringStanding.jpg","audio":"HamstringStanding.mp3","youtube":"QdYDpDoYau4","switchOption":false,"video":"HamstringStanding.mp4","category":"stretch"},
  "Hip Flexor Stretch" : {"name":"Hip Flexor Stretch","image":"HipFlexor.jpg","audio":"HipFlexor.mp3","youtube":"3MKV1Ht-3VU","switchOption":true,"video":"HipFlexor.mp4","category":"stretch"},
  "Overhead Arm Pull" : {"name":"Overhead Arm Pull","image":"OverheadArmPull.jpg","audio":"OverheadArmPull.mp3","youtube":"2AvkRSY9Iw8","switchOption":true,"video":"OverheadArmPull.mp4","category":"stretch"},
  "Chest Stretch" : {"name":"Chest Stretch","image":"Chest.jpg","audio":"Chest.mp3","youtube":"Tsr1b7szjek","switchOption":false,"video":"Chest.mp4","category":"stretch"},
  "Abdominal Stretch" : {"name":"Abdominal Stretch","image":"Abdominal.jpg","audio":"Abdominal.mp3","youtube":"GFbMWt8uuHE","switchOption":false,"video":"Abdominal.mp4","category":"stretch"},
  "Side Stretch" : {"name":"Side Stretch","image":"SideStretch.jpg","audio":"SideStretch.mp3","youtube":"1Fp5vykrOZU","switchOption":true,"video":"SideStretch.mp4","category":"stretch"},
  "Butterfly Stretch" : {"name":"Butterfly Stretch","image":"Butterfly.jpg","audio":"Butterfly.mp3","youtube":"UZ1zS_oQdvE","switchOption":false,"video":"Butterfly.mp4","category":"stretch"},
  "Seated Hamstring Stretch" : {"name":"Seated Hamstring Stretch","image":"HamstringSeated.jpg","audio":"HamstringSeated.mp3","youtube":"KjRxrCNDDXY","switchOption":false,"video":"HamstringSeated.mp4","category":"stretch"},
  "Calf Stretch" : {"name":"Calf Stretch","image":"Calf.jpg","audio":"Calf.mp3","youtube":"cxmp-YC_lwA","switchOption":true,"video":"Calf.mp4","category":"stretch"},
  "Neck Stretch" : {"name":"Neck Stretch","image":"Neck.jpg","audio":"Neck.mp3","youtube":"Ci-D9SwX02I","switchOption":true,"video":"Neck.mp4","category":"stretch"},
  "Lower Back Stretch" : {"name":"Lower Back Stretch","image":"LowerBack.jpg","audio":"LowerBack.mp3","youtube":"v6OVxFpFIYY","switchOption":true,"video":"LowerBack.mp4","category":"stretch"},
  "Bending Windmill Stretch" : {"name":"Bending Windmill Stretch","image":"BendingWindmill.jpg","audio":"BendingWindmill.mp3","youtube":"1drPTxOQqmA","switchOption":true,"video":"BendingWindmill.mp4","category":"stretch"},
  "Standing Forward Bend" : {"name":"Standing Forward Bend","image":"ForwardFold.jpg","audio":"ForwardFold.mp3","youtube":"bVZFts7QPIA","switchOption":false,"video":"ForwardFold.mp4","category":"yoga"},
  "Lunge Pose" : {"name":"Lunge Pose","image":"LowLunge.jpg","audio":"LowLunge.mp3","youtube":"3vPuSVKIAWk","switchOption":true,"video":"LowLunge.mp4","category":"yoga"},
  "Plank Pose" : {"name":"Plank Pose","image":"Plank.jpg","audio":"Plank.mp3","youtube":"FEFYp1ESL3U","switchOption":false,"video":"Plank.mp4","category":"yoga"},
  "Half Spinal Twist" : {"name":"Half Spinal Twist","image":"LowerBack.jpg","audio":"LowerBack.mp3","youtube":"v6OVxFpFIYY","switchOption":true,"video":"LowerBack.mp4","category":"yoga","category":"yoga"},
  "Side Plank" : {"name":"Side Plank","image":"SideBridge.jpg","audio":"SidePlank.mp3","youtube":"ZVG30XkbaAc","switchOption":true,"video":"SidePlank.mp4","category":"back"},
  "Lunge" : {"name":"Lunge","image":"ForwardLunges.jpg","audio":"Lunge.mp3","youtube":"jSnSKT2g9PY","switchOption":false,"video":"ForwardLunges.mp4","category":"lower"},
  "Laying Spinal Twist" : {"name":"Laying Spinal Twist","image":"SingleLegOver.jpg","audio":"LayingSpinal.mp3","youtube":"WP3GSdsj8Ds","switchOption":true,"video":"LayingSpinal.mp4","category":"back"},
  "Kneeling Hip Flexor" : {"name":"Kneeling Hip Flexor","image":"HipFlexor.jpg","audio":"KneelingHipFlexor.mp3","youtube":"3MKV1Ht-3VU","switchOption":true,"video":"KneelingHipFlexor.mp4","category":"back"},
  "T Raise" : {"name":"T Raise","image":"TRaises.jpg","audio":"TRaises.mp3","youtube":"n2Y173usrvQ","switchOption":false,"video":"TRaises.mp4","category":"upper"},
  "Lying Triceps Lifts" : {"name":"Lying Triceps Lifts","image":"LyingTriceps.jpg","audio":"LyingTriceps.mp3","youtube":"Sma4t8m1sl4","switchOption":false,"video":"LyingTriceps.mp4","category":"upper"},
  "Reverse Plank" : {"name":"Reverse Plank","image":"ReversePlank.jpg","audio":"ReversePlank.mp3","youtube":"cBy9Q__NmuY","switchOption":false,"video":"ReversePlank.mp4","category":"upper"},
  "Windmill" : {"name":"Windmill","image":"Windmill.jpg","audio":"Windmill.mp3","youtube":"6g6bTRqEcXw","switchOption":false,"video":"Windmill.mp4","category":"core"},
  "Bent Leg Twist" : {"name":"Bent Leg Twist","image":"BentLegTwist.jpg","audio":"BentLegTwist.mp3","youtube":"84JdoB7VbfI","switchOption":false,"video":"BentLegTwist.mp4","category":"core"},
  "Side Bridge" : {"name":"Side Bridge","image":"SideBridge.jpg","audio":"SideBridge.mp3","youtube":"ZVG30XkbaAc","switchOption":true,"video":"SideBridge.mp4","category":"core"},
  "Quadraplex" : {"name":"Quadraplex","image":"Quadraplex.jpg","audio":"Quadraplex.mp3","youtube":"MslgraT68n0","switchOption":false,"video":"Quadraplex.mp4","category":"back"},
  "High Jumper" : {"name":"High Jumper","image":"HighJumper.jpg","audio":"HighJumper.mp3","youtube":"ijEnR3J0LHM","switchOption":false,"video":"HighJumper.mp4","category":"cardio"},
  "Side to Side Knee Lifts" : {"name":"Side to Side Knee Lifts","image":"SideToSide.jpg","audio":"SideToSide.mp3","youtube":"BQg_YJk11oI","switchOption":false,"video":"SideToSide.mp4","category":"lower"},
  "Frog Jumps" : {"name":"Frog Jumps","image":"FrogJumps.jpg","audio":"FrogJumps.mp3","youtube":"1F2Yu1l4M1g","switchOption":false,"video":"FrogJumps.mp4","category":"lower"},
  "Bend and Reach" : {"name":"Bend and Reach","image":"BendAndReach.jpg","audio":"BendAndReach.mp3","youtube":"HXL3MAnjkFo","switchOption":false,"video":"BendAndReach.mp4","category":"stretch"},
  "Arm and Shoulder Stretch" : {"name":"Arm and Shoulder Stretch","image":"ArmAndShoulder.jpg","audio":"ArmAndShoulder.mp3","youtube":"Pox8nzxHuzk","switchOption":true,"video":"ArmAndShoulder.mp4","category":"stretch"},
  "Shoulder Shrugs" : {"name":"Shoulder Shrugs","image":"ShoulderShrug.jpg","audio":"ShoulderShrug.mp3","youtube":"5PqXQluk6qs","switchOption":false,"video":"ShoulderShrug.mp4","category":"stretch"},
  "Fast Feet" : {"name":"Fast Feet","image":"fastFeet.jpg","audio":"fastFeet.mp3","youtube":"RWkUDUugAOM","switchOption":false,"video":"fastFeet.mp4","category":"cardio"},
  "Step Touch" : {"name":"Step Touch","image":"stepTouch.jpg","audio":"stepTouch.mp3","youtube":"gDfKb6L6IOk","switchOption":false,"video":"stepTouch.mp4","category":"cardio"},
  "Power Skip" : {"name":"Power Skip","image":"powerSkip.jpg","audio":"powerSkip.mp3","youtube":"zANZ3-z1Mtk","switchOption":false,"video":"powerSkip.mp4","category":"cardio"},
  "High Knees" : {"name":"High Knees","image":"highKnees.jpg","audio":"highKnees.mp3","youtube":"OzawXhbQ4AM","switchOption":false,"video":"highKnees.mp4","category":"cardio"},
  "Butt Kickers" : {"name":"Butt Kickers","image":"buttKickers.jpg","audio":"buttKickers.mp3","youtube":"yM8tBZiTJEQ","switchOption":false,"video":"buttKickers.mp4","category":"cardio"},
  "Jump Rope Hops" : {"name":"Jump Rope Hops","image":"jumpRope.jpg","audio":"jumpRope.mp3","youtube":"jwbNnI81cfQ","switchOption":false,"video":"jumpRope.mp4","category":"cardio"},
  "Side Hops" : {"name":"Side Hops","image":"sideHops.jpg","audio":"sideHops.mp3","youtube":"eZZEDUDW9U0","switchOption":false,"video":"sideHops.mp4","category":"cardio"},
  "Pivoting Upper Cuts" : {"name":"Pivoting Upper Cuts","image":"pivotingUpper.jpg","audio":"pivotingUpper.mp3","youtube":"eulZUGt8ZXQ","switchOption":false,"video":"pivotingUpper.mp4","category":"cardio"},
  "Squat Jabs" : {"name":"Squat Jabs","image":"squatJabs.jpg","audio":"squatJabs.mp3","youtube":"1CNwWtvMtWo","switchOption":false,"video":"squatJabs.mp4","category":"cardio"},
  "Skaters" : {"name":"Skaters","image":"skaters.jpg","audio":"skaters.mp3","youtube":"ODRGFLzeWYU","switchOption":false,"video":"skaters.mp4","category":"cardio"},
  "Single Leg Hops" : {"name":"Single Leg Hops","image":"singleLegHops.jpg","audio":"singleLegHops.mp3","youtube":"lTyY3bfhoPQ","switchOption":true,"video":"singleLegHops.mp4","category":"cardio"},
  "Jumping Planks" : {"name":"Jumping Planks","image":"jumpingPlanks.jpg","audio":"jumpingPlanks.mp3","youtube":"b0ph_y0Khg4","switchOption":false,"video":"jumpingPlanks.mp4","category":"cardio"},
  "Star Jumps" : {"name":"Star Jumps","image":"starJumps.jpg","audio":"starJumps.mp3","youtube":"zqMOALAFi7g","switchOption":false,"video":"starJumps.mp4","category":"cardio"},
  "Sprinter" : {"name":"Sprinter","image":"sprinter.jpg","audio":"sprinter.mp3","youtube":"SIkSMk92DRc","switchOption":false,"video":"sprinter.mp4","category":"cardio"},
  "Power Jump" : {"name":"Power Jump","image":"powerJump.jpg","audio":"powerJump.mp3","youtube":"I5v7zh9dd6E","switchOption":false,"video":"powerJump.mp4","category":"cardio"},
  "Single Lateral Hops" : {"name":"Single Lateral Hops","image":"singleLateralHops.jpg","audio":"singleLateralHops.mp3","youtube":"jrFc-pDYLMQ","switchOption":true,"video":"singleLateralHops.mp4","category":"cardio"},
  "Shoulder Tap Push-ups" : {"name":"Shoulder Tap Push-ups","image":"shoulderTap.jpg","audio":"shoulderTap.mp3","youtube":"qHA91YL5VjU","switchOption":false,"video":"shoulderTap.mp4","category":"cardio"},
  "Squat Jacks" : {"name":"Squat Jacks","image":"squatJacks.jpg","audio":"squatJacks.mp3","youtube":"MKfQ-l7VSCc","switchOption":false,"video":"squatJacks.mp4","category":"cardio"},
  "Lunge Jumps" : {"name":"Lunge Jumps","image":"lungeJumps.jpg","audio":"lungeJumps.mp3","youtube":"WUfjtNeb16w","switchOption":false,"video":"lungeJumps.mp4","category":"cardio"},
  "Up Downs" : {"name":"Up Downs","image":"upDowns.jpg","audio":"upDowns.mp3","youtube":"bVtUGCJLuNQ","switchOption":false,"video":"upDowns.mp4","category":"cardio"},
  "Swimmer" : {"name":"Swimmer","image":"swimmer.jpg","audio":"swimmer.mp3","youtube":"JAUK08qf16c","switchOption":false,"video":"swimmer.mp4","category":"core"},
  "One Arm Side Push-up" : {"name":"One Arm Side Push-up","image":"oneArmSide.jpg","audio":"oneArmSide.mp3","youtube":"KqPg3BAyrmM","switchOption":true,"video":"oneArmSide.mp4","category":"upper"},
  "Power Circles" : {"name":"Power Circles","image":"powerCircles.jpg","audio":"powerCircles.mp3","youtube":"hMAx_y8qQFc","switchOption":false,"video":"powerCircles.mp4","category":"upper"},
  "Dive Bomber Push-ups" : {"name":"Dive Bomber Push-ups","image":"diveBomber.jpg","audio":"diveBomber.mp3","youtube":"FRyxMQmeaoA","switchOption":false,"video":"diveBomber.mp4","category":"upper"},
  "Calf Raises" : {"name":"Calf Raises","image":"calfRaises.jpg","audio":"calfRaises.mp3","youtube":"jtbxfT9sPts","switchOption":false,"video":"calfRaises.mp4","category":"lower"},
  "Genie Sit" : {"name":"Genie Sit","image":"genie.jpg","audio":"genie.mp3","youtube":"3HDgdrS4Y38","switchOption":false,"video":"genie.mp4","category":"core"},
  "Mason Twist" : {"name":"Mason Twist","image":"masonTwist.jpg","audio":"masonTwist.mp3","youtube":"zKJbTZv27u4","switchOption":false,"video":"masonTwist.mp4","category":"core"},
  "Steam Engine" : {"name":"Steam Engine","image":"steamEngine.jpg","audio":"steamEngine.mp3","youtube":"LjRRcQClF_k","switchOption":false,"video":"steamEngine.mp4","category":"core"},
  "In and Out Abs" : {"name":"In and Out Abs","image":"inOutAbs.jpg","audio":"inOutAbs.mp3","youtube":"cfunMu14Hws","switchOption":false,"video":"inOutAbs.mp4","category":"core"},
  "Six Inch and Hold" : {"name":"Six Inch and Hold","image":"sixInch.jpg","audio":"sixInch.mp3","youtube":"6ne45VyH7YQ","switchOption":false,"video":"sixInch.mp4","category":"core"},
  "Hurdlers Stretch" : {"name":"Hurdlers Stretch","image":"hurdlers.jpg","audio":"hurdlers.mp3","youtube":"8h_8C4ZaIqQ","switchOption":true,"video":"hurdlers.mp4","category":"stretch"},
  "Ankle on the Knee" : {"name":"Ankle on the Knee","image":"ankleOnKnee.jpg","audio":"ankleOnKnee.mp3","youtube":"-mlnFTcMwkI","switchOption":true,"video":"ankleOnKnee.mp4","category":"stretch"},
  "Arm Circles" : {"name":"Arm Circles","image":"armCircles.jpg","audio":"armCircles.mp3","youtube":"xNAbzeNev40","switchOption":false,"video":"armCircles.mp4","category":"stretch"},
  "Abdominal Crunch" : {"name":"Abdominal Crunch","image":"AbdominalCrunch.jpg","audio":"AbdominalCrunch.mp3","youtube":"k9f-eaKojwU","switchOption":false,"video":"AbdominalCrunch.mp4","category":"core"},
  "Step Ups" : {"name":"Step Ups","image":"StepUps.jpg","audio":"StepUps.mp3","youtube":"ETiSDt8TBNo","switchOption":false,"video":"StepUps.mp4","category":"lower"},
  "Push-up and Rotation" : {"name":"Push-up and Rotation","image":"PushupAndRotation.jpg","audio":"PushupAndRotation.mp3","youtube":"LxdMKjUgLLM","switchOption":false,"video":"PushupAndRotation.mp4","category":"upper"},
  "Good Mornings" : {"name":"Good Mornings","image":"GoodMornings.jpg","audio":"GoodMornings.mp3","youtube":"bw2Z5QSncjo","switchOption":false,"video":"GoodMornings.mp4","category":"core"},
  "Knee to Chest Stretch" : {"name":"Knee to Chest Stretch","image":"KneeToChest.jpg","audio":"KneeToChest.mp3","youtube":"mdbgOnRSf6Q","switchOption":true,"video":"KneeToChest.mp4","category":"stretch"},
  "Scissor Kicks" : {"name":"Scissor Kicks","image":"ScissorKicks.jpg","audio":"ScissorKicks.mp3","youtube":"9o2LVIrI3YA","switchOption":false,"video":"ScissorKicks.mp4","category":"core"},
  "Single Leg Hamstring" : {"name":"Single Leg Hamstring","image":"SingleLegHamstring.jpg","audio":"SingleLegHamstring.mp3","youtube":"UyAJFaqYhi0","switchOption":true,"video":"SingleLegHamstring.mp4","category":"stretch"},
  "Swipers" : {"name":"Swipers","image":"Swipers.jpg","audio":"Swipers.mp3","youtube":"07U7MKMYe7A","switchOption":false,"video":"Swipers.mp4","category":"cardio"},
  "Switch Kick" : {"name":"Switch Kick","image":"switchKick.jpg","audio":"switchKick.mp3","youtube":"2eSK2W-5FAY","switchOption":false,"video":"switchKick.mp4","category":"cardio"},
  "Prayer Pose" : {"name":"Prayer Pose","image":"PrayerPose.jpg","audio":"PrayerPose.mp3","youtube":"dEGJDBWq2Ww","switchOption":false,"video":"PrayerPose.mp4","category":"yoga"},
  "Raised Arms Pose" : {"name":"Raised Arms Pose","image":"RaisedArmsPose.jpg","audio":"RaisedArmsPose.mp3","youtube":"jUal4g3YXUI","switchOption":false,"video":"RaisedArmsPose.mp4","category":"yoga"},
  "Forward Fold" : {"name":"Forward Fold","image":"ForwardFold.jpg","audio":"ForwardFold.mp3","youtube":"bVZFts7QPIA","switchOption":false,"video":"ForwardFold.mp4","category":"yoga"},
  "Low Lunge (Left Forward)" : {"name":"Low Lunge (Left Forward)","image":"LowLungeLeft.jpg","audio":"LowLungeLeft.mp3","youtube":"5RXMEid45Hw","switchOption":false,"video":"LowLungeLeft.mp4","category":"yoga"},
  "Low Lunge (Right Forward)" : {"name":"Low Lunge (Right Forward)","image":"LowLunge.jpg","audio":"LowLunge.mp3","youtube":"XDkciAmsFLM","switchOption":false,"video":"LowLunge.mp4","category":"yoga"},
  "Four Limbs Pose" : {"name":"Four Limbs Pose","image":"FourLimbsPose.jpg","audio":"FourLimbsPose.mp3","youtube":"o0lESx0PLmE","switchOption":false,"video":"FourLimbsPose.mp4","category":"yoga"},
  "Cobra Pose" : {"name":"Cobra Pose","image":"CobraPose.jpg","audio":"CobraPose.mp3","youtube":"yK0QbZiZMjw","switchOption":false,"video":"CobraPose.mp4","category":"yoga"},
  "Downward Dog" : {"name":"Downward Dog","image":"DownwardDog.jpg","audio":"DownwardDog.mp3","youtube":"0L4I5rCOK0g","switchOption":false,"video":"DownwardDog.mp4","category":"yoga"},
  "Mountain Pose" : {"name":"Mountain Pose","image":"MountainPose.jpg","audio":"MountainPose.mp3","youtube":"usFj4B1tmu8","switchOption":false,"video":"MountainPose.mp4","category":"yoga"},
  "Side Bend Left" : {"name":"Side Bend Left","image":"SideBend.jpg","audio":"SideBend.mp3","youtube":"Vr-xuDT_Deg","switchOption":false,"video":"SideBend.mp4","category":"yoga"},
  "Side Bend Right" : {"name":"Side Bend Right","image":"SideBendRight.jpg","audio":"SideBendRight.mp3","youtube":"blcE0LPlM34","switchOption":false,"video":"SideBendRight.mp4","category":"yoga"},
  "Forward Fold Hands Behind" : {"name":"Forward Fold Hands Behind","image":"ForwardFoldWithHands.jpg","audio":"ForwardFoldWithHands.mp3","youtube":"KZQASJJvA4I","switchOption":false,"video":"ForwardFoldWithHands.mp4","category":"yoga"},
  "Chair Pose" : {"name":"Chair Pose","image":"ChairPose.jpg","audio":"ChairPose.mp3","youtube":"hm7k57pgXUA","switchOption":false,"video":"ChairPose.mp4","category":"yoga"},
  "Chair Pose Twist Left" : {"name":"Chair Pose Twist Left","image":"ChairPoseTwist.jpg","audio":"ChairPoseTwist.mp3","youtube":"6zRu5kPmsv4","switchOption":false,"video":"ChairPoseTwist.mp4","category":"yoga"},
  "Chair Pose Twist Right" : {"name":"Chair Pose Twist Right","image":"ChairPoseTwistRight.jpg","audio":"ChairPoseTwistRight.mp3","youtube":"qLKRQzvBM3o","switchOption":false,"video":"ChairPoseTwistRight.mp4","category":"yoga"},
  "Wide Leg Stance" : {"name":"Wide Leg Stance","image":"WideLegStance.jpg","audio":"WideLegStance.mp3","youtube":"bVEEhBQdvwc","switchOption":false,"video":"WideLegStance.mp4","category":"yoga"},
  "Wide Leg Stance Arms Up" : {"name":"Wide Leg Stance Arms Up","image":"WideLegStanceArms.jpg","audio":"WideLegStanceArms.mp3","youtube":"2i2KwqBFav4","switchOption":false,"video":"WideLegStanceArms.mp4","category":"yoga"},
  "Wide Leg Forward Fold" : {"name":"Wide Leg Forward Fold","image":"WideLegForward.jpg","audio":"WideLegForward.mp3","youtube":"L3keKYTX8bs","switchOption":false,"video":"WideLegForward.mp4","category":"yoga"},
  "Triangle Left" : {"name":"Triangle Left","image":"Triangle.jpg","audio":"Triangle.mp3","youtube":"3q_3hR4C1lk","switchOption":false,"video":"Triangle.mp4","category":"yoga"},
  "Triangle Right" : {"name":"Triangle Right","image":"TriangleRight.jpg","audio":"TriangleRight.mp3","youtube":"ht_c4dg6KdU","switchOption":false,"video":"TriangleRight.mp4","category":"yoga"},
  "Warrior II (Left Forward)" : {"name":"Warrior II (Left Forward)","image":"Warrior2Right.jpg","audio":"Warrior2Right.mp3","youtube":"BrkAcxHv3HI","switchOption":false,"video":"Warrior2.mp4","category":"yoga"},
  "Warrior II (Right Forward)" : {"name":"Warrior II (Right Forward)","image":"Warrior2.jpg","audio":"Warrior2.mp3","youtube":"s0uxrM5XlKI","switchOption":false,"video":"Warrior2Right.mp4","category":"yoga"},
  "Side Angle Left" : {"name":"Side Angle Left","image":"SideAngle.jpg","audio":"SideAngle.mp3","youtube":"rrwxNOaT8HI","switchOption":false,"video":"SideAngle.mp4","category":"yoga"},
  "Side Angle Right" : {"name":"Side Angle Right","image":"SideAngleRight.jpg","audio":"SideAngleRight.mp3","youtube":"8gmQRxIv5FI","switchOption":false,"video":"SideAngleRight.mp4","category":"yoga"},
  "Tree Pose Left" : {"name":"Tree Pose Left","image":"TreePose.jpg","audio":"TreePose.mp3","youtube":"QclIM7f5iUI","switchOption":false,"video":"TreePose.mp4","category":"yoga"},
  "Tree Pose Right" : {"name":"Tree Pose Right","image":"TreePoseRight.jpg","audio":"TreePoseRight.mp3","youtube":"bpjuLM1rXJo","switchOption":false,"video":"TreePoseRight.mp4","category":"yoga"},
  "Head to Knee Left" : {"name":"Head to Knee Left","image":"HeadToKnee.jpg","audio":"HeadToKnee.mp3","youtube":"Ns9Z60NkwYM","switchOption":false,"video":"HeadToKnee.mp4","category":"yoga"},
  "Head to Knee Right" : {"name":"Head to Knee Right","image":"HeadToKneeRight.jpg","audio":"HeadToKneeRight.mp3","youtube":"m16U3b7zah0","switchOption":false,"video":"HeadToKneeRight.mp4","category":"yoga"},
  "Twist Left" : {"name":"Twist Left","image":"Twist.jpg","audio":"Twist.mp3","youtube":"svThICtK-SQ","switchOption":false,"video":"Twist.mp4","category":"yoga"},
  "Twist Right" : {"name":"Twist Right","image":"TwistRight.jpg","audio":"TwistRight.mp3","youtube":"Dwa2J8dqhHo","switchOption":false,"video":"TwistRight.mp4","category":"yoga"},
  "Lay on Back" : {"name":"Lay on Back","image":"LayOnBack.jpg","audio":"LayOnBack.mp3","youtube":"hyZ1a6Z4VcE","switchOption":false,"video":"LayOnBack.mp4","category":"yoga"},
  "Prep for Shoulder Stand" : {"name":"Prep for Shoulder Stand","image":"PrepForShoulder.jpg","audio":"PrepForShoulder.mp3","youtube":"bkbMNMpXnAk","switchOption":false,"video":"PrepForShoulder.mp4","category":"yoga"},
  "Plow" : {"name":"Plow","image":"Plow.jpg","audio":"Plow.mp3","youtube":"36Aq02xEabk","switchOption":false,"video":"Plow.mp4","category":"yoga"},
  "Shoulder Stand" : {"name":"Shoulder Stand","image":"ShoulderStand.jpg","audio":"ShoulderStand.mp3","youtube":"GhN9k2J5CWs","switchOption":false,"video":"ShoulderStand.mp4","category":"yoga"},
  "Fish Pose" : {"name":"Fish Pose","image":"FishPose.jpg","audio":"FishPose.mp3","youtube":"tj3AyrKMRLk","switchOption":false,"video":"FishPose.mp4","category":"yoga"},
  "Swan" : {"name":"Swan","image":"Swan.jpg","audio":"Swan.mp3","youtube":"AXFx8Dg8F7k","switchOption":false,"video":"Swan.mp4","category":"pilates"},
  "Double Leg Stretch" : {"name":"Double Leg Stretch","image":"DoubleLegStretch.jpg","audio":"DoubleLegStretch.mp3","youtube":"_g0sHVYFniw","switchOption":false,"video":"DoubleLegStretch.mp4","category":"pilates"},
  "Spine Stretch Forward" : {"name":"Spine Stretch Forward","image":"SpineStretchForward.jpg","audio":"SpineStretchForward.mp3","youtube":"Dx_HK7NiiL8","switchOption":false,"video":"SpineStretchForward.mp4","category":"pilates"},
  "Seated Spine Twist" : {"name":"Seated Spine Twist","image":"SeatedSpineTwist.jpg","audio":"SeatedSpineTwist.mp3","youtube":"6VuCmafK9w8","switchOption":false,"video":"SeatedSpineTwist.mp4","category":"pilates"},
  "Leg Pull Front" : {"name":"Leg Pull Front","image":"LegPullFront.jpg","audio":"LegPullFront.mp3","youtube":"wuEf9fR9gXg","switchOption":false,"video":"LegPullFront.mp4","category":"pilates"},
  "Leg Pull Back" : {"name":"Leg Pull Back","image":"LegPullBack.jpg","audio":"LegPullBack.mp3","youtube":"0lRkPJQsPY0","switchOption":false,"video":"LegPullBack.mp4","category":"pilates"},
  "The Hundred" : {"name":"The Hundred","image":"TheHundred.jpg","audio":"TheHundred.mp3","youtube":"7Wn9C649Eyo","switchOption":false,"video":"TheHundred.mp4","category":"pilates"},
  "Rollover" : {"name":"Rollover","image":"Rollover.jpg","audio":"Rollover.mp3","youtube":"Z0BUd_tGRI4","switchOption":false,"video":"Rollover.mp4","category":"pilates"},
  "Shoulder Bridge" : {"name":"Shoulder Bridge","image":"ShoulderBridge.jpg","audio":"ShoulderBridge.mp3","youtube":"x9xuvJUJcLs","switchOption":false,"video":"ShoulderBridge.mp4","category":"pilates"},
  "Back Arm Rowing" : {"name":"Back Arm Rowing","image":"BackArmRow.jpg","audio":"BackArmRow.mp3","youtube":"gmBi-Adb8VU","switchOption":false,"video":"BackArmRow.mp4","category":"pilates"},
  "Swimming" : {"name":"Swimming","image":"Swimming.jpg","audio":"Swimming.mp3","youtube":"9M7MBczuRJ4","switchOption":false,"video":"Swimming.mp4","category":"pilates"},
  "Double Leg Kick" : {"name":"Double Leg Kick","image":"DoubleLegKick.jpg","audio":"DoubleLegKick.mp3","youtube":"W4ykrff_nrU","switchOption":false,"video":"DoubleLegKick.mp4","category":"pilates"},
  "Laying Side Kick" : {"name":"Laying Side Kick","image":"LayingSideKick.jpg","audio":"LayingSideKick.mp3","youtube":"w_vGiuqSscE","switchOption":true,"video":"LayingSideKick.mp4","category":"pilates"},
  "Teaser" : {"name":"Teaser","image":"Teaser.jpg","audio":"Teaser.mp3","youtube":"rGh48bkM6V4","switchOption":false,"video":"Teaser.mp4","category":"pilates"},
  "Wag Your Tail" : {"name":"Wag Your Tail","image":"WagYourTail.jpg","audio":"WagYourTail.mp3","youtube":"TT3DmBivxaE","switchOption":true,"video":"WagYourTail.mp4","category":"pilates"},
  "Corkscrew" : {"name":"Corkscrew","image":"Corkscrew.jpg","audio":"Corkscrew.mp3","youtube":"5g3judn1ZRA","switchOption":false,"video":"Corkscrew.mp4","category":"pilates"},
  "Roll Up" : {"name":"Roll Up","image":"Rollup.jpg","audio":"Rollup.mp3","youtube":"beGeEqv8yCY","switchOption":false,"video":"Rollup.mp4","category":"pilates"},
  "One Leg Circles" : {"name":"One Leg Circles","image":"OneLegCircles.jpg","audio":"OneLegCircles.mp3","youtube":"yjFmcYT2Jw0","switchOption":false,"video":"OneLegCircles.mp4","category":"pilates"},
  "Cat Pose" : {"name":"Cat Pose","image":"CatPose.jpg","audio":"CatPose.mp3","youtube":"FqOCsK8dlrg","switchOption":false,"video":"CatPose.mp4","category":"yoga"},
  "Child Pose" : {"name":"Child Pose","image":"ChildPose.jpg","audio":"ChildPose.mp3","youtube":"wg8nFRNF5hQ","switchOption":false,"video":"ChildPose.mp4","category":"yoga"},
  "Cow Pose" : {"name":"Cow Pose","image":"CowPose.jpg","audio":"CowPose.mp3","youtube":"WVHSC_xwH6A","switchOption":false,"video":"CowPose.mp4","category":"yoga"},
  "Bridge Pose" : {"name":"Bridge Pose","image":"BridgePose.jpg","audio":"BridgePose.mp3","youtube":"t-QU5pCg334","switchOption":false,"video":"BridgePose.mp4","category":"yoga"},
  "Crow Pose" : {"name":"Crow Pose","image":"CrowPose.jpg","audio":"CrowPose.mp3","youtube":"JYVJjK87XVI","switchOption":false,"video":"CrowPose.mp4","category":"yoga"},
  "Staff Pose" : {"name":"Staff Pose","image":"StaffPose.jpg","audio":"StaffPose.mp3","youtube":"ZOiTBnvgZZI","switchOption":false,"video":"StaffPose.mp4","category":"yoga"},
  "Pigeon Pose Left" : {"name":"Pigeon Pose Left","image":"PigeonPoseLeft.jpg","audio":"PigeonPoseLeft.mp3","youtube":"b2VJk7gZNRM","switchOption":false,"video":"PigeonPoseLeft.mp4","category":"yoga"},
  "Pigeon Pose Right" : {"name":"Pigeon Pose Right","image":"PigeonPoseRight.jpg","audio":"PigeonPoseRight.mp3","youtube":"eAtiFXULnwo","switchOption":false,"video":"PigeonPoseRight.mp4","category":"yoga"}
};









