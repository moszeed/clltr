module.exports = {

    templates: {

    options: {
        removeComments      : true,
        collapseWhitespace  : true
    },

    files: {
        './dist/index.html'                                     : './client/templates/index.tpl',

        './dist/templates/pages/whatis.html'                    : './client/templates/pages/whatis.tpl',
        './dist/templates/pages/impressum.html'                 : './client/templates/pages/impressum.tpl',
        './dist/templates/pages/libary.html'                    : './client/templates/pages/libary.tpl',

        './dist/templates/snippets/lists.snippet.html'          : './client/templates/snippets/lists.snippet.tpl',
        './dist/templates/snippets/tagging.snippet.html'        : './client/templates/snippets/tagging.snippet.tpl',

        './dist/templates/widgets/libary.edit.html'             : './client/templates/widgets/libary.edit.tpl',
        './dist/templates/widgets/libary.tag.html'              : './client/templates/widgets/libary.tag.tpl',
        './dist/templates/widgets/libary.add.html'              : './client/templates/widgets/libary.add.tpl',
        './dist/templates/widgets/libary.delete.html'           : './client/templates/widgets/libary.delete.tpl',
        './dist/templates/widgets/libary.edit.list.html'        : './client/templates/widgets/libary.edit.list.tpl',

        './dist/templates/pages/snippets/libary.list.html'      : './client/templates/pages/snippets/libary.list.tpl',
        './dist/templates/pages/snippets/libary.linkItem.html'  : './client/templates/pages/snippets/libary.linkItem.tpl',
        './dist/templates/pages/snippets/libary.imageItem.html' : './client/templates/pages/snippets/libary.imageItem.tpl',
        './dist/templates/pages/snippets/libary.videoItem.html' : './client/templates/pages/snippets/libary.videoItem.tpl',
        './dist/templates/pages/snippets/libary.audioItem.html' : './client/templates/pages/snippets/libary.audioItem.tpl',
        './dist/templates/pages/snippets/libary.tagItem.html'   : './client/templates/pages/snippets/libary.tagItem.tpl'
    }
}
};
