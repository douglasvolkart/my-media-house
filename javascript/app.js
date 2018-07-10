(function () {
    var util = {
        getItem: function(a) {
            return a && this.hasItem(a) ? unescape(document.cookie.replace(RegExp("(?:^|.*;\\s*)" + escape(a).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1")) : null
        },
        setItem: function(a, c, d, f, h, e) {
            if (a && !/^(?:expires|max\-age|path|domain|secure)$/i.test(a)) {
                var g = "";
                if (d) switch (d.constructor) {
                    case Number:
                        g = Infinity === d ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + d;
                        break;
                    case String:
                        g = "; expires=" + d;
                        break;
                    case Date:
                        g = "; expires=" + d.toGMTString()
                }
                document.cookie =
                    escape(a) + "=" + escape(c) + g + (h ? "; domain=" + h : "") + (f ? "; path=" + f : "") + (e ? "; secure" : "")
            }
        },
        removeItem: function(a, c) {
            a && this.hasItem(a) && (document.cookie = escape(a) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (c ? "; path=" + c : ""))
        },
        hasItem: function(a) {
            return RegExp("(?:^|;\\s*)" + escape(a).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(document.cookie)
        }
    },
    app = {
        window_width: 0,
        window_height: 0,
        scroll_container_width: 0,
        widget_preview: null,
        widget_sidebar: null,
        widgets: null,
        widget_scroll_container: null,
        widget_containers: null,
        widget_open: !1,
        dragging_x: 0,
        left: 60,
        widget_current_focus: 0,
        widget_page_data: [],
        is_touch_device: !1,
        title_prefix: "MyMediaHome - ",
        init: function () {
            app.is_touch_device = "ontouchstart" in document.documentElement ? !0 : !1;
            app.cacheElements();
            document.querySelector('[tabindex="0"]').focus();
            $(document).click(app.Events.onClick);
            $(document).keydown(app.Events.onKeypress);
            app.is_touch_device ? $(document.body).addClass("touch") : $(document).mousedown(app.Events.onMouseDown).mouseup(app.Events.onMouseUp).mousemove(app.Events.onMouseMove);
            $(document.body).addClass("loaded");
            app.widgets.each(function (index) {
                var widget = $(this);
                setTimeout(function () {
                    widget.removeClass("unloaded");
                    setTimeout(function () {
                        widget.removeClass("animation")
                    }, 300)
                }, 100 * index)
            })
        },
        cacheElements: function () {
            app.widgets = $("div.widget");
            app.widget_containers = $("div.widget_container");
            app.widget_scroll_container = $("#widget_scroll_container");
            app.widget_preview = $("#widget_preview");
            app.widget_sidebar = $("#widget_sidebar");
            app.scroll_container_width = app.widget_scroll_container.width()
        },
        Events: {
            onClick: function () {

            },
            onMouseMove: function (event) {
                if (!app.widget_open && app.dragging_x) {
                    var c = app.left + event.clientX - app.dragging_x;
                    app.widget_scroll_container.css("left", c);
                    app.dragging_x = event.clientX;
                    app.left = c
                    
                }
            },
            onMouseDown: function (event) {
                app.widget_open || (app.dragging_x = event.clientX)
                console.log(event.clientX)
            },
            onMouseUp: function (event) {
                if (!app.widget_open && app.dragging_x) {
                    $(document).scrollLeft(0);
                    app.dragging_x = 0;
                    event = -1 * (app.scroll_container_width - app.window_width);
                    var transition = function () {
                        setTimeout(function () {
                            app.widget_scroll_container.css("transition", "")
                        }, 400)
                    };
                    60 < app.left || app.scroll_container_width +
                        60 < app.window_width ? (app.widget_scroll_container.css("transition", "left 0.2s ease-in"),
                            app.widget_scroll_container.css("left", 60),
                            app.left = 60, transition()
                        ) : app.left < event && (
                            app.widget_scroll_container.css("transition", "left 0.2s ease-in"),
                            app.widget_scroll_container.css("left", event),
                            app.left = event, transition())
                }
            },
            onClick: function (element) {
                element = $(element.target);
                element.hasClass("widget") ? app.openWidget(element) :
                    element.parents("div.widget").length && app.openWidget(element.parents("div.widget"))
            },
            onKeypress: function (event) {
                //left
                if (event.keyCode == 37) {
                    if (app.widget_current_focus > 0) {
                        app.widget_current_focus -= 1;
                        document.querySelector('[tabindex="' + app.widget_current_focus + '"]').focus();
                    }
                }

                //right
                if (event.keyCode == 39) {
                    if (app.widget_current_focus < 13) {
                        app.widget_current_focus += 1;
                        document.querySelector('[tabindex="' + app.widget_current_focus + '"]').focus();
                    }
                }

                //enter
                if (event.keyCode == 13) {
                    var element = $('.widget[tabindex="' + app.widget_current_focus + '"]');
                    element.hasClass("widget") ? app.openWidget(element) :
                    element.parents("div.widget").length && app.openWidget(element.parents("div.widget"))
                }
            }
        },
        openWidget: function (element) {
            var name = element.data("name"),
                link = element.data("link");
            link && "" !== link ? window.open(link, "_blank") : $.trim(element.data("url")).length && (app.widget_open = element, window.location.hash = "#!/" + name, document.title = app.title_prefix + name, $("#widget_preview_content").remove(), app.widget_preview.addClass("open").css("background-color", element.find(".main").css("background-color")).css("background-image", element.find(".main").css("background-image")),
                app.widget_scroll_container.hide(), app._loadWidget(element));
            "undefined" !== typeof _gaq && _gaq.push(["_trackPageview", "#" + name])
        },
        closeWidget: function (b) {
            window.location.hash = "";
            document.title = app.title_prefix + "myMediaHouse";
            app.widget_scroll_container.show();
            app.widget_preview.removeClass("open");
            app.widget_open = !1;
            setTimeout(function () {
                $("#widget_preview_content").remove()
            }, 300)
        },

        //melhorar legibilidade
        _loadWidget: function (element, content) {
            var name = element.data("name"),
                showContentBackground = function (content) {
                    app.widget_preview.css("background-image", "none");
                    var content = $("#widget_preview_content");
                    content.length ? content.html(content) : content = $("<div>").attr("id", "widget_preview_content").insertAfter(app.widget_sidebar).html(content);
                    "true" !== util.getItem("melonhtml5_metro_ui_sidebar_first_time") && (app.widget_sidebar.addClass("open"), app.widget_sidebar.mouseenter(function () {
                        util.setItem("melonhtml5_metro_ui_sidebar_first_time", "true", Infinity);
                        $(this).removeClass("open")
                    }))
                },
                dateNow = (new Date).getTime();
            app.widget_preview.children("div.dot").remove();
            for (var e = 1; 7 >= e; e++) $("<div>").addClass("dot").css("transition", "right " + (.6 + e / 10).toFixed(1) + "s ease-out").prependTo(app.widget_preview);
            var toggleLoading = function () {
                var divDots = $("div.dot");
                divDots.length && (divDots.toggleClass("open"),
                    setTimeout(toggleLoading, 1300))
            },
                loading = function (b) {
                    var count = (new Date).getTime() - dateNow;
                    1300 < count ? (app.widget_preview.children("div.dot").remove(), "undefined" !== typeof b && b()) : setTimeout(function () {
                        app.widget_preview.children("div.dot").remove();
                        "undefined" !== typeof b && b()
                    }, 1300 - count)
                };
            app.widget_preview.width();
            toggleLoading();
            "undefined" === typeof content && (content = !0);
            content && void 0 !== app.widget_page_data[name] ? loading(function () {
                showContentBackground(app.widget_page_data[name])
            }) : (e = $.trim(element.data("url")), 0 < e.length &&
                //aqui cria a iframe
                setTimeout(() => {
                    window.open(e, '_blank');
                    showContentBackground('');
                    app.closeWidget('');
                }, 2000)

                )
        }
    }

    $(document).ready(app.init)
})();