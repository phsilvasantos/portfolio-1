angular.module('app.services').factory('questions',function (QuestionResource,
  serverConfig, $q, $http, youtube, questionCache, formatOptions, JsModel) {

  var Charge = JsModel.extend({
    parsers: {
      created: function(val) {
        return new Date(val * 1000);
      }
    }
  });

  var service = {

    load: function (id) {
      var deferred = $q.defer();

      var question = QuestionResource.get({
          id: id
        },
        function () {
          format(question);
          questionCache.put(question.id, question);
          deferred.resolve(question);
        },
        function (data) {
          var error = 'Error occurred.';
          if (404 === data.status) {
            error = 'Question not found';
          }
          if (0 === data.status) {
            error = 'Connection error';
          }
          deferred.reject(error);
        }
      );

      return deferred.promise;
    },

    loadAnswers: function (id) {
      var deferred = $q.defer();
      var reject = function (data) {
        deferred.reject(data);
      };

      var answers = [];
      var result = QuestionResource.followingAnswers({id: id}, function () {
        answers = answers.concat(formatAnswers(result.answers, 'Friend', result.avatar_friend_hidden));
        result = QuestionResource.outsideAnswers({id: id}, function () {
          answers = answers.concat(formatAnswers(result.answers, 'Someone', result.avatar_someone));
          deferred.resolve(_.shuffle(answers));
        }, reject);
      }, reject);
      return deferred.promise;
    },

    loadCharge: function(answerId) {
      return $http.get(serverConfig.url + '/api/answers/' + answerId + '/charges/').then(function (response) {
        var data = response.data && response.data !== 'null' ? response.data : null;
        return new Charge(data);
      });
    },

    unsignFromPetition: function (id, answer_id) {
      return $http({
        method: 'DELETE',
        url: serverConfig.url + '/api/petition/' + id + '/answers/' + answer_id
      });
    }
  };

  function formatAnswers(answers, defaultUsername, defaultAvatar) {
    _(answers).each(function (answer) {
      if (!answer.user) {
        answer.user = {
          username: defaultUsername,
          avatar_file_name: defaultAvatar
        };
      }
    });
    return answers;
  }

  function format(question) {
    question.published_at_date = new Date(question.published_at);
    if (question.started_at) {
      question.started_at_date = new Date(question.started_at);
      question.finished_at_date = new Date(question.finished_at);
    }
    question.expired_at = new Date(question.expire_at ? question.expire_at : question.published_at_date.getTime() + 86400000);

    /* 1 day */
    question.expired = new Date() > question.expired_at;
    question.optionsById = {};
    question.options = _(question.options).sortBy(function (item) {
      return item.id;
    });
    question.answer = answer;
    question.getOptionLabel = function (id) {
      return this.optionsById[id] ? this.optionsById[id].title : '';
    };
    question.votes_count = formatOptions(question.options);
    question.educationalContextByTypes = {};
    _(question.educational_context).each(function (item) {
      if (!question.educationalContextByTypes[item.type]) {
        question.educationalContextByTypes[item.type] = [];
      }
      if (item.type === 'video') {
        item.preview = youtube.generatePreviewLink(youtube.parseId(item.text));
      }
      question.educationalContextByTypes[item.type].push(item);
    });
    _(question.options).each(function (item) {
      question.optionsById[item.id] = item;
    });
  }

  function answer(data) {
    return $http({
      method: 'POST',
      url: serverConfig.url + '/api/poll/question/' + this.id + '/answer/add',
      data: angular.element.param(data)
    }).then(function(resp) {
      return resp.data;
    });
  }

  return service;

}).factory('QuestionResource',function ($resource, serverConfig) {
  return $resource(serverConfig.url + '/api/poll/question/:id', null, {
    followingAnswers: {
      method: 'GET',
      isArray: false,
      url: serverConfig.url + '/api/poll/question/:id/answers/influence'
    },
    outsideAnswers: {
      method: 'GET',
      isArray: false,
      url: serverConfig.url + '/api/poll/question/:id/answers/influence/outside'
    }
  });
}).factory('questionCache', function ($cacheFactory) {
  return $cacheFactory('questionCache', {capacity: 20});
});
