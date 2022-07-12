const express = require("express");
const router = express.Router();


router.get('/cart', (req, res) => {
    res.status(200).json({
        data: [
            {
                "id": 1,
                "img": "https://unsplash.it/300/300?image=1047",
                "title": "DEVIL部品~ 辣椒多層次氣門散熱蓋~FORCE、SMAX專用",
                "desc": "辣椒商品，最超值的商品品牌絕對辣的價格，價格不辣怎麼能掛上辣椒的商標呢??既然掛上辣椒標誌，品質跟價格絕對優秀最新限量商品，辣椒多層次氣門散熱蓋FORCE、SMAX專用把市面上大多數的氣門蓋，做一整合..",
                "price": 2629
            },
            {
                "id": 2,
                "img": "https://unsplash.it/300/300?image=1048",
                "title": "EPIC商品~ FORCE SMAX專用一體式車台強化支架",
                "desc": "台灣原創，千大EPIC出品FORCE SMAX專用一體式車台強化支架針對於FORCE/SMAX避震器處上鎖點分此部分的車台強度不足，給予加強補強安裝後絕對有正面性的效果台灣EPIC千大出品，台灣最老的..",
                "price": 1772
            },
            {
                "id": 3,
                "img": "https://unsplash.it/300/300?image=1049",
                "title": "EPIC商品~ 水轉印類碳纖維款 FORCE原廠轉印大盾牌",
                "desc": "商品特色台灣原創，千大EPIC出品水轉印類碳纖維款 FORCE原廠轉印大盾牌仿真碳纖維水轉印，精緻水轉印製做水轉印特色是比碳纖維售價更便宜、更親民而水轉印也非常耐用，可打蠟清洗沒有問題精緻水轉印製造，..",
                "price": 2778
            },
            {
                "id": 4,
                "img": "https://unsplash.it/300/300?image=1050",
                "title": "EPIC商品~ 水轉印類碳纖維款 FORCE原廠轉印排氣管護蓋",
                "desc": "台灣原創，千大EPIC出品FORCE原廠轉印排氣管護蓋仿真碳纖維水轉印，精緻水轉印製做水轉印特色是比碳纖維售價更便宜、更親民而水轉印也非常耐用，可打蠟清洗沒有問題精緻水轉印製造，有不錯的外觀性外層也是..",
                "price": 2592
            },
            {
                "id": 5,
                "img": "https://unsplash.it/300/300?image=1051",
                "title": "EPIC商品~水轉印類碳纖維款 SMAX FORCE原廠轉印水箱外蓋",
                "desc": "台灣原創，千大EPIC出品仿真碳纖維水轉印，精緻水轉印製做水轉印特色是比碳纖維售價更便宜、更親民而水轉印也非常耐用，可打蠟清洗沒有問題精緻水轉印製造，有不錯的外觀性外層也是透明烤漆，安裝後也非常好看...",
                "price": 3469
            },
            {
                "id": 6,
                "img": "https://unsplash.it/300/300?image=1052",
                "title": "FORCE SMAX 碳纖維開孔造型前土除",
                "desc": "商品特色FORCE SMAX 碳纖維開孔造型前土除外型類似原廠土除，但更具立體造型純正纖維包覆，包覆正碳纖維商品100%碳纖維披覆，品質優良不易脫膠完全手工製作，安裝後好看滿點商品說明此組為最受歡迎款..",
                "price": 3012
            },
            {
                "id": 7,
                "img": "https://unsplash.it/300/300?image=1053",
                "title": "FORCE SMAX專用 碳纖維傳動前框",
                "desc": "商品特色山葉FORCE SMAX專用 碳纖維傳動前框，超密合款新一代碳纖維真空高壓款，正外銷日本品此為最新製程，100%開模真空高壓款式100%開CNC模具製作，採用真空高壓製造真空高壓製成製作，品質..",
                "price": 3371
            },
            {
                "id": 8,
                "img": "https://unsplash.it/300/300?image=1054",
                "title": "FORCE SMAX專用~ 類碳纖維壓花 加長型後內土除",
                "desc": "最新款SMAX加長型後內土除，加長款式跟一般內土除比較，加長30%長度遮擋雨水效果更佳，好用滿點&nbsp;&nbsp;外觀採用與原廠相同塑料，耐用度佳就算長期使用震動，都不易破裂故障外表採用類似碳纖..",
                "price": 1614
            },
            {
                "id": 9,
                "img": "https://unsplash.it/300/300?image=1055",
                "title": "FORCE SMAX專用外掛式後擋泥板",
                "desc": "台灣工廠製造，FORCE SMAX專用擋水板此為外掛式設計，加強擋水擋泥專用安裝簡單，非常方便，自己DIY都簡單100%台灣廠商製作，絕對好用最簡單方便，最便宜的好商品高CP值，FORCE SMAX直..",
                "price": 2078
            },
            {
                "id": 10,
                "img": "https://unsplash.it/300/300?image=1056",
                "title": "FORCE、SMAX專用~ 碳纖維水箱外蓋貼片組",
                "desc": "商品特色山葉FORCE155專用碳纖維 碳纖維水箱外蓋貼片組新一代碳纖維真空高壓款，正外銷日本品此為最新製程，100%開模真空高壓款式100%開CNC模具製作，採用真空高壓製造真空高壓製成製作，品質優..",
                "price": 2627
            },
            {
                "id": 11,
                "img": "https://unsplash.it/300/300?image=1057",
                "title": "FORCE專改~ FORCE專用歐盟方向燈翹牌架套餐",
                "desc": "商品說明 &nbsp;關於翹牌架翹牌架採用KYL商品，台灣廠商KYL開發設計安裝簡單方便，完全直上對應原廠鎖點，不需要挖洞鑽孔安裝後角度在法規45度角以下，不會太翹專車專用翹度剛剛好，不用擔心太翹大約..",
                "price": 2659
            },
            {
                "id": 12,
                "img": "https://unsplash.it/300/300?image=1058",
                "title": "FORCE專改~ JSTC直上型照後鏡前移套件組",
                "desc": "商品特色JSTC直上型照後鏡前移套件組，專為FORCE設計改裝完全直上，簡易型安裝設計角度不偏移，不歪斜完全直上商品台灣製造，非左岸商品專為FORCE角度設計安裝，FORCE專用其他車型不可簡單方便，..",
                "price": 1871
            },
            {
                "id": 13,
                "img": "https://unsplash.it/300/300?image=1059",
                "title": "FORCE專用 極妒可調式CNC翹牌架 大牌架",
                "desc": "商品特色台灣製造商品，極妒商品 可調式CNC翹牌架 大牌架對應FORCE專用出品，專車專用全CNC製造，非一般壓鑄商品安裝後更加簡潔、清爽、好看，完全日式風格FORCE專用直上款全新設計對應FORCE..",
                "price": 1751
            },
            {
                "id": 14,
                "img": "https://unsplash.it/300/300?image=1060",
                "title": "FORCE專用 碳纖維排氣管護片側邊貼片",
                "desc": "商品特色山葉FORCE專用FORCE專用 碳纖維排氣管護片側邊貼片，超密合款新一代碳纖維真空高壓款，正外銷日本品此為最新製程，100%開模真空高壓款式100%開CNC模具製作，採用真空高壓製造真空高壓..",
                "price": 2928
            }
        ]
    })
});

module.exports = router;