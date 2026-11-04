const { InvalidAmountError } = require("../errors/WalletErrors");
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function getAmountCents(amount) {
  if (typeof amount !== "string") {
    throw new InvalidAmountError();
  }

  let [dollars, cents = ""] = amount.split(".");
  let amountCents = Number(dollars) * 100 + Number(cents.padEnd(2, "0"));
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
    throw new InvalidAmountError();
  }
  return amountCents;
}

function formatAmountCents(amountCents) {
  return currencyFormatter.format(amountCents / 100);
}

module.exports = { getAmountCents, formatAmountCents };
