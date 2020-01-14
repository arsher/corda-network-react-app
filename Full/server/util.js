const interfaces = require('os').networkInterfaces();

exports.addresses = function(){
  let addresses = [];
  for(let i in interfaces){
    for(let j in interfaces[i]){
      let address = interfaces[i][j];
      if(address.family === 'IPv4' && !address.internal){
        addresses.push(address.address);
      }
    }
  }
  return addresses;
}
