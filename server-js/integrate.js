const path = require('path')
let webhandle = require('webhandle')

let integrated = false

function integrate() {
	if(!integrated) {
		integrated = true
		webhandle.addStaticDir(path.join(webhandle.projectRoot, 'node_modules/@dankolz/picture-ckeditor-plugin/public/ckeditor/plugins'), {urlPrefix: '/ckeditor/plugins'})
	}
}

module.exports = integrate