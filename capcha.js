
const puppeteer = require("puppeteer");


const main = async() => {
  const browser = await puppeteer.launch({ 
    headless: false ,
    defaultViewport: { width: 1366, height: 768 }
  });
  const page = await browser.newPage();

  await page.goto(
    "https://shopee.co.th/verify/captcha?anti_bot_tracking_id=91ad008a-de84-4973-a43e-bbc68d1ebfb0&app_key=Search.PC&client_id=1&next=https%3A%2F%2Fshopee.co.th%2Fverify%2Ftraffic&redirect_type=2&scene=crawler_item&should_replace_history=true",
    {
    waitUntil: "load",
    }
    );
  await page.waitForSelector(".shopee-button-outline--primary-reverse");
  await page.click(".shopee-button-outline--primary-reverse");
};



main();
