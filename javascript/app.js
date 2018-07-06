(function () {
    var app = {
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
        title_prefix: "MyMediaHome - ",
        init: function () {
            app.is_touch_device = "ontouchstart" in document.documentElement ? !0 : !1;
            app.cacheElements();
            $(document).click(app.Events.onClick);
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
        }
    }

    $(document).ready(app.init)
})();