(function() {

    "use strict";

    var restify = require('restify');
    var request = require('request');

    /**
            $.ajax({
                method      : "GET",
                url         : "https://api.delicious.com/v1/posts/all",
                headers     : {
                    "Authorization" : "Basic 6586589-5013031ed0f43d524e050337535d581a"
                },
                success     : function(data) {
                    console.log(data);
                }
            });
    **/


    var client_id       = '03aeb717939582c43f3485cb12889e97';
    var client_secret   = '692d0f8aea0b6614bc79918630098344';
    var code            = '6586589-5013031ed0f43d524e050337535d581a';

    var options = {
            url : "https://api.del.icio.us/v1/posts/all?hashes",
            headers : {
                "Authorization" : "Basic " + code
            }
        };

        request(options, function (error, response, body) {

                console.log(error);
                console.log(response);
                console.log(body);
            });




})();
