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

        './dist/templates/widgets/libary.edit.html'             : './client/templates/widgets/libary.edit.tpl',
        './dist/templates/widgets/libary.tag.html'              : './client/templates/widgets/libary.tag.tpl',
        './dist/templates/widgets/libary.delete.html'           : './client/templates/widgets/libary.delete.tpl',

        './dist/templates/pages/snippets/libary.listItemLink.html'  : './client/templates/pages/snippets/libary.listItemLink.tpl',
        './dist/templates/pages/snippets/libary.listItemImage.html' : './client/templates/pages/snippets/libary.listItemImage.tpl',
        './dist/templates/pages/snippets/libary.listItemVideo.html' : './client/templates/pages/snippets/libary.listItemVideo.tpl',
        './dist/templates/pages/snippets/libary.tagItem.html'       : './client/templates/pages/snippets/libary.tagItem.tpl'
    }
}
}
