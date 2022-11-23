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
const functional = config.functional;
const password = '1234';

//Test Data
const SuppName = 'Automated Testing - Supplier ' + moment().format('MMM DD, h:mm:ss a'); //prevent duplicates of Supplier Name
const requestedSupplier = 'AUTOMATED TESTING - SUPPLIER SEP 28, 3:00:00 PM';
const approvedSupplier = 'AUTOMATED TESTING - SUPPLIER SEP 27, 3:29:41 PM';

beforeAll(async () => {
    browser = await puppeteer.launch({devtools: false, headless: false, defaultViewport: null, args: ['--start-maximized', '--kiosk-printing']});
    const title = 'Master Data Management System';
    console.log(chalk.yellow('Title Value: ' + title));
}, 100000);

afterAll(async () => {
    await browser.close();
}, 100000);

describe('Validation for purcahsing staff can create request for new supplier registration', () => {
    //start of TC_SPLR_024
    it('TC_SPLR_024 Should allow creating request for new supplier registration', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        await page.setViewport({
            width: 1920,
            height: 1080
        });
    
        await page.on('load');
        await page.on('domcontentloaded');
        const ptitle = await page.title();
        const title = 'Master Data Management System';
        expect(ptitle).toMatch(title);

        console.log(chalk.green('TC_SPLR_024 Should allow creating request for new supplier registration'));
        await page.waitForTimeout(2500);

        await page.type(IdField , purchaser, {delay: 50}); //input valid username
        await page.waitForTimeout(2000);
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Suppliers Menu
        await page.waitForTimeout(2000);
        await page.waitForSelector('#sb_suppliers');
        await page.click('#sb_suppliers');

        //Navigate to Request Tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#supplier_request___BV_tab_button__');
        await page.click('#supplier_request___BV_tab_button__');

        //Click Create Request button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_create_request');
        await page.click('#btn_create_request');
        await page.waitForTimeout(2000);
        
        //Select Company
        await page.waitForSelector('#filter_company');
        await page.click('#filter_company');
        await page.waitForTimeout(2000);
        await page.select('#filter_company', company);
        await page.click('#filter_company');

        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden:true});
        
        //Select Business Partner Type
        await page.waitForSelector('#bp_type_supp_add');
        await page.click('#bp_type_supp_add');
        await page.waitForTimeout(2000);
        await page.select('#bp_type_supp_add', 'S');
        await page.click('#bp_type_supp_add');
        
        //Select Request Type
        await page.waitForSelector('#request_type_supp_add');
        await page.click('#request_type_supp_add');
        await page.waitForTimeout(2000);
        await page.select('#request_type_supp_add', 'N');
        await page.click('#request_type_supp_add');
        
        //Input Supplier Name
        await page.waitForTimeout(2000);
        await page.waitForSelector('#supp_name_add');
        await page.type('#supp_name_add',SuppName, {delay: 50})
        console.log(chalk.yellow(SuppName));
        
        //Input Payee Name
        await page.waitForSelector('#payee_name_supp_add');
        await page.type('#payee_name_supp_add', SuppName, {delay: 50});
        
        //Select Vendor Type
        await page.waitForTimeout(2000);
        await page.waitForSelector('#vendor_type');
        await page.click('#vendor_type');
        await page.waitForTimeout(2000);
        await page.select('#vendor_type', 'C');
        await page.click('#vendor_type');
        
        //Select Group
        await page.waitForTimeout(2000);
        await page.waitForSelector('#group_supp_add');
        await page.click('#group_supp_add');
        await page.waitForTimeout(2000);
        await page.select('#group_supp_add', 'BV121');
        await page.click('#group_supp_add');

        //Select Currency
        await page.waitForTimeout(2000);
        await page.waitForSelector('#currency_supp_add');
        await page.click('#currency_supp_add');
        await page.waitForTimeout(2000);
        await page.select('#currency_supp_add', 'USD');
        await page.click('#currency_supp_add');
        
        //Input TIN
        await page.waitForSelector('#tin_supp_add');
        const SuppTIN = '123-123-12' + moment().format('DDhmmss'); //prevent duplicates of TIN
        await page.type('#tin_supp_add', SuppTIN, {delay: 50});
        
        //Input Telephone Numbers
        await page.waitForSelector('#telephone_no_supp_add');
        const telPhone = await page.$$('#telephone_no_supp_add');
        await telPhone[0].type('2424242242', {delay: 50});
        await telPhone[1].type('1238787780', {delay: 50});
        
        //Input Mobile Number
        await page.waitForSelector('#mobile_no_supp_add');
        await page.type('#mobile_no_supp_add', '2124567890', {delay: 50});

        //Input Fax
        await page.waitForSelector('#fax_no_supp_add');
        await page.type('#fax_no_supp_add', '215415813223', {delay: 50});
        
        //Input E-mail
        await page.waitForSelector('#email_supp_add');
        await page.type('#email_supp_add', 'vendor_email@email.com', {delay: 50});
        
        //Input Website

        await page.waitForSelector('#website_supp_add');
        await page.type('#website_supp_add', 'vendor-site.nat', {delay: 50});
        
        //Select Region
        await page.waitForSelector('#region_supp_add');
        await page.select('#region_supp_add', 'REGION XII');
        
        //Input Business Style / Trade Name
        await page.waitForSelector('#bus_style');
        await page.type('#bus_style', 'BussStyle', {delay: 50});
        
        //Input Nature OF Business
        await page.waitForSelector('#nature_of_business_add');
        await page.type('#nature_of_business_add', 'Nature Of Business', {delay: 50});
        
        //Input Geographical Location
        await page.waitForSelector('#geo_loc_supp_add');
        await page.type('#geo_loc_supp_add', 'Geographical Location', {delayed:50});
        
        //Toggle Issue Invoice
        await page.waitForSelector('.card-body > .row > .col > .mt-3 > .custom-control-label');
        await page.click('.card-body > .row > .col > .mt-3 > .custom-control-label');
        
        //Navigate to Payment Terms tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#payment_terms___BV_tab_button__');
        await page.click('#payment_terms___BV_tab_button__');
        
        //Select Payment Terms
        await page.waitForTimeout(2500);
        await page.waitForSelector('#payment_terms_supp_add');
        await page.click('#payment_terms_supp_add');
        await page.waitForTimeout(2000);
        await page.select('#payment_terms_supp_add', 'PT102');
        await page.click('#payment_terms_supp_add');
        
        //Select Price List        
        await page.waitForSelector('#price_list_supp_add');
        await page.click('#price_list_supp_add');
        await page.waitForTimeout(2000);
        await page.select('#price_list_supp_add', 'PL103');
        await page.click('#price_list_supp_add');
        
        //Input Credit Limit
        await page.waitForTimeout(2000);
        await page.click('#credit_limit_supp_add');
        await page.type('#credit_limit_supp_add', '1234', {delay:100});
        
        //Input Commitment Limit
        await page.waitForTimeout(2000);
        await page.click('#commitment_limit_supp_add');
        await page.type('#commitment_limit_supp_add', '1234', {delay:100});
 
        //---------Expected Result---------
        await page.waitForTimeout(2000);
        const nextBTN = await page.$('#btn_next[disabled]');
        expect(nextBTN).toBeFalsy();

        await page.waitForTimeout(2500);
    }, 100000);//end of TC_SPLR_024

    //start of TC_SPLR_025
    it('TC_SPLR_025 Should allow adding Address details', async() => {
        console.log(chalk.green('TC_SPLR_025 Should allow adding Address details'));

        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        await page.waitForTimeout(2500);

        //Select Address Type
        await page.waitForSelector('#address_type_add');
        await page.click('#address_type_add');
        await page.waitForTimeout(2000);
        await page.select('#address_type_add', 'B');
        await page.click('#address_type_add');

        //Input Address Name 2
        await page.waitForSelector('#address2_add');
        await page.type('#address2_add', 'Office Address', {delay:50});
        
        //Input Address Name 3
        await page.waitForSelector('#address3_add');
        await page.type('#address3_add', 'Main Branch', {delay:50});
        
        //Input Street
        await page.waitForSelector('#street_add');
        await page.type('#street_add', 'Jefferson St N', {delay: 50});
        
        //Input Street Number
        await page.waitForSelector('#street_no_add');
        await page.type('#street_no_add', '201', {delay:50});
        
        //Input Building / Floor / Room
        await page.waitForSelector('#bldg_flr_rm_add');
        await page.type('#bldg_flr_rm_add', 'The Avenue Apartments', {delay:50});
        
        //Input Block
        await page.waitForSelector('#block_add');
        await page.type('#block_add', 'Blk 15', {delay:50});
        
        //Input City / Town
        await page.waitForSelector('#town_city_add');
        await page.type('#town_city_add', 'Huntsville', {delay:50});
        
        //Zip Code
        await page.waitForSelector('#zip_code_add');
        await page.type('#zip_code_add', '35801', {delay:50});
        
        //Input County / Province
        await page.waitForSelector('#county_add')
        await page.type('#county_add', 'Madison County', {delay:50})
        
        //Select Country
        await page.waitForSelector('#country_add');
        await page.click('#country_add');
        await page.waitForTimeout(2000);
        await page.select('#country_add', 'US');
        await page.click('#country_add');
        
        //Select State
        await page.waitForTimeout(2500);
        await page.waitForSelector('#state_add');
        await page.click('#state_add');
        await page.select('#state_add', 'AL');
        
        //Click Add Address button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#add_address');
        await page.click('#add_address');

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        const nextBTN = await page.$('#btn_next[disabled]');
        expect(nextBTN).toBeFalsy();
        
        const tableRow = await page.$('.cardShadow > .card-body > .table > #address_table_supp > tbody > .b-table-empty-row > td');
        expect(tableRow).toBeFalsy();

        await page.waitForTimeout(2500);
    }, 100000);//end of TC_SPLR_025

    //start of TC_SPLR_026
    it('TC_SPLR_026 Should allow adding Contact details', async () => {
        console.log(chalk.green('TC_SPLR_026 Should allow adding Contact details'));

        //Click Next button
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        await page.waitForTimeout(2000);
        
        //Input Contact Title
        await page.waitForSelector('#contact_title_add');
        await page.type('#contact_title_add', 'HR', {delay:50});
        
        //Input First Name
        await page.waitForSelector('#contacts_fname_add');
        await page.type('#contacts_fname_add', 'Muriel'), {delay:50};
        
        //Input Middle Name
        await page.waitForSelector('#contacts_mname_add')
        await page.type('#contacts_mname_add', 'Courage', {delay:50})
        
        //Input Last Name
        await page.waitForSelector('#contacts_lname_add')
        await page.type('#contacts_lname_add', 'Bagge', {delay:50})
        
        //Input Job Title
        await page.waitForSelector('#contacts_job_title_add');
        await page.type('#contacts_job_title_add', 'Human Resource Staff', {delay:50});
        
        //Input Contact Address
        await page.waitForSelector('#contacts_address_add');
        await page.type('#contacts_address_add', 'Fairfield, Connecticut', {delay:50});
        
        //Input Telephone
        await page.waitForSelector('#contacts_phone_no_add');
        const phoneNum = await page.$$('#contacts_phone_no_add');
        await phoneNum[0].type('2124567890', {delay:50});
        await phoneNum[1].type('2125765915', {delay:50});
        
        //Input Mobile Number
        await page.waitForSelector('#contacts_mobile_no_add');
        await page.type('#contacts_mobile_no_add', '2124567890',{delay:50});
        
        //Input Fax
        await page.waitForSelector('#contacts_fax_no_add');
        await page.type('#contacts_fax_no_add', '2124567890', {delay:50});
        
        //Input Email Address
        await page.waitForSelector('#email_add_contacts_add');
        await page.type('#email_add_contacts_add', 'muriel.bagge@email.com', {delay:50});
        
        //Click add Contact button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#add_contacts');
        await page.click('#add_contacts');

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        const nextBTN = await page.$('#btn_next[disabled]');
        expect(nextBTN).toBeFalsy();
        
        const tableRow = await page.$('.table > #address_table > tbody > .b-table-empty-row > td');
        expect(tableRow).toBeFalsy();

        await page.waitForTimeout(2500);
    }, 100000);//end of TC_SPLR_026

    //start of TC_SPLR_027
    it('TC_SPLR_027 Should submit request', async () => {
        console.log(chalk.green('TC_SPLR_027 Should submit request'));

        //Click Next button
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        await page.waitForTimeout(2000);

        //Click Submit button
        await page.waitForSelector('#btn_done');
        await page.click('#btn_done');
        await page.waitForTimeout(2000);
        
        //Click Yes button
        await page.waitForSelector('#btn_save_submit-create');
        await page.click('#btn_save_submit-create');
        await page.waitForTimeout(2500);
        //wait for loading to stop
        await page.waitForSelector('.container-fluid > .container-fluid > #loader > .loader3 > .logoz', {hidden: true})

        //---------Expected Result---------
        await page.waitForSelector('#alert-supplier');
        const alert = await page.$eval('#alert-supplier', elem => elem.innerText);
        expect(alert).toMatch('Success');
        
        //search request
        await page.waitForSelector('#request_supplier_search');
        const searchBar = await page.$$('#request_supplier_search');
        await searchBar[0].type(SuppName, {delay:50});
        await page.waitForTimeout(2000);
        await page.waitForSelector('tbody > tr > td > .badge-font-size > .badge-first-level');
        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge-first-level', elem => elem.innerText);
        expect(status).toMatch('Pending');

        await page.waitForTimeout(2500);
    }, 100000);//end of TC_SPLR_027
}, 500000),

describe('Validation for purchasing staff can update request created for suplier registration', () => {
    //start of TC_SPLR_028
    it('TC_SPLR_028 Should update supplier request', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        await page.setViewport({
            width: 1920,
            height: 1080
        });
    
        await page.on('load');
        await page.on('domcontentloaded');
        const ptitle = await page.title();
        const title = 'Master Data Management System';
        expect(ptitle).toMatch(title);

        console.log(chalk.green('TC_SPLR_028 Should update supplier request'));
        await page.waitForTimeout(2500);

        await page.type(IdField , purchaser, {delay: 50}); //input valid username
        await page.waitForTimeout(2000);
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button

        //Navigate to Suppliers Menu
        await page.waitForTimeout(2000);
        await page.waitForSelector('#sb_suppliers');
        await page.click('#sb_suppliers');

        //Navigate to Request Tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#supplier_request___BV_tab_button__');
        await page.click('#supplier_request___BV_tab_button__');

        //search request
        await page.waitForTimeout(2000);
        await page.waitForSelector('#request_supplier_search');
        const searchBar = await page.$$('#request_supplier_search');
        await searchBar[0].type(SuppName, {delay:50});

        //Click Update Request button
        await page.waitForTimeout(2000);
        await page.waitForSelector('tr:nth-child(1) > td > #btn-view_supplier_details > .svg-inline--fa > path');
        await page.click('tr:nth-child(1) > td > #btn-view_supplier_details > .svg-inline--fa > path');
        
        //wait for loading
        await page.waitForSelector('.container-fluid > div > #loader > .loader3 > .logoz', {hidden: true});
        await page.waitForTimeout(2000);
        //Click Next button to proceed to Addresses
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        
        //Click Next button to proceed to Contacts
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        const nextBTN = await page.$('#btn_next[disabled]');
        expect(nextBTN).toBeFalsy();

        await page.waitForTimeout(2500);
    }, 100000);//end of TC_SPLR_028

    //start of TC_SPLR_029
    it('TC_SPLR_029 Should attach Documents', async () => {
        console.log(chalk.green('TC_SPLR_029 Should attach Documents'));
        await page.waitForTimeout(2500);

        //Click Next button to proceed to attachments
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        
        //Upload attachments
        await page.waitForTimeout(2000);
        const attachment = await page.$$('.custom-file-input');
        await attachment[0].uploadFile('C:\\Users\\BFI\\Pictures\\download.png');
        
        //---------Expected Result---------
        let attchField = await page.$eval('.custom-file-label', elem => elem.innerText);
        expect(attchField).not.toMatch('Choose a file or drop it here...');

        await page.waitForTimeout(2500);
    }, 100000);//end of TC_SPLR_029

    //start of TC_SPLR_030
    it('TC_SPLR_030 Should submit request', async () => {
        console.log(chalk.green('TC_SPLR_030 Should submit request'));
        await page.waitForTimeout(2500);

        //Click Next button to proceed to Signatories
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        
        //Click Submit button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_done');
        await page.click('#btn_done');
        
        //Click Yes button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_save_edit');
        await page.click('#btn_save_edit');

        //wait for loading to stop
        await page.waitForSelector('.container-fluid > div > #loader > .loader3 > .logoz', {hidden: true});

        //---------Expected Result---------
        await page.waitForSelector('#alert-supplier');
        const alert = await page.$eval('#alert-supplier', elem => elem.innerText);
        expect(alert).toMatch('Success');
        
        //validate status
        await page.waitForTimeout(2000);
        await page.waitForSelector('tbody > tr > td > .badge-font-size > .badge-second-level');
        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge-second-level', elem => elem.innerText);
        expect(status).toMatch('Requested');
    }, 100000);//end of TC_SPLR_030
}, 500000),

describe('Validation for purchasing head can approve request for supplier registration', () => {
    //start of TC_SPLR_037
    it('TC_SPLR_037 Should approve new supplier request', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        await page.setViewport({
            width: 1920,
            height: 1080
        });
    
        await page.on('load');
        await page.on('domcontentloaded');
        const ptitle = await page.title();
        const title = 'Master Data Management System';
        expect(ptitle).toMatch(title);

        console.log(chalk.green('TC_SPLR_037 Should approve new supplier request'));
        await page.waitForTimeout(2500);

        await page.type(IdField , purchasingHead, {delay: 50}); //input valid username
        await page.waitForTimeout(2000);
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button
        
        //Navigate to Suppliers Menu
        await page.waitForTimeout(2000);
        await page.waitForSelector('#sb_suppliers');
        await page.click('#sb_suppliers');

        //Navigate to Request Tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#supplier_request___BV_tab_button__');
        await page.click('#supplier_request___BV_tab_button__');

        //search request
        await page.waitForTimeout(2000);
        await page.waitForSelector('#request_supplier_search');
        const searchBar = await page.$$('#request_supplier_search');
        await searchBar[0].type(requestedSupplier, {delay:50});

        //Click Approve Request buttton
        await page.waitForTimeout(2000);
        await page.waitForSelector('tbody > tr:nth-child(1) > td > #btn_approve_request_other_approvers > .icons');
        await page.click('tbody > tr:nth-child(1) > td > #btn_approve_request_other_approvers > .icons');
        
        //Click Approve button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_approve_requestSupplier');
        await page.click('#btn_approve_requestSupplier');
        
        await page.waitForSelector('.card-text > .container-fluid > #loader > .loader3 > .logoz', {hidden: true});
        
        //---------Expected Result---------
        await page.waitForSelector('#alert-supplier');
        await page.waitForTimeout(2000);
        const alert = await page.$eval('#alert-supplier', elem => elem.innerText);
        expect(alert).toMatch('Success');

        //Navigate to Approve tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#supplier_approved___BV_tab_button__');
        await page.click('#supplier_approved___BV_tab_button__');
        
        //Search for approved Supplier request
        await page.waitForTimeout(2000);
        await page.waitForSelector('#request_customer_search');
        await page.type('#request_customer_search', requestedSupplier, {delay:50});
        await page.waitForTimeout(2000);
        
        const status = await page.$eval('tbody > tr:nth-child(1) > td > .badge-font-size > .badge-third-level', elem => elem.innerText);
        expect(status).toMatch('Approved');

        await page.waitForTimeout(2500);
    }, 100000);//end of TC_SPLR_037
}, 500000)

describe('Validation for functional financials can process request for supplier registration', () => {
    //start of TC_SPLR_040
    it('TC_SPLR_040 Should select VAT Definition and Group', async () => {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        await page.goto(pageURL, {waitUntil: 'networkidle0'});
        await page.setViewport({
            width: 1920,
            height: 1080
        });
    
        await page.on('load');
        await page.on('domcontentloaded');
        const ptitle = await page.title();
        const title = 'Master Data Management System';
        expect(ptitle).toMatch(title);

        console.log(chalk.green('TC_SPLR_040 Should select VAT Definition and Group'));
        await page.waitForTimeout(2500);

        await page.type(IdField , functional, {delay: 50}); //input valid username
        await page.waitForTimeout(2000);
        await page.type(PasswordField, password, {delay: 50}); //input valid password
        await page.click(LoginBtn); //click login button
        
        //Navigate to Suppliers Menu
        await page.waitForTimeout(2000);
        await page.waitForSelector('#sb_suppliers');
        await page.click('#sb_suppliers');

        //Navigate to Approve tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#supplier_approved___BV_tab_button__');
        await page.click('#supplier_approved___BV_tab_button__');
        
        //Search for approved Supplier request
        await page.waitForTimeout(2000);
        await page.waitForSelector('#request_customer_search');
        await page.type('#request_customer_search', approvedSupplier, {delay:50});
        await page.waitForTimeout(2000);

        //Click Process Request button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn-process-supp-request');
        await page.click('#btn-process-supp-request');

        //Select VAT Definition
        await page.waitForTimeout(2500);
        await page.waitForSelector('#vat_definition_supp_process');
        await page.click('#vat_definition_supp_process');
        await page.waitForTimeout(2000);
        await page.select('#vat_definition_supp_process', 'Y');
        await page.click('#vat_definition_supp_process');
        
        //Select VAT Group
        await page.waitForTimeout(2000);
        await page.waitForSelector('#vat_group_supp_process');
        await page.click('#vat_group_supp_process');
        await page.waitForTimeout(2000);
        await page.select('#vat_group_supp_process', 'VG108');
        await page.click('#vat_group_supp_process');

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        const nextBTN = await page.$('#btn_next[disabled]');
        expect(nextBTN).toBeFalsy();

        await page.waitForTimeout(2500);
    }, 100000);//end of TC_SPLR_040

    //start of TC_SPLR_041
    it('TC_SPLR_041 Should allow adding Bank Account', async () => {
        console.log(chalk.green('TC_SPLR_041 Should allow adding Bank Account'));
        await page.waitForTimeout(2000);

        // Navigate to Bank Accounts tab
        await page.waitForSelector('#bank-accounts___BV_tab_button__');
        await page.click('#bank-accounts___BV_tab_button__');
        
        //Select Bank Name
        await page.waitForTimeout(2000);
        await page.waitForSelector('#bank_name_process');
        await page.click('#bank_name_process');
        await page.waitForTimeout(2000);
        await page.select('#bank_name_process', 'BDO');
        await page.click('#bank_name_process');
        
        //Input Bank Branch
        await page.waitForSelector('#branch_process');
        await page.type('#branch_process', 'BDO PIONEER GSC BRANCH', {delay:50});
        
        //Input Bank Account Name
        await page.waitForSelector('#bank_account_name_process')
        await page.type('#bank_account_name_process', approvedSupplier, {delay:50})
        
        //Input Bank Account Number
        await page.waitForSelector('#bank_account_no_process')
        await page.type('#bank_account_no_process', '41123154120',{delay:50})
        
        //Inout Currency
        await page.waitForSelector('#account_currency_process');
        await page.type('#account_currency_process', 'USD', {delay:50});
        
        //Input Account Type
        await page.waitForSelector('#account_type_process');
        await page.type('#account_type_process', 'Current', {delay:50});
        
        //Swift Code
        await page.waitForSelector('#swift_code_process');
        await page.type('#swift_code_process', 'BDOPNRGSCBRNCH', {delay:50});
        
        //Input Street No
        await page.waitForSelector('#street_no_process');
        await page.type('#street_no_process', '35th', {delay:50});
        
        //Input Street
        await page.waitForSelector('#street_process');
        await page.type('#street_process', 'Arriola St', {delay:50});
        
        //Input City
        await page.waitForSelector('#city_process');
        await page.type('#city_process', 'General Santos City', {delay:50});
        
        //Input Zip
        await page.waitForSelector('#zip_code_process')
        await page.type('#zip_code_process', '9500', {delay:50})
        
        //Click Add button
        await page.waitForSelector('#add_bank_account');
        await page.click('#add_bank_account');

        //---------Expected Result---------
        await page.waitForTimeout(2000);
        const tableRow = await page.$('.my-table > #bank_account_table_process > tbody > .b-table-empty-row > td');
        expect(tableRow).toBeFalsy();
        await page.waitForTimeout(2000);
    }, 100000);//end of TC_SPLR_041

    //start of TC_SPLR_042
    it('TC_SPLR_042 Should show default Account', async () => {
        console.log(chalk.green('TC_SPLR_042 Should show default Account'));

        //Navigate to Accounting Inputs tab
        await page.waitForTimeout(2000);
        page.waitForSelector('#accounting___BV_tab_button__');
        await page.click('#accounting___BV_tab_button__');
        
        //---------Expected Results---------
        await page.waitForTimeout(2000);

        // await page.$eval('.card-body > .row >.col > .row > .col-10 > #credit_limit_supp_add', el => el.disabled = false);
        const accountsPayable = await page.$eval('.card-body > .row >.col > .row > .col-10 > #credit_limit_supp_add', elem => elem.value);
        // console.log(accountsPayable);
        expect(accountsPayable).toMatch('( 211301000-400-000-000-000-000 ) - AP Others-AFC');

        await page.waitForTimeout(2000);
    }, 100000);//end of TC_SPLR_042

    //start of TC_SPLR_043
    it('TC_SPLR_043 Should submit request', async () => {
        console.log(chalk.green('TC_SPLR_043 Should submit request'));
        await page.waitForTimeout(2000);

        //Click Next button to proceed to Addresses
        await page.waitForSelector('#btn_next');
        await page.click('#btn_next');
        
        //Click Next button to proceed to Contacts
        await page.waitForTimeout(2000);
        await page.click('#btn_next');
        
        //Click Next button to proceed to Signatories
        await page.waitForTimeout(2000);
        await page.click('#btn_next');
        
        //Click Submit button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_done');
        await page.click('#btn_done');
        
        //Click Yes button
        await page.waitForTimeout(2000);
        await page.waitForSelector('#btn_process_request');
        await page.click('#btn_process_request');
        
        //wait for loading to finish
        await page.waitForSelector('.container-fluid > div > #loader > .loader3 > .logoz', {hidden: true});
        
        //---------Expected Result---------
        await page.waitForSelector('#alert-supplier');
        const alert = await page.$eval('#alert-supplier', elem => elem.innerText);
        expect(alert).toMatch('Success');
        
        //Navigate to Process tab
        await page.waitForTimeout(2000);
        await page.waitForSelector('#supplier_processed___BV_tab_button__');
        await page.click('#supplier_processed___BV_tab_button__');
        
        //Search processed Supplier request
        await page.waitForTimeout(2000);
        await page.waitForSelector('#request_supplier_search');
        const searchBar = await page.$$('#request_supplier_search');
        await searchBar[2].type(approvedSupplier, {delay:50});

        //validate status
        await page.waitForTimeout(2000);
        await page.waitForSelector('tbody > tr > td > .badge-font-size > .badge-fourth-level');
        const status = await page.$eval('tbody > tr > td > .badge-font-size > .badge-fourth-level', elem => elem.innerText);
        expect(status).toMatch('Processed');
        await page.waitForTimeout(2000);
    }, 100000);//end of TC_SPLR_043

}, 500000)