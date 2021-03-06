/*
 * Javascript Diff Algorithm
 *  By John Resig (http://ejohn.org/)
 *  Modified by Chu Alan "sprite"
 *  Modified by Andrei Markeev
 *
 * Released under the MIT license.
 *
 * More Info:
 *  http://ejohn.org/projects/javascript-diff-algorithm/
 */

var jsDiff = {};
(function (jsDiff) {

    function escape(s) {
        var n = s;
        n = n.replace(/&/g, "&amp;");
        n = n.replace(/</g, "&lt;");
        n = n.replace(/>/g, "&gt;");
        n = n.replace(/"/g, "&quot;");

        return n;
    }

    function diff(o, n) {
        var ns = new Object();
        var os = new Object();

        for (var i = 0; i < n.length; i++) {
            if (ns[n[i]] == null)
                ns[n[i]] = { rows: new Array(), o: null };
            ns[n[i]].rows.push(i);
        }

        for (var i = 0; i < o.length; i++) {
            if (os[o[i]] == null)
                os[o[i]] = { rows: new Array(), n: null };
            os[o[i]].rows.push(i);
        }

        for (var i in ns) {
            if (ns[i].rows.length == 1 && typeof (os[i]) != "undefined" && os[i].rows.length == 1) {
                n[ns[i].rows[0]] = { text: n[ns[i].rows[0]], row: os[i].rows[0] };
                o[os[i].rows[0]] = { text: o[os[i].rows[0]], row: ns[i].rows[0] };
            }
        }

        for (var i = 0; i < n.length - 1; i++) {
            if (n[i].text != null && n[i + 1].text == null && n[i].row + 1 < o.length && o[n[i].row + 1].text == null &&
                 n[i + 1] == o[n[i].row + 1]) {
                n[i + 1] = { text: n[i + 1], row: n[i].row + 1 };
                o[n[i].row + 1] = { text: o[n[i].row + 1], row: i + 1 };
            }
        }

        for (var i = n.length - 1; i > 0; i--) {
            if (n[i].text != null && n[i - 1].text == null && n[i].row > 0 && o[n[i].row - 1].text == null &&
                 n[i - 1] == o[n[i].row - 1]) {
                n[i - 1] = { text: n[i - 1], row: n[i].row - 1 };
                o[n[i].row - 1] = { text: o[n[i].row - 1], row: i - 1 };
            }
        }

        return { o: o, n: n };
    }

    function isSpace(ch)
    {
        return (ch==' ' || ch==',' || ch=='"' || ch==':' || ch=='{' || ch=='}' || ch=='\n');
    }

    function splitString(s)
    {
        var sPart='';
        var sParts=[];

        if (s.length == 0)
            return sParts;

        var mode = 'letters';
        for (var i=0;i<s.length;i++)
        {
            if (mode == 'space') {
                if (!isSpace(s[i])) {
                    sPart = s[i];
                    mode = 'letters';
                }
                else
                    sParts.push(s[i]);
            }
            else {
                if (isSpace(s[i])) {
                    sParts.push(sPart);
                    sParts.push(s[i]);
                    sPart = '';
                    mode = 'space';
                }
                else
                    sPart += s[i];
            }
        }
        sParts.push(sPart);
        return sParts;
    }

    jsDiff.diffString = function(o, n) {
        o = escape(o.replace(/\s+$/, ''));
        n = escape(n.replace(/\s+$/, ''));

        var out = diff(splitString(o), splitString(n));
        var str = "";

        if (out.n.length == 0) {
            for (var i = 0; i < out.o.length; i++) {
                str += '<del>' + out.o[i] + "</del>";
            }
        } else {
            if (out.n[0].text == null) {
                for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
                    str += '<del>' + out.o[n] + "</del>";
                }
            }

            for (var i = 0; i < out.n.length; i++) {
                if (out.n[i].text == null) {
                    str += '<ins>' + out.n[i] + "</ins>";
                } else {
                    var pre = "";

                    for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++) {
                        pre += '<del>' + out.o[n] + "</del>";
                    }
                    str += out.n[i].text + pre;
                }
            }
        }

        return str;
    }


})(jsDiff);