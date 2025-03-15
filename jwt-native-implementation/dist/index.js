"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/tsup/assets/cjs_shims.js
var init_cjs_shims = __esm({
  "node_modules/tsup/assets/cjs_shims.js"() {
    "use strict";
  }
});

// src/native.ts
var require_native = __commonJS({
  "src/native.ts"(exports2, module2) {
    "use strict";
    init_cjs_shims();
    var import_path = __toESM(require("path"));
    var { hmac_sha256, base64url_encode, base64url_decode } = require("node-gyp-build")(import_path.default.resolve(__dirname, ".."));
    var jwt2 = {
      hmac_sha256,
      base64url_encode,
      base64url_decode
    };
    module2.exports = jwt2;
  }
});

// src/index.ts
var index_exports = {};
__export(index_exports, {
  base64urlDecode: () => base64urlDecode,
  base64urlEncode: () => base64urlEncode,
  create_hmac_sha256: () => create_hmac_sha256
});
module.exports = __toCommonJS(index_exports);
init_cjs_shims();
var import_native = __toESM(require_native());
var HmacSha256 = class {
  hmac_sha256;
  data;
  secretKey;
  hash;
  constructor(secretKey, hmac_sha256) {
    this.hmac_sha256 = hmac_sha256;
    this.data = null;
    this.secretKey = secretKey;
    this.hash = null;
  }
  update = (data) => {
    if (!this.data) {
      this.data = data;
    } else {
      this.data += data;
    }
    return this;
  };
  digest = (format) => {
    if (this.data) {
      const buffer = Buffer.from(this.data);
      const secretKeyBuffer = Buffer.from(this.secretKey);
      if (format.toLowerCase() == "hex") {
        try {
          return this.hmac_sha256(buffer, buffer.length, secretKeyBuffer, secretKeyBuffer.length).toString("hex");
        } catch (e) {
          console.log(e);
        }
      }
      if (format.toLowerCase() == "raw" || format.toLowerCase() == "bin" || format.toLowerCase() == "binary") {
        return this.hmac_sha256(buffer, buffer.length, secretKeyBuffer, secretKeyBuffer.length);
      }
    }
  };
};
function create_hmac_sha256(secretKey) {
  return new HmacSha256(secretKey, import_native.default.hmac_sha256);
}
function base64urlEncode(input) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  try {
    return import_native.default.base64url_encode(buffer, buffer.length);
  } catch (e) {
    console.log(e);
  }
}
function base64urlDecode(input) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  try {
    return import_native.default.base64url_decode(buffer, buffer.length);
  } catch (e) {
    console.log(e);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  base64urlDecode,
  base64urlEncode,
  create_hmac_sha256
});
