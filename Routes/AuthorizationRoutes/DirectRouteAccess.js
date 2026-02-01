let express = require('express');
const {DirectAccess}=require('../../Controller/DirectRouteController');
let DirectRouteAccess = express.Router();

DirectRouteAccess.get('/DirectAccessResources', DirectAccess);

module.exports = DirectRouteAccess;