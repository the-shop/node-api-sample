import fs from "fs";
import { join } from "path";

import AbstractRegistry from "./Framework/AbstractRegistry";

class ServicesRegistry extends AbstractRegistry {
  register () {
    this.getApplication().log("REGISTER: Services");
    const directory = join(__dirname, "./Services");
    fs.readdirSync(directory)
      // Filter out .js files in Services directory
      .filter(one => one.match(/^(.(?!\.js$))+$/))
      .forEach(file => {
        const className = require(join(directory, file, "index.js")).default;
        const instance = new className();

        // Set reference to application
        instance.setApplication(this.getApplication());

        // Bootstrap the service instance
        instance.bootstrap();

        this.set(file, instance);
      });
  }
}

export default ServicesRegistry;
