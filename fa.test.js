const puppeteer = require ('puppeteer');
const chalk = require('chalk');
const moment = require('moment');
const config = require('./config')

let browser;
let page;

const pageURL = config.pageURL;

//for Login
const IdField = 'input[id="emp_id"]';
const PasswordField = 'input[id="login_password"]';
const LoginBtn = 'button[id="btn_login"]';

//Company
const company = '213341';

//Login credentials
const custodian = config.custodian;
const purchCode = config.purchCode; //for approver/verifier
const purchaser = config.purchaser;
const astsg = config.astsg;
const gl = config.gl;
const password = '1234';

//Test Data
const FaName = ('Automated Testing - FA ' + moment().format('MMM DD, h:mm:ss a')).toUpperCase(); //prevent duplicates of item Name
const requestedFA = FaName;
const verifiedFA = FaName;
const classifiedFA = FaName;

beforeAll(async () => {
    browser = await puppeteer.launch({devtools: false, headless: false, defaultViewport: null, args: ['--start-maximized', '--kiosk-printing']});
    const title = 'Master Data Management System';
    console.log(chalk.yellow('Title Value: ' + title));
}, 100000);

afterAll(async () => {
    await browser.close();
}, 100000);

describe('Validation for custodian can create request for new fixed asset registration', () => {
    //start of TC_ITM_028
    it('TC_ITM_028 Should create request for new fixed asset', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        // await page.setViewport({
        //     width: 1920,
        //     height: 1080
        // });
    
        await page.on('load');
        await page.on('domcontentloaded');
        const ptitle = await page.title();
        const title = 'Master Data Management System';
        expect(ptitle).toMatch(title);

        console.log(chalk.green('TC_ITM_028 Should create request for new fixed asset'));
        await page.waitForTimeout(2000);

        await page.type(IdField , custodian, {delay: 50}); //input valid username
        await page.waitForTimeout(2000);
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Items Menu
        await page.waitForTimeout(2000);
        await page.waitForSelector('#sb_items');
        await page.click('#sb_items');
        
        //Navigate to Request tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#item_request___BV_tab_button__');
        await page.click('#item_request___BV_tab_button__');
        
        //Click Create request button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_create_request');
        await page.click('#btn_create_request');
        
        //Select Company
        await page.waitForTimeout(2000);
        await page.waitForSelector('#company_create');
        await page.click('#company_create');
        await page.waitForTimeout(2000);
        await page.select('#company_create', company);
        await page.click('#company_create');
        
        //wait for loading to finish
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});
        
        //Select Item Type
        await page.waitForTimeout(2000);
        await page.waitForSelector('#type_item_create');
        await page.click('#type_item_create');
        await page.waitForTimeout(2000);
        await page.select('#type_item_create', 'F');
        await page.click('#type_item_create');
        
        //Select Request Type
        await page.waitForTimeout(2000);
        await page.waitForSelector('#request_type_item_create');
        await page.click('#request_type_item_create');
        await page.waitForTimeout(2000);
        await page.select('#request_type_item_create', 'N');
        await page.click('#request_type_item_create');

        //Input FA Name
        await page.waitForTimeout(2000);
        await page.waitForSelector('#item_desc_create');
        await page.type('#item_desc_create', FaName, {delay:50});
        console.log(chalk.yellow(FaName));
        
        //Input Other Name
        await page.waitForTimeout(2000);
        await page.waitForSelector('#other_name_create');
        await page.type('#other_name_create', FaName, {delay:50});
        
        //Input Cost
        await page.waitForTimeout(2000);
        await page.waitForSelector('#cost_create_FA');
        await page.click('#cost_create_FA');
        await page.type('#cost_create_FA', '5000000', {delay:50});

        //Click Submit button
        await page.waitForSelector('#add_item_modal');
        await page.click('#add_item_modal');
        
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden:true});

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        await page.waitForSelector('#alert-requestItem');
        const alert = await page.$eval('#alert-requestItem', elem => elem.innerText);
        expect(alert).toMatch('Success');
        
        //search request
        await page.waitForSelector('#request_item_search');
        const searchBar = await page.$$('#request_item_search');
        await searchBar[0].type(FaName, {delay:50});
        await page.waitForTimeout(2000);
        await page.waitForSelector('tbody > tr > td > .badge-font-size > .badge-first-level');
        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge-first-level', elem => elem.innerText);
        expect(status).toMatch('Pending');

        await page.waitForTimeout(2500);
    }, 100000);//end of TC_ITM_028
}, 500000),

describe('Validation for custodian can update fixed asset request', () => {
    //start of TC_ITM_029
    it('TC_ITM_029 Should update request for new fixed asset', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        // await page.setViewport({
        //     width: 1920,
        //     height: 1080
        // });
    
        await page.on('load');
        await page.on('domcontentloaded');
        const ptitle = await page.title();
        const title = 'Master Data Management System';
        expect(ptitle).toMatch(title);

        console.log(chalk.green('TC_ITM_029 Should update request for new fixed asset'));
        await page.waitForTimeout(2000);

        await page.type(IdField , custodian, {delay: 50}); //input valid username
        await page.waitForTimeout(2000);
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Items Menu
        await page.waitForTimeout(2000);
        await page.waitForSelector('#sb_items');
        await page.click('#sb_items');
        
        //Navigate to Request tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#item_request___BV_tab_button__');
        await page.click('#item_request___BV_tab_button__');

        //search request
        await page.waitForTimeout(2000);
        await page.waitForSelector('#request_item_search');
        const searchBar = await page.$$('#request_item_search');
        await searchBar[0].type(FaName, {delay:50});

        //Click Update Request button
        await page.waitForTimeout(2000);
        await page.waitForSelector('tr > td > #btn_edit_item_details > .svg-inline--fa > path');
        await page.click('tr > td > #btn_edit_item_details > .svg-inline--fa > path');
        
        //wait for loading to finish
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});
        
        //Select Approver/Verifier
        await page.waitForTimeout(2500);
        await page.waitForSelector('#approver_dropdown_fa');
        await page.click('#approver_dropdown_fa');
        await page.waitForTimeout(2000);
        await page.select('#approver_dropdown_fa', purchCode);
        await page.click('#approver_dropdown_fa');
        
        //Click Submit button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#update__item_modal');
        await page.click('#update__item_modal');
        
        //wait for loading to finish
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        await page.waitForSelector('#alert-requestItem');
        const alert = await page.$eval('#alert-requestItem', elem => elem.innerText);
        expect(alert).toMatch('Success');
        
        //validate status
        await page.waitForTimeout(2500);
        await page.waitForSelector('tbody > tr > td > .badge-font-size > .badge-second-level');
        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge-second-level', elem => elem.innerText);
        expect(status).toMatch('Requested');

        await page.waitForTimeout(2500);
    }, 100000);//end of TC_ITM_029
},500000),

describe('Validation for purchaser can verify fixed asset registration request', () => {
    //start of TC_ITM_036
    it('TC_ITM_036 Should allow Purcahser to verify fixed asset registration request', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        // await page.setViewport({
        //     width: 1920,
        //     height: 1080
        // });
    
        await page.on('load');
        await page.on('domcontentloaded');
        const ptitle = await page.title();
        const title = 'Master Data Management System';
        expect(ptitle).toMatch(title);

        console.log(chalk.green('TC_ITM_036 Should allow Purcahser to verify fixed asset registration request'));
        await page.waitForTimeout(2000);

        await page.type(IdField , purchaser, {delay: 50}); //input valid username
        await page.waitForTimeout(2000);
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Items Menu
        await page.waitForTimeout(2000);
        await page.waitForSelector('#sb_items');
        await page.click('#sb_items');
        
        //Navigate to Request tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#item_request___BV_tab_button__');
        await page.click('#item_request___BV_tab_button__');

        //search request
        await page.waitForTimeout(2000);
        await page.waitForSelector('#request_item_search');
        const searchBar = await page.$$('#request_item_search');
        await searchBar[0].type(requestedFA, {delay:50});

        //Click Verify Request button
        await page.waitForTimeout(2000);
        await page.waitForSelector('tbody > tr:nth-child(1) > td > #btn_verify_request > .svg-inline--fa');
        await page.click('tbody > tr:nth-child(1) > td > #btn_verify_request > .svg-inline--fa');

        //wait to finish loading
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});
        
        //Click Submit button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#verify_item_modal');
        await page.click('#verify_item_modal');

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        await page.waitForSelector('#alert-requestItem');
        const alert = await page.$eval('#alert-requestItem', elem => elem.innerText);
        expect(alert).toMatch('Success');

        await page.waitForTimeout(2000);
        page.reload();

        //Navigate to Verify tab
        await page.waitForTimeout(4000);
        await page.waitForSelector('#item_verify___BV_tab_button__');
        await page.click('#item_verify___BV_tab_button__');

        //search request
        await page.waitForTimeout(2000);
        const searchBar2 = await page.$$('#request_item_search');
        await searchBar2[1].type(requestedFA, {delay:50});
        
        //validate status
        await page.waitForTimeout(2500);
        await page.waitForSelector('tbody > tr > td > .badge-font-size > .badge-third-level');
        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge-third-level', elem => elem.innerText);
        expect(status).toMatch('Verified');

        await page.waitForTimeout(2500);
    }, 100000);//end of TC_ITM_036
}, 500000),

describe('Validation for gl accounting can classify fixed asset registration request', () => {
    it('TC_ITM_043 Should allow gl accounting to classify fixed asset registration request', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        // await page.setViewport({
        //     width: 1920,
        //     height: 1080
        // });
    
        await page.on('load');
        await page.on('domcontentloaded');
        const ptitle = await page.title();
        const title = 'Master Data Management System';
        expect(ptitle).toMatch(title);

        console.log(chalk.green('TC_ITM_043 Should allow gl accounting to classify fixed asset registration request'));
        await page.waitForTimeout(2000);

        await page.type(IdField , gl, {delay: 50}); //input valid username
        await page.waitForTimeout(2000);
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Items Menu
        await page.waitForTimeout(2000);
        await page.waitForSelector('#sb_items');
        await page.click('#sb_items');

        //Navigate to Verify tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#item_verify___BV_tab_button__');
        await page.click('#item_verify___BV_tab_button__');

        //search request
        await page.waitForTimeout(2000);
        await page.waitForSelector('#request_item_search');
        const searchBar = await page.$$('#request_item_search');
        await searchBar[1].type(verifiedFA, {delay:50});

        //Click Classify Request button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_classify_item');
        await page.click('#btn_classify_item');
        
        //wait for loading to finish
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});

        //Navigate to Details Tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#item_general___BV_tab_button__');
        const tabs = await page.$$('#item_general___BV_tab_button__');
        await tabs[1].click();
        
        //Select Asset Class
        await page.waitForSelector('#asset_class_classify');
        await page.click('#asset_class_classify');
        await page.waitForTimeout(2000);
        await page.select('#asset_class_classify', 'AS101');
        await page.click('#asset_class_classify');
        
        //Select Asset Sub-Category
        await page.waitForSelector('#asset_sub_class_classify');
        await page.click('#asset_sub_class_classify');
        await page.waitForTimeout(2000); 
        await page.select('#asset_sub_class_classify', '454');
        await page.click('#asset_sub_class_classify');
    
        //Click Submit button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#classify_item_modal');
        await page.click('#classify_item_modal');

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        await page.waitForSelector('#alert-verifyItem');
        const alert = await page.$eval('#alert-verifyItem', elem => elem.innerText);
        expect(alert).toMatch('Success');
        
        //validate status
        await page.waitForTimeout(2500);
        await page.waitForSelector('tbody > tr > td > .badge-font-size > .badge-sage');
        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge-sage', elem => elem.innerText);
        expect(status).toMatch('Classified');
    }, 100000);
}, 500000),

describe('Validation for ASTSG can process fixed asset registration request', () => {
    it('TC_ITM_048 Should allow ASTSG to process fixed asset registration request', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        // await page.setViewport({
        //     width: 1920,
        //     height: 1080
        // });
    
        await page.on('load');
        await page.on('domcontentloaded');
        const ptitle = await page.title();
        const title = 'Master Data Management System';
        expect(ptitle).toMatch(title);

        console.log(chalk.green('TC_ITM_048 Should allow ASTSG to process fixed asset registration request'));
        await page.waitForTimeout(2000);

        await page.type(IdField , astsg, {delay: 50}); //input valid username
        await page.waitForTimeout(2000);
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Items Menu
        await page.waitForTimeout(2000);
        await page.waitForSelector('#sb_items');
        await page.click('#sb_items');

        //Navigate to Verify tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#item_verify___BV_tab_button__');
        await page.click('#item_verify___BV_tab_button__');

        //search request
        await page.waitForTimeout(2000);
        await page.waitForSelector('#request_item_search');
        const searchBar = await page.$$('#request_item_search');
        await searchBar[1].type(classifiedFA, {delay:50});

        //Click Process Request button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_process_Request');
        await page.click('#btn_process_Request');
        
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});
        
        //Click Submit button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#classify_item_modal');
        await page.click('#classify_item_modal');
        
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        await page.waitForSelector('#alert-verifyItem');
        const alert = await page.$eval('#alert-verifyItem', elem => elem.innerText);
        expect(alert).toMatch('Success');

        //Navigate to Process Tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#item_processed___BV_tab_button__')
        await page.click('#item_processed___BV_tab_button__')
        
        await page.waitForTimeout(2000);
        await searchBar[2].type(classifiedFA, {delay:50});

        //Validate request found
        await page.waitForSelector('.table > #item_process_table > tbody > tr > td:nth-child(3)');
        const requestName = await page.$eval('.table > #item_process_table > tbody > tr > td:nth-child(3)', elem => elem.innerText);
        expect(requestName.toUpperCase()).toMatch(classifiedFA);

        //Validate Item Code
        await page.waitForSelector('.table > #item_process_table > tbody > tr:nth-child(1) > td:nth-child(2)');
        const itmCode = await page.$eval('.table > #item_process_table > tbody > tr:nth-child(1) > td:nth-child(2)', elem => elem.innerText);
        console.log(chalk.green(itmCode));
        expect(itmCode.slice(0,2)).toMatch("FA");

        //validate status
        await page.waitForTimeout(2000);
        await page.waitForSelector('tbody > tr > td > .badge-font-size > .badge-fourth-level');
        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge-fourth-level', elem => elem.innerText);
        expect(status).toMatch('Processed');
    }, 100000);
}, 500000)