import UniversalCookies from "universal-cookie";

class Cookies {
  setCookiesContent(content) {
    this.content = content;
    this.cookies = new UniversalCookies(this.content);
  }

  set(name, value, options = { path: "/" }) {
    this.cookies.set(name, value, options);
    return this;
  }

  get(name, options = { path: "/" }) {
    return this.cookies.get(name, options);
  }

  remove(name, options = { path: "/" }) {
    return this.cookies.remove(name, options);
  }

  getAll(options = { path: "/" }) {
    return this.cookies.getAll(options);
  }
}

const cookies = new Cookies();

export default cookies;
