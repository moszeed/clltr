module.exports = {
  jquery: {exports: "jQuery"},
  underscore: {exports: "_"},
  dropbox : {exports: "Dropbox"},
  backbone: {
    exports: "Backbone",
    depends: {underscore: "underscore", jquery: "jQuery"}
  }
};