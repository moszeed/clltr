(function() {

    "use strict";

    var Helper = module.exports;

        Helper.getCurrentUrl = function() {

            var parser      = document.createElement('a');
                parser.href = document.URL;

            var port = parser.port;
            if (port !== '') {
                port = ":" + port;
            }

            var pathname = parser.pathname;
            if (pathname !== '') {
                pathname = "/" + pathname;
            }

            return  parser.protocol + "//" +
                    parser.hostname + port + parser.pathname;
        };

        Helper.truncate = function(string, length) {

            if (!string) {
                return '';
            }

            if (string.length <= length) {
                return string;
            }

            return string.substring(0, length) + '..';
        };

        Helper.timeConverter = function(timestamp) {

            if (String(timestamp).length === 14) {
                timestamp = timestamp * 1000;
            }

            var a = new Date(timestamp);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();

            var month = months[a.getMonth() - 1];
            var date = ('0' + a.getDate()).slice(-2);
            var hour = ('0' + a.getHours()).slice(-2);
            var min = ('0' + a.getMinutes()).slice(-2);
            var sec = ('0' + a.getSeconds()).slice(-2);

            var time = date + '.' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;

            return time;
        };

        Helper.capitaliseFirstLetter = function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };

        Helper.showError = function(err) {
            console.log('ERR:', err);
            throw new Error(err);
        };

})();
