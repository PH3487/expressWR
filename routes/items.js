const { default: axios } = require('axios');
const express = require('express');
const { body, validationResult } = require('express-validator');
const { default: fetch } = require('node-fetch-commonjs');
const { toUTF8 } = require('../utils/base64');

const { gameDB, webDB } = require('../utils/database');
const router = express.Router();

router.get('/categories',async (req,res)=>{
    const dbWeb = await webDB();
    const result = await dbWeb.query("SELECT * FROM Web_ItemShopMenu");
    var row = result[0];
    // if(categories[0][0])
    if(row){
        var itemAll = [];
        row.forEach(item => {

            itemAll.push({
                id: item.MenuNum,
                name: toUTF8(item.MenuName)
            })
        });
        return res.status(200).json(itemAll);
    }else{
        return res.status(400).json({
            msg: 'no item'
        })
    }
});

router.post('/subCategories',
    body('categoryId').exists().isInt().withMessage('กรุณากรอกตัวเลข')
    , async(req,res) => {
        
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(403).json({
                success:false,
                msg: 'ไม่พบรหัสไอเทม'
            })
        }
        
        const dbWeb = await webDB();
        const result = await dbWeb.query('SELECT * FROM Web_ItemShop WHERE ItemMenu = ? AND ItemDelete = 0',[req.body.categoryId]);
        if(result[0]){
            var object = result[0];
            var subItem = [];
            object.forEach(async (ele) => {
                var item = await axios.get(`https://worldrunner.host/api/imageQuery.php?imageId=${ele.ItemNum}`);
                console.log(item.data);
                ele.ItemName = toUTF8(ele.ItemName)
                ele.itemImage = item.data;
                subItem.push(ele);
            });
            return res.status(200).json(subItem);
        }else{
            return res.status(400).json({
                msg: 'no item'
            })
        }
});

router.get('/test/:id', async (req,res) => {
    res.send(await itemImage(req.params.id));
})

async function itemImage(itemId){
    const item = await axios.get(`https://worldrunner.host/api/imageQuery.php?imageId=${itemId}`);
    return await item;
}

module.exports = router;