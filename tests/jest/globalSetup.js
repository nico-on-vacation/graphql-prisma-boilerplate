require('babel-register') 
//babel register is required as the file would not know 
// what to do with the other import statements in the babel 
// parsed file as globalSetup/-teardown are not run through 
// babel (because jest chose to idk why)
require('@babel/polyfill/noConflict')
const server = require('../../src/server').default

module.exports = async() => {
    global.httpServer = await server.start({port:4000}) //global so teardown also has access to the instance that comes back from starting the server
}