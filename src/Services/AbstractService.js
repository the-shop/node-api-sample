import fs from "fs";
import { join } from "path";
import FrameworkError from "../Framework/Errors/FrameworkError";

class AbstractService {
  constructor () {
    this.name = this.constructor.name;
    if (this.name === "AbstractService") {
      throw new FrameworkError("Can't instantiate AbstractService");
    }

    this.applicationInstance = null;
  }

  // This is called upon instantiation
  bootstrap () {
    return true;
  }

  getRoutesMapping () {
    const mapping = {};
    const directory = join(__dirname, "./", this.constructor.name, "Actions");
    fs.readdirSync(directory)
      .forEach(file => {
        const className = require(join(directory, file)).default;
        const instance = new className();
        instance.setApplication(this.getApplication());
        if (mapping[instance.constructor.PATH] === undefined) {
          mapping[instance.constructor.PATH] = {};
        }
        mapping[instance.constructor.PATH][instance.constructor.VERB] = instance;
      });

    return mapping;
  }

  setApplication (applicationInstance) {
    this.applicationInstance = applicationInstance;
  }

  getApplication () {
    return this.applicationInstance;
  }
}

export default AbstractService;
