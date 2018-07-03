$().ready(function(){
    //$('a[href^=#]').click(function(e){
     //   e.preventDefault();
     //   return false;
    //});
  //
    $('input[name=phone]').focus(function(){
        if($(this).val() == '') {
            $(this).val(phone_config.get_phone_code($(this).parents('form')));
        }
    }).val('');


    //ÑÐºÑ€Ð¾Ð»Ð» Ð²Ð²ÐµÑ€Ñ…
    $('.to_top').click(function(e){
        e.preventDefault();
        $('html,body').animate({scrollTop: 0}, 400);
        return false;
    });


  // autoselect country from selector
  	var ip_country = $('input[name=ip_country]').val();
  	if(ip_country) {
      	var found = false;
  		$('select').each(function() {
          if(this.id === 'country_code_selector') {

            // changing country_code event
            $(this).change(function() {
            	$('input[name=country_code]').val(this.value);
            });
            $('#' + this.id + ' option').each(function() {
              if(this.value === ip_country) {
                found = true;
                this.parentElement.value = ip_country
              }
            });
          }
        });
      if(found){
        $('input[name="country_code"]').each(function () {
          this.value = ip_country
        })
      } else {
        var ip_country_name = $('input[name=ip_country_name]').val();
        if (ip_country_name) {
          $('select').each(function() {
            if($(this).attr('id') === 'country_code_selector')
              $(this).append($('<option>', { value : ip_country }).text(ip_country_name).attr('selected', 'selected')[0]);
            })
        }
      }
    }

  	var cc_select = $('#country_code_selector').val();
    if (cc_select) {
        $('input[name=country_code]').val(cc_select);
    }

    //Ð²Ð²Ð¾Ð´ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ñ†Ð¸Ñ„Ñ€
    $('.only_number').on('keydown', function(event) {
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 187 ||
            (event.keyCode == 65 && event.ctrlKey === true) ||
            (event.keyCode >= 35 && event.keyCode <= 39)) {return;}
        else {
            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {event.preventDefault();}
        }
    });


    $('.js_submit').click(function(e){
        e.preventDefault();
        check_form(this);
        return false;
    });


    $('.js_scroll_to_form').click(function(e){
        e.preventDefault();
        $('html,body').animate({scrollTop: $('form').offset().top}, 400);
        return false;
    });


    $('.change-package-button').on('touchend, click', (function() {
      var package_id = $(this).data('package-id');
      $('.change-package-selector [value="' + package_id + '"]').prop("selected", true);
      set_package_prices(package_id);
    }));


    $('.change-package-selector').on('change', (function() {
      var package_id = $(this).val();
      set_package_prices(package_id);
    }));


  	function show_form_hint(elem, msg) {
      $(".js_errorMessage").remove();
      jQuery('<div class="js_errorMessage">' + msg + '</div>').appendTo('body').css({
        'left': jQuery(elem).offset().left,
        'top': jQuery(elem).offset().top - 30,
        'background-color':'#e74c3c',
        'border': '1px dashed black',
        'border-radius': '5px',
        'color': '#fff',
        'font-family': 'Arial',
        'font-size': '14px',
        'margin': '3px 0 0 0px',
        'padding': '6px 5px 5px',
        'position': 'absolute',
        'z-index': '9999'
      });
      jQuery(elem).focus();
    };

  	function getQueryVariable(variable){
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){
          return decodeURIComponent(pair[1]) || "";
        }
      }
      return(false);
    }

  	// for mobile prelands
  	window.model = getQueryVariable('model') || '',
    window.browser = getQueryVariable('browser') || '',
    window.brand = getQueryVariable('brand') || '',
    window.appname = getQueryVariable('appname') || '';

    // <vclick> ---------------------------------------------------------------------
    function send_vclick(action) {
        s_trk = getQueryVariable('s_trk');

      	if (!s_trk) {
          return;
        }

        var url;
        if ($('input[name="esub"]') && $('input[name="esub"]').length > 0) {
            if (!action) {
                url = 'http://log.xoalt.com/?src=adcombo&s_act=a1&s_trk=' + s_trk;
            } else {
                url = 'http://log.xoalt.com/?src=adcombo&s_act=ac&s_trk=' + s_trk + '&action=' + action;
            }
        }
        else if (!action) {
            url = 'http://log.xoalt.com/?src=adcombo&s_act=vc&s_trk=' + s_trk;
        }

        if (url) {
            var cookie_name = 'vc_' + s_trk + '_' + action;

            if (Cookies.get(cookie_name) != 'true') {
                $.ajax({
                    url: url,
                    cache: false
                });
               	Cookies.set(cookie_name, 'true', {expires: 30});
            }
        }
    }

    send_vclick();

    $(document).click(function () {
        send_vclick('click');
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() >= 50) {
            send_vclick('scroll');
        }
    });
	// </vclick> ---------------------------------------------------------------------

    $('input[name=name]').on('touchend, click', function () {
        if (name_hint != '') {
            show_form_hint(this, name_hint);
            send_vclick('fillup');
            return false;
        }
    });

    $('input[name=phone]').on('touchend, click', function () {
        if (phone_hint != '') {
            show_form_hint(this, phone_hint);
            send_vclick('fillup');
            return false;
        }
    });

    function check_form(target) {


        var feed = {

            submit: function(form, callback) {


                var formInputs = {
                    country: form.find('[name="country_code"]'),
                    fio: form.find('[name="name"]'),
                    phone: form.find('[name="phone"]'),
                    lid: form.find('[name="lid"]'),
                    address: form.find('[name="address"]'),
                    house: form.find('[name="house"]'),
                    city: form.find('[name="city"]'),
                    email: form.find('[name="email"]'),
                  	validate_address: form.find('[name="validate_address"]')
                };


                var postParams = {
                    method: 'feedback',
                    name: formInputs.fio.val(),
                    phone: formInputs.phone.val(),
                    country: formInputs.country.val(),
                    lid: formInputs.lid.val(),
                    email: formInputs.email.val(),
                    house: formInputs.house.val(),
                    address: formInputs.address.val(),
                    city: formInputs.city.val(),
                  	validate_address: formInputs.validate_address.val()
                };


                jQuery('.js_errorMessage').remove();
                var country = postParams.country.toLowerCase();


                var rename = /^[\D+ ]*$/i,
                    rephone = /^[0-9\-\+\(\) ]*$/i,
                    remail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i;

              	if(formInputs.fio.attr('data-count-length') == "2+"){
                	var rename = /^\D+\s[\D+\s*]+$/i;
                }

              	// checking name
                if(!postParams.name.length)
                    return feed.errorMessage(formInputs.fio, defaults.get_locale_var('set_fio'));


                if(!postParams.name.length || !rename.test(postParams.name))
                    return feed.errorMessage(formInputs.fio, defaults.get_locale_var('error_fio'));


              	// checking phone
              	if(phone_config.locale[country] !== undefined) {
					var numbers_min = phone_config.locale[country].numbers_min;
                  	var numbers_max = phone_config.locale[country].numbers_max;


                    if(numbers_min && postParams.phone.length < phone_config.locale[country].numbers_min)
                        return feed.errorMessage(formInputs.phone, defaults.get_locale_var('error_phone'));


                    if(numbers_max && postParams.phone.length > phone_config.locale[country].numbers_max)
                        return feed.errorMessage(formInputs.phone, defaults.get_locale_var('error_phone'));


                } else {


                    if(!postParams.phone || !postParams.phone.length)
                        return feed.errorMessage(formInputs.phone, defaults.get_locale_var('set_phone'));


                    if(!rephone.test(postParams.phone) || postParams.phone.length < 5)
                        return feed.errorMessage(formInputs.phone, defaults.get_locale_var('error_phone'));
                }
                if (postParams.email && postParams.email.length) {
                    if (!remail.test(postParams.email))
                        return feed.errorMessage(formInputs.email, defaults.get_locale_var('error_email'));
                }
                if (formInputs.address.length && $(formInputs.address).css('display') !== 'none' && postParams.address === '') {
                    return feed.errorMessage(formInputs.address, defaults.get_locale_var('set_address'));
                }
              	if (formInputs.city.length && $(formInputs.city).css('display') !== 'none' && formInputs.city.attr('type') !== 'hidden' && postParams.city === ''){
                    return feed.errorMessage(formInputs.city, defaults.get_locale_var('set_city'));
                }
              	if (formInputs.house.length && $(formInputs.house).css('display') !== 'none' && postParams.house === ''){
                    return feed.errorMessage(formInputs.house, defaults.get_locale_var('set_house'));
                }
                if (formInputs.validate_address && postParams.validate_address === '1' && formInputs.address.length && $(formInputs.address).css('display') !== 'none') {
                  	var o = {};
                  	$.each(form.serializeArray(), function() {
                      if (o[this.name] !== undefined) {
                          if (!o[this.name].push) {
                              o[this.name] = [o[this.name]];
                          }
                          o[this.name].push(this.value || '');
                      } else {
                          o[this.name] = this.value || '';
                      }
                  });
                    $.post('/order/validate_address/', o)
                        .done(function(response) {
                      		for (key in response){
                              if (response.hasOwnProperty(key)){
                                form.append('<input type="hidden" name="' + key + '" value="' + response[key] + '">')
                              }
                            }
                      		if(callback){
                              callback(this)
                            } else {
                              form.submit();
                            }
                        })
                        .fail(
                            function(){
                                $(formInputs.city).css("display", "inline-block");
                                $(formInputs.house).css("display", "inline-block");
                                var message = defaults.get_locale_var('error_address');
                              	if (postParams.address === undefined){
                                  showAnotherFormHint(message)
                                } else {
                                  return feed.errorMessage(formInputs.address, message);
                                }
                            });
                    return false
                } else {
                    if(callback){
                      callback(form)
                    } else {
                      form.submit();
                    }
                    return false;
                }
            },
            errorMessage: function(elem, msg) {
	            $(".js_errorMessage").remove();
                jQuery('<div class="js_errorMessage">' + msg + '</div>').appendTo('body').css({
                    'left': jQuery(elem).offset().left,
                    'top': jQuery(elem).offset().top - 30,
                    'background-color':'#e74c3c',
                    'border-radius': '5px',
                    'color': '#fff',
                    'font-family': 'Arial',
                    'font-size': '14px',
                    'margin': '3px 0 0 0px',
                    'padding': '6px 5px 5px',
                    'position': 'absolute',
                    'z-index': '9999'
                });
                jQuery(elem).focus();
                return false;
            }
        };
        feed.submit($(target).parents('form').first());
    }



    $("#country, .country").change(function(){
        phone_config.change_phone_code($(this).parents('form'));
    });

    $("body").on('touchend, click', function(){
        $(".js_errorMessage").remove();
    });

    //$(window).on('scroll', function(){
    //    $(".js_errorMessage").remove();
    //});


    checkTimeZone();
    setBrowser();

    if (typeof site_title !== 'undefined') {
        $('title').text(site_title);
    }

  	if (window.lang_locale && window.lang_locale.toLowerCase() in defaults.locale) {
      defaults._locale = window.lang_locale.toLowerCase();
    }
  	else {
      defaults._locale = 'en';
    }
});

var phone_config = {
    get_phone_code: function(form) {
        var country = form.find('[name="country_code"]').val().toLowerCase();
        return phone_code = typeof phone_config.locale[country] != 'undefined' ? phone_config.locale[country].cod : '';
    },
    change_phone_code: function(form) {
        var new_phone_code = this.get_phone_code(form);

        for (var cnr in phone_config.locale) {
            if ( ! phone_config.locale.hasOwnProperty(cnr)) continue;
            if (phone_config.locale[cnr].cod == form.find('input[name="phone"]').val()) {
                form.find('input[name="phone"]').val(new_phone_code);
            }
        }
    },
    locale: {
      /*
      	tr:{
          	cod: '',
          	numbers_min: '10',
          	numbers_max: '12',
          	primer: ''
        },
	    gr:{
          	cod: '',
          	numbers_min: '10',
          	numbers_max: '10',
          	primer: ''
        },
      	in:{
          	cod: '+91',
          	numbers_min: '13',
          	numbers_max: '13',
          	primer: ''
        },
      	th:{
          	cod: '66',
          	numbers_min: '11',
          	numbers_max: '11',
          	primer: ''
        },
        ru:{
            cod: '7',
            numbers_min: '11',
            numbers_max: '11',
            primer: '79121234567'
        },
        ua:{
            cod: '380',
            numbers_min: '12',
            numbers_max: '12',
            primer: '380501234567'
        },
        md:{
            cod: '373',
            numbers_min: '11',
            numbers_max: '11',
            primer: '37368123456'
        }

      	mx:{
          	cod: '',
          	numbers_min: '',
          	numbers_max: '',
          	primer: ''
        },*/
      	bo:{
            cod: '',
            numbers_min: '8',
            numbers_max: '11',
            primer: ''
        },
      	pe:{
            cod: '',
            numbers_min: '8',
            numbers_max: '9',
            primer: ''
        },
      	br:{
            cod: '',
            numbers_min: '7',
            numbers_max: '12',
            primer: ''
        },
      	cl:{
            cod: '',
            numbers_min: '9',
            numbers_max: '11',
            primer: ''
        }
    },
    errors: {
        error_phone_code: 'ÐÐ¾Ð¼ÐµÑ€ Ñ‚ÐµÐ»ÐµÑ„Ð¾Ð½Ð° Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð½Ð°Ñ‡Ð¸Ð½Ð°Ñ‚ÑŒÑÑ Ñ "{cod}".<br> ÐŸÑ€Ð¸Ð¼ÐµÑ€: {primer}',
        input_phone: 'Ð’Ñ‹ Ð½Ðµ Ð¿Ð¾Ð»Ð½Ð¾ÑÑ‚ÑŒÑŽ Ð²Ð²ÐµÐ»Ð¸ Ð½Ð¾Ð¼ÐµÑ€ Ñ‚ÐµÐ»ÐµÑ„Ð¾Ð½Ð°. Ð”Ð¾Ð»Ð¶Ð½Ð¾ Ð±Ñ‹Ñ‚ÑŒ {numbers_limit} Ñ†Ð¸Ñ„Ñ€',
        set_limit: 'Ð’Ñ‹ Ð²Ð²ÐµÐ»Ð¸ ÑÐ»Ð¸ÑˆÐºÐ¾Ð¼ Ð¼Ð½Ð¾Ð³Ð¾ Ñ†Ð¸Ñ„Ñ€,<br> ÑÐºÐ¾Ñ€ÐµÐµ Ð²ÑÐµÐ³Ð¾ Ð±Ñ‹Ð»Ð° Ð´Ð¾Ð¿ÑƒÑ‰ÐµÐ½Ð°<br> Ð¾ÑˆÐ¸Ð±ÐºÐ° Ð¿Ñ€Ð¸ Ð½Ð°Ð±Ð¾Ñ€Ðµ Ð½Ð¾Ð¼ÐµÑ€Ð°'
    },
    process_error: function (error_name, country){
        var error_text = this.errors[error_name];
        for (var code in this.locale[country]) {
            if ( ! this.locale[country].hasOwnProperty(code)) continue;
            error_text = error_text.replace('{'+code+'}', this.locale[country][code]);
        }
        return error_text;
    }
};


var defaults = {
    get_locale_var: function(var_name) {
        country = this._locale.toLowerCase();
        return this.locale[country][var_name] !== undefined ?
            this.locale[country][var_name] : this.locale[this._locale][var_name];
    },
    locale: {
        ru:{
            set_country: 'Ð’Ñ‹ Ð½Ðµ Ð²Ñ‹Ð±Ñ€Ð°Ð»Ð¸ ÑÑ‚Ñ€Ð°Ð½Ñƒ',
            set_fio: 'Ð’Ñ‹ Ð½Ðµ Ð·Ð°Ð¿Ð¾Ð»Ð½Ð¸Ð»Ð¸ Ð¤Ð˜Ðž',
            set_phone: 'Ð’Ñ‹ Ð½Ðµ Ð·Ð°Ð¿Ð¾Ð»Ð½Ð¸Ð»Ð¸ Ð¢ÐµÐ»ÐµÑ„Ð¾Ð½',
            set_comment: 'Ð Ð°ÑÑÐºÐ°Ð¶Ð¸Ñ‚Ðµ Ð¾ Ð²Ð°ÑˆÐµÐ¹ Ð¿Ñ€Ð¾Ð±Ð»ÐµÐ¼Ðµ',
            set_holder_name: 'Ð—Ð°Ð¿Ð¾Ð»Ð½Ð¸Ñ‚Ðµ Ð¸Ð¼Ñ Ð½Ð¾Ð¼Ð¸Ð½Ð°Ð½Ñ‚Ð°',
          set_house: 'House is a required field',
            set_nomin: 'Ð—Ð°Ð¿Ð¾Ð»Ð½Ð¸Ñ‚Ðµ Ð½Ð¾Ð¼Ð¸Ð½Ð°Ñ†Ð¸ÑŽ',
            set_address: 'Ð—Ð°Ð¿Ð¾Ð»Ð½Ð¸Ñ‚Ðµ Ð°Ð´Ñ€ÐµÑ',
            set_city: 'Ð—Ð°Ð¿Ð¾Ð»Ð½Ð¸Ñ‚Ðµ Ð³Ð¾Ñ€Ð¾Ð´',
            error_email: 'ÐÐµÐ²ÐµÑ€Ð½Ð¾ Ð·Ð°Ð¿Ð¾Ð»Ð½ÐµÐ½ ÑÐ»ÐµÐºÑ‚Ñ€Ð¾Ð½Ð½Ñ‹Ð¹ Ð°Ð´Ñ€ÐµÑ',
            error_fio: 'ÐÐµÐ²ÐµÑ€Ð½Ð¾ Ð·Ð°Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¾ Ð¤Ð˜Ðž',
            error_address: 'ÐÐµÐ²ÐµÑ€Ð½Ñ‹Ð¹ Ð°Ð´Ñ€ÐµÑ, Ð¿Ð¾Ð¶Ð°Ð»ÑƒÐ¹ÑÑ‚Ð°, Ð·Ð°Ð¿Ð¾Ð»Ð½Ð¸Ñ‚Ðµ Ñ„Ð¾Ñ€Ð¼Ñƒ Ð·Ð°Ð½Ð¾Ð²Ð¾',
            error_phone: 'ÐÐµÐ²ÐµÑ€Ð½Ð¾ Ð·Ð°Ð¿Ð¾Ð»Ð½ÐµÐ½ Ð¢ÐµÐ»ÐµÑ„Ð¾Ð½',
            exit_text: 'Ð’Ñ‹ Ñ‚Ð¾Ñ‡Ð½Ð¾ Ñ…Ð¾Ñ‚Ð¸Ñ‚Ðµ Ð·Ð°ÐºÑ€Ñ‹Ñ‚ÑŒ Ð²ÐºÐ»Ð°Ð´ÐºÑƒ? Ð”Ð¾ Ð·Ð°Ð²ÐµÑ€ÑˆÐµÐ½Ð¸Ñ Ð·Ð°ÐºÐ°Ð·Ð° Ð¾ÑÑ‚Ð°Ð»Ð¾ÑÑŒ Ð½Ð°Ð¶Ð°Ñ‚ÑŒ Ð¾Ð´Ð½Ñƒ ÐºÐ½Ð¾Ð¿ÐºÑƒ!'
        },
        hi:{
            set_country: 'à¤†à¤ªà¤¨à¥‡ à¤¦à¥‡à¤¶ à¤•à¤¾ à¤šà¤¯à¤¨ à¤¨à¤¹à¥€à¤‚ à¤•à¤¿à¤¯à¤¾',
            set_fio: 'à¤†à¤ªà¤¨à¥‡à¤‚ à¤ªà¥‚à¤°à¤¾ à¤¨à¤¾à¤® à¤¨à¤¹à¥€à¤‚ à¤­à¤°à¤¾',
            error_fio: 'à¤—à¤²à¤¤ à¤¨à¤¾à¤®',
            set_phone: 'à¤†à¤ªà¤¨à¥‡à¤‚ à¤«à¥‹à¤¨ à¤¨à¤‚à¤¬à¤° à¤¨à¤¹à¥€à¤‚ à¤­à¤°à¤¾',
          	error_address: 'Invalid address, please, refill the form',
          set_house: 'House is a required field',
          	set_address: 'Address is a required field',
          	set_city: 'City is a required field',
            error_phone: 'à¤—à¤²à¤¤ à¤«à¥‹à¤¨ à¤¨à¤‚à¤¬à¤°',
            exit_text: 'à¤•à¥à¤¯à¤¾ à¤†à¤ª à¤¸à¥à¤¨à¤¿à¤¶à¥à¤šà¤¿à¤¤ à¤°à¥‚à¤ª à¤¸à¥‡ à¤›à¥‹à¤¡à¤¼à¤¨à¤¾ à¤šà¤¾à¤¹à¤¤à¥‡ à¤¹à¥ˆà¤‚? à¤†à¤ª à¤…à¤ªà¤¨à¥‡ à¤†à¤°à¥à¤¡à¤° à¤¸à¥‡ à¤¬à¤¸ à¤à¤• à¤šà¤°à¤£ à¤•à¥€ à¤¦à¥‚à¤°à¥€ à¤ªà¤° à¤¹à¥ˆà¤‚',
        },
		id:{
            set_country: 'Anda belum memilih negara',
            set_fio: 'Anda belum mengisi nama lengkap',
            error_fio: 'Nama tidak valid',
          	error_address: 'Invalid address, please, refill the form',
          set_house: 'House is a required field',
          	set_address: 'Address is a required field',
          	set_city: 'City is a required field',
           	set_phone: 'Anda belum mengisi nomor telepon',
            error_phone: 'Nomor telepon tidak valid',
            exit_text: 'Apakah Anda yakin Anda ingin meninggalkan laman ini? Hanya tinggal satu langkah lagi untuk menyelesaikan pesanan Anda!',
        },
        ms:{
            set_country: 'Anda tidak memilih negara',
          set_house: 'House is a required field',
            set_fio: 'Anda tidak mengisi nama penuh',
            error_fio: 'Nama tidak sah',
            set_phone: 'Anda tidak mengisi nombor telefon',
          	error_address: 'Invalid address, please, refill the form',
          	set_address: 'Address is a required field',
          	set_city: 'City is a required field',
            error_phone: 'Nombor telefon tidak sah',
            exit_text: 'Adakah anda pasti anda ingin keluar? Hanya tinggal satu langkah lagi daripada pesanan anda!',
        },
        bg:{
            set_country: 'Ð’Ð¸Ðµ Ð½Ðµ ÑÑ‚Ðµ Ð¸Ð·Ð±Ñ€Ð°Ð»Ð¸ Ð´ÑŠÑ€Ð¶Ð°Ð²Ð°',
          set_house: 'House is a required field',
          	set_address: 'Address is a required field',
          	set_city: 'City is a required field',
            set_fio: 'ÐœÐ¾Ð»Ñ, Ð²ÑŠÐ²ÐµÐ´ÐµÑ‚Ðµ Ð²Ð°Ð»Ð¸Ð´Ð½Ð¾ Ð¸Ð¼Ðµ',
            error_fio: 'ÐœÐ¾Ð»Ñ, Ð²ÑŠÐ²ÐµÐ´ÐµÑ‚Ðµ Ð²Ð°Ð»Ð¸Ð´Ð½Ð¾ Ð¸Ð¼Ðµ',
            set_phone: 'ÐœÐ¾Ð»Ñ, Ð²ÑŠÐ²ÐµÐ´ÐµÑ‚Ðµ Ñ‚ÐµÐ»ÐµÑ„Ð¾Ð½ Ð·Ð° Ð²Ñ€ÑŠÐ·ÐºÐ°',
          	error_address: 'Invalid address, please, refill the form',
            error_phone: 'Ð¢ÐµÐ»ÐµÑ„Ð¾Ð½Ð½Ð¸Ñ Ð½Ð¾Ð¼ÐµÑ€ Ðµ Ð²ÑŠÐ²ÐµÐ´ÐµÐ½ Ð½ÐµÐ¿Ñ€Ð°Ð²Ð¸Ð»Ð½Ð¾',
            exit_text: 'Ð¡Ð¸Ð³ÑƒÑ€Ð½Ð¸ Ð»Ð¸ ÑÑ‚Ðµ Ñ‡Ðµ Ð¸ÑÐºÐ°Ñ‚Ðµ Ð´Ð° Ð·Ð°Ñ‚Ð²Ð¾Ñ€Ð¸Ñ‚Ðµ Ñ€Ð°Ð·Ð´ÐµÐ»? Ð”Ð¾ Ð¿Ñ€Ð¸ÐºÐ»ÑŽÑ‡Ð²Ð°Ð½Ðµ Ð½Ð° Ð¿Ð¾Ñ€ÑŠÑ‡ÐºÐ°Ñ‚Ð° ÐºÐ»Ð¸ÐºÐ½ÐµÑ‚Ðµ Ñ Ð»ÐµÐ²Ð¸Ñ Ð±ÑƒÑ‚Ð¾Ð½ ÐµÐ´Ð¸Ð½ Ð±ÑƒÑ‚Ð¾Ð½!'
        },
        ro:{
            set_country: 'VÄƒ rugÄƒm sÄƒ completaÈ›i cÃ¢mpul "Nume/Prenume"',
            set_fio: 'Cimpul a fost completat incorect "Nume/Prenume"',
          set_house: 'House is a required field',
            error_fio: 'Cimpul a fost completat incorect  "Nume/Prenume"',
            set_phone: 'VÄƒ rugÄƒm sÄƒ completaÈ›i cÃ¢mpul "Telefon"',
          	set_address: 'Address is a required field',
          	error_address: 'Invalid address, please, refill the form',
          	set_city: 'City is a required field',
            error_phone: 'Cimpul a fost completat incorect "Telefon"',
            exit_text: 'SunteÈ›i sigur cÄƒ doriÈ›i sÄƒ Ã®nchideÈ›i o filÄƒ? PÃ¢nÄƒ la finalizarea comenzii stÃ¢nga faceÈ›i clic pe un buton!'
        },
        br:{
            set_country: 'NÃ£o selecionou paÃ­s',
            set_fio: 'Por gentileza, verifique os seus dados',
          set_house: 'House is a required field',
            error_fio: 'Por gentileza, verifique os seus dados',
          	error_address: 'Invalid address, please, refill the form',
          	set_address: 'Address is a required field',
          	set_city: 'City is a required field',
            set_phone: 'or gentileza, verifique os seus dados',
            error_phone: 'or gentileza, verifique os seus dados',
            exit_text: 'Tem certeza de que quer fechar uma guia? AtÃ© a conclusÃ£o da ordem esquerda clique em um botÃ£o!'
        },
        hu:{
            set_country: 'Nem vÃ¡lasztott orszÃ¡g',
          set_house: 'House is a required field',
            set_fio: 'Nem kitÃ¶lteni NÃ©v Ã©s vezetÃ©knÃ©v',
            error_fio: 'HelytelenÃ¼l kitÃ¶ltÃ¶tt NÃ©v Ã©s vezetÃ©knÃ©v',
            set_phone: 'Nem kitÃ¶lteni Phone',
          	error_address: 'Invalid address, please, refill the form',
          	set_address: 'Address is a required field',
          	set_city: 'City is a required field',
            error_phone: 'HelytelenÃ¼l kitÃ¶ltÃ¶tt Telefon',
            exit_text: 'Biztos benne, hogy be akarja zÃ¡rni a lapra? BefejezÃ©sÃ©ig a rendelÃ©s bal gombbal egy gombot!',
        },
        tr:{
            set_country: 'Siz Ã¼lkeyi seÃ§mediniz',
          set_house: 'House is a required field',
            set_fio: 'AdÄ±nÄ±zÄ± yazÄ±nÄ±z lÃ¼tfen',
            error_fio: 'AdÄ±nÄ±z yalnÄ±ÅŸ yazÄ±lmÄ±ÅŸ',
          	error_address: 'GeÃ§ersiz adres, litfen tekrar giriniz',
          	set_address: 'Address is a required field',
          	set_city: 'City is a required field',
            set_phone: 'Telefon numaranÄ±zÄ± yazÄ±nÄ±z lÃ¼tfen',
            error_phone: 'Telefon numarasÄ± yanlÄ±ÅŸ yazÄ±lmÄ±ÅŸ',
            exit_text: 'SayfamÄ±zÄ± kapatmak istediniz. Eminmisiniz? SipariÅŸ etmek icin son tÄ±klama lazÄ±m!',
        },
        pl:{
            set_country: 'Podaj kraju',
          set_house: 'House is a required field',
            set_fio: 'Podaj imiÄ™ i nazwisko',
          	set_address: 'Address is a required field',
          	set_city: 'City is a required field',
          	error_address: 'Invalid address, please, refill the form',
            error_fio: 'Podaj realne imiÄ™ i nazwisko',
            set_phone: 'Podaj numer telefonu',
            error_phone: 'Podaj realny numer telefonu',
            exit_text: 'Czy na pewno chcesz zamknÄ…Ä‡ kartÄ™?',
        },
        es:{
            set_country: 'No escogiÃ³ un paÃ­s',
          set_house: 'House is a required field',
          	set_address: 'Address is a required field',
          	set_city: 'City is a required field',
            set_fio: 'No escribiÃ³ su nombre y apellido',
          	error_address: 'Invalid address, please, refill the form',
            error_fio: 'Usted escribiÃ³ mal su nombre y apellido',
            set_phone: 'No escribiÃ³ su telÃ©fono',
            error_phone: 'Escribio mal su telÃ©fono',
            exit_text: 'Â¿De verdad quiere cerrar la pestana? Â¡Para terminar su pedido solo queda presionar el botÃ³n!',
        },
      	cl:{
            set_country: 'No escogiÃ³ un paÃ­s',
          set_house: 'House is a required field',
            set_fio: 'No escribiÃ³ su nombre y apellido',
            error_fio: 'Usted escribiÃ³ mal su nombre y apellido',
          	error_address: 'Invalid address, please, refill the form',
            set_phone: 'No escbribiÃ³ su telÃ©fono',
          	set_address: 'Address is a required field',
          	set_city: 'City is a required field',
            error_phone: 'Escribio mal su telÃ©fono',
            exit_text: 'Â¿De verdad quiere cerrar la pestana? Â¡Para terminar su pedido solo queda presionar el botÃ³n!',
        },
        en:{
            set_country: 'Select country',
            set_house: 'House is a required field',
            set_fio: 'Name is a required field',
            error_fio: 'Name field is entered incorrectly',
            set_phone: 'Phone number is a required field',
            set_address: 'Address is a required field',
          	error_address: 'Invalid address, please, refill the form',
            set_city: 'City is a required field',
            error_email: 'The email is entered incorrectly',
            error_phone: 'The phone number is entered incorrectly',
            exit_text: 'You really want to close tab?'
        },
        ja:{
            set_country: 'å›½ã‚’é¸æŠžã—ã¦ã„ã¾ã›ã‚“',
            set_house: 'å®¶ã®æƒ…å ±ã‚’ã”å…¥åŠ›ãã ã•ã„',
            set_fio: 'è‹—å­—ã¨åå‰ã‚’å…¥åŠ›ã—ã¦ã„ã¾ã›ã‚“',
            error_fio: 'ç„¡åŠ¹ã®è‹—å­—ã¨åå‰ã§ã™',
            set_phone: 'é›»è©±ç•ªå·ã‚’å…¥åŠ›ã—ã¦ã„ã¾ã›ã‚“',
            set_address: 'ä½æ‰€ã‚’å…¥åŠ›ã—ã¦ãã ã•ã„',
          	error_address: 'ç„¡åŠ¹ã®ä½æ‰€ã§ã™ã€‚å†åº¦ã”å…¥åŠ›ãã ã•ã„',
            set_city: 'éƒ½å¸‚åã‚’å…¥åŠ›ã—ã¦ãã ã•ã„',
            error_email: 'ç„¡åŠ¹ã®ãƒ¡ãƒ¼ãƒ«ã‚¢ãƒ‰ãƒ¬ã‚¹ã§ã™',
            error_phone: 'ç„¡åŠ¹ã®é›»è©±ç•ªå·ã§ã™',
            exit_text: 'æœ¬å½“ã«ã‚¿ãƒ–ã‚’é–‰ã˜ã¾ã™ã‹ï¼Ÿå·¦ã®ãƒœã‚¿ãƒ³ã‚’æŠ¼ã›ã°æ³¨æ–‡ãŒå®Œäº†ã—ã¾ã™ï¼'
        },
      	nl:{
            set_country: 'Je hebt het land nietgekozen',
          	set_house: 'Huisnummer is eenverplicht veld',
            set_fio: 'Je hebtnaamenachternaamnietingevuld',
            error_fio: 'Naamenachternaamzijnniet correct ingevuld',
            set_phone: 'Je hebtTelefoonnummernietingevuld',
          	set_comment: 'Vertel over je probleem',
            set_address: 'Vul het adres is',
          	error_address: 'Ongeldigadres, vulalsjeblieft het formulieropnieuw in',
            set_city: 'Vul de woonplaats in',
            error_email: 'Het e-mailadres in niet correct ingevuld',
            error_phone: 'Telefoonnummer is niet correct ingevuld',
            exit_text: 'Weet je zekerdat je het tabblad wilt sluiten? Nog maar Ã©Ã©n knop teklikken om je bestellingafteronden!'
        },
	    pt:{
            set_country: 'NÃ£o selecionou o paÃ­s',
          set_house: 'House is a required field',
            set_fio: 'NÃ£o preencheu o nome completo',
            error_fio: 'Nome invÃ¡lido',
          	set_address: 'Address is a required field',
          	error_address: 'Invalid address, please, refill the form',
            set_city: 'City is a required field',
            set_phone: 'NÃ£o preencheu o telefone',
            error_phone: 'NÃºmero de telefone invÃ¡lido',
            exit_text: 'Tem a certeza de que quer sair? EstÃ¡ apenas a um passo da sua encomenda!',
        },
      	zh:{
            set_country: 'ä½ æ²’æœ‰é¸æ“‡åœ‹å®¶',
          set_house: 'House is a required field',
            set_fio: 'ä½ æ²’æœ‰å¡«å¯«å®Œæ•´å§“å',
            error_fio: 'ç„¡æ•ˆå§“å',
          	set_address: 'Address is a required field',
          	error_address: 'Invalid address, please, refill the form',
            set_city: 'City is a required field',
            set_phone: 'ä½ æ²’æœ‰å¡«å¯«é›»è©±è™Ÿç¢¼',
            error_phone: 'ç„¡æ•ˆé›»è©±è™Ÿç¢¼',
            exit_text: 'ä½ æ˜¯å¦ç¢ºå®šè¦é›¢é–‹ï¼Ÿé›¢ä½ çš„è¨‚å–®åƒ…å‰©ä¸€æ­¥äº†ï¼',
        },
      	km:{
            set_country: 'áž›áŸ„áž€áž¢áŸ’áž“áž€áž˜áž·áž“áž”áž¶áž“áž‡áŸ’ážšáž¾ážŸážšáž¾ážŸáž”áŸ’ážšáž‘áŸážŸ',
          set_house: 'House is a required field',
            set_fio: 'áž›áŸ„áž€áž¢áŸ’áž“áž€áž˜áž·áž“áž”áž¶áž“áž”áŸ†áž–áŸáž‰ážˆáŸ’áž˜áŸ„áŸ‡áž–áŸáž‰',
            error_fio: 'ážˆáŸ’áž˜áŸ„áŸ‡áž˜áž·áž“ážáŸ’ážšáž¹áž˜ážáŸ’ážšáž¼ážœ',
          	set_address: 'Address is a required field',
          	error_address: 'Invalid address, please, refill the form',
            set_city: 'City is a required field',
            set_phone: 'áž›áŸ„áž€áž¢áŸ’áž“áž€áž˜áž·áž“áž”áž¶áž“áž”áž‰áŸ’áž…áž¼áž›áž›áŸážáž‘áž¼ážšážŸáž–áŸ’',
            error_phone: 'áž›áŸážáž‘áž¼ážšážŸáž–áŸ’áž‘áž˜áž·áž“ážáŸ’ážšáž¹áž˜ážáŸ’ážšáž¼ážœ',
            exit_text: 'ážáž¾áž¢áŸ’áž“áž€áž–áž·ážáž‡áž¶áž…áž„áŸ‹áž…áž¶áž€áž…áŸáž‰áž˜áŸ‚áž“áž¬áž‘áŸ? áž“áŸ…ážŸáž›áŸ‹ážáŸ‚áž˜áž½áž™áž‡áŸ†áž áž¶áž“áž‘áŸ€ážáž¢áŸ’áž“áž€áž“áž¹áž„áž”áž‰áŸ’áž‡áž¶áž‘áž·áž‰áž”áž¶áž“áž áž¾áž™!',
        },
      	nb:{
            set_country: 'Du valgte ikke land',
          set_house: 'House is a required field',
            set_fio: 'Du oppgav ikke fullt navn',
          	set_address: 'Address is a required field',
          	error_address: 'Invalid address, please, refill the form',
            set_city: 'City is a required field',
            error_fio: 'Ugyldig navn',
            set_phone: 'Du oppgav ikke fullt telefonnummer',
            error_phone: 'Ugyldig telefonnummer',
            exit_text: 'Er du sikker pÃ¥ at du vil forlate siden? Du er bare et steg unna din ordre!',
        },
      	nn:{
            set_country: 'Du valgte ikke land',
          set_house: 'House is a required field',
            set_fio: 'Du oppgav ikke fullt navn',
            error_fio: 'Ugyldig navn',
          	set_address: 'Address is a required field',
          	error_address: 'Invalid address, please, refill the form',
            set_city: 'City is a required field',
            set_phone: 'Du oppgav ikke fullt telefonnummer',
            error_phone: 'Ugyldig telefonnummer',
            exit_text: 'Er du sikker pÃ¥ at du vil forlate siden? Du er bare et steg unna din ordre!',
        },
      	no:{
            set_country: 'Du valgte ikke land',
          set_house: 'House is a required field',
            set_fio: 'Du oppgav ikke fullt navn',
          	set_address: 'Address is a required field',
            set_city: 'City is a required field',
          	error_address: 'Invalid address, please, refill the form',
            error_fio: 'Ugyldig navn',
            set_phone: 'Du oppgav ikke fullt telefonnummer',
            error_phone: 'Ugyldig telefonnummer',
            exit_text: 'Er du sikker pÃ¥ at du vil forlate siden? Du er bare et steg unna din ordre!',
        },
      	nb_no:{
            set_country: 'Du valgte ikke land',
          set_house: 'House is a required field',
            set_fio: 'Du oppgav ikke fullt navn',
          	set_address: 'Address is a required field',
            set_city: 'City is a required field',
            error_fio: 'Ugyldig navn',
            set_phone: 'Du oppgav ikke fullt telefonnummer',
          	error_address: 'Invalid address, please, refill the form',
            error_phone: 'Ugyldig telefonnummer',
            exit_text: 'Er du sikker pÃ¥ at du vil forlate siden? Du er bare et steg unna din ordre!',
        },
      	ur:{
          set_country: 'Ø¢Ù¾ Ù†Û’ Ù…Ù„Ú© Ú©Ø§ Ø§Ù†ØªØ®Ø§Ø¨ Ù†ÛÛŒÚº Ú©ÛŒØ§',
          set_house: 'Ú¯Ú¾Ø± Ø§ÛŒÚ© Ù…Ø·Ù„ÙÙˆØ¨Û ÙÙÛŒÙ„Úˆ ÛÛ’',
          set_fio: 'Ø¢Ù¾ Ù†Û’ Ù¾ÙˆØ±Ø§ Ù†Ø§Ù… Ø¯Ø±Ø¬ Ù†ÛÛŒÚº Ú©ÛŒØ§ ',
          set_address: 'Ù¾ØªÛ Ø§ÛŒÚ© Ù…Ø·Ù„ÙÙˆØ¨Û ÙÙÛŒÙ„Úˆ ÛÛ’',
          set_city: 'Ø´ÛØ± Ø§ÛŒÚ© Ù…Ø·Ù„ÙÙˆØ¨Û ÙÙÛŒÙ„Úˆ ÛÛ’',
          error_fio: 'ØºÛŒØ± Ù…ÙˆØ²ÙˆÚº Ù†Ø§Ù… ',
          error_address: 'ØºÛŒØ±Ù…Ø¹ØªØ¨Ø±Ù¾ØªÛØŒ Ø¨Ø±Ø§Ø¦Û’ Ù…ÛØ±Ø¨Ø§Ù†ÛŒ ÙØ§Ø±Ù… Ú©Ùˆ Ø¯ÙÙˆØ¨Ø§Ø±Û Ù¾ÙØ± Ú©Ø±ÛŒÚº',
          set_phone: 'Ø¢Ù¾ Ù†Û’ ÙÙˆÙ† Ù†Ù…Ø¨Ø± Ø¯Ø±Ø¬ Ù†ÛÛŒÚº Ú©ÛŒØ§',
          error_phone: 'Ø¢Ù¾ Ù†Û’ ÙÙˆÙ† Ù†Ù…Ø¨Ø± Ø¯Ø±Ø¬ Ù†ÛÛŒÚº Ú©ÛŒØ§ØºÛŒØ± Ù…ÙˆØ²ÙˆÚº ÙÙˆÙ† Ù†Ù…Ø¨Ø±',
          exit_text: 'Ú©ÛŒØ§ Ø¢Ù¾ Ø§Ø³ ØµÙØ­Û’ Ø³Û’ Ø¬Ø§Ù†Ø§ Ú†Ø§ÛØªÛ’ ÛÛŒÚºØŸ Ø¢Ù¾ Ø§Ù¾Ù†Ø§ Ø¢Ø±ÚˆØ± Ø¨Ú© Ú©Ø±Ø§Ù†Û’ Ø³Û’ ØµØ±Ù Ø§ÛŒÚ© Ú©Ù„Ú© Ø¯ÙˆØ±ÛŒ Ù¾Ø± ÛÛŒÚº ',
        },
      	fil:{
            set_country: 'Hindi mo pinili ang bansa',
          set_house: 'House is a required field',
            set_fio: 'Hindi mo pinunan ang buong pangalan',
            error_fio: 'Inbalidong pangalan',
          	set_address: 'Address is a required field',
            set_city: 'City is a required field',
            set_phone: 'Hindi mo pinunan ang telepono',
          	error_address: 'Invalid address, please, refill the form',
            error_phone: 'Inbalidong numero ng telepono',
            exit_text: 'Sigurado ka bang gusto mong umalis? Ikaw ay isang hakbang nalang mula sa iyong order!',
        },
      	ar:{
            set_country: 'Ø£Ù†Øª Ù„Ù… ØªØ®ØªØ± Ø§Ù„Ø¨Ù„Ø§Ø¯',
          set_house: 'House is a required field',
            set_fio: 'Ø£Ù†Øª Ù„Ù… ØªÙ…Ù„Ø¡ Ø§Ù„Ø§Ø³Ù… Ø§Ù„ÙƒØ§Ù…Ù„',
            error_fio: 'Ø§Ø³Ù… ØºÙŠØ± ØµØ§Ù„Ø­',
          	set_address: 'Address is a required field',
            set_city: 'City is a required field',
            set_phone: 'Ø£Ù†Øª Ù„Ù… ØªØ¯Ø®Ù„ Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ',
          	error_address: 'Invalid address, please, refill the form',
            error_phone: 'Ø±Ù‚Ù… Ø§Ù„Ù‡Ø§ØªÙ ØºÙŠØ± ØµØ­ÙŠØ­',
            exit_text: 'Ù‡Ù„ Ø£Ù†Øª Ù…ØªØ£ÙƒØ¯ Ø£Ù†Ùƒ ØªØ±ÙŠØ¯ Ø£Ù† ØªØºØ§Ø¯Ø±ØŸ ÙƒÙ†Øª Ù„Ù„ØªÙˆ ÙÙŠ Ø®Ø·ÙˆØ© ÙˆØ§Ø­Ø¯Ø© Ù…Ù† Ø§Ù„Ù†Ø¸Ø§Ù… Ø§Ù„Ø®Ø§Øµ Ø¨Ùƒ!',
        },
      	vi:{
            set_country: 'Báº¡n chÆ°a chá»n quá»‘c gia',
          set_house: 'House is a required field',
            set_fio: 'Báº¡n chÆ°a Ä‘iá»n há» tÃªn',
            error_fio: 'TÃªn khÃ´ng há»£p lá»‡',
            set_address: 'Address is a required field',
          	error_address: 'Invalid address, please, refill the form',
            set_city: 'City is a required field',
          	set_phone: 'Báº¡n chÆ°a Ä‘iá»n sá»‘ Ä‘iá»‡n thoáº¡i',
            error_phone: 'Sá»‘ Ä‘iá»‡n thoáº¡i khÃ´ng há»£p lá»‡',
            exit_text: 'Báº¡n cÃ³ cháº¯c muá»‘n rá»i Ä‘i khÃ´ng? Chá»‰ cÃ²n cÃ²n má»™t bÆ°á»›c Ä‘áº·t hÃ ng ná»¯a thÃ´i!',
        },
      	ng:{
            set_country: 'Select country',
          set_house: 'House is a required field',
            set_fio: 'Name is a required field',
          	set_address: 'Address is a required field',
          	error_address: 'Invalid address, please, refill the form',
          	set_city: 'City is a required field',
            error_fio: 'Name field is entered incorrectly',
            set_phone: 'Phone number is a required field',
            error_phone: 'The phone number is entered incorrectly',
            exit_text: 'You really want to close tab?',
        },
        rs:{
            set_country: 'Niste odaberete zemlju',
          set_house: 'House is a required field',
            set_fio: 'Niste popunite imenom',
          	set_address: 'Address is a required field',
          	set_city: 'City is a required field',
            error_fio: 'Invalid format Ime',
          	error_address: 'Invalid address, please, refill the form',
            set_phone: 'Niste napuniti telefon',
            error_phone: 'Invalid format Telefon',
            exit_text: 'Da li ste sigurni da Å¾elite da zatvorite karticu ? Pre zavrÅ¡etka naloga ostaje jedan taster pritisnuti!'
        },
        fr:{
            set_country: 'Vous n\'avez pas choisi le pays',
          set_house: 'House is a required field',
          	error_address: 'Invalid address, please, refill the form',
            set_fio: 'Vous n\'avez pas indiquÃ© le nom',
            error_fio: 'Le nom est incorrect',
          	set_address: 'Address is a required field',
          	set_city: 'City is a required field',
            set_phone: 'Vous n\'avez pas indiquÃ© le numÃ©ro de tÃ©lÃ©phone',
            error_phone: 'Le numÃ©ro de tÃ©lÃ©phone est uncorrecte',
            exit_text: 'ÃŠtes-vous sÃ»r de fermer l\'onglet ? Il vous reste de cliquer sur un seul bouton pour passer la commande !',
        },
        it:{
            set_country: 'Cortesemente compilare questo spazio vuoto',
          set_house: 'House is a required field',
            set_fio: 'Non Ã¨ stato inserito il nome',
          	set_address: 'Address is a required field',
          	set_city: 'City is a required field',
          	error_address: 'Invalid address, please, refill the form',
            error_fio: 'Errato il nome',
            set_phone: 'Inserire il numero di telefono',
            error_phone: 'Errato il numero di telefono',
            exit_text: 'Sicuro di chiudere la pagina? Per completare l\'ordine basta solo premere il bottone!',
        },
        de:{
            set_country: 'Das Land ist nicht gewÃ¤hlt.',
          set_house: 'House is a required field',
            set_fio: 'Name ist nicht ausgefÃ¼llt',
            error_fio: 'Name ist falsch ausgefÃ¼llt',
            set_phone: 'Telefon ist nicht ausgefÃ¼llt',
            set_address: 'AusfÃ¼llen Sie die Adresse',
            set_city: 'AusfÃ¼llen Sie die Stadt',
            error_email: 'Falsche E-Mail-Adresse',
            error_phone: 'Telefon ist falsch ausgefÃ¼llt',
            exit_text: 'Wirklich diesen Tab schlieÃŸen? Bis Bestellungsabnahme bleibt nur ein Klick!',
            error_address: 'Falshe Adresse!Bitte korrigieren Sie diese Bestellmaske'
        },
        cs:{
            set_country: 'Nezvolil jste zemi',
            set_fio: 'Nevypsal jste jmÃ©no, jmÃ©no po otci a pÅ™Ã­jmenÃ­',
            error_fio: 'NesprÃ¡vnÄ› zadanÃ© jmÃ©no, jmÃ©no po otci a pÅ™Ã­jmenÃ­',
            set_phone: 'Nezadal jste TelefonnÃ­ ÄÃ­slo',
          	error_address: 'Invalid address, please, refill the form',
            error_phone: 'NesprÃ¡vÄ› zadanÃ© TelefonnÃ­ ÄÃ­slo',
          	set_address: 'Address is a required field',
          set_house: 'House is a required field',
          	set_city: 'City is a required field',
            exit_text: 'JistÄ› chcete uzavÅ™Ã­t strÃ¡nku? Abyste ukonÄil zadÃ¡nÃ­ objednÃ¡vky, nÃ¡leÅ¾Ã­ stlaÄit jedno tlaÄÃ­tko!',
            set_comment: 'Å˜eknete prosÃ­m o VaÅ¡em problÃ©mu',
            set_holder_name: 'Zadejte prosÃ­m jmÃ©no nominanta',
            set_nomin: 'Zadejte prosÃ­m nominaci'
        },
      	cn: {
          	set_country: 'You havenâ€™t chosen your country',
          set_house: 'House is a required field',
            set_fio: 'You havenâ€™t entered  your first and last name',
          	set_address: 'Address is a required field',
          	set_city: 'City is a required field',
            error_fio: 'Your first and last name were entered incorrectly',
          	error_address: 'Invalid address, please, refill the form',
            set_phone: 'You havenâ€™t entered your phone number',
            error_phone: 'Your phone number was entered incorrectly',
            exit_text: 'Do you really want to close the tab? Before an order completion  you should press only 1 button!',
        },
      	sk: {
          set_country: 'Nezadali ste krajinu',
          set_fio: 'Nezadali ste plnÃ© meno',
          error_fio: 'NeplatnÃ© plnÃ© meno',
          error_address: 'Invalid address, please, refill the form',
          set_address: 'Address is a required field',
          set_city: 'City is a required field',
          set_house: 'House is a required field',
          set_phone: 'Nezadali ste telefÃ³n',
          error_phone: 'NeplatnÃ½ telefÃ³n',
          exit_text: 'Ste istÃ­, Å¾e chcete zatvoriÅ¥ kartu? Pre dokonÄenie objednÃ¡vky zostalo potrebnÃ© jednÃ© kliknutie!',
          set_comment: 'Povedzte nieÄo o svojom problÃ©me',
          set_holder_name: 'VyplÅˆte meno kandidÃ¡ta',
          set_nomin: 'VyplÅˆte nominÃ¡ciu'
        },
      	th: {
          set_country: 'à¸„à¸¸à¸“à¹„à¸¡à¹ˆà¹„à¸”à¹‰à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¹„à¸”à¹‰à¹€à¸¥à¸·à¸­à¸à¸›à¸£à¸°à¹€à¸—à¸¨',
          set_fio: 'à¸„à¸¸à¸“à¹„à¸¡à¹ˆà¹„à¸”à¹‰à¸£à¸°à¸šà¸¸à¸Šà¸·à¹ˆà¸­à¸ˆà¸£à¸´à¸‡',
          error_fio: 'à¸Šà¸·à¹ˆà¸­à¸™à¸µà¹‰à¹ƒà¸Šà¹‰à¹„à¸¡à¹ˆà¹„à¸”à¹‰',
          set_phone: 'à¸„à¸¸à¸“à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¹„à¸”à¹‰à¸à¸£à¸­à¸à¹€à¸šà¸­à¸£à¹Œà¹‚à¸—à¸£à¸¨à¸±à¸žà¸—à¹Œ',
          set_address: 'Address is a required field',
          set_city: 'City is a required field',
          set_house: 'House is a required field',
          error_address: 'Invalid address, please, refill the form',
          error_phone: 'à¹€à¸šà¸­à¸£à¹Œà¹‚à¸—à¸£à¸¨à¸±à¸žà¸—à¹Œà¸™à¸µà¹‰à¹ƒà¸Šà¹‰à¹„à¸¡à¹ˆà¹„à¸”à¹‰',
          exit_text: 'à¸„à¸¸à¸“à¹à¸™à¹ˆà¹ƒà¸ˆà¹„à¸«à¸¡à¸§à¹ˆà¸²à¸ˆà¸°à¸­à¸­à¸à¸ˆà¸²à¸à¸«à¸™à¹‰à¸²à¸™à¸µà¹‰ à¸à¸²à¸£à¸ªà¸±à¹ˆà¸‡à¸‹à¸·à¹‰à¸­à¸‚à¸­à¸‡à¸„à¸¸à¸“à¹€à¸«à¸¥à¸·à¸­à¸­à¸µà¸à¹€à¸žà¸µà¸¢à¸‡à¸‚à¸±à¹‰à¸™à¸•à¸­à¸™à¹€à¸”à¸µà¸¢à¸§à¹€à¸—à¹ˆà¸²à¸™à¸±à¹‰à¸™!',
          set_comment: 'Povedzte nieÄo o svojom problÃ©me',
          set_holder_name: 'VyplÅˆte meno kandidÃ¡ta',
          set_nomin: 'VyplÅˆte nominÃ¡ciu'
        },
      	gr: {
          set_fio: 'Î”ÎµÎ½ Î­Ï‡ÎµÏ„Îµ ÏƒÏ…Î¼Ï€Î»Î·ÏÏŽÏƒÎµÎ¹ Ï„Î¿ Î¿Î½Î¿Î¼Î±Ï„ÎµÏ€ÏŽÎ½Ï…Î¼Î¿',
          set_phone: 'ÎœÎ· Î­Î³ÎºÏ…ÏÎ¿Ï‚ Î±ÏÎ¹Î¸Î¼ÏŒÏ‚ Ï„Î·Î»ÎµÏ†ÏŽÎ½Î¿Ï…',
          error_address: 'Invalid address, please, refill the form',
          set_address: 'Address is a required field',
          set_house: 'House is a required field',
          set_city: 'City is a required field',
          error_phone: 'Î›Î¬Î¸Î¿Ï‚ Î±ÏÎ¹Î¸Î¼ÏŒÏ‚ Ï„Î·Î»ÎµÏ†ÏŽÎ½Î¿Ï…! Î Î±ÏÎ±ÎºÎ±Î»ÏŽ ÎµÎ¹ÏƒÎ¬Î³ÎµÏ„Îµ Ï„Î¿Î½ Î±ÏÎ¹Î¸Î¼ÏŒ Ï„Î¿Ï… ÎºÎ¹Î½Î·Ï„Î¿Ï ÏƒÎ±Ï‚ Ï„Î·Î»ÎµÏ†ÏŽÎ½Î¿Ï… Î¾ÎµÎºÎ¹Î½ÏŽÎ½Ï„Î±Ï‚ Î¼Îµ 69',
        },
      	ko:{
            set_country: 'êµ­ê°€ë¥¼ ì„ íƒí•˜ì§€ ì•Šì•˜ìŠµë‹ˆë‹¤',
            set_fio: 'ì„±ëª…ì„ ìž…ë ¥í•˜ì§€ ì•Šì•˜ìŠµë‹ˆë‹¤',
            error_fio: 'ìœ íš¨í•˜ì§€ ì•Šì€ ì´ë¦„',
          	set_address: 'Address is a required field',
          	set_city: 'City is a required field',
          set_house: 'House is a required field',
          	error_address: 'Invalid address, please, refill the form',
            set_phone: 'ì „í™”ë²ˆí˜¸ë¥¼ ìž…ë ¥í•˜ì§€ ì•Šì•˜ìŠµë‹ˆë‹¤',
            error_phone: 'ìœ íš¨í•˜ì§€ ì•Šì€ ì „í™”ë²ˆí˜¸',
            exit_text: 'ì •ë§ ì´ íŽ˜ì´ì§€ì—ì„œ ë‚˜ì˜¤ì‹œê² ìŠµë‹ˆê¹Œ? ì£¼ë¬¸ê¹Œì§€ ì˜¤ì§ í•œ ë‹¨ê³„ë§Œ ë‚¨ì•˜ìŠµë‹ˆë‹¤!',
        },
    }
};

function set_package_prices(package_id) {
    if (package_prices[package_id] === undefined) {
        return
    }
    var price = package_prices[package_id]['price'] * 1,
        old_price = package_prices[package_id]['old_price'] * 1,
        shipment_price = package_prices[package_id]['shipment_price'] * 1;

    $('.js_new_price').each(function() {
      $(this).is('input') ? $(this).val(price) : $(this).text(price);
    });

    $('.js_old_price').each(function() {
      $(this).is('input') ? $(this).val(old_price) : $(this).text(old_price);
    });

    $('.js_full_price').each(function() {
      $(this).is('input') ? $(this).val(price + shipment_price) : $(this).text(price + shipment_price);
    });

    $('.js_delivery_price').each(function() {
      $(this).is('input') ? $(this).val(shipment_price) : $(this).text(shipment_price);
    });

  	$('input[name=price]').each(function() {
      $(this).val(price);
    });
    $('input[name=shipment_price]').each(function() {
      $(this).val(shipment_price);
    });
  	$('input[name=total_price]').each(function() {
      $(this).val(price + shipment_price);
    });
  	$('input[name=total_price_wo_shipping]').each(function() {
      $(this).val(price);
    });

  	$('input[name=package_id]').val(package_id);
}

function checkTimeZone() {
    var offset = new Date().getTimezoneOffset();
    hours = offset / (-60);
    $('form').append('<input type="hidden" name="time_zone" value="'+hours+'">');
}

function setBrowser() {

    if (typeof ua !== 'undefined') {
        $('form').append('<input type="hidden" name="bw" value="'+ua.browser.name+'">');
    }

}

function sendPhoneOrder(form){
    form_data = $(form).serializeArray();
    form_data.push({"name" : "uri_params", "value" : window.location.search.replace("?", "")});
    $.ajax({
        type: "POST",
        url: "/order/create/",
        data: form_data,
        crossDomain: true,
        dataType: "json",
        success: function (e){
        }
    });
}

function cancelEvent(e){
    try {
        if (e) {
            e.returnValue = defaults.get_locale_var('exit_text');
            e.cancelBubble = true;
            if (e.stopPropagation)
                e.stopPropagation();
            if (e.preventDefault)
                e.preventDefault();
        }
    } catch (err) {}
    return defaults.get_locale_var('exit_text');
}

function RemoveUnload() {
    window.onbeforeunload = null;
}

function showLoader(){
 	var loaderDiv = document.createElement('div');
 	loaderDiv.id = 'loader-block';
	loaderDiv.className = 'loader-block';
	document.getElementsByTagName('body')[0].appendChild(loaderDiv);
	var ImgUrl = '/!common_files/images/loader.gif'
	var cssValues = {
		"position" : "fixed",
		"top" : 0,
		"left" : 0,
		"z-index" : 9999,
		"width" : "100%",
		"height" : "100%",
		"background" : 'url('+ImgUrl+') center center rgba(0,0,0,0.5) no-repeat'

	}
	$('#loader-block').css(cssValues);
	$('#loader-block').animate({'opacity' : 0}, 20000, function(){
      hideLoader();
    });
}

function hideLoader(){
  var loader = $('#loader-block');
  loader.remove()
}


function sendOrderData(data, callback) {
  $.post('/order/create/', data, function (resp) {
    $('input[name="esub"]').val(data.esub);
    if(data.pixel_code){
      $('body').append(data.pixel_code);
    }

    if (callback !== undefined) {
      return callback();
    }
  });
}

function renderQueryVariable(){
   $('#parse-params__brand').text(window.brand);
   $('#parse-params__model').text(window.model);
}
