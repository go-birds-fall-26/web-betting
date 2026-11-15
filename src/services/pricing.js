const K = 10;
const FEE_RATE_PERCENT = 7;
const MIN_PRICE_CENTS = 1;
const MAX_PRICE_CENTS = 99;

function getYesPriceCents(yesCount, noCount) {
  let priceCents = Math.round((100 * (yesCount + K)) / (yesCount + noCount + 2 * K));
  return Math.min(MAX_PRICE_CENTS, Math.max(MIN_PRICE_CENTS, priceCents));
}

function getNoPriceCents(yesCount, noCount) {
  return 100 - getYesPriceCents(yesCount, noCount);
}

function getFeeCents(contracts, priceCents) {
  let feeNumerator = FEE_RATE_PERCENT * contracts * priceCents * (100 - priceCents);
  return Math.ceil(feeNumerator / 10000);
}

module.exports = { getYesPriceCents, getNoPriceCents, getFeeCents };