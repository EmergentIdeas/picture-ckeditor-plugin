CKEDITOR.dialog.add('flex-picture', function (editor) {
	let treeBrowserAvailable = false	
	if(window['@webhandle/tree-file-browser'] 
	&& window['@webhandle/tree-file-browser'].FileSelectDialog 
	&& window['@webhandle/tree-file-browser'].loadStyles
	&& window.webhandle 
	&& window.webhandle.sinks
	&& window.webhandle.sinks.public
	) {
		treeBrowserAvailable = true
	}
	let browseButton =  {
		type: 'button',
		id: 'browse',
		label: editor.lang.common.browseServer,
		hidden: false,
		setup: function (widget) {
		},
		commit: function (widget) {
		}
	}
	
	if(treeBrowserAvailable) {
		browseButton.onClick = async function(one, two, three, four) {
			document.querySelector('.cke_dialog_background_cover').style['z-index'] = 9997
			document.querySelector('.cke_dialog_container').style['z-index'] = 9998
			window['@webhandle/tree-file-browser'].loadStyles()
			prefix = 'img'
			let FileSelectDialog = window['@webhandle/tree-file-browser'].FileSelectDialog
			let diag = new FileSelectDialog({
				sink: webhandle.sinks.public
				, startingDirectory: prefix
				, imagesOnly: true
			})
			let result = await diag.open()

			if(result && result.url) {
				let path = result.url
				one.data.dialog.getModel().setData('picsource', path);
				one.data.dialog.getContentElement('info', 'picsource').setValue(path)
			}
		}
	}
	else {
		browseButton.filebrowser = 'info:picsource'
	}
	
	return {
		title: 'Edit Picture',
		minWidth: 700,
		minHeight: 100,
		contents: [
			{
				id: 'info',
				label: 'Basics',
				elements: [
					{
						id: 'alttext',
						type: 'text',
						label: 'Descriptive Text',
						setup: function (widget) {
							this.setValue(widget.data.alttext);
						},
						commit: function (widget) {
							widget.setData('alttext', this.getValue());
						}
					},
					{
						id: 'link',
						type: 'text',
						label: 'Link',
						setup: function (widget) {
							this.setValue(widget.data.link);
						},
						commit: function (widget) {
							widget.setData('link', this.getValue());
						}
					},
					{
						id: 'linktarget',
						type: 'checkbox',
						label: 'Open in new window',
						setup: function (widget) {
							this.setValue(widget.data.linktarget);
						},
						commit: function (widget) {
							widget.setData('linktarget', this.getValue());
						}
					},
					{
						id: 'picsource',
						type: 'text',
						label: 'Picture source',
						setup: function (widget) {
							this.setValue( widget.data.picsource );
						},
						commit: function (widget) {
							widget.setData( 'picsource', this.getValue() );
						}
					}
					, browseButton
				]
			}
			, {
				id: 'layouttab',
				label: 'Layout',
				elements: [
					{
						id: 'layout',
						type: 'select',
						label: 'Layout',
						items: [
							['Inline Block', 'flex-picture-show-inline-block'],
							['Block', 'flex-picture-show-block'],
							['Float on right', 'flex-picture-float-on-right'],
							['Float on left', 'flex-picture-float-on-left']
						],
						setup: function (widget) {
							this.setValue(widget.data.layout);
						},
						commit: function (widget) {
							widget.setData('layout', this.getValue());
						}
					}
					, {
						id: 'bordercss',
						type: 'text',
						label: 'Border css',
						width: '400px',
						setup: function (widget) {
							this.setValue(widget.data.bordercss);
						},
						commit: function (widget) {
							widget.setData('bordercss', this.getValue());
						}
					}
					, {
						id: 'additionalclasses',
						type: 'text',
						label: 'Additional classes',
						width: '400px',
						setup: function (widget) {
							this.setValue(widget.data.additionalclasses);
						},
						commit: function (widget) {
							widget.setData('additionalclasses', this.getValue());
						}
					}
					, {
						id: 'additionalstyles',
						type: 'text',
						label: 'Additional styles',
						width: 'auto',
						setup: function (widget) {
							this.setValue(widget.data.additionalstyles);
						},
						commit: function (widget) {
							widget.setData('additionalstyles', this.getValue());
						}
					}
					, {
						//['baseline', 'sub', 'super', 'text-top', 'text-bottom', 'middle', 'top', 'bottom']
						id: 'verticalalign',
						type: 'select',
						label: 'Vertical alignment',
						items: [
							['auto', ''],
							['baseline', 'baseline'],
							['sub', 'sub'],
							['super', 'super'],
							['text-top', 'text-top'],
							['text-bottom', 'text-bottom'],
							['middle', 'middle'],
							['top', 'top'],
							['bottom', 'bottom']
						],
						setup: function (widget) {
							this.setValue(widget.data.verticalalign);
						},
						commit: function (widget) {
							widget.setData('verticalalign', this.getValue());
						}
					}
					, {
						id: 'usecaption',
						type: 'checkbox',
						label: 'Use caption',
						setup: function (widget) {
							this.setValue(widget.data.usecaption == 'true' || widget.data.usecaption == true ? true : false);
						},
						commit: function (widget) {
							widget.setData('usecaption', this.getValue());
						}
					}
				]
			}
			, {
				id: "sizing",
				label: 'Sizing', 
				elements: [
					{
						id: 'targetwidth',
						type: 'text',
						label: 'Target width (e.g. 200px, 30%)',
						width: '50px',
						setup: function (widget) {
							this.setValue(widget.data.targetwidth);
						},
						commit: function (widget) {
							widget.setData('targetwidth', this.getValue());
						}
					}
					, {
						id: 'targetheight',
						type: 'text',
						label: 'Target height',
						width: '50px',
						setup: function (widget) {
							this.setValue(widget.data.targetheight);
						},
						commit: function (widget) {
							widget.setData('targetheight', this.getValue());
						}
					}
					, {
						id: 'aspectratio',
						type: 'text',
						label: 'Aspect ratio (width / height)',
						width: '50px',
						setup: function (widget) {
							this.setValue(widget.data.aspectratio);
						},
						commit: function (widget) {
							widget.setData('aspectratio', this.getValue());
						}
					}
					, {
						id: 'scaling',
						type: 'select',
						label: 'Image scaling',
						items: [
							['Auto', ''],
							['Cover', 'flex-picture-scaling-cover'],
							['Contain', 'flex-picture-scaling-contain']
						],
						setup: function (widget) {
							this.setValue(widget.data.scaling);
						},
						commit: function (widget) {
							widget.setData('scaling', this.getValue());
						}
					},
					{
						id: 'align',
						type: 'select',
						label: 'Image Position',
						items: [
							
							['left top', 'left top'],
							['left center', 'left center'],
							['left bottom', 'left bottom'],
							['right top', 'right top'],
							['right center', 'right center'],
							['right bottom', 'right bottom'],
							['center top', 'center top'],
							['center center', 'center center'],
							['center bottom', 'center bottom']
						],
						setup: function (widget) {
							this.setValue(widget.data.align);
						},
						commit: function (widget) {
							widget.setData('align', this.getValue());
						}
					}
				]
			}
			, {
				id: "widgetspacing",
				label: 'Spacing', 
				elements: [
					{
						id: 'margintop',
						type: 'text',
						label: 'Top Margin',
						width: '50px',
						setup: function (widget) {
							this.setValue(widget.data.margintop);
						},
						commit: function (widget) {
							widget.setData('margintop', this.getValue());
						}
					}
					, {
						id: 'paddingtop',
						type: 'text',
						label: 'Top Padding',
						width: '50px',
						setup: function (widget) {
							this.setValue(widget.data.paddingtop);
						},
						commit: function (widget) {
							widget.setData('paddingtop', this.getValue());
						}
					}
					, {
						id: 'marginright',
						type: 'text',
						label: 'Right Margin',
						width: '50px',
						setup: function (widget) {
							this.setValue(widget.data.marginright);
						},
						commit: function (widget) {
							widget.setData('marginright', this.getValue());
						}
					}
					, {
						id: 'paddingright',
						type: 'text',
						label: 'Right Padding',
						width: '50px',
						setup: function (widget) {
							this.setValue(widget.data.paddingright);
						},
						commit: function (widget) {
							widget.setData('paddingright', this.getValue());
						}
					}
					, {
						id: 'paddingbottom',
						type: 'text',
						label: 'Bottom Padding',
						width: '50px',
						setup: function (widget) {
							this.setValue(widget.data.paddingbottom);
						},
						commit: function (widget) {
							widget.setData('paddingbottom', this.getValue());
						}
					}
					, {
						id: 'marginbottom',
						type: 'text',
						label: 'Bottom Margin',
						width: '50px',
						setup: function (widget) {
							this.setValue(widget.data.marginbottom);
						},
						commit: function (widget) {
							widget.setData('marginbottom', this.getValue());
						}
					}
					, {
						id: 'marginleft',
						type: 'text',
						label: 'Left Margin',
						width: '50px',
						setup: function (widget) {
							this.setValue(widget.data.marginleft);
						},
						commit: function (widget) {
							widget.setData('marginleft', this.getValue());
						}
					}
					, {
						id: 'paddingleft',
						type: 'text',
						label: 'Left Padding',
						width: '50px',
						setup: function (widget) {
							this.setValue(widget.data.paddingleft);
						},
						commit: function (widget) {
							widget.setData('paddingleft', this.getValue());
						}
					}

				]
			}
			,
			{
				id: "Upload", hidden: !0, 
				filebrowser: "uploadButton", 
				label: 'Upload', 
				elements: [
					{ 
						type: "file", 
						id: "upload", 
						label: 'File upload', 
						style: "height:40px", 
						size: 38 
					}
					, {
						type: "fileButton", 
						id: "uploadButton", 
						filebrowser: "info:picsource", 
						label: "Send it",
						"for": ["Upload", "upload"]
					}
				]
			},
		]
	};
});