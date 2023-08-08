const fs = require("fs");

const puppeteer = require("puppeteer");


const email = "naputtalt2@gmail.com";
const password = "6vU5eZT#edGL8X6";
const waitPeriod_page = 1000;
const waitPeriod_option = 1000;

const firstPage = "https://shopee.co.th/search?is_from_login=true&keyword=postit&page=16"


const products = [];
const brand = [];
const seller = [];

const shopeeHomeUrl = "https://shopee.co.th";

let linkList = [];


const main = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(
      firstPage,
      {
        waitUntil: "load",
      }
    );


    await login(page);
    await wait(waitPeriod_page);


    // //scrape product links
    // while (true){
    //   linkList = linkList.concat(await getAllLinksInRow(page));
    //   // let wi = checkForNextPage(page)
    //   // console.log(wi)

    //   if (await checkForNextPage(page)) {
    //     console.log("wait for navigation");
    //     await Promise.all([
    //       page.waitForNavigation(),
    //       page.click("button.shopee-icon-button--right"),
    //     ]);
    //     console.log("finished navigation");
    //     await wait(waitPeriod_page);
    //     continue;
    //   }
    //   break;
    // } 


    //scrape data
    const dataList = [];
    let seller = {};
    let brand = {};
    let count = 0;
    // linkedAddress
    let addresss = ['/%E0%B8%A1%E0%B8%B5%E0%B8%94%E0%B8%97%E0%B8%B3%E0%B8%84%E0%B8%A3%E0%B8%B1%E0%B8%A7-RHINO-BRAND-No.9101-MEAT-KNIFE-%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%AD%E0%B8%9A%E0%B8%AD%E0%B8%B2%E0%B8%AB%E0%B8%B2%E0%B8%A3-%E0%B8%84%E0%B8%A1%E0%B8%AA%E0%B8%B8%E0%B8%94%E0%B9%86-(%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B9%81%E0%B8%97%E0%B9%89)-i.3253694.14651006029?sp_atk=bb0edf48-b362-4289-a705-a719826f9aee&xptdk=bb0edf48-b362-4289-a705-a719826f9aee']
    for (address of addresss){
      count ++;
      console.log(count)
      await page.goto(shopeeHomeUrl + address,
      {
        waitUntil: "load",
      }
      );
      await wait(waitPeriod_page);
      let temp = await getProductInfo(page, seller, brand);
      while (!temp['data']){
        await page.goto(shopeeHomeUrl + address, {waitUntil: "load",});
        temp = await getProductInfo(page, {}, {});
        await wait(waitPeriod_page);
      }
      temp['data']['product_address'] = shopeeHomeUrl + address;
      dataList.push(temp['data']);

      seller = temp['shopList'];
      brand = temp['brandList'];
    }



    // const data = await getProductInfo(page);
    // await downloadCSV(page, linkList.join("\n"), "download.csv");
    saveAsJson(JSON.stringify(dataList, null, 2), 'product.json');
    saveAsJson(JSON.stringify(seller, null, 2), 'seller.json');
    saveAsJson(JSON.stringify(brand, null, 2), 'brand.json');

    // await browser.close();
    return;
    await browser.close();


    await page.screenshot({ path: "example.png" });

    await browser.close();
    console.log("Screenshot created successfully!");
  } catch (err) {
    console.error("Error occurred:", err);
  }
};

function wait(delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}

async function downloadCSV(file, filename) {
 const csvContent = file;

 fs.writeFile(filename, csvContent, "utf8", (err) => {
   if (err) {
     console.error("Error writing to CSV file:", err);
   } else {
     console.log("Data has been written to", filename);
   }
 });
}

async function saveAsJson(data, filename) {
  fs.writeFile(filename, data, 'utf8', (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
    } else {
      console.log('JSON data has been written to the file:', filename);
    }
  });
}

async function login(page) {
  //wait for page to redirect to login page for some reason?
  await page.waitForSelector('[name="loginKey"]');

  //remove the select lang some how interfere with typing?
  await page.waitForSelector(".shopee-button-outline--primary-reverse");
  await page.click(".shopee-button-outline--primary-reverse");
  await page.type('[name="loginKey"]', email);
  await page.type('[name="password"]', password);

  await page.waitForSelector("button._1EApiB");

  await page.evaluate(async () => {
    console.log("loaded");
    const intercalID = setInterval(() => {
      const btn = document.querySelector("button.wyhvVD");
      if (btn && !btn.disabled) {
        btn.click();
        clearInterval(intercalID);
      }
    }, 100);
  });
}

async function getAllLinksInRow(page) {
  await page.waitForSelector("div.shopee-search-item-result__items");
  await page.waitForSelector("div.col-xs-2-4");
  try {
    const pagePromise = await page.evaluate(async() => {
      const list = [];
      const rowWrapper = document.querySelector(
        "div.shopee-search-item-result__items"
      );
      if (!rowWrapper) {
        throw new Error("div.shopee-search-item-result__items don't exist");
      }

      const rows = rowWrapper.querySelectorAll("div.col-xs-2-4");
      console.log('row length', rows.length);
      let count = 0;
      for (const row of rows){
        count++;
        // console.log(count);
        let link = row.querySelector("a");
        if (link) {
          list.push(link.getAttribute("href"));
        } else {
          let scrollPromise = new Promise((resolve, reject) => {
            console.log("promise", count);
            let tempcount = count;
            const intervalID = setInterval(
              (row, tempcount) => {
                row.scrollIntoView();
                let link = row.querySelector("a");
                if (link) {
                  clearInterval(intervalID);
                  console.log("resolvec", tempcount);
                  resolve();
                }
              },
              200,
              row,
              tempcount
            );
          });

          await scrollPromise.then(() => {
            link = row.querySelector("a");
            list.push(link.getAttribute("href"));
          });
        }    
      }
      return list;
    });
    return pagePromise;
  } catch (err) {
    console.log("getAllLinksInRow: " + err);
  }
}

async function checkForNextPage(page){
  await page.waitForSelector("div.shopee-page-controller");
  return await page.evaluate(() => {
    const pagination = document.querySelector("div.shopee-page-controller");
    const curPageNum = parseInt(pagination.querySelector("button.shopee-button-solid").innerText);

    const pageList = pagination.querySelectorAll(
      "button.shopee-button-no-outline"
    );
    
    console.log(pageList)
    for (const page of pageList) {
      console.log(parseInt(page.innerText) + '>' +  curPageNum)
      if (page.innerText > curPageNum){
        console.log('true')
        return true;
      }
    }
    console.log('false')
    return false;
  });
}

/**
 * scrape product page
 * @param  {page} page 
 * @return [product, seller, brand]
 */
async function getProductInfo(page, shopList={}, brandList={}){
  try {
    await page.waitForSelector("div._44qnta");
  }catch (err){
    const bPageNotFound = await page.evaluate(() => {
      const PageNotFound = document.querySelector('div.product-not-exist__content');
      if (PageNotFound){
        return false;
      }
      return true;
    })
    if (!bPageNotFound){
      return false;
    }
    throw new Error('div._44qnta not found: ' +  err);
  }

  const data =  await page.evaluate(async() => {
    const curURL = window.location.href;
    const shopID = curURL.match(/i\.(\d+)\.\d+/)[1];
    const productID = curURL.match(/\.(\d+)\?sp_atk/)[1];
    console.log('ID', shopID, productID);

    const shopName = document.querySelector('div.VlDReK').innerText;
    const shopInfos = document.querySelector('div.Po6c6I').querySelectorAll('div.R7Q8ES');

    shopData = {'name':shopName};
    for (shopInfo of shopInfos){
      shopData[shopInfo.querySelector('label.siK1qW').innerText] = shopInfo.querySelector('span.Xkm22X').innerText;
    }
    const shopAddress = document.querySelector('a.W0LQye');
    shopData['address'] = "https://shopee.co.th" + shopAddress.getAttribute("href");

    console.log('seller', shopData);

    console.log('shop type')
    //check if shoppe affiliate or recomended
    const productNameWrapper = document.querySelector("div._44qnta");
    const shopType = productNameWrapper.querySelector("div.NOygQS");
    if (shopType){
      shopData["shop_type"] = shopType.innerText;
    }else{
      shopData["shop_type"] = '';
    }

    const productInfo = {'ID':productID};

    //shop arress
    productInfo['shop_id'] = shopID;

    console.log('productNameWrapper')
    productInfo['product_name'] = productNameWrapper.querySelector('span').innerText;

    console.log('score')
    const scoreWrapper = document.querySelector("div.X5u-5c");
    const scoreList = scoreWrapper.querySelectorAll('div.flex');
    if (scoreList){
      for (const score of scoreList){
        const star = score.querySelector('div._046PXf');
        if (star){
          console.log('star')
          productInfo['productScore'] = star.innerText;
          continue;
        }

        console.log('rating')
        const rating = score.querySelector('div._1k47d8');
        if (rating){
          productInfo['rating'] = rating.innerText;
        }

        console.log('sold num')
        const soldNum = scoreWrapper.querySelector('div.eaFIAE').querySelector('div.e9sAa2');
        productInfo['sold'] = soldNum.innerText;
      }
    }else{
      productInfo['productScore'] = -1;
    }

    //price 
    console.log('full price')
    const fullPrice = document.querySelector('div.Y3DvsN');
    if (fullPrice){
      productInfo['full_price'] = fullPrice.innerText;
    }
    console.log('price')
    productInfo['price'] = document.querySelector('div.pqTWkA').innerText;

    console.log('stock')
    productInfo['stock'] = document.querySelector('div._6lioXX').querySelector('div.items-center').querySelectorAll('div:not([style])')[1].innerText.split(' ')[1];


    console.log('desc')
    //description
    const desc = document.querySelector('p.irIKAp');
    if (desc){
      productInfo['desc'] = desc.innerText;
    }

    //favorite error
    const favoriteWapper = document.querySelector('button.IYjGwk').querySelector('div.Ne7dEf');
    productInfo['favorite'] = favoriteWapper.innerText.split(' ')[1].slice(1, -1);


    console.log('options')
    // product opetion
    const opetionWapper = document.querySelector('div.j9be9C');
    const opetionCol = opetionWapper.querySelector('div.flex-column');
    const opetionList = opetionCol.querySelectorAll("div.items-center");

    productInfo['product_options'] = {};

    const productVariations = [];

    for (const opetion of opetionList){
          console.log('label')

      const opetionNameElement = opetion.querySelector('label.oN9nMU');
      if (opetionNameElement){
        productInfo['product_options'][opetionNameElement.innerText] = [];

        const opetionoptions = opetion.querySelector('div.bR6mEk').querySelectorAll('button.product-variation');
        productVariations.push(opetionoptions)
        for (const opetionoption of opetionoptions){
          console.log('opetionoption')
          productInfo['product_options'][opetionNameElement.innerText].push(opetionoption.innerText);
        }
      }
    }

    const variations = async(variationList, optionIndex, prevDisabled=false) => {
      const data = [];
      for (let i = 0; i < variationList[optionIndex].length; i++){
        console.log(optionIndex, i, variationList[optionIndex].length)
        bDisabled = false;
        console.log('disable', variationList[optionIndex][i].getAttribute("aria-disabled"), prevDisabled)
        if (variationList[optionIndex][i].getAttribute("aria-disabled") === 'true' || prevDisabled){
          console.log('btn disabled');
          bDisabled = true;
        }

        if (optionIndex < variationList.length - 1){
          if (!bDisabled){
            await variationList[optionIndex][i].click();
          }
          data.push(await variations(variationList, optionIndex + 1, bDisabled));
          continue;
        }


        if (prevDisabled || bDisabled){
          data.push({
            'stock':-1,
            'price':-1,
            'fullprice':-1
          })
          continue;
        }

        await new Promise(async(resolve, reject) => {


        console.log('promise');
        const observer = new MutationObserver(async(mutationsList, observer) => {

          console.log('mutationsList', mutationsList.length);
          for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.target.innerText !== '') {
              console.log('changed', mutation.target.innerText);
              resolve();
            }
          }
        });

        observer.observe(document.querySelector('div.pqTWkA'), {childList: true});

        await variationList[optionIndex][i].click();

        setTimeout(() => {
          resolve();
        }, 5000);

        }); 

        const stock = document.querySelector('div._6lioXX').querySelector('div.items-center').querySelectorAll('div:not([style])')[1].innerText.split(' ')[1];
        const price = document.querySelector('div.pqTWkA').innerText;
        const fullpriceElement = document.querySelector('div.Y3DvsN');
        const fullprice = fullpriceElement ? fullpriceElement.innerText : -1;

        data.push({
          'stock':stock,
          'price':price,
          'fullprice':fullprice
        })

        if (variationList[optionIndex].length === 1){
          await variationList[optionIndex][i].click();
        }

      }
      console.log(data);
      return data;
    };
    

    //price by option
    console.log('price by option');
    let tempdata = [];
    if (productVariations.length > 0){
      console.log('data', productInfo);
      console.log('length', productVariations.length);
      console.log(productVariations);
      tempdata = await variations(productVariations, 0);
    }
    productInfo['product_info_by_option'] = tempdata;

    let brandID = undefined;
    let brandName = undefined;
    //product info
    console.log('info')
    const infoCol = document.querySelectorAll('div.dR8kXc');

    productInfo['product_info'] = {};

    for (const info of infoCol){
      console.log('label')
      const label = info.querySelector('label').innerText;

      if (label === 'ยี่ห้อ'){
        const brand = info.querySelector('a');
        brandID = brand.getAttribute('href').split('=')[1];
        brandName = brand.innerText;
        productInfo['product_info'][label] = brandID;
        continue;
      }
      
      const data = info.querySelector('div');
      if (!data){
        let scrollPromise = new Promise((resolve, reject) => {
        console.log("promise", label);
        const intervalID = setInterval(
          (info, label) => {
            info.scrollIntoView();
            let div = info.querySelector('div');
            if (div) {
              clearInterval(intervalID);
              console.log("resolvec", label);
              resolve();
            }
          },200,info,label);});

        await scrollPromise;
      }
      if (label === 'หมวดหมู่'){
        const categoryList = data.querySelectorAll('a');
        const categoryStr = [];
        for (category of categoryList){
          console.log('category')
          categoryStr.push(category.innerText)
        }
        productInfo['product_info'][label] = categoryStr.join('>');
        continue;
      }


      console.log('data ' + label);
      productInfo['product_info'][label] = data.innerText;

    
    }

    console.log("return data", productInfo);
    return {'data':productInfo, 'brandName':brandName, 'brandID':brandID, 'shopData':shopData, 'shopID':shopID};
    // [productInfo, {}, 
    //   shopName, shopeData, brandList];
  });
  if (data['brandID']){
    brandList[data['brandID']] = data['brandName'];
  }

  if (data['shopID']){
    shopList[data['shopID']] = data['shopData'];
    console.log(data['shopData']);
  }

  return {'data':data['data'], 'shopList':shopList, 'brandList':brandList};
  
}


main();
