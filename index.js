const fs = require("fs");

const puppeteer = require("puppeteer");
const email = "naputtalt2@gmail.com";
const password = "6vU5eZT#edGL8X6";


const products = [];
const brand = [];
const seller = [];

const shopeeHomeUrl = "https://shopee.co.th";

const linkedAddress = [
  "/ที่สไลด์ผลไม้-เครื่องตัดผักผลไม้-เครื่องสไลด์มันฝรั่ง-ปรับควา2-12มม-304-เครื่องตัดมัลติฟังก์ชั่นในครัวเรือ-fruit-slicer-i.1036329446.23848785652?sp_atk=5b734bad-c97b-4418-ad1c-0bc55443be35&xptdk=5b734bad-c97b-4418-ad1c-0bc55443be35",
  "/Thaya-1-1คอสเพลย์-God-Of-War-อาวุธ-Thor-Hammer-Chaos-ใบมีด-Flame-Tomahawk-Thunder-Hammer-Prop-บทบาทเล่น-Ghost-Beast-ค้อน-i.917036622.18691505217?sp_atk=73cb98c7-c3c5-477c-960c-374a7868999a&xptdk=73cb98c7-c3c5-477c-960c-374a7868999a",
  "/ของขวัญพิธีชงชาหกชุดสุภาพบุรุษมีดชาเข็มชา-Chaze-Kung-Fu-ชุดน้ำชาเซรามิคอุปกรณ์เสริมชาไม้เครื่องมือ-6QIC-i.917036734.22475689758?sp_atk=16dcccc5-6769-43e9-88a3-f8a7271f749a&xptdk=16dcccc5-6769-43e9-88a3-f8a7271f749a",
  "/ใบมีดผ่าตัด-สแตนเลส-เบอร์-23-(100ชิ้น-กล่อง)-i.726250.22707887562?sp_atk=a054994c-be26-4a35-a85e-6e16ae923dc5&xptdk=a054994c-be26-4a35-a85e-6e16ae923dc5",
  "/มีดแล่เนื้อ-เลาะกระดูกลายค้อน-i.1012374281.11399529269?sp_atk=f13b1c21-1ade-48ae-a40d-155c430e0676&xptdk=f13b1c21-1ade-48ae-a40d-155c430e0676",
  "/พร้อมส่งhomeproth-ที่ลับมีด-หินลับมีดสัตว์น่ารัก-แท่นลับมีด-อุปกรณ์ลับของมีคม-ลับได้คมมาก-Knife-Sharpener-i.320775209.5690642775?sp_atk=10e94fa3-bb6e-4639-9609-167bad4b1fe8&xptdk=10e94fa3-bb6e-4639-9609-167bad4b1fe8",
  "/มีดปลอกผลไม้-🔪มีดสแตนเลส-สำหรับในครัวและแบบพกพา-พร้อมปลอกใส่--i.7801439.3923957774?sp_atk=015633ce-c9ce-4c58-80ef-f59a3224957d&xptdk=015633ce-c9ce-4c58-80ef-f59a3224957d",
  "/Systano-มีดสองคม-มีดปอกเปลือก-พร้อมที่ขูดเกล็ดปลาและที่เปิดขวด-No.Y875-i.10933937.13530681088?sp_atk=4d4df1db-a6e9-43af-acd1-fcdb79e27a20&xptdk=4d4df1db-a6e9-43af-acd1-fcdb79e27a20",
  "/🔥ส่งฟรี🔥-มีดตัดเค้ก-สแตนเลสแท้-MAXIE-มีให้เลือก-3-รูปแบบ-3-ขนาด-มีดหั่นเค้ก-มีดหั่นขนมปัง-มีดตัดเค้ก-มีดตัดขนมเค้ก-i.167629790.5360485814?sp_atk=0ffd5327-6849-4a1c-847f-142d9360187b&xptdk=0ffd5327-6849-4a1c-847f-142d9360187b",
  "/🌟พร้อมส่งจากไทย🌟-9-สี-เลือกได้‼️-มีดปอกผลไม้-มีด-มีดปลอกผลไม้-มีดมีปลอก-มีดเล็ก-มีดพกพา-มีดผลไม้-มีดในครัว-มีดคมๆ-i.141308137.4723963464?sp_atk=17de353d-001a-4b24-b460-acf94e4c0477&xptdk=17de353d-001a-4b24-b460-acf94e4c0477",
  "/มีดอีโต้เล็ก-mini-ด้ามไม้-มีดบังตอจิ๋ว-mini-kitchen-knife-i.227606971.14380197590?sp_atk=16f9bb91-8706-484b-819f-4b75de058ff2&xptdk=16f9bb91-8706-484b-819f-4b75de058ff2",
  "/KIWI-มีด-มีดทำอาหาร-มีดหั่น-มีดสับ-มีดทำครัว-(No.474-479-ด้ามดำ)-i.267255343.9637636187?sp_atk=1dc1a9c0-0d14-4a58-ae86-f642fdb0760e&xptdk=1dc1a9c0-0d14-4a58-ae86-f642fdb0760e",
  "/มีดตัดเนย-ส้อมผลไม้-มีดสเต็กสแตนเลส-A054-ที่ทาขนมปัง-มีดโต๊ะอาหาร-มีดทาเนยและเเยม-มีดทาแยม-มีดหั่นสเต็ก-มีดสเต็ก-i.170372375.20170438811?sp_atk=9b34eb58-309e-49a8-9ad6-627d4b388a38&xptdk=9b34eb58-309e-49a8-9ad6-627d4b388a38",
  "/มีด-มีดปอกอเนกประสงค์-5in1-(คละสี)-มีดปอกมะละกอ-มีดปอกผัก-ผลไม้-มีดปอก-มีดสไลด์-ตัด-ซอย-หั่น-ปอก-5in1-i.131897.7457924295?sp_atk=7fa0ecb0-2812-4d23-95dc-7739757e8ede&xptdk=7fa0ecb0-2812-4d23-95dc-7739757e8ede",
  "/มีดนามบัตร-มีดบัตรเครดิต-มีดATM-i.15931107.1446987892?sp_atk=8251497f-95c8-426a-b05c-3b5dec854eb2&xptdk=8251497f-95c8-426a-b05c-3b5dec854eb2",
  "/KIWI-มีด-มีดปอก-มีดปอกทุเรียน-มีดหั่น-มีดแล่เนื้อ-มีดปลายแหลม-(No.193-199-ด้ามดำ)-มีดทำครัว-i.267255343.3019500050?sp_atk=fa5303e4-12fc-42eb-80a0-74a86518bfd3&xptdk=fa5303e4-12fc-42eb-80a0-74a86518bfd3",
  "/มีดพับกลางแจ้ง-มีดผลไม้สแตนเลส-มีดพับพวงกุญแจ-มีดเอนกประสงค์-ขนาดเล็ก-พกพาสะดาก-i.438227518.19367752100?sp_atk=d1554132-6fd6-4af0-a291-cfc5fc022ab8&xptdk=d1554132-6fd6-4af0-a291-cfc5fc022ab8",
  "/🌈ส่งฟรี🌈-มีดหั่นขนมปังสแตนเลส-มีให้เลือก-3รูปแบบ-4ขนาด-มีดตัดเค้ก-มีดตัดขนม-มีดตัดขนมปัง-มีดหั่นขนมปัง-มีดตัดเค้กสแตนเลส-i.380919622.8829555113?sp_atk=2d8bd65c-d348-4f35-8d2a-4f7c9965ebce&xptdk=2d8bd65c-d348-4f35-8d2a-4f7c9965ebce",
  "/Furg-0030301152-มีดพับ-มีดพก-มีดอเนกประสงค์-stainless-steel-ใบมีดคมกรีบ-พกพาสะดวก-มีดสำหรับงานครอบครัว-สาระพัดประโยชน์-i.50841200.1508040232?sp_atk=8a70fd9a-59c2-456c-9af7-ad8661edb0e0&xptdk=8a70fd9a-59c2-456c-9af7-ad8661edb0e0",
  "/สินค้าขายดี!！ถูกที่สุด-ดีที่สุด-ที่ลับมีด-อุปกรณ์ลับมีด-หินลับมีด-คุณภาพดีเยี่ยม-ถอนได้-ลับได้-3-ระดับ-Health-Live-.SHOP-i.292228667.7771703165?sp_atk=0640b797-70f6-460c-b026-6e54906fdc5e&xptdk=0640b797-70f6-460c-b026-6e54906fdc5e",
  "/มีดคว้าน-มีดแกะสลัก-ตราสแตนดาร์ด-(จำนวน-1-อัน)-i.156658500.7336330510?sp_atk=ac490300-0d0a-4610-a3d6-0013e1c77c62&xptdk=ac490300-0d0a-4610-a3d6-0013e1c77c62",
  "/มีดเดินป่า-KNIFE-X-301-มีดเดินป่าด้ามตรง-มีดพกพา-(11.5-นิ้ว)-มีดแคมป์ปิ้ง-ฟรีซองเก็บมีดอย่างดี-พร้อมส่ง-i.172672372.19649979234?sp_atk=08266515-3b65-4d8e-ac50-0a18ffed004f&xptdk=08266515-3b65-4d8e-ac50-0a18ffed004f",
  "/ถูกที่สุด✅ชุดมีด5ชิ้น-ฟางข้าวสาลี-ชุดมีดทำครัว-ชุดมีดครัว-คมสุดๆ-มีดสับกระดูก-มีดแล่เนื้อ-มีดปลอกผลไม้（ไม่มีเขียง）-i.81245665.14915904630?sp_atk=39398330-5c08-4561-893c-4302acd3d122&xptdk=39398330-5c08-4561-893c-4302acd3d122",
  "/มีดตัดเค้ก-💕-‼️มีดพลาสติก-มีดตักเค้ก-🎂คุ้ม-แบบสีใส-สีครีมค่ะยาว23cm.-i.39092712.6155138484?sp_atk=d40334f6-c478-4d38-890d-cf68241ada37&xptdk=d40334f6-c478-4d38-890d-cf68241ada37",
  "/Systano-มีดหยิบผัก-มีดเด็ดผัก-ปลอกนิ้วเด็ดผัก-มีดสวมนิ้ว-No.KS153-i.10933937.17458730967?sp_atk=a834a70e-a34d-4878-80b6-ac412b0e7a3d&xptdk=a834a70e-a34d-4878-80b6-ac412b0e7a3d",
  "/-ลูกค้าใหม่-1.-มีดกีวี-KIWI-No.504-มีดสับจิ๋ว-มีดทรงอีโต้จิ๋ว-i.3253694.12429839693?sp_atk=49e3ccae-985d-4412-bbf5-004be6092d97&xptdk=49e3ccae-985d-4412-bbf5-004be6092d97",
  "/🔥ส่งฟรี🔥-มีดตัดเค้ก-สแตนเลสแท้-WANNA-มีให้เลือก-3-รูปแบบ-3-ขนาด-มีดหั่นเค้ก-มีดหั่นขนมปัง-มีดตัดเค้ก-มีดตัดขนมเค้ก-i.283431996.4960495896?sp_atk=7b77e0d0-6027-4c51-878b-f20abf691f4f&xptdk=7b77e0d0-6027-4c51-878b-f20abf691f4f",
  "/มีด-มีดปลอกผลไม้-สแตนเลส-ด้ามพลาสติก-พกพาง่าย-คมมากๆ-มีดอเนกประสงค์-i.71617213.8125737246?sp_atk=1422dfb2-cb4f-4eee-ab2d-84271b1f006f&xptdk=1422dfb2-cb4f-4eee-ab2d-84271b1f006f",
  "/KIWI-มีด-มีดทำอาหาร-มีดหั่น-มีดทำครัว-(No.171-P-172-P-173-P-211-P-ด้ามดำ)-i.267255343.9352192943?sp_atk=25942529-e490-4b08-8481-810a17b5fa29&xptdk=25942529-e490-4b08-8481-810a17b5fa29",
  "/🛫ส่งจากกรุงเทพ🛬-บัตรมีด-มีดพกนามบัตร-มีดบัตร-พกพาสะดวก-มีดนามบัตร-มีดบัตรเครดิต-มีดATM-i.559602371.23530536168?sp_atk=af995a05-9175-4415-ac0a-65fdff2d8b72&xptdk=af995a05-9175-4415-ac0a-65fdff2d8b72",
  "/🔥ส่งฟรี🔥-เครื่องลับมีดเอนกประสงค์-รุ่นใหม่-ลับคมได้3ระดับ-พร้อมที่ลับคมกรรไกร-ที่ลับมีด-เครื่องลับมีด-หินลับมีด-1--i.167629790.6210154103?sp_atk=54d9edde-f52d-4d68-b516-aae34800e353&xptdk=54d9edde-f52d-4d68-b516-aae34800e353",
  "/✨ลูกค้าใหม่-1-฿✨-ZC-มีดพับพกพา-มีดเดินป่าสแตนเลสสตีล-มีดสนาม-ขนาดกระทัดรัด-คม-มี-2-ขนาด-i.300882723.9854105818?sp_atk=e1446cf2-f5eb-4e16-be42-84aecdff7cd7&xptdk=e1446cf2-f5eb-4e16-be42-84aecdff7cd7",
  "/มีดทำครัว-RHINO-BRAND-No.9101-MEAT-KNIFE-สำหรับการประกอบอาหาร-คมสุดๆ-(ของแท้)-i.3253694.14651006029?sp_atk=bb0edf48-b362-4289-a705-a719826f9aee&xptdk=bb0edf48-b362-4289-a705-a719826f9aee",
  "/✅พร้อมส่ง✅ชุดมีด-มีดทำครัว-มีด-มีดสแตนเลส-มีดเคลือบเซลามิคสีพาสเทล-มีดปลอกผลไม้-เซทมีด-พร้อมที่เก็บและเขียง-i.125299147.11919070594?sp_atk=177f2c88-744f-4523-b912-aa98b5ba4f5a&xptdk=177f2c88-744f-4523-b912-aa98b5ba4f5a",
  "/SHT-มีดพับพกพา-มีดพกเดินป่า-16-ซม.-แข็งแรง-คงทน-กันน้ำ-กันสนิม-ขนาดกะทัดรัด-พกพาสะดวก-1-ชิ้น-i.210075321.20588237381?sp_atk=17bf3b77-1c93-4411-b9d0-06fef7ed35c1&xptdk=17bf3b77-1c93-4411-b9d0-06fef7ed35c1",
  "/⭐️มีสต๊อก⭐️ของแท้​-ชุดมีดทำครัว-​เคลือบเซรามิค-มีดเคลือบเซรามิค-คุณภาพสูง-เขียง-ชุดมีดครัว-มีดสแตนเลส-มีดหลากหลายสี-i.356536688.9914872990?sp_atk=a0e3fb56-e91f-4115-b954-76fa7af5ae88&xptdk=a0e3fb56-e91f-4115-b954-76fa7af5ae88",
  "/SHTมีด-ปังตอ-มีดหั่นเนื้อ-มีดสับกระดูก-สเตนเลสหนา-คมกริบ-รุ่นขายดี-i.210075321.8980091276?sp_atk=d87dc87f-44ec-48b2-bb2f-85bbbefbf8d7&xptdk=d87dc87f-44ec-48b2-bb2f-85bbbefbf8d7",
  "/Home-Office-ที่ลับมีด-4-in-1-มีดลับได้-3-ระดับ-ลับกรรไกร-1-ช่อง-ใช้ง่าย-ลับง่าย-อุปกรณ์ลับมีด-แท่นลับมีด-Sharpener-i.153411975.3269885113?sp_atk=2e5e3cff-932f-410d-ab2d-ab50b61cd837&xptdk=2e5e3cff-932f-410d-ab2d-ab50b61cd837",
  "/Folding-Card-Knife-มีดพกพาขนาดเล็ก-การ์ดมีดพับเก็บได้-**แบบใหม่-มีลายเซ็น-ล็อคแน่น**-i.184964681.10166322129?sp_atk=005a5df3-2571-44b3-961f-aecda32799ff&xptdk=005a5df3-2571-44b3-961f-aecda32799ff",
  "/KIWI-มีดกีวี-มีดทำอาหาร-มีดทำครัว-ของแท้-คมมาก-i.190655832.6507511670?sp_atk=a2473096-9a0a-47da-8543-f568fa7ac353&xptdk=a2473096-9a0a-47da-8543-f568fa7ac353",
  "/❗อ่านก่อนสั่ง❗มีดสเต็กคละเเบบ-มีดสเต็กสแตนเลส-มีด-มีดสเต็ก-มีด-มีดสเต็ก-มีดหั่นสเต็ก-มีดหั่นสเต็ก-ย้ำ❗ว่าคละเเบบ-i.284644888.4983033303?sp_atk=687a7821-f2c3-4cf4-b1cb-0ce433ffc21f&xptdk=687a7821-f2c3-4cf4-b1cb-0ce433ffc21f",
  "/มีด-มีดเดินป่า-มีดสปิง-พับได้-อุปกรณ์เดินป่า-สแตนเลสสตีล-คม-ขนาดกระทัดรัด-i.341603585.18567725932?sp_atk=ba37cf82-ff62-445a-8d9c-d232345d00f5&xptdk=ba37cf82-ff62-445a-8d9c-d232345d00f5",
  "/มีดพับพกพาสวย-มีดเดินป่า-Browning-Folding-Knife-รุ่นFA18-ยาว23CM-440C-i.455517810.11011551799?sp_atk=9ac931b7-4fb1-4692-9578-23066d1c7b2c&xptdk=9ac931b7-4fb1-4692-9578-23066d1c7b2c",
  "/P150-มีดหวี-มีช่องซ่อนใบมีด-สินค้ามี-9เเบบ-สินค้าพร้อมส่ง-i.81435047.23466956503?sp_atk=ed2f468f-4ef1-404e-8803-f958e778a14f&xptdk=ed2f468f-4ef1-404e-8803-f958e778a14f",
  "/มีดพก-มีดเดินป่า-ขนาดยาว19CM-i.43993595.2345336180?sp_atk=95daccaa-6cf1-474d-aeef-35249bbc4d17&xptdk=95daccaa-6cf1-474d-aeef-35249bbc4d17",
  "/มีดทำครัว-มีดปอกผลไม้-มีดทำอาหารตรา999-คมกริบ-Size-s-22.5-cm-i.273215987.4949563576?sp_atk=0cce6f9e-1a20-4079-8a75-9e811c1f2a79&xptdk=0cce6f9e-1a20-4079-8a75-9e811c1f2a79",
  "/มีดสำหรับนักเดินป่า-ขนาด-16-นิ้ว-กับ-33-นิ้ว-ราคาเบาๆ-i.413460320.6183948944?sp_atk=7d49e473-caf5-4a2b-9243-c67d547f3b7b&xptdk=7d49e473-caf5-4a2b-9243-c67d547f3b7b",
  "/💥ส่งฟรี💥-มีดตัดเค้ก-มีดหั่นขนมปัง-Cookingrun-มีดตัดขนมปัง-ทีตัดเค้ก-มีดสไลด์-(มีให้เลือก-3แบบ)-i.784169.5756401089?sp_atk=5d947faf-65fd-4e72-8267-e5f8e4154354&xptdk=5d947faf-65fd-4e72-8267-e5f8e4154354",
  "/คมสุดๆ-ร้อนขาย-Macaron-สีครัว-สแตนเลสชุดมีด-เคลือบฟางข้าวสาลี-ชุดมีดทำครัว-มีดสแตนเลสครัว-ชุดมีดเซรามิก-i.241051477.4756855709?sp_atk=7141ae92-7ad7-4008-bb71-feb7dee31888&xptdk=7141ae92-7ad7-4008-bb71-feb7dee31888",
  "/พวงกุญแจนิรภัย-มีดพกพา-ที่ทุบกระจก-i.329070133.22617619270?sp_atk=90249aa5-df48-497e-a5e7-f9f1bb908f08&xptdk=90249aa5-df48-497e-a5e7-f9f1bb908f08",
  "/มีดสไตล์ญี่ปุ่น-J060-มีดทำครัว-ชุดมีดปังตอ-มีดปังตอสับกระดูก-มีดแล่-เกรดพรีเมี่ยม-สแตนเลสคุณภาพดี-มีดหั่นหมู-i.360877940.20188961365?sp_atk=4db6d65e-76b8-4d61-86f2-64a5a8219b1b&xptdk=4db6d65e-76b8-4d61-86f2-64a5a8219b1b",
  "/ที่ลับมีด-อุปกรณ์ลับมีด-หินลับมีด-ลับได้-เครื่องลับมีด-แท่นลับมีด-อุปกรณ์ลับมีด-Knife-sharpener-i.361007138.3179208067?sp_atk=461ab708-616f-4601-a84a-6831f351a90d&xptdk=461ab708-616f-4601-a84a-6831f351a90d",
  "/💥ส่งฟรี💥-มีดหั่นแบบหยัก-Cookingrun-มีดหยักสแตนเลส-มีดหั่นมันฝรั่ง-สำหรับหั่นผักและผลไม้-มีดหั่นเฟรนฟราย-i.784169.13261121819?sp_atk=d8f93778-0be9-4c75-9736-99c6d9e6345f&xptdk=d8f93778-0be9-4c75-9736-99c6d9e6345f",
  "/มีดทำครัว-มีดปังตอสแตนเลส-สับกระดูก-หั่นเนื้อ-ด้ามทอง-น้ำหนักพอดีมือ-รุ่นขายดี-i.266306488.7055485913?sp_atk=33095f5d-ec32-45d3-9e0f-abe83840f8fb&xptdk=33095f5d-ec32-45d3-9e0f-abe83840f8fb",
  "/มีด-มีดกีวี่-มีดปลอกหั่น-ตรา-กีวี่-ของแท้-💯-อย่างคม-i.37927492.1998664204?sp_atk=8507891b-5357-422a-bb18-b6434cbbc1f2&xptdk=8507891b-5357-422a-bb18-b6434cbbc1f2",
  "/J41-มีดหั่นหัวตัด-มีดญี่ปุ่นพร้อมซอง-หั่นซอยเนื้อสัตว์และผักต่างๆ-ด้ามไม้แท้-i.64498382.23529365454?sp_atk=ebfaa6c0-9122-4bc9-a3a5-4ee188841a93&xptdk=ebfaa6c0-9122-4bc9-a3a5-4ee188841a93",
  "/Tojiro-DP-Nakiri-165-mm-มีดหั่นผักญี่ปุ่น-มีดทำครัวญี่ปุ่น-มีดนาคิริ-(F-502)-i.325248129.8811044182?sp_atk=14eaafb1-3ef6-431f-b9ed-750a9a125590&xptdk=14eaafb1-3ef6-431f-b9ed-750a9a125590",
  "/มีดโกนหนวด-ที่โกนหนวด-ใบมีดสแตนเลสแท้-มีดโกนด้ามเขียว-ใบมีด-3ชั้น-ชุดละ-5-ด้าม-i.4062349.17208492307?sp_atk=d8bc8ee2-e600-48f9-b4fe-4d9540163e15&xptdk=d8bc8ee2-e600-48f9-b4fe-4d9540163e15",
  "/มีดกรีดยาง-ตราสองจอกแท้-พร้อมกรีด-i.32249122.7757022709?sp_atk=f9a2c45e-43e3-49f4-8038-13aab35013ac&xptdk=f9a2c45e-43e3-49f4-8038-13aab35013ac",
  "/Offo.มีด-N8-ชุดมีดและอุปกรณ์ทำครัวเซ็ต-8-ชิ้น-ชุดมีดทำครัวและอุปกรณ์ในการประกอบอาหาร-มีดหั่นผัก-i.199581272.9154709775?sp_atk=be8890de-1712-4340-8e2f-df318fd716f4&xptdk=be8890de-1712-4340-8e2f-df318fd716f4",
];

let linkList = [];

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
    const curPageNum = pagination.querySelector("button.shopee-button-solid").innerText;

    const pageList = pagination.querySelectorAll(
      "button.shopee-button-no-outline"
    );

    for (const page of pageList) {
      if (page.innerText > curPageNum){
        return true;
      }
    }
    return false;
  });
}

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
      productInfo["shop_type"] = shopType.innerText;
    }
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


    console.log('desc')
    //description
    const desc = document.querySelector('p.irIKAp');
    if (desc){
      productInfo['desc'] = desc.innerText;
    }

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

    
    //product info
    console.log('info')
    const infoCol = document.querySelectorAll('div.dR8kXc');

    productInfo['product_info'] = {};

    for (const info of infoCol){
      console.log('label')
      const label = info.querySelector('label').innerText;

      if (label === 'ยี่ห้อ'){
        const brand = info.querySelector('a');
        productInfo['product_info'][label] = brand.innerText;
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
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Wait for the 'domcontentloaded' event before proceeding
    // await page.goto(
    //   "https://shopee.co.th/buyer/login?next=https%3A%2F%2Fshopee.co.th%2Fsearch%3Fkeyword%3D%25E0%25B8%25A1%25E0%25B8%25B5%25E0%25B8%2594%26page%3D0%26sortBy%3Dsales",
    //   {
    //     waitUntil: "load",
    //   }
    // );

    await page.goto(
      "https://shopee.co.th/พร้อมส่งhomeproth-ที่ลับมีด-หินลับมีดสัตว์น่ารัก-แท่นลับมีด-อุปกรณ์ลับของมีคม-ลับได้คมมาก-Knife-Sharpener-i.320775209.5690642775?sp_atk=10e94fa3-bb6e-4639-9609-167bad4b1fe8&xptdk=10e94fa3-bb6e-4639-9609-167bad4b1fe8",
      {
        waitUntil: "load",
      }
    );
// await login(page);
// const dataList = [];
//           const temp = await getProductInfo(page);
//       temp['product_address'] = 'https://shopee.co.th/%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%AA%E0%B9%88%E0%B8%87homeproth-%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%A5%E0%B8%B1%E0%B8%9A%E0%B8%A1%E0%B8%B5%E0%B8%94-%E0%B8%AB%E0%B8%B4%E0%B8%99%E0%B8%A5%E0%B8%B1%E0%B8%9A%E0%B8%A1%E0%B8%B5%E0%B8%94%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B9%8C%E0%B8%99%E0%B9%88%E0%B8%B2%E0%B8%A3%E0%B8%B1%E0%B8%81-%E0%B9%81%E0%B8%97%E0%B9%88%E0%B8%99%E0%B8%A5%E0%B8%B1%E0%B8%9A%E0%B8%A1%E0%B8%B5%E0%B8%94-%E0%B8%AD%E0%B8%B8%E0%B8%9B%E0%B8%81%E0%B8%A3%E0%B8%93%E0%B9%8C%E0%B8%A5%E0%B8%B1%E0%B8%9A%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%A1%E0%B8%B5%E0%B8%84%E0%B8%A1-%E0%B8%A5%E0%B8%B1%E0%B8%9A%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%84%E0%B8%A1%E0%B8%A1%E0%B8%B2%E0%B8%81-Knife-Sharpener-i.320775209.5690642775?sp_atk=10e94fa3-bb6e-4639-9609-167bad4b1fe8&xptdk=10e94fa3-bb6e-4639-9609-167bad4b1fe8&is_from_login=true';
//       temp['shop_address'] = shopeeHomeUrl + temp['shop_address'];
//   dataList.push(temp);

    //wait for page to redirect to login page for some reason?
    await login(page);
    await wait(5000);

    // try{
    //   const temp = await getProductInfo(page);
    //   saveAsJson(JSON.stringify(temp, null, 2), 'product.json');
    // }catch(err){
    //   console.log(err);
    // }
    // await data
      //     temp['product_address'] = shopeeHomeUrl + address;
      // temp['shop_address'] = shopeeHomeUrl + temp['shop_address'];
      // console.log(data);
      // return;
    //   return;
    const dataList = [];
    const seller = [];
    const brand = [];
    let count = 0;
    // linkedAddress
    let addresss = ['/พร้อมส่งhomeproth-ที่ลับมีด-หินลับมีดสัตว์น่ารัก-แท่นลับมีด-อุปกรณ์ลับของมีคม-ลับได้คมมาก-Knife-Sharpener-i.320775209.5690642775?sp_atk=10e94fa3-bb6e-4639-9609-167bad4b1fe8&xptdk=10e94fa3-bb6e-4639-9609-167bad4b1fe8']
    for (address of addresss){
      count ++;
      console.log(count)
      await page.goto(shopeeHomeUrl + address,
      {
        waitUntil: "load",
      }
      );
      await wait(5000);
      let temp = await getProductInfo(page);
      while (!temp){
        await page.goto(shopeeHomeUrl + address, {waitUntil: "load",});
        temp = await getProductInfo(page);
        await wait(500000);
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


    while (true){
      linkList = linkList.concat(await getAllLinksInRow(page));

      // if (checkForNextPage(page)) {
      //   console.log("wait for navigation");
      //   await Promise.all([
      //     page.waitForNavigation(), // The promise resolves after navigation has finished
      //     page.click("button.shopee-icon-button--right"), // Clicking the link will indirectly cause a navigation
      //   ]);
      //   console.log("finished navigation");
      //   await wait(5000);
      //   continue;
      // }
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

main();
