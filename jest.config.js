const config = {
    preset: 'jest-puppeteer',
      reporters: [
          "default",
          ["jest-html-reporters", {
            "publicPath": "./test-results",
            "filename": "mdm-price-approval.html",
            "openReport": true
          }]
        ]
  };
  
  module.exports = config;