import crypto from "crypto";

class Crypto {
  static md5 (value) {
    const md5sum = crypto.createHash("md5");
    return md5sum.update(value).digest("hex");
  }
}

export default Crypto;
