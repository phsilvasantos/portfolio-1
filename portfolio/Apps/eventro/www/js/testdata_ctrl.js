/**
 * Adds Test Data to DB - dont have UI to add all test data easily to Firebase
 */
angular.module('starter.controllers')
.controller('TestCtrl', function($scope, $firebaseArray, AppConstants, $ionicModal, LocationCategories) {

  var firebaseUrl = AppConstants.getEnvVars().firebase;

  $scope.seedDb = function() {

    // get the refs to the db
    var eventsRef = new Firebase(firebaseUrl+"/events");
    var locationsRef = new Firebase(firebaseUrl+"/locations");
    var scheduledItemsRef = new Firebase(firebaseUrl+"/scheduled_events");
    var locationCategoriesRef = new Firebase(firebaseUrl+"/location_categories");
    var events = $firebaseArray(eventsRef);
    var locations = $firebaseArray(locationsRef);
    var scheduledItems = $firebaseArray(scheduledItemsRef);
    var locationCategories = $firebaseArray(locationCategoriesRef);

    /**
     * TechXplore - START
     */
    events.$add({
      name: "TechXplore",
      start: (new Date("Sep 3, 2015 10:30:00")).getTime(),
      end: (new Date("Sep 3, 2015 20:00:00")).getTime()
    }).then(function(ref) {

      // get the event id
      var eventId = ref.key();

      // get the record
      var eventDetails = events.$getRecord(eventId);

      /**
       * add locations - START
       */
      locations.$add({
            name: "The Life Church",
            description: "TechXplor is Belfast's largest and best-value home-grown technology event which aimes to help and inspire people across Belfast, the UK and Irelad to bring their tech ideas to the world.",
            address: "The Life Church\nBruce Street\nBelfast\nBT2 7JD",
            tel: "028 9026 7072",
            email: "askaquestion@mwadvocate.com",
            web: "http://www.techxplore.co",
            latitude: 54.593071,
            longitude: -5.932412,
            eventId: eventId,
            category: "conf_business",
            'event': eventDetails,
            number_of_events: 9
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Panel 1 – Start-Ups",
          description: "From Ireland to the world: tech start-ups from all over Ireland will show how they took the seed of their idea to a fledgling business and outline their ambition to succeed globally, including Danny Turley from Performa Sports and Tracy Keogh.",
          start: (new Date("Sep 3, 2015 10:30:00")).getTime(),
          end: (new Date("Sep 3, 2015 11:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Panel 2 – Media",
          description: "Paywall versus free news - the challenge of monetising news: expert on Native content Amanda Hale from Talking Points Memo and Aine Kerr from Storyful will provide insight on the challenges facing news gatherers in the 21st century. They will be joined by BelfastLive’s Chris Sherrard, who is leading the way in digital media locally.",
          start: (new Date("Sep 3, 2015 11:40:00")).getTime(),
          end: (new Date("Sep 3, 2015 12:40:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "ThatLot Social Media Masterclass",
          description: "David Levin from ThatLot is the brains behind some of the best twitter feeds, including BBC shows The Apprentice & The Voice, L'Oreal Men Expert & Rufus the Hawk. He's back at TechXplore to show you how to make your 140 characters count.",
          start: (new Date("Sep 3, 2015 14:00:00")).getTime(),
          end: (new Date("Sep 3, 2015 14:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Innovator Media Workshop",
          description: "Join Amanda Hale from Talking Points Memo in an intimate roundtable workshop, where you can ask all your burning questions on monetising news and native content.",
          start: (new Date("Sep 3, 2015 14:30:00")).getTime(),
          end: (new Date("Sep 3, 2015 15:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Panel 3 – Music",
          description: "Tech and creative industries: Technology has revolutionised how artists deliver their music to the audience. Music guru turned angel investor Jon Vanhala, digital music expert Bill Campbell and Paul Hamill from local company Inflyte will look at how the industry is adapting.",
          start: (new Date("Sep 3, 2015 14:30:00")).getTime(),
          end: (new Date("Sep 3, 2015 15:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Innovator Music Workshop",
          description: "Music gurus Jon Vanhala & Bill Campbell will take their places at the Innovator Media Workshops to answer your questions on digital music. They will give a unique insight on the sector from their experience with some of the biggest global music labels and their work with start-ups.",
          start: (new Date("Sep 3, 2015 15:30:00")).getTime(),
          end: (new Date("Sep 3, 2015 16:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Panel 4 – Health",
          description: "Measuring health with technology: Can technology improve health outcomes? We will hear from Tom Lynch from Experior on how they are using their innovation to help medical experts in the public sector improve diagnosis, and Mark Lee from the Department of Health will give the view from inside public sector.",
          start: (new Date("Sep 3, 2015 15:40:00")).getTime(),
          end: (new Date("Sep 3, 2015 16:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "VC Meet & Greet",
          description: "After the four panel sessions have ended you will have the chance to join the Venture Capital Meet & Greet. Over a drink you will be able to ask them about what they look for in a start up and get some tips on how to wow investors in a pitch session.",
          start: (new Date("Sept 3, 2015 18:00:00")).getTime(),
          end: (new Date("Sept 3, 2015 18:40:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Tech Cabaret",
          description: "When all the formalities are over, you will be able to kick back and relax to Belfast's first Tech Cabaret. Curated by Belfast's own P T Barnum, creator of Culture Night, Adam Turkington, the Cabaret will feature Ursula Burns, Caolan McBride and Street Countdown, all compered by Stephen Beggs.",
          start: (new Date("Sept 3, 2015 19:30:00")).getTime(),
          end: (new Date("Sept 3, 2015 20:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });
      /**
       * add locations - END
       */
    });
    /**
     * TechXplore - END
     */

    /**
     * Belfast Homecoming 2015 - START
     */
    events.$add({
      name: "Belfast Homecoming 2015",
      start: (new Date("Oct 7, 2015 13:00:00")).getTime(),
      end: (new Date("Oct 10, 2015 20:00:00")).getTime()
    }).then(function(ref) {

      // get the event id
      var eventId = ref.key();

      // get the record
      var eventDetails = events.$getRecord(eventId);

      /**
       * add locations - START
       */
      locations.$add({
            name: "East Belfast Visitors Centre",
            description: "Non-Profit Organisation",
            address: "Avalon House\n278-280 Newtownards Rd\nBelfast, County Antrim\nBT4 1HE",
            tel: "028 9045 1900",
            web: "http://www.eastbelfastpartnership.org/",
            latitude: 54.599217,
            longitude: -5.895392,
            eventId: eventId,
            'event': eventDetails,
            category: "conf_business",
            number_of_events: 0
      });

      locations.$add({
            name: "Stormont Parliament Buildings",
            description: "Parliament Buildings is home to the Northern Ireland Assembly, the legislative body for Northern Ireland. There are several ways you can visit Parliament Buildings. Open to the public between 9.00am and 4.00pm Monday to Friday, you can see first-hand the building and beautiful surroundings of the Stormont Estate. While the Assembly is in session free public tours are available Monday - Friday at 11am and 2pm. During July, August, Halloween and Easter recess tours starting on the hour are available between 10am and 3pm (please check www.niassembly.gov.uk for changes to tour times).",
            address: "Parliament Buildings\nUpper Newtownards Road\nBT4 3XX",
            tel: "028 90521802",
            email: "info@niassembly.gov.uk",
            web: "http://www.niassembly.gov.uk",
            latitude: 54.604982,
            longitude: -5.832115,
            eventId: eventId,
            'event': eventDetails,
            category: "conf_business",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Into the East",
          description: "Visit to East Belfast Visitors Centre and Stormont.",
          start: (new Date("Oct 7, 2015 13:00:00")).getTime(),
          end: (new Date("Oct 7, 2015 13:40:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "MovieHouse Cinemas",
            description: "This multiplex cinema branch screens the latest big-name movies and comes with secure parking...",
            address: "14 Dublin Rd\nBelfast\nBT2 7HN",
            tel: "028 9024 5700",
            web: "http://moviehouse.co.uk",
            latitude: 54.592187,
            longitude: -5.931665,
            eventId: eventId,
            'event': eventDetails,
            category: "conf_business",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Movie - Alive from Divis Flats",
          description: "With Director Eleanor McGrath and movie subject Hugo Straney from Toronto. MovieHouse Cinema, Dublin Rd.",
          start: (new Date("Oct 7, 2015 17:30:00")).getTime(),
          end: (new Date("Oct 7, 2015 18:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "Belfast City Hall",
            description: "Belfast City Hall is the civic building of Belfast City Council. Located in Donegall Square, Belfast, County Antrim, Northern Ireland, it faces north and effectively divides the commercial and business areas of the city centre.",
            address: "Donegall Square S\nBelfast\nAntrim\nBT1 5GS",
            tel: "028 9032 0202",
            web: "http://belfastcity.gov.uk",
            latitude: 54.596499,
            longitude:  -5.930197,
            eventId: eventId,
            'event': eventDetails,
            category: "general",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Reception of Welcome",
          description: "With the Lord Mayor of Belfast Arder Carson in Belfast City Hall. Guest of Honour: Rep. Mike Cusick, President American Irish Legislators Society of NY.",
          start: (new Date("Oct 7, 2015 18:45:00")).getTime(),
          end: (new Date("Oct 7, 2015 20:45:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "The Cloth Ear, Merchant Hotel",
            description: "Classy pub-style menu in a buzzy bar with quirky decor, situated in an upscale hotel.",
            address: "35-39 Waring St\nBelfast\nCounty Antrim\nBT1 2DY",
            tel: "028 9026 2719",
            web: "http://themerchanthotel.com",
            email: "info@themerchanthotel.com",
            latitude:  54.601105,
            longitude:  -5.926068,
            eventId: eventId,
            'event': eventDetails,
            category: "bar_club",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Conference Club @ The Cloth Ear",
          description: "",
          start: (new Date("Oct 7, 2015 22:00:00")).getTime(),
          end: (new Date("Oct 7, 2015 23:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "Malone Golf Club",
            description: "Malone is a fine championship course situated on 330 acres of undulating wooded parkland. Its 27 holes of secluded gently undulating parkland countryside is just 5 miles from Belfast City centre. The centre piece of the course is the beautiful natural trout lake which extends for some 25 acres. The course is a real challenge with mature trees shaping many of the holes with the lake first comes into play on the 13th. Beware the 15th where the tee shot to a tricky undulating green is over water all the way. Also the 18th is daunting where almost any ball to the right of the green is water bound.",
            address: "240 Upper Malone Rd\nBelfast\nBT17 9LB",
            tel: "028 9061 2758",
            web: "http://malonegolfclub.co.uk",
            email: "admin@malonegolfclub.co.uk",
            latitude:  54.538604,
            longitude:  -5.978372,
            eventId: eventId,
            'event': eventDetails,
            category: "general",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "A Day on the Green",
          description: "Hosted by Clubs For Hire at Malone Golf Club.",
          start: (new Date("Oct 8, 2015 11:00:00")).getTime(),
          end: (new Date("Oct 8, 2015 13:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "New Ulster University Belfast Campus",
            description: "Belfast campus is situated in the artistic and cultural centre of the city; the Cathedral Quarter.",
            address: "25-51 York St\nBelfast\nCounty Antrim\nBT15 1ED",
            tel: "028 7012 3456",
            web: "http://ulster.ac.uk",
            latitude:  54.603932,
            longitude:  -5.929092,
            eventId: eventId,
            'event': eventDetails,
            category: "general",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Belfast Walking Tour",
          description: "New Ulster University Belfast Campus Folktown Market, Bank Square The Hudson.",
          start: (new Date("Oct 8, 2015 11:00:00")).getTime(),
          end: (new Date("Oct 8, 2015 13:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "Royal Courts of Justice",
            description: "The Royal Courts of Justice in Belfast is the home of the Court of Judicature of Northern Ireland established under the Judicature Act 1978.",
            address: "Chichester St\nBelfast\nBT1 3JY",
            tel: "030 0200 7812",
            email: "adminoffice@courtsni.gov.uk",
            web: "http://courtsni.gov.uk",
            latitude:  54.597510,
            longitude:  -5.922880,
            eventId: eventId,
            'event': eventDetails,
            category: "general",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Legal Symposium",
          description: "The Inn of Court – Royal Courts of Justice, Belfast.",
          start: (new Date("Oct 8, 2015 11:00:00")).getTime(),
          end: (new Date("Oct 8, 2015 14:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "Hillsborough Castle",
            description: "Official residence of both the Queen and Secretary of State for Northern Ireland (open Apr to Sep).",
            address: "Main Street\nHillsborough\nBT26 6AG",
            tel: "028 9268 1308",
            web: "http://hrp.org.uk",
            latitude:  54.461166,
            longitude:  -6.085696,
            eventId: eventId,
            'event': eventDetails,
            category: "general",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Hillsborough Castle",
          description: "Bus leaves from Jury’s Hotel.",
          start: (new Date("Oct 8, 2015 15:30:00")).getTime(),
          end: (new Date("Oct 8, 2015 18:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "Belfast Dockland",
            address: "Dock St\nBelfast\nBT15 1WZ",
            latitude:  54.609239,
            longitude:  -5.921534,
            eventId: eventId,
            'event': eventDetails,
            category: "general",
            number_of_events: 2
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Pop-Up Banquet & Opening Ceremony",
          description: "In the heart of Belfast’s Dockland Compere: Geraldine Hughes Menu: Curated by Niall McKenna Guest Speaker: CM Daniel Dromm Chair of Education Committee, NY City Council Featuring: The Belfast Community Gospel Choir",
          start: (new Date("Oct 8, 2015 19:00:00")).getTime(),
          end: (new Date("Oct 8, 2015 22:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Invent Awards Dinner",
          description: "Over 600 investors, entrepreneurs, executives, top research scientists, and elected officials will gather at the INVENT Awards. INVENT is a competition for prototype technologies to discover the best new inventions in the country. To see the 2015 finalists and to book your ticket check out the following link - www.invent2015.co",
          start: (new Date("Oct 8, 2015 19:00:00")).getTime(),
          end: (new Date("Oct 8, 2015 22:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "The National Grande Cafe",
            address: "62 High St\nBelfast\nCounty Antrim\nBT1 2BE",
            tel: "028 9031 1130",
            web: "http://thenationalbelfast.com",
            latitude: 54.600449,
            longitude: -5.926018,
            eventId: eventId,
            'event': eventDetails,
            category: "bar_club",
            number_of_events: 1
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Conference Club @ The National",
          start: (new Date("Oct 8, 2015 19:00:00")).getTime(),
          end: (new Date("Oct 8, 2015 23:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });

      locations.$add({
            name: "Titanic Belfast",
            address: "Titanic House\n6 Queens Rd\nBelfast BT3 9DT",
            tel: "+44 (0) 28 9076 6300",
            email: "info@titanicquarter.com",
            web: "http://www.titanic-quarter.com/",
            latitude: 54.607763,
            longitude: -5.908448,
            eventId: eventId,
            'event': eventDetails,
            category: "conf_business",
            number_of_events: 11
      }).then(function(ref){

        // get the location id
        var locationId = ref.key();

        // get the record
        var locationDetails = locations.$getRecord(locationId);
        var locationToAdd = {

          'address': locationDetails.address ? locationDetails.address : null,
          'category': locationDetails.category ? locationDetails.category : null,
          'email': locationDetails.email ? locationDetails.email : null,
          'latitude': locationDetails.lat ? locationDetails.lat : null,
          'longitude': locationDetails.lng ? locationDetails.lng : null,
          'name': locationDetails.name ? locationDetails.name : null,
          'description': locationDetails.description ? locationDetails.description : null,
          'tel': locationDetails.tel ? locationDetails.tel : null,
          'web': locationDetails.web ? locationDetails.web : null,
          'number_of_events': locationDetails.number_of_events ? locationDetails.number_of_events : null
        };

        /**
         * add scheduled_items - START
         */
        scheduledItems.$add({
          name: "Continental Breakfast and Registration",
          description: "A continental Breakfast to enjoy while you Register",
          start: (new Date("Oct 9, 2015 08:00:00")).getTime(),
          end: (new Date("Oct 9, 2015 12:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Five years to Wow the World — Belfast by 2020",
          description: "Chair: Peter Dixon, Chair Phoenix Natural Gas. Panel: Judith Totten, MD Keys Commercial Finance & Board Member Invest NI Rep Brian Kavanagh New York State Assemblymember for Manhattan, Paddy Nixon Vice-Chancellor University of Ulster, Suzanne Wylie CEO Belfast City Council.",
          start: (new Date("Oct 9, 2015 08:20:00")).getTime(),
          end: (new Date("Oct 9, 2015 10:20:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "The Three Things Needed to Make Belfast a Business Powerhouse",
          description: "Chair: John J. Reilly, Squire Patton Boggs, New York Panel: Ann Gallagher, Director of Engineering, Head of NI Operations Tyco, Michael Ryan, CEO Bombardier, Jack Butler, CEO Market Resource Partners, Pete Boyle, Founder and CEO Argento",
          start: (new Date("Oct 9, 2015 09:15:00")).getTime(),
          end: (new Date("Oct 9, 2015 10:15:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Welcome to a City Reborn",
          description: "Lord Mayor of Belfast Arder Carson, Richard Donnan, MD Ulster Bank.",
          start: (new Date("Oct 9, 2015 09:00:00")).getTime(),
          end: (new Date("Oct 9, 2015 11:00:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Moving Up a Gear: Game-Changers Which Can Transform Belfast",
          description: "Chair: Gavin Robinson MP Film & TV: Kieran Doherty, Joint MD and Co-Founder Stellify Waterfront Convention Centre: Cllr Deirdre Hargey, Chair City Growth and Regeneration Committee Belfast City Council Technology: Jackie Henry, Senior Partner Deloitte Hospitality: Howard Hastings, Hastings Hotels Entrepreneurship: Speaker from E Spark Edinburgh TBC.",
          start: (new Date("Oct 9, 2015 09:45:00")).getTime(),
          end: (new Date("Oct 9, 2015 10:30:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "BUCKETBOARD: Transforming the World, One Skateboard at a Time",
          description: "Mac Premo (New York).",
          start: (new Date("Oct 9, 2015 10:15:00")).getTime(),
          end: (new Date("Oct 9, 2015 11:15:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Learning from Bilbao and Partnering for Progress",
          description: "With Mayor Juan Mari Aburto of Bilbao interviewed by Mark Carruthers, BBC.",
          start: (new Date("Oct 9, 2015 10:25:00")).getTime(),
          end: (new Date("Oct 9, 2015 11:25:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Future Cities",
          description: "Chair: Mary McKenna, Entpreneur, Founder Irish International Business Network (London) Ard-mhéara Bhaile Átha Ciath (Lord Mayor of Dublin) Críona Ní Dhálaigh Rep Linda B. Rosenthal, Member New York Assembly, representative for Manhattan Liam Lynch, Founder Irish Diaspora Angel Network (New York) Mary.",
          start: (new Date("Oct 9, 2015 10:45:00")).getTime(),
          end: (new Date("Oct 9, 2015 12:45:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Progress, Prosperity and Peaceful Streets",
          description: "George Hamilton, PSNI Chief Constable, Liam Maskey, Director Intercomm, Peter Osborne, CEO Community Relations Council.",
          start: (new Date("Oct 9, 2015 11:15:00")).getTime(),
          end: (new Date("Oct 9, 2015 13:15:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Looking East and South to our Neighbours",
          description: "Conor McGinn MP, Conor Burns MP, Philippa Whitford MP, Jennie McShannon, CEO Irish in Britain, Minister Seán Sherlock TD.",
          start: (new Date("Oct 9, 2015 11:45:00")).getTime(),
          end: (new Date("Oct 9, 2015 12:45:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});

        scheduledItems.$add({
          name: "Boardroom Dialogue Sessions",
          description: "1. Innovation and Start-Ups\n\n2. The proposition for the visitor & Citizen (Culture & Arts Hospitality & Tourism)\n\n3. Peacebuilding, Diversity and Reconciliation.",
          start: (new Date("Oct 9, 2015 12:15:00")).getTime(),
          end: (new Date("Oct 9, 2015 14:15:00")).getTime(),
          locationId: locationId,
          location: locationToAdd,
          eventId: eventId
        }).then(function(ref){});
        /**
         * add scheduled_items - END
         */
      });
      /**
       * add locations - END
       */
    });
    /**
     * Belfast Homecoming 2015 - END
     */

    /**
     * Location Categories - START
     */
    locationCategories.$add({
      name: "bar_club",
      asString: "Bar/Club"
    });

    locationCategories.$add({
      name: "conf_business",
      asString: "Conf/Business"
    });

    locationCategories.$add({
      name: "culture",
      asString: "Culture"
    });

    locationCategories.$add({
      name: "emergency",
      asString: "Emergency"
    });

    locationCategories.$add({
      name: "food",
      asString: "Food"
    });

    locationCategories.$add({
      name: "general",
      asString: "General"
    });

    locationCategories.$add({
      name: "information",
      asString: "Information"
    });

    locationCategories.$add({
      name: "music",
      asString: "Music"
    });

    locationCategories.$add({
      name: "my_schedule",
      asString: "My Schedule"
    });

    locationCategories.$add({
      name: "parking",
      asString: "Parking"
    });

    locationCategories.$add({
      name: "toilets",
      asString: "Toilets"
    });

    locationCategories.$add({
      name: "transport",
      asString: "Transport"
    });

    /**
     * Location Categories - END
     */
  };
});