#! bin/bash

EXTERNALS="-x backbone -x backbone-template -x drbx-js-backbone -x underscore -x jquery -x nets -x helper"
browserify ./client/app.js ${EXTERNALS} -o ./dist/scripts/app.js
uglifyjs ./dist/scripts/app.js -c -v -o ./dist/scripts/app.min.js
