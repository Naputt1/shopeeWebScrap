const fs = require("fs");

const puppeteer = require("puppeteer");
const email = "naputtalt2@gmail.com";
const password = "6vU5eZT#edGL8X6";

let linkList = [];

function wait(delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}

async function downloadCSV(page, file, filename) {
 const csvContent = file;

 fs.writeFile(filename, csvContent, "utf8", (err) => {
   if (err) {
     console.error("Error writing to CSV file:", err);
   } else {
     console.log("Data has been written to", filename);
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
    const curPageNum = pagination.querySelector("button.shopee-button-solid").innerHTML;

    const pageList = pagination.querySelectorAll(
      "button.shopee-button-no-outline"
    );

    for (const page of pageList) {
      if (page.innerHTML > curPageNum){
        return true;
      }
    }
    return false;
  });
}

<<<<<<< Updated upstream
const k = async () => {
=======
/**
 * scrape product page
 * @param  {Number} page 
 * @return [product, seller, brand]
 */
async function getProductInfo(page){
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


  return await page.evaluate(async() => {
    const productInfo = {};

  // const bshopLogged = shopInfoList.hasOwnProperty(
  //   document.querySelector("div.VlDReK")
  // );


    console.log('productNameWrapper')
    const productNameWrapper = document.querySelector("div._44qnta");

    console.log('shop type')
    //check if shoppe affiliate or recomended
    const shopType = productNameWrapper.querySelector("div.NOygQS");
    if (shopType){
      productInfo["shop_type"] = shopType.innerHTML;
    }else{
      productInfo["shop_type"] = '';
    }
    productInfo['product_name'] = productNameWrapper.querySelector('span').innerHTML;


    console.log('score')
    const scoreWrapper = document.querySelector("div.X5u-5c");
    const scoreList = scoreWrapper.querySelectorAll('div.flex');
    if (scoreList){
      for (const score of scoreList){
        const star = score.querySelector('div._046PXf');
        if (star){
          console.log('star')
          productInfo['productScore'] = star.innerHTML;
          continue;
        }

        console.log('rating')
        const rating = score.querySelector('div._1k47d8');
        if (rating){
          productInfo['rating'] = rating.innerHTML;
        }

        console.log('sold num')
        const soldNum = scoreWrapper.querySelector('div.eaFIAE').querySelector('div.e9sAa2');
        productInfo['sold'] = soldNum.innerHTML;
      }
    }else{
      productInfo['productScore'] = -1;
    }


    //price 
    console.log('full price')
    const fullPrice = document.querySelector('div.Y3DvsN');
    if (fullPrice){
      productInfo['full_price'] = fullPrice.innerHTML;
    }

    console.log('price')
    productInfo['price'] = document.querySelector('div.pqTWkA').innerHTML;


    //description
    console.log('desc')
    const desc = document.querySelector('p.irIKAp');
    if (desc){
      productInfo['desc'] = desc.innerHTML;
    }


    // product opetion
    console.log('options')
    const opetionWapper = document.querySelector('div.j9be9C');
    const opetionCol = opetionWapper.querySelector('div.flex-column');
    const opetionList = opetionCol.querySelectorAll("div.items-center");

    productInfo['product_options'] = {};

    const productVariations = [];

    for (const opetion of opetionList){
          console.log('label')

      const opetionNameElement = opetion.querySelector('label.oN9nMU');
      if (opetionNameElement){
        productInfo['product_options'][opetionNameElement.innerHTML] = [];

        const opetionoptions = opetion.querySelector('div.bR6mEk').querySelectorAll('button.product-variation');
        productVariations.push(opetionoptions)
        for (const opetionoption of opetionoptions){
          console.log('opetionoption')
          productInfo['product_options'][opetionNameElement.innerHTML].push(opetionoption.innerHTML);
        }
      }else{
        const stockWrapper = opetion.querySelectorAll('div')[2];
        if (stockWrapper){
          productInfo['stock'] = stockWrapper.innerHTML.split(' ')[1]
        }else{
          productInfo['stock'] = -1;
        }
      }
    }

    const variations = async(variationList, optionIndex, prevDisabled) => {
      const data = [];
      for (let i = 0; i < variationList[optionIndex].length; i++){
        bDisabled = false;

        console.log(variationList[optionIndex][i]);
        console.log('disabled: ', variationList[optionIndex][i].ariaDisabled, prevDisabled);
        if (variationList[optionIndex][i].ariaDisabled === 'true' || prevDisabled){
          console.log('btn disabled');
          bDisabled = true;
        }
        console.log(optionIndex, i, variationList[optionIndex].length, variationList[optionIndex][i])

        if (optionIndex < variationList.length - 1){
          await variationList[optionIndex][i].click();
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

            function wait(delay) {
              return new Promise(function (resolve) {
                setTimeout(resolve, delay);
              });
            }

            console.log('mutationsList', mutationsList.length);
            for (const mutation of mutationsList) {
              if (mutation.type === 'childList' && mutation.target.innerHTML !== '') {
                console.log('changed', mutation.target.innerHTML);
                resolve();
              }
            }
          });

          observer.observe(document.querySelector('div.pqTWkA'), {childList: true});
          console.log('clikc')
          await variationList[optionIndex][i].click();
          setTimeout(() => {resolve();}, 5000)
        });

        const stock = document.querySelector('div._6lioXX').querySelector('div.items-center').querySelectorAll('div')[2].innerHTML.split(' ')[1];
        const price = document.querySelector('div.pqTWkA').innerHTML;
        const fullpriceElement = document.querySelector('div.Y3DvsN');
        const fullprice = fullpriceElement ? fullpriceElement.innerHTML : -1;

        data.push({
          'stock':stock,
          'price':price,
          'fullprice':fullprice
        })
      }

      if (variationList[optionIndex].length == 1){
        console.log('variation length = 1')
        await variationList[optionIndex][0].click();
      }

      return data;
    };
    

    //price by option
    console.log('price by option');


    let tempdata = [];
    if (productVariations.length > 0){
      console.log('data', productInfo);
      console.log('length', productVariations.length);
      console.log(productVariations);
      tempdata = await variations(productVariations, 0, false);
    }
    productInfo['product_info_by_option'] = tempdata;

    
    //product info
    console.log('info')
    const infoCol = document.querySelectorAll('div.dR8kXc');

    productInfo['product_info'] = {};

    for (const info of infoCol){
      console.log('label')
      const label = info.querySelector('label').innerHTML;

      if (label === 'ยี่ห้อ'){
        const brand = info.querySelector('a');
        productInfo['product_info'][label] = brand.innerHTML;
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
          categoryStr.push(category.innerHTML)
        }
        productInfo['product_info'][label] = categoryStr.join('>');
        continue;
      }


      console.log('data ' + label);
      productInfo['product_info'][label] = data.innerHTML;

    
    }

    //shop arress
    const temp = document.querySelector('a.W0LQye');

    if (temp){
      productInfo['shop_address'] = temp.getAttribute("href");
    }else{
      throw new Error('a.W0LQye is null')
    }

console.log("return data", productInfo);
    return productInfo;
  });
}

const main = async () => {
>>>>>>> Stashed changes
  try {
    const browser = await puppeteer.launch({ 
      headless: false,
      // slowMo: 50 
    });
    const page = await browser.newPage();

    // Wait for the 'domcontentloaded' event before proceeding
    await page.goto(
      "https://shopee.co.th/buyer/login?next=https%3A%2F%2Fshopee.co.th%2Fsearch%3Fkeyword%3D%25E0%25B8%25A1%25E0%25B8%25B5%25E0%25B8%2594%26page%3D0%26sortBy%3Dsales",
      {
        waitUntil: "load",
      }
    );
<<<<<<< Updated upstream

    //wait for page to redirect to login page for some reason?
    await login(page);
    
    // await page.waitForNavigation();
=======
    // https://shopee.co.th/🌈ส่งฟรี🌈-มีดหั่นขนมปังสแตนเลส-มีให้เลือก-3รูปแบบ-4ขนาด-มีดตัดเค้ก-มีดตัดขนม-มีดตัดขนมปัง-มีดหั่นขนมปัง-มีดตัดเค้กสแตนเลส-i.380919622.8829555113?sp_atk=2d8bd65c-d348-4f35-8d2a-4f7c9965ebce&xptdk=2d8bd65c-d348-4f35-8d2a-4f7c9965ebce
    //https://shopee.co.th/%E0%B8%A1%E0%B8%B5%E0%B8%94%E0%B8%94%E0%B8%B2%E0%B8%9A%E0%B8%8B%E0%B8%B2%E0%B8%A1%E0%B8%B9%E0%B9%84%E0%B8%A3-%E0%B8%A2%E0%B8%B2%E0%B8%A7-55-%E0%B9%80%E0%B8%8B%E0%B8%99%E0%B8%95%E0%B8%B4%E0%B9%80%E0%B8%A1%E0%B8%95%E0%B8%A3%E0%B9%81%E0%B8%A5%E0%B8%B0-72%E0%B9%80%E0%B8%8B%E0%B8%99%E0%B8%95%E0%B8%B4%E0%B9%80%E0%B8%A1%E0%B8%95%E0%B8%A3-%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%8B%E0%B8%AD%E0%B8%87-%E0%B8%A1%E0%B8%B5%E0%B8%94%E0%B8%9C%E0%B9%89%E0%B8%B2%E0%B9%81%E0%B8%94%E0%B8%87-%E0%B8%A1%E0%B8%B5%E0%B8%94%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B9%80%E0%B8%94%E0%B8%B4%E0%B8%99%E0%B8%9B%E0%B9%88%E0%B8%B2-i.72729676.8350342512?sp_atk=10497686-6f5a-42b3-a203-35ef9fdea097&xptdk=10497686-6f5a-42b3-a203-35ef9fdea097
// await login(page);
// const dataList = [];
//           const temp = await getProductInfo(page);
//       temp['product_address'] = 'https://shopee.co.th/%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%AA%E0%B9%88%E0%B8%87homeproth-%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A5%E0%B8%B1%E0%B8%9A%E0%B8%A1%E0%B8%B5%E0%B8%94-%E0%B8%AB%E0%B8%B4%E0%B8%99%E0%B8%A5%E0%B8%B1%E0%B8%9A%E0%B8%A1%E0%B8%B5%E0%B8%94%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B9%8C%E0%B8%99%E0%B9%88%E0%B8%B2%E0%B8%A3%E0%B8%B1%E0%B8%81-%E0%B9%81%E0%B8%97%E0%B9%88%E0%B8%99%E0%B8%A5%E0%B8%B1%E0%B8%9A%E0%B8%A1%E0%B8%B5%E0%B8%94-%E0%B8%AD%E0%B8%B8%E0%B8%9B%E0%B8%81%E0%B8%A3%E0%B8%93%E0%B9%8C%E0%B8%A5%E0%B8%B1%E0%B8%9A%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%A1%E0%B8%B5%E0%B8%84%E0%B8%A1-%E0%B8%A5%E0%B8%B1%E0%B8%9A%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%84%E0%B8%A1%E0%B8%A1%E0%B8%B2%E0%B8%81-Knife-Sharpener-i.320775209.5690642775?sp_atk=10e94fa3-bb6e-4639-9609-167bad4b1fe8&xptdk=10e94fa3-bb6e-4639-9609-167bad4b1fe8&is_from_login=true';
//       temp['shop_address'] = shopeeHomeUrl + temp['shop_address'];
//   dataList.push(temp);

    //wait for page to redirect to login page for some reason?
    await login(page);
    await wait(5000);

    // await page.evaluate(async() =>{
    // const targetElement = document.querySelector('div.pqTWkA');

    // const observeChanges = () => {
    //     return new Promise((resolve) => {
    //         const observer = new MutationObserver((mutationsList, observer) => {
    //             for (const mutation of mutationsList) {
    //               console.log('changed', mutation.target.textContent);
    //                 if (mutation.type === 'childList') {
    //                     console.log('changed', mutation.target.textContent);
    //                     mutation.target.textContent = 'test';
    //                     // observer.disconnect(); // Disconnect the observer
    //                     // resolve();
    //                 }
    //             }
    //         });

    //         observer.observe(targetElement, { childList: true });
    //     });
    // };

    // while (true) {
    //     await observeChanges();
    // }
    // });


    // __reactFiber$pkrwfd1bbf
    // document.querySelector('div.pqTWkA').__reactFiber$pkrwfd1bbf['memoizedProps']['children']


    //   const temp = await getProductInfo(page);
    //   console.log(temp);
    //   while (!temp){
    //     console.log('temp not valid')
    //     // await page.goto(shopeeHomeUrl + address, {waitUntil: "load",});
    //     await wait(5000);
    //     const temp = await getProductInfo(page);
    //   }
    // // await data
    //   //     temp['product_address'] = shopeeHomeUrl + address;
    //   // temp['shop_address'] = shopeeHomeUrl + temp['shop_address'];
    //   console.log(data);
      // return;
    //       saveAsJson(JSON.stringify(temp, null, 2), 'product.json');
    //   return;
    const dataList = [];
    const seller = [];
    const brand = [];
    let count = 0;
    // linkedAddress 
    let address = ['/มีดดาบซามูไร-ยาว-55-เซนติเมตรและ-72เซนติเมตร-พร้อมซอง-มีดผ้าแดง-มีดสำหรับนักเดินป่า-i.72729676.8350342512?sp_atk=10497686-6f5a-42b3-a203-35ef9fdea097&xptdk=10497686-6f5a-42b3-a203-35ef9fdea097']
    for (address of linkedAddress){
      count ++;
      console.log(count)
      await page.goto(shopeeHomeUrl + address,
      {
        waitUntil: "load",
      }
      );
      await wait(5000);
      const temp = await getProductInfo(page);
      console.log(temp);
      while (!temp){
        console.log('temp invalid')
        // await page.goto(shopeeHomeUrl + address, {waitUntil: "load",});
        await wait(5000000);
        const temp = await getProductInfo(page);
      }
      temp['product_address'] = shopeeHomeUrl + address;
      temp['shop_address'] = shopeeHomeUrl + temp['shop_address'];
      dataList.push(temp);
    }



    // const data = await getProductInfo(page);
    // await downloadCSV(page, linkList.join("\n"), "download.csv");
    saveAsJson(JSON.stringify(dataList, null, 2), 'product.json');


    return;
    await browser.close();

>>>>>>> Stashed changes

//       interval = setInterval(async(page) => {
//         console.log(await checkForNextPage(page));
//       }, 5000, page);
// return;
    while (true){
      linkList = linkList.concat(await getAllLinksInRow(page));

      if (checkForNextPage(page)) {
        console.log("wait for navigation");
        await Promise.all([
          page.waitForNavigation(), // The promise resolves after navigation has finished
          page.click("button.shopee-icon-button--right"), // Clicking the link will indirectly cause a navigation
        ]);
        console.log("finished navigation");
        await wait(5000);
        continue;
      }
      break;
    } 
    console.log(linkList.length);
    await downloadCSV(page, linkList.join("\n"), "download.csv");
    // downloadCSV2;

    // await downloadCSV(page, list.join('\n'), 'download.csv')

    return;
    const result = await page.evaluate(() => {
      return 8 * 7;
    });
    console.log(result); // prints "56"
    try {
      await page.evaluate(() => {
        console.log("bbtn");
        const btn = document.querySelector("button.wyhvVD");
        if (!btn) {
          console.log("btn");
          btn.click();
        }
      });
    } catch (error) {
      console.error("Error in page.evaluate:", error);
    }

    // await page.click("button.wyhvVD", {delay:100});

    return;

    // const bLogin = await page.evaluate(async() => {
    //     console.log('input');
    //     const emailInput = document.querySelector('[name="loginKey"]');
    //     if (emailInput){
    //         console.log('login')
    //         return true;
    //     }
    //     return false;
    // })
    // if (bLogin){
    //     console.log('blogin')
    // }else{console.log("not login")}

    // Now, it is safe to interact with the DOM
    console.log("wait for col wrap");
    await page.waitForSelector("div.shopee-search-item-result__items");
    console.log("wait for col");
    await page.waitForSelector("div.col-xs-2-4");

    try {
      const data = await page.evaluate(async () => {
        const btns = document.getElementsByClassName(
          "shopee-button-outline--primary-reverse"
        );

        const rowElementsWrapper = document.getElementsByClassName(
          "shopee-search-item-result__items"
        );
        // for (const row of rowElementsWrapper.children){
        //     con
        // }
        if (rowElementsWrapper.length > 0) {
          const row = rowElementsWrapper[0].querySelectorAll("div.col-xs-2-4");
          return row.length;
        }
        return "error";
      });

      console.log(data);
    } catch (evaluationError) {
      console.error("Error during evaluation:", evaluationError.message);
    }

    await page.screenshot({ path: "example.png" });

    await browser.close();
    console.log("Screenshot created successfully!");
  } catch (err) {
    console.error("Error occurred:", err);
  }
};

k();
