const axios = require("axios");
const sha256 = require("sha256");
const uniqid = require("uniqid");
const orderDao = require("../dao/orderDetails");
const activeSubscriptionDao = require("../dao/activeSubscriptions");
const constants = require("../config/constant");

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID ? process.env.PHONEPE_MERCHANT_ID : "PGTESTPAYUAT86";
const PHONE_PE_HOST_URL = process.env.PHONEPE_HOST_URL ? process.env.PHONEPE_HOST_URL : "https://api-preprod.phonepe.com/apis/pg-sandbox";
const SALT_INDEX = 1;
const SALT_KEY = process.env.PHONEPE_SALT ? process.env.PHONEPE_SALT : "96434309-7796-489d-8924-ab56988a6076";
const APP_BE_URL = "http://localhost:8080/api/v1"; // our application

let payApi = async (req, res, next, merchantTransactionId, userId, amount) => {
    try {
        let pre = req.headers.host.includes("localhost") ? "http://" : "https://";
        // redirect url => phonePe will redirect the user to this url once payment is completed. It will be a GET request, since redirectMode is "REDIRECT"
        let normalPayLoad = {
            merchantId: MERCHANT_ID, //* PHONEPE_MERCHANT_ID . Unique for each account (private)
            merchantTransactionId: merchantTransactionId,
            merchantUserId: userId,
            amount: amount * 100, // converting to paise
            redirectUrl: `${pre}${req.headers.host}${constants.domainConst}/order/status/${merchantTransactionId}`,
            redirectMode: "REDIRECT",
            paymentInstrument: {
                type: "PAY_PAGE",
            },
        };

        // make base64 encoded payload
        let bufferObj = Buffer.from(JSON.stringify(normalPayLoad), "utf8");
        let base64EncodedPayload = bufferObj.toString("base64");

        // X-VERIFY => SHA256(base64EncodedPayload + "/pg/v1/pay" + SALT_KEY) + ### + SALT_INDEX
        let string = base64EncodedPayload + "/pg/v1/pay" + SALT_KEY;
        let sha256_val = sha256(string);
        let xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

        axios
            .post(
                `${PHONE_PE_HOST_URL}/pg/v1/pay`,
                {
                    request: base64EncodedPayload,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-VERIFY": xVerifyChecksum,
                        accept: "application/json",
                    },
                }
            )
            .then(function (response) {
                res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
            })
            .catch(function (error) {
                res.send(error);
            });
    } catch (error) {
        res.send(error);
    }
};

let setStatus = async (req, res) => {
    const { merchantTransactionId } = req.params;

    let presentOrder = await orderDao.findByTransactionId(merchantTransactionId);
    
    if(presentOrder && presentOrder.is_fulfilled == '1') {
        return res.redirect('/maintainance');
    }
    
    // check the status of the payment using merchantTransactionId
    if (merchantTransactionId) {
        let statusUrl =
            `${PHONE_PE_HOST_URL}/pg/v1/status/${MERCHANT_ID}/` +
            merchantTransactionId;

        // generate X-VERIFY
        let string =
            `/pg/v1/status/${MERCHANT_ID}/` + merchantTransactionId + SALT_KEY;
        let sha256_val = sha256(string);
        let xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

        let response = await getStatusApiCall(statusUrl, xVerifyChecksum, merchantTransactionId);

        if (response && response.success) {
            let data = {
                provider_transaction_id: response.data.transactionId,
                is_fulfilled: response.data.responseCode == "SUCCESS" ? "1" : "0",
                pg_response: JSON.stringify(response)
            }
            let order = await orderDao.updateByMerchantTransactionId(data, merchantTransactionId);

            if (order && order.is_fulfilled == '1' && response.data.responseCode == "SUCCESS") {
                // redirect to FE payment success status page
                let valid_till = new Date();
                valid_till.setDate(valid_till.getDate() + numberOfDays(order.validity, order.validity_measure));
                let request = {
                    remaining_amount: order.amount_paid,
                    valid_till: valid_till,
                    is_active: '1',
                    fk_user_id: order.fk_user_id,
                    fk_subscription_id: order.fk_subscription_id,
                    fk_order_id: order.id
                }

                let activeSubscription = await activeSubscriptionDao.insert(request);
                if (activeSubscription) {
                    return res.redirect('/payment-success/' + merchantTransactionId);
                }
            }
            return res.redirect('/payment-failed');
        } else {
            return res.redirect('/payment-failed');
        }

    } else {
        return res.send("Sorry!! Error");
    }
};

let getStatusApiCall = async (statusUrl, xVerifyChecksum, merchantTransactionId) => {
    try {
        let response = await axios
            .get(statusUrl, {
                headers: {
                    "Content-Type": "application/json",
                    "X-VERIFY": xVerifyChecksum,
                    "X-MERCHANT-ID": merchantTransactionId,
                    accept: "application/json",
                },
            });

        if (response) {
            return response.data;
        }
        return null;
    } catch (error) {
        return null;
    }

}

let numberOfDays = (validity, validity_measure) => {
    switch (validity_measure) {
        case "D":
            return validity;
        case "M":
            return validity * 30;
        case "Y":
            return validity * 365;
    }
}

module.exports = {
    payApi,
    setStatus
}