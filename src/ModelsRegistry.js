import fs from "fs";
import { join } from "path";

import AbstractRegistry from "./Framework/AbstractRegistry";

class ModelsRegistry extends AbstractRegistry {
  register() {
    this.getApplication().log("REGISTER: Models");

    const servicesDir = join(__dirname, "Services");

    fs.readdirSync(servicesDir)
    // Filter out .js files in Services directory
      .filter(one => one.match(/^(.(?!\.js$))+$/))
      .forEach(dirName => {
        const serviceModelsDirectoryPath = join(servicesDir, dirName, "Models");
        // Check if "Models" directory exists
        if (fs.existsSync(serviceModelsDirectoryPath)) {
          fs.readdirSync(serviceModelsDirectoryPath)
            .forEach(file => {
              require(join(serviceModelsDirectoryPath, file));
              this.getApplication().log("Registered model:", file);
            });
        }
      });
  }
}

export default ModelsRegistry;
