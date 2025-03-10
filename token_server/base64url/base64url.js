const path = require('path');
const { base64urlEncode, base64urlDecode } = require(path.join(__dirname, '../../encoding/build/Release/base64urladdon'));

module.exports = {
    base64urlEncode: (input) => {
        //Implementacija u C-u prima samo binarni input (uint8_t*). Ovdje osiguramo da je ulaz uvijek Buffer (binarni).
        if(!Buffer.isBuffer(input)){
            //Zamjena \0 charactera sa \\0
            if(typeof(input) == 'string'){
                input = input.replace('\0', '\\0');
                input = Buffer.from(input, 'utf-8');
            }
        }
        buffer = Buffer.isBuffer(input) ? input : Buffer.from(input, 'utf-8');
        try{
            return base64urlEncode(buffer, buffer.length);
        }catch(e){
            console.log(e);
        }
    },
    base64urlDecode: (input) => {
        //Implementacija u C-u prima samo binarni input (uint8_t*). Ovdje osiguramo da je ulaz uvijek Buffer (binarni).
        if(!Buffer.isBuffer(input)){
            //Zamjena \0 charactera sa \\0
            if(typeof(input) == 'string'){
                input = input.replace('\0', '\\0');
                input = Buffer.from(input, 'utf-8');
            }
        }
        buffer = Buffer.isBuffer(input) ? input : Buffer.from(input, 'utf-8');
        try{
            return base64urlDecode(buffer, buffer.length);
        }catch(e){
            console.log(e);
        }
    }
}