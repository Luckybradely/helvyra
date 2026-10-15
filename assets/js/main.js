(function () {
  "use strict";
  var d = document;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* année dynamique */
  d.querySelectorAll("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });

  /* navigation */
  var nav = d.querySelector(".nav");
  var burger = d.querySelector(".burger");
  var menu = d.getElementById("menu");
  function onScroll() { if (nav) nav.classList.toggle("scrolled", window.scrollY > 24); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  function setMenu(open) {
    if (!burger || !menu) return;
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    menu.classList.toggle("open", open);
    d.body.style.overflow = open ? "hidden" : "";
  }
  if (burger) {
    burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 900) setMenu(false); });
  }

  /* apparition au défilement */
  var rv = d.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    rv.forEach(function (n) { io.observe(n); });
  } else { rv.forEach(function (n) { n.classList.add("in"); }); }

  /* filtres de réalisations */
  var fbtn = d.querySelectorAll(".filters button");
  fbtn.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-filter");
      fbtn.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      d.querySelectorAll("#works .work").forEach(function (w) {
        w.classList.toggle("hide", f !== "all" && w.getAttribute("data-cat") !== f);
      });
      var n = d.getElementById("count");
      if (n) n.textContent = d.querySelectorAll("#works .work:not(.hide)").length;
    });
  });

  /* fenêtre projet */
  var dataEl = d.getElementById("projects-data");
  var dlg = d.getElementById("project-dialog");
  if (dataEl && dlg && typeof dlg.showModal === "function") {
    var projects = JSON.parse(dataEl.textContent);
    var last = null;
    var catLabel = { web: "Web design", video: "Vidéo IA" };
    function esc(s) { var p = d.createElement("p"); p.textContent = s; return p.innerHTML; }
    function openProject(id, trigger) {
      var p = projects.filter(function (x) { return x.id === id; })[0];
      if (!p) return;
      last = trigger;
      dlg.querySelector(".dlg-card").innerHTML =
        '<button class="dlg-x" type="button" aria-label="Fermer">×</button>' +
        '<div class="vis">' + (p.video ? '<video controls preload="none" playsinline poster="' + p.img + '" src="' + esc(p.video) + '"></video>' : '<img src="' + p.img + '" alt="' + esc(p.alt) + '">') + '</div>' +
        '<div class="txt"><span class="badge">' + esc(p.kind) + ' · non commandité</span>' +
        '<h3 id="dlg-title">' + esc(p.title) + '</h3><p class="muted">' + catLabel[p.cat] + ' · format ' + esc(p.format) + '</p>' +
        '<p style="margin-top:14px;color:#D9D5C8">' + esc(p.short) + '</p><dl>' +
        '<dt>Contexte</dt><dd>' + esc(p.context) + '</dd>' +
        '<dt>Intention créative</dt><dd>' + esc(p.intention) + '</dd>' +
        '<dt>Direction artistique</dt><dd>' + esc(p.da) + '</dd>' +
        '<dt>Choix réalisés</dt><dd>' + esc(p.choices) + '</dd>' +
        '<dt>Résultat visuel</dt><dd>' + esc(p.result) + '</dd></dl>' +
        '<p style="margin-top:28px"><a class="btn btn-gold" href="contact.html">Parler de votre projet <span class="ar">→</span></a></p></div>';
      dlg.setAttribute("aria-labelledby", "dlg-title");
      dlg.showModal();
      d.body.style.overflow = "hidden";
      dlg.querySelector(".dlg-x").focus();
    }
    function closeDlg() { dlg.close(); }
    dlg.addEventListener("close", function () { d.body.style.overflow = ""; if (last) last.focus(); });
    dlg.addEventListener("click", function (e) {
      if (e.target.closest(".dlg-x") || e.target.classList.contains("dlg")) closeDlg();
    });
    d.querySelectorAll(".work[data-id]").forEach(function (w) {
      w.addEventListener("click", function () { openProject(w.getAttribute("data-id"), w); });
    });
  }

  /* avant / après */
  d.querySelectorAll(".ba").forEach(function (ba) {
    var r = ba.querySelector("input");
    function set() { ba.style.setProperty("--pos", r.value + "%"); r.setAttribute("aria-valuetext", r.value + " pour cent"); }
    r.addEventListener("input", set); set();
  });

  /* outil d'orientation */
  var quiz = d.getElementById("quiz");
  if (quiz) {
    var map = {
      auto: ["IA et automatisation", "ia-automatisation.html", "Nous regardons quelles tâches se répètent et si l'IA ou une simple règle suffit."],
      agent: ["Agents IA et solutions intelligentes", "agents-ia.html", "Un assistant borné à une tâche précise, avec des sources et des règles définies."],
      visuel: ["Création visuelle par IA", "video-ia.html", "Des vidéos et visuels pour votre marque, avec des démonstrations déjà visibles."],
      web: ["Web et expériences digitales", "web-design.html", "Création ou refonte de site, avec de l'IA seulement là où elle sert."],
      mesure: ["Solutions IA sur mesure", "solutions-sur-mesure.html", "On commence par comprendre votre besoin, sans solution préétablie."]
    };
    var out = d.getElementById("quiz-out");
    quiz.addEventListener("change", function (e) {
      var m = map[e.target.value]; if (!m) return;
      out.className = "quiz-out show";
      out.innerHTML = "<h3></h3><p></p><a class=\"btn btn-gold\" href=\"\">Explorer cette expertise <span class=\"ar\">→</span></a> <a class=\"link\" style=\"margin-left:18px\" href=\"contact.html?besoin=" + e.target.value + "\">Ou nous en parler directement</a>";
      out.querySelector("h3").textContent = "Point de départ suggéré : " + m[0];
      out.querySelector("p").textContent = m[2];
      out.querySelector(".btn").setAttribute("href", m[1]);
    });
  }
  /* présélection du besoin depuis l'orientation */
  var typeSel = d.getElementById("type");
  if (typeSel && window.URLSearchParams) {
    var b = new URLSearchParams(window.location.search).get("besoin");
    if (b && typeSel.querySelector('option[value="' + b + '"]')) typeSel.value = b;
  }

  /* formulaire */
  var form = d.getElementById("contact-form");
  if (form) {
    var cfg = window.HELVYRA_CONFIG || {};
    var status = d.getElementById("form-status");
    var btn = form.querySelector("button[type=submit]");
    var emailLine = d.getElementById("direct-email");
    if (emailLine && cfg.contactEmail) {
      emailLine.innerHTML = 'Vous préférez écrire ? <a class="link" href="mailto:' + cfg.contactEmail + '">' + cfg.contactEmail + '</a>';
    }
    function show(kind, msg) {
      status.className = "status show " + kind; status.textContent = msg;
      status.setAttribute("role", kind === "bad" ? "alert" : "status");
    }
    function setErr(name, msg) {
      var f = form.querySelector('[name="' + name + '"]').closest(".field");
      f.classList.add("err"); f.querySelector(".err-msg").textContent = msg;
      form.querySelector('[name="' + name + '"]').setAttribute("aria-invalid", "true");
    }
    function clearErr() {
      form.querySelectorAll(".field").forEach(function (f) { f.classList.remove("err"); });
      form.querySelectorAll("[aria-invalid]").forEach(function (i) { i.removeAttribute("aria-invalid"); });
    }
    function validate() {
      clearErr(); var ok = true, first = null;
      var v = function (n) { return form.elements[n].value.trim(); };
      function bad(n, m) { setErr(n, m); ok = false; if (!first) first = form.elements[n]; }
      if (v("nom").length < 2) bad("nom", "Indiquez votre nom.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v("email"))) bad("email", "Indiquez une adresse e-mail valide.");
      if (!v("type")) bad("type", "Choisissez un type de projet.");
      if (v("message").length < 20) bad("message", "Décrivez votre projet en quelques phrases (20 caractères minimum).");
      if (first) first.focus();
      return ok;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "status";
      if (form.elements["website"].value) return; /* anti-spam : champ piège rempli */
      if (!validate()) { show("bad", "Certains champs sont à corriger."); return; }
      if (!cfg.formEndpoint) {
        show("info", "Le formulaire n'est pas encore relié à un service d'envoi : votre message n'a PAS été transmis. Merci de réessayer plus tard ou de nous contacter directement.");
        return;
      }
      btn.disabled = true; btn.classList.add("loading");
      var fd = new FormData(form); fd.delete("website");
      fetch(cfg.formEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error("http " + r.status);
          form.reset(); show("ok", "Merci, votre message a bien été transmis. Nous revenons vers vous.");
        })
        .catch(function () { show("bad", "L'envoi a échoué. Vérifiez votre connexion et réessayez."); })
        .finally(function () { btn.disabled = false; btn.classList.remove("loading"); });
    });
    form.querySelectorAll("input,select,textarea").forEach(function (i) {
      i.addEventListener("input", function () { var f = i.closest(".field"); if (f) f.classList.remove("err"); });
    });
  }
})();
