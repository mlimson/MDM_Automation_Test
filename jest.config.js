const config = {
    preset: 'jest-puppeteer',
      reporters: [
          "default",
          ["jest-html-reporters", {
            "publicPath": "C:/Users/BFI/Desktop/Myles Limson/Test Results/MDM - notif bugfix",
            "filename": "MDM-PriceApproval-Error Notif Testing.html",
            "openReport": true
          }]
        ]
  };
  
  module.exports = config;