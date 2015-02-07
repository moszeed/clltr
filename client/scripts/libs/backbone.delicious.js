(function() {

    "use strict";

    var $           = require('jquery');
    var _           = require('underscore');
    var Backbone    = require('Backbone');
        Backbone.$  = $;

    var api_url     = "https://api.delicious.com";
    var auth_url    = "https://delicious.com/auth/authorize";
    var token_url   = "https://avosapi.delicious.com/api/v1/oauth/token";

    var clientId = '03aeb717939582c43f3485cb12889e97';
    var secret   = '692d0f8aea0b6614bc79918630098344';

    var BackboneDelicious = module.exports;


        BackboneDelicious.authClient = function(params) {
            params = params || {};
            window.location = auth_url + '?client_id=' + clientId + '&redirect_uri=' + params.url;
        };

        BackboneDelicious.getToken = function(params) {

            params = params || {};

            var parser = document.createElement('a');
                parser.href = document.URL;

            var search = parser.search.replace("?", "");

            var getParams = {};
            _.each(search.split("&"), function(item) {
                var tmp = item.split("=");
                getParams[tmp[0]] = tmp[1];
            });

            if (!getParams.code) {
                throw new Error('no code in url');
            }

            $.ajax({
                method  : 'POST',
                url     : token_url + '?client_id='     + clientId  +
                                      '&client_secret=' + secret    +
                                      '&grant_type=code&' +
                                      'code=' + getParams.code,
                success : function(data) {
                    if (data.access_token === null) {
                        throw new Error('empty access_token');
                    }
                    console.log(data.access_token);
                    localStorage.setItem('delicious_access_token', data.access_token);
                    BackboneDelicious.getAll();
                    params.success(data);
                }
            });
        };

        BackboneDelicious.getAll    = function() {

            var access_token = localStorage.getItem('delicious_access_token');
            if (access_token === null) {
                throw new Error('no access_token');
            }





        };


    /**
    id : 03aeb717939582c43f3485cb12889e97
    secret : 692d0f8aea0b6614bc79918630098344

    /auth   https://delicious.com/auth/authorize?client_id=f5dad5a834775d3811cdcfd6a37af312&redirect_uri=http://www.example.com/redirect
    /token https://avosapi.delicious.com/api/v1/oauth/token?client_id=f5dad5a834775d3811cdcfd6a37af312&client_secret=7363879fee6c3ab0f93efbd24111ad34&grant_type=code&code=fa746b2eb266cab06f34fb7bc3d51160

    curl "https://delicious.com/<API_URL>" -H "Authorization: Bearer <ACCESS_TOKEN>"
    **/

})();


