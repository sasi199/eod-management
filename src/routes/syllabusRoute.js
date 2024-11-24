const express = require('express');
const syllabusController = require("../controller/syllabusController");
const uploads = require('../middlewares/multer');

const Router = express.Router();

Router.route('/createSyllabus').post(uploads.single('uploadFile'),syllabusController.createSyllabus);
Router.route('/createSyllabusAll').get(syllabusController.getSyllabusAll);
Router.route('/createSyllabus/:_id').get(syllabusController.getSyllabusId);
Router.route('/createSyllabus/:_id').put(uploads.single('uploadFile'),syllabusController.editSyllabus);
Router.route('/createSyllabus?:_id').delete(syllabusController.deleteSyllabus);



module.exports = Router;