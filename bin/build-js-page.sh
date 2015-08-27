#! bin/bash

EXTERNALS="-x backbone -x backbone-template -x drbx-js-backbone -x underscore -x jquery -x xhr -x helper"

browserify ./client/scripts/pages/whatis.page.js ${EXTERNALS} --standalone whatis -o ./dist/scripts/whatis.page.js
browserify ./client/scripts/pages/libary.page.js ${EXTERNALS} --standalone libary -o ./dist/scripts/libary.page.js

uglifyjs ./dist/scripts/whatis.page.js -c -v -o ./dist/scripts/whatis.page.min.js
uglifyjs ./dist/scripts/libary.page.js -c -v -o ./dist/scripts/libary.page.min.js
