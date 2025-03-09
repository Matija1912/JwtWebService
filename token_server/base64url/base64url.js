const path = require('path');
const { base64urlEncode, base64urlEncodeString } = require(path.join(__dirname, '../../encoding/build/Release/base64urladdon'));

module.exports = {
    base64urlEncode: (input, size) => {
        try{
            return base64urlEncode(input, size);
        }catch(e){
            console.log(e);
        }
    },
    base64urlEncodeString: (input) => {
        try{
            return base64urlEncodeString(input);
        }catch(e){
            console.log(e);
        }
    },
    base64urlDecode: (input) => {
        console.log(input);
    }
}