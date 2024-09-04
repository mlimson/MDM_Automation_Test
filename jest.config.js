const config = {
    preset: 'jest-puppeteer',
      reporters: [
          "default",
          ["jest-html-reporters", {
            "publicPath": "C:/Users/BFI ITG/Desktop/Automation Tests/MDM_Automation_Test/reports",
            "filename": "OrigDev_Test_MDM_PriceApproval.html",
            "openReport": true
          }]
        ]
  };
  
  module.exports = config;