const crypto = require('crypto');
const https = require('https');

/**
 * Tạo thanh toán MoMo và trả về payUrl
 * @param {Object} options
 * @param {string|number} options.amount - Số tiền thanh toán
 * @param {string} options.orderId - Mã đơn hàng
 * @param {string} options.orderInfo - Thông tin đơn hàng
 * @param {string} [options.redirectUrl] - URL redirect sau thanh toán
 * @param {string} [options.ipnUrl] - URL nhận notify từ MoMo
 * @returns {Promise<string>} payUrl
 */
async function momoPayment({
  amount,
  orderId,
  orderInfo,
  redirectUrl, // URL redirect sau thanh toán
  ipnUrl = "https://fb8d-210-245-71-149.ngrok-free.app/api/momo/callback" // URL nhận notify từ MoMo
}) {
  const partnerCode = "MOMO";
  const accessKey = "F8BBA842ECF85";
  const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const requestId = partnerCode + Date.now();
  const requestType = "captureWallet";
  const extraData = "";

  // Chuẩn bị raw signature
  const rawSignature =
    "accessKey=" + accessKey +
    "&amount=" + amount +
    "&extraData=" + extraData +
    "&ipnUrl=" + ipnUrl +
    "&orderId=" + orderId +
    "&orderInfo=" + orderInfo +
    "&partnerCode=" + partnerCode +
    "&redirectUrl=" + redirectUrl +
    "&requestId=" + requestId +
    "&requestType=" + requestType;

  // Tạo signature
  const signature = crypto.createHmac('sha256', secretkey)
    .update(rawSignature)
    .digest('hex');

  // Tạo body gửi MoMo
  const body = JSON.stringify({
    partnerCode,
    accessKey,
    requestId,
    amount: String(amount),
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType,
    signature,
    lang: 'vi'
  });

  // Gửi request đến MoMo
  const optionsHttps = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/v2/gateway/api/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(optionsHttps, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.payUrl) {
            resolve(result.payUrl);
          } else {
            reject(result);
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(body);
    req.end();
  });
}

module.exports = momoPayment;