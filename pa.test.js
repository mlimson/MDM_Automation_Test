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
const company = config.company;

//Login credentials
const purchaser = config.purchaser;
const purchasingHead = config.purchasingHead;
const item = config.PAitem;
const itemPrice = config.PAitemPrice;
const bp = config.PAbp;
const bpPrice = config.PAbpPrice;
const location = config.PAlocation;
const locationPrice = config.PAlocationPrice;
const requestID = config.PArequestID;
const password = '1234';


beforeAll(async () => {
    browser = await puppeteer.launch(
        {
            devtools: false, 
            headless: false, 
            defaultViewport: null, 
            args: [
                '--start-maximized', '--kiosk-printing', 
                // '--proxy-server=http://192.168.36.35:3128', 
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

describe('Validation for creating request for price approval', () => {
    it('Should create request for Global Price', async() => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
    
        await page.type(IdField , purchaser); //input valid username
        await page.type(PasswordField, password); //input valid password
        await page.click(LoginBtn); //click login button

        await page.waitForSelector('main > .body_loading > #loader > .loader3 > .logoz', {hidden: true});

        //Click Price Approval dropdown menu
        await page.waitForSelector('#sidebar > .sidebar-header > .list-unstyled > li:nth-child(3) > .mb-2');
        await page.click('#sidebar > .sidebar-header > .list-unstyled > li:nth-child(3) > .mb-2');
        await page.waitForTimeout(2000); 
        
        //Select List For Approval
        await page.waitForSelector('li > #collapsePrice > .ml-3 > #sb_listForApproval');
        await page.click('li > #collapsePrice > .ml-3 > #sb_listForApproval');
        await page.waitForTimeout(1500);
        
        //Click Create Request button
        await page.waitForSelector('#btn_create_request');
        await page.click('#btn_create_request');
        await page.waitForTimeout(1500);
        
        //Select Company
        await page.waitForSelector('.select_company');
        await page.select('.select_company', company);
        await page.waitForTimeout(1500);

        //Select Price By
        await page.waitForSelector('#select_priceUpdateFor');
        await page.click('#select_priceUpdateFor');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        //Search item
        await page.click('.multiselect');
        await page.click('#select_item');
        await page.type('#select_item', item);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);

        //Click Add button
        await page.waitForSelector('#btn_add_item');
        await page.click('#btn_add_item');
        await page.waitForTimeout(1500);
        
        //Select UoM
        const UoM = await page.$$('.form-text.custom-select');
        await UoM[2].click();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        //Input New Price
        await page.waitForSelector('#new_price_input');
        await page.click('#new_price_input');
        await page.type('#new_price_input', itemPrice);
    
        //Click Submit button
        await page.waitForSelector('#btn_save_request');
        await page.click('#btn_save_request');

        await page.waitForSelector('.card-text > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});
        
        //Expected Result
        await page.waitForSelector('#tab-request-price > .card-text > .container-fluid > div > .alert');
        const alert = await page.$eval('#tab-request-price > .card-text > .container-fluid > div > .alert', elem => elem.innerText);
        expect(alert).toMatch(' Transaction added.');
        await page.waitForTimeout(1500);

        await page.waitForSelector('#btn-logout')
        await page.click('#btn-logout')
        
        await page.waitForSelector('#btn-save-logout')
        await page.click('#btn-save-logout')
    }, 100000);

    it('Should create request for Price Per Business Partners', async() => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
    
        await page.type(IdField , purchaser); //input valid username
        await page.type(PasswordField, password); //input valid password
        await page.click(LoginBtn); //click login button

        await page.waitForSelector('main > .body_loading > #loader > .loader3 > .logoz', {hidden: true});

        //Click Price Approval dropdown menu
        await page.waitForSelector('#sidebar > .sidebar-header > .list-unstyled > li:nth-child(3) > .mb-2');
        await page.click('#sidebar > .sidebar-header > .list-unstyled > li:nth-child(3) > .mb-2');
        await page.waitForTimeout(2000); 
        
        //Select List For Approval
        await page.waitForSelector('li > #collapsePrice > .ml-3 > #sb_listForApproval');
        await page.click('li > #collapsePrice > .ml-3 > #sb_listForApproval');
        await page.waitForTimeout(1500);
        
        //Click Create Request button
        await page.waitForSelector('#btn_create_request');
        await page.click('#btn_create_request');
        await page.waitForTimeout(1500);
        
        //Select Company
        await page.waitForSelector('.select_company');
        await page.select('.select_company', company);
        await page.waitForTimeout(1500);

        //Select Price By
        await page.waitForSelector('#select_priceUpdateFor');
        await page.click('#select_priceUpdateFor');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        //Select Business Partner
        await page.waitForSelector('#bp_code');
        await page.click('#bp_code');
        await page.waitForTimeout(2000);
        await page.select('#bp_code', bp);

        //Search item
        await page.click('.multiselect');
        await page.click('#select_item');
        await page.type('#select_item', item);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);

        //Click Add button
        await page.waitForSelector('#btn_add_item');
        await page.click('#btn_add_item');
        await page.waitForTimeout(1500);
        
        //Select UoM
        const UoM = await page.$$('.form-text.custom-select');
        await UoM[3].click();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        //Input New Price
        await page.waitForSelector('#new_price_input');
        await page.click('#new_price_input');
        await page.type('#new_price_input', bpPrice);
    
        //Click Submit button
        await page.waitForSelector('#btn_save_request');
        await page.click('#btn_save_request');

        await page.waitForSelector('.card-text > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});
        
        //Expected Result
        await page.waitForSelector('#tab-request-price > .card-text > .container-fluid > div > .alert');
        const alert = await page.$eval('#tab-request-price > .card-text > .container-fluid > div > .alert', elem => elem.innerText);
        expect(alert).toMatch(' Transaction added.');
        await page.waitForTimeout(1500);

        await page.waitForSelector('#btn-logout')
        await page.click('#btn-logout')
        
        await page.waitForSelector('#btn-save-logout')
        await page.click('#btn-save-logout')
    }, 100000);

    it('Should create request for Price Per Location', async() => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
    
        await page.type(IdField , purchaser); //input valid username
        await page.type(PasswordField, password); //input valid password
        await page.click(LoginBtn); //click login button

        await page.waitForSelector('main > .body_loading > #loader > .loader3 > .logoz', {hidden: true});

        //Click Price Approval dropdown menu
        await page.waitForSelector('#sidebar > .sidebar-header > .list-unstyled > li:nth-child(3) > .mb-2');
        await page.click('#sidebar > .sidebar-header > .list-unstyled > li:nth-child(3) > .mb-2');
        await page.waitForTimeout(2000); 
        
        //Select List For Approval
        await page.waitForSelector('li > #collapsePrice > .ml-3 > #sb_listForApproval');
        await page.click('li > #collapsePrice > .ml-3 > #sb_listForApproval');
        await page.waitForTimeout(1500);
        
        //Click Create Request button
        await page.waitForSelector('#btn_create_request');
        await page.click('#btn_create_request');
        await page.waitForTimeout(1500);
        
        //Select Company
        await page.waitForSelector('.select_company');
        await page.select('.select_company', company);
        await page.waitForTimeout(1500);

        //Select Price By
        await page.waitForSelector('#select_priceUpdateFor');
        await page.click('#select_priceUpdateFor');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
        
        //Select Location
        await page.waitForSelector('#price_list');
        await page.click('#price_list');
        await page.select('#price_list', location);

        await page.waitForSelector('.card-text > .container-fluid > #loader > .loader3 > .logoz', {hidden:true});

        //Search item
        await page.click('.multiselect');
        await page.click('#select_item');
        await page.type('#select_item', item);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);

        //Click Add button
        await page.waitForSelector('#btn_add_item');
        await page.click('#btn_add_item');
        await page.waitForTimeout(1500);
        
        //Select UoM
        const UoM = await page.$$('.form-text.custom-select');
        await UoM[3].click();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        //Input New Price
        await page.waitForSelector('#new_price_input');
        await page.click('#new_price_input');
        await page.type('#new_price_input', locationPrice);
    
        //Click Submit button
        await page.waitForSelector('#btn_save_request');
        await page.click('#btn_save_request');

        await page.waitForSelector('.card-text > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});
        
        //Expected Result
        await page.waitForSelector('#tab-request-price > .card-text > .container-fluid > div > .alert');
        const alert = await page.$eval('#tab-request-price > .card-text > .container-fluid > div > .alert', elem => elem.innerText);
        expect(alert).toMatch(' Transaction added.');
        await page.waitForTimeout(1500);

        await page.waitForSelector('#btn-logout')
        await page.click('#btn-logout')
        
        await page.waitForSelector('#btn-save-logout')
        await page.click('#btn-save-logout')
    }, 100000);
}, 500000);
describe('Validation for cancelling pending request for price approval', () => {
    it('Should cancel pending request for price approval', async()=> {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
    
        await page.type(IdField , purchaser); //input valid username
        await page.type(PasswordField, password); //input valid password
        await page.click(LoginBtn); //click login button

        await page.waitForSelector('main > .body_loading > #loader > .loader3 > .logoz', {hidden: true});

        //Click Price Approval dropdown menu
        await page.waitForSelector('#sidebar > .sidebar-header > .list-unstyled > li:nth-child(3) > .mb-2');
        await page.click('#sidebar > .sidebar-header > .list-unstyled > li:nth-child(3) > .mb-2');
        await page.waitForTimeout(2000); 
        
        //Select List For Approval
        await page.waitForSelector('li > #collapsePrice > .ml-3 > #sb_listForApproval');
        await page.click('li > #collapsePrice > .ml-3 > #sb_listForApproval');
        await page.waitForTimeout(1500);

        //Search for request
        const searchBar = await page.$$('#filterInput');
        await searchBar[0].type(requestID);

        //Click Cancel button
        await page.waitForSelector('#btn_cancel_pending');
        await page.click('#btn_cancel_pending');

        await page.waitForSelector('.card-text > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});
        await page.waitForTimeout(1500);

        //Expected Result
        const alert = await page.$eval('#tab-request-price > .card-text > .container-fluid > div > .alert', elem => elem.innerText);
        const status = await page.$eval('tbody > tr:nth-child(1) > td > .badge-font-size > .badge', elem => elem.innerText);
        expect(alert).toMatch('Transaction cancelled');
        expect(status).toMatch('Cancelled');
        await page.waitForTimeout(1500);

        await page.waitForSelector('#btn-logout')
        await page.click('#btn-logout')
        
        await page.waitForSelector('#btn-save-logout')
        await page.click('#btn-save-logout')
    }, 100000);
},500000);

describe('Validation for approving Price Approval request', () => {
    it('Should approve request for Price Approval', async() => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
    
        await page.type(IdField , purchasingHead); //input valid username
        await page.type(PasswordField, password); //input valid password
        await page.click(LoginBtn); //click login button

        await page.waitForSelector('main > .body_loading > #loader > .loader3 > .logoz', {hidden: true});

        //Click Price Approval dropdown menu
        await page.waitForSelector('#sidebar > .sidebar-header > .list-unstyled > li:nth-child(3) > .mb-2');
        await page.click('#sidebar > .sidebar-header > .list-unstyled > li:nth-child(3) > .mb-2');
        await page.waitForTimeout(2000); 
        
        //Select List For Approval
        await page.waitForSelector('li > #collapsePrice > .ml-3 > #sb_listForApproval');
        await page.click('li > #collapsePrice > .ml-3 > #sb_listForApproval');
        await page.waitForTimeout(1500);

        //Navigate to Approve Tab
        await page.waitForSelector('#tab-approval-list___BV_tab_button__');
        await page.click('#tab-approval-list___BV_tab_button__');
        await page.waitForTimeout(1500);
        await page.waitForSelector('.table > #item_approval_table > tbody > tr:nth-child(1) > td:nth-child(1)', {hidden:false})
        //Click Approve button
        await page.waitForSelector('tr > td > #btn_approve_req');
        await page.click('tr > td > #btn_approve_req');
        
        await page.waitForSelector('.card-text > .container-fluid > #loader > .loader3 > .logoz', {hidden:true});
        
        //Expected Result
        const alert = await page.$eval('#tab-approval-list > .card-text > .container-fluid > div > .alert', elem => elem.innerText);
        expect(alert).toMatch("Request approved");
        await page.waitForTimeout(1500);
    },100000);
}, 500000);

describe('Validation for disapproving Price Approval request', () => {
    it('Should disapprove request for Price Approval', async() => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
    
        await page.type(IdField , purchasingHead); //input valid username
        await page.type(PasswordField, password); //input valid password
        await page.click(LoginBtn); //click login button

        await page.waitForSelector('main > .body_loading > #loader > .loader3 > .logoz', {hidden: true});

        //Click Price Approval dropdown menu
        await page.waitForSelector('#sidebar > .sidebar-header > .list-unstyled > li:nth-child(3) > .mb-2');
        await page.click('#sidebar > .sidebar-header > .list-unstyled > li:nth-child(3) > .mb-2');
        await page.waitForTimeout(2000); 
        
        //Select List For Approval
        await page.waitForSelector('li > #collapsePrice > .ml-3 > #sb_listForApproval');
        await page.click('li > #collapsePrice > .ml-3 > #sb_listForApproval');
        await page.waitForTimeout(1500);

        //Navigate to Approve Tab
        await page.waitForSelector('#tab-approval-list___BV_tab_button__');
        await page.click('#tab-approval-list___BV_tab_button__');
        await page.waitForTimeout(1500);
        
        //Click Approve button
        await page.waitForSelector('#btn_disapprove_req');
        await page.click('#btn_disapprove_req');
        
        await page.waitForSelector('.card-text > .container-fluid > #loader > .loader3 > .logoz', {hidden:true});
        
        //Expected Result
        const alert = await page.$eval('#tab-approval-list > .card-text > .container-fluid > div > .alert', elem => elem.innerText);
        expect(alert).toMatch("Request disapproved");
        await page.waitForTimeout(1500);
    },100000);
}, 500000)