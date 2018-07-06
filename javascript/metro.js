
(function() {
    var k = {
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
        a = {
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
            widget_page_data: [],
            is_touch_device: !1,
            title_prefix: "MelonHTML5 - ",
            init: function(b) {
                a.is_touch_device = "ontouchstart" in document.documentElement ? !0 : !1;
                a.cacheElements();
                a.Events.onWindowResize();
                $(window).bind("resize", a.Events.onWindowResize).bind("hashchange", a.Events.onHashChange);
                $(document).click(a.Events.onClick);
                a.widget_sidebar.children("div").children("div").click(a.Events.sidebarClick);
                a.is_touch_device ? $(document.body).addClass("touch") : $(document).mousedown(a.Events.onMouseDown).mouseup(a.Events.onMouseUp).mousemove(a.Events.onMouseMove);
                "" !== window.location.hash && (b = window.location.hash.replace(/[#!\/]/g, ""), b = a.widgets.filter('[data-name="' + b + '"]'), b.length && a.openWidget(b));
                $(document.body).addClass("loaded");
                a.widgets.each(function(a) {
                    var b = $(this);
                    setTimeout(function() {
                        b.removeClass("unloaded");
                        setTimeout(function() {
                            b.removeClass("animation")
                        }, 300)
                    }, 100 * a)
                })
            },
            Events: {
                onWindowResize: function(b) {
                    a.window_width = $(window).width();
                    a.window_height = $(window).height()
                },
                onHashChange: function(b) {
                    var c = window.location.hash,
                        d = c.replace(/[#!\/]/g,
                            ""),
                        f = function() {
                            var b = $('div.widget[data-name="' + d + '"]');
                            b.length && a.openWidget(b)
                        };
                    a.widget_open ? "" === c ? a.closeWidget(b) : a.widget_open.data("name") !== d && f() : "" !== c && f()
                },
                onMouseDown: function(b) {
                    a.widget_open || (a.dragging_x = b.clientX)
                },
                onMouseUp: function(b) {
                    if (!a.widget_open && a.dragging_x) {
                        $(document).scrollLeft(0);
                        a.dragging_x = 0;
                        b = -1 * (a.scroll_container_width - a.window_width);
                        var c = function() {
                            setTimeout(function() {
                                a.widget_scroll_container.css("transition", "")
                            }, 400)
                        };
                        60 < a.left || a.scroll_container_width +
                            60 < a.window_width ? (a.widget_scroll_container.css("transition", "left 0.2s ease-in"), a.widget_scroll_container.css("left", 60), a.left = 60, c()) : a.left < b && (a.widget_scroll_container.css("transition", "left 0.2s ease-in"), a.widget_scroll_container.css("left", b), a.left = b, c())
                    }
                },
                onMouseMove: function(b) {
                    if (!a.widget_open && a.dragging_x) {
                        var c = a.left + b.clientX - a.dragging_x;
                        a.widget_scroll_container.css("left", c);
                        a.dragging_x = b.clientX;
                        a.left = c
                    }
                },
                onClick: function(b) {
                    b = $(b.target);
                    b.hasClass("widget") ? a.openWidget(b) :
                        b.parents("div.widget").length && a.openWidget(b.parents("div.widget"))
                },
                sidebarClick: function(b) {
                    switch ($(b.target).attr("class")) {
                        case "cancel":
                            a.closeWidget(b);
                            break;
                        case "refresh":
                            a.refreshWidget(b);
                            break;
                        case "download":
                            window.open("http://codecanyon.net/user/MelonHTML5", "_blank");
                            break;
                        case "back":
                            a.previousWidget(b);
                            break;
                        case "next":
                            a.nextWidget(b)
                    }
                }
            },
            cacheElements: function() {
                a.widgets = $("div.widget");
                a.widget_containers = $("div.widget_container");
                a.widget_scroll_container = $("#widget_scroll_container");
                a.widget_preview = $("#widget_preview");
                a.widget_sidebar = $("#widget_sidebar");
                a.scroll_container_width = a.widget_scroll_container.width()
            },
            openWidget: function(b) {
                var c = b.data("name"),
                    d = b.data("link");
                d && "" !== d ? window.open(d, "_blank") : $.trim(b.data("url")).length && (a.widget_open = b, window.location.hash = "#!/" + c, document.title = a.title_prefix + c, $("#widget_preview_content").remove(), a.widget_preview.addClass("open").css("background-color", b.find(".main").css("background-color")).css("background-image", b.find(".main").css("background-image")),
                    a.widget_scroll_container.hide(), a._loadWidget(b));
                "undefined" !== typeof _gaq && _gaq.push(["_trackPageview", "#" + c])
            },
            closeWidget: function(b) {
                window.location.hash = "";
                document.title = a.title_prefix + "Metro Framework";
                a.widget_scroll_container.show();
                a.widget_preview.removeClass("open");
                a.widget_open = !1;
                setTimeout(function() {
                    $("#widget_preview_content").remove()
                }, 300)
            },
            refreshWidget: function() {
                a._loadWidget(a.widget_open, !1)
            },
            previousWidget: function(b) {
                var c = a.widget_open.prev();
                c.length || (c = a.widget_open.parent().children("div.widget").last());
                var d = c.data("url");
                d && "" !== d ? a.openWidget(c) : (a.widget_open = c, a.previousWidget(b))
            },
            nextWidget: function(b) {
                var c = a.widget_open.next();
                c.length || (c = a.widget_open.parent().children("div.widget").first());
                var d = c.data("url");
                d && "" !== d ? a.openWidget(c) : (a.widget_open = c, a.nextWidget(b))
            },
            _loadWidget: function(b, c) {
                var d = b.data("name"),
                    f = function(b) {
                        a.widget_preview.css("background-image", "none");
                        var c = $("#widget_preview_content");
                        c.length ? c.html(b) : c = $("<div>").attr("id", "widget_preview_content").insertAfter(a.widget_sidebar).html(b);
                        "true" !== k.getItem("melonhtml5_metro_ui_sidebar_first_time") && (a.widget_sidebar.addClass("open"), a.widget_sidebar.mouseenter(function() {
                            k.setItem("melonhtml5_metro_ui_sidebar_first_time", "true", Infinity);
                            $(this).removeClass("open")
                        }))
                    },
                    closeWidget = function() {
                        window.location.hash = "";
                        document.title = a.title_prefix + "Metro Framework";
                        a.widget_scroll_container.show();
                        a.widget_preview.removeClass("open");
                        a.widget_open = !1;
                        setTimeout(function() {
                            $("#widget_preview_content").remove()
                        }, 300)
                    }
                h = (new Date).getTime();
                a.widget_preview.children("div.dot").remove();
                for (var e = 1; 7 >= e; e++) $("<div>").addClass("dot").css("transition", "right " + (.6 + e / 10).toFixed(1) + "s ease-out").prependTo(a.widget_preview);
                var g = function() {
                    var a = $("div.dot");
                    a.length && (a.toggleClass("open"),
                        setTimeout(g, 1300))
                },
                    l = function(b) {
                        var c = (new Date).getTime() - h;
                        1300 < c ? (a.widget_preview.children("div.dot").remove(), "undefined" !== typeof b && b()) : setTimeout(function() {
                            a.widget_preview.children("div.dot").remove();
                            "undefined" !== typeof b && b()
                        }, 1300 - c)
                    };
                a.widget_preview.width();
                g();
                "undefined" === typeof c && (c = !0);
                c && void 0 !== a.widget_page_data[d] ? l(function() {
                    f(a.widget_page_data[d])
                }) : (e = $.trim(b.data("url")), 0 < e.length &&
                    //aqui cria a iframe
                    setTimeout(() => {
                        window.open(e, '_blank');
                        f('');
                        closeWidget('');
                    }, 4000)

                    )
            }
        };
    $(document).ready(a.init)
})();