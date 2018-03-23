var app, dependencies;

dependencies = ['ui.router', 'restangular', 'ngStorage', 'permission', 'permission.ui', 'ngFileUpload', 'toaster'];

app = angular.module('gruenderviertel', dependencies);

app.config(["$httpProvider", function($httpProvider) {
  $httpProvider.interceptors.push('tokenInterceptor');
  return $httpProvider.interceptors.push('responseInterceptor');
}]);

app.run(["User", "TokenContainer", "$rootScope", "$state", "$stateParams", "Rails", "$transitions", function(User, TokenContainer, $rootScope, $state, $stateParams, Rails, $transitions) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  return $transitions.onBefore({}, function(transition) {
    $rootScope.lastState = transition.from();
    return $rootScope.lastStateParams = transition.params('from');
  });
}]);

var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
  return PermRoleStore.defineRole('admin', function(stateParams) {
    var defer;
    defer = $q.defer();
    User.getRoles().then(function(roles) {
      if (!roles) {
        defer.reject();
      }
      if (indexOf.call(roles, 'admin') >= 0) {
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
    },
    resolve: {
      identity: ["TokenContainer", "User", "$rootScope", function(TokenContainer, User, $rootScope) {
        if (TokenContainer.get()) {
          console.log('Retrieving User from Token');
          return User.currentUser().then(function(user) {
            User.user = user;
            console.log('User Retrieved from Token');
            return $rootScope.$broadcast('user:stateChanged');
          }, function(error) {
            return console.log('Couldn\'t retrieve User.');
          });
        }
      }]
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
    url: '/profile',
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
        id = $stateParams.id;
        return User.getUser(id).then(function(response) {
          return response;
        }, function(error) {
          Helper.goBack();
          return null;
        });
      }]
    }
  }).state('root.register', {
    url: '/registration',
    views: {
      'body@': {
        templateUrl: 'assets/views/users/registration.html',
        controller: 'RegistrationCtrl',
        controllerAs: 'reg'
      }
    }
  }).state('root.profile.editprofile', {
    url: '/edit',
    views: {
      'body@': {
        templateUrl: 'assets/views/users/editprofile.html',
        controller: 'ProfileEditCtrl',
        controllerAs: 'edit'
      }
    }
  }).state('root.passwordrecovery', {
    url: '/recover',
    views: {
      'body@': {
        templateUrl: 'assets/views/users/recovery.html',
        controller: 'RecoveryCtrl',
        controllerAs: 'recovery'
      }
    }
  }).state('root.project', {
    url: '/project',
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
    url: '/project/new',
    views: {
      'body@': {
        templateUrl: 'assets/views/projects/create.html',
        controller: 'CreateProjectCtrl',
        controllerAs: 'create'
      }
    }
  }).state('root.editproject', {
    url: '/project/edit',
    views: {
      'body@': {
        templateUrl: 'assets/views/projects/edit.html',
        controller: 'EditProjectCtrl',
        controllerAs: 'edit'
      }
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
    url: '/community',
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
    url: '/users',
    views: {
      'body@': {
        templateUrl: 'assets/views/admin/users.html',
        controller: 'UserManagementCtrl',
        controllerAs: 'users'
      }
    }
  }).state('root.admin.projectmanagement', {
    url: '/projects',
    views: {
      'body@': {
        templateUrl: 'assets/views/admin/projects.html',
        controller: 'ProjectManagementCtrl',
        controllerAs: 'projects'
      }
    }
  }).state('root.admin.communitymanagement', {
    url: '/projects',
    views: {
      'body@': {
        templateUrl: 'assets/views/admin/communities.html',
        controller: 'CommunitiyManagementCtrl',
        controllerAs: 'communities'
      }
    }
  }).state('root.admin.reports', {
    url: '/projects',
    views: {
      'body@': {
        templateUrl: 'assets/views/admin/reports.html',
        controller: 'ReportCtrl',
        controllerAs: 'reports'
      }
    }
  });
}]);

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
  var create_community, getMostUsed, get_all, join_community, leave_community, post_comment, post_discussion, preloadTags, returnCommunity;
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
    returnCommunity: returnCommunity,
    leave_community: leave_community
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
  var createProject, editProject, getAll, getFeatured, getOne, like, postComment, removeProject;
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
        return defer.resolve(response.data);
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
    packet.post().then(function(reponse) {
      console.log('comment posted');
      return defer.resolve(response.data);
    }, function(error) {
      return console.log('Project.postComment ERror');
    });
    return defer.promise;
  };
  like = function(project) {
    var defer, packet;
    defer = $q.defer();
    packet = baseREST.one('projects').one('like');
    packet.id = project.id;
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
  editProject = function(project) {
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
        return defer.resolve(response.data);
      };
    })(this), (function(_this) {
      return function(error) {
        return defer.reject(error);
      };
    })(this));
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
    removeProject: removeProject,
    getFeatured: getFeatured
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
      $rootScope.$broadcast('user:token_invalid');
      return $rootScope.$broadcast('user:stateChanged');
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
  var createUser, currentUser, deleteUser, getAll, getUser, isAuthenticated, login, logout, resetPassword, updateUser;
  this.user = null;
  this.deferreds = {};
  this.unauthorized = true;
  createUser = function(user) {
    var defer;
    console.log("Registering.");
    console.log(user);
    defer = $q.defer();
    Upload.upload({
      url: '/api/v1/users/',
      data: {
        data: user
      }
    }).then((function(_this) {
      return function(response) {
        console.log(response.data.data);
        _this.user = response.data.data.user;
        TokenContainer.set(response.data.data.token);
        _this.unauthorized = false;
        return defer.resolve(_this.user);
      };
    })(this), (function(_this) {
      return function(error) {
        return defer.reject(error);
      };
    })(this));
    return defer.promise;
  };
  login = function(form) {
    var defer, packet;
    defer = $q.defer();
    packet = baseREST.one('users').one('login');
    packet.data = {};
    packet.data.username = form.username;
    packet.data.password = form.password;
    return packet.post().then((function(_this) {
      return function(response) {
        _this.user = response.data.user;
        TokenContainer.set(response.data.token);
        _this.unauthorized = false;
        return defer.resolve(_this.user);
      };
    })(this), (function(_this) {
      return function(error) {
        return defer.reject(error);
      };
    })(this));
  };
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
    packet.get().then(function(response) {
      return defer.resolve(response.data);
    }, function(error) {
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
  updateUser = (function(_this) {
    return function(user) {
      var defer, packet;
      packet = baseREST.one('users');
      defer = $q.defer();
      Object.assign(packet, user.data[0]);
      user.put().then(function(response) {
        if (response.status === 422) {
          return defer.reject(response.data);
        } else {
          console.log('golden!');
          return defer.resolve(response.data.data);
        }
      }, function(error) {
        return defer.reject(error);
      });
      return defer.promise;
    };
  })(this);
  resetPassword = (function(_this) {
    return function(accountname) {
      var defer, packet;
      packet = baseREST.one('users').one('reset');
      defer = $q.defer();
      packet.data = accountname;
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
        console.log(_this.user);
        _this.unauthorized = true;
        return defer.resolve(response);
      }, function(error) {
        return defer.reject(error);
      });
      return defer.promise;
    };
  })(this);
  deleteUser = (function(_this) {
    return function(id) {
      var defer, packet;
      defer = $q.defer();
      packet = baseREST.one('users');
      packet.id = id;
      packet.remove().then(function(response) {
        if (response.status === 401) {
          _this.unauthorized = true;
          return defer.reject(response.data);
        } else {
          return defer.resolve();
        }
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
    login: login,
    logout: logout,
    deleteUser: deleteUser,
    createUser: createUser,
    isAuthenticated: isAuthenticated
  };
}]);

angular.module('gruenderviertel').controller('HomeCtrl', ["User", "Project", "Community", "most_used", "featured", function(User, Project, Community, most_used, featured) {
  this.featured = null;
  this.most_used = null;
  this.init = (function(_this) {
    return function() {
      Community.preloadTags();
      _this.featured = angular.copy(featured);
      _this.most_used = angular.copy(most_used);
      return null;
    };
  })(this);
  return this.init();
}]);

this;

angular.module('gruenderviertel').controller('NavCtrl', ["User", "$rootScope", "$state", "TokenContainer", function(User, $rootScope, $state, TokenContainer) {
  this.isAuthenticated = false;
  this.form = {};
  this.admin = false;
  this.username = "default";
  $rootScope.$on('user:stateChanged', (function(_this) {
    return function(e, state, params) {
      console.log("NavCtrl user:StateChanged");
      _this.setLoggedIn(TokenContainer.get());
      _this.setUsername();
      return _this.isAdmin();
    };
  })(this));
  this.init = function() {
    console.log("Initializing NavCtrl");
    this.setLoggedIn(TokenContainer.get());
    this.setUsername();
    this.isAdmin();
    return console.log("Nav Controller Initialized");
  };
  this.login = function() {
    return User.login(this.form).then(function(response) {
      return $rootScope.$broadcast('user:stateChanged');
    }, function(error) {
      return console.log("Error during Login");
    });
  };
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
  this.init();
  return this;
}]);

angular.module('gruenderviertel').controller('CommunityCtrl', ["instance", "Community", function(instance, Community) {
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
  this.subscribe = (function(_this) {
    return function() {
      return Community.join_community(_this.community.id).then(function(response) {
        return _this.subscribed = response;
      }, function(error) {
        return console.log('CommunityCtrl.subscribe Error');
      });
    };
  })(this);
  this.unsubscribe = (function(_this) {
    return function() {
      return Community.leave_community(_this.community.id).then(function(response) {
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
        return _this.discussions.push(response);
      }, function(error) {
        return console.log('CommunityCtrl.startDiscussion Error');
      });
    };
  })(this);
  this.comment = (function(_this) {
    return function(discussion_id) {
      var message;
      message = {
        content: _this.comment_form.content
      };
      return Community.post_comment(discussion_id, message).then(function(response) {
        var discussion, i, len, ref, results;
        ref = _this.discussions;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          discussion = ref[i];
          if (discussion.id === discussion_id) {
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
  return this;
}]);

angular.module('gruenderviertel').controller('CommunityOverviewCtrl', ["Community", "list", function(Community, list) {
  this.list = list;
  return this;
}]);

angular.module('gruenderviertel').controller('CreateProjectCtrl', ["Project", "Community", function(Project, Community) {
  this.tag_list;
  Community.get_all().then((function(_this) {
    return function(response) {
      return _this.tag_list = angular.copy(response);
    };
  })(this));
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
    if (!this.form.project.solution) {
      this.form.project.typus = "Problemstellung";
    } else {
      this.form.project.typus = "Showcase";
    }
    if (this.form.project.cooptext) {
      this.form.project.coop = true;
    } else {
      this.form.project.coop = false;
    }
    return Project.createProject(this.form.project);
  };
  this.form = {};
  this.form.project = {};
  return this;
}]);

angular.module('gruenderviertel').controller('ProjectCtrl', ["instance", "Project", function(instance, Project) {
  this.project = instance;
  this.comment = "";
  this.addComment = function() {
    return Project.postComment(this.project, this.comment).then((function(_this) {
      return function(response) {
        return _this.project.comments.push(response);
      };
    })(this));
  };
  return this;
}]);

angular.module('gruenderviertel').controller('ProfileCtrl', ["instance", "$state", function(instance, $state) {
  this.user = instance;
  this.my_projects = angular.copy(this.user.projects);
  this.my_comments = angular.copy(this.user.comments);
  this.my_discussions = angular.copy(this.user.posts);
  console.log(instance);
  this.goToComment = function(comment) {
    if (comment.parent_type === 'Project') {
      return $state.go('root.project', comment.parent_id);
    } else {
      return $state.go('root.community', comment.parent_id);
    }
  };
  return this;
}]);

angular.module('gruenderviertel').controller('RegistrationCtrl', ["User", "TokenContainer", "$state", "$rootScope", function(User, TokenContainer, $state, $rootScope) {
  this.form = {
    user: {}
  };
  this.reg_in_progress = false;
  this.register = function() {
    console.log(this.form);
    this.reg_in_progress = true;
    return User.createUser(this.form.user).then(function(response) {
      $rootScope.$broadcast('user:stateChanged');
      return $state.go('root.home');
    }, function(error) {
      this.reg_in_progress = false;
      return console.log('RegistrationCtrl.register Error');
    });
  };
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
      if (config.url.indexOf("/api/v1/") === 0) {
        token = TokenContainer.get();
        if (token) {
          config.headers['Authorization'] = "Bearer " + token;
        }
      }
      return config;
    }
  };
}]);
