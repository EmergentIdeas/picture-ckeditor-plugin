CKEDITOR.dialog.add('flex-picture', function (editor) {
	let treeBrowserAvailable = false
	if (window['@webhandle/tree-file-browser']
		&& window['@webhandle/tree-file-browser'].FileSelectDialog
		&& window['@webhandle/tree-file-browser'].loadStyles
		&& window.webhandle
		&& window.webhandle.sinks
		&& window.webhandle.sinks.public
	) {
		treeBrowserAvailable = true
	}
	let browseButton = {
		type: 'button',
		id: 'browse',
		label: editor.lang.common.browseServer,
		hidden: false,
		setup: function (widget) {
		},
		commit: function (widget) {
		}
	}

	if (treeBrowserAvailable) {
		browseButton.onClick = async function (one, two, three, four) {
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

			if (result && result.url) {
				let path = result.url
				one.data.dialog.getModel().setData('picsource', path);
				one.data.dialog.getContentElement('info', 'picsource').setValue(path)
			}
		}
	}
	else {
		browseButton.filebrowser = 'info:picsource'
	}

	let desc = {
		title: 'Edit Picture',
		minWidth: 700,
		minHeight: 100,
		contents: [
			{
				id: 'info',
				label: 'Basics',
				elements: [
					{
						id: 'picsource',
						type: 'text',
						label: 'Picture source',
						setup: function (widget) {
							this.setValue(widget.data.picsource);
						},
						commit: function (widget) {
							widget.setData('picsource', this.getValue());
						}
					}
					, browseButton
					, {
						id: 'alttext',
						type: 'text',
						label: 'Descriptive Text (used for search engines and screen readers for the blind)',
						setup: function (widget) {
							this.setValue(widget.data.alttext);
						},
						commit: function (widget) {
							widget.setData('alttext', this.getValue());
						}
					}
					, {
						id: 'usecaption',
						type: 'checkbox',
						label: 'Show an area where you can caption the picture',
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
				id: 'link',
				label: 'Link',
				elements: [
					{
						id: 'link',
						type: 'text',
						label: 'Link (set this value to make this picture link to another page)',
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
					}
				]
			}
			, {
				id: 'layouttab',
				label: 'Position and Size',
				elements: [
					{
						type: 'html'
						, html: `<p>If the image is NOT wide enough to span the whole screen (for whatever reason), this setting changes its justification.`
					}
					, {
						id: 'justifyimage',
						type: 'select',
						label: 'Justify image',
						width: '200px',
						items: [
							['auto', ''],
							['left', 'left'],
							['center', 'center'],
							['right', 'right']
						],
						setup: function (widget) {
							this.setValue(widget.data.justifyimage);
						},
						commit: function (widget) {
							widget.setData('justifyimage', this.getValue());
						}
					}
					, {
						type: 'html'
						, html: `<p>Max Height and Max Width help you control how big the picture will appear on the screen since most <br>
						image files are oversized and would take up the whole screen. These options won't force the picture to show up larger <br>
						than what its resolution would support. This is probably what you want.</p>`
					}
					, {
						type: 'hbox'
						, children: [
							{
								id: 'maxwidth',
								type: 'text',
								label: 'Max width (e.g. 200px, 30%)',
								width: '100px',
								setup: function (widget) {
									this.setValue(widget.data.maxwidth);
								},
								commit: function (widget) {
									widget.setData('maxwidth', this.getValue());
								}
							}
							, {
								id: 'maxheight',
								type: 'text',
								label: 'Max height',
								width: '100px',
								setup: function (widget) {
									this.setValue(widget.data.maxheight);
								},
								commit: function (widget) {
									widget.setData('maxheight', this.getValue());
								}
							}

						]
					}
					, {
						type: 'html'
						, html: `<p>Target Width and Target Height attempt to force the image to a certain size, even if it doesn't want <br>
						to be. This can be useful when showing the image in the background of a "box", if a low resolution image absolutely <br>
						has to be shown bigger than it is, or for some sorts of speed optimizations.</p>`
					}
					, {
						type: 'hbox'
						, children: [
							{
								id: 'targetwidth',
								type: 'text',
								label: 'Target width (e.g. 200px, 30%)',
								width: '100px',
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
								width: '100px',
								setup: function (widget) {
									this.setValue(widget.data.targetheight);
								},
								commit: function (widget) {
									widget.setData('targetheight', this.getValue());
								}
							}

						]
					}
					, {
						type: 'html'
						, html: '<br><p><strong>Sets a shape NOT based on the shape of the image.</strong></p>'
					}
					, {
						type: 'html'
						, html: "<p>If the aspect ratio is set, you'll be creating a box and setting the picture as the background of that box.</p>"
					}
					, {
						type: 'hbox'
						, children: [
							{
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
				]
			}
			, {
				id: "widgetspacing",
				label: 'Spacing',
				elements: [
					{
						type: 'html'
						, html: `<p>Set the margin (distance of the image from the page sides and things above/below) and padding (rarely used, space inside the image). <br> 
						This should be in pixels like '50px' or sometimes, rarely, in percentages like '10%'. </p>`
					}
					, {
						type: 'hbox',
						widths: ['33%', '33%', '33%'],
						children: [
							{
								type: 'vbox'
								, children: []
							}
							, {
								type: 'vbox'
								, children: [
									{
										id: 'margintop',
										type: 'text',
										label: 'Top Margin',
										width: 'auto',
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
										width: 'auto',
										setup: function (widget) {
											this.setValue(widget.data.paddingtop);
										},
										commit: function (widget) {
											widget.setData('paddingtop', this.getValue());
										}
									}
								]
							}
							, {
								type: 'vbox'
								, children: [


								]
							}
						]
					}
					, {
						type: 'hbox',
						widths: ['33%', '33%', '33%'],
						children: [
							{
								type: 'hbox'
								, children: [
									{
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
							, {
								type: 'html'
								, html: '<p style="text-align: center">the picture</p>'
							}
							, {
								type: 'hbox'
								, children: [
									{
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
								]
							}
						]

					}
					, {
						type: 'hbox',
						widths: ['33%', '33%', '33%'],
						children: [
							{
								type: 'vbox'
								, children: []
							}
							, {
								type: 'vbox'
								, align: 'center'
								, children: [
									{
										id: 'paddingbottom',
										type: 'text',
										label: 'Bottom Padding',
										width: 'auto',
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
										width: 'auto',
										setup: function (widget) {
											this.setValue(widget.data.marginbottom);
										},
										commit: function (widget) {
											widget.setData('marginbottom', this.getValue());
										}
									}

								]
							}
							, {
								type: 'vbox'
								, children: []
							}
						]
					}
				]
			}
			, {
				id: "css-fields",
				label: 'CSS',
				elements: [
					{
						type: 'html'
						, html: '<p>These are advanced settings for fine grained control of the image.</p>'
					}
					, {
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
					// , {
					// 	id: 'verticalalign',
					// 	type: 'select',
					// 	label: 'Vertical alignment',
					// 	items: [
					// 		['auto', ''],
					// 		['baseline', 'baseline'],
					// 		['sub', 'sub'],
					// 		['super', 'super'],
					// 		['text-top', 'text-top'],
					// 		['text-bottom', 'text-bottom'],
					// 		['middle', 'middle'],
					// 		['top', 'top'],
					// 		['bottom', 'bottom']
					// 	],
					// 	setup: function (widget) {
					// 		this.setValue(widget.data.verticalalign);
					// 	},
					// 	commit: function (widget) {
					// 		widget.setData('verticalalign', this.getValue());
					// 	}
					// }
					, {
						id: 'bordercss',
						type: 'text',
						label: 'Border css',
						width: 'auto',
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
						width: 'auto',
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
				]
			}
		]

	};

	if (!treeBrowserAvailable) {
		desc.contents.push(
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
			}
		)
	}
	return desc
});