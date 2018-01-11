/**
 * Extend native String prototype with helper functions
 */

/* eslint-disable */

String.prototype.trim = function () {
  return this.replace(/^\s+|\s+$/g, "");
};

String.prototype.lowerFirstChar = function () {
  return this.charAt(0).toLowerCase() + this.slice(1);
};

String.prototype.upperFirstChar = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.toCamel = function () {
  return this.replace(/(\-[a-z])/g, ($1) => $1.toUpperCase().replace('-', ''));
};

String.prototype.toDash = function () {
  return this.replace(/([A-Z])/g, ($1) => "-" + $1.toLowerCase());
};

String.prototype.camelToSpace = function () {
  return this.replace(/([A-Z])/g, ($1) => " " + $1);
};

String.prototype.toUnderscore = function () {
  return this.replace(/([A-Z])/g, ($1) => "_" + $1);
};

String.prototype.toPlural = function () {
  const supportResourceSuffixes = ["s", "x", "ch", "sh", "z"];
  let defaultSuffixToAdd = "s";
  let supportedSuffixToAdd = "es";

  let supportedSuffixModify = false;

  supportResourceSuffixes.map(suffix => {
    const slicedString = this.slice(-suffix.length);
    // Check uppercase string
    if (slicedString === suffix.toUpperCase() && supportedSuffixModify === false) {
      supportedSuffixToAdd = "ES";
      supportedSuffixModify = true;
    }
    if (slicedString === suffix && supportedSuffixModify === false) {
      supportedSuffixModify = true;
    }
  });

  if (!supportedSuffixModify) {
    const checkStringUppercase = this.slice(0);
    if (checkStringUppercase === this.slice(0).toUpperCase()) {
      defaultSuffixToAdd = "S";
    }

    return this.concat(defaultSuffixToAdd);
  }

  return this.concat(supportedSuffixToAdd);
};
