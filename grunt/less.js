module.exports = {
    "app" : {

        options : {
            paths       : ["client/style"],
            compress    : true,
            cleancss    : true
        },

        files : {
            "dist/style/app.css": "client/style/app.less"
        }
    }
};
