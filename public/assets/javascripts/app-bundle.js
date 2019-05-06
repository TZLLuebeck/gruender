var app, dependencies, hidebody;

dependencies = ['ui.router', 'restangular', 'ngStorage', 'permission', 'permission.ui', 'ngFileUpload', 'toaster', 'ngSanitize', 'ui.tinymce'];

app = angular.module('gruenderviertel', dependencies);

app.config(["$httpProvider", function($httpProvider) {
  $httpProvider.interceptors.push('tokenInterceptor');
  return $httpProvider.interceptors.push('responseInterceptor');
}]);

hidebody = function() {
  return $('#bodycover').removeClass("in");
};

app.run(["User", "TokenContainer", "$rootScope", "$state", "$stateParams", "Rails", "$transitions", function(User, TokenContainer, $rootScope, $state, $stateParams, Rails, $transitions) {
  if (TokenContainer.get()) {
    console.log('Retrieving User from Token');
    User.currentUser().then(function(user) {
      User.user = user;
      console.log('User Retrieved from Token');
      return $rootScope.$broadcast('user:stateChanged');
    }, function(error) {
      return console.log('Couldn\'t retrieve User.');
    });
  }
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $transitions.onBefore({}, function(transition) {
    hidebody();
    $rootScope.lastState = transition.from();
    return $rootScope.lastStateParams = transition.params('from');
  });
  $rootScope.$on('$viewContentLoaded', function(event, viewConfig) {
    console.log("VIEW HAS BEEN LOADED");
    return $('#bodycover').addClass("in");
  });
  return $transitions.onSuccess({}, function($document, $location, $anchorScroll) {
    if ($location && $location.hash()) {
      return $anchorScroll();
    } else {
      return document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  });
}]);

angular.module('gruenderviertel').run(["$q", "PermRoleStore", "User", function($q, PermRoleStore, User) {
  PermRoleStore.defineRole('anonymous', function(stateParams) {
    var defer;
    defer = $q.defer();
    if (User.isAuthenticated()) {
      defer.reject();
    } else {
      defer.resolve();
    }
    return defer.promise;
  });
  PermRoleStore.defineRole('registered', function(stateParams) {
    var defer;
    defer = $q.defer();
    if (User.isAuthenticated()) {
      defer.resolve();
    } else {
      defer.reject;
    }
    return defer.promise;
  });
  PermRoleStore.defineRole('administrative', function(stateParams) {
    var defer;
    defer = $q.defer();
    User.getRole().then(function(role) {
      if (!role) {
        defer.reject();
      }
      if (role = 'admin' || (role = 'data')) {
        return defer.resolve();
      } else {
        return defer.reject();
      }
    }, function() {
      return defer.reject();
    });
    return defer.promise;
  });
  return PermRoleStore.defineRole('admin', function(stateParams) {
    var defer;
    defer = $q.defer();
    User.getRole().then(function(role) {
      if (!role) {
        defer.reject();
      }
      if (role = 'admin' || (role = 'data')) {
        return defer.resolve();
      } else {
        return defer.reject();
      }
    }, function() {
      return defer.reject();
    });
    return defer.promise;
  });
}]);

angular.module('gruenderviertel').config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $locationProvider) {
  console.log("Configuring Routes.");
  $urlRouterProvider.otherwise(function($injector) {
    var $state;
    $state = $injector.get("$state");
    return $state.go('root.home');
  });
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('');
  return $stateProvider.state('root', {
    url: '',
    abstract: true,
    views: {
      'header@': {
        templateUrl: 'assets/views/common/navbar.html',
        controller: 'NavCtrl',
        controllerAs: 'nav'
      },
      'footer@': {
        templateUrl: 'assets/views/common/footer.html'
      }
    }
  }).state('root.home', {
    url: '/',
    views: {
      'body@': {
        templateUrl: 'assets/views/common/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      }
    },
    resolve: {
      most_used: ["Community", function(Community) {
        return Community.getMostUsed().then(function(response) {
          return response;
        }, function(error) {
          return [];
        });
      }],
      featured: ["Project", function(Project) {
        return Project.getFeatured().then(function(response) {
          return response;
        }, function(error) {
          return [];
        });
      }]
    }
  }).state('root.profile', {
    url: '/profil/:id',
    views: {
      'body@': {
        templateUrl: 'assets/views/users/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      }
    },
    params: {
      id: null
    },
    resolve: {
      instance: ["$stateParams", "Helper", "User", function($stateParams, Helper, User) {
        var id;
        console.log("CREATING PROFILE INSTANCE");
        id = $stateParams.id;
        return User.getUser(id).then(function(response) {
          console.log("profile returned");
          console.log(response);
          return response;
        }, function(error) {
          console.log("Could not get profile.");
          Helper.goBack();
          return null;
        });
      }]
    }
  }).state('root.register', {
    url: '/registrierung',
    views: {
      'body@': {
        templateUrl: 'assets/views/users/registration.html',
        controller: 'RegistrationCtrl',
        controllerAs: 'reg'
      }
    },
    params: {
      user: null
    }
  }).state('root.profile.editprofile', {
    url: '/edit',
    views: {
      'body@': {
        templateUrl: 'assets/views/users/edit.html',
        controller: 'ProfileEditCtrl',
        controllerAs: 'edit'
      }
    },
    resolve: {
      instance: ["User", function(User) {
        return User.currentUser().then(function(response) {
          return response;
        }, function(error) {
          Helper.goBack();
          return null;
        });
      }]
    }
  }).state('root.passwordrecovery', {
    url: '/recover',
    views: {
      'body@': {
        templateUrl: 'assets/views/users/password_recovery.html',
        controller: 'RecoveryCtrl',
        controllerAs: 'recovery'
      }
    }
  }).state('root.pmwrite', {
    url: '/pm_verfassen',
    views: {
      'body@': {
        templateUrl: 'assets/views/users/newpm.html',
        controller: 'PMWriteCtrl',
        controllerAs: 'message'
      }
    }
  }).state('root.project', {
    url: '/projekt/:id',
    views: {
      'body@': {
        templateUrl: 'assets/views/projects/project.html',
        controller: 'ProjectCtrl',
        controllerAs: 'project'
      }
    },
    params: {
      id: null
    },
    resolve: {
      instance: ["$stateParams", "Helper", "Project", function($stateParams, Helper, Project) {
        var id;
        id = $stateParams.id;
        if (id !== null) {
          return Project.getOne($stateParams.id).then(function(response) {
            return response;
          }, function(error) {
            Helper.goBack();
            return null;
          });
        } else {
          Helper.goBack();
          return null;
        }
      }]
    }
  }).state('root.createproject', {
    url: '/projekt/neu',
    views: {
      'body@': {
        templateUrl: 'assets/views/projects/create.html',
        controller: 'CreateProjectCtrl',
        controllerAs: 'create'
      }
    },
    data: {
      permissions: {
        except: 'anonymous',
        redirectTo: 'root.register'
      }
    }
  }).state('root.project.editproject', {
    url: '/bearbeiten',
    views: {
      'body@': {
        templateUrl: 'assets/views/projects/edit.html',
        controller: 'EditProjectCtrl',
        controllerAs: 'edit'
      }
    },
    data: {
      permissions: {
        except: 'anonymous'
      }
    }
  }).state('root.browseprojects', {
    url: '/projekte/:category',
    views: {
      'body@': {
        templateUrl: 'assets/views/projects/filter.html',
        controller: 'ProjectFilterCtrl',
        controllerAs: 'filter'
      }
    },
    params: {
      category: null
    },
    resolve: {
      projects: ["$stateParams", "Helper", "Project", function($stateParams, Helper, Project) {
        var category;
        category = $stateParams.category;
        if (category !== null) {
          return Project.getByCategory(category).then(function(response) {
            return response;
          }, function(error) {
            return Helper.goBack();
          });
        } else {
          Helper.goBack();
          return null;
        }
      }]
    }
  }).state('root.communityoverview', {
    url: '/communities',
    views: {
      'body@': {
        templateUrl: 'assets/views/communities/overview.html',
        controller: 'CommunityOverviewCtrl',
        controllerAs: 'coc'
      }
    },
    resolve: {
      list: ["Helper", "Community", function(Helper, Community) {
        return Community.get_all().then(function(list) {
          return list;
        }, function(error) {
          Helper.goBack();
          return null;
        });
      }]
    }
  }).state('root.community', {
    url: '/community/:id',
    views: {
      'body@': {
        templateUrl: 'assets/views/communities/community.html',
        controller: 'CommunityCtrl',
        controllerAs: 'community'
      }
    },
    params: {
      id: null
    },
    resolve: {
      instance: ["$stateParams", "Helper", "Community", function($stateParams, Helper, Community) {
        var id;
        id = $stateParams.id;
        if (id !== null) {
          return Community.returnCommunity($stateParams.id).then(function(response) {
            return response;
          }, function(error) {
            Helper.goBack();
            return null;
          });
        } else {
          Helper.goBack();
          return null;
        }
      }]
    }
  }).state('root.admin', {
    url: '/admin',
    abstract: true,
    data: {
      permissions: {
        only: 'admin',
        redirectTo: 'root.home'
      }
    }
  }).state('root.admin.usermanagement', {
    url: '/accounts',
    views: {
      'body@': {
        templateUrl: 'assets/views/admin/users.html',
        controller: 'UserManagementCtrl',
        controllerAs: 'users'
      }
    }
  }).state('root.admin.projectmanagement', {
    url: '/projekte',
    views: {
      'body@': {
        templateUrl: 'assets/views/admin/projects.html',
        controller: 'ProjectManagementCtrl',
        controllerAs: 'projects'
      }
    }
  }).state('root.admin.communitymanagement', {
    url: '/communities',
    views: {
      'body@': {
        templateUrl: 'assets/views/admin/communities.html',
        controller: 'CommunitiyManagementCtrl',
        controllerAs: 'communities'
      }
    }
  }).state('root.admin.reports', {
    url: '/meldungen',
    views: {
      'body@': {
        templateUrl: 'assets/views/admin/reports.html',
        controller: 'ReportCtrl',
        controllerAs: 'reports'
      }
    }
  }).state('root.datenschutz', {
    url: '/Datenschutz',
    views: {
      'body@': {
        templateUrl: 'assets/views/singletons/datenschutz.html'
      }
    }
  }).state('root.impressum', {
    url: '/Impressum',
    views: {
      'body@': {
        templateUrl: 'assets/views/singletons/impressum.html'
      }
    }
  }).state('root.nutzungsbedingungen', {
    url: '/Nutzungsbedingungen',
    views: {
      'body@': {
        templateUrl: 'assets/views/singletons/agb.html'
      }
    }
  }).state('root.fablab', {
    url: '/FabLab_Luebeck',
    views: {
      'body@': {
        templateUrl: 'assets/views/singletons/fablab.html'
      }
    }
  }).state('root.geschaeftsmodelle', {
    url: '/Geschaeftsmodelle_4.0',
    views: {
      'body@': {
        templateUrl: 'assets/views/singletons/geschaeftsmodelle.html'
      }
    }
  }).state('root.openinnovation', {
    url: '/Open_Innovation',
    views: {
      'body@': {
        templateUrl: 'assets/views/singletons/open_innovation.html'
      }
    }
  }).state('root.kontakt', {
    url: '/Kontakt',
    views: {
      'body@': {
        templateUrl: 'assets/views/singletons/kontakt.html'
      }
    }
  });
}]);

angular.module('gruenderviertel').directive('anchormove', (function(_this) {
  return ["$document", "$window", "$anchorScroll", "$location", function($document, $window, $anchorScroll, $location) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        if ($location.hash()) {
          return $anchorScroll();
        } else {
          return document.body.scrollTop = document.documentElement.scrollTop = 0;
        }
      }
    };
  }];
})(this));

angular.module('gruenderviertel').directive('onScrollToBottom', (function(_this) {
  return ["$document", "$window", function($document, $window) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        $document.bind("scroll", (function(_this) {
          return function() {
            if ($window.pageYOffset + $window.innerHeight >= element.height()) {
              return scope.$apply(attrs.onScrollToBottom);
            }
          };
        })(this));
        return scope.$on('$destroy', function() {
          return $document.unbind('scroll');
        });
      }
    };
  }];
})(this));

angular.module('gruenderviertel').directive('scrolltop', (function(_this) {
  return ["$document", "$window", function($document, $window) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.bind('click', (function(_this) {
          return function() {
            return $window.scrollTo(0, 0);
          };
        })(this));
        return scope.$on('$destroy', function() {
          return element.unbind('click');
        });
      }
    };
  }];
})(this));

angular.module('gruenderviertel').directive('summernote', (function(_this) {
  return ["$document", "$window", function($document, $window) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        return $document.ready(function() {
          return $('#summernote').summernote({
            height: 300,
            minHeight: 300,
            toolbar: [['style', ['bold', 'italic', 'underline', 'clear']], ['font', ['strikethrough', 'superscript', 'subscript']], ['fontsize', ['fontsize']], ['color', ['color']], ['para', ['ul', 'ol', 'paragraph', 'hr']], ['height', ['height']], ['insert', ['link', 'picture']], ['control', ['undo', 'redo', 'fullscreen', 'help']]]
          });
        });
      }
    };
  }];
})(this));

angular.module('gruenderviertel').directive('tooltips', (function(_this) {
  return ["$document", "$window", function($document, $window) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        return $document.ready(function() {
          $('[data-toggle="tooltip"]').tooltip();
          return $('[data-toggle="popover"]').popover();
        });
      }
    };
  }];
})(this));

angular.module('gruenderviertel').factory('baseREST', ["Rails", "Restangular", function(Rails, Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    var host;
    host = "" + Rails.database;
    RestangularConfigurer.setBaseUrl('/api/v1');
    RestangularConfigurer.setDefaultHeaders({
      'Content-Type': 'application/json'
    });
    return RestangularConfigurer.setRequestSuffix('.json');
  });
}]);

angular.module('gruenderviertel').service('Community', ["$q", "$rootScope", "$state", "Upload", "baseREST", function($q, $rootScope, $state, Upload, baseREST) {
  var create_community, editComment, editDiscussion, getMostUsed, get_all, join_community, leave_community, post_comment, post_discussion, preloadTags, returnCommunity;
  this.community_list = null;
  create_community = function(community) {
    var defer, packet;
    defer = $q.defer();
    packet = baseREST.one('communities');
    packet.post().then(function(response) {
      console.log('Community Create');
      return defer.resolve(response.data);
    }, function(error) {
      console.log('Communities.create Error');
      return defer.reject(error);
    });
    return defer.promise;
  };
  join_community = function(id) {
    var defer, packet;
    defer = $q.defer();
    packet = baseREST.one('communities').one('join');
    packet.id = id;
    packet.post().then(function(response) {
      console.log('Joined Community');
      return defer.resolve(response.data);
    }, function(error) {
      console.log('Communities.join Error');
      return defer.reject(error);
    });
    return defer.promise;
  };
  post_discussion = function(community_id, message) {
    var defer, packet;
    defer = $q.defer();
    packet = baseREST.one('communities').one('post');
    packet.id = community_id;
    packet.data = message;
    packet.post().then(function(response) {
      console.log('posted discussion');
      return defer.resolve(response.data);
    }, function(error) {
      console.log('Communities.post Error');
      return defer.reject(error);
    });
    return defer.promise;
  };
  post_comment = function(discussion_id, content) {
    var defer, packet;
    defer = $q.defer();
    packet = baseREST.one('communities').one('comment');
    packet.id = discussion_id;
    packet.data = content;
    packet.post().then(function(response) {
      console.log('posted comment');
      return defer.resolve(response.data);
    }, function(error) {
      console.log('communities.comment Error');
      return defer.reject(error);
    });
    return defer.promise;
  };
  get_all = function() {
    var defer, packet;
    defer = $q.defer();
    if (this.community_list) {
      defer.resolve(this.community_list);
    } else {
      packet = baseREST.one('communities');
      packet.get().then(function(response) {
        console.log('Got all Communities');
        this.community_list = response.data;
        console.log(this.community_list);
        return defer.resolve(response.data);
      }, function(error) {
        console.log('communities.get_all error');
        return defer.reject(error);
      });
    }
    return defer.promise;
  };
  getMostUsed = function() {
    var defer, packet;
    defer = $q.defer();
    packet = baseREST.one('communities').one('popular');
    packet.get().then(function(response) {
      defer.resolve(response.data);
      return console.log("Got Most used");
    }, function(error) {
      console.log('communities.get_most_used error');
      return defer.reject(error);
    });
    return defer.promise;
  };
  preloadTags = function() {
    var defer;
    defer = $q.defer();
    get_all().then(function(response) {
      return defer.resolve("ok");
    }, function(error) {
      return defer.reject(error);
    });
    return defer.promise;
  };
  returnCommunity = function(id) {
    var defer, packet;
    defer = $q.defer();
    packet = baseREST.one('communities');
    packet.id = id;
    packet.get().then(function(response) {
      console.log(response.data);
      return defer.resolve(response.data);
    }, function(error) {
      console.log('communities.get_one Error');
      return defer.reject(error);
    });
    return defer.promise;
  };
  editDiscussion = function(id, newText) {
    var data, defer, packet;
    defer = $q.defer();
    packet = baseREST.one('communities').one('post');
    packet.id = id;
    data = {};
    data.content = newText;
    packet.customPUT(data).then(function(response) {
      return defer.resolve(response.data);
    }, function(error) {
      return defer.reject(error);
    });
    return defer.promise;
  };
  editComment = function(id, newText) {
    var data, defer, packet;
    defer = $q.defer();
    packet = baseREST.one('communities').one('comment');
    packet.id = id;
    data = {};
    data.content = newText;
    packet.customPUT(data).then(function(response) {
      return defer.resolve(response.data);
    }, function(error) {
      return defer.reject(error);
    });
    return defer.promise;
  };
  leave_community = function(id) {
    var defer, packet;
    defer = $q.defer();
    packet = baseREST.one('communities').one('leave');
    packet.id = id;
    packet.remove().then(function(response) {
      return defer.resolve(response.data);
    }, function(error) {
      console.log('communities.leave_community Error');
      return defer.reject(error);
    });
    return defer.promise;
  };
  return {
    create_community: create_community,
    join_community: join_community,
    post_discussion: post_discussion,
    post_comment: post_comment,
    get_all: get_all,
    getMostUsed: getMostUsed,
    preloadTags: preloadTags,
    editDiscussion: editDiscussion,
    editComment: editComment,
    returnCommunity: returnCommunity,
    leave_community: leave_community
  };
}]);

angular.module('gruenderviertel').service('Event', ["baseREST", "$q", "$rootScope", function(baseREST, $q, $rootScope) {
  var checkForNewEvents, decodeEvents, getLatestEvents;
  this.newEvents = [];
  $rootScope.$on('events:checkEvents', (function(_this) {
    return function(e, state, params) {
      return _this.checkForNewEvents();
    };
  })(this));
  checkForNewEvents = (function(_this) {
    return function() {
      var defer, packet;
      defer = $q.defer;
      packet = baseREST.one('events').one('new');
      packet.get().then(function(response) {
        _this.newEvents = response.data;
        return defer.resolve(response.data);
      }, function(error) {
        console.log('Event.checkForNewEvents Error');
        return defer.reject(error);
      });
      return defer.promise;
    };
  })(this);
  getLatestEvents = (function(_this) {
    return function(amount) {
      var defer, packet, params;
      defer = $q.defer;
      packet = baseREST.one('events');
      params = {
        amount: amount
      };
      packet.customGET("", params).then(function(response) {
        _this.newEvents = response.data;
        return defer.resolve(response.data);
      }, function(error) {
        console.log('Event.checkForNewEvents Error');
        return defer.reject(error);
      });
      return defer.promise;
    };
  })(this);
  decodeEvents = (function(_this) {
    return function(events) {
      var d, decodedEvents, e, i, j, k, len, len1, len2, p, ref, ref1, results;
      decodedEvents = [];
      results = [];
      for (i = 0, len = events.length; i < len; i++) {
        e = events[i];
        if (e.trigger_type === "Comment") {
          if (e.target_type === "Project") {
            e.message = "Neuer Kommentar für Projekt";
            ref = _this.my_projects;
            for (j = 0, len1 = ref.length; j < len1; j++) {
              p = ref[j];
              if (p.id = e.target_id) {
                e.message += ": " + p.name;
                break;
              }
            }
          } else if (e.target_type === "Post") {
            e.message = "Neuer Kommentar für Diskussion";
            ref1 = _this.my_discussions;
            for (k = 0, len2 = ref1.length; k < len2; k++) {
              d = ref1[k];
              if (d.id === e.target_id) {
                e.community_id = d.community_id;
                e.message += ": " + d.title;
                break;
              }
            }
          } else {
            e.message = "Neues Ereignis.";
          }
        } else {
          e.message = "Neues Ereignis.";
        }
        results.push(decodedEvents.push(e));
      }
      return results;
    };
  })(this);
  return {
    checkForNewEvents: checkForNewEvents,
    getLatestEvents: getLatestEvents,
    decodeEvents: decodeEvents
  };
}]);

angular.module('gruenderviertel').service('Helper', ["$rootScope", "$state", function($rootScope, $state) {
  var goBack;
  goBack = function(defaultRoute) {
    var prev, prevParams;
    prev = $rootScope.lastState;
    prevParams = $rootScope.lastStateParams;
    console.log(prev);
    console.log(prevParams);
    if (prev.name) {
      return $state.go(prev.name, prevParams);
    } else {
      return $state.go('root.home');
    }
  };
  return {
    goBack: goBack
  };
}]);

angular.module('gruenderviertel').service('Project', ["baseREST", "$q", "Upload", function(baseREST, $q, Upload) {
  var createProject, editComment, editProject, getAll, getByCategory, getFeatured, getMore, getOne, like, postComment, removeProject;
  createProject = function(project) {
    var defer;
    defer = $q.defer();
    Upload.upload({
      url: '/api/v1/projects/',
      data: {
        data: project
      },
      arrayKey: '[]'
    }).then((function(_this) {
      return function(response) {
        return defer.resolve(response.data.data);
      };
    })(this), (function(_this) {
      return function(error) {
        return defer.reject(error);
      };
    })(this));
    return defer.promise;
  };
  postComment = function(project, content) {
    var defer, packet;
    defer = $q.defer();
    packet = baseREST.one('projects').one('comment');
    packet.id = project.id;
    packet.content = content;
    packet.post().then(function(response) {
      console.log('comment posted');
      return defer.resolve(response.data);
    }, function(error) {
      return console.log('Project.postComment ERror');
    });
    return defer.promise;
  };
  like = function(project_id) {
    var defer, packet;
    defer = $q.defer();
    packet = baseREST.one('projects').one('like');
    packet.id = project_id;
    packet.post().then(function(response) {
      console.log('like/unlike sent');
      return defer.resolve(response.data);
    }, function(error) {
      console.log('Project.like Error');
      return defer.reject(error);
    });
    return defer.promise;
  };
  getAll = function() {
    var defer, packet;
    defer = $q.defer();
    packet = baseREST.one('projects');
    packet.get().then(function(response) {
      console.log('Got Interests');
      return defer.resolve(response.data);
    }, function(error) {
      console.log('Project.getAll Error');
      return defer.reject(error.data.error);
    });
    return defer.promise;
  };
  getOne = function(id) {
    var defer, packet;
    defer = $q.defer();
    packet = baseREST.one('projects');
    packet.id = id;
    packet.get().then(function(response) {
      console.log('Got Project');
      return defer.resolve(response.data);
    }, function(error) {
      console.log('Project.getOne Error');
      return defer.reject(error);
    });
    return defer.promise;
  };
  getByCategory = function(category) {
    var defer, packet, params;
    defer = $q.defer();
    packet = baseREST.one('projects').one('category');
    params = {
      category: category
    };
    packet.customGET("", params).then(function(response) {
      return defer.resolve(response.data);
    }, function(error) {
      return defer.reject(error);
    });
    return defer.promise;
  };
  getFeatured = function() {
    var defer, packet;
    defer = $q.defer();
    packet = baseREST.one('projects').one('featured');
    packet.get().then(function(response) {
      console.log('Got Featured');
      return defer.resolve(response.data);
    }, function(error) {
      console.log('Project.getFeatured Error');
      return defer.reject(error);
    });
    return defer.promise;
  };
  getMore = function(id) {
    var defer, packet, params;
    defer = $q.defer();
    packet = baseREST.one('projects').one('more');
    params = {
      current: id
    };
    packet.customGET("", params).then(function(response) {
      console.log('got more');
      return defer.resolve(response.data);
    }, function(error) {
      console.log('Project.getMore Error');
      return defer.reject(error);
    });
    return defer.promise;
  };
  editProject = function(project) {
    var defer;
    delete project.comments;
    delete project.likes;
    delete project.liked;
    delete project.author;
    delete project.coop;
    delete project.cooptext;
    delete project.status;
    defer = $q.defer();
    Upload.upload({
      url: '/api/v1/projects/',
      data: {
        data: project
      },
      arrayKey: '[]',
      method: 'PUT'
    }).then((function(_this) {
      return function(response) {
        defer.resolve(response.data.data);
        return console.log(response.data);
      };
    })(this), (function(_this) {
      return function(error) {
        defer.reject(error);
        return console.log("Project.editProject Error");
      };
    })(this));
    return defer.promise;
  };
  editComment = function(id, newText) {
    var data, defer, packet;
    defer = $q.defer();
    packet = baseREST.one('projects').one('comment');
    packet.id = id;
    data = {};
    data.content = newText;
    packet.customPUT(data).then(function(response) {
      return defer.resolve(response.data);
    }, function(error) {
      return defer.reject(error);
    });
    return defer.promise;
  };
  removeProject = function(id) {
    var defer, packet;
    defer = $q.defer();
    packet = baseREST.one('projects');
    packet.id = id;
    packet["delete"].then(function(response) {
      conosle.log('Remove Interest');
      return defer.resolve(response.data);
    }, function(error) {
      console.log('Interest.removeProject failed');
      return defer.reject(error);
    });
    return defer.promise;
  };
  return {
    createProject: createProject,
    postComment: postComment,
    like: like,
    getAll: getAll,
    getOne: getOne,
    editProject: editProject,
    editComment: editComment,
    removeProject: removeProject,
    getFeatured: getFeatured,
    getMore: getMore,
    getByCategory: getByCategory
  };
}]);

angular.module('gruenderviertel').service('TokenContainer', ["$localStorage", "Rails", "$rootScope", "$timeout", function($localStorage, Rails, $rootScope, $timeout) {

  /**
   *
   *
   * @param {[type]} token [description]
   */
  var _stillValid, deleteToken, get, getRaw, set;
  set = function(response) {
    var currDate, expiresAt, token;
    token = {
      token: response.access_token,
      expiresIn: response.expires_in,
      refreshToken: response.refresh_token
    };
    currDate = +new Date();
    expiresAt = currDate + (token.expiresIn * 1000);
    return $localStorage.token = angular.extend(token, {
      expiresAt: expiresAt
    });
  };

  /**
   *
   *
   * @return {[type]} [description]
   */
  get = function() {
    var token;
    if (token = _stillValid()) {
      return token.token;
    } else {
      return null;
    }
  };
  getRaw = function() {
    var token;
    if (token = _stillValid()) {
      return token;
    } else {
      return null;
    }
  };
  _stillValid = function() {
    var token;
    token = $localStorage.token;
    if (token) {
      return token;
    } else {
      return null;
    }
  };
  deleteToken = function() {
    delete $localStorage.token;
    return $timeout(function() {
      return $rootScope.$broadcast('user:token_invalid');
    });
  };
  return {
    get: get,
    getRaw: getRaw,
    set: set,
    deleteToken: deleteToken
  };
}]);

angular.module('gruenderviertel').service('User', ["baseREST", "$q", "$http", "Rails", "$rootScope", "Upload", "TokenContainer", function(baseREST, $q, $http, Rails, $rootScope, Upload, TokenContainer) {
  var checkUsername, createUser, currentUser, deleteUser, getAll, getEvents, getNewEvents, getRole, getUser, isAuthenticated, login, logout, logoutLocal, resetPassword, updateUser, writeMessage;
  this.user = null;
  this.newEvents = 0;
  this.events = [];
  this.deferreds = {};
  this.unauthorized = true;
  createUser = (function(_this) {
    return function(user) {
      var defer;
      console.log("Registering.");
      console.log(user);
      defer = $q.defer();
      Upload.upload({
        url: '/api/v1/users/',
        data: {
          data: user
        },
        arrayKey: '[]'
      }).then(function(response) {
        console.log(response.data.data);
        _this.user = response.data.data.user;
        $rootScope.activeUser = _this.user;
        TokenContainer.set(response.data.data.token);
        _this.unauthorized = false;
        return defer.resolve(_this.user);
      }, function(error) {
        return defer.reject(error);
      });
      return defer.promise;
    };
  })(this);
  login = (function(_this) {
    return function(form) {
      var defer, packet;
      defer = $q.defer();
      packet = baseREST.one('users').one('login');
      packet.data = {};
      packet.data.username = form.username;
      packet.data.password = form.password;
      packet.post().then(function(response) {
        _this.user = response.data.user;
        $rootScope.activeUser = _this.user;
        TokenContainer.set(response.data.token);
        _this.unauthorized = false;
        $rootScope.$broadcast('event:newEvents');
        return defer.resolve(_this.user);
      }, function(error) {
        return defer.reject(error);
      });
      return defer.promise;
    };
  })(this);
  writeMessage = (function(_this) {
    return function(receiver, content) {
      var defer, packet;
      defer = $q.defer();
      packet = baseREST.one('users').one('pm');
      packet.data = {
        receiver: receiver,
        content: content
      };
      packet.post().then(function(response) {
        return defer.resolve(response);
      }, function(error) {
        return defer.reject(error);
      });
      return defer.promise;
    };
  })(this);
  checkUsername = (function(_this) {
    return function(username) {
      var defer, packet;
      defer = $q.defer();
      packet = baseREST.one('users').one('username');
      packet.username = username;
      packet.post().then(function(response) {
        return defer.resolve(response.data);
      }, function(error) {
        return defer.reject(error);
      });
      return defer.promise;
    };
  })(this);
  getAll = function() {
    var defer;
    defer = $q.defer();
    baseREST.one('users').get().then(function(results) {
      return defer.resolve(results.data);
    }, function(error) {
      return defer.reject(error);
    });
    return defer.promise;
  };
  getUser = function(id) {
    var defer, packet;
    defer = $q.defer();
    packet = baseREST.one('users');
    if (!id) {
      packet.id = 'me';
    } else {
      packet.id = id;
    }
    packet.get().then((function(_this) {
      return function(response) {
        return defer.resolve(response.data);
      };
    })(this), function(error) {
      return defer.reject(error.error);
    });
    return defer.promise;
  };
  currentUser = (function(_this) {
    return function() {
      var defer, packet;
      defer = $q.defer();
      if (isAuthenticated()) {
        defer.resolve(_this.user);
        return defer.promise;
      } else if (_this.deferreds.me) {
        return _this.deferreds.me.promise;
      } else {
        _this.deferreds.me = defer;
        packet = baseREST.one('users');
        packet.id = 'me';
        packet.get().then(function(response) {
          _this.unauthorized = false;
          _this.user = response.data;
          $rootScope.activeUser = _this.user;
          _this.deferreds.me.resolve(response.data);
          return delete _this.deferreds.me;
        }, function(error) {
          _this.deferreds.me.reject();
          return delete _this.deferreds.me;
        });
        return _this.deferreds.me.promise;
      }
    };
  })(this);
  getNewEvents = (function(_this) {
    return function() {
      var defer, packet;
      defer = $q.defer();
      packet = baseREST.one('events').one('new');
      packet.get().then(function(response) {
        if (response.data > 0) {
          $rootScope.$broadcast('event:newEvents');
          _this.newEvents = response.data;
        }
        return defer.resolve(response.data);
      }, function(error) {
        return defer.reject(error);
      });
      return defer.promise;
    };
  })(this);
  getEvents = (function(_this) {
    return function() {
      var defer, packet;
      defer = $q.defer();
      packet = baseREST.one('events');
      packet.get().then(function(response) {
        _this.events = response.data;
        return defer.resolve(response.data);
      }, function(error) {
        return defer.reject(error);
      });
      return defer.promise;
    };
  })(this);
  getRole = (function(_this) {
    return function() {
      var defer;
      defer = $q.defer();
      if ($rootScope.activeUser) {
        defer.resolve($rootScope.activeUser.role);
      } else {
        defer.reject();
      }
      return defer.promise;
    };
  })(this);
  updateUser = (function(_this) {
    return function(user) {
      var defer;
      defer = $q.defer();
      Upload.upload({
        url: '/api/v1/users/',
        data: {
          data: user
        },
        arrayKey: '[]',
        method: 'PUT'
      }).then(function(response) {
        return defer.resolve(response.data.data);
      }, function(error) {
        return defer.reject(error);
      });
      return defer.promise;
    };
  })(this);
  resetPassword = (function(_this) {
    return function(email) {
      var defer, packet;
      packet = baseREST.one('users').one('reset');
      defer = $q.defer();
      packet.email = email;
      packet.post().then(function(response) {
        return defer.resolve(response.data);
      }, function(error) {
        return defer.reject(error);
      });
      return defer.promise;
    };
  })(this);
  logout = (function(_this) {
    return function() {
      var defer, packet;
      defer = $q.defer();
      packet = baseREST.one('users').one('logout');
      packet.remove().then(function(response) {
        TokenContainer.deleteToken();
        _this.user = null;
        $rootScope.activeUser = null;
        console.log(_this.user);
        _this.unauthorized = true;
        $rootScope.$broadcast('user:stateChanged');
        return defer.resolve(response);
      }, function(error) {
        return defer.reject(error);
      });
      return defer.promise;
    };
  })(this);
  logoutLocal = (function(_this) {
    return function() {
      _this.user = null;
      $rootScope.activeUser = null;
      _this.unauthorized = true;
      return $rootScope.$broadcast('user:stateChanged');
    };
  })(this);
  deleteUser = (function(_this) {
    return function(data) {
      var defer, packet;
      defer = $q.defer();
      packet = baseREST.one('users');
      packet.id = data.id;
      packet.current_password = data.current_password;
      packet.remove().then(function(response) {
        return defer.resolve();
      }, function(error) {
        _this.unauthorized = true;
        return defer.reject(error);
      });
      return defer.promise;
    };
  })(this);
  isAuthenticated = (function(_this) {
    return function() {
      return !_this.unauthorized && (_this.user != null);
    };
  })(this);
  return {
    getAll: getAll,
    getUser: getUser,
    currentUser: currentUser,
    updateUser: updateUser,
    resetPassword: resetPassword,
    checkUsername: checkUsername,
    getEvents: getEvents,
    getNewEvents: getNewEvents,
    login: login,
    logout: logout,
    logoutLocal: logoutLocal,
    deleteUser: deleteUser,
    createUser: createUser,
    isAuthenticated: isAuthenticated,
    getRole: getRole,
    writeMessage: writeMessage
  };
}]);

angular.module('gruenderviertel').controller('HomeCtrl', ["$rootScope", "TokenContainer", "User", "Project", "Community", "most_used", "featured", "$state", function($rootScope, TokenContainer, User, Project, Community, most_used, featured, $state) {
  this.featured = null;
  this.most_used = null;
  this.form = {};
  this.isAuthenticated = User.isAuthenticated();
  $rootScope.$on('user:stateChanged', (function(_this) {
    return function(e, state, params) {
      console.log("Hometrl user:StateChanged");
      _this.isAuthenticated = User.isAuthenticated();
      return console.log(_this.isAuthenticated);
    };
  })(this));
  this.setLoggedIn = (function(_this) {
    return function(isLoggedIn) {
      _this.isAuthenticated = !!isLoggedIn;
      return console.log('Logged In Status: ' + _this.isAuthenticated);
    };
  })(this);
  this.init = (function(_this) {
    return function() {
      Community.preloadTags();
      _this.featured = angular.copy(featured);
      _this.most_used = angular.copy(most_used);
      console.log("HomeCtrl Initialized");
      return null;
    };
  })(this);
  this.register = (function(_this) {
    return function() {
      return $state.go('root.register', {
        user: _this.form
      });
    };
  })(this);
  return this.init();
}]);

this;

angular.module('gruenderviertel').controller('NavCtrl', ["User", "Event", "$rootScope", "$scope", "$state", "TokenContainer", function(User, Event, $rootScope, $scope, $state, TokenContainer) {
  this.user = $rootScope.activeUser;
  this.isAuthenticated = false;
  this.form = {};
  this.admin = false;
  this.username = "default";
  this.decodedEvents = [];
  this.wrongPassword = false;
  this.noAccount = false;
  $rootScope.$on('user:stateChanged', (function(_this) {
    return function(e, state, params) {
      console.log("NavCtrl user:StateChanged");
      _this.setLoggedIn(TokenContainer.get());
      _this.setUsername();
      return _this.isAdmin();
    };
  })(this));
  this.getNewEvents = (function(_this) {
    return function() {
      User.getNewEvents().then(function(response) {
        console.log(response);
        return _this.newEvents = response;
      }, function(error) {
        return console.log("NavCtrl.init Error");
      });
      return console.log("NavCtrl Initialized");
    };
  })(this);
  this.login = (function(_this) {
    return function() {
      _this.wrongPassword = false;
      _this.noAccount = false;
      return User.login(_this.form).then(function(response) {
        $('#login_modal').modal('toggle');
        return $rootScope.$broadcast('user:stateChanged');
      }, function(error) {
        console.log(error);
        if (error.data.error.name === "wrong_password") {
          console.log("Wrong Password");
          _this.wrongPassword = true;
        } else if (error.data.error.name === "username_not_found") {
          console.log("No Account Found");
          _this.noAccount = true;
        }
        return console.log("Error during Login");
      });
    };
  })(this);
  this.logout = (function(_this) {
    return function() {
      return User.logout().then(function() {
        return $state.go('root.home');
      });
    };
  })(this);
  this.setUsername = (function(_this) {
    return function() {
      if (_this.isAuthenticated) {
        return User.currentUser().then(function(response) {
          return _this.username = angular.copy(response.username);
        }, function(error) {
          this.username = "Angemeldet";
          return console.log("setUsername: error");
        });
      }
    };
  })(this);
  this.setLoggedIn = (function(_this) {
    return function(isLoggedIn) {
      _this.isAuthenticated = !!isLoggedIn;
      return console.log('Logged In Status: ' + _this.isAuthenticated);
    };
  })(this);
  this.isAdmin = (function(_this) {
    return function() {
      console.log(User.user);
      if (User.user) {
        console.log(User.user.role);
        if (User.user.role === 'admin') {
          return _this.admin = true;
        } else {
          return _this.admin = false;
        }
      } else {
        return _this.admin = false;
      }
    };
  })(this);
  this.decodeEvents = (function(_this) {
    return function(user) {
      var d, decodedEvents, e, i, j, k, len, len1, len2, p, ref, ref1, ref2;
      decodedEvents = [];
      ref = user.events;
      for (i = 0, len = ref.length; i < len; i++) {
        e = ref[i];
        if (e.trigger_type === "Comment") {
          if (e.target_type === "Project") {
            e.message = "Neuer Kommentar für Projekt";
            ref1 = user.projects;
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              p = ref1[j];
              if (p.id === e.target_id) {
                e.message += ": " + p.name;
                break;
              }
            }
          } else if (e.target_type === "Post") {
            e.message = "Neuer Kommentar für Diskussion";
            ref2 = user.posts;
            for (k = 0, len2 = ref2.length; k < len2; k++) {
              d = ref2[k];
              if (d.id === e.target_id) {
                e.community_id = d.community_id;
                e.message += ": " + d.title;
                break;
              }
            }
          } else {
            e.message = "Neues Ereignis.";
          }
        } else {
          e.message = "Neues Ereignis.";
        }
        decodedEvents.push(e);
      }
      return decodedEvents;
    };
  })(this);
  this.visit_event = (function(_this) {
    return function(e) {
      console.log(e);
      if (e.target_type === "Project") {
        return $state.go('root.project', {
          'id': e.target_id
        });
      } else {
        return $state.go('root.community', {
          'id': e.community_id
        });
      }
    };
  })(this);
  this.init = function() {
    this.setLoggedIn(TokenContainer.get());
    this.setUsername();
    this.isAdmin();
    if (this.isAuthenticated) {
      this.decodedEvents = this.decodeEvents(this.user);
    }
    return $('.nav a').on('click', function() {
      return $('.nav-collapse').collapse('hide');
    });
  };
  this.init();
  return this;
}]);

angular.module('gruenderviertel').controller('CommunityCtrl', ["instance", "Community", "$anchorScroll", function(instance, Community, $anchorScroll) {
  this.community = instance;
  this.icon = instance.icon;
  this.projects = instance.projects;
  this.members = instance.users;
  this.discussions = instance.discussions;
  this.member_count = instance.member_count;
  this.project_count = instance.project_count;
  this.subscribed = instance.subscribed;
  this.discussion_form = {};
  this.comment_form = {};
  this.comment_form.content = [];
  this.init = (function(_this) {
    return function() {
      var c, d, i, len, ref, results;
      ref = _this.discussions;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        d = ref[i];
        d.created = new Date(Date.parse(d.created_at)).toLocaleString('de-DE');
        d.updated = new Date(Date.parse(d.updated_at)).toLocaleString('de-DE');
        results.push((function() {
          var j, len1, ref1, results1;
          ref1 = d.comments;
          results1 = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            c = ref1[j];
            c.created = new Date(Date.parse(c.created_at)).toLocaleString('de-DE');
            results1.push(c.updated = new Date(Date.parse(c.updated_at)).toLocaleString('de-DE'));
          }
          return results1;
        })());
      }
      return results;
    };
  })(this);
  this.subscribe = (function(_this) {
    return function() {
      return Community.join_community(_this.community.id).then(function(response) {
        _this.member_count++;
        return _this.subscribed = response;
      }, function(error) {
        return console.log('CommunityCtrl.subscribe Error');
      });
    };
  })(this);
  this.unsubscribe = (function(_this) {
    return function() {
      return Community.leave_community(_this.community.id).then(function(response) {
        _this.member_count--;
        return _this.subscribed = response;
      }, function(error) {
        return console.log('CommunityCtrl.subscribe Error');
      });
    };
  })(this);
  this.startDiscussion = (function(_this) {
    return function() {
      var message;
      message = {
        title: _this.discussion_form.title,
        content: _this.discussion_form.content
      };
      return Community.post_discussion(_this.community.id, message).then(function(response) {
        _this.discussion_form = {};
        response.comments = [];
        response.created = new Date(Date.parse(response.created_at)).toLocaleString('de-DE');
        response.updated = new Date(Date.parse(response.updated_at)).toLocaleString('de-DE');
        return _this.discussions.push(response);
      }, function(error) {
        return console.log('CommunityCtrl.startDiscussion Error');
      });
    };
  })(this);
  this.comment = (function(_this) {
    return function(discussion_id, index) {
      var message;
      message = {
        content: _this.comment_form.content[index]
      };
      console.log("sending comment");
      return Community.post_comment(discussion_id, message).then(function(response) {
        var discussion, i, len, ref, results;
        console.log("added comment");
        ref = _this.discussions;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          discussion = ref[i];
          if (discussion.id === discussion_id) {
            response.created = new Date(Date.parse(response.created_at)).toLocaleString('de-DE');
            response.updated = new Date(Date.parse(response.updated_at)).toLocaleString('de-DE');
            results.push(discussion.comments.push(response));
          } else {
            results.push(void 0);
          }
        }
        return results;
      }, function(error) {
        return console.log('CommunityCtrl.comment Error');
      });
    };
  })(this);
  this.showEdit = function(author, id) {
    $("#c-body-" + author + "-" + id).addClass("ng-hide");
    return $("#c-edit-" + author + "-" + id).removeClass("ng-hide");
  };
  this.abortEdit = function(author, id) {
    $("#c-body-" + author + "-" + id).removeClass("ng-hide");
    return $("#c-edit-" + author + "-" + id).addClass("ng-hide");
  };
  this.editComment = (function(_this) {
    return function(author, id) {
      var text;
      text = $("#c-edit-body-" + author + "-" + id).val();
      return Community.editComment(id, text).then(function(response) {
        var comment, discussion, i, j, len, len1, ref, ref1;
        response.updated = new Date(Date.parse(response.updated_at)).toLocaleString('de-DE');
        ref = _this.discussions;
        for (i = 0, len = ref.length; i < len; i++) {
          discussion = ref[i];
          ref1 = discussion.comments;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            comment = ref1[j];
            if (comment.id === id) {
              comment.content = angular.copy(response.content);
              comment.updated = angular.copy(response.updated);
            }
          }
        }
        $("#c-body-" + author + "-" + id).removeClass("ng-hide");
        return $("#c-edit-" + author + "-" + id).addClass("ng-hide");
      }, function(error) {
        return console.log("Comment edit Error");
      });
    };
  })(this);
  this.showDEdit = function(author, id) {
    $("#d-body-" + author + "-" + id).addClass("ng-hide");
    return $("#d-edit-" + author + "-" + id).removeClass("ng-hide");
  };
  this.abortDEdit = function(author, id) {
    $("#d-body-" + author + "-" + id).removeClass("ng-hide");
    return $("#d-edit-" + author + "-" + id).addClass("ng-hide");
  };
  this.editDiscussion = (function(_this) {
    return function(author, id) {
      var text;
      text = $("#d-edit-body-" + author + "-" + id).val();
      return Community.editDiscussion(id, text).then(function(response) {
        var discussion, i, len, ref;
        response.updated = new Date(Date.parse(response.updated_at)).toLocaleString('de-DE');
        ref = _this.discussions;
        for (i = 0, len = ref.length; i < len; i++) {
          discussion = ref[i];
          if (discussion.id === id) {
            discussion.content = angular.copy(response.content);
            discussion.updated = angular.copy(response.updated);
          }
        }
        $("#d-body-" + author + "-" + id).removeClass("ng-hide");
        return $("#d-edit-" + author + "-" + id).addClass("ng-hide");
      }, function(error) {
        return console.log("Comment edit Error");
      });
    };
  })(this);
  this.init();
  return this;
}]);

angular.module('gruenderviertel').controller('CommunityOverviewCtrl', ["Community", "list", function(Community, list) {
  this.list = list;
  return this;
}]);

angular.module('gruenderviertel').controller('CreateProjectCtrl', ["$scope", "Project", "Community", "$state", function($scope, Project, Community, $state) {
  $scope.tinymceOptions = {
    inline: false,
    plugins: "image, fullscreen",
    menubar: "insert, view",
    toolbar: "image, fullscreen"
  };
  this.step = 1;
  this.pitch_characters = 200;
  this.form = {};
  this.form.project = {};
  this.form.project.coop = false;
  this.tag_list;
  Community.get_all().then((function(_this) {
    return function(response) {
      return _this.tag_list = angular.copy(response);
    };
  })(this));
  this.problemPlaceholder = "Beschreibe kurz: Welches Problem hast du gelöst oder möchtest du lösen?";
  this.resetFile = function() {
    var e;
    this.form.project.image = void 0;
    e = $("#newProject_cover_image");
    e.wrap('<form>').closest('form').get(0).reset();
    return e.unwrap();
  };
  this.selectTag = (function(_this) {
    return function(community) {
      var e, i;
      i = _this.tag_list.indexOf(community);
      e = _this.tag_list[i];
      if (e.selected) {
        return e.selected = false;
      } else {
        return e.selected = true;
      }
    };
  })(this);
  this.goBack = (function(_this) {
    return function() {
      if (_this.step <= 0) {
        return $state.go('root.home');
      } else {
        return _this.step--;
      }
    };
  })(this);
  this.proceed = (function(_this) {
    return function() {
      console.log(_this.form.user);
      if (_this.step < 5) {
        return _this.step++;
      }
    };
  })(this);
  this.createProject = function() {
    var c, j, len, ref;
    this.form.project.tags = [];
    ref = this.tag_list;
    for (j = 0, len = ref.length; j < len; j++) {
      c = ref[j];
      if (c.selected) {
        this.form.project.tags.push(c.id);
      }
    }
    this.form.project.status = "Published";
    return Project.createProject(this.form.project).then(function(response) {
      console.log("-------------------------");
      console.log(response);
      console.log("-------------------------");
      return $state.transitionTo('root.project', {
        id: response.id
      }, {
        reload: true
      });
    });
  };
  this.charLimit = (function(_this) {
    return function() {
      if (_this.form.project.goal) {
        return _this.pitch_characters = 200 - _this.form.project.goal.length;
      } else {
        return _this.pitch_characters = 200;
      }
    };
  })(this);
  this.changeTypus = (function(_this) {
    return function(typus) {
      if (typus === "Open Innovation") {
        _this.problemPlaceholder = "Die Problematik bei Open Innovation-Projekten kann im nächsten Abschnitt mit mehr Details beschrieben werden.";
      } else {
        _this.problemPlaceholder = "Beschreibe kurz: Welches Problem hast du gelöst oder möchtest du lösen?";
      }
      return _this.form.project.typus = typus;
    };
  })(this);
  return this;
}]);

angular.module('gruenderviertel').controller('EditProjectCtrl', ["Project", "$scope", "$state", "$stateParams", "instance", function(Project, $scope, $state, $stateParams, instance) {
  this.form = angular.copy(instance);
  this.currentImage = angular.copy(this.form.image);
  delete this.form.comments;
  delete this.form.likes;
  delete this.form.attachment;
  this.pitch_characters = 200;
  this.charLimit = (function(_this) {
    return function() {
      if (_this.form.goal) {
        return _this.pitch_characters = 200 - _this.form.goal.length;
      } else {
        return _this.pitch_characters = 200;
      }
    };
  })(this);
  this.editProject = (function(_this) {
    return function() {
      console.log("Saving.");
      console.log(_this.form.solution);
      return Project.editProject(_this.form).then(function(response) {
        return $state.go('root.project', '{"id": $stateParams.id}', {
          reload: true
        });
      }, function(error) {
        return console.log("EditProjectCtrl.editProject Error");
      });
    };
  })(this);
  this.resetFile = function() {
    var e;
    this.form.image = void 0;
    e = $("#newProject_cover_image");
    e.wrap('<form>').closest('form').get(0).reset();
    return e.unwrap();
  };
  this.init = (function(_this) {
    return function() {
      return _this.charLimit();
    };
  })(this);
  this.init();
  return this;
}]);

angular.module('gruenderviertel').controller('ProjectCtrl', ["User", "instance", "Project", "$state", "$window", "$anchorScroll", "$location", function(User, instance, Project, $state, $window, $anchorScroll, $location) {
  this.project = instance;
  this.comment = "";
  this.moreProjects = [];
  this.user = User;
  this.likes = this.project.likes;
  this.liked = false;
  this.init = (function(_this) {
    return function() {
      var c, i, len, ref;
      console.log("Projekt:");
      console.log(_this.project);
      ref = _this.project.comments;
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
        c.created = new Date(Date.parse(c.created_at)).toLocaleString('de-DE');
        c.updated = new Date(Date.parse(c.updated_at)).toLocaleString('de-DE');
      }
      return _this.getOtherProjects();
    };
  })(this);
  this.viewCommunity = function(cid) {
    var url;
    url = $state.href('root.community', {
      id: cid
    });
    console.log(url);
    return $window.open(url, '_blank');
  };
  this.addComment = (function(_this) {
    return function() {
      return Project.postComment(_this.project, _this.comment).then(function(response) {
        _this.comment = "";
        response.created = new Date(Date.parse(response.created_at)).toLocaleString('de-DE');
        response.updated = new Date(Date.parse(response.updated_at)).toLocaleString('de-DE');
        console.log(response);
        return _this.project.comments.push(response);
      });
    };
  })(this);
  this.like = (function(_this) {
    return function() {
      return Project.like(_this.project.id).then(function(response) {
        if (response) {
          _this.project.liked = true;
          return _this.likes++;
        } else {
          _this.project.liked = false;
          return _this.likes--;
        }
      }, function(error) {
        return console.log("project.like error");
      });
    };
  })(this);
  this.getFileName = (function(_this) {
    return function() {
      var path;
      if (_this.project.attachment.url) {
        path = _this.project.attachment.url.split("/");
        return path[path.length - 1];
      }
      return "";
    };
  })(this);
  this.getOtherProjects = (function(_this) {
    return function() {
      return Project.getMore(_this.project.id).then(function(response) {
        console.log(response);
        return _this.moreProjects = response;
      }, function(error) {
        _this.moreProjects = [];
        return console.log("Project.getMore: Error");
      });
    };
  })(this);
  this.showEdit = function(author, id) {
    $("#c-body-" + author + "-" + id).addClass("ng-hide");
    return $("#c-edit-" + author + "-" + id).removeClass("ng-hide");
  };
  this.abortEdit = function(author, id) {
    $("#c-body-" + author + "-" + id).removeClass("ng-hide");
    return $("#c-edit-" + author + "-" + id).addClass("ng-hide");
  };
  this.editComment = (function(_this) {
    return function(author, id) {
      var text;
      text = $("#c-edit-body-" + author + "-" + id).val();
      return Project.editComment(id, text).then(function(response) {
        var comment, i, len, ref;
        ref = _this.project.comments;
        for (i = 0, len = ref.length; i < len; i++) {
          comment = ref[i];
          if (comment.id === id) {
            comment.updated = new Date(Date.parse(response.updated_at)).toLocaleString('de-DE');
            comment.content = angular.copy(response.content);
          }
        }
        $("#c-body-" + author + "-" + id).removeClass("ng-hide");
        return $("#c-edit-" + author + "-" + id).addClass("ng-hide");
      }, function(error) {
        return console.log("Comment edit Error");
      });
    };
  })(this);
  this.init();
  return this;
}]);

angular.module("gruenderviertel").controller('ProjectFilterCtrl', ["projects", "$stateParams", function(projects, $stateParams) {
  this.category = $stateParams.category;
  this.projects = projects;
  return this;
}]);

angular.module('gruenderviertel').controller('PMWriteCtrl', ["$state", "User", function($state, User) {
  this.message = null;
  this.sent = false;
  this.sendMessage = (function(_this) {
    return function() {
      return User.sendMessage(_this.message).then(function(response) {
        return _this.sent = true;
      }, function(error) {
        return console.log("PMWriteCtrl.sendMessage Error");
      });
    };
  })(this);
  return this;
}]);

angular.module('gruenderviertel').controller('ProfileCtrl', ["instance", "$state", "$rootScope", function(instance, $state, $rootScope) {
  console.log("Looking at profile instance");
  console.log(instance);
  this.user = instance;
  this.my_projects = angular.copy(this.user.projects);
  this.my_comments = angular.copy(this.user.comments);
  this.my_discussions = angular.copy(this.user.posts);
  this.myPage = false;
  console.log(this.user);
  this.decodeEvents = (function(_this) {
    return function(events) {
      var d, decodedEvents, e, i, j, k, len, len1, len2, p, ref, ref1;
      decodedEvents = [];
      for (i = 0, len = events.length; i < len; i++) {
        e = events[i];
        if (e.trigger_type === "Comment") {
          if (e.target_type === "Project") {
            e.message = "Neuer Kommentar für Projekt";
            ref = _this.my_projects;
            for (j = 0, len1 = ref.length; j < len1; j++) {
              p = ref[j];
              if (p.id = e.target_id) {
                e.message += ": " + p.name;
                break;
              }
            }
          } else if (e.target_type === "Post") {
            e.message = "Neuer Kommentar für Diskussion";
            ref1 = _this.my_discussions;
            for (k = 0, len2 = ref1.length; k < len2; k++) {
              d = ref1[k];
              if (d.id === e.target_id) {
                e.community_id = d.community_id;
                e.message += ": " + d.title;
                break;
              }
            }
          } else {
            e.message = "Neues Ereignis.";
          }
        } else {
          e.message = "Neues Ereignis.";
        }
        decodedEvents.push(e);
      }
      return decodedEvents;
    };
  })(this);
  this.visit_event = (function(_this) {
    return function(e) {
      console.log(e);
      if (e.target_type === "Project") {
        return $state.go('root.project', {
          'id': e.target_id
        });
      } else {
        return $state.go('root.community', {
          'id': e.community_id
        });
      }
    };
  })(this);
  this.goToComment = function(comment) {
    if (comment.parent_type === 'Project') {
      return $state.go('root.project', {
        'id': comment.parent_id,
        '#': "c-" + comment.author + "-" + comment.id
      });
    } else {
      console.log("Comment:");
      console.log(comment);
      return $state.go('root.community', {
        'id': comment.grandparent_id,
        '#': "c-" + comment.author + "-" + comment.id
      });
    }
  };
  if (this.user.id === $rootScope.activeUser.id) {
    if (this.user.events) {
      this.my_events = this.decodeEvents(this.user.events);
    }
    this.myPage = true;
  }
  return this;
}]);

angular.module('gruenderviertel').controller('ProfileEditCtrl', ["User", "TokenContainer", "$state", "$stateParams", "instance", "$rootScope", "$scope", function(User, TokenContainer, $state, $stateParams, instance, $rootScope, $scope) {
  this.state = 1;
  this.form = {};
  this.form.user = instance;
  this.predit_in_progress = false;
  this.wrong_password = false;
  this.validation = {};
  this.validation.confirmation = true;
  this.init = (function(_this) {
    return function() {
      delete _this.form.user.comments;
      delete _this.form.user.projects;
      delete _this.form.user.events;
      delete _this.form.user.posts;
      delete _this.form.user.sent;
      delete _this.form.user.received;
      delete _this.form.user.logo;
      console.log(_this.form.user);
      return console.log("ProfileEditCtrl Init");
    };
  })(this);
  this.goBack = (function(_this) {
    return function() {
      if (_this.state <= 0) {
        return $state.go('root.profile');
      } else {
        return _this.state--;
      }
    };
  })(this);
  this.proceed = (function(_this) {
    return function() {
      if (_this.state < 2) {
        return _this.state++;
      }
    };
  })(this);
  this.saveEdit = function() {
    this.wrong_password = false;
    this.predit_in_progress = true;
    return User.updateUser(this.form.user).then((function(_this) {
      return function(response) {
        User.user = angular.copy(response);
        $rootScope.activeUser = angular.copy(response);
        $state.go('root.profile', void 0, {
          reload: true
        });
        return _this.predit_in_progress = false;
      };
    })(this), (function(_this) {
      return function(error) {
        _this.predit_in_progress = false;
        console.log('profileEditCtrl.saveEdit Error');
        if (error.data.error.name === "wrong_password") {
          return _this.wrong_password = true;
        }
      };
    })(this));
  };
  this.resetFile = function() {
    var e;
    this.form.user.logo = void 0;
    e = $("#predit_input_picture");
    e.wrap('<form>').closest('form').get(0).reset();
    return e.unwrap();
  };
  this.deleteAccount = function() {
    var data;
    this.wrong_password = false;
    $("#deletion_modal").modal('hide');
    data = {};
    data.id = this.form.user.id;
    data.current_password = this.form.user.current_password;
    return User.deleteUser(data).then((function(_this) {
      return function(response) {
        TokenContainer.deleteToken();
        User.logoutLocal();
        return $state.go('root.home');
      };
    })(this), (function(_this) {
      return function(error) {
        console.log('profileEditCtrl.deleteAccount Error');
        if (error.data.error.name === "wrong_password") {
          return _this.wrong_password = true;
        }
      };
    })(this));
  };
  this.checkPasswordConfirmation = function(pw, pwc) {
    if (pw === pwc) {
      return true;
    } else {
      return false;
    }
  };
  $('#predit_input_password, #predit_input_password_confirmation').on('keyup', (function(_this) {
    return function() {
      console.log(_this.form.user.password + " - " + $('#predit_input_password').val());
      console.log(_this.form.user.password_confirmation + " - " + $('#predit_input_password_confirmation').val());
      _this.validation.confirmation = _this.checkPasswordConfirmation($('#predit_input_password').val(), $('#predit_input_password_confirmation').val());
      $scope.$apply();
      return console.log(_this.validation);
    };
  })(this));
  this.init();
  return this;
}]);

angular.module('gruenderviertel').controller('RecoveryCtrl', ["User", function(User) {
  this.finished = false;
  this.sent = false;
  this.email = "";
  console.log("RecoveryCtrl initiated.");
  this.recoverPassword = (function(_this) {
    return function() {
      _this.sent = true;
      return User.resetPassword(_this.email).then(function(response) {
        return _this.finished = true;
      }, function(error) {
        _this.sent = false;
        return console.log;
      });
    };
  })(this);
  return this;
}]);

angular.module('gruenderviertel').controller('RegistrationCtrl', ["User", "TokenContainer", "$state", "$rootScope", "$stateParams", "Community", "$scope", function(User, TokenContainer, $state, $rootScope, $stateParams, Community, $scope) {
  this.state = 1;
  this.user = $stateParams.user;
  this.community_list = [];
  this.form = {};
  this.form.user = {};
  this.validation = {};
  this.validation.confirmation = false;
  this.validation.username_taken = false;
  this.reg_in_progress = false;
  this.selected = 0;
  this.filter = 'Branche';
  this.bio_characters = 200;
  this.checkPasswordConfirmation = function(pw, pwc) {
    if (pw === pwc) {
      return true;
    } else {
      return false;
    }
  };
  $('#reg_input_password, #reg_input_password_confirmation').on('keyup', (function(_this) {
    return function() {
      console.log(_this.form.user.password + " - " + $('#reg_input_password').val());
      console.log(_this.form.user.password_confirmation + " - " + $('#reg_input_password_confirmation').val());
      _this.validation.confirmation = _this.checkPasswordConfirmation($('#reg_input_password').val(), $('#reg_input_password_confirmation').val());
      $scope.$apply();
      return console.log(_this.validation);
    };
  })(this));
  $('#reg_input_username').on("focusout", (function(_this) {
    return function() {
      return User.checkUsername($('#reg_input_username').val()).then(function(response) {
        console.log("Username taken? " + response);
        if (response) {
          return _this.validation.username_taken = true;
        } else {
          return _this.validation.username_taken = false;
        }
      });
    };
  })(this));
  this.resetFile = function() {
    var e;
    this.form.user.logo = void 0;
    e = $("#reg_input_picture");
    e.wrap('<form>').closest('form').get(0).reset();
    return e.unwrap();
  };
  this.init = (function(_this) {
    return function() {
      if (_this.user !== null) {
        _this.state++;
        _this.form.user = _this.user;
      }
      Community.get_all().then(function(response) {
        return _this.community_list = angular.copy(response);
      });
      return console.log("RegistrationCtrl initialized.");
    };
  })(this);
  this.goBack = (function(_this) {
    return function() {
      if (_this.state <= 0) {
        return $state.go('root.home');
      } else {
        return _this.state--;
      }
    };
  })(this);
  this.proceed = (function(_this) {
    return function() {
      if (_this.state < 5) {
        return _this.state++;
      }
    };
  })(this);
  this.selectTag = (function(_this) {
    return function(community) {
      var e, i;
      i = _this.community_list.indexOf(community);
      e = _this.community_list[i];
      if (e.selected) {
        _this.selected--;
        return e.selected = false;
      } else {
        _this.selected++;
        return e.selected = true;
      }
    };
  })(this);
  this.select = (function(_this) {
    return function(input) {
      console.log('filtering by ' + input);
      return _this.filter = input;
    };
  })(this);
  this.filterBy = (function(_this) {
    return function(item) {
      return item.typus === _this.filter;
    };
  })(this);
  this.register = (function(_this) {
    return function() {
      var c, community, j, len, ref;
      console.log(_this.form);
      _this.reg_in_progress = true;
      c = [];
      ref = _this.community_list;
      for (j = 0, len = ref.length; j < len; j++) {
        community = ref[j];
        if (community.selected) {
          c.push(community.id);
        }
      }
      _this.form.user.subscriptions = c;
      return User.createUser(_this.form.user).then(function(response) {
        $rootScope.$broadcast('user:stateChanged');
        $state.go('root.home');
        return _this.reg_in_progress = false;
      }, function(error) {
        _this.reg_in_progress = false;
        return console.log('RegistrationCtrl.register Error');
      });
    };
  })(this);
  this.charLimit = (function(_this) {
    return function() {
      if (_this.form.user.description) {
        return _this.bio_characters = 200 - _this.form.user.description.length;
      } else {
        return _this.bio_characters = 200;
      }
    };
  })(this);
  this.init();
  return this;
}]);

angular.module('gruenderviertel').factory('badrequestHandler', ["$injector", function($injector) {
  var handle;
  return handle = function(response, deferred) {
    var error, errors, i, j, len, len1, message, ref, ref1, s;
    console.log('Bad Request');
    console.log(response);
    errors = {};
    ref = response.data.error;
    for (i = 0, len = ref.length; i < len; i++) {
      error = ref[i];
      ref1 = error.messages;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        message = ref1[j];
        s = message.split(":");
        errors[s[0]] = s[1];
      }
    }
    deferred.reject({
      status: 400,
      errors: errors
    });
    return deferred.promise;
  };
}]);

angular.module('gruenderviertel').factory('conflictHandler', ["$injector", function($injector) {
  var handle;
  return handle = function(response, deferred) {
    deferred.reject(response);
    return deferred.promise;
  };
}]);

angular.module('gruenderviertel').factory('forbiddenHandler', ["$injector", function($injector) {
  var handle;
  return handle = function(response, deferred) {
    deferred.reject(response);
    return deferred.promise;
  };
}]);

angular.module('gruenderviertel').factory('notfoundHandler', ["$injector", function($injector) {
  var handle;
  return handle = function(response, deferred) {
    deferred.reject(response);
    return deferred.promise;
  };
}]);

angular.module('gruenderviertel').factory('unauthorizedHandler', ["$injector", function($injector) {
  var handle;
  return handle = function(response, deferred) {
    var access, state;
    access = $injector.get('TokenContainer');
    state = $injector.get('$state');
    console.log(response);
    if (response.data.error.error.name === 'invalid_token') {
      console.log("Token invalid.");
      access.deleteToken();
      state.go('root.home');
    }
    deferred.reject(response);
    return deferred.promise;
  };
}]);

angular.module('gruenderviertel').factory('responseInterceptor', ["$q", "$injector", function($q, $injector) {
  return {
    responseError: (function(_this) {
      return function(response) {
        var deferred, handle;
        deferred = $q.defer();
        switch (response.status) {
          case 400:
            handle = $injector.get('badrequestHandler');
            return handle(response, deferred);
          case 401:
            handle = $injector.get('unauthorizedHandler');
            return handle(response, deferred);
          case 403:
            handle = $injector.get('forbiddenHandler');
            return handle(response, deferred);
          case 404:
            handle = $injector.get('notfoundHandler');
            return handle(response, deferred);
          case 409:
            handle = $injector.get('conflictHandler');
            return handle(response, deferred);
          default:
            console.log('Other Error');
            deferred.reject(response);
            return deferred.promise;
        }
        return response;
      };
    })(this)
  };
}]);

angular.module('gruenderviertel').factory('tokenInterceptor', ["TokenContainer", "Rails", function(TokenContainer, Rails) {
  return {
    request: function(config) {
      var token;
      if (config.url.indexOf("/api/v1/") === 0 || config.url.indexOf("/oauth/") === 0) {
        token = TokenContainer.get();
        if (token) {
          config.headers['Authorization'] = "Bearer " + token;
        }
      }
      return config;
    }
  };
}]);
