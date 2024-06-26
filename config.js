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
    gl: process.env.gl,
    BPGroup: process.env.BPGroup,
    BPAccount: process.env.BPAccount,
    purchCode: process.env.purchCode,
    categoryName: process.env.categoryName,
    managedBy: process.env.managedBy,
    issueMethod: process.env.issueMethod,
    assetClass: process.env.assetClass,
    assetSubClass: process.env.assetSubClass,
    PAitem: process.env.PAitem,
    PAitemPrice: process.env.PAitemPrice,
    PAbp: process.env.PAbp,
    PAbpPrice: process.env.PAbpPrice,
    PAlocation: process.env.PAlocation,
    PAlocationPrice: process.env.PAlocationPrice,
    PArequestID: process.env.PArequestID,
    vendorCode: process.env.vendorCode,
    customerCode: process.env.customerCode
}

module.exports = config