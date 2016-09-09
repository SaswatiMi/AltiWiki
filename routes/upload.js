var Busboy = require('connect-busboy');
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var Article = require('../models/Article.js');

router.post('/:id', function(req, res) {
	var busboy = new Busboy({ headers : req.headers });
	var fileId = new mongo.ObjectId();
	var gfs = req.app.get('gridfs');
	
	req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		console.log('preparing upload....file to be uploaded: ', filename);
		var writeStream = gfs.createWriteStream({
			_id: fileId,
			filename: filename,
			mode: 'w',
			content_type: mimetype,
		});
		file.pipe(writeStream);
	}).on('finish', function() {
		Article.findById(req.params.id, function(err, article) {
			if(err) console.log('Something went wrong while finding the article to be updated....');
			gfs.exist({_id: article.content}, function(err,found){
				if(err) console.log('something went wrong while querying for existing files....');
				if(!found) console.log('no files attached to the article yet...');
				if(found){
					gfs.remove({_id : article.content}, function(err){
						if(err) console.log('something went wrong while deleting previous file');
						console.log('previous file deleted successfully....');
					});
				}
			});
			article.content = fileId;
			article.save(function(err, updatedArticle) {
				if(err) console.log('something went wrong while updating the article');
				console.log('New file has been attached to the article');
				res.redirect('../#/success');
			})
		});
	});
	req.pipe(req.busboy);
});

router.get('/files/:id', function(req, res) {
	var gfs = req.app.get('gridfs');
	gfs.findOne({ _id: req.params.id }, function (err, file) {
		if (err) return res.status(400).send(err);
		if (!file) return res.status(404).send('');

		res.set('Content-Type', file.contentType);
		res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');

		var readstream = gfs.createReadStream({
			_id: file._id
		});

		readstream.on("error", function(err) {
			console.log("Got error while processing stream " + err.message);
			//res.end();
		});

    readstream.pipe(res);
	});
});

router.delete('/remove/:id',function(req,res){
	var gfs = req.app.get('gridfs');
	gfs.remove({ _id:req.params.id }, function (err,post) {
		if (err) console.log('File was not deleted....');
		console.log('successfully removed file along with article deletion....');
		res.json(post);
	});
});

module.exports = router;