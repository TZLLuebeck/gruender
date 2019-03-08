var app,dependencies,hidebody;dependencies=["ui.router","restangular","ngStorage","permission","permission.ui","ngFileUpload","toaster","ngSanitize","ui.tinymce"],(app=angular.module("gruenderviertel",dependencies)).config(["$httpProvider",function(e){return e.interceptors.push("tokenInterceptor"),e.interceptors.push("responseInterceptor")}]),hidebody=function(){return $("#bodycover").removeClass("in")},app.run(["User","TokenContainer","$rootScope","$state","$stateParams","Rails","$transitions",function(e,t,r,n,o,i,s){return r.$state=n,r.$stateParams=o,s.onBefore({},function(e){return hidebody(),r.lastState=e.from(),r.lastStateParams=e.params("from")}),r.$on("$viewContentLoaded",function(e,t){return $("#bodycover").addClass("in")}),s.onSuccess({},function(e,t,r){return t&&t.hash()?r():document.body.scrollTop=document.documentElement.scrollTop=0})}]),angular.module("gruenderviertel").run(["$q","PermRoleStore","User",function(e,t,r){return t.defineRole("anonymous",function(t){var n;return n=e.defer(),r.isAuthenticated()?n.reject():n.resolve(),n.promise}),t.defineRole("registered",function(t){var n;return n=e.defer(),r.isAuthenticated()?n.resolve():n.reject,n.promise}),t.defineRole("administrative",function(t){var n;return n=e.defer(),r.getRole().then(function(e){return e||n.reject(),(e="admin")?n.resolve():n.reject()},function(){return n.reject()}),n.promise}),t.defineRole("admin",function(t){var n;return n=e.defer(),r.getRole().then(function(e){return e||n.reject(),(e="admin")?n.resolve():n.reject()},function(){return n.reject()}),n.promise})}]),angular.module("gruenderviertel").config(["$stateProvider","$urlRouterProvider","$locationProvider",function(e,t,r){return t.otherwise(function(e){return e.get("$state").go("root.home")}),r.html5Mode(!0),r.hashPrefix(""),e.state("root",{url:"",abstract:!0,views:{"header@":{templateUrl:"assets/views/common/navbar.html",controller:"NavCtrl",controllerAs:"nav"},"footer@":{templateUrl:"assets/views/common/footer.html"}},resolve:{identity:["TokenContainer","User","$rootScope",function(e,t,r){if(e.get())return t.currentUser().then(function(e){return t.user=e,r.$broadcast("user:stateChanged")},function(e){})}]}}).state("root.home",{url:"/",views:{"body@":{templateUrl:"assets/views/common/home.html",controller:"HomeCtrl",controllerAs:"home"}},resolve:{most_used:["Community",function(e){return e.getMostUsed().then(function(e){return e},function(e){return[]})}],featured:["Project",function(e){return e.getFeatured().then(function(e){return e},function(e){return[]})}]}}).state("root.profile",{url:"/profil/:id",views:{"body@":{templateUrl:"assets/views/users/profile.html",controller:"ProfileCtrl",controllerAs:"profile"}},params:{id:null},resolve:{instance:["$stateParams","Helper","User",function(e,t,r){var n;return n=e.id,r.getUser(n).then(function(e){return e},function(e){return t.goBack(),null})}]}}).state("root.register",{url:"/registrierung",views:{"body@":{templateUrl:"assets/views/users/registration.html",controller:"RegistrationCtrl",controllerAs:"reg"}},params:{user:null}}).state("root.profile.editprofile",{url:"/edit",views:{"body@":{templateUrl:"assets/views/users/edit.html",controller:"ProfileEditCtrl",controllerAs:"edit"}},resolve:{instance:["User",function(e){return e.currentUser().then(function(e){return e},function(e){return Helper.goBack(),null})}]}}).state("root.passwordrecovery",{url:"/recover",views:{"body@":{templateUrl:"assets/views/users/password_recovery.html",controller:"RecoveryCtrl",controllerAs:"recovery"}}}).state("root.pmwrite",{url:"/pm_verfassen",views:{"body@":{templateUrl:"assets/views/users/newpm.html",controller:"PMWriteCtrl",controllerAs:"message"}}}).state("root.project",{url:"/projekt/:id",views:{"body@":{templateUrl:"assets/views/projects/project.html",controller:"ProjectCtrl",controllerAs:"project"}},params:{id:null},resolve:{instance:["$stateParams","Helper","Project",function(e,t,r){return null!==e.id?r.getOne(e.id).then(function(e){return e},function(e){return t.goBack(),null}):(t.goBack(),null)}]}}).state("root.createproject",{url:"/projekt/neu",views:{"body@":{templateUrl:"assets/views/projects/create.html",controller:"CreateProjectCtrl",controllerAs:"create"}},data:{permissions:{except:"anonymous",redirectTo:"root.register"}}}).state("root.project.editproject",{url:"/bearbeiten",views:{"body@":{templateUrl:"assets/views/projects/edit.html",controller:"EditProjectCtrl",controllerAs:"edit"}},data:{permissions:{except:"anonymous"}}}).state("root.browseprojects",{url:"/projekte/:category",views:{"body@":{templateUrl:"assets/views/projects/filter.html",controller:"ProjectFilterCtrl",controllerAs:"filter"}},params:{category:null},resolve:{projects:["$stateParams","Helper","Project",function(e,t,r){var n;return null!==(n=e.category)?r.getByCategory(n).then(function(e){return e},function(e){return t.goBack()}):(t.goBack(),null)}]}}).state("root.communityoverview",{url:"/communities",views:{"body@":{templateUrl:"assets/views/communities/overview.html",controller:"CommunityOverviewCtrl",controllerAs:"coc"}},resolve:{list:["Helper","Community",function(e,t){return t.get_all().then(function(e){return e},function(t){return e.goBack(),null})}]}}).state("root.community",{url:"/community/:id",views:{"body@":{templateUrl:"assets/views/communities/community.html",controller:"CommunityCtrl",controllerAs:"community"}},params:{id:null},resolve:{instance:["$stateParams","Helper","Community",function(e,t,r){return null!==e.id?r.returnCommunity(e.id).then(function(e){return e},function(e){return t.goBack(),null}):(t.goBack(),null)}]}}).state("root.admin",{url:"/admin",abstract:!0,data:{permissions:{only:"admin",redirectTo:"root.home"}}}).state("root.admin.usermanagement",{url:"/accounts",views:{"body@":{templateUrl:"assets/views/admin/users.html",controller:"UserManagementCtrl",controllerAs:"users"}}}).state("root.admin.projectmanagement",{url:"/projekte",views:{"body@":{templateUrl:"assets/views/admin/projects.html",controller:"ProjectManagementCtrl",controllerAs:"projects"}}}).state("root.admin.communitymanagement",{url:"/communities",views:{"body@":{templateUrl:"assets/views/admin/communities.html",controller:"CommunitiyManagementCtrl",controllerAs:"communities"}}}).state("root.admin.reports",{url:"/meldungen",views:{"body@":{templateUrl:"assets/views/admin/reports.html",controller:"ReportCtrl",controllerAs:"reports"}}}).state("root.datenschutz",{url:"/Datenschutz",views:{"body@":{templateUrl:"assets/views/singletons/datenschutz.html"}}}).state("root.impressum",{url:"/Impressum",views:{"body@":{templateUrl:"assets/views/singletons/impressum.html"}}}).state("root.nutzungsbedingungen",{url:"/Nutzungsbedingungen",views:{"body@":{templateUrl:"assets/views/singletons/agb.html"}}}).state("root.fablab",{url:"/FabLab_Luebeck",views:{"body@":{templateUrl:"assets/views/singletons/fablab.html"}}}).state("root.geschaeftsmodelle",{url:"/Geschaeftsmodelle_4.0",views:{"body@":{templateUrl:"assets/views/singletons/geschaeftsmodelle.html"}}}).state("root.openinnovation",{url:"/Open_Innovation",views:{"body@":{templateUrl:"assets/views/singletons/open_innovation.html"}}}).state("root.kontakt",{url:"/Kontakt",views:{"body@":{templateUrl:"assets/views/singletons/kontakt.html"}}})}]),angular.module("gruenderviertel").directive("anchormove",["$document","$window","$anchorScroll","$location",function(e,t,r,n){return{restrict:"A",link:function(e,t,o){return n.hash()?r():document.body.scrollTop=document.documentElement.scrollTop=0}}}]),angular.module("gruenderviertel").directive("onScrollToBottom",["$document","$window",function(e,t){return{restrict:"A",link:function(r,n,o){return e.bind("scroll",function(){if(t.pageYOffset+t.innerHeight>=n.height())return r.$apply(o.onScrollToBottom)}),r.$on("$destroy",function(){return e.unbind("scroll")})}}}]),angular.module("gruenderviertel").directive("scrolltop",["$document","$window",function(e,t){return{restrict:"A",link:function(e,r,n){return r.bind("click",function(){return t.scrollTo(0,0)}),e.$on("$destroy",function(){return r.unbind("click")})}}}]),angular.module("gruenderviertel").directive("summernote",["$document","$window",function(e,t){return{restrict:"A",link:function(t,r,n){return e.ready(function(){return $("#summernote").summernote({height:300,minHeight:300,toolbar:[["style",["bold","italic","underline","clear"]],["font",["strikethrough","superscript","subscript"]],["fontsize",["fontsize"]],["color",["color"]],["para",["ul","ol","paragraph","hr"]],["height",["height"]],["insert",["link","picture"]],["control",["undo","redo","fullscreen","help"]]]})})}}}]),angular.module("gruenderviertel").directive("tooltips",["$document","$window",function(e,t){return{restrict:"A",link:function(t,r,n){return e.ready(function(){return $('[data-toggle="tooltip"]').tooltip(),$('[data-toggle="popover"]').popover()})}}}]),angular.module("gruenderviertel").factory("baseREST",["Rails","Restangular",function(e,t){return t.withConfig(function(t){return""+e.database,t.setBaseUrl("/api/v1"),t.setDefaultHeaders({"Content-Type":"application/json"}),t.setRequestSuffix(".json")})}]),angular.module("gruenderviertel").service("Community",["$q","$rootScope","$state","Upload","baseREST",function(e,t,r,n,o){var i,s,u,a,c,l,d,m,f,h,p;return this.community_list=null,i=function(t){var r;return r=e.defer(),o.one("communities").post().then(function(e){return r.resolve(e.data)},function(e){return r.reject(e)}),r.promise},l=function(t){var r,n;return r=e.defer(),n=o.one("communities").one("join"),n.id=t,n.post().then(function(e){return r.resolve(e.data)},function(e){return r.reject(e)}),r.promise},f=function(t,r){var n,i;return n=e.defer(),i=o.one("communities").one("post"),i.id=t,i.data=r,i.post().then(function(e){return n.resolve(e.data)},function(e){return n.reject(e)}),n.promise},m=function(t,r){var n,i;return n=e.defer(),i=o.one("communities").one("comment"),i.id=t,i.data=r,i.post().then(function(e){return n.resolve(e.data)},function(e){return n.reject(e)}),n.promise},c=function(){var t;return t=e.defer(),this.community_list?t.resolve(this.community_list):o.one("communities").get().then(function(e){return this.community_list=e.data,t.resolve(e.data)},function(e){return t.reject(e)}),t.promise},a=function(){var t;return t=e.defer(),o.one("communities").one("popular").get().then(function(e){t.resolve(e.data)},function(e){return t.reject(e)}),t.promise},h=function(){var t;return t=e.defer(),c().then(function(e){return t.resolve("ok")},function(e){return t.reject(e)}),t.promise},p=function(t){var r,n;return r=e.defer(),n=o.one("communities"),n.id=t,n.get().then(function(e){return r.resolve(e.data)},function(e){return r.reject(e)}),r.promise},u=function(t,r){var n,i,s;return i=e.defer(),s=o.one("communities").one("post"),s.id=t,n={},n.content=r,s.customPUT(n).then(function(e){return i.resolve(e.data)},function(e){return i.reject(e)}),i.promise},s=function(t,r){var n,i,s;return i=e.defer(),s=o.one("communities").one("comment"),s.id=t,n={},n.content=r,s.customPUT(n).then(function(e){return i.resolve(e.data)},function(e){return i.reject(e)}),i.promise},d=function(t){var r,n;return r=e.defer(),n=o.one("communities").one("leave"),n.id=t,n.remove().then(function(e){return r.resolve(e.data)},function(e){return r.reject(e)}),r.promise},{create_community:i,join_community:l,post_discussion:f,post_comment:m,get_all:c,getMostUsed:a,preloadTags:h,editDiscussion:u,editComment:s,returnCommunity:p,leave_community:d}}]),angular.module("gruenderviertel").service("Event",["baseREST","$q","$rootScope",function(e,t,r){var n,o,i;return this.newEvents=[],r.$on("events:checkEvents",function(e){return function(t,r,n){return e.checkForNewEvents()}}(this)),n=function(r){return function(){var n;return n=t.defer,e.one("events").one("new").get().then(function(e){return r.newEvents=e.data,n.resolve(e.data)},function(e){return n.reject(e)}),n.promise}}(this),i=function(r){return function(n){var o,i,s;return o=t.defer,i=e.one("events"),s={amount:n},i.customGET("",s).then(function(e){return r.newEvents=e.data,o.resolve(e.data)},function(e){return o.reject(e)}),o.promise}}(this),o=function(e){return function(t){var r,n,o,i,s,u,a,c,l,d,m,f,h;for(n=[],h=[],i=0,a=t.length;i<a;i++){if("Comment"===(o=t[i]).trigger_type)if("Project"===o.target_type){for(o.message="Neuer Kommentar für Projekt",s=0,c=(m=e.my_projects).length;s<c;s++)if(d=m[s],d.id=o.target_id){o.message+=": "+d.name;break}}else if("Post"===o.target_type){for(o.message="Neuer Kommentar für Diskussion",u=0,l=(f=e.my_discussions).length;u<l;u++)if((r=f[u]).id===o.target_id){o.community_id=r.community_id,o.message+=": "+r.title;break}}else o.message="Neues Ereignis.";else o.message="Neues Ereignis.";h.push(n.push(o))}return h}}(this),{checkForNewEvents:n,getLatestEvents:i,decodeEvents:o}}]),angular.module("gruenderviertel").service("Helper",["$rootScope","$state",function(e,t){var r;return r=function(r){var n,o;return n=e.lastState,o=e.lastStateParams,n.name?t.go(n.name,o):t.go("root.home")},{goBack:r}}]),angular.module("gruenderviertel").service("Project",["baseREST","$q","Upload",function(e,t,r){var n,o,i,s,u,a,c,l,d,m,f;return n=function(e){var n;return n=t.defer(),r.upload({url:"/api/v1/projects/",data:{data:e},arrayKey:"[]"}).then(function(e){return n.resolve(e.data.data)},function(e){return n.reject(e)}),n.promise},m=function(r,n){var o,i;return o=t.defer(),i=e.one("projects").one("comment"),i.id=r.id,i.content=n,i.post().then(function(e){return o.resolve(e.data)},function(e){}),o.promise},d=function(r){var n,o;return n=t.defer(),o=e.one("projects").one("like"),o.id=r,o.post().then(function(e){return n.resolve(e.data)},function(e){return n.reject(e)}),n.promise},s=function(){var r;return r=t.defer(),e.one("projects").get().then(function(e){return r.resolve(e.data)},function(e){return r.reject(e.data.error)}),r.promise},l=function(r){var n,o;return n=t.defer(),o=e.one("projects"),o.id=r,o.get().then(function(e){return n.resolve(e.data)},function(e){return n.reject(e)}),n.promise},u=function(r){var n,o,i;return n=t.defer(),o=e.one("projects").one("category"),i={category:r},o.customGET("",i).then(function(e){return n.resolve(e.data)},function(e){return n.reject(e)}),n.promise},a=function(){var r;return r=t.defer(),e.one("projects").one("featured").get().then(function(e){return r.resolve(e.data)},function(e){return r.reject(e)}),r.promise},c=function(r){var n,o,i;return n=t.defer(),o=e.one("projects").one("more"),i={current:r},o.customGET("",i).then(function(e){return n.resolve(e.data)},function(e){return n.reject(e)}),n.promise},i=function(e){var n;return delete e.comments,delete e.likes,delete e.liked,delete e.author,delete e.coop,delete e.cooptext,delete e.status,n=t.defer(),r.upload({url:"/api/v1/projects/",data:{data:e},arrayKey:"[]",method:"PUT"}).then(function(e){n.resolve(e.data.data)},function(e){n.reject(e)}),n.promise},o=function(r,n){var o,i,s;return i=t.defer(),s=e.one("projects").one("comment"),s.id=r,o={},o.content=n,s.customPUT(o).then(function(e){return i.resolve(e.data)},function(e){return i.reject(e)}),i.promise},f=function(r){var n,o;return n=t.defer(),o=e.one("projects"),o.id=r,o.delete.then(function(e){return conosle.log("Remove Interest"),n.resolve(e.data)},function(e){return n.reject(e)}),n.promise},{createProject:n,postComment:m,like:d,getAll:s,getOne:l,editProject:i,editComment:o,removeProject:f,getFeatured:a,getMore:c,getByCategory:u}}]),angular.module("gruenderviertel").service("TokenContainer",["$localStorage","Rails","$rootScope","$timeout",function(e,t,r,n){var o,i,s,u,a;return a=function(t){var r,n,o;return o={token:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token},r=+new Date,n=r+1e3*o.expiresIn,e.token=angular.extend(o,{expiresAt:n})},s=function(){var e;return(e=o())?e.token:null},u=function(){var e;return(e=o())?e:null},o=function(){return e.token||null},i=function(){return delete e.token,n(function(){return r.$broadcast("user:token_invalid")})},{get:s,getRaw:u,set:a,deleteToken:i}}]),angular.module("gruenderviertel").service("User",["baseREST","$q","$http","Rails","$rootScope","Upload","TokenContainer",function(e,t,r,n,o,i,s){var u,a,c,l,d,m,f,h,p,g,v,y,j,_,w,$;return this.user=null,this.newEvents=0,this.events=[],this.deferreds={},this.unauthorized=!0,a=function(e){return function(r){var n;return n=t.defer(),i.upload({url:"/api/v1/users/",data:{data:r},arrayKey:"[]"}).then(function(t){return e.user=t.data.data.user,o.activeUser=e.user,s.set(t.data.data.token),e.unauthorized=!1,n.resolve(e.user)},function(e){return n.reject(e)}),n.promise}}(this),v=function(r){return function(n){var i,u;return i=t.defer(),u=e.one("users").one("login"),u.data={},u.data.username=n.username,u.data.password=n.password,u.post().then(function(e){return r.user=e.data.user,o.activeUser=r.user,s.set(e.data.token),r.unauthorized=!1,o.$broadcast("event:newEvents"),i.resolve(r.user)},function(e){return i.reject(e)}),i.promise}}(this),$=function(r,n){var o,i;return o=t.defer(),i=e.one("users").one("pm"),i.data={receiver:r,content:n},i.post().then(function(e){return o.resolve(e)},function(e){return o.reject(e)}),o.promise},u=function(r){var n,o;return n=t.defer(),o=e.one("users").one("username"),o.username=r,o.post().then(function(e){return n.resolve(e.data)},function(e){return n.reject(e)}),n.promise},d=function(){var r;return r=t.defer(),e.one("users").get().then(function(e){return r.resolve(e.data)},function(e){return r.reject(e)}),r.promise},p=function(r){var n,o;return n=t.defer(),o=e.one("users"),o.id=r||"me",o.get().then(function(e){return n.resolve(e.data)},function(e){return n.reject(e.error)}),n.promise},c=function(r){return function(){var n,i;return n=t.defer(),g()?(n.resolve(r.user),n.promise):r.deferreds.me?r.deferreds.me.promise:(r.deferreds.me=n,i=e.one("users"),i.id="me",i.get().then(function(e){return r.unauthorized=!1,r.user=e.data,o.activeUser=r.user,r.deferreds.me.resolve(e.data),delete r.deferreds.me},function(e){return r.deferreds.me.reject(),delete r.deferreds.me}),r.deferreds.me.promise)}}(this),f=function(r){return function(){var n;return n=t.defer(),e.one("events").one("new").get().then(function(e){return e.data>0&&(o.$broadcast("event:newEvents"),r.newEvents=e.data),n.resolve(e.data)},function(e){return n.reject(e)}),n.promise}}(this),m=function(r){return function(){var n;return n=t.defer(),e.one("events").get().then(function(e){return r.events=e.data,n.resolve(e.data)},function(e){return n.reject(e)}),n.promise}}(this),h=function(){var e;return e=t.defer(),o.activeUser?e.resolve(o.activeUser.role):e.reject(),e.promise},w=function(e){var r;return r=t.defer(),i.upload({url:"/api/v1/users/",data:{data:e},arrayKey:"[]",method:"PUT"}).then(function(e){return r.resolve(e.data.data)},function(e){return r.reject(e)}),r.promise},_=function(r){var n,o;return o=e.one("users").one("reset"),n=t.defer(),o.email=r,o.post().then(function(e){return n.resolve(e.data)},function(e){return n.reject(e)}),n.promise},y=function(r){return function(){var n;return n=t.defer(),e.one("users").one("logout").remove().then(function(e){return s.deleteToken(),r.user=null,o.activeUser=null,r.unauthorized=!0,o.$broadcast("user:stateChanged"),n.resolve(e)},function(e){return n.reject(e)}),n.promise}}(this),j=function(e){return function(){return e.user=null,o.activeUser=null,e.unauthorized=!0,o.$broadcast("user:stateChanged")}}(this),l=function(r){return function(n){var o,i;return o=t.defer(),i=e.one("users"),i.id=n.id,i.current_password=n.current_password,i.remove().then(function(e){return o.resolve()},function(e){return r.unauthorized=!0,o.reject(e)}),o.promise}}(this),g=function(e){return function(){return!e.unauthorized&&null!=e.user}}(this),{getAll:d,getUser:p,currentUser:c,updateUser:w,resetPassword:_,checkUsername:u,getEvents:m,getNewEvents:f,login:v,logout:y,logoutLocal:j,deleteUser:l,createUser:a,isAuthenticated:g,getRole:h,writeMessage:$}}]),angular.module("gruenderviertel").controller("HomeCtrl",["$rootScope","TokenContainer","User","Project","Community","most_used","featured","$state",function(e,t,r,n,o,i,s,u){return this.featured=null,this.most_used=null,this.form={},this.isAuthenticated=r.isAuthenticated(),e.$on("user:stateChanged",function(e){return function(t,n,o){e.isAuthenticated=r.isAuthenticated()}}(this)),this.setLoggedIn=function(e){return function(t){e.isAuthenticated=!!t}}(this),this.init=function(e){return function(){return o.preloadTags(),e.featured=angular.copy(s),e.most_used=angular.copy(i),null}}(this),this.register=function(e){return function(){return u.go("root.register",{user:e.form})}}(this),this.init()}]),angular.module("gruenderviertel").controller("NavCtrl",["User","Event","$rootScope","$scope","$state","TokenContainer",function(e,t,r,n,o,i){return this.user=r.activeUser,this.isAuthenticated=!1,this.form={},this.admin=!1,this.username="default",this.decodedEvents=[],this.wrongPassword=!1,this.noAccount=!1,r.$on("user:stateChanged",function(e){return function(t,r,n){return e.setLoggedIn(i.get()),e.setUsername(),e.isAdmin()}}(this)),this.getNewEvents=function(t){return function(){e.getNewEvents().then(function(e){return t.newEvents=e},function(e){})}}(this),this.login=function(t){return function(){return t.wrongPassword=!1,t.noAccount=!1,e.login(t.form).then(function(e){return $("#login_modal").modal("toggle"),r.$broadcast("user:stateChanged")},function(e){"wrong_password"===e.data.error.name?t.wrongPassword=!0:"username_not_found"===e.data.error.name&&(t.noAccount=!0)})}}(this),this.logout=function(){return e.logout().then(function(){return o.go("root.home")})},this.setUsername=function(t){return function(){if(t.isAuthenticated)return e.currentUser().then(function(e){return t.username=angular.copy(e.username)},function(e){this.username="Angemeldet"})}}(this),this.setLoggedIn=function(e){return function(t){e.isAuthenticated=!!t}}(this),this.isAdmin=function(t){return function(){return e.user&&"admin"===e.user.role?t.admin=!0:t.admin=!1}}(this),this.decodeEvents=function(e){var t,r,n,o,i,s,u,a,c,l,d,m,f;for(r=[],o=0,u=(d=e.events).length;o<u;o++){if("Comment"===(n=d[o]).trigger_type)if("Project"===n.target_type){for(n.message="Neuer Kommentar für Projekt",i=0,a=(m=e.projects).length;i<a;i++)if((l=m[i]).id===n.target_id){n.message+=": "+l.name;break}}else if("Post"===n.target_type){for(n.message="Neuer Kommentar für Diskussion",s=0,c=(f=e.posts).length;s<c;s++)if((t=f[s]).id===n.target_id){n.community_id=t.community_id,n.message+=": "+t.title;break}}else n.message="Neues Ereignis.";else n.message="Neues Ereignis.";r.push(n)}return r},this.visit_event=function(e){return"Project"===e.target_type?o.go("root.project",{id:e.target_id}):o.go("root.community",{id:e.community_id})},this.init=function(){return this.setLoggedIn(i.get()),this.setUsername(),this.isAdmin(),this.isAuthenticated&&(this.decodedEvents=this.decodeEvents(this.user)),$(".nav a").on("click",function(){return $(".nav-collapse").collapse("hide")})},this.init(),this}]),angular.module("gruenderviertel").controller("CommunityCtrl",["instance","Community","$anchorScroll",function(e,t,r){return this.community=e,this.icon=e.icon,this.projects=e.projects,this.members=e.users,this.discussions=e.discussions,this.member_count=e.member_count,this.project_count=e.project_count,this.subscribed=e.subscribed,this.discussion_form={},this.comment_form={},this.comment_form.content=[],this.init=function(e){return function(){var t,r,n,o,i,s;for(s=[],n=0,o=(i=e.discussions).length;n<o;n++)(r=i[n]).created=new Date(Date.parse(r.created_at)).toLocaleString("de-DE"),r.updated=new Date(Date.parse(r.updated_at)).toLocaleString("de-DE"),s.push(function(){var e,n,o,i;for(i=[],e=0,n=(o=r.comments).length;e<n;e++)(t=o[e]).created=new Date(Date.parse(t.created_at)).toLocaleString("de-DE"),i.push(t.updated=new Date(Date.parse(t.updated_at)).toLocaleString("de-DE"));return i}());return s}}(this),this.subscribe=function(e){return function(){return t.join_community(e.community.id).then(function(t){return e.member_count++,e.subscribed=t},function(e){})}}(this),this.unsubscribe=function(e){return function(){return t.leave_community(e.community.id).then(function(t){return e.member_count--,e.subscribed=t},function(e){})}}(this),this.startDiscussion=function(e){return function(){var r;return r={title:e.discussion_form.title,content:e.discussion_form.content},t.post_discussion(e.community.id,r).then(function(t){return e.discussion_form={},t.comments=[],t.created=new Date(Date.parse(t.created_at)).toLocaleString("de-DE"),t.updated=new Date(Date.parse(t.updated_at)).toLocaleString("de-DE"),e.discussions.push(t)},function(e){})}}(this),this.comment=function(e){return function(r,n){var o;return o={content:e.comment_form.content[n]},t.post_comment(r,o).then(function(t){var n,o,i,s,u;for(u=[],o=0,i=(s=e.discussions).length;o<i;o++)(n=s[o]).id===r?(t.created=new Date(Date.parse(t.created_at)).toLocaleString("de-DE"),t.updated=new Date(Date.parse(t.updated_at)).toLocaleString("de-DE"),u.push(n.comments.push(t))):u.push(void 0);return u},function(e){})}}(this),this.showEdit=function(e,t){return $("#c-body-"+e+"-"+t).addClass("ng-hide"),$("#c-edit-"+e+"-"+t).removeClass("ng-hide")},this.abortEdit=function(e,t){return $("#c-body-"+e+"-"+t).removeClass("ng-hide"),$("#c-edit-"+e+"-"+t).addClass("ng-hide")},this.editComment=function(e){return function(r,n){var o;return o=$("#c-edit-body-"+r+"-"+n).val(),t.editComment(n,o).then(function(t){var o,i,s,u,a,c,l;for(t.updated=new Date(Date.parse(t.updated_at)).toLocaleString("de-DE"),i=0,u=(c=e.discussions).length;i<u;i++)for(s=0,a=(l=c[i].comments).length;s<a;s++)(o=l[s]).id===n&&(o.content=angular.copy(t.content),o.updated=angular.copy(t.updated));return $("#c-body-"+r+"-"+n).removeClass("ng-hide"),$("#c-edit-"+r+"-"+n).addClass("ng-hide")},function(e){})}}(this),this.showDEdit=function(e,t){return $("#d-body-"+e+"-"+t).addClass("ng-hide"),$("#d-edit-"+e+"-"+t).removeClass("ng-hide")},this.abortDEdit=function(e,t){return $("#d-body-"+e+"-"+t).removeClass("ng-hide"),$("#d-edit-"+e+"-"+t).addClass("ng-hide")},this.editDiscussion=function(e){return function(r,n){var o;return o=$("#d-edit-body-"+r+"-"+n).val(),t.editDiscussion(n,o).then(function(t){var o,i,s,u;for(t.updated=new Date(Date.parse(t.updated_at)).toLocaleString("de-DE"),i=0,s=(u=e.discussions).length;i<s;i++)(o=u[i]).id===n&&(o.content=angular.copy(t.content),o.updated=angular.copy(t.updated));return $("#d-body-"+r+"-"+n).removeClass("ng-hide"),$("#d-edit-"+r+"-"+n).addClass("ng-hide")},function(e){})}}(this),this.init(),this}]),angular.module("gruenderviertel").controller("CommunityOverviewCtrl",["Community","list",function(e,t){return this.list=t,this}]),angular.module("gruenderviertel").controller("CreateProjectCtrl",["Project","Community","$state",function(e,t,r){return this.step=1,this.pitch_characters=200,this.form={},this.form.project={},this.form.project.coop=!1,this.tag_list,t.get_all().then(function(e){return function(t){return e.tag_list=angular.copy(t)}}(this)),this.problemPlaceholder="Beschreibe kurz: Welches Problem hast du gelöst oder möchtest du lösen?",this.resetFile=function(){var e;return this.form.project.image=void 0,(e=$("newProject_cover_image")).wrap("<form>").closest("form").get(0).reset(),e.unwrap(),e.stopPropagation(),e.preventDefault()},this.selectTag=function(e){return function(t){var r,n;return n=e.tag_list.indexOf(t),(r=e.tag_list[n]).selected?r.selected=!1:r.selected=!0}}(this),this.goBack=function(e){return function(){return e.step<=0?r.go("root.home"):e.step--}}(this),this.proceed=function(e){return function(){if(e.step<5)return e.step++}}(this),this.createProject=function(){var t,n,o,i;for(this.form.project.tags=[],n=0,o=(i=this.tag_list).length;n<o;n++)(t=i[n]).selected&&this.form.project.tags.push(t.id);return this.form.project.status="Published",e.createProject(this.form.project).then(function(e){return r.transitionTo("root.project",{id:e.id},{reload:!0})})},this.charLimit=function(e){return function(){return e.form.project.goal?e.pitch_characters=200-e.form.project.goal.length:e.pitch_characters=200}}(this),this.changeTypus=function(e){return function(t){return e.problemPlaceholder="Open Innovation"===t?"Die Problematik bei Open Innovation-Projekten kann im nächsten Abschnitt mit mehr Details beschrieben werden.":"Beschreibe kurz: Welches Problem hast du gelöst oder möchtest du lösen?",e.form.project.typus=t}}(this),this}]),angular.module("gruenderviertel").controller("EditProjectCtrl",["Project","$scope","$state","$stateParams","instance",function(e,t,r,n,o){return this.form=angular.copy(o),delete this.form.comments,delete this.form.likes,delete this.form.attachment,this.pitch_characters=200,this.charLimit=function(e){return function(){return e.form.goal?e.pitch_characters=200-e.form.goal.length:e.pitch_characters=200}}(this),this.editProject=function(t){return function(){return e.editProject(t.form).then(function(e){return r.go("root.project",'{"id": $stateParams.id}',{reload:!0})},function(e){})}}(this),this.init=function(e){return function(){return e.charLimit()}}(this),this.init(),this}]),angular.module("gruenderviertel").controller("ProjectCtrl",["User","instance","Project","$state","$window","$anchorScroll","$location",function(e,t,r,n,o,i,s){return this.project=t,this.comment="",this.moreProjects=[],this.user=e,this.likes=this.project.likes,this.liked=!1,this.init=function(e){return function(){var t,r,n,o;for(r=0,n=(o=e.project.comments).length;r<n;r++)(t=o[r]).created=new Date(Date.parse(t.created_at)).toLocaleString("de-DE"),t.updated=new Date(Date.parse(t.updated_at)).toLocaleString("de-DE");return e.getOtherProjects()}}(this),this.viewCommunity=function(e){var t;return t=n.href("root.community",{id:e}),o.open(t,"_blank")},this.addComment=function(e){return function(){return r.postComment(e.project,e.comment).then(function(t){return e.comment="",t.created=new Date(Date.parse(t.created_at)).toLocaleString("de-DE"),t.updated=new Date(Date.parse(t.updated_at)).toLocaleString("de-DE"),e.project.comments.push(t)})}}(this),this.like=function(e){return function(){return r.like(e.project.id).then(function(t){return t?(e.project.liked=!0,e.likes++):(e.project.liked=!1,e.likes--)},function(e){})}}(this),this.getFileName=function(e){return function(){var t;return e.project.attachment.url?(t=e.project.attachment.url.split("/"))[t.length-1]:""}}(this),this.getOtherProjects=function(e){return function(){return r.getMore(e.project.id).then(function(t){return e.moreProjects=t},function(t){e.moreProjects=[]})}}(this),this.showEdit=function(e,t){return $("#c-body-"+e+"-"+t).addClass("ng-hide"),$("#c-edit-"+e+"-"+t).removeClass("ng-hide")},this.abortEdit=function(e,t){return $("#c-body-"+e+"-"+t).removeClass("ng-hide"),$("#c-edit-"+e+"-"+t).addClass("ng-hide")},this.editComment=function(e){return function(t,n){var o;return o=$("#c-edit-body-"+t+"-"+n).val(),r.editComment(n,o).then(function(r){var o,i,s,u;for(i=0,s=(u=e.project.comments).length;i<s;i++)(o=u[i]).id===n&&(o.updated=new Date(Date.parse(r.updated_at)).toLocaleString("de-DE"),o.content=angular.copy(r.content));return $("#c-body-"+t+"-"+n).removeClass("ng-hide"),$("#c-edit-"+t+"-"+n).addClass("ng-hide")},function(e){})}}(this),this.init(),this}]),angular.module("gruenderviertel").controller("ProjectFilterCtrl",["projects","$stateParams",function(e,t){return this.category=t.category,this.projects=e,this}]),angular.module("gruenderviertel").controller("PMWriteCtrl",["$state","User",function(e,t){return this.message=null,this.sent=!1,this.sendMessage=function(e){return function(){return t.sendMessage(e.message).then(function(t){return e.sent=!0},function(e){})}}(this),this}]),angular.module("gruenderviertel").controller("ProfileCtrl",["instance","$state","$rootScope",function(e,t,r){return this.user=e,this.my_projects=angular.copy(this.user.projects),this.my_comments=angular.copy(this.user.comments),this.my_discussions=angular.copy(this.user.posts),this.myPage=!1,this.decodeEvents=function(e){return function(t){var r,n,o,i,s,u,a,c,l,d,m,f;for(n=[],i=0,a=t.length;i<a;i++){if("Comment"===(o=t[i]).trigger_type)if("Project"===o.target_type){for(o.message="Neuer Kommentar für Projekt",s=0,c=(m=e.my_projects).length;s<c;s++)if(d=m[s],d.id=o.target_id){o.message+=": "+d.name;break}}else if("Post"===o.target_type){for(o.message="Neuer Kommentar für Diskussion",u=0,l=(f=e.my_discussions).length;u<l;u++)if((r=f[u]).id===o.target_id){o.community_id=r.community_id,o.message+=": "+r.title;break}}else o.message="Neues Ereignis.";else o.message="Neues Ereignis.";n.push(o)}return n}}(this),this.visit_event=function(e){return"Project"===e.target_type?t.go("root.project",{id:e.target_id}):t.go("root.community",{id:e.community_id})},this.goToComment=function(e){return"Project"===e.parent_type?t.go("root.project",{id:e.parent_id,"#":"c-"+e.author+"-"+e.id}):t.go("root.community",{id:e.grandparent_id,"#":"c-"+e.author+"-"+e.id})},this.user.id===r.activeUser.id&&(this.user.events&&(this.my_events=this.decodeEvents(this.user.events)),this.myPage=!0),this}]),angular.module("gruenderviertel").controller("ProfileEditCtrl",["User","TokenContainer","$state","$stateParams","instance","$rootScope",function(e,t,r,n,o,i){return this.state=1,this.form={},this.form.user=o,this.predit_in_progress=!1,this.wrong_password=!1,this.init=function(e){return function(){delete e.form.user.comments,delete e.form.user.projects,delete e.form.user.events,delete e.form.user.posts,delete e.form.user.sent,delete e.form.user.received,delete e.form.user.logo}}(this),this.goBack=function(e){return function(){return e.state<=0?r.go("root.profile"):e.state--}}(this),this.proceed=function(e){return function(){if(e.state<2)return e.state++}}(this),this.saveEdit=function(){return this.wrong_password=!1,this.predit_in_progress=!0,e.updateUser(this.form.user).then(function(t){return function(n){return e.user=angular.copy(n),i.activeUser=angular.copy(n),r.go("root.profile",void 0,{reload:!0}),t.predit_in_progress=!1}}(this),function(e){return function(t){if(e.predit_in_progress=!1,"wrong_password"===t.data.error.name)return e.wrong_password=!0}}(this))},this.deleteAccount=function(){var n;return this.wrong_password=!1,$("#deletion_modal").modal("hide"),n={},n.id=this.form.user.id,n.current_password=this.form.user.current_password,e.deleteUser(n).then(function(n){return t.deleteToken(),e.logoutLocal(),r.go("root.home")},function(e){return function(t){if("wrong_password"===t.data.error.name)return e.wrong_password=!0}}(this))},this.init(),this}]),angular.module("gruenderviertel").controller("RecoveryCtrl",["User",function(e){return this.finished=!1,this.sent=!1,this.email="",this.recoverPassword=function(t){return function(){return t.sent=!0,e.resetPassword(t.email).then(function(e){return t.finished=!0},function(e){return t.sent=!1,console.log})}}(this),this}]),angular.module("gruenderviertel").controller("RegistrationCtrl",["User","TokenContainer","$state","$rootScope","$stateParams","Community",function(e,t,r,n,o,i){return this.state=1,this.user=o.user,this.community_list=[],this.form={},this.form.user={},this.validation={},this.validation.confirmation=!1,this.validation.username_taken=!1,this.reg_in_progress=!1,this.selected=0,this.filter="Branche",this.bio_characters=200,$("#reg_input_password, #reg_input_password_confirmation").on("keyup",function(e){return function(){e.form.user.password===e.form.user.password_confirmation?e.validation.confirmation=!0:e.validation.confirmation=!1}}(this)),$("#reg_input_username").on("focusout",function(t){return function(){return e.checkUsername($("#reg_input_username").val()).then(function(e){return t.validation.username_taken=!!e})}}(this)),this.resetFile=function(){var e;return this.form.user.logo=void 0,(e=$("#reg_input_picture")).wrap("<form>").closest("form").get(0).reset(),e.unwrap(),e.stopPropagation(),e.preventDefault()},this.init=function(e){return function(){null!==e.user&&(e.state++,e.form.user=e.user),i.get_all().then(function(t){return e.community_list=angular.copy(t)})}}(this),this.goBack=function(e){return function(){return e.state<=0?r.go("root.home"):e.state--}}(this),this.proceed=function(e){return function(){if(e.state<5)return e.state++}}(this),this.selectTag=function(e){return function(t){var r,n;return n=e.community_list.indexOf(t),(r=e.community_list[n]).selected?(e.selected--,r.selected=!1):(e.selected++,r.selected=!0)}}(this),this.select=function(e){return function(t){return e.filter=t}}(this),this.filterBy=function(e){return function(t){return t.typus===e.filter}}(this),this.register=function(t){return function(){var o,i,s,u,a;for(t.reg_in_progress=!0,o=[],s=0,u=(a=t.community_list).length;s<u;s++)(i=a[s]).selected&&o.push(i.id);return t.form.user.subscriptions=o,e.createUser(t.form.user).then(function(e){return n.$broadcast("user:stateChanged"),r.go("root.home"),t.reg_in_progress=!1},function(e){t.reg_in_progress=!1})}}(this),this.charLimit=function(e){return function(){return e.form.user.description?e.bio_characters=200-e.form.user.description.length:e.bio_characters=200}}(this),this.init(),this}]),angular.module("gruenderviertel").factory("badrequestHandler",["$injector",function(e){return function(e,t){var r,n,o,i,s,u,a,c;for(r={},n=0,i=(u=e.data.error).length;n<i;n++)for(o=0,s=(a=u[n].messages).length;o<s;o++)r[(c=a[o].split(":"))[0]]=c[1];return t.reject({status:400,errors:r}),t.promise}}]),angular.module("gruenderviertel").factory("conflictHandler",["$injector",function(e){return function(e,t){return t.reject(e),t.promise}}]),angular.module("gruenderviertel").factory("forbiddenHandler",["$injector",function(e){return function(e,t){return t.reject(e),t.promise}}]),angular.module("gruenderviertel").factory("notfoundHandler",["$injector",function(e){return function(e,t){return t.reject(e),t.promise}}]),angular.module("gruenderviertel").factory("unauthorizedHandler",["$injector",function(e){return function(t,r){var n,o;return n=e.get("TokenContainer"),o=e.get("$state"),"invalid_token"===t.data.error.error.name&&(n.deleteToken(),o.go("root.home")),r.reject(t),r.promise}}]),angular.module("gruenderviertel").factory("responseInterceptor",["$q","$injector",function(e,t){return{responseError:function(r){var n;switch(n=e.defer(),r.status){case 400:return t.get("badrequestHandler")(r,n);case 401:return t.get("unauthorizedHandler")(r,n);case 403:return t.get("forbiddenHandler")(r,n);case 404:return t.get("notfoundHandler")(r,n);case 409:return t.get("conflictHandler")(r,n);default:return n.reject(r),n.promise}return r}}}]),angular.module("gruenderviertel").factory("tokenInterceptor",["TokenContainer","Rails",function(e,t){return{request:function(t){var r;return 0!==t.url.indexOf("/api/v1/")&&0!==t.url.indexOf("/oauth/")||(r=e.get())&&(t.headers.Authorization="Bearer "+r),t}}}]);