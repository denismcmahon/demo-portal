// pull in required dependancies and load the input validations, and then the user model
const express = require('express');
const router = express.Router();
const multer = require('multer');
const unzipper = require('unzipper');
const fs = require('fs');
const fsextra = require('fs-extra');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

// Site Model
const Site = require('../../models/Site');

const auth = require('../../middleware/auth');

const helpers = require('../../helpers/helpers');

let dbThumbPath;
let dbContentPath;
let zipfile;
let fileToUnzip;
let contentFolder;

// storage function for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // get cleaned category name
    const category = helpers.cleanStringWithSpaces(req.body.category);
    // get cleaned version of the existing category name for a site
    let existingCategory = '';
    let existingFolderUuid = '';
    if (req.body.uploadType == 'edit') {
      existingCategory = helpers.cleanStringWithSpaces(req.body.existingCategory);
      existingFolderUuid = req.body.existingFolderUuid;
      if (req.body.url) {
        const existingContentFolder =
          './client/build/demos/' + existingCategory + '/' + existingFolderUuid + '/';
        rimraf(existingContentFolder, function() {
          console.log('existing content folder deleted');
        });
      }
    }
    // generate a guid for the folder name for the thumbnail and content folder
    const folderUuid = req.body.folderUuid;
    console.log('folderUuid: ' + folderUuid);
    // if file being sent through is a thumbnail then set the db path for saving to the db and set the destination
    if (file.fieldname == 'thumbnail') {
      // set the path of the content folder
      thumbContentFolder = './client/build/thumbnails/' + category + '/' + folderUuid;
      // if it's an edit delete the folder and content before it's created again
      if (req.body.uploadType == 'edit') {
        // delete the existing directory
        const existingThumbFolder =
          './client/build/thumbnails/' + existingCategory + '/' + existingFolderUuid + '/';
        rimraf(existingThumbFolder, function() {
          // create the directory
          mkdirp(thumbContentFolder, function(err) {
            if (err) {
              console.error('err: ' + err);
            } else {
              // set the path for the db
              dbThumbPath = 'thumbnails/' + category + '/' + folderUuid + '/' + file.originalname;
              // set the destination
              cb(null, thumbContentFolder);
            }
          });
        });

        // create the new directory and point to that path
      } else {
        // create the directory
        mkdirp(thumbContentFolder, function(err) {
          if (err) {
            console.error('err: ' + err);
          } else {
            // set the path for the db
            dbThumbPath = 'thumbnails/' + category + '/' + folderUuid + '/' + file.originalname;
            // set the destination
            cb(null, thumbContentFolder);
          }
        });
      }
    }
    // if file being sent through is content
    if (file.fieldname == 'content') {
      // set the path of the content folder
      contentFolder = './client/build/demos/' + category + '/' + folderUuid;
      if (req.body.uploadType == 'edit') {
        // delete the existing directory
        const existingContentFolder =
          './client/build/demos/' + existingCategory + '/' + existingFolderUuid + '/';
        rimraf(existingContentFolder, function() {
          // create the directory
          mkdirp(contentFolder, function(err) {
            if (err) {
              console.error('err: ' + err);
            } else {
              if (file.originalname.includes('.zip')) {
                // set the zip file to unzip later in the route
                zipfile = contentFolder + '/' + file.originalname;
                // set the path for the db
                dbContentPath = 'demos/' + category + '/' + folderUuid + '/index.html';
                // set the flag to let the route know there is a file to uzip
                fileToUnzip = true;
              } else {
                // set the path for the db
                dbContentPath = 'demos/' + category + '/' + folderUuid + '/' + file.originalname;
              }
              // set the destination
              cb(null, contentFolder);
            }
          });
        });
      } else {
        // if a new piece of content then create the folder
        mkdirp(contentFolder, function(err) {
          if (err) {
            console.error('err: ' + err);
          } else {
            if (file.originalname.includes('.zip')) {
              // set the zip file to unzip later in the route
              zipfile = contentFolder + '/' + file.originalname;
              // set the path for the db
              dbContentPath = 'demos/' + category + '/' + folderUuid + '/index.html';
              // set the flag to let the route know there is a file to uzip
              fileToUnzip = true;
            } else {
              // set the path for the db
              dbContentPath = 'demos/' + category + '/' + folderUuid + '/' + file.originalname;
            }
            // set the destination
            cb(null, contentFolder);
          }
        });
      }
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// create the multer instance that will be used to upload/save the file
const content_upload = multer({ storage });

// @route GET /sites
// @desc Returns all the sites in the db
// @access Public
router.get('/', (req, res) => {
  Site.find(function(err, sites) {
    if (err) {
      console.log(err);
    } else {
      res.json(sites);
    }
  });
});

// @route GET /editsite
// @desc Returns info for one site
// @access Public
router.get('/editsite/:siteId', (req, res) => {
  Site.findOne({ _id: req.params.siteId }, function(err, site) {
    if (err) {
      console.log(err);
    } else {
      console.log(site);
      res.json(site);
    }
  });
});

// @route PUT /editsite
// @desc Updates info/content for one site
// @access Private
router.put('/editsite/:siteId', auth, content_upload.any(), (req, res) => {
  // if there is a content to unzip from the content, unzip to the folder
  if (fileToUnzip) {
    fs.createReadStream(zipfile).pipe(unzipper.Extract({ path: contentFolder }));
    fileToUnzip = false;
  }

  // clean up the category name
  const category = helpers.cleanStringWithSpaces(req.body.category);

  // create the new site and set the link to the content or url depending
  var site = {};
  site.category = category;
  site.title = req.body.title;
  site.image = dbThumbPath;
  site.folderUuid = req.body.folderUuid;
  if (req.body.url) site.link = req.body.url;
  else site.link = dbContentPath;

  Site.updateOne({ _id: req.params.siteId }, site, function(err, raw) {
    // If there's an error
    if (err) {
      return res
        .status(400)
        .json({ msg: 'There has been a problem editing the file, please check with the dev team' });
    } else {
      res.status(200).json({ status: 'ok' });
    }
  });
});

// @route POST /addsite
// @desc Adds the thumbnail, and adds and unzips (if necessary) the content file to the server
// @access Private
router.post('/addsite', auth, content_upload.any(), (req, res) => {
  // if there is a content to unzip from the content, unzip to the folder
  if (fileToUnzip) {
    fs.createReadStream(zipfile).pipe(unzipper.Extract({ path: contentFolder }));
    fileToUnzip = false;
  }

  // clean up the category name
  const category = helpers.cleanStringWithSpaces(req.body.category);

  // create the new site and set the link to the content or url depending
  var site = new Site();
  site.category = category;
  site.title = req.body.title;
  site.image = dbThumbPath;
  site.folderUuid = req.body.folderUuid;
  if (req.body.url) site.link = req.body.url;
  else site.link = dbContentPath;

  // save the site to the db
  site.save(function(err) {
    // If there's an error
    if (err) {
      return res.status(400).json({
        msg: 'There has been a problem uploading the file, please check with the dev team'
      });
    } else {
      res.status(200).json({ status: 'ok' });
    }
  });
});

// @route DELETE /deletesite
// @desc Deletes the site with the specified id
// @access Private
router.delete('/deletesite/:id', auth, (req, res) => {
  let siteGuid;
  let siteCategory;
  Site.findOne({ _id: req.params.id }, function(err, site) {
    if (err) {
      return res.status(400).json({
        msg: 'There has been a problem uploading the file, please check with the dev team'
      });
    } else {
      siteGuid = site.folderUuid;
      siteCategory = site.category;
    }
  });

  Site.deleteOne({ _id: req.params.id }, function(err, site) {
    if (err) {
      return res.status(400).json({
        msg: 'There has been a problem deleting the site, please check with the dev team'
      });
    } else {
      // delete the thumb and content folders
      rimraf('./client/build/thumbnails/' + siteCategory + '/' + siteGuid + '/', function(err) {
        if (err)
          return res.status(400).json({
            msg:
              'There has been a problem deleting the thumbnails folder, please check with the dev team'
          });
        else console.log('thumbnail folder deleted');
      });
      rimraf('./client/build/demos/' + siteCategory + '/' + siteGuid + '/', function(err) {
        if (err)
          return res.status(400).json({
            msg:
              'There has been a problem deleting the content folder, please check with the dev team'
          });
        else console.log('demos folder deleted');
      });
      res.status(200).json(site);
    }
  });
});

// export the router so it can be used elsewhere
module.exports = router;
