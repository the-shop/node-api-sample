import fs from "fs";
import { join } from "path";

import AbstractRegistry from "./Framework/AbstractRegistry";

class AdaptersRegistry extends AbstractRegistry {
  register() {
    this.getApplication().log("REGISTER: Adapters");

    const servicesDir = join(__dirname, "Services");
    fs.readdirSync(servicesDir)
    // Filter out .js files in Services directory
      .filter(one => one.match(/^(.(?!\.js$))+$/))
      .forEach(dirName => {
        const serviceAdaptersDirectoryPath = join(servicesDir, dirName, "Adapters");
        // Check if "Adapters" directory exists
        if (fs.existsSync(serviceAdaptersDirectoryPath)) {
          fs.readdirSync(serviceAdaptersDirectoryPath)
            .forEach(file => {
              const className = require(join(serviceAdaptersDirectoryPath, file)).default;
              const instance = new className();
              instance.setApplication(this.getApplication());
              this.set(instance.constructor.name, instance);
            });
        }
      });
  }
}

export default AdaptersRegistry;
