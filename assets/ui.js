/* 입력 공통 동작: 숫자 콤마, 증감 버튼, 빠른 입력 */
(function () {
  function digits(s) { return String(s).replace(/[^0-9]/g, ""); }
  function fmt(el) {
    var d = digits(el.value);
    el.value = d === "" ? "" : Number(d).toLocaleString("ko-KR");
  }
  window.UI = {
    num: function (id) {
      var el = document.getElementById(id);
      return el ? Number(digits(el.value)) || 0 : 0;
    },
    set: function (id, n) {
      var el = document.getElementById(id);
      if (el) { el.value = Number(n).toLocaleString("ko-KR"); }
    },
    radio: function (name) {
      var r = document.querySelector('input[name="' + name + '"]:checked');
      return r ? r.value : "";
    },
    step: function (id) {
      var el = document.getElementById(id);
      return el ? Number(el.textContent) || 0 : 0;
    },
    init: function (render) {
      Array.prototype.forEach.call(document.querySelectorAll("input[data-money]"), function (el) {
        fmt(el);
        el.addEventListener("input", function () { fmt(el); render(); });
      });
      Array.prototype.forEach.call(document.querySelectorAll('input[type="radio"], input[type="range"]'), function (el) {
        el.addEventListener("input", render);
      });
      Array.prototype.forEach.call(document.querySelectorAll(".stepper"), function (box) {
        var out = box.querySelector("output");
        var min = Number(box.getAttribute("data-min")), max = Number(box.getAttribute("data-max"));
        Array.prototype.forEach.call(box.querySelectorAll("button"), function (b) {
          b.addEventListener("click", function () {
            var v = Number(out.textContent) + Number(b.getAttribute("data-d"));
            out.textContent = Math.min(max, Math.max(min, v));
            render();
          });
        });
      });
      Array.prototype.forEach.call(document.querySelectorAll(".quick button"), function (b) {
        b.addEventListener("click", function () {
          window.UI.set(b.getAttribute("data-for"), b.getAttribute("data-v"));
          render();
        });
      });
      render();
    }
  };
})();
