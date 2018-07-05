var express = require('express');
var postModel = require('../models/post');
var adminModel = require('../models/admin');
var { isMatch, isRegister, generatePasswordByBcrypt } = require('../helpers/admin/helper');

var router = express.Router();

var alertCustom = {};
/**
 * GET login
 * public
 * /admin
 */
router.get('/', function (req, res) {
    alertCustom = {
        status: 0,
        message: ''
    }
    res.render('admin/signup', { alertCustom });
});
/**
 * POST login
 * public
 * /admin/signin
 */
router.post('/signin', function (req, res) {
    var data = req.body;
    
    console.log(data);
    
    adminModel.findOne({"email" : data.email}, function (err, result) {
        if(!result) {
            alertCustom = {
                status : 1,
                message: 'Not Founded Email :( !'
            }
            res.render('admin/signup', { alertCustom });
        } else {
            if(isMatch(data.password , result.password)){
                res.redirect('/admin/dashboard');
            } else {
                alertCustom = {
                    status : 1,
                    message: 'Đăng nhập thất bại :( !'
                }
                res.render('admin/signup', { alertCustom });
            }
        }
    })

})
/**
 * POST signUp
 * public
 * /admin/signup
 */
router.post('/signup', function (req, res) {
    var data = req.body;
    var status = isRegister(data);
    adminModel.find({ "email": data.email }, function (err, result) {
        if (status) {
            if (result.length == 0) {
                var user = {
                    "email": data.email,
                    "password": generatePasswordByBcrypt(data.password),
                    "first_name": data.first_name,
                    "last_name": data.last_name,
                }
                adminModel.insertMany(user, function (req, result) {
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
                res.render('admin/signup', { alertCustom });
            }
        } else {
            alertCustom = {
                status : 1,
                message: 'Password không trùng khớp :( !'
            }
            res.render('admin/signup', { alertCustom });
        }
    });
});

router.get('/dashboard', function (req, res) {
    postModel.find({}, function (req, result) {
        res.render('admin/dashboard', { data: result });
    });
});
router.get('/add', function (req, res) {
    res.render('admin/add');
});
router.post('/add', function (req, res) {
    var newsRequest = req.body;
    var news = {
        "title": newsRequest.title,
        "author": newsRequest.author,
        "content": newsRequest.content,
        "created_at": Date.now(),
        "updated_at": Date.now()
    }
    postModel.insertMany(news, function (req, result) {
        res.redirect('/admin/dashboard');
    });
});

module.exports = router;