var express = require('express');
var userModel = require('../models/user');
var postModel = require('../models/post');
var { isRegister, generatePasswordByBcrypt, isMatch } = require('../helpers/user/helper');

var router = express.Router();

var alertCustom = { status: 0, message: '' };

/** method:  GET
 * blog page
 * /user/blog
 */
router.get('/blog', function (req, res) {
    postModel.find({}, function (err, result) {
        res.render('blog', {data: result});
    });
})

router.get('/', function (req, res) {
    if(req.session.account) {
        res.redirect('/user/blog');
    } else {
        alertCustom = {
            status: 0,
            message: ''
        }
        res.render('signup', { alertCustom });
    }
})

router.post('/logout', function (req, res) {
    console.log('LOGOUT');
    req.session.destroy(function (err) {
        console.log(err);
    });
    res.redirect('/user');
})

router.post('/signin', function (req, res) {
    var data = req.body;
    
    userModel.findOne({ "email": data.email }, function (err, result) {
        if(!result){
            alertCustom = {
                status : 1,
                message: 'Not Founded Email :( !'
            }
            res.render('signup', { alertCustom });
        } else {
            if (isMatch(data.password, result.password)) {
                req.session.account = result;
                res.redirect('/user/blog');
            } else {
                alertCustom = {
                    status : 1,
                    message: 'Đăng nhập thất bại :( !'
                }
                res.render('signup', { alertCustom });
            }
        }
    })
});

router.post('/signup', function (req, res) {
    var data = req.body;
    var status = isRegister(data);
    userModel.find({ "email": data.email }, function (req, result) {
        if (status) {
            if (result.length == 0) {
                var user = {
                    "email": data.email,
                    "password": generatePasswordByBcrypt(data.password),
                    "first_name": data.first_name,
                    "last_name": data.last_name,
                    "created_at": Date.now(),
                    "updated_at": Date.now(),
                }
                userModel.insertMany(user, function (req, result) {
                    alertCustom = {
                        status: 2,
                        message : "Đăng kí thành công :) !"
                    }
                    res.render('signup', { alertCustom });
                });
            } else {
                alertCustom = {
                    status : 1,
                    message: 'Email đã tồn tại! :('
                }
                res.render('signup', { alertCustom });
            }
        } else {
            alertCustom = {
                status : 1,
                message: 'Password không trùng khớp :( !'
            }
            res.render('signup', { alertCustom });
        }
    });
});

module.exports = router;