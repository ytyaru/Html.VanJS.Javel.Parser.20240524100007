/* ruby_enabler.js ver 2.0 last modified @ Feb 06 2015
   more infomation -> http://freefielder.jp/ruby/
   (c)2015 tyz@freefielder.jp
	 ruby_enabler.js is distributed under the terms of the MIT license
	   http://opensource.org/licenses/mit-license.php
  * Do not remove this copyright message *
*/
var ruby_enabler = {
    execute: function() {
        var e, t, d, n, r, i = ruby_enabler,
            l = navigator.userAgent.toLowerCase();
        if (d = window.opera ? opera.version().replace(/\d$/, "") - 0 : parseFloat((/(?:ie |fox\/|ome\/|ion\/|rv:)(\d+\.\d)/.exec(l) || [, 0])[1]), /trident/.test(l)) {
            if (document.documentMode <= 8) return !1;
            i.createSS = i.createSS_ie, i.loose = i.loose_ie, i.strict = i.strict_ie, i.dsRuby_detect = i.dsRuby_detect_ie, i.measure = i.measure_ie
        } else /webkit/.test(l) ? !/chrome/.test(l) && /safari/.test(l) && 7 > d ? (i.dsRuby_detect = i.dsRuby_detect_ie, i.measure = i.measure_s6) : /chrome/.test(l) && 31 > d && (i.dsRuby_detect = i.dsRuby_detect_ie) : (33 > d ? (i.dsRuby_detect = i.dsRuby_detect_ie, i.createSS = i.createSS_moz_old) : i.createSS = i.createSS_moz, i._ds = i._ds_moz);
        for (e = i.getByTag(document.body, "RUBY"), t = i.newEle("STYLE"), t.innerHTML = i.createSS(), i.getByTag(document, "HEAD")[0].appendChild(t), n = e.length - 1; n >= 0; n--) switch (ds = i.dsRuby_detect(e[n]), ds) {
            case "_ds":
                r = i._ds(e[n]), e[n].parentNode.replaceChild(r, e[n]);
                break;
            case "ds_loose":
                r = i.loose(e[n]), e[n].parentNode.replaceChild(r, e[n]);
                break;
            case "ds_strict":
                r = i.strict(e[n]), e[n].parentNode.replaceChild(r, e[n])
        }
    },
    seekNode: function(e) {
        var t, d, n, r = e.nodeName,
            i = [],
            l = [];
        switch (r) {
            case "RT":
            case "RB":
                i.push("RB");
            case "RBC":
                i.push("RT");
            case "RTC":
                i.push("RBC"), i.push("RTC")
        }
        switch (r) {
            case "RBC":
                l.push("RB");
                break;
            case "RTC":
                l.push("RT"), i.push("RB")
        }
        for (t = 0; t < e.childNodes.length; t++) {
            for (d = e.childNodes[t], n = 0; n < i.length; n++) i[n] == d.nodeName && (e.parentNode.appendChild(d), t--);
            for (n = 0; n < l.length; n++) l[n] == d.nodeName && this.seekNode(d)
        }
        return e
    },
    dsRuby_detect: function(e) {
        return this.dsRuby_detector(e)
    },
    dsRuby_detect_ie: function(e) {
        for (i = 0; i < e.childNodes.length; i++) this.seekNode(e.childNodes[i]);
        return this.dsRuby_detector(e)
    },
    dsRuby_detector: function(e) {
        var t, d = 0,
            n = 0;
        for (t = 0; t < e.childNodes.length; t++) "RT" == e.childNodes[t].nodeName && d++, "RTC" == e.childNodes[t].nodeName && n++;
        switch (n) {
            case 0:
                return "_ds";
            case 1:
                return 0 == d ? "_ds" : "ds_loose";
            case 2:
                return 0 == d ? "ds_strict" : !1;
            default:
                return !1
        }
    },
    measure: function(e, t) {
        var d, n, r, i = this.newEle("SPAN");
        return i.id = "_redsdummy", i.innerHTML = "あ", t.style.verticalAlign = "0px", d = this.getByTag(t, "RB"), 0 == d.length && (d = this.getByTag(t, "RBC")), d[0].id = "_dsmeasure", e.parentNode.insertBefore(i, e), r = this.getTop(i) + window.scrollY, e.parentNode.removeChild(i), e.parentNode.insertBefore(t, e), n = this.getTop(d[0]) - r + window.scrollY, d[0].removeAttribute("id"), e.parentNode.removeChild(t), n + "px"
    },
    measure_s6: function() {
        return "middle"
    },
    measure_ie: function(e, t) {
        var d, n, r, i, l, s = this.newEle("SPAN");
        if (s.id = "_redsdummy", s.innerHTML = "あ", t.style.verticalAlign = "0px", d = this.getByTag(t, "RB"), 0 == d.length) {
            if (d = this.getByTag(t, "RBC"), 0 != d.length) r = d[0];
            else
                for (d = this.getByTag(t, "SPAN"), i = 0; i < d.length; i++)
                    if ("_rerbc" == d[i].getAttribute("class")) {
                        r = d[i];
                        break
                    }
        } else r = d[0];
        return r.id = "_dsmeasure", e.parentNode.insertBefore(s, e), l = this.getTop(s) + window.pageYOffset, e.parentNode.removeChild(s), e.parentNode.insertBefore(t, e), n = this.getTop(r) - l + window.pageYOffset, r.removeAttribute("id"), e.parentNode.removeChild(t), n + "px"
    },
    getTop: function(e) {
        return e.getBoundingClientRect().top
    },
    createSS: function() {
        return "ruby._reds{display:inline-table;text-align:center;line-height:1em;}\nruby._reds>rb,ruby>rbc,ruby._reds>rbc{display:table-row;}\nruby._reds>rt{display:table-header-group ;font-size:50%;text-align:center;}\nruby._reds>rtc:nth-of-type(1){display:table-header-group;font-size:50%;}\nruby._reds>rtc:nth-of-type(2){display:table-footer-group;font-size:50%;}\nruby._reds>rtc._dstop{ display:table-caption;caption-side:top;}\nruby._reds>rtc._dsbottom{ display:table-caption;caption-side:bottom;}\n._dstop>rt{display:inline !important;}\n._dsbottom>rt{display:inline !important;}\nruby._reds>rbc>rb{display:table-cell;}\nruby._reds>rtc>rt{display:table-cell;}\nruby>rtc{display:table-header-group;font-size:50%;text-align:center;}\nruby *{line-height:1em;}\nruby._reds,ruby._reds>*{margin:0;padding:0;border-spacing:0;}\nrp{display:none !important;}\nspan#_redsdummy{display:inline-block;line-height:1em;height:1em;}\n"
    },
    createSS_moz: function() {
        return "ruby { display:inline-table; line-height:1em; text-align:center;}ruby *{line-height:1em;}ruby>rbc{display:table-row;}ruby rb{display:table-cell;}ruby>rb{display:table-row;}ruby>rtc{display:table-header-group; font-size:50%; }ruby rt{display:table-cell;}ruby>rt{display:table-header-group;font-size:50%;}ruby._reds>rb { display:table-row; }ruby._reds>rt { display:table-header-group; }ruby._reds>rtc:nth-of-type(1) { display:table-header-group; }ruby._reds>rtc:nth-of-type(2) { display:table-footer-group; }ruby._reds>rtc._dstop{ display:table-caption;caption-side:top;}ruby._reds>rtc._dsbottom{ display:table-caption;caption-side:bottom;}rtc._dstop>rt{display:inline !important;}rtc._dsbottom>rt{display:inline !important;}rp{display:none !important;}span#_redsdummy{display:inline-block;line-height:1em;height:1em;}"
    },
    createSS_moz_old: function() {
        return this.createSS_ie() + this.createSS_moz()
    },
    createSS_ie: function() {
        return "ruby._reds{display:inline-table;text-align:center;text-indent:0 !important;margin:0 !important;padding:0 !important;line-height:1em;}\nruby *{line-height:1em;}\nruby._reds,ruby._reds>*{margin:0;padding:0;border-spacing:0;}\nruby._reds>rb,ruby>rbc{display:table-row;}\nruby._reds>span._rerbc{display:table-row;}\nruby._reds>rt{display:table-header-group;}\nruby._reds>span._rertc1{display:table-header-group;font-size:50%;}\nruby._reds>span._rertc1_c{display:table-caption;caption-side:top;font-size:50%;text-align:center;}\nruby._reds>span._rertc2{display:table-footer-group;font-size:50%;}\nruby._reds>span._rertc2_c{display:table-caption;caption-side:bottom;font-size:50%;text-align:center;}\nruby._reds>span._rertc1>rt,ruby._reds>span._rertc2>rt,ruby._reds>span._rerbc>rb,ruby>rbc>rb{display:table-cell;font-size:100%;}\nruby._reds>span._rertc1>aside,ruby._reds>span._rertc2>aside,ruby._reds>span._rerbc>rb,ruby>rbc>rb{display:table-cell;font-size:100%;}\nrp{display:none !important;}\nspan#_redsdummy{display:inline-block;line-height:1em;height:1em;}\n"
    },
    _ds: function(e) {
        var t, d, n, r, i, l, s, a, o = this;
        for (t = o.getChild(e, "RBC"), t = t.length ? t[0] : e, r = document.createDocumentFragment(), i = 0; i < t.childNodes.length; i++) switch (d = t.childNodes[i], d.nodeName) {
            case "#text":
                if (/[\f\n\r\t\v]/g.test(d.nodeValue)) break;
                n = o.newEle("RB"), n.appendChild(d.cloneNode(!0)), r.appendChild(n);
                break;
            case "RB":
                r.appendChild(d.cloneNode(!0))
        }
        if (t = o.getChild(e, "RTC"), s = document.createDocumentFragment(), t.length)
            for (i = 0; i < t[0].childNodes.length; i++) switch (d = t[0].childNodes[i], d.nodeName) {
                case "#text":
                    if (/[\f\n\r\t\v]/g.test(d.nodeValue)) break;
                    l = o.newEle("RT"), l.appendChild(d.cloneNode(!0)), s.appendChild(l);
                    break;
                case "RT":
                    s.appendChild(d.cloneNode(!0))
            } else
                for (i = 0; i < e.childNodes.length; i++) d = e.childNodes[i], "RT" == d.nodeName && s.appendChild(d.cloneNode(!0));
        if (r.childNodes.length != s.childNodes.length) return e;
        for (a = o.newEle("RUBY"), i = 0; i < r.childNodes.length; i++) a.appendChild(r.childNodes[i].cloneNode(!0)), a.appendChild(s.childNodes[i].cloneNode(!0));
        return a
    },
    _ds_moz: function(e) {
        var t, d, n, r, i, l, s, a, o, c, h = this;
        for (t = h.getChild(e, "RBC"), t = t.length ? t[0] : e, d = document.createDocumentFragment(), l = 0; l < t.childNodes.length; l++) switch (n = t.childNodes[l], n.nodeName) {
            case "#text":
                if (/[\f\n\r\t\v]/g.test(n.nodeValue)) break;
                r = h.newEle("RB"), r.appendChild(n.cloneNode(!0)), d.appendChild(r);
                break;
            case "RB":
                d.appendChild(n.cloneNode(!0))
        }
        if (i = h.newEle("RBC"), i.appendChild(d.cloneNode(!0)), t = h.getChild(e, "RTC"), d = document.createDocumentFragment(), t.length)
            for (l = 0; l < t[0].childNodes.length; l++) switch (n = t[0].childNodes[l], n.nodeName) {
                case "#text":
                    if (/[\f\n\r\t\v]/g.test(n.nodeValue)) break;
                    s = h.newEle("RT"), s.appendChild(n.cloneNode(!0)), d.appendChild(s);
                    break;
                case "RT":
                    d.appendChild(n.cloneNode(!0))
            } else
                for (l = 0; l < e.childNodes.length; l++) n = e.childNodes[l], "RT" == n.nodeName && d.appendChild(n.cloneNode(!0));
        if (a = h.newEle("RTC"), a.appendChild(d.cloneNode(!0)), i.childNodes.length != a.childNodes.length) return e;
        for (o = document.createDocumentFragment(), l = 0; l < i.childNodes.length; l++) c = h.newEle("RUBY"), c.appendChild(i.childNodes[l].cloneNode(!0)), c.appendChild(a.childNodes[l].cloneNode(!0)), c.style.verticalAlign = h.measure(e, c), o.appendChild(c.cloneNode(!0));
        return o
    },
    loose: function(e) {
        var t, d, n, r, i, l, s, a, o, c, h, p, u, g = this;
        for (n = g.getByTag(e, "RB"), p = g.getByTag(e, "RBC"), r = g.getChild(e, "RT"), i = g.getChild(e, "RTC"), t = g.getChild(i[0], "RT"), t.length <= 1 && i[0].setAttribute("class", "_dsbottom"), h = i[0].childNodes, 1 == h.length && "RT" == h[0].nodeName && (i[0].innerHTML = h[0].innerHTML), d = g.newEle("RTC"), l = 0; l < r.length; l++) d.appendChild(r[l]);
        if (0 != p.length) s = p[0];
        else
            for (s = g.newEle("RBC"), l = 0; l < e.childNodes.length; l++) switch (a = e.childNodes[l], a.nodeName) {
                case "#text":
                    if (/[\f\n\r\t\v]/g.test(a.nodeValue)) break;
                    o = g.newEle("RB"), o.appendChild(a.cloneNode(!0)), s.appendChild(o);
                    break;
                case "RB":
                    s.appendChild(a.cloneNode(!0))
            }
        return u = e.cloneNode(!1), u.appendChild(s), u.appendChild(d), u.appendChild(g.getByTag(e, "RTC")[0]), c = e.getAttribute("class") || "", u.setAttribute("class", (c + " _reds").trim()), u.style.verticalAlign = g.measure(e, u), u
    },
    loose_ie: function(e) {
        var t, d, n, r, l, s, a, o, c, h, p, u, g, b = this;
        for (t = b.getByTag(e, "RB"), u = b.getByTag(e, "RBC"), d = b.getChild(e, "RT"), n = b.getChild(e, "RTC"), r = b.newEle("SPAN"), r.setAttribute("class", "_rertc1"), l = 0; l < d.length; l++) r.appendChild(d[l]);
        if (s = b.newEle("SPAN"), s.setAttribute("class", "_rerbc"), 0 != u.length) s.innerHTML = u[0].innerHTML;
        else
            for (l = 0; l < e.childNodes.length; l++) switch (o = e.childNodes[l], o.nodeName) {
                case "#text":
                    if (/[\f\n\r\t\v]/g.test(o.nodeValue)) break;
                    c = b.newEle("RB"), c.appendChild(o.cloneNode(!0)), s.appendChild(c);
                    break;
                case "RB":
                    s.appendChild(o.cloneNode(!0))
            }
        for (g = e.cloneNode(!1), h = e.getAttribute("class") || "", g.setAttribute("class", (h + " _reds").trim()), g.appendChild(s), g.appendChild(r), a = b.newEle("SPAN"), a.setAttribute("class", "_rertc2"), i = 0; i < b.getByTag(e, "RTC")[0].childNodes.length; i++) a.appendChild(b.getByTag(e, "RTC")[0].childNodes[i].cloneNode(!0));
        return p = a.childNodes, 1 == p.length && "RT" == p[0].nodeName && (a.innerHTML = p[0].innerHTML), g.appendChild(a), 0 == b.getChild(a, "RT").length && a.setAttribute("class", "_rertc2 _rertc2_c"), g.style.verticalAlign = b.measure(e, g), g
    },
    strict: function(e) {
        var t, d, n, r, i, l, s, a, o, c, h = e.getAttribute("class") || "",
            p = this,
            u = e.cloneNode(!1),
            g = !1;
        if (d = p.newEle("RBC"), u.setAttribute("class", (h + " _reds").trim()), 0 == p.getChild(e, "RBC").length)
            for (r = 0; r < e.childNodes.length; r++) switch (i = e.childNodes[r], i.nodeName) {
                case "#text":
                    if (/[\f\n\r\t\v]/g.test(i.nodeValue)) break;
                    l = p.newEle("RB"), l.appendChild(i.cloneNode(!0)), d.appendChild(l);
                    break;
                case "RB":
                    d.appendChild(i.cloneNode(!0))
            } else d = p.getChild(e, "RBC")[0].cloneNode(!0), 0 == p.getChild(d, "RB") && (t = p.newEle("RB"), t.innerHTML = d.innerHTML, d = d.cloneNode(!1), d.appendChild(t));
        if (s = d.childNodes.length, n = p.getChild(e, "RTC"), a = p.getChild(n[0], "RT"), o = p.getChild(n[1], "RT"), a.length <= 1 && o.length <= 1);
        else if (a.length <= 1 && o.length == s) h = n[0].getAttribute("class") || "", n[0].setAttribute("class", (h + " _dstop").trim()), g = !0;
        else if (a.length == s && o.length <= 1) h = n[1].getAttribute("class") || "", n[1].setAttribute("class", (h + " _dsbottom").trim());
        else if (a.length != s || o.length != s) return e;
        return u.appendChild(d), u.appendChild(n[0]), u.appendChild(n[1]), c = p.measure(e, u), u.style.verticalAlign = "middle" != c && g ? "0px" : c, u
    },
    strict_ie: function(e) {
        var t, d, n, r, i, l, s, a = e.getAttribute("class") || "",
            o = e.cloneNode(!1),
            c = this,
            h = !1;
        for (o.setAttribute("class", (a + " _reds").trim()), t = c.newEle("SPAN"), d = c.newEle("SPAN"), t.setAttribute("class", "_rertc1"), d.setAttribute("class", "_rertc2"), l = c.newEle("RBC"), n = c.getChild(e, "RTC"), r = 0; r < n[0].childNodes.length; r++) t.appendChild(n[0].childNodes[r].cloneNode(!0));
        for (r = 0; r < n[1].childNodes.length; r++) d.appendChild(n[1].childNodes[r].cloneNode(!0));
        if (0 == c.getChild(e, "RBC").length)
            for (r = 0; r < e.childNodes.length; r++) switch (i = e.childNodes[r], i.nodeName) {
                case "#text":
                    if (/[\f\n\r\t\v]/g.test(i.nodeValue)) break;
                    new_rb = c.newEle("RB"), new_rb.appendChild(i.cloneNode(!0)), l.appendChild(new_rb);
                    break;
                case "RB":
                    l.appendChild(i.cloneNode(!0))
            } else l = c.getChild(e, "RBC")[0].cloneNode(!0);
        return 0 == c.getChild(t, "RT").length ? 1 == l.childNodes.length ? (s = c.newEle("RT"), s.innerHTML = t.innerHTML, t = s) : (t.setAttribute("class", "_rertc1_c"), h = !0) : 1 == c.getChild(t, "RT").length && (1 == l.childNodes.length ? t = c.getChild(t, "RT")[0] : (t.setAttribute("class", "_rertc1_c"), t.innerHTML = c.getChild(t, "RT")[0].innerHTML, h = !0)), 0 == c.getChild(d, "RT").length ? d.setAttribute("class", "_rertc2_c") : 1 == c.getChild(d, "RT").length && (d.innerHTML = c.getChild(d, "RT")[0].innerHTML, d.setAttribute("class", "_rertc2_c")), o.appendChild(l), o.appendChild(t), o.appendChild(d), o.style.verticalAlign = h ? "0px" : c.measure(e, o), o
    },
    getByTag: function(e, t) {
        return e.getElementsByTagName(t)
    },
    newEle: function(e) {
        return document.createElement(e)
    },
    getChild: function(e, t) {
        var d, n = [];
        for (d = 0; d < e.childNodes.length; d++) e.childNodes[d].nodeName == t && n.push(e.childNodes[d]);
        return n
    },
    getById: function(e) {
        return document.getElementById(e)
    }
};
! function() {
    window.addEventListener ? window.addEventListener("DOMContentLoaded", ruby_enabler.execute, !1) : window.attachEvent("onload", ruby_enabler.execute)
}();
