const { arriveData } = require('../data')
module.exports = (server /* , options */ ) => {
    // handle http request
    server.on('request', (req, res) => {
        // do something
        arriveData(req, res)

    });

    // handle websocket request
    server.on('upgrade', (req, socket) => {
        // do something
        req.passThrough();
    });

    // handle tunnel request
    server.on('connect', (req, socket) => {
        // do something
        req.passThrough();
    });
};