const db = require('../database/postgres');
const express = require('express');
const app = express();

// plan to move socket stuff to this file

const configureSocket = socket => {

  return socket;
}

module.exports.configureSocket = configureSocket;
