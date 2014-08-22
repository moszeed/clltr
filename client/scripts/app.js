(function() {

    "use strict";

    if (User.isLoggedIn()) {
        Router.changePage('libary');
    }

})();