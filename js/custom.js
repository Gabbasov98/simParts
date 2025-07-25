$(document).ready(function() {

    // new

    $(".personal-manager-top").click(function() {
        $(this).toggleClass("active");
        return false;
    });
    $(".header__lk").click(function() {
        $(this).addClass("active");
    });

    $(".fixedMenu").click(function() {
        if ($(".headfixed-menu .fixedMenu .subMenu").is(":visible")) {
            $(".headfixed-menu .fixedMenu .subMenu").hide();
        } else {
            $(".headfixed-menu .fixedMenu .subMenu").show();
        }
        return false;
    });

    $(".callSecondSub").click(function() {
        $(".secondSub").hide();
        $(this).find(".secondSub").show();
        return false;
    });

    // new

    $(window).scroll(function(){
      var sticky = $('.sticky'),
          scroll = $(window).scrollTop();
      if (scroll >= 100) sticky.addClass('fixed');
      else sticky.removeClass('fixed');
    });

    $(".catalog-list__more").click(function() {
        $(".catalog-list__name").show();
        return false;
    });

    $(document).on("change", "[name=sort]", function() {
        var value = $(this).val();
        window.location.href = value;
    });

    $(document).on("change", "[name=num]", function() {
        var value = $(this).val();
        window.location.href = value;
    });

    $(".smartfilter [type=checkbox]").change(function() {
        $(".smartfilter").submit();
    });

    $(document).on("change", ".filter2__slider input", function() {
        setTimeout(function() {
            $(".smartfilter").submit();
        }, 100);
    });

    $(document).on("mouseup", ".noUi-handle", function() {
        setTimeout(function() {
            $(".smartfilter").submit();
        }, 500);
    });

    if ($(".smartfilter :checked").length) {
        $("[data-no-filter]").hide();
        $("[data-no-filter]").after('<div class="selected-filters"></div>');
        $(".smartfilter :checked").each(function() {
            var text = $(this).parent().find("label").text();
            var id = $(this).attr("id");
            $(".selected-filters").append('<div class="selected-filter" data-unset="'+id+'"><span>'+text+'</span><button class="selected-filter__remove"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 3L3 9M3 3L9 9" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>');
        });
    }

    $(document).on("click", ".selected-filter__remove", function() {
        var id = $(this).parent().attr("data-unset");
        $("#"+id).click();
    });

    $(document).on("input", ".filter2__field input", function() {
        var v = $(this).val().toLowerCase();
        if (v.length > 0) {
            $(this).parents(".filter2__group").find(".filter2__checks").find(".m-check").each(function() {
                var text = $(this).find("label").text().toLowerCase();
                if (!substr_count(text, v)) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });
        } else {
            $(this).parents(".filter2__group").find(".filter2__checks").find(".m-check").show();
        }
    });

    if ($("[data-filter-count]").length) {
        var a = 0;
        if ($(".comprasion-card").length) {
            a = $(".comprasion-card").length;
        } else {
            a = $(".product-card").length;
        }
        if ($(".pagination").length) {
            a = $(".pagination").attr("data-count");
        }
        var a_noun_1 = get_noun(a, "Выбран", "Выбрано", "Выбраны");
        var a_noun_2 = get_noun(a, "товар", "товара", "товаров");
        $("[data-filter-count]").text(a_noun_1+" "+a+" "+a_noun_2);
    }

    $(document).on("click", ".favourite-btn", function() {
        var id = $(this).attr("data-id");
        $.post("/ajax/functions.php", {action:"toggle_favorites", id:id}, function(response) {
            console.log(response);
        });
    });

    $(document).on("click", ".cart-btn", function() {
        var id = $(this).attr("data-id");
        if (id) {
            $.post("/ajax/functions.php", {action:"add_to_basket", id:id}, function(response) {
                if (response.length) {
                    $(".cart-modal").html(response);
                    $("._show-product").click();
                }
            });
        }
    });

    $(document).on("click", "[data-number]", function() {
        var number = $(this).attr("data-number");
        var brand = $(this).attr("data-brand");
        var description = $(this).attr("data-description");
        var price = $(this).attr("data-price");
        var delivery = $(this).attr("data-delivery");
        $.post("/ajax/functions.php", {action:"add_to_basket", number:number, brand:brand, description:description, price:price, delivery:delivery}, function(response) {
            if (response.length) {
                $(".cart-modal").html(response);
                $("._show-product").click();
            }
        });
    });

    // basket
    function basketRecalc() {
        var total = 0;
        var totalQuantity = 0;
        var totalUnits = 0;
        $(".cart-table tr[data-id]").each(function() {
            var price = $(this).attr("data-price");
                price = parseInt(price);
            var quantity = $(this).find(".cartcalc input").val();
                quantity = parseInt(quantity);
            totalUnits++;
            totalQuantity += quantity;
            var subtotal = price*quantity;
            total += subtotal;
            $(this).find("[data-subtotal]").text(subtotal);
        });
        $("[data-quantity-total]").text('Всего наименований: '+totalUnits+', единиц товара: '+totalQuantity);
        $("[data-sum-total]").text(total);
    }

    $(".cartcalc .ccalc-minus").click(function() {
        var id = $(this).parents("tr").attr("data-id");
        var quantity = $(this).parent().find("input").val();
        var max = $(this).parent().find("input").attr("data-max");
        if (max > quantity) {
            $(this).parent().find(".ccalc-plus").attr("disabled", false);
        }
        $.post("/ajax/functions.php", {action:"quantity_change", id:id, quantity:quantity});
        basketRecalc();
        console.log(quantity);
    });

    $(".cartcalc .ccalc-plus").click(function() {
        var id = $(this).parents("tr").attr("data-id");
        var quantity = $(this).parent().find("input").val();
        var max = $(this).parent().find("input").attr("data-max");
        if (max >= quantity) {
            $(this).attr("disabled", true);
        }
        $.post("/ajax/functions.php", {action:"quantity_change", id:id, quantity:quantity});
        basketRecalc();
        console.log(quantity);
    });

    $("[data-basket-delete]").click(function() {
        var id = $(this).parents("tr").attr("data-id");
        $(this).parents("tr").remove();
        basketRecalc();
        if (!$(".cart-table tr[data-id]").length) {
            $(".cart-table").hide();
            setTimeout(function() {
                window.location.reload();
            }, 500);
        }
        $.post("/ajax/functions.php", {action:"unset_item", id:id});
    });

    $("[data-clear-basket]").click(function() {
        $.post("/ajax/functions.php", {action:"basket_clear"});
        setTimeout(function() {
            window.location.reload();
        }, 500);
    });

    // order
    $("#order_form").submit(function() {
        var data = $(this).serialize();
        $.post("/ajax/functions.php", {action:"order_form", data:data}, function(response) {
            if (response.length) {
                window.location.href = "/personal/success/?ORDER_ID="+response;
            }
        });
        return false;
    });

    $(document).on("click", "[data-link]", function() {
        var a = $(this).attr("data-link");
        window.location.href = a;
    });

    $("#subscribe_form").submit(function() {
        var email = $(this).find("[name=EMAIL]").val();
        $.post("/ajax/functions.php", {action:"subscribe", email:email}, function(response) {
            if (response == "done") {
                $("#subscribe_form").replaceWith('<p class="modal-message-success">Вы успешно подписаны на рассылку.</div>');
            } else {
                show_error_modal($("#subscribe_form [name=EMAIL]"), "Указанный email уже участвует в рассылке.");
            }
        });
        return false;
    });

    $("#preorder_form").submit(function() {
        var data = $(this).serialize();
        $.post("/ajax/functions.php", {action:"preorder_form", data:data}, function(response) {
            $("#preorder_form").replaceWith('<p class="modal-message-success">Ваш заказ успешно отправлен.</div>');
        });
        return false;
    });

    // auth and register

    function show_error_modal($input, $message) {
        $($input).parent().addClass("_error");
        $($input).parent().find(".red-text").text($message);
    }

    $(".modal__form input").blur(function() {
        var required = $(this).attr('required');
        if (typeof required !== 'undefined' && required !== false) {
            if (!$(this).val().length) {
                show_error_modal($(this), "Поле обязательно для заполнения");
            }
        }
    });

    $(".modal__form input").focus(function() {
        $(this).parent().removeClass("_error");
    });

    $("#auth_form").submit(function() {
        var data = $(this).serialize();
        $.post("/ajax/functions.php", {action:"auth_form", data:data}, function(response) {
            if (response == "error") {
                show_error_modal($("#auth_form [name=LOGIN]"), "Неправильный логин или пароль");
                show_error_modal($("#auth_form [name=PASSWORD]"), "Неправильный логин или пароль");
            } else {
                //$("#auth_form").replaceWith('<p class="modal-message-success">Вы успешно авторизованы.</div>');
                window.location.reload();
            }
        });
        return false;
    });

    $("#restore_form").submit(function() {
        var email = $(this).find("[name=LOGIN]").val();
        $.post("/ajax/functions.php", {action:"restore_password", email:email}, function(response) {
            if (response == "success") {
                $(".confirm-modal__desc.text14").hide();
                $("#restore_form").replaceWith('<p class="modal-message-success text14">На указанную почту высланы дальнейшие инструкции.</div>');
            } else {
                show_error_modal($("#restore_form [name=LOGIN]"), "Указанный email не найден.");
            }
        });
        return false;
    });

    if ($("#restoreModal_step2").length) {
        openModal("restoreModal_step2");
    }

    $("#restore_form_2").submit(function() {
        var data = $(this).serialize();
        var pass_1 = $(this).find("[name=PASSWORD]").val();
        var pass_2 = $(this).find("[name=PASSWORD2]").val();
        if (pass_1 != pass_2) {
            show_error_modal($("#restore_form_2 [name=PASSWORD]"), "Пароли не совпадают.");
            show_error_modal($("#restore_form_2 [name=PASSWORD2]"), "Пароли не совпадают.");
        } else if (!(/^[A-z0-9_-]{6,12}$/.test(pass_1))) {
            show_error_modal($("#restore_form_2 [name=PASSWORD]"), "Длина пароля 6-12 сиволов. Содержит буквы латинского алфавита и цифры.");
        } else {
            $("#restore_form_2 .confirm-modal__desc.text14").text('Пароль успешно сменен.');
            $.post("/ajax/functions.php", {action: "restore_password_2", data:data}, function() {

            });
        }
        return false;
    });

    $("#register_form_1").submit(function() {
        var data = $(this).serialize();
        $.post("/ajax/functions.php", {action:"register_form", data:data}, function(response) {
            if (response == "exists") {
                show_error_modal($("#register_form_1 [name=EMAIL]"), "Уже используется");
            } else if (response == "success") {
                $("#register_form_1").replaceWith('<p class="modal-message-success">Вы успешно зарегистрированы.</div>');
                window.location.reload();
            }
        });
        return false;
    });

    $("[data-check-inn]").click(function() {

        var inn = $("#register_form_2 [name=INN]").val();

        /*console.log(inn);
        console.log(inn.length);*/

        if (inn.length == 10) {

            var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party";
            var token = "53d2a1e4a317093a86c52be1f93ff9d8f5b7c13a";
            var query = inn;

            var options = {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Token " + token
                },
                body: JSON.stringify({query: query, branch_type: "MAIN", count: 1})
            }

            fetch(url, options)
            .then(function(response) {
                response.json().then(function(data) {
                    console.log(data.suggestions[0].data);
                    var org = data.suggestions[0].data;
                    var name = org.name.full;
                    var address = org.address.value;
                    var management = org.management.name;
                    var management_post = org.management.post;
                    var ogrn = org.ogrn;
                    $(".fg__hint .gray-text").html();
                    $(".fg__hint .gray-text").append('<p><b>Наименование:</b> '+name+'</p>');
                    $(".fg__hint .gray-text").append('<p><b>Адрес:</b> '+address+'</p>');
                    $(".fg__hint .gray-text").append('<p><b>Управляющий:</b> '+management+'</p>');
                    $(".fg__hint .gray-text").append('<p><b>Должность:</b> '+management_post+'</p>');
                    $(".fg__hint .gray-text").append('<p><b>ОГРН:</b> '+ogrn+'</p>');

                    if (org.opf.short == "ИП") {
                        $("#register_form_22 [name=TYPE]").val("ИП");
                    } else {
                        $("#register_form_22 [name=TYPE]").val("Юр.лицо");
                    }
                    $("#register_form_22 [name=NAME]").val(org.name.short_with_opf);
                    $("#register_form_22 [name=INN]").val(org.inn);
                    //$("#register_form_22 [name=nds]").val("");
                    $("#register_form_22 [name=FIO]").val(org.management.name);
                    $("#register_form_22 [name=POSITION]").val(org.management.post);
                    $("#register_form_22 [name=PHONE]").val(org.phones);
                    $("#register_form_22 [name=EMAIL]").val(org.emails);
                    $("#register_form_22 [name=CITY]").val(org.address.data.city);

                });
            })
            .catch(error => console.log("error", error));

            $("#register_form_2 [name=INN]").attr("disabled", true);

            var htmlData = '<b></b>';

            $("#register_form_2 .text14").html(htmlData);

            $("#register_form_2 [data-check-inn]").hide();
            $("#register_form_2 [data-clear-inn]").show();
            $("#register_form_2 [type=submit]").show();

        } else {

            show_error_modal($("#register_form_2 [name=INN]"), "Некорректный ИНН");
            $("#register_form_2 [type=submit]").hide();
            $("#register_form_2 [data-clear-inn]").hide();
            $("#register_form_2 [data-check-inn]").show();

            $("#register_form_2 [name=INN]").attr("disabled", false);
            $("#register_form_2 [name=INN]").removeAttr("disabled");
            //$("#register_form_2 [name=INN]").val("");

            //$("#register_form_2 .text14").html("Мы проверим автоматически ваш ИНН <br> и вам останется ввести только данные вашего представителя");

        }

        return false;
    });

    $("[data-clear-inn]").click(function() {
        $("#register_form_2 [type=submit]").hide();
        $("#register_form_2 [data-clear-inn]").hide();
        $("#register_form_2 [data-check-inn]").show();
        $("#register_form_2 [name=INN]").attr("disabled", false);
        $("#register_form_2 [name=INN]").removeAttr("disabled");
        $("#register_form_2 [name=INN]").val("");
        $("#register_form_2 .text14").html("Мы проверим автоматически ваш ИНН <br> и вам останется ввести только данные вашего представителя");
        return false;
    });

    $("#register_form_2").submit(function() {
        
        openModal("bigClientModal2");
        
        return false;

    });

    $("#register_form_22").submit(function() {

        var data = $(this).serialize();

        $.post("/ajax/functions.php", {action:"register_form_2", data:data}, function(response) {
            if (response == "exists") {
                show_error_modal($("#register_form_22 [name=EMAIL]"), "Уже используется");
            } else if (response == "success") {
                $("#register_form_22").remove();
                $("#bigClientModal2 .modal__title").after('<div class="confirm-modal__desc text14">Вы успешно зарегистрированы! В ближайшее время с Вами свяжется менеджер.</div>');
                //window.location.reload();
            }
        });

        return false;

    });

    // personal

    $("_tab-personal .personal-info input").focus(function() {
        $(this).parent().removeClass("_error");
    });

    $("._tab-personal personal-info input").blur(function() {
        var name = $(this).attr("name");
        var value = $(this).val();
        if (value.length > 0) {
            $.post("/ajax/functions.php", {action:"personal_info_change", name:name, value:value});
        } else {
            $(this).parent().addClass("_error");
            $(this).parent().find(".red-text").text("Обязательно для заполнения");
        }
    });

    $(document).on("change", "_tab-personal .personal-info select", function() {
        var name = $(this).attr("name");
        var value = $(this).val();
        $.post("/ajax/functions.php", {action:"personal_info_change", name:name, value:value});
    });

    // messages
    $("[data-archive]").click(function() {
        var id = $(this).attr("data-archive");
        $(this).parents(".message").fadeOut(250);
        $.post("/ajax/functions.php", {action:"message_to_archive", id:id});
    });

    // garage

    $(".garage-form__13 [name=vin]").focus(function() {
        $(this).parent().removeClass("_error");
    });
    $(".garage-form__13 [name=vin]").blur(function() {
        var vin = $(this).val();
        if (vin.length > 0) {
            if (vin.length == 17) {
                $.post("/ajax/functions.php", {action:"check_vin_garage", vin:vin}, function(response) {
                    if (response.vins[0]) {

                        console.log(response.vins[0]);

                        $(".garage-form [name=brand]").find("[value="+response.vins[0].markName+"]").attr("selected", true);
                        $(".garage-form [name=brand]").niceSelect('update');
                        $(".garage-form [name=model]").val(response.vins[0].modelName);

                        $(".garage-form [name=comment]").val(response.vins[0].description);
                        $(".garage-form [name=photo_link]").val(response.vins[0].image);

                        $.each(response.vins[0].parameters, function(key, value) {
                            //console.log(key, value);
                            if (value.key == "series") {
                                $(".garage-form [name=modification]").val(value.value);
                            }
                            if (value.key == "year") {
                                $(".garage-form [name=year]").val(value.value);
                            }
                        });

                    }
                }, "json");
            } else {
                $(this).parent().addClass("_error");
                $(this).parent().find(".red-text").text("Некорректный VIN");
            }
        }
    });

    // misc

    $("[name=theme]").change(function() {
        var theme = $(this).val().toLowerCase();
        $(".quiz-modal__interest-links > div").hide();
        $(".quiz-modal__interest ._tab-content").removeClass("_active");
        $(".quiz-modal__interest-links > div").each(function() {
            var tags = $(this).attr("data-tags");
            if (substr_count(tags, theme)) {
                $(this).show();
            }
        });
    });

    $(document).on("change", ".by-select__wrap select", function() {

        var value = $(this).val();

        if (value == "все") {
            $(".part-table__name").each(function() {
                $(this).parents("tr").show();
            });
        } else {
            $(".part-table__name").each(function() {
                var name = $(this).find("span").eq(0).text();
                if (!substr_count(name, value)) {
                    $(this).parents("tr").hide();
                } else {
                    $(this).parents("tr").show();
                }
            });
        }

        console.log(value);

    });


    $("#ask_form").submit(function() {
        var data = $(this).serialize();
        $(this).html('<p>Спасибо за Ваш вопрос! Мы ответим как можно быстрее.</p>');
        $.post("/ajax/functions.php", {action:"ask_form", data:data}, function() {

        });
        return false;
    });

    $("#feedback_form").submit(function() {
        var data = $(this).serialize();
        $.post("/ajax/functions.php", {action:"feedback_form", data:data});
        $("#feedback_form").html('<div class="success-message">Ваше сообщение успешно отправлено!</div>');
        //$("#callback_trigger").click();
        return false;
    });

    // catalog functions

    // not used now
    $(".part-card__show").click(function() {
        var thisEl = $(this);
        var mark = $(this).find(".part-card__title").attr("data-mark");
        var model = $(this).find(".part-card__title").attr("data-model");
        var modification = $(this).find(".part-card__title").attr("data-modification");
        var id = $(this).find(".part-card__title").attr("data-id");

        if ($(this).hasClass("ajax-get-parts")) {

            var mark = $(this).find(".part-card2__title").attr("data-mark");
            var model = $(this).find(".part-card2__title").attr("data-model");
            var modification = $(this).find(".part-card2__title").attr("data-modification");
            var id = $(this).find(".part-card2__title").attr("data-id");
            var parent = $(this).find(".part-card2__title").attr("data-parent");

            $.post("/ajax/functions.php", {action:"get_catalog_parts", mark:mark, model:model, modification:modification, parent:parent, id:id}, function(response) {
                if (response.length) {
                    $(thisEl).parent().find(".spoiler-card__hidden").html(response);
                }
            });

            $.post("/ajax/functions.php", {action:"get_catalog_scheme", mark:mark, model:model, modification:modification, parent:parent, id:id}, function(response) {
                if (response.length) {
                    $(".catalog-part__img").html(response);
                }
            });

        } else {

            $.post("/ajax/functions.php", {action:"get_catalog_groups", mark:mark, model:model, modification:modification, id:id}, function(response) {
                if (response.length) {
                    $(thisEl).parent().find(".spoiler-card__hidden").html(response);
                }
            });

        }

    });

    $(document).on("click", "[data-needLoadSubGroups]", function() {
        var thisEl = $(this);
        var mark = $(this).parents(".part-card").find(".part-card__title").attr("data-mark");
        var model = $(this).parents(".part-card").find(".part-card__title").attr("data-model");
        var modification = $(this).parents(".part-card").find(".part-card__title").attr("data-modification");
        var id = $(this).attr("data-needLoadSubGroups");

        $.post("/ajax/functions.php", {action:"get_catalog_groups", mark:mark, model:model, modification:modification, id:id}, function(response) {
            if (response.length) {
                $(thisEl).parents(".part-card").find(".spoiler-card__hidden").html(response);
            }
        });
        
    });

    $(document).on("click", "[data-preorder]", function() {
        var name = $(this).attr("data-preorder");
        $("#preorderModal [name=part]").val(name);
        $("#preorderModal .confirm-modal__desc-part-description span").text(name);
    });

    $("[data-select-tag]").click(function() {
        $("[data-select-tag]").removeClass("_active");
        $(this).addClass("_active");
        var tag = $(this).attr("data-select-tag");
        $("[data-tag]").hide();
        $("[data-tag='"+tag+"']").show();
        return false;
    });

    /*if ($(".ajax-get-parts").length) {
        $(".ajax-get-parts").eq(0).click();
    }*/

    $(document).on("mouseover", ".hover_group", function() {
        var code = $(this).attr("data-code");
        $("[data-hl-part]").removeClass("hovered");
        $("[data-hl-part='"+code+"']").addClass("hovered");
    });

    $(document).on("click", "[data-hl-part]", function() {

        var code = $(this).attr("data-hl-part");
        $("[data-hl-part].active").removeClass("active");
        $(this).addClass("active");

        /*$("[data-code]").removeClass("active");
        $("[data-code='"+code+"']").addClass("active");*/

        $(".highlight").removeClass("active");

        $("#openseadragon1").find("a").each(function() {
            var id = $(this).attr("id");
            if (substr_count(id, code)) {
                console.log(id);
                $(this).addClass("active");
            }
        });

        $('#example-tip').hide();

    });

    $(document).on("click", "[data-code]", function() {
        var code = $(this).attr("data-code");
        $("[data-code].active").removeClass("active");
        $(this).addClass("active");
        $("[data-hl-part]").removeClass("active");
        $("[data-hl-part='"+code+"']").addClass("active");
    });

    $(document).on("change", "[name=method]", function() {
        var m = $(this).val();
        if (m == "VIN") {
            $(".search-block__type-title").text("Поиск по VIN:");
            $(".search-block__field input").attr("placeholder", "Введите VIN автомобиля");
        } else if (m == "артикулу") {
            $(".search-block__type-title").text("Поиск по артикулу:");
            $(".search-block__field input").attr("placeholder", "Введите артикул автомобиля");
        } else if (m == "названию модели") {
            $(".search-block__type-title").text("Поиск по модели:");
            $(".search-block__field input").attr("placeholder", "Введите название модели");
        } else if (m == "марке") {
            $(".search-block__type-title").text("Поиск по марке:");
            $(".search-block__field input").attr("placeholder", "Введите название марки");
        }
    });

    setTimeout(function() {
        $(".header-search__method").fadeTo("250", 1);
    }, 500);

    $(".city-toggle").click(function() {
        $("[data-city-variant]").toggle();
        return false;
    });

    if ($(".lk__content").length) {
        var hash = location.hash;
        if (hash == "#history") {
            $("[data-tab=history]").click();
        }
        if (hash == "#messages") {
            $("[data-tab=message]").click();
        }
    }

    $("[data-delivery=2]").hide();
    $(document).on("change", "[name=delivery]", function() {
        var delivery = $(this).val();
        if (delivery == 2) {
            $("[data-delivery=2]").show();
        } else {
            $("[data-delivery=2]").hide();
        }
    });

    function comparer(index) {
        return function(a, b) {
            var valA = getSortAttrVal(a, index), valB = getSortAttrVal(b, index)
            return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
        }
    }
    function getSortAttrVal(row, index){ return $(row).attr('data-price') }

    $(document).on("change", "[name=sort2]", function() {
        
        var sort = $(this).val();

        var table = $('.sort-table-1');
        var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
        this.asc = !this.asc
        if (!this.asc){rows = rows.reverse()}
        for (var i = 0; i < rows.length; i++){table.append(rows[i])}

    });

});