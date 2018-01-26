import crypto from "crypto";

class Randomizer {
  /**
   * Generates random bytes and converts them to hex
   *
   * @param length
   * @returns {*}
   */
  randomHex (length = 32) {
    const buffer = crypto.randomBytes(length);
    return buffer.toString("hex");
  }

  /**
   * Generates random bytes, converts them to hex and then from hex to int.
   *
   * It adds generated int to itself until required length is matched.
   *
   * @param length
   * @returns {Number}
   */
  randomInteger (length = 10) {
    let hex = this.randomHex(length);
    let int = parseInt(hex, 10);

    while (isNaN(int) || int < 1) {
      hex = this.randomHex(length);
      int = parseInt(hex, 10);
    }
    while (int.toString().length < length) {
      if (int !== undefined && !isNaN(int)) {
        int += int;
      }
    }

    const intWithLength = int.toString().slice(0, length);

    return parseInt(intWithLength, 10);
  }

  /**
   * Generates random string based on string length
   *
   * @param length
   * @param charSet
   * @returns {*}
   */
  randomString (length = 32, charSet) {
    charSet = charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < length; i++) {
      const randomPosition = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPosition, randomPosition + 1);
    }
    return randomString;
  }
}

export default Randomizer;
