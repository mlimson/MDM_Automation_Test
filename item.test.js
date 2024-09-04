const puppeteer = require ('puppeteer');
const chalk = require('chalk');
const moment = require('moment');
const { uniqueNamesGenerator, adjectives,languages } = require('unique-names-generator');
const config = require('./config')

let browser;
let page;

const pageURL = config.pageURL;

//for Login
const IdField = 'input[id="emp_id"]';
const PasswordField = 'input[id="login_password"]';
const LoginBtn = 'button[id="btn_login"]';

//Company
const company = config.company;

//Login credentials
const custodian = config.custodian;
const purchCode = config.purchCode; //for approver/verifier
const purchaser = config.purchaser;
const astsg = config.astsg;
const gl = config.gl;
const categoryName = config.categoryName;
const managedBy = config.managedBy;
const issueMethod = config.issueMethod;
const password = '1234';

//Test Data
const ItmName = ('ITEM ' + uniqueNamesGenerator({dictionaries: [adjectives, languages], style: 'capital', separator: ' '})).toUpperCase(); //prevent duplicates of item Name
const requestedItm = ItmName;
const verifiedItm = ItmName;
const classifiedItm = ItmName;

beforeAll(async () => {
    browser = await puppeteer.launch(
        {
            devtools: false, 
            headless: false, 
            defaultViewport: null, 
            args: [
                '--start-maximized', '--kiosk-printing', 
                '--proxy-server=http://192.168.36.35:3128', 
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-sandbox'
            ]
        }
    );
}, 100000);

afterAll(async () => {
    await browser.close();
}, 100000);

describe('Validation for custodian can create request for new item registration', () => {
    //start of TC_ITM_025
    it('TC_ITM_025 Should create request for new item', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        await page.setViewport({width: 1920, height: 1080});
        await page.type(IdField , custodian, {delay: 50}); //input valid username
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Items Menu
        await page.waitForSelector('#sb_items');
        await page.click('#sb_items');
        
        //Navigate to Request tab
        await page.waitForSelector('#item_request___BV_tab_button__');
        await page.click('#item_request___BV_tab_button__');
        
        //Click Create request button
        await page.waitForSelector('#btn_create_request');
        await page.click('#btn_create_request');
        
        //Select Company
        await page.select('#company_create', company);
        
        //wait for loading to finish
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});
        
        //Select Item Type
        await page.select('#type_item_create', 'I');
        
        //Select Request Type
        await page.select('#request_type_item_create', 'N');

        //Input Item Description
        await page.waitForSelector('#item_desc_create');
        await page.type('#item_desc_create', ItmName);
        console.log(chalk.yellow(ItmName));
        
        //Input Other Name
        await page.waitForTimeout(1500);
        await page.type('#other_name_create', ItmName)
        
        //Select Category Name
        await page.select('#category_name_create', categoryName);
        
        //Select Item Managed By
        await page.waitForTimeout(1500);
        await page.select('#itm_serial_create', managedBy);
        
        //Select Issue Method
        await page.waitForTimeout(1500);
        await page.select('#issue_method_create', issueMethod);
        
        //Check Inventoriable Item
        await page.click('.row:nth-child(4) > .col-4 > .mt-4 > .custom-control-label');
        
        //Select Inv UoM
        await page.waitForTimeout(1500);
        await page.select('#inventory_uom_create', 'UM103');
        
        //Check Purchase Item
        await page.click('.row:nth-child(6) > .col-4 > .mt-4 > .custom-control-label');

        //Select Purchase UoM
        await page.waitForTimeout(1500);
        await page.select('#purchase_uom_create', 'UM103');

        //Click UoM SetUp button
        await page.waitForTimeout(1500);
        await page.click('#btn-setup');
        
        //Select Base UoM
        await page.waitForTimeout(1500);
        await page.select('#base_uom', 'UM103');
        
        //Click Close button
        await page.waitForTimeout(1500);
        await page.click('#cancel_uom_setup');

        //Navigate to Details Tab
        await page.waitForTimeout(1000);
        await page.click('#item_purchaser___BV_tab_button__');
        
        //Input Unit Cost
        await page.click('#cost_create');
        await page.type('#cost_create', '1000');

        //Click Submit button
        await page.waitForSelector('#add_item_modal');
        await page.click('#add_item_modal');
        
        //wait for loading to finish
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        await page.waitForSelector('#alert-requestItem');
        const alert = await page.$eval('#alert-requestItem', elem => elem.innerText);
        expect(alert).toMatch('Success');
        
        //search request
        await page.waitForSelector('#request_item_search');
        const searchBar = await page.$$('#request_item_search');
        await searchBar[0].type(ItmName, {delay:50});
        await page.waitForTimeout(2000);
        await page.waitForSelector('tbody > tr > td > .badge-font-size > .badge-first-level');
        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge-first-level', elem => elem.innerText);
        expect(status).toMatch('Pending');
    }, 100000);//end of TC_ITM_025
}, 500000),

describe('Validation for custodian can update item request', () => {
    //start of TC_ITM_026
    it('TC_ITM_026 Should update request for new item', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});

        await page.type(IdField , custodian, {delay: 50}); //input valid username
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Items Menu
        await page.waitForSelector('#sb_items');
        await page.click('#sb_items');
        
        //Navigate to Request tab
        await page.waitForSelector('#item_request___BV_tab_button__');
        await page.click('#item_request___BV_tab_button__');

        //search request
        await page.waitForSelector('#request_item_search');
        const searchBar = await page.$$('#request_item_search');
        await searchBar[0].type(ItmName, {delay:50});

        //Click Update Request button
        await page.waitForSelector('tbody > tr:nth-child(1) > td > #btn_edit_item_details > .svg-inline--fa');
        await page.click('tbody > tr:nth-child(1) > td > #btn_edit_item_details > .svg-inline--fa');
        
        //wait for loading to finish
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});
        
        //Select Approver/Verifier
        await page.waitForTimeout(2500);
        await page.waitForSelector('#approver_dropdown_item');
        await page.select('#approver_dropdown_item', purchCode);
        
        //Click Submit button
        await page.waitForSelector('#update__item_modal');
        await page.click('#update__item_modal');
        
        //wait for loading to finish
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});

        //---------Expected Result---------
        await page.waitForTimeout(2500);
        await page.waitForSelector('#alert-requestItem');
        const alert = await page.$eval('#alert-requestItem', elem => elem.innerText);
        expect(alert).toMatch('Success');
        
        //validate status
        await page.waitForTimeout(2000);
        await page.waitForSelector('tbody > tr > td > .badge-font-size > .badge-second-level');
        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge-second-level', elem => elem.innerText);
        expect(status).toMatch('Requested');
    }, 100000);//end of TC_ITM_026
},500000),

describe('Validation for purchaser can verify item registration request', () => {
    //start of TC_ITM_034
    it('TC_ITM_034 Should allow Purcahser to verify item registration request', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});

        await page.type(IdField , purchaser, {delay: 50}); //input valid username
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Items Menu
        await page.waitForSelector('#sb_items');
        await page.click('#sb_items');
        
        //Navigate to Request tab
        await page.waitForSelector('#item_request___BV_tab_button__');
        await page.click('#item_request___BV_tab_button__');

        //search request
        await page.waitForSelector('#request_item_search');
        const searchBar = await page.$$('#request_item_search');
        await searchBar[0].type(requestedItm, {delay:50});

        //Click Verify Request button
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
    }, 100000);//end of TC_ITM_034
}, 500000)

describe('Validation for gl accounting can classify item registration request', () => {
    it('TC_ITM_042 Should allow gl accounting to classify item registration request', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        await page.waitForTimeout(2000);

        await page.type(IdField , gl, {delay: 50}); //input valid username
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Items Menu
        await page.waitForSelector('#sb_items');
        await page.click('#sb_items');

        //Navigate to Verify tab
        await page.waitForSelector('#item_verify___BV_tab_button__');
        await page.click('#item_verify___BV_tab_button__');

        //search request
        await page.waitForSelector('#request_item_search');
        const searchBar = await page.$$('#request_item_search');
        await searchBar[1].type(verifiedItm, {delay:50});

        //Click Classify Request button
        await page.waitForSelector('#btn_classify_item');
        await page.click('#btn_classify_item');
        
        //wait for loading to finish
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});

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

describe('Validation for ASTSG can process item registration request', () => {
    it('TC_ITM_046 Should allow ASTSG to process item registration request', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        await page.waitForTimeout(2000);

        await page.type(IdField , astsg, {delay: 50}); //input valid username
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Items Menu
        await page.waitForSelector('#sb_items');
        await page.click('#sb_items');

        //Navigate to Verify tab
        await page.waitForSelector('#item_verify___BV_tab_button__');
        await page.click('#item_verify___BV_tab_button__');

        //search request
        await page.waitForSelector('#request_item_search');
        const searchBar = await page.$$('#request_item_search');
        await searchBar[1].type(classifiedItm, {delay:50});

        //Click Process Request button
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
        await page.waitForSelector('#item_processed___BV_tab_button__')
        await page.click('#item_processed___BV_tab_button__')
        
        await searchBar[2].type(classifiedItm, {delay:50});

        //Validate request found
        await page.waitForSelector('.table > #item_process_table > tbody > tr > td:nth-child(3)');
        const requestName = await page.$eval('.table > #item_process_table > tbody > tr > td:nth-child(3)', elem => elem.innerText);
        expect(requestName).toMatch(classifiedItm);

        //Validate Item Code
        await page.waitForSelector('.table > #item_process_table > tbody > tr:nth-child(1) > td:nth-child(2)');
        const itmCode = await page.$eval('.table > #item_process_table > tbody > tr:nth-child(1) > td:nth-child(2)', elem => elem.innerText);
        console.log(chalk.green(itmCode));
        expect(itmCode.slice(0,2)).toMatch("NM");

        //validate status
        await page.waitForTimeout(2000);
        await page.waitForSelector('tbody > tr > td > .badge-font-size > .badge-fourth-level');
        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge-fourth-level', elem => elem.innerText);
        expect(status).toMatch('Processed');
    }, 100000);
}, 500000)