var app,dependencies;dependencies=["ui.router","restangular","ngStorage","permission","permission.ui","ngFileUpload","toaster"],(app=angular.module("gruenderviertel",dependencies)).config(["$httpProvider",function(e){return e.interceptors.push("tokenInterceptor"),e.interceptors.push("responseInterceptor")}]),app.run(["User","TokenContainer","$rootScope","$state","$stateParams","Rails","$transitions",function(e,t,r,n,o,u,i){return r.$state=n,r.$stateParams=o,i.onBefore({},function(e){return r.lastState=e.from(),r.lastStateParams=e.params("from")})}]);var indexOf=[].indexOf||function(e){for(var t=0,r=this.length;t<r;t++)if(t in this&&this[t]===e)return t;return-1};angular.module("gruenderviertel").run(["$q","PermRoleStore","User",function(e,t,r){return t.defineRole("anonymous",function(t){var n;return n=e.defer(),r.isAuthenticated()?n.reject():n.resolve(),n.promise}),t.defineRole("registered",function(t){var n;return n=e.defer(),r.isAuthenticated()?n.resolve():n.reject,n.promise}),t.defineRole("admin",function(t){var n;return n=e.defer(),r.getRoles().then(function(e){return e||n.reject(),indexOf.call(e,"admin")>=0?n.resolve():n.reject()},function(){return n.reject()}),n.promise})}]),angular.module("gruenderviertel").config(["$stateProvider","$urlRouterProvider","$locationProvider",function(e,t,r){return t.otherwise(function(e){return e.get("$state").go("root.home")}),r.html5Mode(!0),r.hashPrefix(""),e.state("root",{url:"",abstract:!0,views:{"header@":{templateUrl:"assets/views/common/navbar.html",controller:"NavCtrl",controllerAs:"nav"},"footer@":{templateUrl:"assets/views/common/footer.html"}},resolve:{identity:["TokenContainer","User","$rootScope",function(e,t,r){if(e.get())return t.currentUser().then(function(e){return t.user=e,r.$broadcast("user:stateChanged")},function(e){})}]}}).state("root.home",{url:"/",views:{"body@":{templateUrl:"assets/views/common/home.html",controller:"HomeCtrl",controllerAs:"home"}},resolve:{most_used:["Community",function(e){return e.getMostUsed().then(function(e){return e},function(e){return[]})}],featured:["Project",function(e){return e.getFeatured().then(function(e){return e},function(e){return[]})}]}}).state("root.profile",{url:"/profile",views:{"body@":{templateUrl:"assets/views/users/profile.html",controller:"ProfileCtrl",controllerAs:"profile"}},params:{id:null},resolve:{instance:["$stateParams","Helper","User",function(e,t,r){var n;return n=e.id,r.getUser(n).then(function(e){return e},function(e){return t.goBack(),null})}]}}).state("root.register",{url:"/registration",views:{"body@":{templateUrl:"assets/views/users/registration.html",controller:"RegistrationCtrl",controllerAs:"reg"}}}).state("root.profile.editprofile",{url:"/edit",views:{"body@":{templateUrl:"assets/views/users/editprofile.html",controller:"ProfileEditCtrl",controllerAs:"edit"}}}).state("root.passwordrecovery",{url:"/recover",views:{"body@":{templateUrl:"assets/views/users/recovery.html",controller:"RecoveryCtrl",controllerAs:"recovery"}}}).state("root.project",{url:"/project",views:{"body@":{templateUrl:"assets/views/projects/project.html",controller:"ProjectCtrl",controllerAs:"project"}},params:{id:null},resolve:{instance:["$stateParams","Helper","Project",function(e,t,r){return null!==e.id?r.getOne(e.id).then(function(e){return e},function(e){return t.goBack(),null}):(t.goBack(),null)}]}}).state("root.createproject",{url:"/project/new",views:{"body@":{templateUrl:"assets/views/projects/create.html",controller:"CreateProjectCtrl",controllerAs:"create"}}}).state("root.editproject",{url:"/project/edit",views:{"body@":{templateUrl:"assets/views/projects/edit.html",controller:"EditProjectCtrl",controllerAs:"edit"}}}).state("root.communityoverview",{url:"/communities",views:{"body@":{templateUrl:"assets/views/communities/overview.html",controller:"CommunityOverviewCtrl",controllerAs:"coc"}},resolve:{list:["Helper","Community",function(e,t){return t.get_all().then(function(e){return e},function(t){return e.goBack(),null})}]}}).state("root.community",{url:"/community",views:{"body@":{templateUrl:"assets/views/communities/community.html",controller:"CommunityCtrl",controllerAs:"community"}},params:{id:null},resolve:{instance:["$stateParams","Helper","Community",function(e,t,r){return null!==e.id?r.returnCommunity(e.id).then(function(e){return e},function(e){return t.goBack(),null}):(t.goBack(),null)}]}}).state("root.admin",{url:"/admin",abstract:!0,data:{permissions:{only:"admin",redirectTo:"root.home"}}}).state("root.admin.usermanagement",{url:"/users",views:{"body@":{templateUrl:"assets/views/admin/users.html",controller:"UserManagementCtrl",controllerAs:"users"}}}).state("root.admin.projectmanagement",{url:"/projects",views:{"body@":{templateUrl:"assets/views/admin/projects.html",controller:"ProjectManagementCtrl",controllerAs:"projects"}}}).state("root.admin.communitymanagement",{url:"/projects",views:{"body@":{templateUrl:"assets/views/admin/communities.html",controller:"CommunitiyManagementCtrl",controllerAs:"communities"}}}).state("root.admin.reports",{url:"/projects",views:{"body@":{templateUrl:"assets/views/admin/reports.html",controller:"ReportCtrl",controllerAs:"reports"}}})}]),angular.module("gruenderviertel").factory("baseREST",["Rails","Restangular",function(e,t){return t.withConfig(function(t){return""+e.database,t.setBaseUrl("/api/v1"),t.setDefaultHeaders({"Content-Type":"application/json"}),t.setRequestSuffix(".json")})}]),angular.module("gruenderviertel").service("Community",["$q","$rootScope","$state","Upload","baseREST",function(e,t,r,n,o){var u,i,s,a,c,l,d,m,f;return this.community_list=null,u=function(t){var r;return r=e.defer(),o.one("communities").post().then(function(e){return r.resolve(e.data)},function(e){return r.reject(e)}),r.promise},a=function(t){var r,n;return r=e.defer(),n=o.one("communities").one("join"),n.id=t,n.post().then(function(e){return r.resolve(e.data)},function(e){return r.reject(e)}),r.promise},d=function(t,r){var n,u;return n=e.defer(),u=o.one("communities").one("post"),u.id=t,u.data=r,u.post().then(function(e){return n.resolve(e.data)},function(e){return n.reject(e)}),n.promise},l=function(t,r){var n,u;return n=e.defer(),u=o.one("communities").one("comment"),u.id=t,u.data=r,u.post().then(function(e){return n.resolve(e.data)},function(e){return n.reject(e)}),n.promise},s=function(){var t;return t=e.defer(),this.community_list?t.resolve(this.community_list):o.one("communities").get().then(function(e){return this.community_list=e.data,t.resolve(e.data)},function(e){return t.reject(e)}),t.promise},i=function(){var t;return t=e.defer(),o.one("communities").one("popular").get().then(function(e){t.resolve(e.data)},function(e){return t.reject(e)}),t.promise},m=function(){var t;return t=e.defer(),s().then(function(e){return t.resolve("ok")},function(e){return t.reject(e)}),t.promise},f=function(t){var r,n;return r=e.defer(),n=o.one("communities"),n.id=t,n.get().then(function(e){return r.resolve(e.data)},function(e){return r.reject(e)}),r.promise},c=function(t){var r,n;return r=e.defer(),n=o.one("communities").one("leave"),n.id=t,n.remove().then(function(e){return r.resolve(e.data)},function(e){return r.reject(e)}),r.promise},{create_community:u,join_community:a,post_discussion:d,post_comment:l,get_all:s,getMostUsed:i,preloadTags:m,returnCommunity:f,leave_community:c}}]),angular.module("gruenderviertel").service("Helper",["$rootScope","$state",function(e,t){var r;return r=function(r){var n,o;return n=e.lastState,o=e.lastStateParams,n.name?t.go(n.name,o):t.go("root.home")},{goBack:r}}]),angular.module("gruenderviertel").service("Project",["baseREST","$q","Upload",function(e,t,r){var n,o,u,i,s,a,c,l;return n=function(e){var n;return n=t.defer(),r.upload({url:"/api/v1/projects/",data:{data:e},arrayKey:"[]"}).then(function(e){return n.resolve(e.data)},function(e){return n.reject(e)}),n.promise},c=function(r,n){var o,u;return o=t.defer(),u=e.one("projects").one("comment"),u.id=r.id,u.data=n,u.post().then(function(e){return o.resolve(response.data)},function(e){}),o.promise},a=function(r){var n,o;return n=t.defer(),o=e.one("projects").one("like"),o.id=r.id,o.post().then(function(e){return n.resolve(e.data)},function(e){return n.reject(e)}),n.promise},u=function(){var r;return r=t.defer(),e.one("projects").get().then(function(e){return r.resolve(e.data)},function(e){return r.reject(e.data.error)}),r.promise},s=function(r){var n,o;return n=t.defer(),o=e.one("projects"),o.id=r,o.get().then(function(e){return n.resolve(e.data)},function(e){return n.reject(e)}),n.promise},i=function(){var r;return r=t.defer(),e.one("projects").one("featured").get().then(function(e){return r.resolve(e.data)},function(e){return r.reject(e)}),r.promise},o=function(e){var n;return n=t.defer(),r.upload({url:"/api/v1/projects/",data:{data:e},arrayKey:"[]"}).then(function(e){return n.resolve(e.data)},function(e){return n.reject(e)}),n.promise},l=function(r){var n,o;return n=t.defer(),o=e.one("projects"),o.id=r,o.delete.then(function(e){return conosle.log("Remove Interest"),n.resolve(e.data)},function(e){return n.reject(e)}),n.promise},{createProject:n,postComment:c,like:a,getAll:u,getOne:s,editProject:o,removeProject:l,getFeatured:i}}]),angular.module("gruenderviertel").service("TokenContainer",["$localStorage","Rails","$rootScope","$timeout",function(e,t,r,n){var o,u,i,s,a;return a=function(t){var r,n,o;return o={token:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token},r=+new Date,n=r+1e3*o.expiresIn,e.token=angular.extend(o,{expiresAt:n})},i=function(){var e;return(e=o())?e.token:null},s=function(){var e;return(e=o())?e:null},o=function(){return e.token||null},u=function(){return delete e.token,n(function(){return r.$broadcast("user:token_invalid"),r.$broadcast("user:stateChanged")})},{get:i,getRaw:s,set:a,deleteToken:u}}]),angular.module("gruenderviertel").service("User",["baseREST","$q","$http","Rails","$rootScope","Upload","TokenContainer",function(e,t,r,n,o,u,i){var s,a,c,l,d,m,f,p,h,v;return this.user=null,this.deferreds={},this.unauthorized=!0,s=function(e){var r;return r=t.defer(),u.upload({url:"/api/v1/users/",data:{data:e}}).then(function(e){return function(t){return e.user=t.data.data.user,i.set(t.data.data.token),e.unauthorized=!1,r.resolve(e.user)}}(this),function(e){return r.reject(e)}),r.promise},f=function(r){var n,o;return n=t.defer(),o=e.one("users").one("login"),o.data={},o.data.username=r.username,o.data.password=r.password,o.post().then(function(e){return function(t){return e.user=t.data.user,i.set(t.data.token),e.unauthorized=!1,n.resolve(e.user)}}(this),function(e){return n.reject(e)})},l=function(){var r;return r=t.defer(),e.one("users").get().then(function(e){return r.resolve(e.data)},function(e){return r.reject(e)}),r.promise},d=function(r){var n,o;return n=t.defer(),o=e.one("users"),o.id=r||"me",o.get().then(function(e){return n.resolve(e.data)},function(e){return n.reject(e.error)}),n.promise},a=function(r){return function(){var n,o;return n=t.defer(),m()?(n.resolve(r.user),n.promise):r.deferreds.me?r.deferreds.me.promise:(r.deferreds.me=n,o=e.one("users"),o.id="me",o.get().then(function(e){return r.unauthorized=!1,r.user=e.data,r.deferreds.me.resolve(e.data),delete r.deferreds.me},function(e){return r.deferreds.me.reject(),delete r.deferreds.me}),r.deferreds.me.promise)}}(this),v=function(r){var n,o;return o=e.one("users"),n=t.defer(),Object.assign(o,r.data[0]),r.put().then(function(e){return 422===e.status?n.reject(e.data):n.resolve(e.data.data)},function(e){return n.reject(e)}),n.promise},h=function(r){var n,o;return o=e.one("users").one("reset"),n=t.defer(),o.data=r,o.post().then(function(e){return n.resolve(e.data)},function(e){return n.reject(e)}),n.promise},p=function(r){return function(){var n;return n=t.defer(),e.one("users").one("logout").remove().then(function(e){return i.deleteToken(),r.user=null,r.unauthorized=!0,n.resolve(e)},function(e){return n.reject(e)}),n.promise}}(this),c=function(r){return function(n){var o,u;return o=t.defer(),u=e.one("users"),u.id=n,u.remove().then(function(e){return 401===e.status?(r.unauthorized=!0,o.reject(e.data)):o.resolve()}),o.promise}}(this),m=function(e){return function(){return!e.unauthorized&&null!=e.user}}(this),{getAll:l,getUser:d,currentUser:a,updateUser:v,resetPassword:h,login:f,logout:p,deleteUser:c,createUser:s,isAuthenticated:m}}]),angular.module("gruenderviertel").controller("HomeCtrl",["User","Project","Community","most_used","featured",function(e,t,r,n,o){return this.featured=null,this.most_used=null,this.init=function(e){return function(){return r.preloadTags(),e.featured=angular.copy(o),e.most_used=angular.copy(n),null}}(this),this.init()}]),angular.module("gruenderviertel").controller("NavCtrl",["User","$rootScope","$state","TokenContainer",function(e,t,r,n){return this.isAuthenticated=!1,this.form={},this.admin=!1,this.username="default",t.$on("user:stateChanged",function(e){return function(t,r,o){return e.setLoggedIn(n.get()),e.setUsername(),e.isAdmin()}}(this)),this.init=function(){this.setLoggedIn(n.get()),this.setUsername(),this.isAdmin()},this.login=function(){return e.login(this.form).then(function(e){return t.$broadcast("user:stateChanged")},function(e){})},this.logout=function(){return e.logout().then(function(){return r.go("root.home")})},this.setUsername=function(t){return function(){if(t.isAuthenticated)return e.currentUser().then(function(e){return t.username=angular.copy(e.username)},function(e){this.username="Angemeldet"})}}(this),this.setLoggedIn=function(e){return function(t){e.isAuthenticated=!!t}}(this),this.isAdmin=function(t){return function(){return e.user&&"admin"===e.user.role?t.admin=!0:t.admin=!1}}(this),this.init(),this}]),angular.module("gruenderviertel").controller("CommunityCtrl",["instance","Community",function(e,t){return this.community=e,this.icon=e.icon,this.projects=e.projects,this.members=e.users,this.discussions=e.discussions,this.member_count=e.member_count,this.project_count=e.project_count,this.subscribed=e.subscribed,this.discussion_form={},this.comment_form={},this.subscribe=function(e){return function(){return t.join_community(e.community.id).then(function(t){return e.subscribed=t},function(e){})}}(this),this.unsubscribe=function(e){return function(){return t.leave_community(e.community.id).then(function(t){return e.subscribed=t},function(e){})}}(this),this.startDiscussion=function(e){return function(){var r;return r={title:e.discussion_form.title,content:e.discussion_form.content},t.post_discussion(e.community.id,r).then(function(t){return e.discussions.push(t)},function(e){})}}(this),this.comment=function(e){return function(r){var n;return n={content:e.comment_form.content},t.post_comment(r,n).then(function(t){var n,o,u,i,s;for(s=[],o=0,u=(i=e.discussions).length;o<u;o++)(n=i[o]).id===r?s.push(n.comments.push(t)):s.push(void 0);return s},function(e){})}}(this),this}]),angular.module("gruenderviertel").controller("CommunityOverviewCtrl",["Community","list",function(e,t){return this.list=t,this}]),angular.module("gruenderviertel").controller("CreateProjectCtrl",["Project",function(e){return this.form={},this}]),angular.module("gruenderviertel").controller("ProjectCtrl",["instance","Project",function(e,t){return this.project=e,this}]),angular.module("gruenderviertel").controller("ProfileCtrl",["instance","$state",function(e,t){return this.user=e,this.my_projects=angular.copy(this.user.projects),this.my_comments=angular.copy(this.user.comments),this.my_discussions=angular.copy(this.user.posts),this.goToComment=function(e){return"Project"===e.parent_type?t.go("root.project",e.parent_id):t.go("root.community",e.parent_id)},this}]),angular.module("gruenderviertel").controller("RegistrationCtrl",["User","TokenContainer","$state","$rootScope",function(e,t,r,n){return this.form={user:{}},this.reg_in_progress=!1,this.register=function(){return this.reg_in_progress=!0,e.createUser(this.form.user).then(function(e){return n.$broadcast("user:stateChanged"),r.go("root.home")},function(e){this.reg_in_progress=!1})},this}]),angular.module("gruenderviertel").factory("badrequestHandler",["$injector",function(e){return function(e,t){var r,n,o,u,i,s,a,c;for(r={},n=0,u=(s=e.data.error).length;n<u;n++)for(o=0,i=(a=s[n].messages).length;o<i;o++)r[(c=a[o].split(":"))[0]]=c[1];return t.reject({status:400,errors:r}),t.promise}}]),angular.module("gruenderviertel").factory("conflictHandler",["$injector",function(e){return function(e,t){return t.reject(e),t.promise}}]),angular.module("gruenderviertel").factory("forbiddenHandler",["$injector",function(e){return function(e,t){return t.reject(e),t.promise}}]),angular.module("gruenderviertel").factory("notfoundHandler",["$injector",function(e){return function(e,t){return t.reject(e),t.promise}}]),angular.module("gruenderviertel").factory("unauthorizedHandler",["$injector",function(e){return function(t,r){var n,o;return n=e.get("TokenContainer"),o=e.get("$state"),"invalid_token"===t.data.error.error.name&&(n.deleteToken(),o.go("root.home")),r.reject(t),r.promise}}]),angular.module("gruenderviertel").factory("responseInterceptor",["$q","$injector",function(e,t){return{responseError:function(r){var n;switch(n=e.defer(),r.status){case 400:return t.get("badrequestHandler")(r,n);case 401:return t.get("unauthorizedHandler")(r,n);case 403:return t.get("forbiddenHandler")(r,n);case 404:return t.get("notfoundHandler")(r,n);case 409:return t.get("conflictHandler")(r,n);default:return n.reject(r),n.promise}return r}}}]),angular.module("gruenderviertel").factory("tokenInterceptor",["TokenContainer","Rails",function(e,t){return{request:function(t){var r;return 0===t.url.indexOf("/api/v1/")&&(r=e.get())&&(t.headers.Authorization="Bearer "+r),t}}}]);