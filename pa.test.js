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



beforeAll(async () => {
    browser = await puppeteer.launch(
        {
            devtools: false, 
            headless: true, 
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

describe('Validation for creating request for price approval', () => {
    it('Should create request for Global Price', async() => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
    
        await page.type(IdField , purchaser); //input valid username
        await page.type(PasswordField, password); //input valid password
        await page.click(LoginBtn); //click login button

        //Click Price Approval dropdown menu
        await page.waitForSelector('#sidebar > .sidebar-header > .list-unstyled > li:nth-child(3) > .mb-2');
        await page.click('#sidebar > .sidebar-header > .list-unstyled > li:nth-child(3) > .mb-2');
        
        //Select List For Approval
        await page.waitForSelector('li > #collapsePrice > .ml-3 > #sb_listForApproval > .route-name');
        await page.click('li > #collapsePrice > .ml-3 > #sb_listForApproval > .route-name');
        
        //Click Create Request button
        await page.waitForSelector('#btn_create_request');
        await page.click('#btn_create_request');
        
        //Select Company
        await page.waitForSelector('#select_company');
        await page.select('#select_company', company);
        
        //Select Price By
        await page.waitForSelector('#select_priceUpdateFor');
        await page.select('#select_priceUpdateFor', '[object Object]');
        
        await page.waitForSelector('.card-body > .row > .col-9 > .multiselect > .multiselect__tags');
        await page.click('.card-body > .row > .col-9 > .multiselect > .multiselect__tags');
        
        await page.waitForSelector('#select_item');
        await page.click('#select_item');
        
        await page.waitForSelector('#btn_add_item');
        await page.click('#btn_add_item');
        
        await page.waitForSelector('#__BVID__411');
        await page.click('#__BVID__411');
        
        await page.select('#__BVID__411', '[object Object]');
        
        await page.waitForSelector('#__BVID__411');
        await page.click('#__BVID__411');
        
        await page.waitForSelector('#new_price_input');
        await page.click('#new_price_input');
        
        await page.waitForSelector('#btn_save_request');
        await page.click('#btn_save_request');
    }, 10000);
}, 50000);