(function() {

    "use strict";

    var Helper = module.exports;

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


})();
