/**
 * Filename: requests.js
 * Date: 12/16/2020
 * Author: Ian Dansereau
 * 
 * Functions for making requests with axios
 */

const axios = require('axios').default;

const $GET = async (url, options={}) => {
  const response = await axios.get(url, options)
        .then((res) => res.data)
        .catch((err) => { requestErrorLogger(err) })
  return response;
}

const requestErrorLogger = (err) => {
  console.error(`${err.response.data.error || err}`);
}

module.exports = {
  $GET,
}
