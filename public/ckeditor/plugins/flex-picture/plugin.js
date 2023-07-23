function escapeAttributeValue(s, preserveCR) {
	preserveCR = preserveCR ? '&#13;' : '\n';
	return ('' + s) /* Forces the conversion to string. */
		.replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
		.replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		/*
		You may add other replacements here for HTML only 
		(but it's not necessary).
		Or for XML, only if the named entities are defined in its DTD.
		*/
		.replace(/\r\n/g, preserveCR) /* Must be before the next replacement. */
		.replace(/[\r\n]/g, preserveCR)
}

function setIfExists(widget, attr) {
	var w = widget.element.$.attributes.getNamedItem('data-' + attr)
	if (w) {
		widget.setData(attr, escapeAttributeValue(w.value))
	}
}
function setIfExistsCheckbox(widget, attr) {
	var w = widget.element.$.attributes.getNamedItem('data-' + attr)
	if (w) {
		widget.setData(attr, w.value == 'false' ? false : true)
	}
}

function addClassIfDataExists(widget, name) {
	if(widget.data[name]) {
		widget.element.$.classList.add(widget.data[name])
	}

}

let places = ['top', 'right', 'bottom', 'left']
let aspects = ['padding', 'margin']

CKEDITOR.plugins.add('flex-picture', {
	requires: 'widget',

	icons: 'flex-picture',

	init: function (editor) {


		CKEDITOR.dialog.add('flex-picture', this.path + 'dialogs/flex-picture.js');

		editor.widgets.add('flex-picture', {

			button: 'Create a picture',

			template: `<figure class="flex-picture" style="margin: 0;">
						<div class="pic">
						</div>
						<figcaption>&nbsp;
						</figcaption>
					</figure>`
			, editables: {
				caption: {
					selector: 'figcaption'
				}
			},

			dialog: 'flex-picture',
			dataAttributes: ['alttext', 'link', 'linktarget', 'picsource', 'align', 'layout', 'bordercss', 'verticalalign', 'usecaption',
			'additionalclasses', 'additionalstyles', 'targetwidth', 'targetheight', 'aspectratio', 'scaling', 'margintop', 'marginright', 
			'marginbottom', 'marginleft', 'paddingtop', 'paddingright', 'paddingbottom', 'paddingleft' ],

			upcast: function (element) {
				return element.name == 'figure' && element.hasClass('flex-picture');
			},

			init: function () {
				for (var i in this.dataAttributes) {
					setIfExists(this, this.dataAttributes[i])
				}
				setIfExistsCheckbox(this, 'usecaption')
				setIfExistsCheckbox(this, 'linktarget')
			},
			data: function () {
				let data = this.data
				let flexPicture = this.element.$

				// let's clear out the old info
				flexPicture.className = 'flex-picture'
				flexPicture.style = `${data.additionalstyles || ''}`
				flexPicture.removeAttribute('onclick')
				
				
				let linkPart = ''
				// if we're linking, set up the on click	
				if(data.link) {
					linkPart = ` onclick="if(!this.closest('.editing-page')) { `
					if(data.linktarget == true || data.linktarget == 'true') {
						linkPart += `window.open('${data.link}') }" `
					}
					else {
						linkPart += `window.location = '${data.link}' `
					}
					linkPart += '}" '
					flexPicture.style.cursor = 'pointer'
				}
				
				
				let pic = this.element.find('.pic').getItem(0).$
				pic.innerHTML = `<picture style="display: block; position: relative;" ${linkPart} >
					<img style="display: block; max-height: 100%; max-width: 100%;" src="${this.data.picsource}" 
					alt="${data.alttext}"
					/>
				</picture>`
				let picture = flexPicture.querySelector('picture')	
				let img = flexPicture.querySelector('img')	
				let caption = flexPicture.querySelector('figcaption')	
				
				
				if(data.targetwidth) {
					flexPicture.style.width = data.targetwidth
				}
				if(data.targetheight) {
					flexPicture.style.height = data.targetheight
				}
				
				if(data.layout == 'flex-picture-show-inline-block') {
					flexPicture.style.display = 'inline-block'
				}
				if(data.layout == 'flex-picture-show-block') {
					flexPicture.style.display = 'block'
				}
				if(data.layout == 'flex-picture-float-on-right') {
					flexPicture.style.float = 'right'
				}
				if(data.layout == 'flex-picture-float-on-left') {
					flexPicture.style.float = 'left'
				}
				
				if(data.bordercss) {
					flexPicture.style.border = data.bordercss
				}


				if(this.data.additionalclasses) {
					this.element.$.className = this.element.$.className + ' ' + data.additionalclasses
				}
				// addClassIfDataExists(this, 'layout')
				
				// set padding and margin
				for(let aspect of aspects) {
					for(let place of places) {
						let value = data[aspect + place]
						if(value) {
							flexPicture.style[`${aspect}-${place}`] = value
						}
					}
				}
				
				
				if(data.aspectratio) {
					picture.style.aspectRatio = data.aspectratio
					img.style.position = 'absolute'
					img.style.left = 0
					img.style.right = 0
				}
				else {
					if(data.align) {
						if(data.align.includes('left')) {
							img.style.marginLeft = '0'
							img.style.marginRight = 'auto'
						}
						else if(data.align.includes('right')) {
							img.style.marginLeft = 'auto'
							img.style.marginRight = '0'
						}
						else if(data.align.includes('center')) {
							img.style.marginLeft = 'auto'
							img.style.marginRight = 'auto'
						}
					}
				}
				if(data.scaling) {
					let value = ''
					if(data.scaling == 'flex-picture-scaling-cover') {
						value = 'cover'
					}
					if(data.scaling == 'flex-picture-scaling-contain') {
						value = 'contain'
					}
					img.style.objectFit = value
				}
				if(data.align) {
					img.style.objectPosition = data.align
				}
				
				if(data.usecaption && data.usecaption != 'false') {
					caption.style.display = 'block'
				}
				else {
					caption.style.display = 'none'
				}
				
				
				// if (!this.data.align) {
				// 	this.element.find('.pic').getItem(0).removeStyle('background-position')
				// }
				// else {
				// 	this.element.find('.pic').getItem(0).setStyle('background-position', this.data.align)
				// }

				// if (this.data.picsource) {
				// 	this.element.find('.pic').getItem(0).setStyle('background-image', 'url("' + this.data.picsource + '")')
				// }

				// if (this.data.link) {
				// 	this.element.find('.link').getItem(0).setAttribute('href', this.data.link)
				// }
				
				// let val = this.data.linkText || '0'
				// let el = this.element.find('.link-text').getItem(0)
				// if(el) {
				// 	el.setText(val)
				// }


				for (var i in this.dataAttributes) {
					this.element.setAttribute('data-' + this.dataAttributes[i], this.data[this.dataAttributes[i]])
				}

			}
		})
	}
});
