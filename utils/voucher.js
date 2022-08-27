const fetch = require('node-fetch-commonjs');
async function redeemVoucher(voucher){
    let code = voucher.split(/([/, =])/);
    let voucher_code = code[10];
    let req = await fetch(
      `https://gift.truemoney.com/campaign/vouchers/${voucher_code}/redeem`,
      {
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          mobile: `${mobile}`,
          voucher_hash: `${voucher_code}`,
        }),
        method: "POST",
      }
    )
    var data = await req.json();
    return data;
}
module.exports = {
    redeemVoucher
}