/* ==========================================================================
   Dolamo Attorneys – form submission
   Sends every <form data-form-type="..."> to the backend (server/server.js),
   which emails the details to admin@dattorney.co.za, then shows the result
   on the page (the equivalent of ViewBag.Message in the C# example).
   Load AFTER js/script.js. Plain JavaScript – no jQuery needed.
   ========================================================================== */
(function () {
  "use strict";

  // If the website and server run on different domains, put the full URL here,
  // e.g. "https://dolamoattorneys.co.za/api/contact".
  var API_URL = "/api/contact";

  var REQUIRED = {
    contact: ["username", "email", "subject", "message"],
    appointment: ["first_name", "category", "email"],
    subscribe: ["email"],
  };

  var LABELS = {
    username: "your name",
    email: "your email address",
    subject: "a subject",
    message: "your message",
    first_name: "your first name",
    category: "a category",
  };

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function getFeedback(form) {
    var box = form.querySelector(".form-feedback");
    if (!box) {
      box = document.createElement("div");
      box.className = "form-feedback";
      box.setAttribute("role", "status");
      box.setAttribute("aria-live", "polite");
      form.appendChild(box);
    }
    return box;
  }

  function show(form, ok, message) {
    var box = getFeedback(form);
    box.className = "form-feedback " + (ok ? "is-success" : "is-error");
    box.textContent = message;
  }

  function clearFieldErrors(form) {
    var bad = form.querySelectorAll(".has-field-error");
    for (var i = 0; i < bad.length; i++) bad[i].classList.remove("has-field-error");
  }

  function markField(form, name) {
    var field = form.elements[name];
    if (field && field.classList) field.classList.add("has-field-error");
  }

  function collect(form) {
    var data = { formType: form.getAttribute("data-form-type") };
    for (var i = 0; i < form.elements.length; i++) {
      var el = form.elements[i];
      if (!el.name || el.type === "submit" || el.type === "button") continue;
      data[el.name] = (el.value || "").trim();
    }
    return data;
  }

  function checkClientSide(form, data) {
    var required = REQUIRED[data.formType] || [];
    for (var i = 0; i < required.length; i++) {
      var key = required[i];
      if (!data[key]) {
        markField(form, key);
        return "Please enter " + (LABELS[key] || "all required fields") + ".";
      }
    }
    if (data.email && !EMAIL_RE.test(data.email)) {
      markField(form, "email");
      return "Please enter a valid email address.";
    }
    return null;
  }

  function setBusy(form, busy) {
    var btn = form.querySelector('button[type="submit"], input[type="submit"]');
    if (!btn) return;
    if (busy) {
      btn.disabled = true;
      btn.setAttribute("data-original", btn.innerHTML);
      if (form.getAttribute("data-form-type") !== "subscribe") btn.innerHTML = "Sending...";
    } else {
      btn.disabled = false;
      if (btn.hasAttribute("data-original")) btn.innerHTML = btn.getAttribute("data-original");
    }
  }

  function handleSubmit(form) {
    clearFieldErrors(form);
    var data = collect(form);
    var problem = checkClientSide(form, data);
    if (problem) {
      show(form, false, problem);
      return;
    }

    setBusy(form, true);
    show(form, true, "");
    getFeedback(form).className = "form-feedback"; // hide while sending

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    })
      .then(function (res) {
        return res
          .json()
          .catch(function () { return { ok: false, message: "Unexpected server response." }; })
          .then(function (json) { return { status: res.status, json: json }; });
      })
      .then(function (r) {
        if (r.json.ok) {
          form.reset();
          show(form, true, r.json.message);
        } else {
          if (r.json.errors) {
            Object.keys(r.json.errors).forEach(function (k) { markField(form, k); });
          }
          show(form, false, r.json.message || "Something went wrong. Please try again.");
        }
      })
      .catch(function () {
        show(form, false, "We could not reach the server. Please check your connection and try again, or contact us directly.");
      })
      .then(function () { setBusy(form, false); });
  }

  // Capture phase on document: runs before the template's jQuery-validate
  // handler, so it never also tries a normal page-reload submit.
  document.addEventListener(
    "submit",
    function (e) {
      var form = e.target;
      if (!form || !form.getAttribute || !form.getAttribute("data-form-type")) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      handleSubmit(form);
    },
    true
  );
})();
