const axios = require('axios').default;

const Geolocation = {};

Geolocation.get = async (data) => {
    let loc = await axios.get(`http://api.positionstack.com/v1/forward?access_key=87eb4e8deb04e4757036a6c47dcf6433&query=${data.streetNumber} ${data.Street} ${data.City} ${data.State}`);

    if (loc.data.length == 1) {
        return false;
    }

    return loc.data.data[0];
};

module.exports = Geolocation;