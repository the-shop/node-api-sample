import fs from "fs";
import { join } from "path";
import FrameworkError from "../src/Framework/Errors/FrameworkError";

import AbstractRegistry from "./Framework/AbstractRegistry";

/**
 * Holds information on templates locations and names
 */
class TemplatesRegistry extends AbstractRegistry {
  /**
   * Register the templates, called on API startup
   */
  register() {
    this.getApplication().log("REGISTER: Templates");

    // Check for templates that come with registered Services
    const servicesDir = join(__dirname, "Services");
    fs.readdirSync(servicesDir)
    // Filter out .js files in Services directory
      .filter(one => one.match(/^(.(?!\.js$))+$/))
      .forEach(dirName => {
        const serviceTemplatesDirectoryPath = join(servicesDir, dirName, "Templates");
        // Check if "Templates" directory exists
        if (fs.existsSync(serviceTemplatesDirectoryPath)) {
          fs.readdirSync(serviceTemplatesDirectoryPath)
            .forEach(file => {
              // Trim file extension from filename
              const templateName = file.replace(/\.[^/.]+$/, "");
              this.set(
                templateName,
                {
                  path: join(serviceTemplatesDirectoryPath, file)
                }
              );
              this.getApplication().log("Registered template: ", templateName);
            });
        }
      });

    // Check for general templates
    const templatesDir = join(__dirname, "Templates");
    if (fs.existsSync(templatesDir)) {
      fs.readdirSync(templatesDir)
        .forEach(file => {
          // Trim file extension from filename
          const templateName = file.replace(/\.[^/.]+$/, "");
          this.set(
            templateName,
            {
              path: join(templatesDir, file)
            }
          );
          this.getApplication().log("Registered template: ", templateName);
        });
    }
  }

  /**
   * Get the template full path from name
   *
   * @param templateName
   */
  getTemplateFullPath(templateName) {
    const registeredTemplate = this.get(templateName);
    if (registeredTemplate.path && registeredTemplate.path.length > 0) {
      return registeredTemplate.path;
    }
    throw new FrameworkError(`Empty path registered for template ${templateName}`);
  }
}

export default TemplatesRegistry;
