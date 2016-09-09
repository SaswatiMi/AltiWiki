var express = require('express');
var router = express.Router();

var Article = require('../models/Article.js');
var gfs = router.gridfs;

/* GET /Article listing. */
router.get('/', function(req, res, next) {
  Article.find(function (err, articles) {
    if (err) return next(err);
    res.json(articles);
  });
});

router.post('/', function(req, res, next) {
  Article.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /article/id */
router.get('/:id', function(req, res, next) {
  Article.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.put('/:id', function(req, res, next) {
  Article.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

router.delete('/:id', function(req, res, next) {
  Article.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;