#! bin/bash
browserify -r underscore \
           -r backbone \
           -r jquery \
           -r xhr \
           -r drbx-js-backbone \
           -r ./client/scripts/libs/backbone.template.js:backbone-template \
           -r ./client/scripts/libs/helper.js:helper \
           -o ./dist/scripts/libary.js

uglifyjs ./dist/scripts/libary.js -c -v -o ./dist/scripts/libary.min.js
