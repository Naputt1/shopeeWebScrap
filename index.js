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

const k = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Wait for the 'domcontentloaded' event before proceeding
    await page.goto(
      "https://shopee.co.th/buyer/login?next=https%3A%2F%2Fshopee.co.th%2Fsearch%3Fkeyword%3D%25E0%25B8%25A1%25E0%25B8%25B5%25E0%25B8%2594%26page%3D0%26sortBy%3Dsales",
      {
        waitUntil: "load",
      }
    );

    //wait for page to redirect to login page for some reason?
    await login(page);
    
    // await page.waitForNavigation();

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
