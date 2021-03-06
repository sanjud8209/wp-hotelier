jQuery(function ($) {
	'use strict';
	/* global jQuery, wp */
	/* eslint-disable no-multi-assign */

	var HTL_Settings = {
		init: function () {
			this.show_uploader();
			this.seasonal_dates_datepicker();
			this.add_seasonal_rule();
			this.navigation();
		},

		show_uploader: function () {
			var uploader_button = $('.htl-ui-button--upload');
			var field = uploader_button.closest('.htl-ui-setting').find('input.htl-ui-input--upload');
			var file_frame;

			uploader_button.on('click', function (e) {
				e.preventDefault();

				// If the media frame already exists, reopen it.
				if (file_frame) {
					file_frame.open();
					return;
				}

				// Create the media frame.
				file_frame = wp.media.frames.file_frame = wp.media({
					states: [
						new wp.media.controller.Library({
							filterable: 'all',
							multiple: false
						})
					]
				});

				// When an image is selected, run a callback.
				file_frame.on('select', function () {
					var selection = file_frame.state().get('selection');
					var file_path = '';

					selection.map(function (attachment) {
						attachment = attachment.toJSON();

						if (attachment.url) {
							file_path = attachment.url;
						}
					});

					field.val(file_path);
				});

				// Finally, open the modal.
				file_frame.open();
			});
		},

		add_seasonal_rule: function () {
			$('#hotelier-seasonal-schema-table').on('htl_multi_text_before_clone_row', function (e) {
				// Destroy datepicker
				e.row.find('.htl-ui-input--start-date').datepicker('destroy').removeAttr('id');
				e.row.find('.htl-ui-input--end-date').datepicker('destroy').removeAttr('id');
			});

			$('#hotelier-seasonal-schema-table').on('htl_multi_text_after_add_row', function () {
				// Init datepicker again
				HTL_Settings.seasonal_dates_datepicker();
			});
		},

		seasonal_dates_datepicker: function () {
			var table = $('#hotelier-seasonal-schema-table');
			var from_inputs = table.find('.htl-ui-input--start-date');
			var to_inputs = table.find('.htl-ui-input--end-date');

			from_inputs.datepicker({
				dateFormat: 'yy-mm-dd',
				minDate: 0,
				changeMonth: true,
				onClose: function () {
					var date = $(this).datepicker('getDate');

					if (date) {
						date.setDate(date.getDate() + 1);
						$(this).closest('tr').find('.htl-ui-input--end-date').datepicker('option', 'minDate', date);
					}
				},
				beforeShow: function () {
					$('#ui-datepicker-div').addClass('htl-ui-custom-datepicker');
				}
			});

			to_inputs.datepicker({
				dateFormat: 'yy-mm-dd',
				minDate: 1,
				changeMonth: true,
				beforeShow: function () {
					$('#ui-datepicker-div').addClass('htl-ui-custom-datepicker');
				}
			});
		},

		navigation: function () {
			var nav_button = $('.htl-ui-text-icon--show-settings-navigation');
			var nav = $('.hotelier-settings-navigation__list');
			var default_text = nav_button.text();
			var hide_text = nav_button.attr('data-hide-text');

			nav_button.on('click', function () {
				if (nav_button.hasClass('active')) {
					nav.hide();
					nav_button.removeClass('active').text(default_text);
				} else {
					nav.show();
					nav_button.addClass('active').text(hide_text);
				}
			});
		}
	};

	$(document).ready(function () {
		HTL_Settings.init();
	});
});
