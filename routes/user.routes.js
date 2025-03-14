const express = require('express');
const verifyJWT = require('../middlewares/verifyJWT');
const { getAllUsers } = require('../controllers/user.controller');
const routes = express.Router();

routes.post('/address');
routes.put('/address');
routes.get('/address');
routes.put('/');
routes.get('/', verifyJWT, getAllUsers);
routes.delete('/');

module.exports = routes;
