(function() {
    var e = function(t, n) {
        var r = e.resolve(t, n || "/"), i = e.modules[r];
        if (!i) throw new Error("Failed to resolve module " + t + ", tried " + r);
        var s = e.cache[r], o = s ? s.exports : i();
        return o;
    };
    e.paths = [], e.modules = {}, e.cache = {}, e.extensions = [ ".js", ".coffee" ], e._core = {
        assert: !0,
        events: !0,
        fs: !0,
        path: !0,
        vm: !0
    }, e.resolve = function() {
        return function(t, n) {
            function r(t) {
                t = u.normalize(t);
                if (e.modules[t]) return t;
                for (var n = 0; n < e.extensions.length; n++) {
                    var r = e.extensions[n];
                    if (e.modules[t + r]) return t + r;
                }
            }
            function i(t) {
                t = t.replace(/\/+$/, "");
                var n = u.normalize(t + "/package.json");
                if (e.modules[n]) {
                    var i = e.modules[n](), s = i.browserify;
                    if (typeof s == "object" && s.main) {
                        var o = r(u.resolve(t, s.main));
                        if (o) return o;
                    } else if (typeof s == "string") {
                        var o = r(u.resolve(t, s));
                        if (o) return o;
                    } else if (i.main) {
                        var o = r(u.resolve(t, i.main));
                        if (o) return o;
                    }
                }
                return r(t + "/index");
            }
            function s(e, t) {
                var n = o(t);
                for (var s = 0; s < n.length; s++) {
                    var u = n[s], a = r(u + "/" + e);
                    if (a) return a;
                    var f = i(u + "/" + e);
                    if (f) return f;
                }
                var a = r(e);
                if (a) return a;
            }
            function o(e) {
                var t;
                e === "/" ? t = [ "" ] : t = u.normalize(e).split("/");
                var n = [];
                for (var r = t.length - 1; r >= 0; r--) {
                    if (t[r] === "node_modules") continue;
                    var i = t.slice(0, r + 1).join("/") + "/node_modules";
                    n.push(i);
                }
                return n;
            }
            n || (n = "/");
            if (e._core[t]) return t;
            var u = e.modules.path();
            n = u.resolve("/", n);
            var a = n || "/";
            if (t.match(/^(?:\.\.?\/|\/)/)) {
                var f = r(u.resolve(a, t)) || i(u.resolve(a, t));
                if (f) return f;
            }
            var l = s(t, a);
            if (l) return l;
            throw new Error("Cannot find module '" + t + "'");
        };
    }(), e.alias = function(t, n) {
        var r = e.modules.path(), i = null;
        try {
            i = e.resolve(t + "/package.json", "/");
        } catch (s) {
            i = e.resolve(t, "/");
        }
        var o = r.dirname(i), u = (Object.keys || function(e) {
            var t = [];
            for (var n in e) t.push(n);
            return t;
        })(e.modules);
        for (var a = 0; a < u.length; a++) {
            var f = u[a];
            if (f.slice(0, o.length + 1) === o + "/") {
                var l = f.slice(o.length);
                e.modules[n + l] = e.modules[o + l];
            } else f === o && (e.modules[n] = e.modules[o]);
        }
    }, function() {
        var t = {};
        e.define = function(n, r) {
            e.modules.__browserify_process && (t = e.modules.__browserify_process());
            var i = e._core[n] ? "" : e.modules.path().dirname(n), s = function(t) {
                return e(t, i);
            };
            s.resolve = function(t) {
                return e.resolve(t, i);
            }, s.modules = e.modules, s.define = e.define, s.cache = e.cache;
            var o = {
                exports: {}
            };
            e.modules[n] = function() {
                return e.cache[n] = o, r.call(o.exports, s, o, o.exports, i, n, t), o.exports;
            };
        };
    }(), e.define("path", function(e, t, n, r, i, s) {
        function o(e, t) {
            var n = [];
            for (var r = 0; r < e.length; r++) t(e[r], r, e) && n.push(e[r]);
            return n;
        }
        function u(e, t) {
            var n = 0;
            for (var r = e.length; r >= 0; r--) {
                var i = e[r];
                i == "." ? e.splice(r, 1) : i === ".." ? (e.splice(r, 1), n++) : n && (e.splice(r, 1), n--);
            }
            if (t) for (; n--; n) e.unshift("..");
            return e;
        }
        var a = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;
        n.resolve = function() {
            var e = "", t = !1;
            for (var n = arguments.length; n >= -1 && !t; n--) {
                var r = n >= 0 ? arguments[n] : s.cwd();
                if (typeof r != "string" || !r) continue;
                e = r + "/" + e, t = r.charAt(0) === "/";
            }
            return e = u(o(e.split("/"), function(e) {
                return !!e;
            }), !t).join("/"), (t ? "/" : "") + e || ".";
        }, n.normalize = function(e) {
            var t = e.charAt(0) === "/", n = e.slice(-1) === "/";
            return e = u(o(e.split("/"), function(e) {
                return !!e;
            }), !t).join("/"), !e && !t && (e = "."), e && n && (e += "/"), (t ? "/" : "") + e;
        }, n.join = function() {
            var e = Array.prototype.slice.call(arguments, 0);
            return n.normalize(o(e, function(e, t) {
                return e && typeof e == "string";
            }).join("/"));
        }, n.dirname = function(e) {
            var t = a.exec(e)[1] || "", n = !1;
            return t ? t.length === 1 || n && t.length <= 3 && t.charAt(1) === ":" ? t : t.substring(0, t.length - 1) : ".";
        }, n.basename = function(e, t) {
            var n = a.exec(e)[2] || "";
            return t && n.substr(-1 * t.length) === t && (n = n.substr(0, n.length - t.length)), n;
        }, n.extname = function(e) {
            return a.exec(e)[3] || "";
        };
    }), e.define("__browserify_process", function(e, t, n, r, i, s) {
        var s = t.exports = {};
        s.nextTick = function() {
            var e = [], t = typeof window != "undefined" && window.postMessage && window.addEventListener;
            return t && window.addEventListener("message", function(t) {
                if (t.source === window && t.data === "browserify-tick") {
                    t.stopPropagation();
                    if (e.length > 0) {
                        var n = e.shift();
                        n();
                    }
                }
            }, !0), function(n) {
                t ? (e.push(n), window.postMessage("browserify-tick", "*")) : setTimeout(n, 0);
            };
        }(), s.title = "browser", s.browser = !0, s.env = {}, s.argv = [], s.binding = function(t) {
            if (t === "evals") return e("vm");
            throw new Error("No such module. (Possibly not yet loaded)");
        }, function() {
            var t = "/", n;
            s.cwd = function() {
                return t;
            }, s.chdir = function(r) {
                n || (n = e("path")), t = n.resolve(r, t);
            };
        }();
    }), e.define("/F.backbone.js", function(e, t, n, r, i, s) {
        F.R.highlightCurrentModule = function(e) {
            $("#head a").removeClass("ui-state-active"), $("#tabs a").removeClass("active-tab");
            if (e !== !1) {
                $("#head a[href='/#/" + e.split("/")[0] + "']").addClass("ui-state-active"), $("#tabs a[href='/#/" + e + "']").addClass("active-tab");
                var t = [ /*"ots/plans", */"crud/intervention", "crud/task" ];
                _.indexOf(t, e) === -1 ? ($("#left").css({
                    width: "75%"
                }), $("#right").css({
                    left: "75%",
                    width: "25%"
                })) : ($("#left").css({
                    width: "50%"
                }), $("#right").css({
                    left: "50%",
                    width: "50%"
                }));
            }
        };
    }), e.define("/F.basics.js", function(e, t, n, r, i, s) {
        F.doNothing = function() {}, F.log = function(e) {
            console ? console.log(e) : alert(e);
        }, F.objectSize = function(e) {
            var t = 0, n;
            for (n in e) e.hasOwnProperty(n) && t++;
            return t;
        }, F.concatObjects = function(e, t) {
            for (var n in t) e[n] = t[n];
            return e;
        }, F.JSONValuesToArray = function(e) {
            var t = [];
            return _.each(e, function(e, n) {
                t.push(e);
            }), t;
        }, F.flipDateMonth = function(e) {
            var t = e.substr(0, 10);
            return t[3] + t[4] + t[5] + t[0] + t[1] + t[2] + t[6] + t[7] + t[8] + t[9] + e.substr(10, e.length);
        }, F.toHumanDate = function(e, t) {
            if (e === null) return null;
            var n = new Date(e), r = "";
            return n.setHours(n.getHours() + 3), r += (n.getDate() < 10 ? "0" : "") + n.getDate(), r += "/", r += (n.getMonth() + 1 < 10 ? "0" : "") + (n.getMonth() + 1), r += "/", r += n.getFullYear(), t === undefined && t === !0 && (r += " ", r += (n.getHours() < 10 ? "0" : "") + n.getHours(), r += ":", r += (n.getMinutes() < 10 ? "0" : "") + n.getMinutes(), r += ":", r += (n.getSeconds() < 10 ? "0" : "") + n.getSeconds()), r;
        }, F.capitalize = function(e) {
            return e.charAt(0).toUpperCase() + e.substr(1);
        }, $.fn.serializeObject = function() {
            var e = {}, t = this.serializeArray();
            return $.each(t, function() {
                e[this.name] ? (e[this.name].push || (e[this.name] = [ e[this.name] ]), e[this.name].push(this.value || "")) : e[this.name] = this.value || "";
            }), e;
        }, $.fn.getFields = function() {
            return $(this).find("input:text, input:checkbox, textarea, select");
        }, $.fn.dataTableExt.oSort["es_date-asc"] = function(e, t) {
            var n = new Date(e), r = new Date(t);
            return n < r ? -1 : n > r ? 1 : 0;
        }, $.fn.dataTableExt.oSort["es_date-desc"] = function(e, t) {
            var n = new Date(e), r = new Date(t);
            return n < r ? 1 : n > r ? -1 : 0;
        }, $.fn.dataTableExt.oApi.fnAddDataAndDisplay = function(e, t) {
            var n = this.oApi._fnAddData(e, t), r = e.aoData[n].nTr;
            this.oApi._fnReDraw(e);
            var i = -1;
            for (var s = 0, o = e.aiDisplay.length; s < o; s++) if (e.aoData[e.aiDisplay[s]].nTr == r) {
                i = s;
                break;
            }
            return i >= 0 && (e._iDisplayStart = Math.floor(s / e._iDisplayLength) * e._iDisplayLength, this.oApi._fnCalculateEnd(e)), this.oApi._fnDraw(e), {
                nTr: r,
                iPos: n
            };
        }, F.onSuccess = function(e, t, n) {
            var r = JSON.parse(e);
            r === !0 ? t(r) : n(r);
        }, F.getAllFromModel = function(e, t) {
            $.ajax({
                url: "/" + e,
                success: function(e) {
                    t(e);
                }
            });
        }, F.getOneFromModel = function(e, t, n) {
            $.ajax({
                url: "/" + e + "/" + t,
                success: function(e) {
                    n(e);
                }
            });
        }, F.getNextOtNumber = function(e) {
            $.ajax({
                url: "/ot/next",
                success: function(t) {
                    e(t);
                }
            });
        }, F.getDataTableSelection = function(e) {
            var t = [], n = $(e).dataTable().fnGetNodes();
            for (var r = 0; r < n.length; r += 1) $(n[r]).hasClass("selected_row") && t.push(n[r]);
            return t;
        }, F.reloadDataTable = function(e) {
            $(e).dataTable().api().ajax.reload()
            $(e).hide().fadeIn(500);
        };
    }), e.define("/F.validations.js", function(e, t, n, r, i, s) {
        F.V.len = function(e) {
            return $(e).val().length > 0;
        }, F.V.equal = function(e, t) {
            return $(e).val() === $(t).val();
        }, F.V.alpha = function(e, t, n, r) {
            F.V.len($(t)) ? n() : r('El campo "' + e + '" no puede estar vacío');
        }, F.V.numeric = function(e, t, n, r) {
            try {
                Validate.Numericality(parseInt($(t).val())), n();
            } catch (i) {
                r('El campo "' + e + '" sólo acepta números');
            }
        }, F.V.integer = function(e, t, n, r) {
            try {
                Validate.Numericality(parseInt($(t).val()), {
                    onlyInteger: !0
                }), n();
            } catch (i) {
                r('El campo "' + e + '" sólo acepta números enteros');
            }
        }, F.V.range = function(e, t, n, r) {
            try {
                Validate.Numericality(parseInt($(t).val()), {
                    minimum: t.min,
                    maximum: t.max
                }), n();
            } catch (i) {
                r('El campo "' + e + '" sólo acepta números entre ' + t.min + " y " + t.max);
            }
        }, F.V.passwords = function(e, t, n, r) {
            return !F.V.len(e) || !F.V.len(t) ? (r("Las contraseñas son obligatorias"), !1) : F.V.equal(e, t) ? (n(), !0) : (r("Las contraseñas deben ser iguales"), !1);
        }, F.V.email = function(e, t, n, r) {
            try {
                Validate.Email($(t).val()), n();
            } catch (i) {
                r("El campo " + e + " es incorrecto");
            }
        }, F.V.cuit = function(e, t, n, r) {
            return !0;
        }, F.V.formSimple = function(e, t) {
            _.each(F.getFormFields(e), function(e) {
                var n = $(e).is("input:text") && !$(e).length, r = $(e).is("select") && $(e).val() === -1, i = $(e).is("textarea") && !$(e).length;
                (n || r || i) && t();
            });
        };
    }), e.define("/F.widgets.js", function(e, t, n, r, i, s) {
        F.withoutId = function(e) {
            return e.substr(0, e.length - 3);
        }, F.msg = function(e) {
            noty({
                text: e,
                layout: "topRight"
            });
        }, F.msgSticky = function(e) {
            noty({
                text: e,
                layout: "topRight",
                timeout: !1
            });
        }, F.msgOK = function(e) {
            noty({
                text: e,
                layout: "topRight",
                type: "success",
                closeOnSelfHover: !0
            });
        }, F.msgOKTop = function(e) {
            noty({
                text: e,
                layout: "top",
                type: "success",
                closeOnSelfHover: !0
            });
        }, F.msgError = function(e) {
            noty({
                text: e,
                layout: "topRight",
                type: "error",
                timeout: !1
            });
        }, F.msgErrorTop = function(e) {
            noty({
                text: e,
                layout: "top",
                type: "error",
                modal: !0,
                timeout: !1
            });
        }, F.msgConfirm = function(e, t, n) {
            noty({
                text: e,
                buttons: [ {
                    type: "button green",
                    text: "OK",
                    click: t
                }, {
                    type: "button black",
                    text: "Cancelar",
                    click: n || F.doNothing
                } ],
                modal: !0,
                closable: !1,
                closeOnSelfClick: !1,
                timeout: !1
            });
        }, F.renderAllChosen = function() {
            $(".chzn-select").chosen({
                allow_single_deselect: !0,
                no_results_text: "Nada coincide con:"
            });
        }, F.appendSelectionField = function(e) {
            $(e).append($("<input>", {
                type: "hidden",
                "class": "selection_id",
                value: 0
            }));
        }, F.appendTitle = function(e, t) {
            $(e).append('<h3 class="formtitle">' + t + "</h3>");
        }, F.createDataTable = function(e, t, n) {
            var rows = '';
            var attrs = [];
            var hidden_columns = [0];
            var date_columns = [];
            var order;
            if(e.datatableOptions){
                if(e.datatableOptions.aaSorting){
                    order = e.datatableOptions.aaSorting;
                }
            };
            (e.headers).forEach(function(header){
                rows += '<th>'+header+'</th>';
            });
            if (e.hidden_columns) {
                (e.hidden_columns).forEach(function(hidden){
                    hidden_columns.push((e.attrs).indexOf(hidden));
                });
            };
            if (e.date_columns) {
                (e.date_columns).forEach(function(date){
                    date_columns.push((e.attrs).indexOf(date));
                });
            };
            (e.attrs).forEach(function(attr){
                attrs.push({data:attr});
            });
            var table = '<div id="'+e.name+'_left">'+
                            '<table id="'+e.name+'_table" style="padding:10px" class="display '+e.name+'_table" cellspacing="0" width="100%">'+
                                '<thead>'+
                                    '<tr>'+
                                        rows+    
                                    '</tr>'+
                                '</thead>'+
                            '</table>'+
                        '</div>';

            $("#left").html(table);
            var datatable = $('#'+e.name+'_table').dataTable({
                ajax: e.source,
                columns: attrs,
                columnDefs: [
                    {
                        targets: hidden_columns,
                        visible: false,
                    },
                    {
                        targets: date_columns,
                        type: 'date-euro',
                    }
                ],
                order: order,
                iDisplayLength: 25,
                oLanguage: {
                    oPaginate: {
                        sFirst: "Inicio",
                        sPrevious: "Anterior",
                        sNext: "Siguiente",
                        sLast: "Final"
                    },
                    sEmptyTable: "No existen registros",
                    sInfo: "_START_ - _END_ de _TOTAL_",
                    sInfoEmpty: "",
                    sInfoFiltered: "(filtrando de _MAX_ en total)",
                    sInfoThousands: ".",
                    sLengthMenu: "Mostrar _MENU_",
                    sLoadingRecords: "Cargando...",
                    sProcessing: "Procesando...",
                    sSearch: "Buscar",
                    sZeroRecords: "No existen registros"
                },
                dom: 'lBfr<"toolbar">tip',
                buttons: [
                        'copy', 'csv', 'excel', 'pdf'
                    ],
                fnDrawCallback: function(){
                    $('.dataTables_filter input').focus();
                },
                rowCallback: function(row, data, index){
                    e.rowHandler && e.rowHandler(row, data);
                }
            });
            $(document).on('click', '#'+e.name+'_table tbody tr', function()
            {
                if (!$(this).hasClass('details')){
                    var i = datatable.fnGetData(this);
                    $("." + e.name + "_form .selection_id").val(i.id);
                    $("." + e.name + "_infocard .selection_id").val(i.id); 
                    $("#" + e.name + "_table tr").removeClass("selected_row"); 
                    $(this).addClass("selected_row"); 
                    $(".BUTTON_create").hide(); 
                    $(".BUTTON_save, .BUTTON_cancel, .BUTTON_delete").show(); 
                }
                t && t(i);
            });
            n && n($("." + e.name + "_table"), e.options.open_ot_number_on_start);
            /*var r = $("<tr>"), i = $("<thead>").append(r), s = $("<tbody>"), o = [], u = [];
            _.each(e.headers, function(e) {
                $(r).append($("<th>").html(e));
            }), _.each(e.data.models, function(n) {
                var r = $("<tr>"), i = {};
                _.forEach(e.attrs, function(t, s) {
                    var a = t === "id" || t.search("_id") !== -1 || t.search("_list") !== -1 || t.search("password") !== -1 || _.indexOf(e.hidden_columns, t) !== -1;
                    a ? u.push({
                        bVisible: !1,
                        aTargets: [ s ]
                    }) : o.push(s), $(r).append($("<td>").html(n.attributes[t])), i[t] = n.attributes[t];
                }), $(s).append(r), e.rowHandler && e.rowHandler(r, n.attributes), $(r).on("click", function() {
                    var n = $("." + e.name + "_table").dataTable();
                    $("." + e.name + "_form .selection_id").val(n.fnGetData(this)[0]), $("." + e.name + "_infocard .selection_id").val(n.fnGetData(this)[0]), $("." + e.name + "_table tr").removeClass("selected_row"), $(this).addClass("selected_row"), $(".BUTTON_create").hide(), $(".BUTTON_save, .BUTTON_cancel, .BUTTON_delete").show(), t && t(i);
                });
            }), $("#" + e.name + "_left").append($("<table>", {
                "class": e.name + "_table"
            }).append(i).append(s));
            var a = F.concatObjects({
                aoColumnDefs: u,
                iDisplayLength: 500,
                sPaginationType: "full_numbers",
                bJQueryUI: !0,
                oLanguage: {
                    oPaginate: {
                        sFirst: "Inicio",
                        sPrevious: "Anterior",
                        sNext: "Siguiente",
                        sLast: "Final"
                    },
                    sEmptyTable: "No existen registros",
                    sInfo: "_START_ - _END_ de _TOTAL_",
                    sInfoEmpty: "",
                    sInfoFiltered: "(filtrando de _MAX_ en total)",
                    sInfoThousands: ".",
                    sLengthMenu: "Mostrar _MENU_",
                    sLoadingRecords: "Cargando...",
                    sProcessing: "Procesando...",
                    sSearch: "Buscar",
                    sZeroRecords: "No existen registros"
                },
                sDom: 'T<"clearTableTools"><"H"lfr>t<"F"ip>',
                oTableTools: {
                    sSwfPath: "/swf/copy_csv_xls_pdf.swf",
                    aButtons: [ {
                        sExtends: "copy",
                        mColumns: o
                    }, {
                        sExtends: "csv",
                        mColumns: o
                    }, {
                        sExtends: "xls",
                        mColumns: o
                    }, {
                        sExtends: "pdf",
                        mColumns: o
                    } ]
                }
            }, e.datatableOptions ? e.datatableOptions : {});
            e.datatable = $("." + e.name + "_table").dataTable(a), n && n($("." + e.name + "_table"), e.options.open_ot_number_on_start);
        */}, F.resetForm = function(e) {
            $(e).each(function() {
                this.reset();
            });
        }, F.initForm = function(e) {
            $(e).find("input:text, input:password, textarea").val(null);
            $(e).find("input:checkbox").attr("checked", !1);
            $(e).find("select").val(-1).trigger('liszt:updated');
        }, F.cleanForm = function(e) {
            $(e).find("input:text, input:password, textarea").val(null);
            $(e).find("input:checkbox").attr("checked", !1);
            $(e).find("select").val(-1).trigger('liszt:updated');
            $(e).find('.selection_id').val('');
            $(e).find('.dispensable').remove();
            $(e).find('option:first').prop('selected', function() {
                return this.defaultSelected;
            });
            $(".BUTTON_save, .BUTTON_cancel, .BUTTON_delete").hide(), $(".BUTTON_create").show();
        }, F.getFormFields = function(e) {
            return $(e).find("input:text, input:password, input:checkbox, select, textarea");
        }, F.assignValuesToForm = function(e, t) {
            var n = F.getFormFields(e), r;
            F.initForm(e), _.each(n, function(e, n) {
                r = $(e).attr("name");
                if ($(e).hasClass("chzn-select") && $(e).attr("multiple")) {
                    var i = t[r].split(",");
                    _.each(i, function(t, n) {
                        $(e).find("option[value=" + t + "]").attr("selected", !0);
                    });
                } else $(e).is(":checkbox") ? $(e).attr("checked", !!t[r]) : $(e).val(t[r]);
                $(e).trigger("liszt:updated");
            });
        }, F.appendFormButtons = function(e, t) {
            function n() {
                $(".BUTTON_save, .BUTTON_cancel, .BUTTON_delete").hide(), $(".BUTTON_create").show();
            }
            e.buttons || (e.buttons = {
                create: !0,
                save: !0,
                cancel: !0,
                "delete": !0
            });
            var r = e.isCRUD ? " hidden" : "";
            e.buttons.create && $(t).append($("<input>", {
                type: "button",
                "class": "BUTTON_create",
                value: "Crear"
            })), e.buttons.save && $(t).append($("<input>", {
                type: "button",
                "class": "BUTTON_save" + r,
                value: "Guardar"
            })), e.buttons.cancel && $(t).append($("<input>", {
                type: "button",
                "class": "BUTTON_cancel" + r,
                value: "Cancelar"
            }).on("click", function() {
                F.cleanForm(t)
                e.isCRUD && n(), $(".selected_row").removeClass("selected_row");
            })), e.buttons.delete && $(t).append($("<input>", {
                type: "button",
                "class": "BUTTON_delete" + r,
                value: "Eliminar"
            })), e.buttons.query && $(t).append($("<input>", {
                type: "button",
                "class": "BUTTON_query" + r,
                value: "Buscar"
            }));
        }, F.createForm = function(e, t, n) {
            var r = e.model.attributes, i = $("<form>", {
                "class": e.name
            }), s = $("<div>");
            F.cleanForm(i), F.appendTitle(i, e.title), F.appendSelectionField(i), _.each(e.fields, function(t, n) {
                var i = null, o, u = "", a = " ", f, l, c = null;
                t.placeholder !== undefined ? c = t.placeholder : t.label !== undefined ? c = t.label : t.label === undefined && (c = t), o = t.type == "select" || t.type == "selectmultiple" || t.type == "select_yn";
                if (t.force_label || t.type == "select_yn") i = "<label ", t.type === "checkbox" && (i += 'class="for_checkbox" '), i += 'for="' + n + '">' + t.label + "</label>";
                t.attrs !== undefined && _.each(t.attrs, function(e, t) {
                    a += t + '="' + e + '" ';
                }), a += 'placeholder="' + c + '" ', r[n] && r[n] !== null && (u = r[n]), t.value !== undefined && (u = t.value);
                switch (t.type) {
                  case "hidden":
                    f = $('<input type="hidden" name="' + n + '" value="' + u + '"' + a + "/>");
                    break;
                  case "select":
                    f = $('<select data-placeholder="Seleccione ' + c + '..." name="' + n + '"' + a + ' class="chzn-select" style="display:none; position:relative; width:90%;">'), $(f).append("<option value></option>"), _.each(e.relations[F.withoutId(n) + "s"], function(e) {
                        $(f).append('<option value="' + e.id + '">' + e.name + "</option>");
                    });
                    break;
                  case "selectmultiple":
                    f = $('<select data-placeh 91%;">'), $(f).append("<option value></option>"), _.each(e.relations[F.withoutId(n) + "s"], function(e) {
                        $(f).append('<option value="' + e.id + '">' + e.name + "</option>");
                    });
                    break;
                  case "select_yn":
                    f = $('<select data-placeholder="¿' + c + '?..." name="' + n + '"' + a + ' class="chzn-select" style="display:none; position:relative; width:89%;">');
                    var h, p;
                    t.default_value == "y" ? (h = ' selected="selected"', p = null) : (h = null, p = ' selected="selected"'), $(f).append("<option value></option>"), $(f).append('<option value="1"' + h + ">Sí</option>" + '<option value="0"' + p + ">No</option>");
                    break;
                  case "textarea":
                    f = $('<textarea name="' + n + '"' + a + ">" + u + "</textarea>");
                    break;
                  case "password":
                    f = $('<input type="password" name="' + n + '" value="' + u + '"' + a + "/>");
                    break;
                  case "datetimepicker":
                    f = $('<input type="text" name="' + n + '" value="' + u + '"' + a + "/>"), $(f).datetimepicker(t.options || {});
                    break;
                  case "datepicker":
                    f = $('<input type="text" name="' + n + '" value="' + u + '"' + a + "/>"), $(f).datepicker(t.options || {});
                    break;
                  case "timepicker":
                    f = $('<input type="text" name="' + n + '" value="' + u + '"' + a + "/>"), $(f).timepicker(t.options || {});
                    break;
                  case "checkbox":
                    f = $('<input type="checkbox" name="' + n + '" value="' + u + '"' + a + "/>");
                    break;
                  default:
                    f = $('<input type="text" name="' + n + '" value="' + u + '"' + a + "/>");
                }
                l = $("<span>", {
                    "class": e.name + "_" + n
                }), $(l).append(i).append(f), $(s).append(l), t.required && t.required === !0 && $(n).attr("required", !0);
                if (t.check !== undefined) {
                    var d = null, v = null;
                    switch (t.check) {
                      case "alpha":
                        v = "[a-zA-Z]+";
                        break;
                      case "numeric":
                        v = "-?d+(.d{0,})?";
                        break;
                      case "integer":
                        v = "[0-9]+";
                        break;
                      case "date":
                        d = "date";
                        break;
                      case "email":
                        d = "email";
                        break;
                      case "url":
                        d = "url";
                        break;
                      case "cuit":
                        v = "[0-9]{2}-[0-9]{8}-[0-9]{1}";
                        break;
                      default:
                    }
                    d !== null && $(n).attr("type", d), v !== null && $(n).attr("pattern", v);
                } else t.type === "select";
                t.callback && t.callback(s);
            }), $(i).append(s), F.appendFormButtons(e, i), t ? $(t).append(i) : $(e.el).append(i), F.renderAllChosen(), n && n(i);
        }, F.appendInfocardTitle = function(e) {
            $(e).append('<h3 class="underlined">' + title + "</h3>");
        }, F.getInfoCardFields = function(e) {
            return $(e).find("span");
        }, F.cleanInfocard = function(e) {
            F.getInfoCardFields(e).text("");
        }, F.assignValuesToInfoCard = function(e, t, n) {
            var r = F.getInfoCardFields(e);
            _.each(r, function(e, n) {
                $(e).text(t[$(e).attr("name")]);
            }), n && n(e, t);
        }, F.createInfoCard = function(e, t, n) {
            var r = e.model.attributes, i = $("<div>", {
                "class": "infocard " + e.name
            });
            F.cleanInfocard(i), F.appendTitle(i, e.title), F.appendSelectionField(i), _.each(e.fieldnames, function(t, n) {
                r[n] !== undefined && $(i).append('<p><label for="' + n + '">' + e.fieldnames[n] + "</label>: " + '<span name="' + n + '">' + (r[n] !== null ? r[n] : "") + "</span>" + "</p>");
            }), t ? $(t).append(i) : $("#" + e.name + "_right").append(i), n && n(i);
        }, F.createDataFeed = function(e, t, n) {
            $("#" + e.name + "_right").append($('<div class="feedtitle">' + t + "</div>")).append($("<div>", {
                "class": "feed datafeed_" + e.name
            }));
            var r = function() {
                e.data.fetch({
                    success: function(t, n) {
                        $(".datafeed_" + e.name).empty(), n.length ? ($(".datafeed_" + e.name).removeClass("no_news_to_report"), _.each(n, function(t, n) {
                            $(".datafeed_" + e.name).append("<h3>" + t.name + "</h3>" + "<p>" + t.description + "</h3>");
                        })) : ($(".datafeed_" + e.name).addClass("no_news_to_report"), $(".datafeed_" + e.name).append("Nada que reportar..."));
                    }
                });
            };
            r(), window.setInterval(function() {
                r();
            }, 5e3), n && n(e);
        };
    }), 
    $(document).on('click', '#head a:not(a#logout_button, a#scheduler)', function(){
        location.reload();
    })
    $(document).on('click', '.blockUI .BUTTON_cancel, .blockOverlay', function(){
        $('.blockUI').remove()
    }),
    e.define("/widgets/Alert.js", function(e, t, n, r, i, s) {
        C.Widget.Alert = {
            initialize: function() {
                $("#head #tabs").empty().append('<a href="/#/ini/alerts">Alertas de O/T</a><a href="/#/ini/alerts_tasks">Alertas de Tareas</a>'), $("#left .inner").empty().append('<div id="alert_left"></div>'), $("#right .inner").empty().append('<div id="alert_right"></div>');
            }
        };
    }), e.define("/widgets/Client.js", function(e, t, n, r, i, s) {
        C.Widget.Client = {
            initialize: function() {
                $("#head #tabs").empty().append('<a href="/#/clients/authorizations">Autorizaciones</a><a href="/#/clients/authorizationshistory">Historial de Autorizaciones</a><a href="/#/clients/payroll">Nómina</a>'), $("#left .inner").empty().append('<div id="client_left"></div><style>#tabs {}#tabs a {  border-bottom: none;}.ui-widget-header {  background: #cebdde url(images/bg_fallback.png) 0 0 repeat-x; /* Old browsers */    background: -moz-linear-gradient(top, #cebdde 0%, #cebdde 100%); /* FF3.6+ */    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#cebdde), color-stop(100%,#cebdde)); /* Chrome,Safari4+ */    background: -webkit-linear-gradient(top, #cebdde 0%,#cebdde 100%); /* Chrome10+,Safari5.1+ */    background: -o-linear-gradient(top, #cebdde 0%,#cebdde 100%); /* Opera11.10+ */    background: -ms-linear-gradient(top, #cebdde 0%,#cebdde 100%); /* IE10+ */    background: linear-gradient(top, #cebdde 0%,#cebdde 100%); /* W3C */}.ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default {   background: #cebdde url(images/bg_fallback.png) 0 0 repeat-x; /* Old browsers */    background: -moz-linear-gradient(top, #cebdde 0%, #cebdde 100%); /* FF3.6+ */    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#cebdde), color-stop(100%,#cebdde)); /* Chrome,Safari4+ */    background: -webkit-linear-gradient(top, #cebdde 0%,#cebdde 100%); /* Chrome10+,Safari5.1+ */    background: -o-linear-gradient(top, #cebdde 0%,#cebdde 100%); /* Opera11.10+ */    background: -ms-linear-gradient(top, #cebdde 0%,#cebdde 100%); /* IE10+ */    background: linear-gradient(top, #cebdde 0%,#cebdde 100%); /* W3C */  -webkit-box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;  -moz-box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;  box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;}#foot { border-top: 1px solid #cebdde;}</style>'), $("#right .inner").empty().append('<div id="client_right"></div>');
            }
        };
    }), e.define("/widgets/Clients.js", function(e, t, n, r, i, s) {
        C.Widget.Clients = {
            initialize: function() {
                $("#head #tabs").empty(), $("#left .inner").empty().append('<div id="clients_left"></div><style>table.dataTable tr.selected_row td {background-color: #c2dcde !important;font-weight: normal !important;color: black !important;}</style>'), $("#right .inner").empty().append('<div id="clients_right"></div>'), $("#left").css({
                    width: "90%",
                    padding: "25px 5%",
                    textAlign: "center"
                }), $("#right").css({
                    width: "0"
                });
            }
        };
    }), e.define("/widgets/CRUD.js", function(e, t, n, r, i, s) {
        C.Widget.CRUD = {
            initialize: function(e) {
                $("#head #tabs").empty().append('<a href="/#/crud/person">Personas</a><a href="/#/crud/user">Usuarios</a><a href="/#/crud/intervention">Intervenciones</a><a href="/#/crud/delay">Demoras</a><a href="/#/crud/task">Tareas</a><a href="/#/crud/materialcategory">Categ. de Materiales</a><a href="/#/crud/equipment">Equipos</a>'), C.Session.doIfSysadmin(function(e) {
                    $("#head #tabs").append('<a href="/#/crud/errorreport">Reportes de errores</a>');
                }), $("#left .inner").empty().append('<div id="' + (e || "crud") + '_left">' + "</div>"), $("#right .inner").empty().append('<div id="' + (e || "crud") + '_right">' + "</div>");
            }
        };
    }), e.define("/widgets/Material.js", function(e, t, n, r, i, s) {
        C.Widget.Material = {
            initialize: function() {
                $("#head #tabs").empty().append('<a href="/#/materials/orders">Pedidos</a>'), C.Session.isVigilance() || $("#head #tabs").append(/*<a href="/#/materials/stock">Stock</a>*/'<a href="/#/materials/history">Historial</a>'), $("#left .inner").empty().append('<div id="material_left"></div><style>#tabs {}#tabs a {  border-bottom: none;}.ui-widget-header {  background: #cfe7d2 url(images/bg_fallback.png) 0 0 repeat-x; /* Old browsers */    background: -moz-linear-gradient(top, #cfe7d2 0%, #cfe7d2 100%); /* FF3.6+ */    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#cfe7d2), color-stop(100%,#cfe7d2)); /* Chrome,Safari4+ */    background: -webkit-linear-gradient(top, #cfe7d2 0%,#cfe7d2 100%); /* Chrome10+,Safari5.1+ */    background: -o-linear-gradient(top, #cfe7d2 0%,#cfe7d2 100%); /* Opera11.10+ */    background: -ms-linear-gradient(top, #cfe7d2 0%,#cfe7d2 100%); /* IE10+ */    background: linear-gradient(top, #cfe7d2 0%,#cfe7d2 100%); /* W3C */}.ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default {   background: #cfe7d2 url(images/bg_fallback.png) 0 0 repeat-x; /* Old browsers */    background: -moz-linear-gradient(top, #cfe7d2 0%, #cfe7d2 100%); /* FF3.6+ */    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#cfe7d2), color-stop(100%,#cfe7d2)); /* Chrome,Safari4+ */    background: -webkit-linear-gradient(top, #cfe7d2 0%,#cfe7d2 100%); /* Chrome10+,Safari5.1+ */    background: -o-linear-gradient(top, #cfe7d2 0%,#cfe7d2 100%); /* Opera11.10+ */    background: -ms-linear-gradient(top, #cfe7d2 0%,#cfe7d2 100%); /* IE10+ */    background: linear-gradient(top, #cfe7d2 0%,#cfe7d2 100%); /* W3C */  -webkit-box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;  -moz-box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;  box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;}#foot { border-top: 1px solid #cfe7d2;}</style>'), $("#right .inner").empty().append('<div id="material_right"style=" overflow:auto;"></div>');
            }
        };
    }), e.define("/widgets/News.js", function(e, t, n, r, i, s) {
        C.Widget.News = {
            initialize: function() {
                $("#head #tabs").empty().append('<a href="/#/ini/alerts">Alertas</a>'), $("#left .inner").empty().append('<div id="news_left"></div>'), $("#right .inner").empty().append('<div id="news_right"></div>');
            }
        };
    }), e.define("/widgets/Ot.js", function(e, t, n, r, i, s) {
        C.Widget.Ot = {
            initialize: function(e) {
                C.Session.roleID() != 1 ? $("#head #tabs").empty().append('<a href="/#/ots/audit">Seguimiento</a>') : $("#head #tabs").empty().append('<a href="/#/ots/admin">Administración</a>'), C.Session.roleID() >= 3 && $("#head #tabs").append('<a href="/#/ots/admin">Administración</a><a href="/#/ots/plans">Planes de Tareas</a><a href="/#/ots/history">Historial</a>'), $("#left .inner").empty().append('<div id="' + (e || "ot") + '_left">' + "</div>" + "<style>" + "#tabs {" + "}" + "#tabs a {" + "  border-bottom: none;" + "}" + ".ui-widget-header {" + "  background: #d9e1ee url(images/bg_fallback.png) 0 0 repeat-x; /* Old browsers */" + "    background: -moz-linear-gradient(top, #d9e1ee 0%, #d9e1ee 100%); /* FF3.6+ */" + "    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#d9e1ee), color-stop(100%,#d9e1ee)); /* Chrome,Safari4+ */" + "    background: -webkit-linear-gradient(top, #d9e1ee 0%,#d9e1ee 100%); /* Chrome10+,Safari5.1+ */" + "    background: -o-linear-gradient(top, #d9e1ee 0%,#d9e1ee 100%); /* Opera11.10+ */" + "    background: -ms-linear-gradient(top, #d9e1ee 0%,#d9e1ee 100%); /* IE10+ */" + "    background: linear-gradient(top, #d9e1ee 0%,#d9e1ee 100%); /* W3C */" + "}" + ".ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default { " + "  background: #d9e1ee url(images/bg_fallback.png) 0 0 repeat-x; /* Old browsers */" + "    background: -moz-linear-gradient(top, #d9e1ee 0%, #d9e1ee 100%); /* FF3.6+ */" + "    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#d9e1ee), color-stop(100%,#d9e1ee)); /* Chrome,Safari4+ */" + "    background: -webkit-linear-gradient(top, #d9e1ee 0%,#d9e1ee 100%); /* Chrome10+,Safari5.1+ */" + "    background: -o-linear-gradient(top, #d9e1ee 0%,#d9e1ee 100%); /* Opera11.10+ */" + "    background: -ms-linear-gradient(top, #d9e1ee 0%,#d9e1ee 100%); /* IE10+ */" + "    background: linear-gradient(top, #d9e1ee 0%,#d9e1ee 100%); /* W3C */" + "  -webkit-box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;" + "  -moz-box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;" + "  box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;" + "}" + "#foot {" + " border-top: 1px solid #d9e1ee;" + "}" + "</style>"), $("#right .inner").empty().append('<div id="' + (e || "ot") + '_right">' + "</div>");
            }
        };
    }), e.define("/widgets/Personnel.js", function(e, t, n, r, i, s) {
        C.Widget.Personnel = {
            initialize: function(e) {
                $("#head #tabs").empty().append('<a href="/#/personnel/inouts">Entradas/Salidas</a>'), C.Session.doIfInRolesList([ 3, 4, 5, 7 ], function() {
                    $("#head #tabs").append('<a href="/#/personnel/history">Historial</a><a href="/#/personnel/payroll">Nómina</a>');
                }, !0), $("#left .inner").empty().append('<div id="' + (e || "personnel") + '_left">' + "</div>" + "<style>" + "#tabs {" + "}" + "#tabs a {" + "  border-bottom: none;" + "}" + ".ui-widget-header {" + "  background: #ffddaa url(images/bg_fallback.png) 0 0 repeat-x; /* Old browsers */" + "    background: -moz-linear-gradient(top, #ffddaa 0%, #ffddaa 100%); /* FF3.6+ */" + "    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ffddaa), color-stop(100%,#ffddaa)); /* Chrome,Safari4+ */" + "    background: -webkit-linear-gradient(top, #ffddaa 0%,#ffddaa 100%); /* Chrome10+,Safari5.1+ */" + "    background: -o-linear-gradient(top, #ffddaa 0%,#ffddaa 100%); /* Opera11.10+ */" + "    background: -ms-linear-gradient(top, #ffddaa 0%,#ffddaa 100%); /* IE10+ */" + "    background: linear-gradient(top, #ffddaa 0%,#ffddaa 100%); /* W3C */" + "}" + ".ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default { " + "  background: #ffddaa url(images/bg_fallback.png) 0 0 repeat-x; /* Old browsers */" + "    background: -moz-linear-gradient(top, #ffddaa 0%, #ffddaa 100%); /* FF3.6+ */" + "    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ffddaa), color-stop(100%,#ffddaa)); /* Chrome,Safari4+ */" + "    background: -webkit-linear-gradient(top, #ffddaa 0%,#ffddaa 100%); /* Chrome10+,Safari5.1+ */" + "    background: -o-linear-gradient(top, #ffddaa 0%,#ffddaa 100%); /* Opera11.10+ */" + "    background: -ms-linear-gradient(top, #ffddaa 0%,#ffddaa 100%); /* IE10+ */" + "    background: linear-gradient(top, #ffddaa 0%,#ffddaa 100%); /* W3C */" + "  -webkit-box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;" + "  -moz-box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;" + "  box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset;" + "}" + "#foot {" + " border-top: 1px solid #ffddaa;" + "}" + "</style>"), $("#right .inner").empty().append('<div id="' + (e || "personnel") + '_right">' + "</div>");
            }
        };
    }), e.define("/widgets/Profile.js", function(e, t, n, r, i, s) {
        C.Widget.Profile = {
            initialize: function() {
                $("#head #tabs").empty().append('<a href="/#/options/profile">Perfil</a>'), $("#left .inner").empty().append('<div id="profile_left"></div>'), $("#right .inner").empty().append('<div id="profile_right"></div>');
            }
        };
    }), e.define("/widgets/Query.js", function(e, t, n, r, i, s) {
        C.Widget.Query = {
            initialize: function() {
                $("#head #tabs").empty().append('<a href="/#/queries/general">Consultas</a>'), $("#left .inner").empty().append('<div id="query_left"></div>'), $("#right .inner").empty().append('<div id="query_right"></div>');
            }
        };
    }), e.define("/widgets/Reports.js", function(e, t, n, r, i, s) {
        C.Widget.Report = {
            initialize: function() {
                $("#head #tabs").empty().append('<a href="/#/reports/ot">Ordenes de trabajo</a>'), $("#left .inner").empty().append('<div id="otReport_left"></div>'), $("#right .inner").empty().append('<div id="otReporteport_right"></div>');
            }
        };
    }), e.define("/models/Alert.js", function(e, t, n, r, i, s) {
        C.Model.Alert = Backbone.Model.extend({
            urlRoot: "/alert",
            defaults: function() {
                return {
                    number: null,
                    equipment: null,
                    client_id: null,
                    client: null,
                    delivery: null,
                    fontWeight: null,
                    color: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.Alerts = Backbone.Collection.extend({
            model: C.Model.Alert,
            url: "/alert",
            initialize: function(e, t) {}
        });
    }), e.define("/models/AlertTask.js", function(e, t, n, r, i, s) {
        C.Model.AlertTask = Backbone.Model.extend({
            urlRoot: "/alerttask",
            defaults: function() {
                return {
                    number: null,
                    name: null,
                    description: null,
                    equipment: null,
                    client_id: null,
                    client: null,
                    due_date: null,
                    fontWeight: null,
                    color: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.AlertTasks = Backbone.Collection.extend({
            model: C.Model.AlertTask,
            url: "/alerttask",
            initialize: function(e, t) {}
        });
    }), e.define("/models/Authorization.js", function(e, t, n, r, i, s) {
        C.Model.Authorization = Backbone.Model.extend({
            urlRoot: "/authorization",
            defaults: function() {
                return {
                    req_info_sent_date: null,
                    ot_number: null,
                    ot_id: null,
                    client: null,
                    client_id: null,
                    otstate: null,
                    otstate_id: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.Authorizations = Backbone.Collection.extend({
            model: C.Model.Authorization,
            url: "/authorization",
            initialize: function(e, t) {}
        });
    }), e.define("/models/AuthorizationHistory.js", function(e, t, n, r, i, s) {
        C.Model.AuthorizationHistory = Backbone.Model.extend({
            urlRoot: "/authorizationhistory",
            defaults: function() {
                return {
                    req_info_sent_date: null,
                    ot_number: null,
                    ot_id: null,
                    client: null,
                    client_id: null,
                    otstate: null,
                    otstate_id: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.AuthorizationHistorys = Backbone.Collection.extend({
            model: C.Model.AuthorizationHistory,
            url: "/authorizationhistory",
            initialize: function(e, t) {}
        });
    }), e.define("/models/Client.js", function(e, t, n, r, i, s) {
        C.Model.Client = Backbone.Model.extend({
            urlRoot: "/client",
            defaults: function() {
                return {
                    name: null,
                    tag: null,
                    cuit: null,
                    iva_id: null,
                    address: null,
                    addressnumber: null,
                    floor: null,
                    apartment: null,
                    city_id: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.Clients = Backbone.Collection.extend({
            model: C.Model.Client,
            url: "/client",
            initialize: function(e, t) {}
        });
    }), e.define("/models/ClientsOt.js", function(e, t, n, r, i, s) {
        C.Model.ClientsOt = Backbone.Model.extend({
            urlRoot: "/clientots",
            defaults: function() {
                return {
                    number: null,
                    equipment_id: null,
                    equipment: null,
                    created_at: null,
                    delivery: null,
                    workshop_suggestion: null,
                    client_suggestion: null,
                    client_id: null,
                    client: null,
                    intervention: null,
                    intervention_id: null,
                    plan: null,
                    plan_id: null,
                    reworked_number: null,
                    status: null,
                    otstatus_id: null,
                    actions: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.ClientsOts = Backbone.Collection.extend({
            model: C.Model.Ot,
            url: "/clientots",
            initialize: function(e, t) {}
        });
    }), e.define("/models/ClientsNotification.js", function(e, t, n, r, i, s) {
        C.Model.ClientsNotification = Backbone.Model.extend({
            urlRoot: "/clientnotification",
            defaults: function() {
                return {
                    name: null,
                    description: null,
                    related_model: null,
                    related_model_id: null,
                    ot_number: null,
                    client_id: null,
                    created_at: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.ClientsNotifications = Backbone.Collection.extend({
            model: C.Model.ClientsNotification,
            url: "/clientnotification",
            initialize: function(e, t) {}
        });
    }), e.define("/models/Employee.js", function(e, t, n, r, i, s) {
        C.Model.Employee = Backbone.Model.extend({
            urlRoot: "/employee",
            defaults: function() {
                return {
                    payroll_number: null,
                    person_id: null,
                    area_id: null,
                    intern: null,
                    schedule: null,
                    schedule_ini_id: null,
                    schedule_end_id: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.Employees = Backbone.Collection.extend({
            model: C.Model.Employee,
            url: "/employee",
            initialize: function(e, t) {}
        });
    }), e.define("/models/ErrorReport.js", function(e, t, n, r, i, s) {
        C.Model.ErrorReport = Backbone.Model.extend({
            urlRoot: "/errorreport",
            defaults: function() {
                return {
                    description: null,
                    suggestion: null,
                    user: null,
                    created_at: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.ErrorReports = Backbone.Collection.extend({
            model: C.Model.ErrorReport,
            url: "/errorreport",
            initialize: function(e, t) {}
        });
    }), e.define("/models/Inout.js", function(e, t, n, r, i, s) {
        C.Model.Inout = Backbone.Model.extend({
            urlRoot: "/inout",
            defaults: function() {
                return {
                    employee: null,
                    employee_id: null,
                    authorized: null,
                    out: null,
                    comeback: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.Inouts = Backbone.Collection.extend({
            model: C.Model.Inout,
            url: "/inout",
            initialize: function(e, t) {}
        });
    }), e.define("/models/InoutHistory.js", function(e, t, n, r, i, s) {
        C.Model.InoutHistory = Backbone.Model.extend({
            urlRoot: "/inouthistory",
            defaults: function() {
                return {
                    employee: null,
                    employee_id: null,
                    authorized: null,
                    out: null,
                    comeback: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.InoutHistorys = Backbone.Collection.extend({
            model: C.Model.InoutHistory,
            url: "/inouthistory",
            initialize: function(e, t) {}
        });
    }), e.define("/models/Intervention.js", function(e, t, n, r, i, s) {
        C.Model.Intervention = Backbone.Model.extend({
            urlRoot: "/intervention",
            defaults: function() {
                return {
                    name: null,
                    description: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.Interventions = Backbone.Collection.extend({
            model: C.Model.Intervention,
            url: "/intervention",
            initialize: function(e, t) {}
        });
    }), e.define("/models/Material.js", function(e, t, n, r, i, s) {
        C.Model.Material = Backbone.Model.extend({
            urlRoot: "/material",
            defaults: function() {
                return {
                    name: null,
                    stock: null,
                    unit_id: null,
                    unit: null,
                    materialcategory_id: null,
                    materialcategory: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.Materials = Backbone.Collection.extend({
            model: C.Model.Material,
            url: "/material",
            initialize: function(e, t) {}
        });
    }), e.define("/models/MaterialCategory.js", function(e, t, n, r, i, s) {
        C.Model.MaterialCategory = Backbone.Model.extend({
            urlRoot: "/materialcategory",
            defaults: function() {
                return {
                    name: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.MaterialCategorys = Backbone.Collection.extend({
            model: C.Model.MaterialCategory,
            url: "/materialcategory",
            initialize: function(e, t) {}
        });
    }), e.define("/models/MaterialOrder.js", function(e, t, n, r, i, s) {
        C.Model.MaterialOrder = Backbone.Model.extend({
            urlRoot: "/materialorder",
            defaults: function() {
                return {
                    ot_id: null,
                    ot_number: null,
                    tag_id: null,
                    tag: null,
                    ottask_id: null,
                    ottask: null,
                    provider: null,
                    date: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.MaterialOrders = Backbone.Collection.extend({
            model: C.Model.MaterialOrder,
            url: "/materialorder",
            initialize: function(e, t) {}
        });
    }), e.define("/models/MaterialHistory.js", function(e, t, n, r, i, s) {
        C.Model.MaterialHistory = Backbone.Model.extend({
            urlRoot: "/materialhistory",
            defaults: function() {
                return {
                    name: null,
                    stock: null,
                    unit_id: null,
                    unit: null,
                    materialcategory_id: null,
                    materialcategory: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.MaterialHistorys = Backbone.Collection.extend({
            model: C.Model.MaterialHistory,
            url: "/materialhistory",
            initialize: function(e, t) {}
        });
    }), e.define("/models/Module.js", function(e, t, n, r, i, s) {
        C.Model.Module = Backbone.Model.extend({
            urlRoot: "/module",
            defaults: function() {
                return {
                    name: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.Modules = Backbone.Collection.extend({
            model: C.Model.Module,
            url: "/module",
            initialize: function(e, t) {}
        });
    }), e.define("/models/Equipment.js", function(e, t, n, r, i, s) {
        C.Model.Equipment = Backbone.Model.extend({
            urlRoot: "/equipment",
            defaults: function() {
                return {
                    name: null,
                    intervention: null,
                    intervention_id: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.Equipments = Backbone.Collection.extend({
            model: C.Model.Equipment,
            url: "/equipment",
            initialize: function(e, t) {}
        });
    }), e.define("/models/News.js", function(e, t, n, r, i, s) {
        C.Model.News = Backbone.Model.extend({
            urlRoot: "/news",
            defaults: function() {
                return {
                    name: null,
                    description: null,
                    related_model: null,
                    related_model_id: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.Newss = Backbone.Collection.extend({
            model: C.Model.News,
            url: "/news",
            initialize: function(e, t) {}
        });
    }), e.define("/models/Ot.js", function(e, t, n, r, i, s) {
        C.Model.Ot = Backbone.Model.extend({
            urlRoot: "/ot",
            defaults: function() {
                return {
                  id: null,
	                number: null,
	                equipament: null,
	                client: null,
	                delivery: null,
	                reworked_number: null,
	                estado: null,
	                cliente_id: null,
	                plan_id: null,
	                notificarCliente: null,
	                honorarios: null,
	                prioridad: null,
	                coordinador: null,
	                titulo: null,
	                descripcion: null,
	                fechaVencimiento: null,
	                conclusion: null,
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.Ots = Backbone.Collection.extend({
            model: C.Model.Ot,
            url: "/ot",
            initialize: function(e, t) {}
        });
    }), e.define("/models/OtHistory.js", function(e, t, n, r, i, s) {
        C.Model.OtHistory = Backbone.Model.extend({
            urlRoot: "/othistory",
            defaults: function() {
                return {
                  id: null,
	                numero: null,
	                estado: null,
	                cliente_id: null,
	                plan_id: null,
	                notificarCliente: null,
	                honorarios: null,
	                prioridad: null,
	                coordinador: null,
	                titulo: null,
	                descripcion: null,
	                fechaVencimiento: null,
	                conclusion: null,
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.OtHistorys = Backbone.Collection.extend({
            model: C.Model.OtHistory,
            url: "/othistory",
            initialize: function(e, t) {}
        });
    }), e.define("/models/OtTask.js", function(e, t, n, r, i, s) {
        C.Model.OtTask = Backbone.Model.extend({
            defaults: function() {
                return {
                    name: null,
                    description: null,
                    due_date: null,
                    order: null,
                    completed: null,
                    reworked: null,
                    derived_ot: null,
                    ot_id: null,
                    area_id: null,
                    observation: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        });
    }), e.define("/models/Person.js", function(e, t, n, r, i, s) {
        C.Model.Person = Backbone.Model.extend({
            urlRoot: "/person",
            defaults: function() {
                return {
                    firstname: null,
                    lastname: null,
                    name: null,
                    phone: null,
                    email: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.Persons = Backbone.Collection.extend({
            model: C.Model.Person,
            url: "/person",
            initialize: function(e, t) {}
        });
    }), 
//  LISTADO OT
    e.define("/models/OtReport.js", function(e, t, n, r, i, s) {
        C.Model.OtReport = Backbone.Model.extend({
            urlRoot: "/otreport",
            defaults: function() {
                return {
                    firstname: null,
                    lastname: null,
                    name: null,
                    phone: null,
                    email: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.OtReport = Backbone.Collection.extend({
            model: C.Model.OtReport,
            url: "/person",
            initialize: function(e, t) {
            }
        });
    }), 
//  /Listado Ot
    e.define("/models/Plan.js", function(e, t, n, r, i, s) {
        C.Model.Plan = Backbone.Model.extend({
            urlRoot: "/plan",
            defaults: function() {
                return {
                    name: null,
                    description: null,
                    task_id: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.Plans = Backbone.Collection.extend({
            model: C.Model.Plan,
            url: "/plan",
            initialize: function(e, t) {}
        });
    }), e.define("/models/Profile.js", function(e, t, n, r, i, s) {
        C.Model.Profile = Backbone.Model.extend({
            urlRoot: "/profile",
            defaults: function() {
                return {
                    user_id: null,
                    username: null,
                    password1: null,
                    password2: null,
                    role_id: null,
                    employee_id: null,
                    area_id: null,
                    intern: null,
                    person_id: null,
                    firstname: null,
                    lastname: null,
                    phone: null,
                    email: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.Profiles = Backbone.Collection.extend({
            model: C.Model.Profile,
            url: function() {
                return "/profile/" + this.user_id;
            },
            initialize: function(e, t) {
                this.user_id = $("#session_user_id").html(), this.username = $("#session_username").html();
            }
        });
    }), e.define("/models/Query.js", function(e, t, n, r, i, s) {
        C.Model.Query = Backbone.Model.extend({
            urlRoot: "/query",
            defaults: {},
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.Querys = Backbone.Collection.extend({
            model: C.Model.Query,
            url: "/query",
            initialize: function(e, t) {}
        });
    }), e.define("/models/Task.js", function(e, t, n, r, i, s) {
        C.Model.Task = Backbone.Model.extend({
            urlRoot: "/task",
            defaults: function() {
                return {
                    name: null,
                    description: null,
                    area_id: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.Tasks = Backbone.Collection.extend({
            model: C.Model.Task,
            url: "/task",
            initialize: function(e, t) {}
        });
    }), e.define("/models/User.js", function(e, t, n, r, i, s) {
        C.Model.User = Backbone.Model.extend({
            urlRoot: "/user",
            defaults: function() {
                return {
                    username: null,
                    employee: null,
                    employee_id: null,
                    role: null,
                    role_id: null,
                    area: null,
                    area_id: null
                };
            },
            initialize: function() {
                this.bind("error", function(e, t) {
                    F.log(t);
                });
            }
        }), C.Collection.Users = Backbone.Collection.extend({
            model: C.Model.User,
            url: "/user",
            initialize: function(e, t) {}
        });
    }), e.define("/views/alert/Alert.js", function(e, t, n, r, i, s) {
        C.View.Alert = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.alert = new C.Collection.Alerts(null, {
                    view: this
                }), this.alert.fetch({
                    success: function(t, n) {
                        e.alert_table = new C.View.AlertTable({
                            el: $("#alert_left"),
                            collection: t
                        }), e.alert_infocard = new C.View.AlertInfoCard({
                            el: $("#alert_right"),
                            model: e.model,
                            collection: t,
                            alert_table: e.alert_table
                        });
                    }
                });
            }
        });
    }), e.define("/views/alert/AlertTable.js", function(e, t, n, r, i, s) {
        C.View.AlertTable = Backbone.View.extend({
            name: "alert",
            source: "/alert",
            headers: [ "ID", "O/T", "ID Cliente", "Cliente", "Equipo (TAG)", "Fecha de entrega" ],
            attrs: [ "id", "number", "client_id", "client", "equipment", "delivery" ],
            data: null,
            hidden_columns: ['client_id'],
            date_columns: ['delivery'],
            datatableOptions: {
                aoColumns: [ null, null, null, null, null, {
                    sType: "es_date"
                } ],
                aaSorting: [ [ 1, "desc" ] ]
            },
            rowHandler: function(e, t) {
                $(e).children().css({
                    fontWeight: t.fontWeight,
                    color: t.color
                });
            },
            initialize: function() {
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.assignValuesToInfoCard($(".alert_infocard"), e, function(e, t) {
                        $(e).children("br, a").remove(), $(e).append('<br /><a href="/#/ots/audit/Ot_' + t.number + '">Auditar O/T</a>');
                    });
                });
            },
            events: {
                "click .alert_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            }
        });
    }), e.define("/views/alert/AlertInfoCard.js", function(e, t, n, r, i, s) {
        C.View.AlertInfoCard = Backbone.View.extend({
            name: "alert_infocard",
            title: "Detalle de la O/T pendiente",
            fieldnames: {
                number: "O/T Nº",
                equipment: "Equipo (TAG)",
                client: "Cliente",
                delivery: "Fecha de entrega"
            },
            initialize: function() {
                var e = this;
                F.createInfoCard(this, $("#alert_right"), function(e) {
                    new C.View.News({
                        model: new C.Model.News
                    });
                });
            },
            getTable: function() {
                return this.options.alert_table;
            },
            getDataTable: function() {
                return this.getTable().datatable;
            },
            getSelectionID: function() {
                return parseInt($(".selection_id").val());
            },
            getSelectionRow: function() {
                return this.getTable().selected_row;
            }
        });
    }), e.define("/views/alert/AlertTasks.js", function(e, t, n, r, i, s) {
        C.View.AlertTasks = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.alert = new C.Collection.AlertTasks(null, {
                    view: this
                }), this.alert.fetch({
                    success: function(t, n) {
                        e.alerttasks_table = new C.View.AlertTasksTable({
                            el: $("#alert_left"),
                            collection: t
                        }), e.alerttasks_infocard = new C.View.AlertTasksInfoCard({
                            el: $("#alert_right"),
                            model: e.model,
                            collection: t,
                            alerttasks_table: e.alerttasks_table
                        });
                    }
                });
            }
        });
    }), e.define("/views/alert/AlertTasksTable.js", function(e, t, n, r, i, s) {
        C.View.AlertTasksTable = Backbone.View.extend({
            name: "alert",
            source: "/alerttask",
            headers: [ "ID", "O/T", "Nombre", "Descripción", "Cliente", "Equipo (TAG)", "Fecha de vencimiento" ],
            attrs: [ "id", "number", "name", "description", "client", "equipment", "due_date" ],
            data: null,
            date_columns: ['due_date'],
            datatableOptions: {
                aoColumns: [ null, null, null, null, null, null, {
                    sType: "es_date"
                } ],
                aaSorting: [ [ 1, "desc" ] ]
            },
            rowHandler: function(e, t) {
                $(e).children().css({
                    fontWeight: t.fontWeight,
                    color: t.color
                });
            },
            initialize: function() {
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.assignValuesToInfoCard($(".alerttasks_infocard"), e, function(e, t) {
                        $(e).children("br, a").remove(), $(e).append('<br /><a href="/#/ots/audit/Ot_' + t.number + '">Auditar O/T</a>');
                    });
                });
            },
            events: {
                "click .alert_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            }
        });
    }), e.define("/views/alert/AlertTasksInfoCard.js", function(e, t, n, r, i, s) {
        C.View.AlertTasksInfoCard = Backbone.View.extend({
            name: "alerttasks_infocard",
            title: "Detalle de la Tarea pendiente",
            fieldnames: {
                number: "O/T Nº",
                name: "Nombre",
                equipment: "Equipo (TAG)",
                client: "Cliente",
                due_date: "Fecha de vencimiento"
            },
            initialize: function() {
                F.createInfoCard(this, $("#alert_right"));
            },
            getTable: function() {
                return this.options.alerttasks_table;
            },
            getDataTable: function() {
                return this.getTable().datatable;
            },
            getSelectionID: function() {
                return parseInt($(".selection_id").val());
            },
            getSelectionRow: function() {
                return this.getTable().selected_row;
            }
        });
    }), e.define("/views/client/ClientAuthorization.js", function(e, t, n, r, i, s) {
        C.View.ClientAuthorization = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.authorizations = new C.Collection.Authorizations(null, {
                    view: this
                }), this.authorizations.fetch({
                    success: function(t, n) {
                        e.client_table = new C.View.ClientAuthorizationTable({
                            el: $("#client_left"),
                            collection: t
                        }), e.client_form = new C.View.ClientAuthorizationInfoCard({
                            el: $("#client_right"),
                            model: e.model,
                            collection: t,
                            client_table: e.client_table
                        }), e.client_options = new C.View.ClientAuthorizationOptions({
                            el: $("#left .toolbar")[0],
                            client_table: e.client_table,
                            client_form: e.client_form
                        });
                    }
                });
            }
        });
    }), e.define("/views/client/ClientAuthorizationTable.js", function(e, t, n, r, i, s) {
        C.View.ClientAuthorizationTable = Backbone.View.extend({
            name: "client",
            source: "/authorization",
            headers: [ "ID", "O/T ID", "O/T", "ID Cliente", "Cliente", "Envío de Informe de Requerimientos", "ID Estado", "Estado" ],
            attrs: [ "id", "ot_id", "ot_number", "client_id", "client", "req_info_sent_date", "otstate_id", "otstate" ],
            data: null,
            hidden_columns: ['ot_id', 'client_id', 'otstate_id'],
            datatableOptions: {
                aoColumns: [ null, null, null, null, null, {
                    sType: "es_date"
                }, null, null ],
                aaSorting: [ [ 2, "desc" ] ]
            },
            rowHandler: function(e, t) {
                var n = this, r = $(e).find("td")[7];
                switch (t.otstate_id) {
                  case 1:
                    $(r).parent().css({
                        fontWeight: "bold",
                        color: "green"
                    });
                    break;
                  case 2:
                    $(r).parent().css({
                        fontWeight: "bold",
                        color: "#e9823f"
                    });
                    break;
                  case 3:
                    $(r).parent().css({
                        fontWeight: "bold",
                        color: "red"
                    });
                    break;
                  case 4:
                    $(r).parent().css({
                        fontWeight: "bold",
                        color: "black"
                    });
                    break;
                  default:
                }
                if (t.otstate_id === 3) {
                    var i = $("<span>", {
                        "class": "resend_email_link"
                    });
                    $(i).text("Reenviar e-mail").on("click", function() {
                        F.msgConfirm("¿Realmente desea volver a notificar al Cliente?", function() {
                            var t = $($(e).find("td")[0]).text();
                            t, function(e) {
                                $(i).html("Notificado. ¿Reenviar nuevamente?"), F.msgOK("Se ha vuelto a notificar al Cliente sobre la autorización pendiente.");
                            };
                        });
                    }), $(r).append(i);
                }
            },
            initialize: function() {
                var e = this;
                this.data = this.options.collection, F.createDataTable(this, function(t) {
                    F.assignValuesToInfoCard($(".client_authorization_infocard"), t, function(t, n) {
                        $(t).children("br, a, input:button").remove(), $(t).append('<br /><input type="button" class="BUTTON_report" value="Informe de Requerimientos" /><a class="righty" style="padding:0.75em;" href="/#/ots/audit/Ot_' + n.ot_number + '">Auditar O/T</a>'), $(".client_authorization_infocard .BUTTON_report").on("click", function() {
                            e.showRequirementsReport(n), $(".BUTTON_report").attr("disabled", !0);
                        });
                    });
                });
                $(document).on('click', '.client_table tbody tr', function(evento){
                    e.selectRow(evento);
                })
            },
            events: {
                "click .client_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
                var t = this, n = $($(this.selected_row).find("td")[0]).text();
                console.log(n)
                n.length && $.ajax({
                    url: "/authorization/setSessionOtId/" + n,
                    success: function(e) {
                        e.result === !0 && (t.report_tasks = e.report_tasks, t.report_photos = e.report_photos), $(".client_authorization_infocard .selection_id").val(n), $("#client_left .ot_authorize").attr("disabled", !1);
                    }
                });
            },
            cleanModals: function(e) {
                $.unblockUI(), window.setTimeout(function() {
                    $("#requirements_report_window").remove(), $(".BUTTON_report").attr("disabled", !1), e && e();
                }, 1e3);
            },
            showRequirementsReport: function(e) {
                var t = this;
                $("#requirements_report_window").length || this.requirementsReportTemplate(e, function() {
                    $(document).on("keyup", function(e) {
                        e.which == 27 && t.cancelShowRequirementsReport();
                    }), $("#requirements_report_window .BUTTON_cancel").on("click", function() {
                        t.cancelShowRequirementsReport();
                    }), $("#requirements_report_window .BUTTON_save").on("click", function() {
                        var e = this;
                        $(e).attr("disabled", !0), t.saveRequirementsReport(function() {
                            $(e).attr("disabled", !1), F.msgOK("Observaciones añadidas al Informe");  setTimeout(function(){location.reload()}, 1e3);
                        });
                    }), $(document).on("click", "#requirements_report_window .BUTTON_send", function() {
                        var n = this;
                        t.saveRequirementsReport(function() {
                            $(n).attr("disabled", !0), t.sendRequirementsReport(e.ot_id, function() {
                                t.cleanModals(function() {
                                    F.msgOK("El Informe de Requerimientos fue enviado al cliente");
                                }), $(n).attr("disabled", !1);
                            });
                        });
                    }), $.blockUI({
                        message: $("#requirements_report_window"),
                        css: {
                            top: "7.5%",
                            left: "24%",
                            width: "50%",
                            border: "none",
                            padding: "1%",
                            cursor: "default"
                        }
                    });
                });
            },
            requirementsReportTemplate: function(e, t) {
                var n = this;
                this.getOtTasks(e.ot_id, function(r) {
                    var i = moment().format("DD/MM/YYYY"), s = n.getTasksMarkup(r), o = n.getPhotosUploadMarkup(), u = n.getOtMaterialMarkup(e.ot_id), a = n.getCurrentPhotosMarkup(), f = n.getButtonsMarkup(r);
                    $("body").append('<div id="requirements_report_window" style="display:none; max-height:500px; overflow:auto;"><h3 class="lefty">INFORME DE REQUERIMIENTOS DE TAREAS</h3><h3 class="righty">' + i + "</h3>" + "<br /><br />" + '<h3 class="lefty">O/T Nº: ' + e.ot_number + "</h3>" + "<br /><br />" + '<input type="button" class="button BUTTON_req_info_tasks" value="Tareas" />' + '<input type="button" class="button BUTTON_req_info_material" value="Materiales" />' + '<input type="button" class="button BUTTON_req_info_photos_upload" value="Añadir Fotografías" />' + '<input type="button" class="button BUTTON_req_info_current_photos" value="Fotografías Actuales" />' + "<br /><br /><br />" + '<form name="requirements_report_form" class="req_info_tasks clean_form">' + '<table style="width:100%;">' + s + "</table>" + "</form>" + '<div class="req_info_material" style="display:none;">' + u + "</div>" + '<div class="req_info_photos_upload" style="display:none;">' + o + "</div>" + '<div class="req_info_current_photos" style="display:none;">' + a + "</div>" + "<br /><br />" + f + "</div>"), n.bindInputFiles(), n.bindButtons(), t && t();
                });
            },
            getOtTasks: function(e, t) {
                $.ajax({
                    url: "/ottask/byOt/" + e,
                    success: function(e) {
                        t(e);
                    }
                });
            },
            getOtMaterial: function(e) {
                return $.ajax({
                    async: !1,
                    url: "/material/byOt/" + e,
                    success: function(e) {
                        return e;
                    }
                });
            },
            getOtMaterialMarkup: function(e) {
                var t = "", n = this.getOtMaterial(e).responseText;
                n != "[]" ? console.log("completo") : console.log("vacio");
                if (n != "[]") {
                    for (var r = 0; r < n.length; r++) switch (n[r]) {
                      case "[":
                        t += "";
                        break;
                      case "]":
                        t += "";
                        break;
                      case "{":
                        t += "";
                        break;
                      case "}":
                        t += "";
                        break;
                      default:
                        t += n[r];
                    }
                    var i = t.split('"'), s = "<table><tr><td>Proveedor</td><td>Categoria</td><td>Material</td><td>Cant</td>";
                    console.log(i);
                    for (var o = 0; o < i.length; o++) switch (i[o]) {
                      case "proveedor":
                        s += "</tr><tr><td>";
                        break;
                      case "nombre":
                      case "unidades":
                      case "categoria":
                        s += "</td><td>";
                        break;
                      case ",":
                      case " ":
                      case ":":
                      case ":null":
                      case ":null,":
                        s += "";
                        break;
                      default:
                        s += i[o];
                    }
                    s += "</table>";
                } else s = 'Esta O/T todavía no posee Materiales asociados.<br /><br /><a class="assignTasksPlanLink" href="/#/materials">Asignar Materiales</a>';
                return s;
            },
            getTasksMarkup: function(e) {
                var t = this, n = "", r = {
                    observation: ""
                };
                return e.length ? _.each(e, function(e) {
                    t.report_tasks && _.each(t.report_tasks, function(t) {
                        t.ottask_id == e.id && (r = t);
                    }), n += "<tr>", n += '<td class="req_report_task">' + e.name + "</td>", n += '<td style="border:1px solid #eee;"><textarea class="righty" style="width:100%; height:40px;" name="task_observation_' + e.id + '">' + r.observation + "</textarea></td>", n += "</tr>";
                }) : (n += "Esta O/T todavía no posee tareas ó un Plan de Tareas asociado.", n += "<br /><br />", n += '<a class="assignTasksPlanLink" href="/#/ots/admin">Asignar Plan de Tareas</a>'), n;
            },
            getPhotosUploadMarkup: function() {
                var e = "";
                for (var t = 1; t <= 5; t += 1) e += '<input class="photos_file_' + t + '" type="file" name="photos[]" data-url="authorization/addPhotoToReport">' + '<div class="photos_state_' + t + '"></div>' + "<br /><br />";
                return e;
            },
            getCurrentPhotosMarkup: function() {
                var e = this, t = "";
                return _.each(e.report_photos, function(e) {
                    t += '<img src="/uploads/' + e.path + '" data-id="' + e.id + '" style="width:200px; height:112.5px;" />' + '<div class="remove_photo" data-id="' + e.id + '">Eliminar</div><br />';
                }), t;
            },
            getButtonsMarkup: function(e) {
                var t = '<input type="button" class="lefty BUTTON_cancel" value="Cerrar" />';
                return e.length && (t += '<input type="button" class="righty BUTTON_save" value="Guardar cambios" /><br /><br /><br /><input type="button" class="BUTTON_send" value="ENVIAR AL CLIENTE" />'), t;
            },
            bindInputFiles: function() {
                $(".req_info_photos_upload input:file").bind("fileuploadadd", function(e, t) {
                    var n = e.target.className.charAt(e.target.className.length - 1);
                    $(".photos_state_" + n).html('<img src="/images/loading.gif" />');
                }), $(".req_info_photos_upload input:file").bind("fileuploaddone", function(e, t) {
                    var n = e.target.className.charAt(e.target.className.length - 1);
                    $(".photos_state_" + n).empty().html('<img src="/images/success.png" />');
                }), $(".req_info_photos_upload input:file").bind("fileuploadfail", function(e, t) {
                    var n = e.target.className.charAt(e.target.className.length - 1);
                    $(".photos_state_" + n).empty().html('<img src="/images/failure.png" />');
                }), $(".req_info_photos_upload input:file").fileupload({
                    dataType: "json"
                });
            },
            bindButtons: function() {
                var e = this;
                $(".assignTasksPlanLink").on("click", function() {
                    e.cleanModals();
                }), $(".BUTTON_req_info_tasks").on("click", function() {
                    $(".req_info_photos_upload, .req_info_material, .req_info_current_photos").hide(), $(".req_info_tasks").show();
                }), $(".BUTTON_req_info_material").on("click", function() {
                    $(".req_info_tasks, .req_info_photos_upload, .req_info_current_photos").hide(), $(".req_info_material").show();
                }), $(".BUTTON_req_info_photos_upload").on("click", function() {
                    $(".req_info_tasks, .req_info_material, .req_info_current_photos").hide(), $(".req_info_photos_upload").show();
                }), $(".BUTTON_req_info_current_photos").on("click", function() {
                    $(".req_info_tasks, .req_info_material, .req_info_photos_upload").hide(), $(".req_info_current_photos").show();
                }), $(".req_info_current_photos div.remove_photo").on("click", function() {
                    var e = this, t = $(this).attr("data-id");
                    F.msgConfirm("¿ELIMINAR la fotografía?", function() {
                        $.ajax({
                            url: "/authorization/delPhotoFromReport/" + t,
                            success: function(n) {
                                n.result === !0 && ($(e).remove(), $(".req_info_current_photos img[data-id=" + t + "]").remove());
                                if(!n.result){
                                  F.msgError('No se pudo Eliminar, Recargue y Vuelva a intentarlo')
                                }
                            }
                        });
                    });
                });
            },
            cancelShowRequirementsReport: function() {
                location.reload()
            },
            saveRequirementsReport: function(e) {
                $.ajax({
                    type: "POST",
                    url: "/authorization/saveRequirementsReport",
                    data: $("form[name=requirements_report_form]").serializeObject(),
                    success: function(t) {
                        console.log(t)
                        t.result === !0 && e(t);
                    }
                });
            },
            sendRequirementsReport: function(e, t) {
                $.ajax({
                    url: "/authorization/notify/" + e,
                    success: function(e) {
                        t(e);
                    }
                });
            }
        });
    }), e.define("/views/client/ClientAuthorizationInfoCard.js", function(e, t, n, r, i, s) {
        C.View.ClientAuthorizationInfoCard = Backbone.View.extend({
            name: "client_authorization_infocard",
            title: "Datos de la Autorización",
            fieldnames: {
                ot_number: "O/T Nº",
                req_info_sent_date: "Envío de Informe",
                client: "Cliente",
                otstate: "Estado"
            },
            initialize: function() {
                var e = this;
                F.createInfoCard(e, $("#client_right"));
            }
        });
    }), e.define("/views/client/ClientAuthorizationOptions.js", function(e, t, n, r, i, s) {
        C.View.ClientAuthorizationOptions = Backbone.View.extend({
            initialize: function() {
                this.render();
            },
            render: function() {
                return $(this.el).append(this.template()), this;
            },
            template: function() {
                var e = $("<div>", {
                    "class": "right_options"
                });
                return $(e).append($("<input>", {
                    type: "button",
                    "class": "ot_authorize",
                    value: "Autorizar O/T",
                    disabled: "disabled"
                })), e;
            },
            events: {
                "click #client_left .ot_authorize": "authorizeOt"
            },
            getForm: function() {
                return this.options.client_form;
            },
            getTable: function() {
                return this.options.client_table;
            },
            getSelectedRow: function() {
                return this.options.client_table.selected_row;
            },
            authorizeOt: function() {
                var e = $(".client_table").dataTable(), t = F.getDataTableSelection($(".client_table"))[0], n = e.fnGetData(t)[1];
                F.msgConfirm("¿Está seguro que desea AUTORIZAR esta O/T?", function() {
                    $.ajax({
                        url: "/authorization/confirm/" + n,
                        success: function(e) {
                            $($(t).children()[3]).html("Autorizada");
                        }
                    });
                });
            }
        });
    }), e.define("/views/client/ClientAuthorizationHistory.js", function(e, t, n, r, i, s) {
        C.View.ClientAuthorizationHistory = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.authorizations = new C.Collection.AuthorizationHistorys(null, {
                    view: this
                }), this.authorizations.fetch({
                    success: function(t, n) {
                        e.client_table = new C.View.ClientAuthorizationHistoryTable({
                            el: $("#client_left"),
                            collection: t
                        }), e.client_form = new C.View.ClientAuthorizationHistoryInfoCard({
                            el: $("#client_right"),
                            model: e.model,
                            collection: t,
                            client_table: e.client_table
                        });
                    }
                });
            }
        });
    }), e.define("/views/client/ClientAuthorizationHistoryTable.js", function(e, t, n, r, i, s) {
        C.View.ClientAuthorizationHistoryTable = Backbone.View.extend({
            name: "client",
            source: "/authorizationhistory",
            headers: [ "ID", "O/T ID", "O/T", "ID Cliente", "Cliente", "Envío de Informe de Requerimientos", "ID Estado", "Estado" ],
            attrs: [ "id", "ot_id", "ot_number", "client_id", "client", "req_info_sent_date", "otstate_id", "otstate" ],
            data: null,
            hidden_columns: ['ot_id', 'client_id', 'otstate_id'],
            datatableOptions: {
                aoColumns: [ null, null, null, null, null, {
                    sType: "es_date"
                }, null, null ],
                aaSorting: [ [ 2, "desc" ] ]
            },
            rowHandler: function(e, t) {
                var n = $(e).find("td")[7];
                switch (t.otstate_id) {
                  case 5:
                    $(n).parent().css({
                        fontWeight: "bold",
                        color: "green"
                    });
                    break;
                  case 6:
                    $(n).parent().css({
                        fontWeight: "bold",
                        color: "green"
                    });
                    break;
                  case 7:
                    $(n).parent().css({
                        fontWeight: "bold",
                        color: "black"
                    });
                    break;
                  case 8:
                    $(n).parent().css({
                        fontWeight: "bold",
                        color: "red"
                    });
                    break;
                  default:
                }
            },
            initialize: function() {
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.assignValuesToInfoCard($(".client_authorization_history_infocard"), e);
                });
            },
            events: {
                "click .client_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            }
        });
    }), e.define("/views/client/ClientAuthorizationHistoryInfoCard.js", function(e, t, n, r, i, s) {
        C.View.ClientAuthorizationHistoryInfoCard = Backbone.View.extend({
            name: "client_authorization_history_infocard",
            title: "Datos de la Autorización",
            fieldnames: {
                ot_number: "O/T Nº",
                req_info_sent_date: "Envío de Informe",
                client: "Cliente",
                otstate: "Estado"
            },
            initialize: function() {
                var e = this;
                F.createInfoCard(e, $("#client_right"));
            }
        });
    }), e.define("/views/client/ClientPayroll.js", function(e, t, n, r, i, s) {
        C.View.ClientPayroll = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.clients = new C.Collection.Clients(null, {
                    view: this
                }), this.clients.fetch({
                    success: function(t, n) {
                        e.client_table = new C.View.ClientPayrollTable({
                            el: $("#client_left"),
                            collection: t
                        }), e.client_form = new C.View.ClientPayrollForm({
                            el: $("#client_right"),
                            model: e.model,
                            collection: t,
                            client_table: e.client_table
                        });
                    }
                });
            }
        });
    }), e.define("/views/client/ClientPayrollTable.js", function(e, t, n, r, i, s) {
        C.View.ClientPayrollTable = Backbone.View.extend({
            name: "client",
            source: "/client",
            headers: [ "ID", "Nombre", "TAG", "C.U.I.T.", "I.V.A.", "Dirección", "Número", "Piso", "Dpto.", "Ciudad", "E-mail" ],
            attrs: [ "id", "name", "tag", "cuit", "iva_id", "address", "addressnumber", "floor", "apartment", "city_id", "email" ],
            hidden_colums: [ "iva_id", "city_id" ],
            data: null,
            initialize: function() {
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.assignValuesToForm($(".client_form"), e);
                });
            },
            events: {
                "click .client_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            }
        });
    }), e.define("/views/client/ClientPayrollForm.js", function(e, t, n, r, i, s) {
        C.View.ClientPayrollForm = Backbone.View.extend({
            name: "client_form",
            title: "Datos del Cliente",
            fields: {
                name: {
                    label: "Nombre",
                    check: "alpha"
                },
                user_id: {
                    label: "Usuario general para el cliente",
                    check: "alpha",
                    type: 'select'
                },
                tag: {
                    label: "TAG",
                    check: "alpha"
                },
                cuit: {
                    label: "C.U.I.T.",
                    check: "cuit"
                },
                iva_id: {
                    label: "I.V.A.",
                    type: "select"
                },
                address: {
                    label: "Dirección",
                    check: "alpha"
                },
                addressnumber: {
                    label: "Número",
                    check: "integer"
                },
                floor: {
                    label: "Piso",
                    check: "integer"
                },
                apartment: {
                    label: "Departamento",
                    check: "alpha"
                },
                city_id: {
                    label: "Ciudad",
                    type: "select"
                },
                email: {
                    label: "E-mail (contacto y notificaciones)",
                    check: "alpha"
                }
            },
            isCRUD: !0,
            relations: {
                ivas: null,
                citys: null
            },
            initialize: function() {
                var e = this;
                F.getAllFromModel("iva", function(t) {
                    e.relations.ivas = t, F.getAllFromModel("city", function(t) {
                        e.relations.citys = t, console.log(t), F.getAllFromModel('clientuser', function(t){
                            e.relations.users = t, console.log(t), F.createForm(e);
                        })
                    });
                });
            },
            events: {
                "click .client_form .BUTTON_create": "addClient",
                "click .client_form .BUTTON_save": "editClient",
                "click .client_form .BUTTON_delete": "delClient"
            },
            getTable: function() {
                return this.options.client_table;
            },
            getDataTable: function() {
                return this.getTable().datatable;
            },
            getSelectionID: function() {
                return parseInt($(".selection_id").val());
            },
            getSelectionRow: function() {
                return this.getTable().selected_row;
            },
            addClient: function() {
                var e = this;
                $.ajax({
                    type: 'POST',
                    data: $('.client_form').serializeObject(),
                    url: '/client',
                    success: function(t){
                        console.log(t, n)
                        if (t.result) {
                            F.cleanForm('.client_form');
                            F.msgOK("El cliente ha sido creado");
                            F.reloadDataTable('.client_table');
                        }else{
                            F.msgError(t.error);
                        }
                    }
                })
            },
            editClient: function() {
                var e = this;
                $.ajax({
                    type: 'PUT',
                    data: $('.client_form').serializeObject(),
                    url: '/client/'+e.getSelectionID(),
                    success: function(){
                        F.cleanForm('.client_form');
                        F.msgOK('El cliente ha sido actualizado');
                        F.reloadDataTable('.client_table');
                    }
                })
            },
            delClient: function() {
                var e = this;
                F.msgConfirm("¿Desea eliminar este Cliente?", function() {
                    $.ajax({
                        type: 'DELETE',
                        url: '/client/'+e.getSelectionID(),
                        success: function(){
                            F.cleanForm('.client_form');
                            F.msgOK('El cliente ha sido eliminado');
                            F.reloadDataTable('.client_table');
                        }
                    })
                });
            }
        });
    }), e.define("/views/clients/ClientsEvents.js", function(e, t, n, r, i, s) {
        C.View.ClientsEvents = Backbone.View.extend({
            name: "clients",
            initialize: function() {
                this.options.ot_id !== undefined ? this.renderTimeline() : $("#left .inner").append('<h1 style="font-size:20px;">Debe seleccionarse una O/T para visualizar sus eventos.</h1><br /><a style="font-size:20px;" href="/#/client/ots">Seleccionar Órden de Trabajo</a>');
            },
            renderTimeline: function() {
                var e = this;
                $.ajax({
                    type: "GET",
                    url: "/clientevents/" + this.options.ot_id,
                    success: function(t) {
                        e.outputMarkupAndInititateTimeline(t.ot[0], t.tasks);
                    }
                });
            },
            outputMarkupAndInititateTimeline: function(e, t) {
                if (t.length) {
                    var n = new Date(e.created_at), r = n.getFullYear() + "," + (n.getMonth() + 1) + "," + n.getDate(), i = new Date(e.delivery), s = i.getFullYear() + "," + (i.getMonth() + 1) + "," + i.getDate();
                    $("#timeline").remove(), $("#left, #left .inner").css({
                        width: "100%",
                        padding: 0
                    }), $("#left .inner").empty().append('<div id="timeline"><section><time>' + r + "</time>" + "<h2>Inicio de la O/T Nº " + e.number + "</h2>" + "<article>" + "<p>" + e.client_suggestion + "</p>" + "</article>" + "</section>" + "</div>"), _.each(t, function(e) {
                        var t = new Date(e.created_at), n = t.getFullYear() + "," + (t.getMonth() + 1) + "," + t.getDate(), r = new Date(e.due_date), i = r.getFullYear() + "," + (r.getMonth() + 1) + "," + r.getDate(), s = "";
                        e.completed == 1 && (s += '<h3 class="completed_task_markup">COMPLETADA el día ' + moment(e.completed_date).format("DD/MM/YYYY") + "</h3>"), $("#left .inner #timeline").append("<ul><li><time>" + n + " </time>" + "<time>" + i + "</time>" + "<h3>" + e.name + "</h3>" + "<article>" + "<p>" + e.description + "</p>" + s + "</article>" + "<figure>" + '<img src="">' + "<cite>" + e.name + "</cite>" + "<figcaption>" + e.description + "</figcaption>" + "</figure>" + "</li>" + "</ul>");
                    }), (new VMM.Timeline({
                        lang: "es"
                    })).init();
                } else $("#left .inner").append('<h1 style="font-size:20px;">La O/T Nº ' + e.number + " todavía no posee tareas asociadas.</h1>" + "<br />" + '<a style="font-size:20px;" href="/#/client/ots">Seleccionar otra Órden de Trabajo</a>');
            }
        });
    }), e.define("/views/clients/ClientsNotifications.js", function(e, t, n, r, i, s) {
        C.View.ClientsNotifications = Backbone.View.extend({
            name: "clients",
            el: $("#clients_left"),
            headers: [ "ID", "O/T", "Concepto", "Descripción", "Fecha" ],
            attrs: [ "id", "ot_number", "name", "description", "created_at" ],
            data: null,
            date_columns: ['created_at'],
            datatableOptions: {
                aoColumns: [ null, null, null, null, {
                    sType: "es_date"
                } ]
            },
            rowHandler: function(e, t) {
                $(e).on("mouseover", function() {
                    $(this).find("td").css({
                        backgroundColor: "#c2dcde"
                    });
                }), $(e).on("mouseout", function() {
                    $(this).find("td").css({
                        backgroundColor: "white"
                    });
                });
            },
            initialize: function() {
                var e = this;
                this.data = new C.Collection.ClientsNotifications(null, {
                    view: this
                }), this.data.fetch({
                    success: function(t, n) {
                        F.createDataTable(e);
                    }
                });
            }
        });
    }), e.define("/views/clients/ClientsOts.js", function(e, t, n, r, i, s) {
        C.View.ClientsOts = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.ots = new C.Collection.ClientsOts(null, {
                    view: this
                }), this.ots.fetch({
                    success: function(t, n) {
                        e.ot_table = new C.View.ClientsOtsTable({
                            el: $("#clients_left"),
                            collection: t
                        });
                    }
                });
            }
        });
    }), e.define("/views/clients/ClientsOtsTable.js", function(e, t, n, r, i, s) {
        C.View.ClientsOtsTable = Backbone.View.extend({
            name: "clients",
            headers: [ "ID", "O/T", "ID Equipo", "Equipo (TAG)", "ID Internvención", "Motivo de intervención", "Inauguración", "Fecha de entrega", "Acciones" ],
            attrs: [ "id", "number", "equipment_id", "equipment", "intervention_id", "intervention", "created_at", "delivery", "actions" ],
            data: null,
            date_columns: ['created_at', 'delivery'],
            datatableOptions: {
                aoColumns: [ null, null, null, null, null, null, {
                    sType: "es_date"
                }, {
                    sType: "es_date"
                }, null ]
            },
            rowHandler: function(e, t) {
                var n = $('<input type="button" value="Autorizar" class="authorize_ot_button">'), r = $('<span class="visualize_ot_events">Visualizar</span>');
                $(e).on("mouseover", function() {
                    $(this).find("td").css({
                        backgroundColor: "#c2dcde"
                    }), $(r).css({
                        color: "black"
                    });
                }), $(e).on("mouseout", function() {
                    $(this).find("td").css({
                        backgroundColor: "white"
                    }), $(r).css({
                        color: "#30858c"
                    });
                }), $($(e).children().get(8)).css({
                    textAlign: "right"
                });
                if (t.otstate_id == 2 || t.otstate_id == 3) $($(e).children().get(8)).append(n), $(n).on("click", function() {
                    F.msgConfirm("Esta acción dara comienzo a la Órden de trabajo seleccionada", function() {
                        $.ajax({
                            type: "GET",
                            url: "/clientauthorize/" + t.id,
                            success: function(e) {
                                F.onSuccess(e, function(e) {
                                    F.msgOK("La Órden de Trabajo ha sido autorizada."), $(n).remove();
                                }, function(e) {
                                    F.msgError("Ocurrió un error al autorizar la O/T. Intente nuevamente.");
                                });
                            }
                        });
                    });
                });
                $($(e).children().get(8)).append(r), $(r).on("click", function() {
                    window.location = "/#/client/events/" + t.id;
                });
            },
            initialize: function() {
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.doNothing();
                });
            }
        });
    }), e.define("/views/controlpanel/ControlPanel.js", function(e, t, n, r, i, s) {
        C.View.ControlPanel = Backbone.View.extend({
            initialize: function() {
                window.location = "/#/crud/person";
            }
        });
    }), e.define("/views/material/MaterialStock.js", function(e, t, n, r, i, s) {
        C.View.MaterialStock = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.materials = new C.Collection.Materials(null, {
                    view: this
                }), this.materials.fetch({
                    success: function(t, n) {
                        e.material_table = new C.View.MaterialStockTable({
                            el: $("#material_left"),
                            collection: t
                        }), e.material_form = new C.View.MaterialStockForm({
                            el: $("#material_right"),
                            model: e.model,
                            collection: t,
                            material_table: e.material_table
                        });
                    }
                });
            }
        });
    }), e.define("/views/material/MaterialStockTable.js", function(e, t, n, r, i, s) {
        C.View.MaterialStockTable = Backbone.View.extend({
            name: "material",
            headers: [ "ID", "Material", "Cantidad", "ID Unidad", "Unidad", "ID Categoría", "Categoría" ],
            attrs: [ "id", "name", "stock", "unit_id", "unit", "materialcategory_id", "materialcategory" ],
            data: null,
            initialize: function() {
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.assignValuesToForm($(".material_form"), e);
                });
            },
            events: {
                "click .material_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            }
        });
    }), e.define("/views/material/MaterialStockForm.js", function(e, t, n, r, i, s) {
        C.View.MaterialStockForm = Backbone.View.extend({
            name: "material_form",
            title: "Datos del Material",
            fields: {
                name: {
                    label: "Material",
                    check: "alpha"
                },
                materialcategory_id: {
                    label: "Categoría",
                    type: "select"
                },
                stock: {
                    label: "Cantidad",
                    check: "numeric"
                },
                unit_id: {
                    label: "Unidad",
                    type: "select"
                }
            },
            isCRUD: !0,
            relations: {
                materialcategorys: null,
                units: null
            },
            initialize: function() {
                var e = this;
                F.getAllFromModel("materialcategory", function(t) {
                    e.relations.materialcategorys = t, F.getAllFromModel("unit", function(t) {
                        e.relations.units = t, F.createForm(e);
                    });
                });
            },
            events: {
                "click .material_form .BUTTON_create": "addMaterial",
                "click .material_form .BUTTON_save": "editMaterial",
                "click .material_form .BUTTON_delete": "delMaterial"
            },
            getTable: function() {
                return this.options.material_table;
            },
            getDataTable: function() {
                return this.getTable().datatable;
            },
            getSelectionID: function() {
                return parseInt($(".selection_id").val());
            },
            getSelectionRow: function() {
                return this.getTable().selected_row;
            },
            addTableRow: function(e) {
                return;
                var t;
            },
            editTableRow: function(e) {},
            addMaterial: function() {
                var e = this;
                this.collection.create($(".material_form").serializeObject(), {
                    success: function(t, n) {
                        var r = t.attributes;
                        e.addTableRow(n.id), F.msgOK("El material ha sido creado");
                        setTimeout(function(){location.reload()}, 1e3);
                    }
                });
            },
            editMaterial: function() {
                var e = this;
                this.collection.get(this.getSelectionID()).save($(".material_form").serializeObject(), {
                    success: function(t, n) {
                        var r = t.attributes;
                        e.editTableRow(F.JSONValuesToArray(t.attributes)), F.msgOK("El material ha sido actualizado");setTimeout(function(){location.reload()}, 1e3);
                    }
                });
            },
            delMaterial: function() {
                var e = this;
                F.msgConfirm("¿Desea eliminar este Material?", function() {
                    e.collection.get(e.getSelectionID()).destroy({
                        success: function(t, n) {
                            var r = t.attributes;
                            $(e.getSelectionRow()).fadeOut("slow", function() {
                                $(this).remove();
                            }), F.msgOK("El material ha sido eliminado");
                            setTimeout(function(){location.reload()}, 1e3);
                        }
                    });
                });
            }
        });
    }), e.define("/views/material/MaterialOrder.js", function(e, t, n, r, i, s) {
        C.View.MaterialOrder = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.authorizations = new C.Collection.MaterialOrders(null, {
                    view: this
                }), this.authorizations.fetch({
                    success: function(t, n) {
                        e.material_table = new C.View.MaterialOrderTable({
                            el: $("#material_left"),
                            collection: t
                        }), e.material_infocard = new C.View.MaterialOrderInfoCard({
                            el: $("#material_right"),
                            model: e.model,
                            collection: t,
                            material_table: e.material_table
                        }), e.material_options = new C.View.MaterialOrderOptions({
                            el: $("#material_left .toolbar")[0],
                            material_table: e.material_table,
                            material_infocard: e.material_infocard
                        });
                    }
                });
            }
        });
    }), e.define("/views/material/MaterialOrderTable.js", function(e, t, n, r, i, s) {
        C.View.MaterialOrderTable = Backbone.View.extend({
            name: "material",
            source: "/materialorder",
            headers: [ "ID", "O/T ID", "O/T", "Equipo (TAG)", "ID Tarea", "Tarea", "Proveedor", "Fecha" ],
            attrs: [ "id", "ot_id", "ot_number", "tag", "ottask_id", "ottask", "provider", "date" ],
            data: null,
            hidden_columns: ["ot_id", 'ottask_id'],
            date_columns: ['date'],
            datatableOptions: {
                aoColumns: [ null, null, null, null, null, null, null, {
                    sType: "es_date"
                } ],
                aaSorting: [[ 1, "desc" ]]
            },
            initialize: function() {
                var e = this;
                this.data = this.options.collection, F.createDataTable(this, function(t) {
                    e.showDetails(t);
                    $('.material_order_infocard .selection_id').val(t.id)

                });
            },
            events: {
                "click .material_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            },
            showDetails: function(e) {
                var id = e.ot_number
                var t = this;
                $.ajax({
                    url: "/materialorder/elements/" + e.id,
                    success: function(e) {
                        e.result === !0 && ($(".material_order_infocard").empty(), t.renderDetails(e.elements));
                        var details = '<br /><div class="details"><h3>Detalles del pedido</h3></div>'
                        $('.material_order_infocard').append(details);
                        console.log(e.id)
                        $('.material_order_infocard').append('<input type="hidden" name="selection_id" class="selection_id" value="'+id+'">') 
                        _.each(e.elements, function(e){
                            $.ajax({
                                url: "/materialreception/byElements/" + e.id,
                                success: function(e) {
                                    e.forEach(function(e) {
                                        var t, n;
                                        e.remito ? n = "Remito Nº " + e.remito : n = " ", e.observation != "sin observaciones" ? t = "<br /> Observaciones:" + e.observation : t = " ", $(".material_order_infocard .details").append("<br />" + e.date + "-> <span>" + e.user + " </span>recibió:<span> " + e.quantity + '</span> "<span>' + e.mccat + ":</span> " + e.matname + '"' + t + "<br />" + n + "<br />");
                                    });
                                }
                            })
                        })
                    }
                });
            },
            renderDetails: function(e) {
                var t, n, r;
                var details = [];
                $(".material_order_infocard").append("<h3>Datos del Pedido de Material</h3><h4>Llegadas</h4>")
                 _.each(e, function(e) {
                    n = $("<input>", {
                        type: "checkbox",
                        checked: e.arrived == 1
                    }), $(n).on("click", function() {
                        (!((C.Session.getUser().area_id == 3) || (C.Session.getUser().role_id == 7 || C.Session.getUser().role_id == 5))) ? F.msgError("No tiene los permisos necesarios") : ($("body").append('<div id="material_order_received" style="display:none; max-height:500px; overflow: auto"><h1 class="bold" style="font-size:20px;">' + e.category + ": " + e.name + " Cant: " + e.quantity + e.unit.split(" ")[0] + '<br /><br /></h1><br /><form id="add_task_ot_form"><h2>Cantidad Recibida:<p>(sólo Números)</p><input type="text" name="quantity_received" /><br /><h2>Remito Nº:<input type="text" name="remito" /><br /><h2>Observaciones</h2> <textarea name="observation_received" style="height:100px" /></h2><br /></form><a class="BUTTON_cancel lefty">Cancelar</a><input type="button" class="BUTTON_proceed righty button" value="Aceptar" /></div>'), $("#material_order_received .BUTTON_cancel").on("click", function() {
                            $.unblockUI(), window.setTimeout(function() {
                                $("#material_order_received").remove();
                            }, 1e3);
                        }), $("#material_order_received .BUTTON_proceed").on("click", function() {
                            if (!isNaN($("#material_order_received input:text[name=quantity_received]").val())){
                                console.log($("#material_order_received input:text[name=quantity_received]").val())
                                console.log("/materialorder/arrival/" + e.id + "/" + ($("#material_order_received input:text[name=quantity_received]").val() || 0) + "/" + ($("#material_order_received input:text[name=remito]").val() || "sin remito") + "::" + ($("#material_order_received textarea[name=observation_received]").val() || "sin observaciones")), F.msgOK("Materiales Recibidos Correctamente"), $.ajax({
                                    url: "/materialorder/arrival/" + e.id + "/" + ($("#material_order_received input:text[name=quantity_received]").val() || 0) + "/" + ($("#material_order_received input:text[name=remito]").val() || "sin remito") + "::" + ($("#material_order_received textarea[name=observation_received]").val() || "sin observaciones"),
                                    success: function(t) {
                                        console.log(e.id)
                                        t.result === !1 && $(n).attr("checked", e.arrived);
                                        $.ajax({
                                            url: "/materialreception/byElements/" + e.id,
                                            success: function(e) {
                                                e.forEach(function(e) {
                                                    var t, n;
                                                    e.remito ? n = "Remito Nº " + e.remito : n = " ", e.observation != "sin observaciones" ? t = "<br /> Observaciones:" + e.observation : t = " ", $(".material_order_infocard .details").append("<br />" + e.date + "-> <span>" + e.user + " </span>recibió:<span> " + e.quantity + '</span> "<span>' + e.mccat + ":</span> " + e.matname + '"' + t + "<br />" + n + "<br />");
                                                });
                                            }
                                        })
                                    }
                                }), $.unblockUI(), window.setTimeout(function() {
                                    $("#material_order_received").remove();
                                }, 1e3);
                            }else{
                                F.msgError('La cantidad debe ser expresada en números')
                            }
                        }), $.blockUI({
                            message: $("#material_order_received"),
                            css: {
                                top: "10%",
                                left: "30%",
                                width: "38%",
                                border: "none",
                                padding: "1%",
                                cursor: "default"
                            }
                        }));
                    }), r = $("<p>"), $(r).append('<span class="hidden" data-id="' + e.id + '"></span>'), s = $('<span class="element_name"><a class="BUTTON_leftly">' + e.category + ":</a></span> " + e.name + '<span class="element_quantity"> Cant: ' + e.quantity + '</span><span class="element_unit">' + e.unit.split(" ")[0] + "</span>").on("click", function() {
                        C.Session.getUser().area_id != 2 && C.Session.getUser().role_id != 7 ? F.msgError("No tiene los permisos necesarios") : ($("body").append('<div id="edit_material_order" style="display:none; max-height:500px; overflow: auto"><h1 class="bold" style="font-size:20px;"> Modificar Material <br /><br /></h1><br /><form id="edit_material_form"><h2><span>Categoría: ' + e.category + '</p></span><br />Nombre:</p><input type="text" name="update_name" value="' + e.name + '"/>Cantidad:</p><input type="text" name="update_quantity" value="' + e.quantity + '"/>Unidades: ' + e.unit + '</p><br /><h2></form><br /><a class="BUTTON_cancel lefty">Cancelar</a><input type="button" class="BUTTON_delete center button" value="Eliminar" /><input type="button" class="BUTTON_proceed righty button" value="Aceptar" /></div>'), $("#edit_material_order .BUTTON_cancel").on("click", function() {
                            $.unblockUI(), window.setTimeout(function() {
                                $("#edit_material_order").remove();
                            }, 1e3);
                        }), $("#edit_material_order .BUTTON_delete").on("click", function() {
                            F.msgConfirm("¿Desea eliminar este Material?", function() {
                                $.ajax({
                                    url: "/materialorder/elementdelete/" + e.id,
                                    success: function(e) {
                                        e.result === !1;
                                    }
                                }), $.unblockUI(), window.setTimeout(function() {
                                    $("#edit_material_order").remove();
                                }, 1e3), F.msgOK("El material ha sido eliminado");setTimeout(function(){location.reload()}, 1e3);
                            });
                        }), $("#edit_material_order .BUTTON_proceed").on("click", function() {
                            F.msgConfirm("¿Desea conservar los cambios en éste Material?", function() {
                                var t = $("#edit_material_order input:text[name=update_name]").val().replace("/", "$");
                                for (var n = 0; n < t.length; n++) t = t.replace("/", "$"), console.log(t);
                                $.ajax({
                                    url: "/materialorder/elementUpdate/" + e.id + "/" + (t || "-") + "/" + ($("#edit_material_order input:text[name=update_quantity]").val() || "0"),
                                    success: function(e) {
                                        e.result === !1;
                                    }
                                }), $.unblockUI(), window.setTimeout(function() {
                                    $("#edit_material_order").remove();
                                }, 1e3), F.msgOK("El material ha sido actualizado");setTimeout(function(){location.reload()}, 1e3);
                            });
                        }), $.blockUI({
                            message: $("#edit_material_order"),
                            css: {
                                top: "10%",
                                left: "30%",
                                width: "38%",
                                border: "none",
                                padding: "1%",
                                cursor: "default"
                            }
                        }));
                    }), $(r).append(n), $(r).append(s), $.ajax({
                        url: "/materialreception/byElements/" + e.id,
                        success: function(e) {
                            e.forEach(function(e) {
                                var t, n;
                                e.remito ? n = "Remito Nº " + e.remito : n = " ", e.observation != "sin observaciones" ? t = "<br /> Observaciones:" + e.observation : t = " ", details.push("<br />" + e.date + "-> <span>" + e.user + " </span>recibió:<span> " + e.quantity + '</span> "<span>' + e.mccat + ":</span> " + e.matname + '"' + t + "<br />" + n);
                            });
                        }
                    }).success(function() {
                    }), $(".material_order_infocard").append(r);
                })
            }
        });
    }), e.define("/views/material/MaterialOrderInfoCard.js", function(e, t, n, r, i, s) {
        C.View.MaterialOrderInfoCard = Backbone.View.extend({
            name: "material_order_infocard",
            title: "Datos del Pedido de Material",
            initialize: function() {
                F.createInfoCard(this, $("#material_right"));
            }
        });
    }), e.define("/views/material/MaterialOrderOptions.js", function(e, t, n, r, i, s) {
        C.View.MaterialOrderOptions = Backbone.View.extend({
            initialize: function() {
                this.render();
            },
            render: function() {
                console.log(C.Session.roleID(), C.Session.getUser().area_id)
                return C.Session.isVigilance() || $(this.el).append(this.template()), this;
            },
            template: function() {
                if (C.Session.getUser().area_id == 2 || C.Session.getUser().area_id == 3 || C.Session.getUser().role_id == 7 || C.Session.getUser().role_id == 5) {
                    var e = $("<div>", {
                        "class": "right_options"
                    });
                    return $(e).append($("<input>", {
                        type: "button",
                        "class": "create_order",
                        value: "Crear Pedido",
                        tittle: "Crea un nuevo pedido de materiales."
                    })), e;
                }
            },
            events: {
                "click #material_left .create_order": "createOrder"
            },
            getTable: function() {
                return this.options.material_table;
            },
            getSelectedRow: function() {
                return this.options.material_table.selected_row;
            },
            createOrder: function() {
                var e = this;
                new C.View.MaterialCreateOrder({
                    createNewOrder: function(e, t) {
                        $.ajax({
                            type: "POST",
                            url: "/materialorder",
                            data: {
                                ot_number: e.ot_number,
                                ottask_id: e.ottask_id,
                                provider: e.provider,
                                materials: e.materials
                            },
                            success: function(e) {
                                e.result === !0 ? t(function() {
                                    $('.blockUI').remove();
                                    F.reloadDataTable('.material_table')
                                }) : t(function() {
                                    F.msgError("Ocurrió un error al guardar el pedido");
                                });
                            }
                        });
                    }
                });
            },
            cleanModals: function() {
                $.unblockUI(), window.setTimeout(function() {
                    $("#material_order_window").remove(), $(".BUTTON_create_order").attr("disabled", !1);
                }, 1e3);
            }
        });
    }), e.define("/views/material/MaterialCreateOrder.js", function(e, t, n, r, i, s) {
        C.View.MaterialCreateOrder = Backbone.View.extend({
            name: "material_create_order_window",
            initialize: function() {
                e = this;
                $(e.el).unbind
                this.getMaterialCategories(), this.getMaterialUnits(), this.render();
                $(document).on('change', '#order_elements .select_material', function(){
                    var id = $(this).val()
                    var index = Number($(this).parent().find('.id').val())
                    $(this).parent().find('.property').remove()
                    console.log(index)
                    e.appendProperties(id, index)
                })
            },
            getMaterialCategories: function() {
                var e = this;
                $.ajax({
                    url: "/materialcategory",
                    success: function(t) {
                        e.material_categories = t.data;
                    }
                });
            },
            getMaterialUnits: function() {
                var e = this;
                $.ajax({
                    url: "/unit",
                    success: function(t) {
                        e.material_units = t;
                    }
                });
            },
            render: function() {
                var e = this;
                $("#material_order_window").length || this.template(), $.blockUI({
                    message: $("#material_order_window"),
                    css: {
                        top: "10%",
                        left: "30%",
                        width: "40%",
                        border: "none",
                        padding: "1%",
                        cursor: "default"
                    }
                });
            },
            appendProperties: function(id, index){
                $.ajax({
                    url:'/materialcategory/getProperties/'+id,
                    success: function(data){
                        console.log(data)
                        var el = $('.material_container_'+index)
                        if (data.material){
                            $(el).append('<input class="property" type="text" name="material_element_'+index+'" placeholder="Material" style="width:80%; margin: 0 auto">')
                        }
                        if (data.externaldiameter) {
                            $(el).append('<input type="text" class="property" name="externaldiameter_'+index+'" placeholder="Diámetro externo" style="width:19%; margin-right: 1%; display:inline">')
                        }
                        if (data.internaldiameter){
                            $(el).append('<input type="text" class="property" name="internaldiameter_'+index+'" placeholder="Diámetro interno" style="width:19%; margin-right: 1%; display:inline">')
                        }
                        if (data.width) {
                            $(el).append('<input type="text" class="property" name="width_'+index+'" placeholder="Ancho" style="width:19%; margin-right: 1%; display:inline">')
                        };
                        if (data.height) {
                            $(el).append('<input type="text" class="property" name="height_'+index+'" placeholder="Alto" style="width:19%; margin-right: 1%; display:inline">')
                        };
                        if (data.longitude) {
                            $(el).append('<input type="text" class="property" name="longitude_'+index+'" placeholder="Longitud" style="width:19%; margin-right: 1; display:inline">')
                        };
                        if (data.thickness) {
                            $(el).append('<input type="text" class="property" name="thickness_'+index+'" placeholder="Espesor" style="width:19%; margin-right: 1; display:inline">')
                        }
                    }
                })
            },
            template: function() {
                var i = $('.material_order_infocard .selection_id').val()
                if (i == 0){ i = ''}
                $("body").append('<div id="material_order_window" style="display:none; max-height:500px; overflow: auto"><h1 class="bold" style="font-size:20px;">Complete la nueva Orden:</h1><br /><br /><label for="ot_number">O/T Nº </label><input type="text" value="'+i+'" name="ot_number" style="width:100px; " /><input type="button" value="Listar Tareas >" class="BUTTON_get_tasks" /><br /><br /><label for="provider">Proveedor </label><select name="provider"><option value="Cliente">Cliente</option><option value="Coopertei">Coopertei</option></select><br /><br /><form id="order_elements"></form><br /><br /><a class="BUTTON_cancel lefty">Cancelar</a><input type="button" class="BUTTON_create righty button" value="Crear Orden" /></div>'), $(".button").button(), this.appendOrderMaterialsWidget(), this.bindButtons();
            },
            appendOrderMaterialsWidget: function() {
                var e = this, t = 1, n = $("<input>", {
                    type: "button",
                    value: "Agregar Material"
                }), r, i;
                $("#order_elements").append(n), $(n).on("click", function() {
                    r = $('<input type="button" name="del_el_' + t + '" value="X" style="position:relative; top:1px; height:25px;' + ' margin-left:5px; padding:2px; font-weigth:bold; color:red;">'), i = $('<div class="material_container_' + t + '"></div>'), $(this).before(i), $(i).append("Categoría "), $(i).append(e.materialCategoriesList(t)), $(i).append(' <input type="text" class="quantity" name="material_quantity_' + t + '" placeholder="Cantidad" style="display:inline; width:75px; height:19px;"> '), $(i).append(e.materialUnitsList(t)), $(i).append(r), $(i).append("<br />"), $(i).append('<input type="hidden" class="id" name="id" value="'+t+'">'), $(r).on("click", function() {
                        $(this).parent().remove();
                    }), t += 1, r = null, i = null;
                });
            },
            materialCategoriesList: function(e) {
                var t = $('<select>', {
                    name: "material_category_" + e,
                    style: "display:inline; width:250px; height:25px;",
                    class: "select_material"
                });
                $(t).append('<option  selected="true" disabled="disabled" value="0">Seleccione un material...</option>');
                return _.each(this.material_categories, function(e) {
                    $(t).append('<option value="' + e.id + '">' + e.name + "</option>");
                }), t;
            },
            materialUnitsList: function(e) {
                var t = $("<select>", {
                    name: "material_unit_" + e,
                    style: "display:inline; width:auto; height:25px;"
                });
                return _.each(this.material_units, function(e) {
                    $(t).append('<option value="' + e.id + '">' + e.name + "</option>");
                }), t;
            },
            bindButtons: function() {
                var e = this;
                $("#material_order_window .BUTTON_get_tasks").on("click", function() {
                    if($("#material_order_window input:text[name=ot_number]").val().replace(/\s/g, "") == ''){
                      $('#material_order_window .ottask_id').empty()
                      F.msgError('No ha cargado el Nº de la OT a listar')
                    }else{
                      $.ajax({
                          url: "/ottask/byOtNumber/" + $("#material_order_window input:text[name=ot_number]").val(),
                          success: function(t) {
                            $('#material_order_window .ottask_id').empty()
                            if (t && t.length){
                              var n = $('<div class="ottask_id" style="float:rigth">');
                              _.each(t, function(e){
                                $(n).append(e.name+"<br />");
                              });$(n).append("</div>"), $("#material_order_window .BUTTON_cancel").before(n);
                            } else 
                              t && !t.length ? 
                                $("#material_order_window .BUTTON_cancel").before(' <span class="select_ottask_msg">La O/T no posee Tareas.</span>') : 
                                (e.cleanModals(), F.msgError("Ocurrió un error al buscar las Tareas"));
                          }
                      });
                    }
                }), $("#material_order_window .BUTTON_cancel").on("click", function() {
                    e.cancelCreateOrder();
                }), $("#material_order_window .BUTTON_create").on("click", function() {
                    e.performCreateOrder();
                });
            },
            cleanModals: function(e) {
                $.unblockUI(), window.setTimeout(function() {
                    $("#material_order_window").remove(), e && e();
                }, 1e3);
            },
            performCreateOrder: function() {
                var errors = 0;
                _.each($('.select_material'), function(material){
                    if ($(material).val() == 0){
                        errors++
                    }
                })
                _.each($('.quantity'), function(material){
                    if ($(material).val() == ''){
                        errors++
                    }
                })
                if (!errors){
                    this.options.createNewOrder({
                        ot_number: $("#material_order_window input:text[name=ot_number]").val(),
                        ottask_id: $("#material_order_window select[name=ottask_id]").val(),
                        provider: $("#material_order_window select[name=provider]").val(),
                        materials: $("#order_elements").serializeObject()
                    }, this.cleanModals);
                }else{
                    F.msgError('Falta completar algunos campos')
                }
            },
            cancelCreateOrder: function() {
                 window.setTimeout(function() {location.reload()}, 1e3);
            }
        });
    }), e.define("/views/materialcategory/MaterialCategory.js", function(e, t, n, r, i, s) {
        C.View.MaterialCategory = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.materialcategorys = new C.Collection.MaterialCategorys(null, {
                    view: this
                }), this.materialcategorys.fetch({
                    success: function(t, n) {
                        e.materialcategory_table = new C.View.MaterialCategoryTable({
                            el: $("#materialcategory_left"),
                            collection: t
                        }), e.materialcategory_form = new C.View.MaterialCategoryForm({
                            el: $("#materialcategory_right"),
                            model: e.model,
                            collection: t,
                            materialcategory_table: e.materialcategory_table
                        });
                    }
                });
            }
        });
    }), e.define("/views/materialcategory/MaterialCategoryTable.js", function(e, t, n, r, i, s) {
        C.View.MaterialCategoryTable = Backbone.View.extend({
            name: "materialcategory",
            source: "/materialcategory",
            headers: [ "ID", "Categoría" ],
            attrs: [ "id", "name" ],
            data: null,
            initialize: function() {
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.assignValuesToForm($(".materialcategory_form"), e);
                });
            },
            events: {
                "click .materialcategory_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            }
        });
    }), e.define("/views/materialcategory/MaterialCategoryForm.js", function(e, t, n, r, i, s) {
        C.View.MaterialCategoryForm = Backbone.View.extend({
            name: "materialcategory_form",
            title: "Datos de la Categoría",
            fields: {
                name: {
                    label: "Nombre",
                    check: "alpha"
                },
            },
            isCRUD: !0,
            initialize: function() {
                var e = this
                F.createForm(this);
                var check = [
                    {
                        name: 'Descripción',
                        tag: 'material',
                    },
                    {
                        name: 'Diametro interno',
                        tag: 'internaldiameter',
                    },
                    {
                        name: 'Diametro externo',
                        tag: 'externaldiameter',
                    },
                    {
                        name: 'Longitud',
                        tag: 'longitude',
                    },
                    {
                        name: 'Ancho',
                        tag: 'width',
                    },
                    {
                        name: 'Alto',
                        tag: 'height',
                    },
                    {
                        name: 'Espesor',
                        tag: 'thickness',
                    },
                ]
                $('.materialcategory_form input[type=text]').after('<br /><div class="check_section"></div>');
                check.forEach(function(c){
                    e.template(c.name, c.tag);
                })
                $('.check_section').append('<br />');
            },
            template: function(name, value){
                var input = '<input style="margin:5px" type="checkbox" name="'+value+'"> '+name+'<br />';
                $('.check_section').append(input);
            },
            events: {
                "click .materialcategory_form .BUTTON_create": "addMaterial",
                "click .materialcategory_form .BUTTON_save": "editMaterial",
                "click .materialcategory_form .BUTTON_delete": "delMaterial"
            },
            getTable: function() {
                return this.options.materialcategory_table;
            },
            getDataTable: function() {
                return this.getTable().datatable;
            },
            getSelectionID: function() {
                return parseInt($(".selection_id").val());
            },
            getSelectionRow: function() {
                return this.getTable().selected_row;
            },
            addMaterial: function() {
                var e = this;
                this.collection.create($(".materialcategory_form").serializeObject(), {
                    success: function(t, n) {
                        F.cleanForm('.materialcategory_form');
                        F.msgOK("La categoria ha sido creada");
                        F.reloadDataTable('.materialcategory_table');
                    }
                });
            },
            editMaterial: function() {
                var e = this;
                $.ajax({
                    type: 'PUT',
                    data: $('.materialcategory_form').serializeObject(),
                    url: '/materialcategory/'+e.getSelectionID(),
                    success: function(t, n) {
                        F.cleanForm('.materialcategory_form');
                        F.msgOK("La categoria ha sido actualizada");
                        F.reloadDataTable('.materialcategory_table');
                    }
                })
            },
            delMaterial: function() {
                var e = this;
                $.ajax({
                    type: 'DELETE',
                    url: '/materialcategory/'+e.getSelectionID(),
                    success: function(t, n) {
                        F.cleanForm('.materialcategory_form');
                        F.msgOK("La categoria ha sido eliminada");
                        F.reloadDataTable('.materialcategory_table');
                    }
                })
            }
        });
    }), e.define("/views/material/MaterialHistory.js", function(e, t, n, r, i, s) {
        C.View.MaterialHistory = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.materials = new C.Collection.MaterialHistorys(null, {
                    view: this
                }), this.materials.fetch({
                    success: function(t, n) {
                        e.material_table = new C.View.MaterialHistoryTable({
                            el: $("#material_left"),
                            collection: t
                        }), e.material_infocard = new C.View.MaterialOrderInfoCard({
                            el: $("#material_right"),
                            model: e.model,
                            collection: t,
                            material_table: e.material_table
                        });                    
                    }
                });
            }
        });
    }), e.define("/views/material/MaterialHistoryTable.js", function(e, t, n, r, i, s) {
        C.View.MaterialHistoryTable = Backbone.View.extend({
            name: "material",
            source: "/materialhistory",
            headers: [ "ID", "O/T ID", "O/T", "Equipo (TAG)", "ID Tarea", "Proveedor", "Fecha" ],
            attrs: [ "id", "ot_id", "ot_number", "tag", "ottask_id", "provider", "date" ],
            data: null,
            hidden_columns: ["ot_id", 'ottask_id'],
            date_columns: ['date'],
            datatableOptions: {
                aoColumns: [ null, null, null, null, null, null, {
                    sType: "es_date"
                } ],
                aaSorting: [[ 1, "desc" ]]
            },
            initialize: function() {
                var e = this;
                this.data = this.options.collection, F.createDataTable(this, function(t) {
                    e.showDetails(t);
                });
            },            
            
            events: {
                "click .material_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            },
            showDetails: function(e) {
                var t = this;
                $.ajax({
                    url: "/materialorder/elements/" + e.id,
                    success: function(e) {
                        console.log(e.elements);
                        e.result === !0 && ($(".material_order_infocard").empty(), t.renderDetails(e.elements));
                    }
                });
            },
            renderDetails: function(e) {
                var t, n, r;
                $(".material_order_infocard").append("<h3>Datos del Pedido de Material </h3><h4>Llegadas</h4>"), _.each(e, function(e) {
                    n = $("<input>", {
                        type: "checkbox",
                        checked: e.arrived == 1
                    }), r = $("<p>"), $(r).append('<span class="hidden" data-id="' + e.id + '"></span>'), s = $('<span class="element_name"><a class="BUTTON_leftly">' + e.category + ":</a></span> " + e.name + '<span class="element_quantity"> Cant: ' + e.quantity + '</span><span class="element_unit">' + e.unit.split(" ")[0] + "</span>"),     $(r).append(n), $(r).append(s), $.ajax({
                        url: "/materialreception/byElements/" + e.id,
                        success: function(e) {
                            e.forEach(function(e) {
                                var t, n;
                                e.remito ? n = "Remito Nº " + e.remito : n = " ", e.observation != "sin observaciones" ? t = "<br /> Observaciones:" + e.observation : t = " ", $(r).append("<br />" + e.date + "-> <span>" + e.user + " </span>recibió:<span> " + e.quantity + '</span> "<span>' + e.mccat + ":</span> " + e.matname + '"' + t + "<br />" + n);
                            });
                        }
                    }).success(function() {
                        console.log("DONE");
                    }), $(".material_order_infocard").append(r);
                });
            }
        });            
            
    }), e.define("/views/equipment/Equipment.js", function(e, t, n, r, i, s) {
        C.View.Equipment = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.equipments = new C.Collection.Equipments(null, {
                    view: this
                }), this.equipments.fetch({
                    success: function(t, n) {
                        e.equipment_table = new C.View.EquipmentTable({
                            el: $("#equipment_left"),
                            collection: t
                        }), e.equipment_form = new C.View.EquipmentForm({
                            el: $("#equipment_right"),
                            model: e.model,
                            collection: t,
                            equipment_table: e.equipment_table
                        });
                    }
                });
            }
        });
    }), e.define("/views/equipment/EquipmentTable.js", function(e, t, n, r, i, s) {
        C.View.EquipmentTable = Backbone.View.extend({
            name: "equipment",
            source: "/equipment",
            headers: [ "ID", "Equipo (TAG)", "ID Motivo de intervención", "Motivo de intervención", "ID Cliente", "Cliente" ],
            attrs: [ "id", "name", "intervention_id", "intervention", "client_id", "client" ],
            hidden_columns: ['intervention_id', 'client_id'],
            data: null,
            initialize: function() {
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.assignValuesToForm($(".equipment_form"), e);
                });
            },
            events: {
                "click .equipment_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            }
        });
    }), e.define("/views/equipment/EquipmentForm.js", function(e, t, n, r, i, s) {
        C.View.EquipmentForm = Backbone.View.extend({
            name: "equipment_form",
            title: "Datos del Equipo",
            fields: {
                name: {
                    label: "Nombre",
                    check: "alpha"
                },
                intervention_id: {
                    label: "Motivo de intervención",
                    type: "select"
                },
                client_id: {
                    label: "Cliente",
                    type: "select"
                }
            },
            isCRUD: !0,
            relations: {
                interventions: null
            },
            initialize: function() {
                var e = this;
                F.getAllFromModel("intervention", function(t) {
                    e.relations.interventions = t.data, F.getAllFromModel("client", function(t) {
                        e.relations.clients = t.data, F.createForm(e);
                    });
                });
            },
            events: {
                "click .equipment_form .BUTTON_create": "addMaterial",
                "click .equipment_form .BUTTON_save": "editMaterial",
                "click .equipment_form .BUTTON_delete": "delMaterial"
            },
            getTable: function() {
                return this.options.equipment_table;
            },
            getDataTable: function() {
                return this.getTable().datatable;
            },
            getSelectionID: function() {
                return parseInt($(".selection_id").val());
            },
            getSelectionRow: function() {
                return this.getTable().selected_row;
            },
            addTableRow: function(e) {
                return;
                var t;
            },
            editTableRow: function(e) {},
            addMaterial: function() {
                var e = this;
                this.collection.create($(".equipment_form").serializeObject(), {
                    success: function(t, n) {
                        F.cleanForm('.equipment_form');
                        F.msgOK("El equipo ha sido creado");
                        F.reloadDataTable('.equipment_table');
                    }
                });
            },
            editMaterial: function() {
                var e = this;
                $.ajax({
                    type: 'PUT',
                    data: $('.equipment_form').serializeObject(),
                    url: '/equipment/'+e.getSelectionID(),
                    success: function(){
                        F.cleanForm('.equipment_form');
                        F.msgOK('El equipo ha sido actualizado');
                        F.reloadDataTable('.equipment_table');
                    }
                })
            },
            delMaterial: function() {
                var e = this;
                F.msgConfirm("¿Desea eliminar este Equipo?", function() {
                    $.ajax({
                        type: 'DELETE',
                        url: '/equipment/'+e.getSelectionID(),
                        success: function(){
                            F.cleanForm('.equipment_form');
                            F.msgOK('El equipo ha sido eliminado');
                            F.reloadDataTable('.equipment_table');
                        }
                    })
                });
            }
        });
    }), e.define("/views/news/News.js", function(e, t, n, r, i, s) {
        C.View.News = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.news = new C.Collection.Newss(null, {
                    view: this
                }), this.news.fetch({
                    success: function(t, n) {
                        e.news_feed = new C.View.NewsFeed({
                            el: $("#alert_right"),
                            collection: t
                        });
                    }
                });
            }
        });
    }), e.define("/views/news/NewsFeed.js", function(e, t, n, r, i, s) {
        C.View.NewsFeed = Backbone.View.extend({
            name: "alert",
            data: null,
            initialize: function() {
                this.data = this.options.collection, F.createDataFeed(this, "Novedades");
            }
        });
    }), e.define("/views/ot/OtAdmin.js", function(e, t, n, r, i, s) {
        C.View.OtAdmin = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.ots = new C.Collection.Ots(null, {
                    view: this
                }), this.ots.fetch({
                    success: function(t, n) {
                        e.ot_table = new C.View.OtAdminTable({
                            el: $("#ot_left"),
                            collection: t
                        }), $("#right").bind("ot_form_loaded", function(t, n) {
                            $(".right_options").remove(), e.ot_options = new C.View.OtAdminOptions({
                                el: $("#ot_left .toolbar")[0],
                                ot_table: e.ot_table,
                                ot_form: n
                            });
                        }), e.ot_form = new C.View.OtAdminForm({
                            el: $("#ot_right"),
                            model: e.model,
                            collection: t,
                            ot_table: e.ot_table
                        });
                    }
                });
            }
        });
    }), e.define("/views/ot/OtInauguration.js", function(e, t, n, r, i, s) {
        C.View.OtInauguration = Backbone.View.extend({
            el: $("#ot_right"),
            name: "ot_form",
            title: "Datos de la Órden de Trabajo a inaugurar",
            fields: {
                client_id: {
                    label: "Cliente",
                    type: "select"
                },
                equipment_id: {
                    label: "Equipo (TAG)",
                    type: "select"
                },
                equipment_new: {
                    label: "O ingrese un Equipo (TAG) nuevo...",
                    type: "text"
                }
            },
            isCRUD: !1,
            buttons: {
                create: !0,
                save: !1,
                cancel: !1,
                "delete": !1
            },
            relations: {
                clients: null,
                equipments: null
            },
            initialize: function() {
                var e = this;
                F.getAllFromModel("client", function(t) {
                    e.relations.clients = t, F.getAllFromModel("equipment", function(t) {
                        e.relations.equipments = t, F.createForm(e, $("#ot_right"), function() {
                            $(".ot_form .BUTTON_create").val("Inaugurar"), $(".ot_form .BUTTON_create").on("click", function() {
                                e.inaugurateOt();
                            });
                        });
                    });
                });
            },
            events: {},
            inaugurateOt: function() {
                $.ajax({
                    type: "POST",
                    url: "/ot/inaugurate",
                    data: $(".ot_form").serialize(),
                    success: function(e) {
                        e.result === !0 ? F.msgOK("La O/T Nº " + e.ot_number + " ha sido inaugurada") : F.msgError("Ocurrió un problema al inaugurar la O/T");
                    }
                });
            }
        });
    }), e.define("/views/ot/OtAdminConcludeForm.js", function(e, t, n, r, i, s) {
        C.View.OtAdminConcludeForm = Backbone.View.extend({
            name: "ot_conclude_form",
            initialize: function() {
                this.render();
            },
            render: function() {
                var e = this;
                $("#ot_conclude_window").length || ($(this.el).append(this.template()), $("#ot_conclude_window .BUTTON_cancel").on("click", function() {
                    e.cancelConcludeOt();
                }), $("#ot_conclude_window .BUTTON_proceed").on("click", function() {
                    e.performConcludeOt();
                })), $.blockUI({
                    message: $("#ot_conclude_window"),
                    css: {
                        top: "25%",
                        left: "30%",
                        width: "38%",
                        border: "none",
                        padding: "1%",
                        cursor: "default"
                    }
                });
            },
            template: function() {
                $("body").append('<div id="ot_conclude_window" style="display:none;"><h1>¿Está seguro de querer concluír la auditoría de la O/T Nº ' + this.options.ot_number + "?</h1>" + "<br /><br />" + '<p class="rednote">Esta operación es IRREVERSIBLE</p>' + "<br /><br />" + "<p>En caso afirmativo, elija el motivo y redacte una observación final:</p>" + "<br /><br />" + '<form id="conclude_ot_form">' + "<div>" + '<input type="radio" name="motive" value="1" />Intervención satisfactoria<br />' + '<input type="radio" name="motive" value="2" />Irreparabilidad<br />' + '<input type="radio" name="motive" value="3" />Otro (aclare)<br />' + "</div>" + "<br /><br />" + 'Nº de remito de Salida<br /><textarea name="remito" style="width:100%; height:20px;"></textarea>' + 'Observaciones<br /><textarea name="observation" style="width:100%; height:50px;"></textarea>' + "</form>" + "<br /><br />" + '<a class="BUTTON_cancel lefty" style="cursor:pointer;">Cancelar</a>' + '<input type="button" class="BUTTON_proceed righty button" value="Proceder" />' + "</div>");
            },
            cleanModals: function(e) {
                $.unblockUI(), window.setTimeout(function() {
                    $("#ot_conclude_window").remove(), e && e();
                }, 1e3);
            },
            performConcludeOt: function() {
                this.options.performConclusion(this.cleanModals);
            },
            cancelConcludeOt: function() {
                this.cleanModals();
            }
        });
    }), e.define("/views/ot/OtAdminTable.js", function(e, t, n, r, i, s) {
        C.View.OtAdminTable = Backbone.View.extend({
            name: "ot",
            source: "/ot",
            headers: [ "ID", "O/T", "O/T Cliente", "ID Equipo", "Equipo (TAG)", "ID Cliente", "Cliente", "ID Internvención", "Motivo de intervención", "Inauguración", "Fecha de entrega", "Sugerencia p/Taller", "Sugerencia p/Cliente", "ID Plan", "Retrabajo", "remitoentrada", "Notificar cliente" ],
            attrs: [ "id", "number", "client_number", "equipment_id", "equipment", "client_id", "client", "intervention_id", "intervention", "created_at", "delivery", "workshop_suggestion", "client_suggestion", "plan_id", "reworked_number", "remitoentrada", "notify_client" ],
            hidden_columns: [ "workshop_suggestion", "client_suggestion", "remitoentrada", "reworked_number", "notify_client", 'equipment_id', 'client_id', 'intervention_id', 'plan_id'],
            date_columns: ['delivery', 'created_at'],
            data: null,
            datatableOptions: {
                aoColumns: [ null, null, null, null, null, null, null, null, null, {
                    sType: "es_date"
                }, {
                    sType: "es_date"
                }, null, null, null, null, null ],
                aaSorting:  [ [1,"desc"]],
            },
            initialize: function() {
                var t = this;
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.assignValuesToForm($(".ot_form"), e);
                    $('.plan_alert').remove()
                    if (e.plan_id == 0 && C.Session.roleID() == 1){
                        $('.BUTTON_save').hide()
                    }
                    var items = $("#select > option").map(function() {
                        var arr = [];
                        arr.push(Number($(this).val()))
                        return arr;
                    }).get();
                    console.log(e.plan_id)
                    console.log(items.indexOf(e.plan_id))
                    if (items.indexOf(e.plan_id) < 0){
                        console.log('heraldo')
                        $('#select').before('<span class="equipment_ot_exists plan_alert">La OT posee un plan de tareas actualmente eliminado</span>');
                    }
                    else
                        {
                            $('#select').removeAttr('disabled').trigger('liszt:updated')
                        }
                });
                $(document).on('click', '.ot_table tr', function(evento){
                    t.selectRow(evento);
                })
            },
            events: {
                "click .ot_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget), $("#ot_left .ot_conclude").attr("disabled", !1);
                if (C.Session.roleID() > 2 && C.Session.roleID() < 6){
                    $('#ot_left .ot_reprogram').attr('disabled', !1);
                }
            }
        });
    }), e.define("/views/ot/OtAdminForm.js", function(e, t, n, r, i, s) {
        C.View.OtAdminForm = Backbone.View.extend({
            name: "ot_form",
            title: "Datos de la Órden de Trabajo",
            fields: {
                number: {
                    label: "O/T Nº",
                    force_label: !0,
                    value: null,
                    attrs: {
                        disabled: "disabled",
                        style: "margin-top:-1em 0 1em;"
                    }
                },
                remitoentrada: {
                    label: "Nº de Remito de entrada",
                    type: "text"
                },
                client_number: {
                    label: "O/T Cliente",
                    type: "integer"
                },
                client_id: {
                    label: "Cliente",
                    type: "select"
                },
                equipment_id: {
                    label: "Equipo (TAG)",
                    type: "select"
                },
                equipment_new: {
                    label: "O ingrese un Equipo (TAG) nuevo...",
                    type: "text"
                },
                delivery: {
                    label: "Fecha de entrega",
                    type: "datepicker"
                },
                intervention_id: {
                    label: "Motivo de intervención",
                    type: "select"
                },
                workshop_suggestion: {
                    label: "Sugerencia p/Taller",
                    type: "textarea"
                },
                client_suggestion: {
                    label: "Sugerencia p/Cliente",
                    type: "textarea"
                },
                plan_id: {
                    label: "Plan de Tareas (inicial/tentativo)",
                    type: "select",
                    attrs: {id: 'select'},
                },
                reworked_number: {
                    label: "Es retrabajo de",
                    check: "integer"
                },
                notify_client: {
                    label: "Notificar eventos al cliente",
                    type: "select_yn",
                    default_value: "n"
                }
            },
            buttons: {
                create: !0,
                save: !0,
                cancel: !0,
                "delete": !1
            },
            isCRUD: !0,
            relations: {
                clients: null,
                equipments: null,
                interventions: null,
                plans: null
            },
            initialize: function() {
                var e = this;
                F.getNextOtNumber(function(t) {
                    e.fields.number.value = t.n, F.getAllFromModel("client", function(t) {
                        e.relations.clients = t.data, F.getAllFromModel("equipment", function(t) {
                            e.relations.equipments = t.data, F.getAllFromModel("intervention", function(t) {
                                e.relations.interventions = t.data, F.getAllFromModel("plan", function(t) {
                                    e.relations.plans = t.data, F.createForm(e, !1, function() {
                                        $("#right").trigger("ot_form_loaded", [ e ]), $(".ot_form select[name=equipment_id]").after($("<span>", {
                                            "class": "equipment_ot_exists"
                                        })), $(".ot_form select[name=equipment_id]").on("change", function() {
                                            var e = this, t = $(".ot_form select[name=client_id]").val();
                                            $.ajax({
                                                url: "/ot/findByEquipmentAndClient/" + $(this).val() + "/" + t,
                                                success: function(e) {
                                                    $("span.equipment_ot_exists").empty();
                                                    if (e.result === !0 && e.ots.length) {
                                                        var t = e.ots[e.ots.length - 1].number;
                                                        $("span.equipment_ot_exists").html("Este equipo ya ingresó con la O/T Nº " + t);
                                                    }
                                                }
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            },
            events: {
                "click .ot_form .BUTTON_create": "addOt",
                "click .ot_form .BUTTON_save": "editOt",
                "click .ot_form .BUTTON_cancel": "cancelOt"                
            },
            getTable: function() {
                return this.options.ot_table;
            },
            getDataTable: function() {
                return this.getTable().datatable;
            },
            getSelectionID: function() {
                return parseInt($(".selection_id").val());
            },
            getSelectionRow: function() {
                return this.getTable().selected_row;
            },
            addTableRow: function(e) {
                var t = F.JSONValuesToArray($(".ot_form").serializeObject());
                t.unshift(e), this.getDataTable().fnAddData(t);
            },
            editTableRow: function(e) {},
            addOt: function() {
                var e = this;
                $(".ot_form").serializeObject().client_id != "" || $(".ot_form").serializeObject().equipment_id != "" && $(".ot_form").serializeObject().equipament_new != "" ? $.ajax({
                    data: $(".ot_form").serializeObject(),
                    url: '/ot',
                    type: 'POST',
                    success: function(e, t) {
                        console.log(e)
                        setTimeout(function(){
                            $.ajax({
                                type: 'GET',
                                url: '/ot/alterdate/'+e.id,
                                success: function(){
                                    var n = e.attributes;
                                    F.msgOK("La O/T ha sido creada"), $(".ot_form select[name=client_id]").val(null), $(".ot_form select[name=equipment_id]").val(null);
                                    F.reloadDataTable('.ot_table')
                                }
                                
                            })
                        })
                    }//this.collection.create($(".ot_form").serializeObject(), {
                }) : F.msgError("Cargue al menos Cliente y TAG del equipo");
            },
            editOt: function() {
              var e = this;
              $.ajax({
                type: "POST",
                url: "/ot/update/" + $(".selection_id").val(),
                data: $(".ot_form").serialize(),
                success: function(n) {
                    setTimeout(function(){
                        $.ajax({
                            type: 'GET',
                            url: '/ot/alterdate/'+  $(".selection_id").val(),
                            success: function(){
                                var n = e.attributes;
                                F.msgOK("La O/T ha actualizada");
                                F.reloadDataTable('.ot_table')
                            }
                        })
                    }, 500)
                }
              });
            },
            cancelOt: function() {
              //location.reload()
            }            
        });
    }), e.define("/views/ot/OtAdminOptions.js", function(e, t, n, r, i, s) {
        C.View.OtAdminOptions = Backbone.View.extend({
            initialize: function() {
                var e = this;
                $(document).unbind("delays_loaded")
                $('#ot_add_task_window').remove()
                $(document).bind("delays_loaded", function() {
                    e.render();
                    console.log(e.delays)
                }),this.getDelays();
                this.render();
            },
            render: function() {
                return $(this.el).append(this.template()), this;
            },
            template: function() {
                var e = $("<div>", {
                    "class": "right_options"
                });
                return $(e).append($("<input>", {
                    type: "button",
                    "class": "ot_conclude",
                    value: "Concluir O/T",
                    disabled: "disabled"
                })), $(e).append($('<input>', {
                    type: 'button',
                    value: 'Reprogramar O/T',
                    disabled: 'disabled',
                    class: 'ot_reprogram'
                })), e;
            },
            events: {
                "click #ot_left .ot_conclude": "concludeOt",
                "click #ot_left .ot_reprogram": "reprogramOt"
            },
            getForm: function() {
                return this.options.ot_form;
            },
            getTable: function() {
                return this.options.ot_table;
            },
            getSelectedRow: function() {
                return this.options.ot_table.selected_row;
            },
            concludeOt: function() {
                console.log("ME LLAMO")
                var e = this, t = $(".ot_table"), n = F.getDataTableSelection(t)[0], r = $(t).dataTable().fnGetData(n).id, i = $(".ot_table").dataTable().fnGetData(n).number;
                F.msgConfirm("¿Realmente desea concluír la auditoría de la Órden de Trabajo Nº " + i + "?", function() {
                  new C.View.OtAdminConcludeForm({
                      el: $("body"),
                      ot_number: i,
                      performConclusion: function(t) {
                        $.ajax({
                          type: "POST",
                          url: "/ot/conclude/" + r,
                          data: $("#conclude_ot_form").serialize(),
                          success: function(n) {
                            F.msgOK("La O/T ha sido concluída");
                            setTimeout(function(){location.reload()}, 1e3);
                          }
                        });
                      }
                  });
              });
            },
            reprogramOt: function(){
              var e = this, t = $(".ot_table"),
              n = F.getDataTableSelection(t)[0],
              r = $(t).dataTable().fnGetData(n)[0],
              i = $(".ot_table").dataTable().fnGetData(n).id
              console.log(r);
                (this.templatet(),
                 $("#ot_reprogramar_window .BUTTON_cancel").on("click", function() {
                    $('.blockUI').remove();
                $()
                $(document).on('click', '.blockOverlay', function(){
                    $('.blockUI').remove();
                })
                }), $("#ot_reprogramar_window .BUTTON_proceed").on("click", function() {
                    //var sacomani = true;
                    repForm = $("#reprogramar_ot_form").serializeObject();
                    if((repForm.newDate!='')
                    && (repForm.observation!='')
                    && (repForm.delay_id!=0)){
                        console.log(repForm);   
                      F.msgConfirm("Está seguro de Reprogramar la OT?", function() {
                        $.ajax({
                          type: "PUT",
                          url: "/ot/reprogram/"+i,
                          data: repForm,//$("#reprogramar_ot_form").serialize(),
                          success: function(nia) {
                            if(nia){
                                    F.msgOK("O/T reprogramada exitosamente");
                                  setTimeout(function(){location.reload()},1e3)
                            }else{
                                    F.msgError("La O/T tiene tareas posteriores al vencimiento seleccionado");
                                  //setTimeout(function(){location.reload()},1e3)
                            }
                          }
                        })
                      });
                    }else{
                      F.msgError("Todos los campos son obligatorios") // OT->SEGUIMIENTO REPGROGRAMAR VTO
                    }
                }))
            },
            getDelays: function() {
                var e = this;
                $.ajax({
                    type: "GET",
                    url: "/delay",
                    success: function(t) {
                        e.delays = t.data, $(document).trigger("delays_loaded");
                    }
                });
            },
            buildDelaysList: function(e) {
                var e = this;
                console.log(e.delays)
                var t = $("<select>", {
                    name: 'delay_id'
                });
                return $(t).append($("<option>", {
                    value: 0
                }).text("Seleccione razón de demora...")), _.each(e.delays, function(e) {
                    $(t).append($("<option>", {
                        value: e.id
                    }).text(e.reason));
                }), t;
            },
            templatet: function() {
              var e = this, t = $(".ot_table"), n = F.getDataTableSelection(t)[0], r = $(t).dataTable().fnGetData(n)[0], i = $(".ot_table").dataTable().fnGetData(n).number;
              console.log(e.buildDelaysList('demoras'))
              /* FORM REPROGRAMAR VTO */
              $("body").append('<div id="ot_reprogramar_window" style="display:none;"><h1 class="bold">¿Está seguro de querer Reprogramar la O/T Nº '+i+"?</h1>" + '<form id="reprogramar_ot_form" >' + "<br /><br />" +'<input id="tess" name="newDate" type="date" placeholder="Fecha Vto nueva"><br /><br />'+'Observaciones: <br /><textarea id="tesss" name="observation" style="width:100%; height:50px;"></textarea>'+ "</form>" + '<input type="button" class="BUTTON_cancel lefty button" value="Cancelar" />'+ '<input type="button" class="BUTTON_proceed righty button" value="Proceder" />' + "</div>"), $('#reprogramar_ot_form').append(e.buildDelaysList('demoras'))
              /* FIN FORM REPGROGRAMAR VTO */
              $.blockUI({
                message: $("#ot_reprogramar_window"),
                css: {
                  top: "15%",
                  left: "30%",
                  width: "38%",
                  border: "none",
                  padding: "1%",
                  cursor: "default"
                }
              });
            },
        });
    }), e.define("/views/ot/OtAudit.js", function(e, t, n, r, i, s) {
        C.View.OtAudit = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.ots = new C.Collection.Ots(null, {
                    view: this
                }), this.ots.fetch({
                    success: function(t, n) {
                        e.collection = t, $.ajax({
                            type: "GET",
                            url: "/user/currentAreaId",
                            success: function(t) {
                                e.area_id = t.area_id, e.render();
                            }
                        });
                    }
                });
            },
            render: function(e) {
                var t = this;
                this.ot_table = new C.View.OtAuditTable({
                    el: $("#ot_left"),
                    collection: this.collection,
                    area_id: this.area_id,
                    open_ot_number_on_start: this.options.open_ot_number_on_start
                }), $("#right").bind("ot_infocard_loaded", function(e, n) {
                    $(".right_options").remove(), t.ot_options = new C.View.OtAuditOptions({
                        el: $("#ot_left .toolbar")[0],
                        ot_table: t.ot_table,
                        ot_infocard: n
                    });
                }), this.ot_infocard = new C.View.OtAuditInfoCard({
                    el: $("#ot_right"),
                    model: this.model,
                    collection: this.collection,
                    ot_table: this.ot_table
                });
            }
        });
    }), e.define("/views/ot/OtAuditAddTask.js", function(e, t, n, r, i, s) {
        C.View.OtAuditAddTask = Backbone.View.extend({
            name: "ot_add_task_window",
            initialize: function() {
                var e = this
                $(document).unbind("tasks_loaded")
                $('#ot_add_task_window').remove()
                $(document).bind("tasks_loaded", function() {
                    e.render();
                    console.log(e.tasks)
                }),this.getTasks();
            },
            render: function() {
                var e = this;
                $("#ot_add_task_window").length || (this.template(), $("#ot_add_task_window .BUTTON_cancel").on("click", function() {
                    e.cancelAddTask();
                }), $("#ot_add_task_window .BUTTON_proceed").on("click", function() {
                    e.performAddTask();
                })), $.blockUI({
                    message: $("#ot_add_task_window"),
                    css: {
                        top: "15%",
                        left: "30%",
                        width: "38%",
                        border: "none",
                        padding: "1%",
                        cursor: "default"
                    }
                });
            },
            getTasks: function() {
                var e = this;
                $.ajax({
                    type: "GET",
                    url: "/task",
                    success: function(t) {
                        e.tasks = t.data, $(document).trigger("tasks_loaded");
                    }
                });
            },
            buildTasksList: function(e) {
                var t = $("<select>", {
                    name: 'name'
                });
                return $(t).append($("<option>", {
                    value: 0
                }).text("Seleccione tarea...")), _.each(this.tasks, function(e) {
                    $(t).append($("<option>", {
                        value: e.id
                    }).text(e.name));
                }), t;
            },
            template: function() {
                var r = $(".ot_table").dataTable(), i = F.getDataTableSelection($(".ot_table"))[0], s = 0, o = parseInt(r.fnGetData(i).id);
                $("body").append('<div id="ot_add_task_window" style="display:none;"><h1 class="bold">Ingrese los datos de la nueva Tarea para la O/T '+parseInt(r.fnGetData(i).number)+':</h1><br /><br /><form id="add_task_ot_form"><label for="new_task_name">Prioridad</label><input type="text" name="new_task_priority" /><select name= "area"><option value="1">Administraci&oacute;n</option><option value="2">T&eacute;cnica/Calidad</option><option value="3">Pañol</option><option value="4">Mec&aacute;nica</option><option value="5">Maquinado</option><option value="6">Herrer&iacute;a</option><option value="7">Vigilancia</option></select><label for="new_task_description">Descripción</label><textarea name="new_task_description" style="height:100px;"></textarea></form><br /><br /><a class="BUTTON_cancel lefty">Cancelar</a><input type="button" class="BUTTON_proceed righty button" value="Agregar Tarea" /></div>'), $(".button").button();
                $('#add_task_ot_form').prepend(this.buildTasksList('tareas')).prepend('<label>Nombre</label>')
                $('#add_task_ot_form').append('<label>Tiempo estimado (dias)</label><input type="text" name="eta" style="width:50px;margin:0 auto"><input type="checkbox" name="reprogram">Reprogramar tareas')
            },
            cleanModals: function(e) {
                $('#ot_add_task_window').remove()
                $('.blockUI').remove();
            },
            performAddTask: function() {
                if ($('#add_task_ot_window').css('display') == 'none'){
                    $('#add_task_ot_window').remove()
                }
                console.log($('#add_task_ot_window'))
                this.options.addNewTask({
                    name: $("#add_task_ot_form select").val(),
                    description: $("#add_task_ot_form textarea[name=new_task_description]").val() +":::"+ $("#add_task_ot_form input:text[name=new_task_priority]").val() +":::"+ $('#add_task_ot_form select[name=area]').val(),
                    eta: $('#add_task_ot_form input[name=eta]').val()
                }, this.cleanModals());
            },
            cancelAddTask: function() {
                this.cleanModals();
            }
        });
    }), e.define("/views/ot/OtAuditToggleTaskState.js", function(e, t, n, r, i, s) {
        C.View.OtAuditToggleTaskState = Backbone.View.extend({
            name: "ot_toggle_task_state",
            employees: null,
            initialize: function() {
                if (!this.options.currentTaskState) {
                    var e = this;
                    $(document).unbind('employees_loaded');
                    $(document).bind("employees_loaded", function() {
                        e.render();
                    }), this.getEmployees();
                }else this.performToggleState();
            },
            getEmployees: function() {
                var e = this;
                $.ajax({
                    type: "GET",
                    url: "/employee",
                    success: function(t) {
                        e.employees = t.data, $(document).trigger("employees_loaded");
                    }
                });
            },
            render: function() {
                var e = this;
                $("#ot_toggle_task_state_window").length || this.template(), $("#ot_toggle_task_state_window .BUTTON_cancel").on("click", function() {
                    e.cancelToggleState();
                }), $("#ot_toggle_task_state_window .BUTTON_proceed").on("click", function() {
                    e.performToggleState();
                }), $("#ot_toggle_task_state_window .BUTTON_proceed_job").on("click", function() {
                    e.performToggleStateJob();
                }), $.blockUI({
                    message: $("#ot_toggle_task_state_window"),
                    css: {
                        top: "0",
                        left: "30%",
                        width: "38%",
                        height: "100%",
                        border: "none",
                        padding: "1%",
                        cursor: "default"
                    }
                });
            },
            template: function() {
                $("body").append('<div id="ot_toggle_task_state_window" style="display:none; max-height:700px; overflow: auto"><h1 class="bold">Liste los empleados que trabajaron y horarios invertidos en esta tarea:</h1><br /><br /><form id="toggle_task_state_ot_form"><div></div></form><br /><br /><input type="button" class="BUTTON_cancel lefty button" value="Cancelar" /><input type="button" class="BUTTON_proceed righty button" value="Completar Tarea" /><input type="button" class="BUTTON_proceed_job righty button" value="Continuar Trabajando" /></div>');
                for (var e = 1; e <= 5; e += 1) $("#toggle_task_state_ot_form div").append(this.buildEmployeesList("toggle_task_employee_" + e)[0]).append('<input type="text" name="toggle_task_schedule_' + e + '_h" maxlength="2" /> : ' + '<input type="text" name="toggle_task_schedule_' + e + '_m" maxlength="2" /> hs.').append("<br />Instrumentos/Herramientas <br /><select name='seleccion_" + e + "'" + this.buildToolsList() + "<br />");
                $(".button").button();
            },
            cleanModals: function(e) {
                $("#toggle_task_state_window").remove()
                $('.blockUI').remove();
            },
            buildToolsList: function(e) {
                return "		multiple>			<option value='1-Torno-TURRI'>1-Torno-TURRI</option>			<option value='2-Torno-TURRI'>2-Torno-TURRI</option>			<option value='3-Torno-TURRI'>3-Torno-TURRI</option>			<option value='4-Torno-TURRI'>4-Torno-TURRI</option>			<option value='5-Torno-TURRI'>5-Torno-TURRI</option>			<option value='6-Torno-TURRI'>6-Torno-TURRI</option>			<option value='7-Torno-T-ESPRINGFIELD'>7-Torno-T-ESPRINGFIELD</option>			<option value='8-Torno-BATISTI'>8-Torno-BATISTI</option>			<option value='9-Torno-AMERICAN'>9-Torno-AMERICAN</option>			<option value='10-Torno-Sin Nombre'>10-Torno-Sin Nombre</option>			<option value='11-Mortajadora-MINGANTI'>11-Mortajadora-MINGANTI</option>			<option value='12-Fresadora-MAS'>12-Fresadora-MAS</option>			<option value='13-Fresadora-ARNO'>13-Fresadora-ARNO</option>			<option value='14-Fresadora-IMEPLA'>14-Fresadora-IMEPLA</option>			<option value='15-Cepillo-RODAWEY'>15-Cepillo-RODAWEY</option>			<option value='16-Rectificadora-WECHECO'>16-Rectificadora-WECHECO</option>			<option value='17-Alesadora-PLAUERT-TOS'>17-Alesadora-PLAUERT-TOS</option>			<option value='18-Rectificadora-NORMATIC'>18-Rectificadora-NORMATIC</option>			<option value='19-Fresadora-Bawer-CRA'>19-Fresadora-Bawer-CRA</option>			<option value='20-Alesadora-RICHARDS'>20-Alesadora-RICHARDS</option>			<option value='21-Rectificadora E/P-TOS, HOSTIVAR'>21-Rectificadora E/P-TOS, HOSTIVAR</option>			<option value='22-Alesadora-TOS-VARNDORF'>22-Alesadora-TOS-VARNDORF</option>			<option value='23-Sierra sin fin-PEHAKA'>23-Sierra sin fin-PEHAKA</option>			<option value='24-Agujereadora-IMEPLA'>24-Agujereadora-IMEPLA</option>			<option value='25-Agujereadora-AMERICAN'>25-Agujereadora-AMERICAN</option>			<option value='26-Balanceadora-COBI'>26-Balanceadora-COBI</option>			<option value='27-Arenadora-BLASTING'>27-Arenadora-BLASTING</option>			<option value='34-Amoladora Soldadura-WEKA'>34-Amoladora Soldadura-WEKA</option>			<option value='35-Agujereadora de banco-BARBERO ABM-16'>35-Agujereadora de banco-BARBERO ABM-16</option>			<option value='36-Agujereadora  banco Soldad-ELEVE'>36-Agujereadora  banco Soldad-ELEVE</option>			<option value='37-Amoladora de tornería-S/Identificar'>37-Amoladora de tornería-S/Identificar</option>			<option value='38-Prensa Hidráulica-ADABOR'>38-Prensa Hidráulica-ADABOR</option>			<option value='39-Soldadora-TAMIG-R480-S'>39-Soldadora-TAMIG-R480-S</option>			<option value='40-Soldadora-MILLER Sinc.250'>40-Soldadora-MILLER Sinc.250</option>			<option value='42-Torno-C Y'>42-Torno-C Y</option>			<option value='50-Torno-BATISTI'>50-Torno-BATISTI </option>			<option value='51-Torno-BATISTI '>51-Torno-BATISTI </option>			<option value='52-Fresadora-IMEPLA'>52-Fresadora-IMEPLA</option>			<option value='CU 02'>CU 02</option>			<option value='CU 14'>CU 14</option>			<option value='CU 23'>CU 23</option>			<option value='CU 24'>CU 24</option>			<option value='CU 26'>CU 26</option>			<option value='CU 27'>CU 27</option>			<option value='CU 32'>CU 32</option>			<option value='CU 33'>CU 33</option>			<option value='CU 36'>CU 36</option>			<option value='CU 39'>CU 39</option>			<option value='CU 40'>CU 40</option>			<option value='CU 42'>CU 42</option>			<option value='CU 43'>CU 43</option>			<option value='CU 44'>CU 44</option>			<option value='CU 45'>CU 45</option>			<option value='CU 48'>CU 48</option>			<option value='CU 50'>CU 50</option>			<option value='CU 51'>CU 51</option>			<option value='CU 52'>CU 52</option>			<option value='CU 53'>CU 53</option>			<option value='CU 54'>CU 54</option>			<option value='CU 55'>CU 55</option>			<option value='CU 56'>CU 56</option>			<option value='CU 57'>CU 57</option>			<option value='CU 59'>CU 59</option>			<option value='CU 60'>CU 60</option>			<option value='CU 61'>CU 61</option>			<option value='CU 62'>CU 62</option>			<option value='CU 63'>CU 63</option>			<option value='CU 65'>CU 65</option>			<option value='CU 67'>CU 67</option>			<option value='CU 68'>CU 68</option>			<option value='CU 70'>CU 70</option>			<option value='CU 71'>CU 71</option>			<option value='CU 72'>CU 72</option>			<option value='CU 73'>CU 73</option>			<option value='CU 75'>CU 75</option>			<option value='CP 04'>CP 04</option>			<option value='CP 01'>CP 01</option>			<option value='CP 02'>CP 02</option>			<option value='ME 02'>ME 02</option>			<option value='ME 03'>ME 03</option>			<option value='ME 04'>ME 04</option>			<option value='ME 05'>ME 05</option>			<option value='ME 06'>ME 06</option>			<option value='ME 07'>ME 07</option>			<option value='ME 08'>ME 08</option>			<option value='ME 09'>ME 09</option>			<option value='ME 11'>ME 11</option>			<option value='ME 12'>ME 12</option>			<option value='ME 13'>ME 13</option>			<option value='ME 14'>ME 14</option>			<option value='ME 15'>ME 15</option>			<option value='ME 16'>ME 16</option>			<option value='ME 20'>ME 20</option>			<option value='ME 21'>ME 21</option>			<option value='ME 22'>ME 22</option>			<option value='ME 24'>ME 24</option>			<option value='ME 34'>ME 34</option>			<option value='ME 35'>ME 35</option>			<option value='ME 36'>ME 36</option>			<option value='ME 37'>ME 37</option>			<option value='ME 38'>ME 38</option>			<option value='ME 39'>ME 39</option>			<option value='ME 41'>ME 41</option>			<option value='ME 42'>ME 42</option>			<option value='ME 43'>ME 43</option>			<option value='ME 44'>ME 44</option>			<option value='ME 45'>ME 45</option>			<option value='ME 46'>ME 46</option>			<option value='ME 47'>ME 47</option>			<option value='ME 48'>ME 48</option>			<option value='ME 49'>ME 49</option>			<option value='ME 50'>ME 50</option>			<option value='ME 51'>ME 51</option>			<option value='ME 52'>ME 52</option>			<option value='ME 53'>ME 53</option>			<option value='ME 54'>ME 54</option>			<option value='ME 55'>ME 55</option>			<option value='ME 56'>ME 56</option>			<option value='ME 57'>ME 57</option>			<option value='M-PROF-1'>M-PROF-1</option>			<option value='M-PROF-2'>M-PROF-2</option>			<option value='MI3P 01'>MI3P 01</option>			<option value='MI3P 02'>MI3P 02</option>			<option value='MI3P 04'>MI3P 04</option>			<option value='MI3P 06'>MI3P 06</option>			<option value='MI3P 07'>MI3P 07</option>			<option value='MI3P 08'>MI3P 08</option>			<option value='MI3P 09'>MI3P 09</option>			<option value='MI3P 10'>MI3P 10</option>			<option value='MI3P 11'>MI3P 11</option>			<option value='MI3P 12'>MI3P 12</option>			<option value='MI3P 13'>MI3P 13</option>			<option value='MI3P 14'>MI3P 14</option>			<option value='MI3P 15'>MI3P 15</option>			<option value='MI3P 16'>MI3P 16</option>			<option value='MI3P 17'>MI3P 17</option>			<option value='MI3P 18'>MI3P 18</option>			<option value='MI3P 19'>MI3P 19</option>			<option value='MI3P 20'>MI3P 20</option>			<option value='MI3P 21'>MI3P 21</option>			<option value='MIV 01'>MIV 01</option>			<option value='MIV 02'>MIV 02</option>			<option value='MIV 04'>MIV 04</option>			<option value='MIV 05'>MIV 05</option>			<option value='MIVD 02'>MIVD 02</option>			<option value='RC 01'>RC 01</option>			<option value='RC 02'>RC 02</option>			<option value='RC 03'>RC 03</option>			<option value='RC 04'>RC 04</option>			<option value='RC 05'>RC 05</option>			<option value='RC 09'>RC 09</option>			<option value='RC 20'>RC 20</option>			<option value='RC 21'>RC 21</option>			<option value='RC 23'>RC 23</option>			<option value='RC 28'>RC 28</option>			<option value='RC 30'>RC 30</option>			<option value='RC 35'>RC 35</option>			<option value='RC 37'>RC 37</option>			<option value='RC 38'>RC 38</option>			<option value='RC 40'>RC 40</option>			<option value='RC 43'>RC 43</option>			<option value='RC 44'>RC 44</option>			<option value='RC 45'>RC 45</option>			<option value='RC 48'>RC 48</option>			<option value='RC 49'>RC 49</option>			<option value='RC 50'>RC 50</option>			<option value='RC 51'>RC 51</option>			<option value='RP 04'>RP 04</option>			<option value='RP 01'>RP 01</option>			<option value='RP 02'>RP 02</option>			<option value='RP 03'>RP 03</option>			<option value='COBIC  BAL'>COBIC  BAL</option>			<option value='ALESAMETRO  01'>ALESAMETRO  01</option>			<option value='ALESAMETRO  02'>ALESAMETRO  02</option>			<option value='ALESAMETRO  06'>ALESAMETRO  06</option>			<option value='ALESAMETRO  03'>ALESAMETRO  03</option>			<option value='COP-1'>COP-1</option>			<option value='COP-4'>COP-4</option>			<option value='COP-6'>COP-6</option>			<option value='TOR 02'>TOR 02</option>		</select>		";
            },
            buildEmployeesList: function(e) {
                var t = $("<select>", {
                    name: e
                });
                return $(t).append($("<option>", {
                    value: 0
                }).text("Seleccione empleado...")), _.each(this.employees, function(e) {
                    $(t).append($("<option>", {
                        value: e.id
                    }).text(e.name));
                }), t;
            },
            performToggleState: function() {
                this.options.performToggleTaskState(this.cleanModals());
            },
            performToggleStateJob: function() {
                this.options.performToggleTaskState(this.cleanModals, !0), $(this.options.checkbox).attr("checked", !1), this.cleanModals();
                //location.reload();
            },
            cancelToggleState: function() {
                $(this.options.checkbox).attr("checked", !1), location.reload();
            }
        });
    }), e.define("/views/ot/OtAuditForm.js", function(e, t, n, r, i, s) {
        C.View.OtAuditForm = Backbone.View.extend({
            name: "ot_form",
            title: "Datos de la Órden de Trabajo",
            fields: {},
            isCRUD: !0,
            relations: {
                clients: null,
                equipments: null,
                interventions: null
            },
            initialize: function() {
                var e = this;
                F.getNextOtNumber(function(t) {
                    e.fields.number.value = t.n, F.getAllFromModel("client", function(t) {
                        e.relations.clients = t, F.getAllFromModel("equipment", function(t) {
                            e.relations.equipments = t, F.getAllFromModel("intervention", function(t) {
                                e.relations.interventions = t, F.createForm(e);
                            });
                        });
                    });
                });
            },
            events: {
                "click .ot_form .BUTTON_create": "addOt",
                "click .ot_form .BUTTON_save": "editOt"
            },
            getTable: function() {
                return this.options.person_table;
            },
            getDataTable: function() {
                return this.getTable().datatable;
            },
            getSelectionID: function() {
                return parseInt($(".selection_id").val());
            },
            getSelectionRow: function() {
                return this.getTable().selected_row;
            },
            addTableRow: function(e) {
                var t = F.JSONValuesToArray($(".ot_form").serializeObject());
                t.unshift(e), this.getDataTable().fnAddData(t);
            },
            editTableRow: function(e) {},
            addOt: function() {
                var e = this;
                this.collection.create($(".ot_form").serializeObject(), {
                    success: function(t, n) {
                        var r = t.attributes;
                        e.addTableRow(n.id), F.msgOK("La O/T ha sido creada con exito");
                        setTimeout(function(){location.reload()}, 1e3);
                    }
                });
            },
            editOt: function() {
              var e = this;
              this.collection.get(this.getSelectionID()).save($(".ot_form").serializeObject(), {
                success: function(t, n) {
                  var r = t.attributes;
                  e.editTableRow(F.JSONValuesToArray(t.attributes)), F.msgOK("La O/T ha sido actualizada");setTimeout(function(){location.reload()}, 1e3);
                }
              });
            }
        });
    }), e.define("/views/ot/OtAuditInfoCard.js", function(e, t, n, r, i, s) {
        C.View.OtAuditInfoCard = Backbone.View.extend({
            name: "ot_infocard",
            title: "Datos de la O/T",
            fieldnames: {
                number: "O/T Nº",
                equipment: "Equipo (TAG)",
                client: "Cliente",
                delivery: "Fecha de entrega",
                remitoentrada: "Remito de Entrada",
                reworked_number: "Es retrabajo de"
            },
            initialize: function() {
                var e = this;
                $(".ot_infocard").remove(), F.createInfoCard(this, $("#ot_right"), function() {
                    $("#right").trigger("ot_infocard_loaded", [ e ]);
                });
            }
        });
    }), e.define("/views/ot/OtAuditOptions.js", function(e, t, n, r, i, s) {
        C.View.OtAuditOptions = Backbone.View.extend({
            initialize: function() {
                this.render();
            },
            render: function() {
                return $(this.el).append(this.template()), this;
            },
            template: function() {
                var e = $("<div>", {
                    "class": "right_options"
                });
                return $(e).append($("<input>", {
                    type: "button",
                    "class": "ot_add_task",
                    value: "Agregar Tarea",
                    disabled: "disabled",
                    title: "Agrega una Tarea al final ó debajo de la seleccionada actualmente."
                }), $("<input>", {
                    type: "button",
                    "class": "ot_rework_task",
                    value: "Retrabajar Tarea",
                    disabled: "disabled",
                    title: "Cancela la Tarea seleccionada y agrega una nueva idéntica debajo de la misma."
                })), e;
            },
            events: {
                "click #ot_left .ot_add_task": "addTask",
                "click #ot_left .ot_rework_task": "reworkTask"
            },
            getInfoCard: function() {
                return this.options.ot_infocard;
            },
            getSelectedRow: function() {
                return this.options.ot_table.selected_row;
            },
            reloadRowDetails: function() {
                $("tr.selected_row").next().css({
                    opacity: .5
                }), $("tr.selected_row").click(), window.setTimeout(function() {
                    $("tr.selected_row").click();
                }, 500);
            },
            addTask: function() {
                var e = this;
                new C.View.OtAuditAddTask({
                    addNewTask: function(t, n) {
                        var r = $(".ot_table").dataTable(), i = F.getDataTableSelection($(".ot_table"))[0], s = 0, o = parseInt(r.fnGetData(i).id);
                        $(".selected_ottask").length && (s = parseInt($(".selected_ottask").attr("data-position"))), $.ajax({
                            url: "/ottask/add",
                            type: "POST",
                            data: {
                                ot_id: o,
                                name: t.name,
                                description: t.description,
                                eta: t.eta,
                                selected_row_position: s
                            },
                            success: function(t) {
                                e.reloadRowDetails();
                            }
                        });
                    }
                });
            },
            reworkTask: function() {
                var e = this, t = $(".selection_ottask_id").val();
                F.getOneFromModel("ottask/get", $(".selection_ottask_id").val(), function(x){
                  if(x[0].completed==1){
                    F.msgConfirm("Esta opreación RETRABAJARÁ la Tarea.", function() {
                        var n = parseInt($(".selected_ottask").attr("data-position"));
                        $.ajax({
                            url: "/ottask/rework/" + t + "/after/" + n,
                            success: function(t) {
                                console.log("ID TAREA QUE VOY A RETRABAJAR= ", $(".selection_ottask_id").val(), "ROW=", parseInt($(".selected_ottask").attr("data-position"))), t === !0 && e.reloadRowDetails();
                            }
                        });
                    });
                  }else{
                    F.msgError("La tarea debe estar completa para poder ser retrabajada")
                  }
                })
            }
        });
    }), e.define("/views/ot/OtAuditTable.js", function(e, t, n, r, i, s) {
        C.View.OtAuditTable = Backbone.View.extend({
            name: "ot",
            source: "/ot",
            headers: [ "ID", "O/T", "O/T", "O/T Cliente", "ID Equipo", "Equipo (TAG)", "Remito", "ID Cliente", "Cliente", "Fecha de entrega", "Retrabajo de" ],
            attrs: [ "id", "ot_number", "number", "client_number", "equipment_id", "equipment", "remitoentrada", "client_id", "client", "delivery", "reworked_number" ],
            hidden_columns: [ "ot_number", "number", "reworked_number", 'equipment_id', 'client_id' ],
            date_columns: ['delivery'],
            data: null,
            datatableOptions: {
                aoColumns: [ null, null, null, null, null, null, null, {
                    sType: "es_date"
                }, null, null ],
                aaSorting: [ [ 1, "desc" ] ],
                iDisplayLength: 50000
            },
            initialize: function() {
                var t = this;
                function e(e, n) {
                    var r = $(e).dataTable();
                    $(document).on("click", ".ot_table tbody tr", function(evento) {
                        $(".task_form").fadeOut("slow", function() {
                            $(this).remove();
                        })
                        if(r.fnIsOpen(this)){
                            r.fnClose(this)
                            F.cleanInfocard($('.ot_infocard'));
                        }else{
                            if (!$(this).hasClass('details')){
                                $('.ot_table tbody tr').each(function(){
                                    r.fnClose(this);
                                })
                                t.selectRow(evento);
                                r.fnOpen(this, t.generateRowDetails(r, this), "details");
                                F.assignValuesToInfoCard($(".ot_infocard"), r.fnGetData(this));
                            }
                        }
                    });
                }
                var t = this;
                this.data = this.options.collection;
                this.area_id = this.options.area_id; 
                F.createDataTable(this, function() {}, e);
            },
            events: {
                "click .ot_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget), $("#ot_left .ot_add_task").attr("disabled", !1);
            }, 
            generateRowDetails: function(e, t) {
                var n = -1, r = -1, i = this, s = e.fnGetData(t), o = s.id, u = '<div class="row_detail ot_id_' + o + '" style="display:none;">', a, f = 0;
                return this.getOtTasks(o, function(e) {
                    var r, s, u;
                    if (e.length) {
                        var l = !0, c = 1;
                        i.appendRowDetailsHeaders(o), _.each(e, function(e) {
                            r = $('<p data-position="' + c + '">'), c += 1, s = $("<input>", {
                                type: "checkbox",
                                "class": "complete_task_" + e.id
                            }), u = "<span>" + e.name + " - </span> "+e.priority+" Descripción: "+e.description, u += '<span class="task_due_date">' + F.toHumanDate(e.due_date, !1) + "</span>", e.completed_date ? u += '<span class="task_completed_date">' + F.toHumanDate(e.completed_date, !1) + "</span>" : e.reworked != 0 ? u += '<span class="task_completed_date" style="color:darkred;">Retrabajada</span>' : u += '<span class="task_completed_date" style="color:#555;">Incompleta</span>', C.Session.roleID() >= 2 && $(r).append(s), $(r).append(u);
                            var t = C.Session.getUser().role_id, h = t == 4, p = t == 3 && i.area_id == e.area_id, d = i.area_id != e.area_id || t != 1 || t != 2 || t != 5;
                            e.reworked != 0 ? ($(s).attr("disabled", !0),$(r).css({
                                opacity: .5
                            })) : e.completed == 1 && ($(s).attr("checked", !0), $(s).parent().addClass("crossed"), a = e.id, f += 1), $(".ot_id_" + o).append(r).fadeIn(), i.bindRenderOtTaskForm(r, e, d), i.bindEnableTaskActions(r, e, d), $('input:checkbox[class="complete_task_' + e.id + '"]').on("click", function() {
                                var t = this, n = null, r = F.doNothing, s = null;
                                C.Session.getUser().role_id != 7 && e.area_id != C.Session.getUser().area_id ? (r = "No Pertenece al AREA correspondiente para realizar esta TAREA", i = function() {
                                    $(t).attr("checked", !1)
                                }, s = !0, i(), F.msgError(r)) : ($(t).is(":checked") ? (n = "Esta operación COMPLETARÁ la Tarea.", r = function() {
                                    $(t).attr("checked", !1);
                                }, s = !1) : (n = "Esta operación convertirá en INCOMPLETA la Tarea.", r = function() {
                                    $(t).attr("checked", !0);
                                }, s = !0), F.msgConfirm(n, function() {
                                    i.toggleTaskState(t, e.id, s, function(e) {
                                        e === !0 && $(t).is(":checked") ? ($(t).parent().addClass("crossed"), $($(t).parent().next().children()[0]).attr("disabled", !1), $(t).parent().next().css({
                                            opacity: 1
                                        })) : $(t).is(":checked") || ($(t).parent().removeClass("crossed"), $($(t).parent().next().children()[0]).attr("disabled", !0), $(t).parent().next().css({
                                            opacity: .5
                                        }));
                                    });
                                }, function() {
                                    r();
                                }));
                            }), l = !1, (!e.completed && n == -1 || e.priority == n) && e.reworked == 0 ? n = e.priority : e.completed || ($(s).attr("disabled", !0), $(r).css({
                                opacity: .5
                            }));
                        });
                    } else $(".ot_infocard .ot_percentage").remove(), $(".ot_id_" + o).append("<p>Esta O/T no posee un Plan de Tareas asociado</p>").fadeIn();
                    var h = i.calculateCompletitionPercentage(e), p = "peity_pie_" + o;
                    $("span." + p).remove(), $($(t).children()[0]).append('<span class="' + p + '">' + h.toString() + "/100</span>"), $("span." + p).css({
                        position: "relative",
                        top: "3px",
                        left: "10px"
                    }), $("span." + p).peity("pie"), h > 0 || $("#tasksCompletitionPercentage").remove();
                }), u += "</div>", u;
            },
            calculateCompletitionPercentage: function(e) {
                var t, n = 0;
                return _.each(e, function(e) {
                    e.completed == 1 && (n += 1);
                }), t = n / e.length * 100, t.toString().substr(0, 2);
            },
            drawPercentageLoader: function(e, t, n) {
                var r = t / 100, t = 0;
                $("#tasksCompletitionPercentage").remove(), $("#right .inner").append('<div id="tasksCompletitionPercentage">');
                var i = $("#right .inner #tasksCompletitionPercentage").percentageLoader({
                    width: 150,
                    height: 150,
                    controllable: !1,
                    value: n + " / " + e.length,
                    progress: 0
                }), s = function() {
                    t += .01, i.setProgress(t);
                    if (!(t < r)) return;
                    window.setTimeout(s, 25);
                };
                window.setTimeout(s, 25);
            },
            appendRowDetailsHeaders: function(e) {
                $(".ot_id_" + e).append('<p class="row_details_headers">Nombre - Descripción<span>Estado - Vencimiento</span></p>');
            },
            bindRenderOtTaskForm: function(e, t, n) {
                var r = this;
                $(e).on("click", function() {
                    $(".row_detail p").removeClass("selected_ottask"), $(this).addClass("selected_ottask"), C.Session.roleID() >= 2 && ($("#tasksCompletitionPercentage").remove(),$('#ot_right').unbind(), $(".task_form").remove(), r.ottask_form = new C.View.OtTaskForm({
                        el: $("#ot_right"),
                        model: new C.Model.OtTask,
                        table: r,
                        task: t
                    }), $(e).find(".row_subdetail").length ? $(".row_subdetail").remove() : r.renderOtTaskResources(e, t));
                });
            },
            renderOtTaskResources: function(e, t) {
                C.Session.roleID() >= 2 /*&& t.completed*/ && new C.View.OtTaskResources({
                    task_row: e,
                    task: t
                });
            },
            bindEnableTaskActions: function(e, t, n) {
                $(e).on("click", function() {
                    $("#ot_left .ot_rework_task").attr("disabled", !1).css({
                        color: "darkred"
                    });
                });
            },
            getOtTasks: function(e, t) {
                $.ajax({
                    url: "/ottask/byOt/" + e,
                    success: function(e) {
                        t(e);
                    }
                });
            },
            reloadRowDetails: function() {
                $("tr.selected_row").next().css({
                    opacity: .5
                }), $("tr.selected_row").click(), window.setTimeout(function() {
                    $("tr.selected_row").click();
                }, 500);
            },
            toggleTaskState: function(e, t, n, r) {
                var i = this;
                new C.View.OtAuditToggleTaskState({
                    el: $("body"),
                    checkbox: e,
                    currentTaskState: n,
                    performToggleTaskState: function(e, n) {
                        console.log(n);
                        var s;
                        n ? (s = "error", console.log("existe")) : s = "good", $.ajax({
                            type: "POST",
                            url: "/ottask/toggleTaskState/" + t + "**" + s,
                            data: $("#toggle_task_state_ot_form").serialize(),
                            success: function(t) {
                                F.onSuccess(t, function(t) {
                                    i.reloadRowDetails();
                                }, function(e) {
                                    F.msgError("Ocurrió un error al completar la Tarea");
                                }), r(t);
                            }
                        });
                    }
                });
            }
        });
    }), e.define("/views/ot/OtHistory.js", function(e, t, n, r, i, s) {
        C.View.OtHistory = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.ots = new C.Collection.OtHistorys(null, {
                    view: this
                }), this.ots.fetch({
                    success: function(t, n) {
                        e.ot_table = new C.View.OtHistoryTable({
                            el: $("#ot_left"),
                            collection: t
                        }), e.ot_infocard = new C.View.OtHistoryInfoCard({
                            el: $("#ot_right"),
                            model: e.model,
                            collection: t,
                            ot_table: e.ot_table
                        });
                    }
                });
            }
        });
    }), e.define("/views/ot/OtHistoryTable.js", function(e, t, n, r, i, s) {
        C.View.OtHistoryTable = Backbone.View.extend({
            name: "ot",
            source: "/othistory",
            headers: [ "ID", "O/T", "O/T Cliente", "Ingreso", "Salida", "ID Equipo", "Equipo (TAG)", "ID Cliente", "Cliente", "Fecha de entrega", "Retrabajo de", "remitoentrada", "Remito de Salida" ],
            attrs: [ "id",  "number", "client_number", "created_at", "salida", "equipment_id", "equipment", "client_id", "client", "delivery", "reworked_number", "remitoentrada", "remitosalida" ],
            hidden_columns: [/*"created_at", "salida",*/ "delivery", "reworked_number", "remitoentrada", 'client_id', 'equipment_id'],
            date_columns: ['created_at', 'salida'],
            data: null,
            datatableOptions: {
                aaSorting: [ [ 1, "desc" ] ]
            },
            iDisplayLength: 500,
            initialize: function() {
                var e = this;
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.assignValuesToInfoCard($(".ot_infocard"), e);
                }, function() {
                    var t = $(".ot_table").dataTable();
                    $(document).on("click", ".ot_table tbody tr", function() {
                        t.fnIsOpen(this) ? t.fnClose(this) : t.fnOpen(this, e.generateRowDetails(t, this), "details");
                    });
                });
            },
            events: {
                "click .ot_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget), $("#ot_right .ot_add_task").attr("disabled", !1);
            },
            generateRowDetails: function(e, t) {
                var n = this, r = e.fnGetData(t), i = r.id, s = '<div class="row_detail ot_id_' + i + '" style="display:none;">';
                return this.getOtTasks(i, function(e) {
                    var t, r, s;
                    e.length ? (n.appendRowDetailsHeaders(i), _.each(e, function(e) {
                        var y = " ";
                        if(e.completed_date){
                          var x = e.completed_date
                          y = x[8]+x[9]+x[7]+x[5]+x[6]+x[4]+x[0]+x[1]+x[2]+x[3]
                        }
                        t = $("<p>"), r = $("<input>", {
                            type: "checkbox",
                            "class": "complete_task_" + e.id
                        }), s = "<span>" + e.name + " - </span> " + e.description+'<span  style="float:right;">'+ y +'</span>', $(t).append(r).append(s), e.completed && ($(r).attr("checked", !0), $(r).parent().addClass("crossed")), $(".ot_id_" + i).append(t).fadeIn(), n.bindRenderOtTaskForm(t, e, !1), $('input:checkbox[class="complete_task_' + e.id + '"]').on("click", function() {
                            return !1;
                        });
                    })) : $(".ot_id_" + i).append("<p>Esta O/T no posee un Plan de Tareas asociado</p>").fadeIn();
                }), s += "</div>", s;
            },
            getOtTasks: function(e, t) {
                $.ajax({
                    url: "/ottask/byOt/" + e,
                    success: function(e) {
                        t(e);
                    }
                });
            },
            appendRowDetailsHeaders: function(e) {
                $(".ot_id_" + e).append('<p class="row_details_headers">Nombre - Descripción<span>Completada</span></p>');
            },
            bindRenderOtTaskForm: function(e, t, n) {
                var r = this;
                $(e).on("click", function() {
                    $(".row_detail p").removeClass("selected_ottask"), $(this).addClass("selected_ottask"), C.Session.roleID() >= 3 && ($("#tasksCompletitionPercentage").remove(),$('#ot_right').unbind(), $(".task_form").remove(), new C.View.OtTaskForm({
                        el: $("#ot_right"),
                        model: new C.Model.OtTask,
                        table: r,
                        task: t
                    }), $(e).find(".row_subdetail").length ? $(".row_subdetail").remove() : r.renderOtTaskResources(e, t));
                });
            },
            renderOtTaskResources: function(e, t) {
                C.Session.roleID() >= 3 /*&& t.completed*/ && new C.View.OtTaskResources({
                    task_row: e,
                    task: t
                });
            }
        });
    }), e.define("/views/ot/OtHistoryInfoCard.js", function(e, t, n, r, i, s) {
        C.View.OtHistoryInfoCard = Backbone.View.extend({
            name: "ot_infocard",
            title: "Datos de la O/T",
            fieldnames: {
                number: "O/T Nº",
                equipment: "Equipo (TAG)",
                client: "Cliente",
                delivery: "Fecha pactada de entrega",
                reworked_number: "Es retrabajo de",
            },
            initialize: function() {
                var e = this;
                F.createInfoCard(e, $("#ot_right"));
            }
        });
    }), e.define("/views/ot/OtPlans.js", function(e, t, n, r, i, s) {
        C.View.OtPlans = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.plans = new C.Collection.Plans(null, {
                    view: this
                }), this.plans.fetch({
                    success: function(t, n) {
                        e.plan_table = new C.View.OtPlansTable({
                            el: $("#plan_left"),
                            collection: t
                        }), e.plan_form = new C.View.OtPlansForm({
                            el: $("#plan_right"),
                            model: e.model,
                            collection: t,
                            plan_table: e.plan_table
                        });
                    }
                });
            }
        });
    }), e.define("/views/ot/OtPlansTable.js", function(e, t, n, r, i, s) {
        C.View.OtPlansTable = Backbone.View.extend({
            name: "plan",
            source: "/plan",
            headers: [ "ID", "Nombre", "Descripción", "ID Tareas" ],
            attrs: [ "id", "name", "description", "task_id" ],
            hidden_columns: ['task_id'],
            data: null,
            initialize: function() {
                t = function(){

                }

                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.assignValuesToForm($(".plan_form"), e);
                });
            },
            events: {
                "click .plan_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            }
        });
    }), e.define("/views/ot/OtPlansForm.js", function(e, t, n, r, i, s) {
        C.View.OtPlansForm = Backbone.View.extend({
            name: "plan_form",
            title: "Datos del Plan de Tareas",
            fields: {
                name: {
                    label: "Nombre",
                    check: "alpha"
                },
                description: {
                    label: "Descripción",
                    type: "textarea"
                },
                task_count: {
                    type: 'hidden',
                    value: 1,
                    attrs:{
                        class: 'task_count',
                    }
                }
            },
            isCRUD: !0,
            relations: {
                tasks: null
            },
            initialize: function() {
                var e = this, t = [];
                F.getAllFromModel("task", function(t) {
                    e.relations.tasks = t.data, F.createForm(e);
                    $(".plan_form select").after()
                    var t = 1, n = $("<input>", {
                        type: "button",
                        value: "Agregar tarea"
                    }), r, i;
                    var container = $('<div class="tasks"></div>')
                    i = $('<div class="task task_container_0" style="margin-bottom:10px"></div>'), $(".plan_form .plan_form_description").after(container), $(container).append(i), $(i).append(e.addTask(0, 0)), $(i).append(' <input type="text" class="eta" name="eta_0" placeholder="Dias" style="display:inline; margin:0; width:70px; height:19px;">'), $(i).append("<br />")

                    $(".plan_form").append(n), $(n).on("click", function() {
                        $('.task_count').val(t)
                        r = $('<input class="delete" type="button" name="del_el_'+t+'" value="X" style="position:relative; top:1px; margin:0; height:25px;' + ' margin-left:5px; padding:2px; font-weigth:bold; color:red;">'), i = $('<div class="task dispensable task_container_'+t+'" style="margin-bottom:10px"></div>'), $(".tasks").append(i), $(i).append(e.addTask(t, 0)), $(i).append(' <input type="text" placeholder="Dias" class="eta" name="eta_'+t+'" style="display:inline; width:70px; margin:0; height:19px;">'), $(i).append(r), $(i).append("<br />"), $(r).on("click", function() {
                            $(this).parent().remove();
                        }), t += 1, r = null, i = null;
                        e.toogleButtonVisibility()
                    });
                    $(document).on('click', '.delete', function(){
                        var fields = $('.task')
                            t = 0
                            var dispensable = '';
                            _.each(fields, function(el){
                                if (t > 0){
                                    dispensable = 'dispensable';
                                }
                                $(el).find('.eta').attr('name', 'eta_'+t)
                                $(el).find('.id').attr('name', 'task_id_'+t)
                                $(el).attr('class', 'task '+dispensable+' task_container_'+t)
                                t++
                            })
                            $('.plan_form .task_count').val(Number($('.task_count').val())-1)
                            e.toogleButtonVisibility()
                    })
                    $(document).on('click', '.plan_table tbody tr', function(){
                        $.ajax({
                            url: '/plan/task/'+e.getSelectionID(),
                            success: function(data){
                                $('.tasks').empty()
                                t = 0;
                                $('.task_count').val(data.length)
                                    _.each(data, function(task){
                                    r = $('<input class="delete" type="button" name="del_el_'+t+'" value="X" style="position:relative; top:1px; margin:0; height:25px;' + ' margin-left:5px; padding:2px; font-weigth:bold; color:red;">'), i = $('<div class="task dispensable task_container_'+t+'" style="margin-bottom:10px"></div>'), $(".tasks").append(i), $(i).append(e.addTask(t, task.task_id)), $(i).append(' <input type="text" class="eta" name="eta_'+t+'" value="'+task.eta+'" placeholder="Dias" style="display:inline; width:70px; margin:0; height:19px;">'),$('.select_'+t+' option[value="'+task.task_id+'"]').prop('selected', true), $(i).append(r), $(i).append("<br />"), $(r).on("click", function() {
                                        $(this).parent().remove();
                                    }), t += 1, r = null, i = null;
                                })
                                $('.dispensable:first').removeClass('dispensable')
                                $('.delete:first').addClass('dispensable')
                                e.toogleButtonVisibility();
                            }
                        })
                    })
                });
            },
            toogleButtonVisibility: function(){
                if ($('.dispensable').length > 0){
                    $('.BUTTON_cancel').show()
                }else{
                    $('.BUTTON_cancel').hide()
                }
            },
            addTask: function(e, value){
                var t = $('<select>', {
                    name: "task_id_" + e,
                    style: "display:inline; width:75%; height:25px; margin:0;",
                    class: 'id select_'+e,
                });
                $('.select_'+e+' option[value="'+value+'"]').prop('selected', true);
                $(t).append('<option disabled selected value="0">Tarea</option>');
                return _.each(this.relations.tasks, function(e) {
                    $(t).append('<option value="' + e.id + '">' + e.name + "</option>");
                }), t;
            },
            events: {
                "click .plan_form .BUTTON_create": "addPlan",
                "click .plan_form .BUTTON_save": "editPlan",
                "click .plan_form .BUTTON_delete": "delPlan",
            },
            getTable: function() {
                return this.options.plan_table;
            },
            getDataTable: function() {
                return this.getTable().datatable;
            },
            getSelectionID: function() {
                return parseInt($(".selection_id").val());
            },
            getSelectionRow: function() {
                return this.getTable().selected_row;
            },
            addPlan: function() {
                var e = this;
                console.log($('.plan_form').serializeObject());
                this.collection.create($(".plan_form").serializeObject(), {
                    success: function(t, n) {
                        F.cleanForm('.plan_form');
                        F.msgOK("El Plan ha sido creado");
                        F.reloadDataTable('.plan_table');
                    }
                });
            },
            editPlan: function() {
                var e = this;
                $.ajax({
                    type: 'PUT',
                    data: $('.plan_form').serializeObject(),
                    url: '/plan/'+e.getSelectionID(),
                    success: function(){
                        F.cleanForm('.plan_form');
                        F.msgOK('El plan ha sido actualizado');
                        F.reloadDataTable('.plan_table');
                    }
                })
            },
            delPlan: function() {
                var e = this;
                F.msgConfirm("¿Desea eliminar este Plan?", function() {
                    $.ajax({
                        type: 'DELETE',
                        url: '/plan/'+e.getSelectionID(),
                        success: function(){
                            F.cleanForm('.plan_form');
                            F.msgOK('El plan ha sido eliminado');
                            F.reloadDataTable('.plan_table');
                        }
                    })
                });
            }
        });
    }), e.define("/views/ottask/OtTaskForm.js", function(e, t, n, r, i, s) {
        C.View.OtTaskForm = Backbone.View.extend({
            name: "task_form",
            title: "Datos de la Tarea",
            fields: {
                name: {
                    label: "Nombre",
                    check: "alpha"
                },
                priority: {
                    label: "Prioridad(Sólo Números)",
                },
                description: {
                    label: "Descripción",
                    type: "textarea"
                },
                due_date: {
                    label: "Vencimiento",
                    type: "datepicker"
                },
                area_id: {
                    label: "Área",
                    type: "select"
                },
                observation: {
                    label: "Observación",
                    type: "textarea"
                }
            },
            isCRUD: !1,
            buttons: {
                save: !0,
                "delete": !0,
                cancel: !0
            },
            relations: {
                areas: null
            },
            initialize: function() {
                var e = this;
                F.getAllFromModel("area", function(t) {
                    e.relations.areas = t, F.createForm(e), $(".task_form input:hidden.selection_id").remove();
                    var n = e.getTask(), r = $(".task_form"), i = $(r).getFields(), s;
                    $(r).append($("<input>", {
                        type: "hidden",
                        value: n.id,
                        "class": "selection_ottask_id"
                    })), $(i).each(function() {
                        s = $(this).attr("name"), $(this).val(n[s]), s === "due_date" ? $(this).val(moment(n[s]).format("DD/MM/YYYY")) : s === "area_id" && $(this).trigger("liszt:updated");
                    });
                });
            },
            events: {
                "click .task_form .BUTTON_save": "editTask",
                "click .task_form .BUTTON_delete": "delTask",
                "click .task_form .BUTTON_cancel": "cancelEditTask"
            },
            closeForm: function(){
            },
            getTask: function() {
                return this.options.task;
            },
            getDataTable: function() {
                return $(this.table).dataTable();
            },
            getSelectionRow: function() {
                return $(".complete_task_" + this.getTask().id).parent();
            },
            getSelectionID: function() {
                return parseInt($(".task_form .selection_ottask_id").val());
            },
            reloadOtRowDetails: function() {
                $("tr.selected_row").next().css({
                    opacity: .5
                }), $("tr.selected_row").click(), window.setTimeout(function() {
                    $("tr.selected_row").click();
                }, 500);
            },
            editTask: function() {
                var e = this;
                C.Session.getUser().role_id >= 3 || C.Session.getUser().area_id == 2 ? $.ajax({
                    type: "PUT",
                    url: "/ottask/" + e.getSelectionID(),
                    data: $(".task_form").serializeObject(),
                    success: function(t) {
                        F.msgOK("La Tarea Fué editada con Éxito")
                        e.reloadOtRowDetails()       
                    }
                }) : F.msgError("No tiene suficientes permisos");
            },
            delTask: function() {
                var e = this;
                C.Session.getUser().role_id >= 3 || C.Session.getUser().area_id == 2? 
                  F.msgConfirm("¿Desea eliminar esta Tarea?", function() {
                      $.ajax({
                          type: "DELETE",
                          url: "/ottask/" + e.getSelectionID(),
                          success: function(t) {
                            if(t.b==!0){
                              F.msgOK("La Tarea Fué eliminada con Éxito")
                              setTimeout(function(){
                                window.location = "/#/ots/audit/Ot_"+t.a.ot_id//e.getSelectionID();
                                location.reload()
                              }, 1e3);
                            }else{
                              F.msgError('La tarea no se puede eliminar')
                            }
                          }
                      });
                  }) 
                : 
                  F.msgError("No tiene suficientes permisos");
            },
            cancelEditTask: function() {
                location.reload();
            }
        });
    }), e.define("/views/ottask/OtTaskResources.js", function(e, t, n, r, i, s) {
        C.View.OtTaskResources = Backbone.View.extend({
            name: "ottask_resource",
            initialize: function() {
                this.getResources();
            },
            render: function(e) {
                var t = $("<div>", {
                    "class": "row_subdetail"
                }), n = $("<table>");
                _.each(e, function(e) {
                    $(n).append('<tr><td width="15%">' + e.employee + "</td>" + '<td width="15%">' + e.employee_hours + ":" + e.employee_minutes + " hs.</td>" + '<td width="70%">' + e.materials_tools + "</td>" + "</tr>");
                }), $(t).append(n), $(this.options.task_row).append(t);
            },
            getResources: function() {
                var e = this;
                $.ajax({
                    url: "/ottask/resources/" + e.options.task.id,
                    success: function(t) {
                        t.result === !0 ? e.render(t.resources) : F.msgError("Ocurrió un error al buscar los Recursos de la Tarea");
                    }
                });
            }
        });
    }), e.define("/views/person/Person.js", function(e, t, n, r, i, s) {
        C.View.Person = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.persons = new C.Collection.Persons(null, {
                    view: this
                }), this.persons.fetch({
                    success: function(t, n) {
                        e.person_table = new C.View.PersonTable({
                            el: $("#person_left"),
                            collection: t
                        }), e.person_form = new C.View.PersonForm({
                            el: $("#person_right"),
                            model: e.model,
                            collection: t,
                            person_table: e.person_table
                        });
                    }
                });
            }
        });
    }), e.define("/views/person/PersonTable.js", function(e, t, n, r, i, s) {
        C.View.PersonTable = Backbone.View.extend({
            name: "person",
            source: "/person",
            headers: [ "ID", "Nombre", "Apellido", "Teléfono", "E-mail" ],
            attrs: [ "id", "firstname", "lastname", "phone", "email" ],
            data: null,
            hidden_columns: [ "name" ],
            initialize: function() {
                t = this;
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.assignValuesToForm($(".person_form"), e);
                });
                /*$(document).on('click', '.person_table tbody tr', function(evento){
                    t.selectRow(evento)
                })*/

            },
            events: {
                "click .person_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            }
        });
    }), e.define("/views/person/PersonForm.js", function(e, t, n, r, i, s) {
        C.View.PersonForm = Backbone.View.extend({
            name: "person_form",
            title: "Datos de la Persona",
            fields: {
                firstname: {
                    label: "Nombre",
                    required: !0,
                    check: "alpha"
                },
                lastname: {
                    label: "Apellido",
                    required: !0,
                    check: "alpha"
                },
                phone: {
                    label: "Teléfono"
                },
                email: {
                    label: "E-mail",
                    placeholder: "E-mail (ej.: coop@coopertei.com.ar)",
                    required: !0,
                    check: "email"
                }
            },
            isCRUD: !0,
            initialize: function() {
                F.createForm(this);
            },
            events: {
                "click .person_form .BUTTON_create": "addPerson",
                "click .person_form .BUTTON_save": "editPerson",
                "click .person_form .BUTTON_delete": "delPerson"
            },
            getTable: function() {
                return this.options.person_table;
            },
            getDataTable: function() {
                return this.getTable().datatable;
            },
            getSelectionID: function() {
                return parseInt($(".selection_id").val());
            },
            getSelectionRow: function() {
                return this.getTable().selected_row;
            },
            addTableRow: function(e) {
                var t = F.JSONValuesToArray($(".person_form").serializeObject());
                t.unshift(e), this.getDataTable().fnAddData(t);
            },
            editTableRow: function(e) {},
            addPerson: function() {
                var e = this;
                $.ajax({
                    type: 'POST',
                    data: $(".person_form").serializeObject(),
                    url: '/person',
                    success: function(){
                        F.cleanForm('.person_form');
                        F.msgOK('La persona ha sido creada');
                        F.reloadDataTable('.person_table');
                    }
                })
            },
            editPerson: function() {
                var e = this;
                $.ajax({
                    url: '/person/'+this.getSelectionID(),
                    data: $(".person_form").serializeObject(),
                    type: 'PUT',
                    success: function(){
                        F.cleanForm('.person_form');
                        F.msgOK("La persona ha sido actualizada");
                        F.reloadDataTable('.person_table'); 
                    }
                })
            },
            delPerson: function() {
                var e = this;
                F.msgConfirm("¿Desea eliminar a esta Persona?", function() {
                    $.ajax({
                        url: '/person/'+e.getSelectionID(),
                        type: 'DELETE',
                        success: function(){
                            F.cleanForm('.person_form');
                            F.msgOK("La persona ha sido eliminada");
                            F.reloadDataTable('.person_table')
                        }
                    })
                });
            }
        });
    }), 
    // Vista listado de OT
    e.define("/views/reports/Ot.js", function(e, t, n, r, i, s) {
        C.View.OtReport = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.otreports = new C.Collection.OtReport(null, {
                    view: this
                }), this.otreports.fetch({
                    success: function(t, n) {
                        e.otReport_table = new C.View.OtReportTable({
                            el: $("#report_left"),
                            collection: t
                        });
                    }
                });
            }
        });
    }), e.define("/views/reports/OtTable.js", function(e, t, n, r, i, s) {
        C.View.OtReportTable = Backbone.View.extend({
            name: "otReport",
            headers: [ "ID", "Nombre", "Apellido", "Teléfono", "E-mail" ],
            attrs: [ "id", "firstname", "lastname", "phone", "email" ],
            data: null,
            hidden_columns: [ "name" ],
            initialize: function() {
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    //F.assignValuesToForm($(".person_form"), e);
                });
            },
            events: {
                "click .otReport_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            }
        });
    }), 
    //Termina vista OT
    e.define("/views/personnel/Employee.js", function(e, t, n, r, i, s) {
        C.View.Employee = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.employees = new C.Collection.Employees(null, {
                    view: this
                }), this.employees.fetch({
                    success: function(t, n) {
                        e.employee_table = new C.View.EmployeeTable({
                            el: $("#employee_left"),
                            collection: t
                        }), e.employee_form = new C.View.EmployeeForm({
                            el: $("#employee_right"),
                            model: e.model,
                            collection: t,
                            employee_table: e.employee_table
                        });
                    }
                });
            },
            events: {}
        });
    }), e.define("/views/personnel/EmployeeTable.js", function(e, t, n, r, i, s) {
        C.View.EmployeeTable = Backbone.View.extend({
            name: "employee",
            source: "/employee",
            headers: [ "ID", "Legajo", "ID Persona", "Nombre", "ID Area", "Área", "Horario entrada ID", "Horario salida ID", "Horario", "Interno" ],
            attrs: [ "id", "payroll_number", "person_id", "person", "area_id", "area", "schedule_ini_id", "schedule_end_id", "schedule", "intern" ],
            hidden_columns:['person_id', 'area_id', 'schedule_ini_id', 'schedule_end_id'],
            data: null,
            rowHandler: function(e, t) {
                var n = $("<img>", {
                    src: "/images/icons/" + t.area_id + ".png",
                    "class": "row_icon"
                });
                $($(e).children()[5]).prepend(n);
            },
            initialize: function() {
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.assignValuesToForm($(".employee_form"), e);
                });
            },
            events: {
                "click .employee_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            }
        });
    }), e.define("/views/personnel/EmployeeForm.js", function(e, t, n, r, i, s) {
        C.View.EmployeeForm = Backbone.View.extend({
            name: "employee_form",
            title: "Datos del Empleado",
            fields: {
                payroll_number: {
                    label: "Legajo",
                    check: "integer"
                },
                person_id: {
                    label: "Apellido y Nombre",
                    type: "select"
                },
                person: {
                    type: "hidden"
                },
                area_id: {
                    label: "Área",
                    type: "select"
                },
                area: {
                    type: "hidden"
                },
                schedule_ini_id: {
                    label: "Horario de entrada",
                    type: "select"
                },
                schedule_end_id: {
                    label: "Horario de salida",
                    type: "select"
                },
                intern: {
                    label: "Interno",
                    check: "integer"
                }
            },
            isCRUD: !0,
            relations: {
                persons: null,
                areas: null,
                schedule_inis: null,
                schedule_ends: null
            },
            initialize: function() {
                var e = this;
                F.getAllFromModel("person", function(t) {
                    e.relations.persons = t.data, F.getAllFromModel("area", function(t) {
                        e.relations.areas = t, F.getAllFromModel("schedule", function(t) {
                            e.relations.schedule_inis = t, e.relations.schedule_ends = t, F.createForm(e);
                        });
                    });
                });
            },
            events: {
                "click .employee_form .BUTTON_create": "addEmployee",
                "click .employee_form .BUTTON_save": "editEmployee",
                "click .employee_form .BUTTON_delete": "delEmployee"
            },
            getTable: function() {
                return this.options.employee_table;
            },
            getDataTable: function() {
                return this.getTable().datatable;
            },
            getSelectionID: function() {
                return parseInt($(".selection_id").val());
            },
            getSelectionRow: function() {
                return this.getTable().selected_row;
            },
            addTableRow: function(e) {
                return;
                var t;
            },
            editTableRow: function(e) {},
            addEmployee: function() {
                var e = this;
                this.collection.create($(".employee_form").serializeObject(), {
                    success: function(t, n) {
                        F.cleanForm('.employee_form');
                        F.msgOK('El empleado ha sido creado/a');
                        F.reloadDataTable('.employee_table');
                    }
                });
            },
            editEmployee: function() {
                var e = this;
                $.ajax({
                    type: 'PUT',
                    data: $('.employee_form').serializeObject(),
                    url: '/employee/'+e.getSelectionID(),
                    success: function(){
                        F.cleanForm('.employee_form');
                        F.msgOK('El empleado ha sido actualizado/a');
                        F.reloadDataTable('.employee_table');
                    }
                })
            },
            delEmployee: function() {
                var e = this;
                F.msgConfirm("¿Desea eliminar a este Empleado?", function() {
                    $.ajax({
                        type: 'DELETE',
                        url: '/employee/'+e.getSelectionID(),
                        success: function(){
                            F.cleanForm('.employee_form');
                            F.msgOK('El empleado ha sido eliminado/a');
                            F.reloadDataTable('.employee_table');
                        }
                    })
                });
            }
        });
    }), e.define("/views/personnel/Inout.js", function(e, t, n, r, i, s) {
        C.View.Inout = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.inouts = new C.Collection.Inouts(null, {
                    view: this
                }), this.inouts.fetch({
                    success: function(t, n) {
                        e.inout_table = new C.View.InoutTable({
                            el: $("#inout_left"),
                            collection: t
                        }), e.inout_form = new C.View.InoutForm({
                            el: $("#inout_right"),
                            model: e.model,
                            collection: t,
                            inout_table: e.inout_table
                        });
                    }
                });
            }
        });
    }), e.define("/views/personnel/InoutTable.js", function(e, t, n, r, i, s) {
        C.View.InoutTable = Backbone.View.extend({
            name: "inout",
            source: "/inout",
            headers: [ "ID", "ID Empleado", "Empleado", "Fecha y Hora Autorizadas", "Egreso", "Reingreso" ],
            attrs: [ "id", "employee_id", "employee", "authorized", "out", "comeback" ],
            hidden_columns: ['employee_id'],
            data: null,
            rowHandler: function(e, t) {
                console.log(e)
                console.log(t)
                function n(n, r, i) {
                    console.log(r)
                    var s = $(e).find("td")[r], o = $("<input>", {
                        type: "checkbox",
                        "class": n + "_" + t.id + "_checkbox"
                    });
                    console.log()
                    $(o).on("click", function() {
                        if(C.Session.isVigilance() || C.Session.isSysadmin()){
                          F.msgConfirm("¿Está seguro?", function() {
                              i(t, function(e) {
                                  $(s).empty().append(e);
                                  F.reloadDataTable('.inout_table')
                              });
                          }, function() {
                              $(o).attr("checked", !1);
                          });
                        }
                    }), $(s).empty().append(o);
                    console.log(s)
                }
                var r = this, i = $("inout_table").dataTable();
                t.out === null ? n("out", 2, r.registerOut) : t.comeback === null && n("comeback", 3, r.registerComeback);
            },
            initialize: function() {
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.assignValuesToForm($(".inout_form"), e);
                });
            },
            events: {
                "click .inout_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            },
            registerOut: function(e, t) {
                $.ajax({
                    url: "/inout/out/" + e.id,
                    success: function(e) {
                        t(e);
                    }
                });
            },
            registerComeback: function(e, t) {
                $.ajax({
                    url: "/inout/comeback/" + e.id,
                    success: function(e) {
                        t(e);
                    }
                });
            }
        });
    }), e.define("/views/personnel/InoutHistory.js", function(e, t, n, r, i, s) {
        C.View.InoutHistory = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.inouts = new C.Collection.InoutHistorys(null, {
                    view: this
                }), this.inouts.fetch({
                    success: function(t, n) {
                        e.inout_table = new C.View.InoutHistoryTable({
                            el: $("#inout_left"),
                            collection: t
                        });
                    }
                });
            }
        });
    }), e.define("/views/personnel/InoutHistoryTable.js", function(e, t, n, r, i, s) {
        C.View.InoutHistoryTable = Backbone.View.extend({
            name: "inout",
            source: "/inouthistory",
            headers: [ "ID", "ID Empleado", "Empleado", "Fecha y Hora Autorizadas", "Egreso", "Reingreso" ],
            attrs: [ "id", "employee_id", "employee", "authorized", "out", "comeback" ],
            hidden_columns: ['employee_id'],
            data: null,
            initialize: function() {
                this.data = this.options.collection, F.createDataTable(this);
            }
        });
    }), e.define("/views/personnel/InoutForm.js", function(e, t, n, r, i, s) {
        C.View.InoutForm = Backbone.View.extend({
            name: "inout_form",
            title: "Datos de la Autorización",
            fields: {
                employee_id: {
                    label: "Empleado",
                    type: "select"
                },
                authorized: {
                    label: "Fecha y hora a autorizar",
                    type: "datetimepicker",
                    options: {
                        timeFormat: " - hh:mm"
                    }
                },
                permitted: {
                    label: "Permitido",
                    type: "select_yn",
                    default_value: "n"
                }
            },
            isCRUD: !0,
            relations: {
                employees: null
            },
            initialize: function() {
                var e = this;
                F.getAllFromModel("employee", function(t) {
                    e.relations.employees = t.data, F.createForm(e, $("#inout_right"), function() {
                        C.Session.doIfVigilance(function() {
                            $(".inout_form select[name=permitted], .inout_form label[for=permitted]").remove(), $($(".inout_form .chzn-container")[1]).remove();
                        });
                    });
                });
            },
            events: {
                "click .inout_form .BUTTON_create": "addInout",
                "click .inout_form .BUTTON_save": "editInout",
                "click .inout_form .BUTTON_delete": "delInout"
            },
            getTable: function() {
                return this.options.inout_table;
            },
            getDataTable: function() {
                return this.getTable().datatable;
            },
            getSelectionID: function() {
                return parseInt($(".selection_id").val());
            },
            getSelectionRow: function() {
                return this.getTable().selected_row;
            },
            addInout: function() {
                var e = this;
                this.collection.create($(".inout_form").serializeObject(), {
                    success: function(t, n) {
                        F.cleanForm('.inout_form');
                        F.msgOK("La Autorización ha sido creada");
                        F.reloadDataTable('.inout_table');
                    }
                });
            },
            editInout: function() {
                var e = this;
                $.ajax({
                    type: 'PUT',
                    data: $('.inout_form').serializeObject(),
                    url: '/inout/'+e.getSelectionID(),
                    success: function(){
                        F.cleanForm('.inout_form');
                        F.msgOK('La Autorización ha sido actualizada');
                        F.reloadDataTable('.inout_table');
                    }
                })
            },
            delInout: function() {
                var e = this;
                F.msgConfirm("¿Desea eliminar a esta Autorización?", function() {
                    $.ajax({
                        type: 'DELETE',
                        url: '/inout/'+e.getSelectionID(),
                        success: function(){
                            F.cleanForm('.inout_form');
                            F.msgOK('La Aurorización ha sido eliminada');
                            F.reloadDataTable('.inout_table');
                        }
                    })
                });
            }
        });
    }), e.define("/views/intervention/Intervention.js", function(e, t, n, r, i, s) {
        C.View.Intervention = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.interventions = new C.Collection.Interventions(null, {
                    view: this
                }), this.interventions.fetch({
                    success: function(t, n) {
                        e.intervention_table = new C.View.InterventionTable({
                            el: $("#intervention_left"),
                            collection: t
                        }), e.intervention_form = new C.View.InterventionForm({
                            el: $("#intervention_right"),
                            model: e.model,
                            collection: t,
                            intervention_table: e.intervention_table
                        });
                    }
                });
            }
        });
    }), e.define("/views/intervention/InterventionTable.js", function(e, t, n, r, i, s) {
        C.View.InterventionTable = Backbone.View.extend({
            name: "intervention",
            source: "/intervention",
            headers: [ "ID", "Nombre", "Descripción" ],
            attrs: [ "id", "name", "description" ],
            data: null,
            initialize: function() {
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.assignValuesToForm($(".intervention_form"), e);
                });
            },
            events: {
                "click .intervention_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            }
        });
    }), e.define("/views/intervention/InterventionForm.js", function(e, t, n, r, i, s) {
        C.View.InterventionForm = Backbone.View.extend({
            name: "intervention_form",
            title: "Datos del Motivo de Intervención",
            fields: {
                name: {
                    label: "Nombre",
                    check: "alpha"
                },
                description: {
                    label: "Descripción",
                    check: "alpha"
                }
            },
            isCRUD: !0,
            initialize: function() {
                F.createForm(this);
            },
            events: {
                "click .intervention_form .BUTTON_create": "addIntervention",
                "click .intervention_form .BUTTON_save": "editIntervention",
                "click .intervention_form .BUTTON_delete": "delIntervention"
            },
            getTable: function() {
                return this.options.intervention_table;
            },
            getDataTable: function() {
                return this.getTable().datatable;
            },
            getSelectionID: function() {
                return parseInt($(".selection_id").val());
            },
            getSelectionRow: function() {
                return this.getTable().selected_row;
            },
            addTableRow: function(e) {
            },
            addIntervention: function() {
                var e = this;
                this.collection.create($(".intervention_form").serializeObject(), {
                    success: function(t, n) {
                        F.msgOK("La intervención ha sido creada");
                        F.cleanForm('.intervention_form')
                        F.reloadDataTable('.intervention_table')
                    }
                });
            },
            editIntervention: function() {
                var e = this;
                $.ajax({
                    type: 'PUT',
                    url: '/intervention/'+e.getSelectionID(),
                    data: $('.intervention_form').serializeObject(),
                    success: function(t, n){
                        F.msgOK("La intervención ha sido actualizada");
                        F.reloadDataTable('.intervention_table');
                    }
                })
            },
            delIntervention: function() {
                var e = this;
                F.msgConfirm("¿Desea eliminar este Motivo de Intervención?", function() {
                    $.ajax({
                        type: 'DELETE',
                        url: '/intervention/'+e.getSelectionID(),
                        success: function(){
                            F.msgOK("La intervención ha sido eliminada");
                            F.reloadDataTable('.intervention_table');
                        }
                    })
                });
            }
        });
    }), 
    //Vista de demoras
    e.define("/views/delay/Delay.js", function(e, t, n, r, i, s) {
        C.View.Delay = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                e.delay_table = new C.View.DelayTable({
                    el: $("#delay_left"),
                    collection: t
                }), e.delay_form = new C.View.DelayForm({
                    el: $("#delay_right"),
                    collection: t,
                    model: {},
                    delay_table: e.delay_table
                });
            }
        });
    }), e.define("/views/delay/DelayTable.js", function(e, t, n, r, i, s) {
        C.View.DelayTable = Backbone.View.extend({
            name: "delay",
            source: "/delay",
            headers: [ "ID", "Razón" ],
            attrs: [ "id", "reason" ],
            data: null,
            initialize: function() {
                F.createDataTable(this, function(e) {
                    F.assignValuesToForm($(".delay_form"), e);
                });
            },
            events: {
                "click .intervention_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            }
        });
    }), e.define("/views/delay/DelayForm.js", function(e, t, n, r, i, s) {
        C.View.DelayForm = Backbone.View.extend({
            name: "delay_form",
            title: "Datos de la demora",
            fields: {
                reason: {
                    label: "Razón",
                    check: "alpha"
                }
            },
            isCRUD: !0,
            initialize: function() {
                this.model.attributes = {reason: null}
                F.createForm(this);
            },
            events: {
                "click .delay_form .BUTTON_create": "addDelay",
                "click .delay_form .BUTTON_save": "editDelay",
                "click .delay_form .BUTTON_delete": "delDelay"
            },
            getTable: function() {
                return this.options.delay_table;
            },
            getDataTable: function() {
                return this.getTable().datatable;
            },
            getSelectionID: function() {
                return parseInt($(".selection_id").val());
            },
            getSelectionRow: function() {
                return this.getTable().selected_row;
            },
            addTableRow: function(e) {
            },
            addDelay: function() {
                var e = this;
                $.ajax({
                    type: 'POST',
                    url: '/delay/',
                    data: $('.delay_form').serializeObject(),
                    success: function(t, n) {
                        F.msgOK("La demora ha sido creada");
                        F.cleanForm('.delay_form')
                        F.reloadDataTable('.delay_table')
                    }
                });
            },
            editDelay: function() {
                var e = this;
                $.ajax({
                    type: 'PUT',
                    url: '/delay/'+e.getSelectionID(),
                    data: $('.delay_form').serializeObject(),
                    success: function(t, n){
                        F.msgOK("La demora ha sido actualizada");
                        F.reloadDataTable('.delay_table');
                    }
                })
            },
            delDelay: function() {
                var e = this;
                F.msgConfirm("¿Desea eliminar este Motivo de demora?", function() {
                    $.ajax({
                        type: 'DELETE',
                        url: '/delay/'+e.getSelectionID(),
                        success: function(){
                            F.msgOK("La demora ha sido eliminada");
                            F.reloadDataTable('.delay_table');
                        }
                    })
                });
            }
        });
    }),
    //Fin vista de demoras
    e.define("/views/profile/Profile.js", function(e, t, n, r, i, s) {
        C.View.Profile = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.profile = new C.Collection.Profiles(null, {
                    view: this
                }), this.profile.fetch({
                    success: function(t, n) {
                        var r = t.models[0], i = {
                            model: r,
                            el: $("#profile_left")
                        };
                        C.Session.roleID() !== 6 ? e.profile_employee_data = new C.View.ProfileEmployeeInfoCard(i) : $("#left").css({
                            paddingTop: "10px",
                            textAlign: "left"
                        }), e.profile_form = new C.View.ProfileForm(i), e.profile_password_form = new C.View.ProfilePasswordForm(i);
                    }
                });
            },
            events: {}
        });
    }), e.define("/views/profile/ProfileEmployeeInfoCard.js", function(e, t, n, r, i, s) {
        C.View.ProfileEmployeeInfoCard = Backbone.View.extend({
            name: "profile_employee_infocard",
            title: "Datos de Empleado",
            fieldnames: {
                payroll_number: "Legajo",
                area: "Área",
                intern: "Interno"
            },
            initialize: function() {
                F.createInfoCard(this, $("#profile_left"));
            }
        });
    }), e.define("/views/profile/ProfileForm.js", function(e, t, n, r, i, s) {
        C.View.ProfileForm = Backbone.View.extend({
            name: "profile_form",
            title: "Mis Datos",
            fields: {
                username: {
                    label: "Usuario",
                    attrs: {
                        disabled: "disabled"
                    }
                },
                firstname: {
                    label: "Nombre",
                    check: "alpha"
                },
                lastname: {
                    label: "Apellido",
                    check: "alpha"
                },
                phone: {
                    label: "Teléfono",
                    check: "integer"
                },
                email: {
                    label: "E-mail",
                    check: "email"
                }
            },
            buttons: {
                cancel: !0,
                save: !0
            },
            initialize: function() {
                F.createForm(this, $("#profile_left"));
            },
            events: {
                "click .profile_form .BUTTON_save": "saveProfile"
            },
            saveProfile: function() {
                F.V.email("E-mail", $(".profile_form input:text[name=email]"), function() {
                    $.ajax({
                        type: "PUT",
                        url: "/profile/" + C.Session.user_id,
                        data: $(".profile_form").serialize(),
                        success: function() {
                            F.msgOK("Datos actualizados exitosamente");
                        }
                    });
                }, function(e) {
                    F.msgError(e);
                });
            }
        });
    }), e.define("/views/profile/ProfilePasswordForm.js", function(e, t, n, r, i, s) {
        C.View.ProfilePasswordForm = Backbone.View.extend({
            name: "profile_password_form",
            title: "Cambiar Contraseña",
            fields: {
                password1: {
                    label: "Contraseña",
                    type: "password"
                },
                password2: {
                    label: "Contraseña (repetir)",
                    type: "password"
                }
            },
            buttons: {
                cancel: !0,
                save: !0
            },
            initialize: function() {
                F.createForm(this, $("#profile_left"));
            },
            events: {
                "click .profile_password_form .BUTTON_save": "savePassword"
            },
            savePassword: function() {
                var e = $(".profile_password_form input:password[name=password1]"), t = $(".profile_password_form input:password[name=password2]");
                F.V.passwords(e, t, function() {
                    $.ajax({
                        type: "POST",
                        url: "/profile/changePassword",
                        data: $(".profile_password_form").serialize(),
                        success: function() {
                            F.msgOK("Contraseña actualizada exitosamente");
                        }
                    });
                }, function(e) {
                    F.msgError(e);
                });
            }
        });
    }), e.define("/views/query/Query.js", function(e, t, n, r, i, s) {
        C.View.Query = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                this.query_predefined_list = new C.View.QueryPredefinedList({
                    el: $("#query_right"),
                    model: this.model
                });
            }
        });
    }), e.define("/views/query/QueryTable.js", function(e, t, n, r, i, s) {
        C.View.QueryTable = Backbone.View.extend({
            name: "query",
            source: "/query",
            headers: null,
            attrs: null,
            data: null,
            initialize: function() {
                this.data = this.options.collection, F.createDataTable(this);
            },
            events: {
                "click .query_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            }
        });
    }), e.define("/views/query/QueryForm.js", function(e, t, n, r, i, s) {
        C.View.QueryForm = Backbone.View.extend({
            name: "query_form",
            title: "Criterios de búsqueda",
            fields: {
                entity: {
                    label: "Entidad"
                }
            },
            isCRUD: !1,
            buttons: {
                query: !0
            },
            initialize: function() {
                F.createForm(this);
            },
            events: {
                "click .query_form .BUTTON_query": "doQuery"
            },
            getTable: function() {
                return this.options.person_table;
            },
            getDataTable: function() {
                return this.getTable().datatable;
            },
            getSelectionID: function() {
                return parseInt($(".selection_id").val());
            },
            getSelectionRow: function() {
                return this.getTable().selected_row;
            },
            doQuery: function() {
                $.ajax({
                    type: "POST",
                    url: "/query",
                    data: $(".query_form").serialize(),
                    success: function(e) {
                        new C.View.QueryTable({
                            el: $("#query_left"),
                            collection: e,
                            headers: [],
                            attrs: []
                        });
                    }
                });
            }
        });
    }), e.define("/views/query/QueryPredefinedList.js", function(e, t, n, r, i, s) {
        C.View.QueryPredefinedList = Backbone.View.extend({
            initialize: function() {
                this.template();
            },
            template: function() {
                var e = this, t = "";
                F.getAllFromModel("employee", function(n) {
                    _.each(n.data, function(e) {
                        t += '<option value="' + e.id + '">' + e.name + "</option>";
                    }), $(e.el).append('<h3>Productividad de empleados:</h3><form name="productivityEmployees"><select name="employee_ids[]" multiple="multiple">' + t + "</select>" + '<input type="button" class="graphEmployeeProducivity" value="Graficar" />' + "</form>");
                });
            },
            events: {
                "click #query_right .graphEmployeeProducivity": "getEmployeeTasksAndGraphThem"
            },
            getEmployeeTasksAndGraphThem: function() {
                var e = this;
                $("#query_chart").remove(), $("#query_left").append('<div id="query_chart"><svg></svg></div>'), $("#query_left").css({
                    height: "500px"
                }), $("#query_chart").css({
                    height: parseInt($("#query_left").css("height")) + "px",
                    minWidth: "100px",
                    minHeight: "100px"
                }), $.ajax({
                    type: "POST",
                    url: "/employee/tasksProductivity",
                    data: $("form[name=productivityEmployees]").serialize(),
                    success: function(t) {
                        t.result === !0 ? e.renderGraph(t.tasks_per_employee) : F.msgError("Ocurrió un error al recibir los datos pertinentes.");
                    }
                });
            },
            renderGraph: function(e) {
                if (e && e.length) {
                    var t = [];
                    _.each(e, function(e) {
                        var n = [], r = 1;
                        _.each(e.tasks, function(e) {
                            n.push({
                                x: r,
                                y: e.employee_hours + parseFloat("0" + e.employee_minutes / 60)
                            }), r += 1;
                        }), t.push({
                            key: e.employee,
                            values: n
                        });
                    }), nv.addGraph(function() {
                        var e = nv.models.lineWithFocusChart();
                        return d3.select("#query_chart svg").datum(t).transition().duration(500).call(e), nv.utils.windowResize(e.update), e;
                    });
                } else $("#query_left").css({
                    textAlign: "center",
                    paddingTop: "2em"
                }).html("<h3>No hay datos a reportar.</h3>");
            }
        });
    }), e.define("/views/task/Task.js", function(e, t, n, r, i, s) {
        C.View.Task = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.tasks = new C.Collection.Tasks(null, {
                    view: this
                }), this.tasks.fetch({
                    success: function(t, n) {
                        e.task_table = new C.View.TaskTable({
                            el: $("#task_left"),
                            collection: t
                        }), e.task_form = new C.View.TaskForm({
                            el: $("#task_right"),
                            model: e.model,
                            collection: t,
                            task_table: e.task_table
                        });
                    }
                });
            }
        });
    }), e.define("/views/task/TaskTable.js", function(e, t, n, r, i, s) {
        C.View.TaskTable = Backbone.View.extend({
            name: "task",
            source: "/task",
            headers: [ "ID", "Nombre", "Descripción", "prioridad", "ID Area", "Area" ],
            attrs: [ "id", "name", "description", "priority", "area_id", "area" ],
            hidden_columns: ['area_id'],
            data: null,
            initialize: function() {
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.assignValuesToForm($(".task_form"), e);
                });
            },
            events: {
                "click .task_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            }
        });
    }), e.define("/views/task/TaskForm.js", function(e, t, n, r, i, s) {
        C.View.TaskForm = Backbone.View.extend({
            name: "task_form",
            title: "Datos de la Tarea",
            fields: {
                name: {
                    label: "Nombre",
                    check: "alpha"
                },
                priority: {
                    label: "Prioridad",
                    check: "alpha"
                },
                description: {
                    label: "Descripción",
                    check: "alpha"
                },
                area_id: {
                    label: "Area",
                    type: "select"
                }
            },
            isCRUD: !0,
            relations: {
                areas: null
            },
            initialize: function() {
                var e = this;
                F.getAllFromModel("area", function(t) {
                    e.relations.areas = t, F.createForm(e);
                });
            },
            events: {
                "click .task_form .BUTTON_create": "addTask",
                "click .task_form .BUTTON_save": "editTask",
                "click .task_form .BUTTON_delete": "delTask"
            },
            getTable: function() {
                return this.options.task_table;
            },
            getDataTable: function() {
                return this.getTable().datatable;
            },
            getSelectionID: function() {
                return parseInt($(".selection_id").val());
            },
            getSelectionRow: function() {
                return this.getTable().selected_row;
            },
            addTask: function() {
                var e = this;
                this.collection.create($(".task_form").serializeObject(), {
                    success: function(t, n) {
                        F.cleanForm('.task_form');
                        F.msgOK("La tarea ha sido creada");
                        F.reloadDataTable('.task_table');
                    }
                });
            },
            editTask: function() {
                var e = this;
                $.ajax({
                    type: 'PUT',
                    data: $('.task_form').serializeObject(),
                    url: '/task/'+e.getSelectionID(),
                    success: function(){
                        F.cleanForm('.task_form');
                        F.msgOK('La tarea ha sido actualizada');
                        F.reloadDataTable('.task_table');
                    }
                })
            },
            delTask: function() {
                var e = this;
                F.msgConfirm("¿Desea eliminar a esta Tarea?", function() {
                    $.ajax({
                        type: 'DELETE',
                        url: '/task/'+e.getSelectionID(),
                        success: function(){
                            F.cleanForm('.task_form');
                            F.msgOK('La tarea ha sido eliminada');
                            F.reloadDataTable('.task_table');
                        }
                    })
                });
            }
        });
    }), e.define("/views/user/User.js", function(e, t, n, r, i, s) {
        C.View.User = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.users = new C.Collection.Users(null, {
                    view: this
                }), this.users.fetch({
                    success: function(t, n) {
                        e.user_table = new C.View.UserTable({
                            el: $("#user_left"),
                            collection: t
                        }), e.user_form = new C.View.UserForm({
                            el: $("#user_right"),
                            model: e.model,
                            collection: t,
                            user_table: e.user_table
                        });
                    }
                });
            }
        });
    }), e.define("/views/user/UserTable.js", function(e, t, n, r, i, s) {
        C.View.UserTable = Backbone.View.extend({
            name: "user",
            source: "/user",
            headers: [ "ID", "Usuario", "ID Empleado", "Empleado", "ID Rol", "Rol", "ID Area", "Area" ],
            attrs: [ "id", "username", "employee_id", "employee", "role_id", "role", "area_id", "area" ],
            hidden_columns: ['employee_id', 'role_id', 'area_id'],
            data: null,
            initialize: function() {
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.assignValuesToForm($(".user_form"), e);
                });
            },
            events: {
                "click .user_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            }
        });
    }), e.define("/views/user/UserForm.js", function(e, t, n, r, i, s) {
        C.View.UserForm = Backbone.View.extend({
            name: "user_form",
            title: "Datos del Usuario",
            fields: {
                username: {
                    label: "Usuario",
                    check: "alpha"
                },
                employee_id: {
                    label: "Empleado",
                    type: "select"
                },
                employee: {
                    type: "hidden"
                },
                role_id: {
                    label: "Rol",
                    type: "select"
                },
                role: {
                    type: "hidden"
                },
                area_id: {
                    label: "Area",
                    type: "select"
                },
                area: {
                    type: "hidden"
                }
            },
            isCRUD: !0,
            relations: {
                employees: null,
                roles: null,
                areas: null
            },
            initialize: function() {
                var e = this;
                F.getAllFromModel("employee", function(t) {
                    e.relations.employees = t.data, F.getAllFromModel("role", function(t) {
                        e.relations.roles = t, F.getAllFromModel("area", function(t) {
                            e.relations.areas = t;
                            F.createForm(e);
                        });
                    });
                });
            },
            events: {
                "click .user_form .BUTTON_create": "addUser",
                "click .user_form .BUTTON_save": "editUser",
                "click .user_form .BUTTON_delete": "delUser"
            },
            getTable: function() {
                return this.options.user_table;
            },
            getDataTable: function() {
                return this.getTable().datatable;
            },
            getSelectionID: function() {
                return parseInt($(".selection_id").val());
            },
            getSelectionRow: function() {
                return this.getTable().selected_row;
            },
            addTableRow: function(e) {
                return;
                var t;
            },
            editTableRow: function(e) {},
            addUser: function() {
                var e = this;
                $.ajax({
                    data: $('.user_form').serializeObject(),
                    type: 'POST',
                    url: '/user',
                    success: function(t, n){
                        F.cleanForm('.user_form')
                        if (t.result === !0) {
                            F.msgOK("El usuario ha sido creado/a");
                            F.reloadDataTable('.user_table');
                        } else F.msgError(t.error);
                    }
                })
            },
            editUser: function() {
                var e = this;
                $.ajax({
                    type: 'PUT',
                    url: '/user/'+e.getSelectionID(),
                    data: $('.user_form').serializeObject(),
                    success: function(t, n) {
                        F.cleanForm('.user_form')
                        F.msgOK("El usuario ha sido actualizado/a");
                        F.reloadDataTable('.user_table');
                    }
                })
            },
            delUser: function() {
                var e = this;
                F.msgConfirm("¿Desea eliminar a este Usuario?", function() {
                    $.ajax({
                        type: 'DELETE',
                        url: '/user/'+e.getSelectionID(),
                        success: function(){
                            F.cleanForm('.user_form')
                            F.msgOK("El usuario ha sido eliminado/a");
                            F.reloadDataTable('.user_table');
                        }
                    })
                });
            }
        });
    }), e.define("/views/errorreport/ErrorReport.js", function(e, t, n, r, i, s) {
        C.View.ErrorReport = Backbone.View.extend({
            el: $("body"),
            initialize: function() {
                var e = this;
                this.errorreports = new C.Collection.ErrorReports(null, {
                    view: this
                }), this.errorreports.fetch({
                    success: function(t, n) {
                        e.errorreport_table = new C.View.ErrorReportTable({
                            el: $("#errorreport_left"),
                            collection: t
                        }), e.errorreport_form = new C.View.ErrorReportInfoCard({
                            el: $("#errorreport_right"),
                            model: e.model,
                            collection: t,
                            errorreport_table: e.errorreport_table
                        });
                    }
                });
            }
        });
    }), e.define("/views/errorreport/ErrorReportTable.js", function(e, t, n, r, i, s) {
        C.View.ErrorReportTable = Backbone.View.extend({
            name: "errorreport",
            source: "/errorreport",
            headers: [ "ID", "Descripción", "Sugerencia", "Usuario", "Fecha" ],
            attrs: [ "id", "description", "suggestion", "user", "created_at" ],
            data: null,
            initialize: function() {
                this.data = this.options.collection, F.createDataTable(this, function(e) {
                    F.assignValuesToInfoCard($(".errorreport_infocard"), e);
                });
            },
            events: {
                "click .errorreport_table tr": "selectRow"
            },
            selectRow: function(e) {
                this.selected_row = $(e.currentTarget);
            }
        });
    }), e.define("/views/errorreport/ErrorReportInfoCard.js", function(e, t, n, r, i, s) {
        C.View.ErrorReportInfoCard = Backbone.View.extend({
            name: "errorreport_infocard",
            title: "Datos del Reporte de Error",
            fieldnames: {
                user: "Usuario",
                description: "Descripción",
                suggestion: "Sugerencia"
            },
            initialize: function() {
                var e = this;
                F.createInfoCard(e, $("#errorreport_right"));
            }
        });
    }), e.define("/views/errorreport/ErrorReportForm.js", function(e, t, n, r, i, s) {
        C.View.ErrorReportForm = Backbone.View.extend({
            name: "errorreport_form",
            title: "Datos del Cliente",
            fields: {
                description: {
                    label: "Descripción"
                },
                suggestion: {
                    label: "Sugerencia"
                }
            },
            relations: {
                modules: null
            },
            initialize: function() {
                var e = this;
                F.getAllFromModel("module", function(t) {
                    e.relations.modules = t;
                    var n = $("<form>", {
                        id: "errorreport_form"
                    });
                    $(n).append('<label for="description">Descripción:</label><textarea name="description" /><label for="suggestion">Sugerencia:</label><textarea name="suggestion" /><input type="button" value="Enviar reporte" class="BUTTON_create" />'), $("span#errorreport").addClass("opened"), $("body").append(n), $("#errorreport_form").resizable({
                        handles: "ne"
                    }), $("#errorreport_form .BUTTON_create").on("click", function() {
                        $.ajax({
                            type: "POST",
                            url: "/errorreport",
                            data: $("#errorreport_form").serialize(),
                            success: function(e) {
                                e === !0 ? $("#errorreport_form").fadeOut("slow", function() {
                                    $(this).remove(), $("span#errorreport").removeClass("opened");
                                }) : F.msgError("Ocurrió un error al enviar el reporte.");
                            }
                        });
                    }), $(n).fadeIn();
                });
            }
        });
    }), e.define("/Router.js", function(e, t, n, r, i, s) {
        $(function() {
            var e = Backbone.Router.extend({
                routes: {
                    "": "getIni",
                    "/ini/alerts": "getIni",
                    "/ini/alerts_tasks": "getIniTasks",
                    "/ots": "getOtAudit",
                    "/ots/audit": "getOtAudit",
                    "/ots/audit/:ot_number": "getOtAuditAt",
                    "/ots/admin": "getOtAdmin",
                    "/ots/inauguration": "getOtInauguration",
                    "/ots/plans": "getOtPlans",
                    "/ots/history": "getOtHistory",
                    "/materials": "getMaterialOrders",
                    "/materials/orders": "getMaterialOrders",
                    "/materials/stock": "getMaterialStock",
                    "/materials/history": "getMaterialHistory",
                    "/clients": "getClientAuthorizations",
                    "/clients/authorizations": "getClientAuthorizations",
                    "/clients/authorizationshistory": "getClientAuthorizationsHistory",
                    "/clients/payroll": "getClientPayroll",
                    "/personnel": "getPersonnelInouts",
                    "/personnel/inouts": "getPersonnelInouts",
                    "/personnel/history": "getPersonnelHistory",
                    "/personnel/payroll": "getPersonnelPayroll",
                    "/queries": "getQuery",
                    "/client/ots": "getClientOts",
                    "/client/events": "getClientEvents",
                    "/client/events/:ot_id": "getClientEvents",
                    "/client/notifications": "getClientNotifications",
                    "/reports": "getOtReport",
                    "/reports/ot": "getOtReport",
                    "/options/profile": "getProfile",
                    "/options/controlpanel": "getControlpanel",
                    "/crud/person": "getPerson",
                    "/crud/user": "getUser",
                    "/crud/intervention": "getIntervention",
                    "/crud/delay": "getDelay",
                    "/crud/task": "getTask",
                    "/crud/materialcategory": "getMaterialCategory",
                    "/crud/equipment": "getEquipment",
                    "/crud/errorreport": "getErrorReport",
                    "*undefined": "notFound"
                },
                getIni: function() {
                    var e = function() {
                        document.title = C.TITLE + "Alertas de Órdenes de Trabajo", this.alert_widget = C.Widget.Alert.initialize(), this.alert_view = new C.View.Alert({
                            model: new C.Model.Alert
                        }), F.R.highlightCurrentModule("ini/alerts");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 0 ], e);
                },
                getIniTasks: function() {
                    var e = function() {
                        document.title = C.TITLE + "Alertas de Tareas", this.alerttasks_widget = C.Widget.Alert.initialize(), this.alerttasks_view = new C.View.AlertTasks({
                            model: new C.Model.AlertTask
                        }), F.R.highlightCurrentModule("ini/alerts_tasks");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 0 ], e);
                },
                notFound: function() {
                    $("body").append('<div id="not_found_modal_window" style="display:none;"><h1 class="title">Ruta Inexistente</h1><br /><p class="margined">La ruta a la que está tratando de acceder es inválida.</p><p class="margined">Si ingresó manualmente la ruta, revísela detenidamente.</p><p class="margined">En caso de haber recibido esta notificación por otra razón, intente recargar el módulo en el que estaba trabajando ó volver al Inicio.</p><br /><a href="/" class="BUTTON_proceed lefty">Inicio</a><input type="button" class="BUTTON_cancel righty button" value="Cerrar" /></div>'), $(".button").button(), $("#not_found_modal_window .BUTTON_cancel").on("click", function() {
                        $.unblockUI();
                    }), $.blockUI({
                        message: $("#not_found_modal_window"),
                        css: {
                            top: "0",
                            left: "35%",
                            width: "28%",
                            border: "none",
                            padding: "1em",
                            cursor: "default"
                        },
                        onUnblock: function() {
                            $("#not_found_modal_window").remove();
                        }
                    });
                },
                notAllowed: function() {
                    var e = "";
                    C.Session.roleID() != 1 && (e = '<a href="/" class="BUTTON_proceed lefty">Inicio</a>'), $("body").append('<div id="not_allowed_modal_window" style="display:none;"><h1 class="title">No posee permisos   </h1><br /><p class="margined">Su usuario no está habilitado para visualizar la ruta a la que está tratando de acceder.</p><br />' + e + '<input type="button" class="BUTTON_cancel righty button" value="Cerrar" />' + "</div>"), $(".button").button(), $("#not_allowed_modal_window .BUTTON_cancel").on("click", function() {
                        $.unblockUI();
                    }), $.blockUI({
                        message: $("#not_allowed_modal_window"),
                        css: {
                            top: "0",
                            left: "35%",
                            width: "28%",
                            border: "none",
                            padding: "1em",
                            cursor: "default"
                        },
                        onUnblock: function() {
                            $("#not_allowed_modal_window").remove();
                        }
                    });
                },
                iniOtWidget: function() {
                    this.ot_widget = C.Widget.Ot.initialize();
                },
                getOtAudit: function() {
                    var e = function() {
                        document.title = C.TITLE + "Órdenes de Trabajo", this.iniOtWidget(), this.ot_view = new C.View.OtAudit({
                            model: new C.Model.Ot
                        }), F.R.highlightCurrentModule("ots/audit");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 2, 3, 4, 5, 7 ], e);
                },
                getOtAuditAt: function(e) {
                    var t = function() {
                        document.title = C.TITLE + "Órdenes de Trabajo", this.iniOtWidget(), this.ot_view = new C.View.OtAudit({
                            model: new C.Model.Ot,
                            open_ot_number_on_start: e
                        }), F.R.highlightCurrentModule("ots/audit");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 2, 3, 4, 5, 7 ], t);
                },
                getOtAdmin: function() {
                    var e = function() {
                        document.title = C.TITLE + "Órdenes de Trabajo", this.ot_widget = C.Widget.Ot.initialize(), this.ot_view = new C.View.OtAdmin({
                            model: new C.Model.Ot
                        }), F.R.highlightCurrentModule("ots/admin");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 1, 2, 3, 4, 5, 7 ], e);
                },
                getOtInauguration: function() {
                    var e = function() {
                        document.title = C.TITLE + "Órdenes de Trabajo", this.ot_widget = C.Widget.Ot.initialize(), this.ot_view = new C.View.OtInauguration({
                            model: new C.Model.Ot
                        }), F.R.highlightCurrentModule("ots/inauguration");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 1 ], e);
                },
                getOtPlans: function() {
                    var e = function() {
                        document.title = C.TITLE + "Planes de Tareas", this.ot_widget = C.Widget.Ot.initialize("plan"), this.ot_view = new C.View.OtPlans({
                            model: new C.Model.Plan
                        }), F.R.highlightCurrentModule("ots/plans");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 2, 3, 4, 5, 7 ], e);
                },
                getOtHistory: function() {
                    var e = function() {
                        document.title = C.TITLE + "Historial de Órdenes de Trabajo", this.ot_widget = C.Widget.Ot.initialize(), this.ot_view = new C.View.OtHistory({
                            model: new C.Model.Ot
                        }), F.R.highlightCurrentModule("ots/history");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 3, 4, 5, 7 ], e);
                },
                iniMaterialsWidget: function() {
                    this.material_widget = C.Widget.Material.initialize();
                },
                getMaterialOrders: function() {
                    var e = function() {
                        document.title = C.TITLE + "Pedidos de Materiales", this.iniMaterialsWidget(), this.material_view = new C.View.MaterialOrder({
                            model: new C.Model.MaterialOrder
                        }), F.R.highlightCurrentModule("materials/orders");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 0 ], e);
                },
                getMaterialStock: function() {
                    var e = function() {
                        document.title = C.TITLE + "Stock de Materiales", this.iniMaterialsWidget(), this.material_view = new C.View.MaterialStock({
                            model: new C.Model.Material
                        }), F.R.highlightCurrentModule("materials/stock");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 2, 3, 4, 5, 7 ], e);
                },
                getMaterialHistory: function() {
                    var e = function() {
                        document.title = C.TITLE + "Historial de uso de Materiales", this.iniMaterialsWidget(), this.material_view = new C.View.MaterialHistory({
                            model: new C.Model.Material
                        }), F.R.highlightCurrentModule("materials/history");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 3, 4, 5, 7 ], e);
                },
                iniClientWidget: function() {
                    this.client_widget = C.Widget.Client.initialize();
                },
                getClientAuthorizations: function() {
                    var e = function() {
                        document.title = C.TITLE + "Autorizaciones de Clientes", this.iniClientWidget(), this.client_view = new C.View.ClientAuthorization({
                            model: new C.Model.Authorization
                        }), F.R.highlightCurrentModule("clients/authorizations");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 2, 3, 4, 5, 7 ], e);
                },
                getClientAuthorizationsHistory: function() {
                    var e = function() {
                        document.title = C.TITLE + "Historial de Autorizaciones", this.iniClientWidget(), this.client_view = new C.View.ClientAuthorizationHistory({
                            model: new C.Model.AuthorizationHistory
                        }), F.R.highlightCurrentModule("clients/authorizationshistory");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 2, 3, 4, 5, 7 ], e);
                },
                getClientPayroll: function() {
                    var e = function() {
                        document.title = C.TITLE + "Nómina de Clientes", this.iniClientWidget(), this.client_view = new C.View.ClientPayroll({
                            model: new C.Model.Client
                        }), F.R.highlightCurrentModule("clients/payroll");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 2, 3, 4, 5, 7 ], e);
                },
                iniPersonnelWidget: function(e) {
                    this.personnel_widget = C.Widget.Personnel.initialize(e);
                },
                getPersonnelInouts: function() {
                    var e = function() {
                        document.title = C.TITLE + "Entradas/Salidas de Personal", this.iniPersonnelWidget("inout"), this.personnel_view = new C.View.Inout({
                            model: new C.Model.Inout
                        }), F.R.highlightCurrentModule("personnel/inouts");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 1, 3, 4, 5, 7 ], e);
                },
                getPersonnelHistory: function() {
                    var e = function() {
                        document.title = C.TITLE + "Historial de Entradas/Salidas", this.iniPersonnelWidget("inout"), this.personnel_view = new C.View.InoutHistory({
                            model: new C.Model.InoutHistory
                        }), F.R.highlightCurrentModule("personnel/history");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 4, 5 ], e);
                },
                getPersonnelPayroll: function() {
                    var e = function() {
                        document.title = C.TITLE + "Nómina de Personal", this.iniPersonnelWidget("employee"), this.personnel_view = new C.View.Employee({
                            model: new C.Model.Employee
                        }), F.R.highlightCurrentModule("personnel/payroll");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 4, 5 ], e);
                },
                iniQueryWidget: function() {
                    this.query_widget = C.Widget.Query.initialize();
                },
                getQuery: function() {
                    var e = function() {
                        document.title = C.TITLE + "Consultas", this.query_widget = C.Widget.Query.initialize(), this.query_view = new C.View.Query({
                            model: new C.Model.Query
                        }), F.R.highlightCurrentModule("queries/general");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 4, 5 ], e);
                },
                iniClientsWidget: function() {
                    this.clients_widget = C.Widget.Clients.initialize();
                },
                getClientOts: function() {
                    var e = function() {
                        document.title = C.TITLE + "Órdenes de Trabajo", this.iniClientsWidget(), this.clients_view = new C.View.ClientsOts({
                            model: new C.Model.ClientsOt
                        });
                    }.bind(this);
                    C.Session.doIfInRolesList([ 6 ], e);
                },
                getClientEvents: function(e) {
                    var t = function() {
                        document.title = C.TITLE + "Línea de Tiempo de Eventos", this.iniClientsWidget(), this.clients_view = new C.View.ClientsEvents({
                            model: new C.Model.ClientsOt,
                            ot_id: e
                        });
                    }.bind(this);
                    C.Session.doIfInRolesList([ 6 ], t);
                },
                getClientNotifications: function() {
                    var e = function() {
                        document.title = C.TITLE + "Notificaciones", this.iniClientsWidget(), this.clients_view = new C.View.ClientsNotifications({
                            model: new C.Model.ClientsNotification
                        });
                    }.bind(this);
                    C.Session.doIfInRolesList([ 6 ], e);
                },
                getProfile: function() {
                    var e = function() {
                        document.title = C.TITLE + "Perfil", this.profile_widget = C.Widget.Profile.initialize(), this.profile_view = new C.View.Profile({
                            model: new C.Model.Profile
                        }), F.R.highlightCurrentModule("options/profile");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 0 ], e);
                },
                getControlpanel: function() {
                    var e = function() {
                        document.title = C.TITLE + "Panel de Control", this.controlpanel_widget = C.Widget.CRUD.initialize(), this.controlpanel_view = new C.View.ControlPanel;
                    }.bind(this);
                    C.Session.doIfInRolesList([ 2, 4, 5, 7 ], e);
                },
                getPerson: function() {
                    var e = function() {
                        document.title = C.TITLE + "Personas", this.person_widget = C.Widget.CRUD.initialize("person"), this.person_view = new C.View.Person({
                            model: new C.Model.Person
                        }), F.R.highlightCurrentModule("crud/person");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 2, 4, 5 ], e);
                },
                getUser: function() {
                    var e = function() {
                        document.title = C.TITLE + "Usuarios", this.user_widget = C.Widget.CRUD.initialize("user"), this.user_view = new C.View.User({
                            model: new C.Model.User
                        }), F.R.highlightCurrentModule("crud/user");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 4, 5 ], e);
                },
                getIntervention: function() {
                    var e = function() {
                        document.title = C.TITLE + "Intervenciones", this.intervention_widget = C.Widget.CRUD.initialize("intervention"), this.intervention_view = new C.View.Intervention({
                            model: new C.Model.Intervention
                        }), F.R.highlightCurrentModule("crud/intervention");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 2, 4, 5 ], e);
                },
                getDelay: function(){
                    var e = function() {
                        document.title = C.TITLE + "Demoras", this.intervention_widget = C.Widget.CRUD.initialize("delay"), this.delay_view = new C.View.Delay({
                            //model: new C.Model.Delay
                        }), F.R.highlightCurrentModule("crud/delay");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 2, 4, 5 ], e);
                },
                getTask: function() {
                    var e = function() {
                        document.title = C.TITLE + "Tareas", this.task_widget = C.Widget.CRUD.initialize("task"), this.task_view = new C.View.Task({
                            model: new C.Model.Task
                        }), F.R.highlightCurrentModule("crud/task");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 2, 4, 5, 7 ], e);
                },
                getMaterialCategory: function() {
                    var e = function() {
                        document.title = C.TITLE + "Categorías de Materiales", this.materialcategory_widget = C.Widget.CRUD.initialize("materialcategory"), this.materialcategory_view = new C.View.MaterialCategory({
                            model: new C.Model.MaterialCategory
                        }), F.R.highlightCurrentModule("crud/materialcategory");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 2, 4, 5, 7 ], e);
                },
                getEquipment: function() {
                    var e = function() {
                        document.title = C.TITLE + "Equipos", this.equipment_widget = C.Widget.CRUD.initialize("equipment"), this.equipment_view = new C.View.Equipment({
                            model: new C.Model.Equipment
                        }), F.R.highlightCurrentModule("crud/equipment");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 2, 4, 5, 7 ], e);
                },
                getErrorReport: function() {
                    var e = function() {
                        document.title = C.TITLE + "Reportes de Erorres", this.errorreport_widget = C.Widget.CRUD.initialize("errorreport"), this.errorreport_view = new C.View.ErrorReport({
                            model: new C.Model.ErrorReport
                        }), F.R.highlightCurrentModule("crud/errorreport");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 5 ], e);
                },
                getOtReport: function() {
                    var e = function() {
                        document.title = C.TITLE + "Listado de OT", this.otreport_widget = C.Widget.Report.initialize(), this.otreport_view = new C.View.OtReport({
                            model: new C.Model.OtReport
                        }), F.R.highlightCurrentModule("reports/ot");
                    }.bind(this);
                    C.Session.doIfInRolesList([ 5 ], e);
                }
            });
            C.Router = new e, Backbone.history.start();
        });
    }), e.define("/UI.js", function(e, t, n, r, i, s) {
        $(function() {
            $(document).ajaxError(function(e, t, n) {
                F.msgErrorTop("Error de servidor.<br />Recargue la aplicación e intente nuevamente");
            }), $(document).on("keyup", function(e) {
                //e.which == 27 && location.reload();//&& $.unblockUI(); en lugar del reload()
            }), $("#logout_button").on("click", function() {
                F.msgConfirm("¿Realmente desea salir?", function() {
                    window.location = "/logout";
                });
            }), window.setInterval(function() {
                $("#date").text(moment().format("DD/MM/YYYY - HH:mm:ss"));
            }, 1e3), $(".button").button(), $(".tabs").tabs(), $("#errorreport").on("click", function() {
                $("#errorreport_form").length ? $("#errorreport_form").fadeOut("slow", function() {
                    $(this).remove(), $("span#errorreport").removeClass("opened");
                }) : new C.View.ErrorReportForm;
            }), $("#expandup").on("click", function() {
                $("#head").css("display") === "block" ? ($("#head").css({
                    display: "none"
                }), $("#left, #right").css({
                    top: 0
                }), $("#expandup").attr("src", "/images/expanddown.gif")) : ($("#head").css({
                    display: "block"
                }), $("#left, #right").css({
                    top: "85px"
                }), $("#expandup").attr("src", "/images/expandup.gif"));
            }), $("#expandright").on("click", function() {
                $("#right").css("display") === "block" ? ($("#right").css({
                    display: "none"
                }), $("#left").css({
                    width: "100%"
                }), $("#expandright").attr("src", "/images/expandleft.gif")) : ($("#right").css({
                    display: "block"
                }), $("#left").css({
                    width: "75%"
                }), $("#expandright").attr("src", "/images/expandright.gif"));
            }), $("#fullscreen").on("click", function() {
                screenfull.isFullscreen ? (screenfull.exit(), $("#fullscreen").attr("src", "/images/fullscreenno.png")) : (screenfull.request(), $("#fullscreen").attr("src", "/images/fullscreenyes.png"));
            });
        });
    }), e.define("/main.js", function(e, t, n, r, i, s) {
        window.F = {
            V: {},
            R: {},
            M: {}
        }, window.C = {
            TITLE: "COOPERTEI | ",
            LOADING_MSG: "Cargando...",
            Session: {
                userID: function() {
                    return parseInt($("#session_user_id").html());
                },
                username: function() {
                    return $("#session_username").html();
                },
                roleID: function() {
                    return parseInt($("#session_role_id").html());
                },
                areaID: function() {
                    return parseInt($("#session_area_id").html());
                },
                getUser: function() {
                    return {
                        id: C.Session.userID(),
                        username: C.Session.username,
                        role_id: C.Session.roleID(),
                        area_id: C.Session.areaID()
                    };
                },
                isBoss: function() {
                    return C.Session.getUser().role_id == 7;
                },
                isClient: function() {
                    return C.Session.getUser().role_id == 6;
                },
                isSysadmin: function() {
                    return C.Session.getUser().role_id == 5;
                },
                isAdmin: function() {
                    return C.Session.getUser().role_id == 4;
                },
                isSupervisor: function() {
                    return C.Session.getUser().role_id == 3;
                },
                isOperator: function() {
                    return C.Session.getUser().role_id == 2;
                },
                isVigilance: function() {
                    return C.Session.getUser().role_id == 1;
                },
                doIfBoss: function(e) {
                    C.Session.isBoss() && e(C.Session.getUser());
                },
                doIfClient: function(e) {
                    C.Session.isClient() && e(C.Session.getUser());
                },
                doIfSysadmin: function(e) {
                    C.Session.isSysadmin() && e(C.Session.getUser());
                },
                doIfAdmin: function(e) {
                    C.Session.isAdmin() && e(C.Session.getUser());
                },
                doIfSupervisor: function(e) {
                    C.Session.isSupervisor() && e(C.Session.getUser());
                },
                doIfOperator: function(e) {
                    C.Session.isOperator() && e(C.Session.getUser());
                },
                doIfVigilance: function(e) {
                    C.Session.isVigilance() && e(C.Session.getUser());
                },
                doIfInRolesList: function(e, t, n) {
                    if (_.indexOf(e, 0) != -1) t(); else {
                        var r = !1, i = [ null, "isVigilance", "isOperator", "isSupervisor", "isAdmin", "isSysadmin", "isClient", "isBoss" ];
                        _.each(e, function(e) {
                            r = r || C.Session[i[e]]();
                        }), r ? t() : n !== !0 && C.Router.notAllowed();
                    }
                }
            },
            Dataset: {},
            Model: {},
            Collection: {},
            View: {},
            Widget: {},
            Router: null
        }, e("./F.backbone"), e("./F.basics"), e("./F.validations"), e("./F.widgets"), e("./widgets/Alert"), e("./widgets/Client"), e("./widgets/Clients"), e("./widgets/CRUD"), e("./widgets/Material"), e("./widgets/News"), e("./widgets/Ot"), e("./widgets/Personnel"), e("./widgets/Profile"), e("./widgets/Query"), e("./widgets/Reports"), e("./models/Alert"), e("./models/AlertTask"), e("./models/Authorization"), e("./models/AuthorizationHistory"), e("./models/Client"), e("./models/ClientsOt"), e("./models/ClientsNotification"), e("./models/Employee"), e("./models/ErrorReport"), e("./models/Inout"), e("./models/InoutHistory"), e("./models/Intervention"), e("./models/Material"), e("./models/MaterialCategory"), e("./models/MaterialOrder"), e("./models/MaterialHistory"), e("./models/Module"), e("./models/Equipment"), e("./models/News"), e("./models/Ot"), e("./models/OtHistory"), e("./models/OtTask"), e("./models/OtReport"), e("./models/Person"), e("./models/Plan"), e("./models/Profile"), e("./models/Query"), e("./models/Task"), e("./models/User"), e("./views/alert/Alert"), e("./views/alert/AlertTable"), e("./views/alert/AlertInfoCard"), e("./views/alert/AlertTasks"), e("./views/alert/AlertTasksTable"), e("./views/alert/AlertTasksInfoCard"), e("./views/client/ClientAuthorization"), e("./views/client/ClientAuthorizationTable"), e("./views/client/ClientAuthorizationInfoCard"), e("./views/client/ClientAuthorizationOptions"), e("./views/client/ClientAuthorizationHistory"), e("./views/client/ClientAuthorizationHistoryTable"), e("./views/client/ClientAuthorizationHistoryInfoCard"), e("./views/client/ClientPayroll"), e("./views/client/ClientPayrollTable"), e("./views/client/ClientPayrollForm"), e("./views/clients/ClientsEvents"), e("./views/clients/ClientsNotifications"), e("./views/clients/ClientsOts"), e("./views/clients/ClientsOtsTable"), e("./views/controlpanel/ControlPanel"), e("./views/material/MaterialStock"), e("./views/material/MaterialStockTable"), e("./views/material/MaterialStockForm"), e("./views/material/MaterialOrder"), e("./views/material/MaterialOrderTable"), e("./views/material/MaterialOrderInfoCard"), e("./views/material/MaterialOrderOptions"), e("./views/material/MaterialCreateOrder"), e("./views/materialcategory/MaterialCategory"), e("./views/materialcategory/MaterialCategoryTable"), e("./views/materialcategory/MaterialCategoryForm"), e("./views/material/MaterialHistory"), e("./views/material/MaterialHistoryTable"), e("./views/equipment/Equipment"), e("./views/equipment/EquipmentTable"), e("./views/equipment/EquipmentForm"), e("./views/news/News"), e("./views/news/NewsFeed"), e("./views/ot/OtAdmin"), e("./views/ot/OtInauguration"), e("./views/ot/OtAdminConcludeForm"), e("./views/ot/OtAdminTable"), e("./views/ot/OtAdminForm"), e("./views/ot/OtAdminOptions"), e("./views/ot/OtAudit"), e("./views/ot/OtAuditAddTask"), e("./views/ot/OtAuditToggleTaskState"), e("./views/ot/OtAuditForm"), e("./views/ot/OtAuditInfoCard"), e("./views/ot/OtAuditOptions"), e("./views/ot/OtAuditTable"), e("./views/ot/OtHistory"), e("./views/ot/OtHistoryTable"), e("./views/ot/OtHistoryInfoCard"), e("./views/ot/OtPlans"), e("./views/ot/OtPlansTable"), e("./views/ot/OtPlansForm"), e("./views/ottask/OtTaskForm"), e("./views/ottask/OtTaskResources"), e("./views/reports/Ot"), e("./views/reports/OtTable"), e("./views/person/Person"), e("./views/person/PersonTable"), e("./views/person/PersonForm"), e("./views/personnel/Employee"), e("./views/personnel/EmployeeTable"), e("./views/personnel/EmployeeForm"), e("./views/personnel/Inout"), e("./views/personnel/InoutTable"), e("./views/personnel/InoutHistory"), e("./views/personnel/InoutHistoryTable"), e("./views/personnel/InoutForm"), e("./views/intervention/Intervention"), e("./views/delay/Delay"), e("./views/delay/DelayTable"), e("./views/delay/DelayForm"), e("./views/intervention/InterventionTable"), e("./views/intervention/InterventionForm"), e("./views/profile/Profile"), e("./views/profile/ProfileEmployeeInfoCard"), e("./views/profile/ProfileForm"), e("./views/profile/ProfilePasswordForm"), e("./views/query/Query"), e("./views/query/QueryTable"), e("./views/query/QueryForm"), e("./views/query/QueryPredefinedList"), e("./views/task/Task"), e("./views/task/TaskTable"), e("./views/task/TaskForm"), e("./views/user/User"), e("./views/user/UserTable"), e("./views/user/UserForm"), e("./views/errorreport/ErrorReport"), e("./views/errorreport/ErrorReportTable"), e("./views/errorreport/ErrorReportInfoCard"), e("./views/errorreport/ErrorReportForm"), e("./Router"), e("./UI");
    }), e("/main.js");
})();
