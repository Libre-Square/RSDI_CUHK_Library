function gsc_scroll_right(x) {
	x.scrollLeft = x.scrollWidth;
}
var gsc_art_sel_l = [];
function gsc_evt_art_sel(f) {
	gsc_art_sel_l.push(f)
}
var gsc_art_sel_p = [];
function gsc_art_sel_chg(x) {
	var l = gsc_art_sel_l, n = l.length, i = 0;
	while (i < n)
		l[i++](x);
}
function gsc_art_cbs() {
	return gs_ch(gs_id("gsc_a_t"), "input")
}
function gsc_art_sel_cbs(l) {
	l = l || gsc_art_cbs();
	var i = l.length, c, s = [];
	while (i--)
		(c = l[i]).checked && s.push(c);
	return s;
}
function gsc_art_sids(l) {
	l = l || gsc_art_cbs();
	var i = l.length, c, s = [];
	while (i--)
		(c = l[i]).checked && s.push(c.value);
	return s;
}
function gsc_art_sel(v, l) {
	l = l || gsc_art_cbs();
	var i = l.length, x;
	while (i--) {
		(x = l[i]).checked = !!v;
		gs_ssel(x)
	}
	gsc_art_sel_chg(true);
}
gs_evt_rdy(function() {
	gsc_art_sel_chg();
	gs_evt_dlg(gs_id("gsc_a_t"), "input", "change", function() {
		gsc_art_sel_chg();
	});
	var x = gs_id("gsc_x_all");
	x && gs_evt(x, "gs-change", function() {
		var s = gs_cb_get(x);
		gsc_art_sel(s != 0, s == 2 && gsc_art_sel_p);
	});
});
function gsc_btn_sdis(b, d) {
	b.disabled = !!d;
	(d ? gs_xdis : gs_udis)(b);
}
function gsc_tr_add(b, h) {
	try {
		b.innerHTML += h
	} catch (_) {
		var d = document.createElement("div"), r, c, i, n;
		d.innerHTML = "<table>" + h + "</table>";
		r = gs_ch(d, "tr");
		for (i = 0, n = r.length, c = []; i < n; i++)
			c.push(r[i]);
		for (i = 0; i < n; i++)
			b.appendChild(c[i]);
	}
}
function gsc_rsb_mco(x, w) {
	var f = gs_id("gsc_rsb_mco"), e = f.elements;
	e.colleague.value = x;
	e.add_colleague_btn.disabled = !!w;
	e.del_sugg_coll_btn.disabled = !w;
	f.submit();
	return false;
}
function gsc_prf_ed(w) {
	gs_scls(gs_id("gsc_bdy"), w ? "gsc_prf_ed" : "");
}
gsc_evt_art_sel(function(x) {
	var v, n, k = gsc_art_cbs(), m = gs_id("gsc_btn_mer"), o = gs_id("gsc_x_all");
	if (m) {
		p = gsc_art_sel_cbs(k);
		n = p.length;
		gsc_btn_sdis(m, n < 2 || n > 5);
		if (!x && o) {
			gs_cb_set(o, v = n && 2 - (n == k.length));
			v == 2 && (gsc_art_sel_p = p);
		}
		gs_scls(gs_id("gsc_a_hd"), n ? "gsc_art_sel" : "");
	}
});
function gsc_art_export(f) {
	var l = gsc_art_cbs(), s = gsc_art_sids(l);
	gsc_md_show_exa(s, s.length == l.length, f, {});
}
gs_evt_rdy(function() {
	var m = gs_id("gsc_btn_mer");
	m && gs_evt(m, "click", function(e) {
		gsc_md_show_mopt(gsc_art_sids(), e);
	});
	var p = gs_id("gsc_prf_puf"), u;
	if (p) {
		u = p.elements.upload_file;
		gs_evt(gs_id("gsc_prf_pufb"), "click", function(e) {
			if (gs_uas("MSIE ") || gs_uas("Trident")) {
				gs_scls(p, "gsc_prf_pufo");
				gs_md_opn("gsc_prf_pufi", e, function() {
					gs_scls(p, "")
				});
				u.focus();
			} else {
				u.click();
			}
		});
		gs_evt(u, "change", function() {
			p.submit()
		});
	}
});
gs_evt_rdy(function() {
	var h = window.location.href, s = parseInt(h.replace(
			/.*[?&]cstart=([0-9]*).*/, "$1")) || 0, n = parseInt(h.replace(
			/.*[?&]pagesize=([0-9]*).*/, "$1")) || 20, P = gs_id("gsc_bpf_prev"), N = gs_id("gsc_bpf_next"), M = gs_id("gsc_bpf_more");
	function t() {
		return Math.max(Math.min(n, 100), 20)
	}
	n = t();
	function p(k, m) {
		return (h.replace(/([?&])(cstart|pagesize)=[^&]*/g, "$1") + "&cstart="
				+ k + "&pagesize=" + m).replace(/([?&])&+/, "$1");
	}
	gs_evt(P, "click", function() {
		location = p(s - t(), t())
	});
	gs_evt(N, "click", function() {
		location = p(s + n, t())
	});
	gs_evt(
			M,
			"click",
			function() {
				var m = n < 100 ? 100 - n : 100, x = gs_id("gsc_a_sp"), g = gs_id("gsc_a_err");
				gs_vis(g, 0);
				gs_vis(x, 1);
				gs_ajax(p(s + n, m), "json=1", function(c, t) {
					var r = c == 200 && gs_json_parse(t), b = gs_id("gsc_a_b");
					gs_vis(x, 0);
					if (r) {
						gsc_tr_add(b, r["B"]);
						n += m;
						(gs_id("gsc_a_nn") || {}).innerHTML = (s + 1)
								+ "&ndash;" + (s + gs_ch(b, "tr").length);
						gsc_btn_sdis(P, !r["P"] || s <= 0);
						gsc_btn_sdis(N, !r["N"]);
						gsc_btn_sdis(M, !r["N"] || n >= 1000);
						gsc_art_sel_chg();
					} else {
						gs_vis(g, 1);
					}
				});
			});
});
gs_evt_rdy(function() {
	var f = gs_id("gsc_rsb_f_m"), i = gs_id("gsc_rsb_fin_m"), b = gs_id("gsc_rsb_fbt_m");
	gs_evt_blr(f, function() {
		setTimeout(function() {
			var a = document.activeElement;
			a !== i && a !== b && gs_scls(f, "gsc_rsb_foff");
		}, 0);
	});
	gs_evt(f, "submit", function(e) {
		if (f.className) {
			gs_scls(f, "");
			setTimeout(function() {
				i.focus();
			}, 1000 * gs_ctd(i));
			gs_evt_pdf(e);
		} else if (!i.value) {
			gs_scls(f, "gsc_rsb_foff");
			gs_evt_pdf(e);
		}
	});
});