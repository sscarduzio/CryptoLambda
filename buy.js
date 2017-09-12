const log = require('util').log
const Bitstamp = require('bitstamp')
const promisify = require('./promisify.js')

const FIAT_CURRENCY = process.env.FIAT_CURRENCY
const BTC_ORDER = process.env.BTC_ORDER
const ETH_ORDER = process.env.ETH_ORDER

const timeout = 10000

module.exports.buy = (key, secret, client_id) => {

  const bitstamp = new Bitstamp(key, secret, client_id, timeout)

  bitstamp.balance(null, console.log);

  function buySome(cryptoCurrency, fiatCurrency, fiatAmount) {
    if (!cryptoCurrency || !fiatCurrency || !fiatAmount) {
      throw new Error("Bad data")
    }
    cryptoCurrency = cryptoCurrency.toUpperCase()
    fiatCurrency = fiatCurrency.toUpperCase()
    const market = cryptoCurrency.toLowerCase() + fiatCurrency.toLowerCase()
    const [balance, open_orders, ticker, buy] = [bitstamp.balance, bitstamp.open_orders, bitstamp.ticker, bitstamp.buy].map(promisify)

    return balance(null)

      // Check balance is enough
      .then(res => {
        let fiatBalanceKey = fiatCurrency.toLowerCase() + '_balance'
        let cryptoBalanceKey = cryptoCurrency.toLowerCase() + '_balance'
        log(`Current balance: ${fiatCurrency} ${res.eur_balance}, ${cryptoCurrency} ${res[cryptoBalanceKey]}`)
        if (Number(res[fiatBalanceKey]) < Number(fiatAmount)) throw new Error('Insufficient funds!')
        return open_orders(market)
      })

      // Abort if there's pending orders
      .then(res => {
        if (res.length > 0) throw new Error("we had in flight orders: ", res)
        return ticker(market)
      })

      // Buy
      .then(res => {
        let cryptoToBuy = (fiatAmount / res.ask).toFixed(8)
        if (!cryptoToBuy) throw err
        log(`Now buying ${cryptoToBuy} ${cryptoCurrency} (${fiatAmount} ${fiatCurrency} worth) at price ${res.ask}`)
        return buy(market, cryptoToBuy, res.ask, null)
      })

      // Log result
      .then(res => log('bought!', res))

      // Handle errors in the chain
      .catch((e) => log('promise error: ', e))
  }

  //  buySome('BTC', FIAT_CURRENCY, BTC_ORDER)
  //   .then(() => buySome('ETH', FIAT_CURRENCY, ETH_ORDER))
}