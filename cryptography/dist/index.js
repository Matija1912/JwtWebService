"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  create_hmac_sha256: () => create_hmac_sha256
});
module.exports = __toCommonJS(index_exports);

// src/native.ts
var import_path = __toESM(require("path"));
var { hmac_sha256 } = require("node-gyp-build")(import_path.default.resolve(__dirname, ".."));
var native_default = hmac_sha256;

// src/index.ts
var HmacSha256 = class {
  hmac_sha256;
  data;
  secretKey;
  hash;
  constructor(secretKey, hmac_sha2562) {
    this.hmac_sha256 = hmac_sha2562;
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
  return new HmacSha256(secretKey, native_default);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  create_hmac_sha256
});
