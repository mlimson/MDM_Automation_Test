const config = {
    preset: 'jest-puppeteer',
      reporters: [
          "default",
          ["jest-html-reporters", {
            "publicPath": "C:/Users/BFI/Desktop/Myles Limson/Test Results/Indirect License - Custom Apps/MDM",
            "filename": "MDM-Customer-Indirect-License.html",
            "openReport": true
          }]
        ]
  };
  
  module.exports = config;