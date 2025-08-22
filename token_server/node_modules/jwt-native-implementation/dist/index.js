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
    var { sha256: sha2562, hmac_sha256: hmac_sha2562, base64url_encode: base64url_encode2, base64url_decode: base64url_decode2 } = require("node-gyp-build")(import_path.default.resolve(__dirname, ".."));
    var native = {
      sha256: sha2562,
      hmac_sha256: hmac_sha2562,
      base64url_encode: base64url_encode2,
      base64url_decode: base64url_decode2
    };
    module2.exports = native;
  }
});

// src/index.ts
var index_exports = {};
__export(index_exports, {
  crypto: () => crypto,
  decode: () => decode,
  sign: () => sign,
  verify: () => verify
});
module.exports = __toCommonJS(index_exports);
init_cjs_shims();

// src/algorithms.ts
init_cjs_shims();
var import_native = __toESM(require_native());
var Sha256 = class {
  sha256;
  data;
  constructor(sha2562) {
    this.sha256 = sha2562;
    this.data = [];
  }
  update = (data) => {
    this.data.push(Buffer.isBuffer(data) ? data : Buffer.from(data));
    return this;
  };
  digest = (format = "hex") => {
    const buffer = Buffer.concat(this.data);
    this.data = [];
    const hash = this.sha256(buffer, buffer.length);
    return format === "hex" ? hash.toString("hex") : hash;
  };
};

// src/errors.ts
init_cjs_shims();
var InvalidToken = class extends Error {
  constructor(msg) {
    super(msg);
  }
};

// src/index.ts
var import_native2 = __toESM(require_native());
var crypto = class {
  static createSha256() {
    return new Sha256(import_native2.sha256);
  }
};
function decode(data) {
  return (0, import_native2.base64url_decode)(Buffer.from(data), Buffer.from(data).length);
}
function sign(payload, secretOrPrivateKey, options) {
  const iat = Math.floor(Date.now() / 1e3);
  const payloadData = Buffer.from(JSON.stringify({
    ...payload,
    ...options?.noTimestamp ? {} : { iat },
    ...options?.notBefore !== void 0 ? { nbf: options.notBefore + iat } : {},
    ...options?.expiresIn !== void 0 ? { exp: options.expiresIn + iat } : {},
    ...options?.audience !== void 0 ? { aud: options.audience } : {},
    ...options?.issuer !== void 0 ? { iss: options.issuer } : {},
    ...options?.subject !== void 0 ? { sub: options.subject } : {}
  }));
  const headerData = Buffer.from(JSON.stringify({
    ...options?.algorithm !== void 0 ? { alg: options.algorithm } : { alg: "HS256" },
    ...options?.header?.typ !== void 0 ? { typ: options.header.typ } : { typ: "JWT" }
  }));
  if (options === void 0 || options.algorithm === void 0 || options.algorithm === "HS256") {
    const b64u = Buffer.from((0, import_native2.base64url_encode)(headerData, headerData.length).toString() + "." + (0, import_native2.base64url_encode)(payloadData, payloadData.length).toString());
    const secret = Buffer.isBuffer(secretOrPrivateKey) ? secretOrPrivateKey : Buffer.from(secretOrPrivateKey);
    const signature = (0, import_native2.hmac_sha256)(b64u, b64u.length, secret, secret.length);
    return (0, import_native2.base64url_encode)(headerData, headerData.length).toString() + "." + (0, import_native2.base64url_encode)(payloadData, payloadData.length).toString() + "." + (0, import_native2.base64url_encode)(signature, signature.length).toString();
  } else if (options.algorithm === "RS256") {
    return "Asymetric";
  } else {
    throw new InvalidToken("Invalid algorithm.");
  }
}
function verify(token, secretOrPrivateKey, options) {
  const jwtRegex = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
  if (!jwtRegex.test(token)) {
    throw new InvalidToken("Invalid token format.");
  }
  const jwt2 = token.split(".");
  if (options === void 0 || options.algorithm === void 0 || options.algorithm === "HS256") {
    const secret = Buffer.isBuffer(secretOrPrivateKey) ? secretOrPrivateKey : Buffer.from(secretOrPrivateKey);
    const b64u = Buffer.from(jwt2[0] + "." + jwt2[1]);
    const signature = (0, import_native2.base64url_decode)(Buffer.from(jwt2[2]), Buffer.from(jwt2[2]).length);
    const checkSignature = (0, import_native2.hmac_sha256)(b64u, b64u.length, secret, secret.length);
    if (checkSignature.toString("hex") === signature.toString("hex")) {
      const payload = JSON.parse((0, import_native2.base64url_decode)(Buffer.from(jwt2[1]), Buffer.from(jwt2[1]).length).toString());
      if (payload.exp) {
        if (Date.now() / 1e3 > payload.exp) {
          throw new InvalidToken("Token has expired.");
        }
      }
      if (payload.nbf) {
        if (Date.now() / 1e3 < payload.nbf) {
          throw new InvalidToken("Token not valid yet.");
        }
      }
      if (payload.aud) {
        if (!options?.audience) throw new InvalidToken("No audience passed to verify.");
        if (typeof options.audience !== "string" && !Array.isArray(options.audience) && !(options.audience instanceof RegExp)) throw new InvalidToken("Invalid audience type.");
        if (typeof payload.aud === "string") {
          if (typeof options.audience === "string" && payload.aud !== options.audience) throw new InvalidToken("JWT audience claim is not valid.");
          if (Array.isArray(options.audience) && !options.audience.includes(payload.aud)) throw new InvalidToken("JWT audience claim is not valid.");
          if (options.audience instanceof RegExp && !options.audience.test(payload.aud)) throw new InvalidToken("JWT audience claim is not valid.");
        } else if (Array.isArray(payload.aud)) {
          if (typeof options.audience === "string" && !payload.aud.includes(options.audience)) throw new InvalidToken("JWT audience claim is not valid.");
          if (Array.isArray(options.audience) && !options.audience.some((aud) => payload.aud?.includes(aud))) {
            throw new InvalidToken("JWT audience claim is not valid.");
          }
          if (options.audience instanceof RegExp) {
            const regex = options.audience;
            if (!payload.aud.some((a) => regex.test(a))) throw new InvalidToken("JWT audience claim is not valid.");
          }
        }
      }
      return payload;
    } else {
      throw new InvalidToken("Token has been tampered with.");
    }
  } else if (options.algorithm === "RS256") {
    return "Asymetric";
  } else {
    throw new InvalidToken("Invalid algorithm.");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  crypto,
  decode,
  sign,
  verify
});
