var express = require('express');
var adminRouter = require('./admin');
var userRouter = require('./user');
var router = express.Router();

router.use('/admin', adminRouter);
router.use('/user', userRouter);

router.get('/' , function (req , res) {
    if(req.session.account) {
        res.redirect('/user/blog');
    } else {
        res.redirect('/user');
    }
})
module.exports = router;