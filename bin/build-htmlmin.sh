#! bin/bash
PARAMS="--collapse-whitespace --remove-comments"

echo "----> htmlmin";

echo "----"
# main
html-minifier ./client/templates/index.tpl ${PARAMS} -o ./dist/index.html

echo "---"
# pages
html-minifier ./client/templates/pages/whatis.tpl ${PARAMS} -o ./dist/templates/pages/whatis.html
html-minifier ./client/templates/pages/libary.tpl ${PARAMS} -o ./dist/templates/pages/libary.html

echo "--"
# snippets
html-minifier ./client/templates/pages/libary/libary.list.tpl ${PARAMS} -o ./dist/templates/pages/libary/libary.list.html
html-minifier ./client/templates/pages/libary/libary.audioItem.tpl ${PARAMS} -o ./dist/templates/pages/libary/libary.audioItem.html
html-minifier ./client/templates/pages/libary/libary.imageItem.tpl ${PARAMS} -o ./dist/templates/pages/libary/libary.imageItem.html
html-minifier ./client/templates/pages/libary/libary.linkItem.tpl ${PARAMS} -o ./dist/templates/pages/libary/libary.linkItem.html
html-minifier ./client/templates/pages/libary/libary.videoItem.tpl ${PARAMS} -o ./dist/templates/pages/libary/libary.videoItem.html

echo "-"
#widgets
html-minifier ./client/templates/widgets/editlists.widget.tpl ${PARAMS} -o ./dist/templates/widgets/editlists.widget.html
html-minifier ./client/templates/widgets/edititem.widget.tpl ${PARAMS} -o ./dist/templates/widgets/edititem.widget.html
html-minifier ./client/templates/widgets/deleteitem.widget.tpl ${PARAMS} -o ./dist/templates/widgets/deleteitem.widget.html

echo "*"
