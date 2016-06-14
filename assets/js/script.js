(function () {
  $incomeTaxForm = $("#incomeTaxForm");
  $monthlyIncome = $("#monthlyIncome");
  $father = $("#father");
  $mother = $("#mother");
  $married = $("#married");
  $child = $("#child");

  $resultMonth = $("#result-month");
  $resultYear = $("#result-year");
  $resultBody = $("#result-body");
  $back = $("#back");

  function addComma(num) {
    var txt = "";
    // console.log(num.split("").forEach());
    num.split("").reverse().forEach(function (v,i) {
      if (i !== 0 && i%3 === 0)
        txt = v + "," + txt;
      else
        txt = v + txt;
    });
    return txt;
  }

  function toMyNumber(num) {
    return Array.prototype.map.call(num + "", function (n) {
      return "၀၁၂၃၄၅၆၇၈၉"[n];
    }).join("");
  }

  var discountRules = {
    general: function (val) {
      var twentyPercentage = val * 0.2;
      return val - (twentyPercentage < 10000000 ? twentyPercentage : 10000000);
    },
    parent: function (val) { return val - 1000000 },
    married: function (val) { return val - 1000000 },
    child: function (val, childAmount) { return val - (childAmount * 500000) }
  };

  function enableDisableChildOption() {
    if (!$married.is(":checked"))
      $child.prop("disabled", true);
    else
      $child.prop("disabled", false);
  }

  function init() {
    enableDisableChildOption();
  }

  $back.click(function () {
    $resultBody.removeClass("zero-tax");
    $resultBody.removeClass("visable");
  });

  function caculate() {
    var total = $monthlyIncome.val() * 12;
    var tax = 0;

    // Exception for total 48
    if (total <= 4800000)
      total = 0;

    total = discountRules.general(total);

    if ($father.is(":checked"))
      total = discountRules.parent(total);

    if ($mother.is(":checked"))
      total = discountRules.parent(total);

    if ($married.is(":checked"))
      total = discountRules.married(total);

    if ($married.is(":checked") && $child.val() > 0)
      total = discountRules.child(total, $child.val());

    var taxRuleLevels = [
      {addition: 2000000, percent: 0},
      {addition: 3000000, percent: 0.05},
      {addition: 5000000, percent: 0.10},
      {addition: 10000000, percent: 0.15},
      {addition: 10000000, percent: 0.20},
      {addition: Infinity, percent: 0.25}
    ];

    taxRuleLevels.forEach(function (rule) {
      var addition = rule.addition;
      var percent = rule.percent;

      console.log(total, addition, percent);
      if (total > 0) {
        if (total <= addition) {
          tax += total * percent;
          total = 0;
        } else {
          tax += addition * percent;
          total -= addition;
        }
      }
      console.log(total, addition, tax);
    });

    if (tax === 0) {
      $resultBody.addClass("zero-tax");
    }
    $resultBody.addClass("visable");
    $resultMonth.html(addComma(toMyNumber((tax/12).toFixed())));
    $resultYear.html(addComma(toMyNumber(tax)));
  }

  $married.change(enableDisableChildOption);
  $incomeTaxForm.submit(function (event) {
    event.preventDefault();
    caculate();
    return false;
  });
  init();
}());
