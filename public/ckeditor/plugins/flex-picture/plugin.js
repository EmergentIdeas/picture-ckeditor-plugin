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
function unescapeAttributeValue(s, preserveCR) {
	preserveCR = preserveCR ? '&#13;' : '\n';
	return ('' + s) /* Forces the conversion to string. */
		.split('&apos;').join("'")
		.split('&quot;').join('"')
		.split('&lt;').join('<')
		.split('&gt;').join('>')
		.split('&#13;').join('\n')
		.split('&amp;').join('&')
}

function setIfExists(widget, attr) {
	var w = widget.element.$.attributes.getNamedItem('data-' + attr)
	if (w) {
		widget.setData(attr, w.value)
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

			template: `<figure class="flex-picture" style="margin: 0; position: relative;">
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
			dataAttributes: ['alttext', 'link', 'linktarget', 'picsource', 'align', 'layout', 'bordercss', 
				// 'verticalalign', 
				'usecaption', 'additionalclasses', 'additionalstyles', 'targetwidth', 'targetheight', 'aspectratio', 'scaling', 'margintop', 'marginright', 
			'marginbottom', 'marginleft', 'paddingtop', 'paddingright', 'paddingbottom', 'paddingleft',
			'maxwidth', 'maxheight', 'justifyimage' ],

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
				flexPicture.style.position = 'relative' 
				flexPicture.removeAttribute('onclick')
				
				if(data.maxwidth) {
					flexPicture.style.maxWidth = data.maxwidth
				}
				else {
					flexPicture.style.maxWidth = '100%'
				}
				if(data.maxheight) {
					flexPicture.style.maxHeight = data.maxheight
				}
				else {
					flexPicture.style.maxHeight = 'none'
				}
				
				
				let linkPart = ''
				let linkEx = ''
				// if we're linking, set up the on click	
				if(data.link) {
					linkEx = `if(!this.closest('.editing-page')) { `
					if(data.linktarget == true || data.linktarget == 'true') {
						linkEx += `window.open('${data.link}') `
					}
					else {
						linkEx += `window.location = '${data.link}' `
					}
					linkEx += '}'
					
					linkPart = ` onclick="${linkEx}" `

					flexPicture.style.cursor = 'pointer'
				}
				
				
				let pic = this.element.find('.pic').getItem(0).$
				if(this.data.picsource) {
					let options = {

					}
					if(data.targetwidth && data.targetwidth.trim().endsWith('px')) {
						options.displayWidth = data.targetwidth
					}
					pic.innerHTML = makeMarkup(this.data.picsource, options)
				}
				else {
					pic.innerHTML = ''
				}

				let picture = flexPicture.querySelector('picture')	
				let img = flexPicture.querySelector('img')	
				let caption = flexPicture.querySelector('figcaption')	
				
				if(linkEx) {
					picture.setAttribute('onclick', linkEx)
				}
				
				
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
				else {
					flexPicture.style.border = ''

				}


				if(this.data.additionalclasses) {
					this.element.$.className = this.element.$.className + ' ' + data.additionalclasses
				}
				else {
					this.element.$.className = this.element.$.className 
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
					flexPicture.style.aspectRatio = data.aspectratio
					if(img) {
						img.style.position = 'absolute'
						img.style.left = 0
						img.style.right = 0
						img.style.height = "100%"
					}
				}
				else {
					// clean up properties which are only meaningful in an a context
					// where we have an aspect ratio
					data.align = ''
					data.scaling = ''
					data.aspectratio = ''

					if(img) {
						img.style.position = 'relative'
						img.style.left = 'auto'
						img.style.right = 'auto'
						img.style.height = "auto"
					}

				}

				if(data.justifyimage && (!data.layout || (data.layout && data.layout.indexOf('float') < 0))) {
					if(data.justifyimage.includes('left')) {
						img.style.marginLeft = '0'
						img.style.marginRight = 'auto'
						flexPicture.style.marginLeft = '0'
						flexPicture.style.marginRight = 'auto'
					}
					else if(data.justifyimage.includes('right')) {
						img.style.marginLeft = 'auto'
						img.style.marginRight = '0'
						flexPicture.style.marginLeft = 'auto'
						flexPicture.style.marginRight = '0'
					}
					else if(data.justifyimage.includes('center')) {
						img.style.marginLeft = 'auto'
						img.style.marginRight = 'auto'
						flexPicture.style.marginLeft = 'auto'
						flexPicture.style.marginRight = 'auto'
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


function makeMarkup(url, options) {
	let o = parseWebp2xUrl(url)
	o.params = o.params || {}
	o.params.imgStyle = o.params.imgStyle || ''
	o.params.imgStyle += ' display: block; max-width: 100%; max-height: 100%; height: auto; '
	let html = generatePictureMarkup(o.url, Object.assign(o.params, options))
	return html
}

function parseWebp2xUrl(url) {
	
	let i = url.lastIndexOf('#')
	if(i < 0) {
		return {
			url: url
		}
	}
	
	let result = {
		url: url.substring(0, i)
		, params: {}
	}

	let parts = url.substring(i + 1).split('&')
	for(let part of parts) {
		let sides = part.split('=')
		if(sides[1]) {
			sides[1] = decodeURIComponent(sides[1])
		}
		result.params[sides[0]] = sides[1]
	}

	return result
}

/**
 * Generate markup for a picture with webp double density components and a fallback to another format
 * @param {string} url The URL of the primary fallback image
 * @param {object} options
 * @param {object} options.width The natural width of the single size image
 * @param {object} options.height The natural height of the single size image
 * @param {object} [options.format] Set with webp2x which will generate an picture with webp alternatives. Anything else will cause a simpler picture with single image element
 * @param {object} [options.alt] The alt text (descriptive text) for the image, If blank it will be set from the image name
 * @param {object} [options.displayWidth] The width at which the picture will actually be displayed if known and different from the natural width
 * @param {object} [options.displayHeight] The height at which the picture will actually be displayed if known and different from the natural height
 * @param {object} [options.pictureStyle] Style attribute text for the picture element
 * @param {object} [options.imgStyle] Style attribute text for the image element
 * @param {object} [options.pictureClass] The class attribute value. If blank it will be set from the base name
 * @param {object} [options.cdnPrefix] A prefix for the url
 * @returns 
 */
function generatePictureMarkup(url, {width, height, format, alt, 
	displayWidth, displayHeight, pictureStyle, imgStyle, pictureClass, cdnPrefix = ''} = {}) {
	
	let pictureStyleAttr = ''
	if(pictureStyle) {
		pictureStyleAttr = ` style="${pictureStyle}" `
	}

	let imgStyleAttr = ''
	if(imgStyle) {
		imgStyleAttr = ` style="${imgStyle}" `
	}
	
	let {basename, ext, baseUrl} = urlBasename(url)
	if(!pictureClass) {
		pictureClass = escapeAttributeValue(basename) + '-picture'
	}
	
	if(!alt) {
		alt = basename
	}
	alt = escapeAttributeValue(alt, true)
	
	if(!displayWidth && width) {
		displayWidth = width + 'px'
	}
	if(!displayHeight && height) {
		displayHeight = height + 'px'
	}
	
	
	let picture
	
	if(format === 'webp2x') {
		let full = parseInt(width)
		let double = 2 * full
		let half = Math.ceil(full / 2)
		let quarter = Math.ceil(full / 4)
		
		
		let fallback = 'image/jpeg'
		if(ext.toLowerCase() == 'png') {
			fallback = 'image/png'
		}
		picture = 
`<picture class="${pictureClass}" ${pictureStyleAttr}>
	<source 
		srcset="${cdnPrefix}${baseUrl}-2x.webp ${double}w, ${cdnPrefix}${baseUrl}.webp ${full}w, ${cdnPrefix}${baseUrl}-half.webp ${half}w, ${cdnPrefix}${baseUrl}-quarter.webp ${quarter}w"  
		sizes="min(100vw, ${displayWidth})"
		type="image/webp">
	<source 
		srcset="${cdnPrefix}${baseUrl}-2x.${ext} ${double}w, ${cdnPrefix}${baseUrl}.${ext} ${full}w, ${cdnPrefix}${baseUrl}-half.${ext} ${half}w, ${cdnPrefix}${baseUrl}-quarter.${ext} ${quarter}w"  
		sizes="min(100vw, ${displayWidth})"
		type="${fallback}">
	
	<img src="${cdnPrefix}${baseUrl}.${ext}" alt="${alt}" width="${displayWidth}" height="${displayHeight}" ${imgStyleAttr} >
</picture>
`
	}
	else {
		let widthAttr = ''
		if(displayWidth) {
			widthAttr = `width="${displayWidth}"`
		}
		
		let heightAttr = ''
		if(displayHeight) {
			heightAttr = `height="${displayHeight}"`
		}
picture = `<picture class="${pictureClass}" ${pictureStyleAttr}>
	<img src="${cdnPrefix}${baseUrl}.${ext}" alt="${alt}" ${widthAttr} ${heightAttr} ${imgStyleAttr} >
</picture>
`
	}
	return picture

}

function urlBasename(url) {
	while(url.endsWith('/')) {
		url = url.substring(0, url.length - 1)
	}
	
	let parts = url.split('/')
	let last = parts.pop()
	
	let i = last.lastIndexOf('.')
	let ext
	if(i > -1) {
		ext = last.substring(i + 1)
	}
	
	let result = {
		basename: fileBasename(last)
		, ext: ext
	}
	
	parts.push(result.basename)
	result.baseUrl = parts.join('/')
	
	return result
}

function fileBasename(name) {
	return name.substring(0, name.lastIndexOf('.'))
}