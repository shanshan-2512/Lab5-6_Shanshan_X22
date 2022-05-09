const dbcPool = require('./db');
const GeolocatioModel = require('./geolocation');

let Contact = {};

Contact.list = async function (order = "lastname", desc = false) {

    // SELECT `ContactId`,`FirstName`,`LastName`,`PhoneNumber`,`StreetNumber`,`Street`,`State`,`Country`,`Lat`,`Lng` 
    // FROM contact ORDER BY `LastName`
    let resultData = { status: false };
    try {
        let dbConn = await dbcPool.getConnection();
        const rows = await dbConn.query("SELECT `ContactId`,`FirstName`,`LastName`,`PhoneNumber`,`StreetNumber`,`Street`,`City`,`State`,`Country`,`Lat`,`Lng` FROM contact ORDER BY ? ?", [order, desc ? 'desc' : 'asc']);
        dbConn.end();
        resultData.data = rows;
        resultData.status = true;
        return resultData;

    } catch (err) {
        resultData.message = "could not get data: " + err.message;
    }

}

Contact.delete = async function (ContactId) {

    if (!isNaN(ContactId)) {

        let dbConn = await dbcPool.getConnection();
        const results = await dbConn.query("DELETE FROM `geocontacts`.`contact` WHERE  `ContactId`=?", [ContactId]);
        dbConn.end();
    }
}
// Licensee.filterByDate = async function(date) {

//     // SELECT `licenseeId`,`first`,`last`,expiry from licensee ORDER BY expiry desc

//     let dbConn = await dbcPool.getConnection();
//     const rows = await dbConn.query("SELECT `licenseeId`,`first`,`last`,expiry from licensee WHERE expiry < ?", [date]);
//     dbConn.end();
//     //console.log(rows);
//     return rows;
// }

Contact.insert = async function (data) {
    let gloc = await GeolocatioModel.get(data);
    // console.log(gloc);
    //INSERT INTO `license`.`licensee` (`first`, `last`, `expiry`) VALUES ('bob', 'robertson', '2022-03-18')

    let resultData = { status: false };

    let dbConn = await dbcPool.getConnection();
    try {
        results = await dbConn.query("INSERT INTO `geocontacts`.`contact` (`FirstName`,`LastName`,`PhoneNumber`,`StreetNumber`,`Street`,`City`,`State`,`Country`,`Lat`,`Lng` ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [data.firstName, data.lastName, data.phoneNumber, data.streetNumber, data.Street, data.City, data.State, data.Country, gloc.latitude, gloc.longitude]);
        resultData.message = "data added";
        resultData.status = true;
        resultData.insertId = Number(results.insertId);

    } catch (err) {
        resultData.message = "could not add data: " + err.message;
    }
    dbConn.end();
    //console.log(rows);
    return resultData;
}

Contact.update = async function (data, ContactId) {
    let gloc = await GeolocatioModel.get(data);
    // console.log(gloc);
    //INSERT INTO `license`.`licensee` (`first`, `last`, `expiry`) VALUES ('bob', 'robertson', '2022-03-18')
    ContactId = parseInt(ContactId);
    console.log(typeof ContactId);
    let resultData = { status: false };

    if (!isNaN(ContactId)) {
        let dbConn = await dbcPool.getConnection();
        console.log("ghjgjg");
        try {
            results = await dbConn.query("UPDATE `geocontacts`.`contact` SET `FirstName`=?,`LastName`=?,`PhoneNumber`=?,`StreetNumber`=?,`Street`=?,`City`=?,`State`=?,`Country`=?,`Lat`=?,`Lng`=? WHERE `ContactId`=?",
                [data.firstName, data.lastName, data.phoneNumber, data.streetNumber, data.Street, data.City, data.State, data.Country, gloc.latitude, gloc.longitude, ContactId]);
            resultData.message = "data updated";
            resultData.status = true;
        } catch (err) {
            resultData.message = "could not update data: " + err.message;
        }
        dbConn.end();
    }

    //console.log(rows);
    return resultData;
}

module.exports = Contact;