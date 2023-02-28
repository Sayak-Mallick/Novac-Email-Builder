const express = require('express');
const { getAllTemplates, getAddTemplateView, addTemplate,
    getUpdateTemplateView, updateTemplate, getDeleteTemplateView, deleteTemplate, sendEmail, postEmail } = require('../controllers/EmailController');


const router = express.Router();

router.get('/list', getAllTemplates);
router.get('/', sendEmail);
router.post('/postEmail', postEmail);
router.get('/addTemplate', getAddTemplateView);
router.post('/addTemplate', addTemplate);
router.get('/updateTemplate/:id', getUpdateTemplateView);
router.post('/updateTemplate/:id', updateTemplate);
router.get('/deleteTemplate/:id', getDeleteTemplateView);
router.post('/deleteTemplate/:id', deleteTemplate);



module.exports = {
    routes: router
}