const express = require('express');
const md5 = require('md5');
const { gameDB } = require('../utils/database');
const jwt = require("jsonwebtoken");
const { jwtConstants } = require('../utils/jwt.constants');
const { body, validationResult } = require('express-validator');
const { redeemVoucher } = require('../utils/voucher');
const router = express.Router();

router.post('/login',async (req,res)=>{
    const { username, password } = req.body;
    const db = await gameDB();
    const [rows] = await db.execute("SELECT * FROM UserInfoFromPublisher WHERE fdUserID = ?",[username]);
    if(!rows[0]){
        return res.json({
            isSuccess:false,
            msg: 'ขออภัย ไม่พบชื่อนี้ในระบบ'
        });
    }else{
        var user = rows[0];
        if(md5(password) !== user.fdPassword){
            return res.json({
                isSuccess: false,
                msg: 'ขออภัย รหัสผ่านไม่ถูกต้อง'
            });
        }else{
            let token;
            token = jwt.sign( {userId: user.fdUserID }, jwtConstants, { expiresIn: "1h" });
            res.status(200).json({
                isSuccess: true,
                user:{
                    userId: user.fdUserID,
                    access_token: token
                }
            });
        }
    }
});

router.get('/me', (req,res)=>{
    const token = req.headers.authorization.split(' ')[1]; 
    if(!token){
        res.status(200).json({success:false, message: "Error! Token was not provided."});
    }
    const decodedToken = jwt.verify(token, jwtConstants);
    res.status(200).json({ success:true, user: { userId: decodedToken.userId } });
});

router.post('/',(req,res)=> {
    res.send('Logged in success');
});

router.put('/', (req,res)=> {
    res.send('Update successfully');
});

router.delete('/logout', (req,res)=> {
    res.status(200).json({
        success: true
    });
});

router.post('/topup',[
        body('voucher').exists().withMessage('Voucher is require')
    ], (req,res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()});
    }
    var response = redeemVoucher(req.body.voucher);
    return res.json({data: response});
})

module.exports = router;