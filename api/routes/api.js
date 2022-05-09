const express = require('express');
const router = express.Router();

const ContactModel = require("../model/contact");
// const GeolocatioModel = require

/* GET home page. */
router.get('/', async function (req, res, next) {


    let contactList = await ContactModel.list();
    // console.log(contactList);
    // console.log(contactList);
    if (contactList.status = true) {
        res.json(contactList.data);
    } else {
        res.json(contactList);
    }

});



router.post('/', async function (req, res, next) {

    let data = {
        firstName: req.body.FirstName,
        lastName: req.body.LastName,
        phoneNumber: req.body.PhoneNumber,
        streetNumber: req.body.StreetNumber,
        Street: req.body.Street,
        City: req.body.City,
        State: req.body.State,
        Country: req.body.Country
    };
    let result = await ContactModel.insert(data);


    res.json(result);
});

router.delete('/:id', async function (req, res, next) {

    let contactId = req.params.id;
    await ContactModel.delete(contactId);
    res.json({ "result": true });

});

router.patch('/:id', async function (req, res, next) {
    let contactId = req.params.id;

    let data = {
        firstName: req.body.FirstName,
        lastName: req.body.LastName,
        phoneNumber: req.body.PhoneNumber,
        streetNumber: req.body.StreetNumber,
        Street: req.body.Street,
        City: req.body.City,
        State: req.body.State,
        Country: req.body.Country
    };

    let result = await ContactModel.update(data, contactId);
    res.json(result);
});

module.exports = router; 