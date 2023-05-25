const config = {
    preset: 'jest-puppeteer',
      reporters: [
          "default",
          ["jest-html-reporters", {
            "publicPath": "./test-results",
            "filename": "mdm-pa-test.html",
            "openReport": true
          }]
        ]
  };
  
  module.exports = config;