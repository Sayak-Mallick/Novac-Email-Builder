const { Email, validate } = require('../models/email');
const nodeBase64 = require('../startup/encrytionDecryption')
const nodemailer = require('nodemailer');
const config = require('../startup/config')

const getAllTemplates = async (req, res, next) => {
    const list = await Email.find().exec();
    res.render('templateslist', {
        emails: list
    });
}

const getAddTemplateView = (req, res, next) => {
    res.render('addTemplate');
}

const addTemplate = async (req, res, next) => {
    const { error } = validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);
    const data = req.body;
    let email = await new Email({
        name: data.name,
        template_content: nodeBase64.encode(data.template_content),
        status: data.status,
    });
    email = await email.save();
    res.redirect('/');
}

const getUpdateTemplateView = async (req, res, next) => {
    try {
        const id = req.params.id;
        const onetemplate = await Email.findById(id).exec();
        onetemplate.template_content = nodeBase64.decode(onetemplate.template_content);
        res.render('updateTemplate', {
            email: onetemplate
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateTemplate = async (req, res, next) => {
    const { error } = validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);
    const id = req.params.id;
    const data = req.body;
    let email = await Email.findByIdAndUpdate(id, {
        name: data.name,
        template_content: nodeBase64.encode(data.template_content),
        status: data.status,
    }, { new: true });
    if (!email) return res.status(404).send('Template with the given id not found');

    res.redirect('/');
}

const getDeleteTemplateView = async (req, res, next) => {
    try {
        const id = req.params.id;
        const onetemplate = await Email.findById(id).exec();
        res.render('deleteTemplate', {
            email: onetemplate
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteTemplate = async (req, res, next) => {
    try {
        const id = req.params.id;
        const template = await Email.findByIdAndRemove(id);
        if (!template) return res.status(404).send('Template with the given id not found');
        res.redirect('/');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const postEmail = (req, res) => {
    var to, cc, bcc, subject, body, templates;
    to = req.body.to
    cc = req.body.cc,
    bcc = req.body.bcc,
    subject = req.body.subject
    body = req.body.body
    templates = req.body.templates;

    console.log("Email was sent to:- " + to)
    console.log("CC was sent to:- " + cc)
    console.log("BCC was sent to:- " + bcc)
    console.log("Email Was Related with:-" + subject)
    console.log("The content of the e-mail is:" + templates)



    var transporter = nodemailer.createTransport({
        host: config.sm,
        port: 587,
        secure: false,
        auth: {
            user: config.mail,
            pass: '##MSD07##sayak'

            // user: 'sayakmallickkv@gmail.com',
            // pass: 'unkbcezgmrqslrua'
        },
    });

    var mailOptions = {
        from: 'Sayak Mallick <sayakmallick@novactech.in>',
        to: to,
        cc: cc,
        bcc: bcc,
        text: body,
        subject: subject,
        html: nodeBase64.decode(templates),
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log("Email Sent Successfully " + info.response);
            console.log(' ');
            return res.render('result');
        }
    })
}



const sendEmail = async (req, res, next) => {
    const list = await Email.find().exec();
    list.forEach(v => { v.template_content_modified = nodeBase64.decode(v.template_content) });
    res.render('sendemail', {
        emails: list
    });
}


module.exports = {
    getAllTemplates,
    getAddTemplateView,
    addTemplate,
    getUpdateTemplateView,
    updateTemplate,
    getDeleteTemplateView,
    deleteTemplate,
    sendEmail,
    postEmail
}
