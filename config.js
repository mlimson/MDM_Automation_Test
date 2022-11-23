require('dotenv').config()
const config = {
    pageURL: process.env.pageURL,
    company: process.env.company,
    purchaser: process.env.purchaser,
    purchasingHead: process.env.purchasingHead,
    functional: process.env.functional,
    salesStaff: process.env.salesStaff,
    salesHead: process.env.salesHead,
    custodian: process.env.custodian,
    astsg: process.env.astsg,
    gl: process.env.gl
}

module.exports = config