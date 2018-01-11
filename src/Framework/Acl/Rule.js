class Rule {

  /**
   *
   *
   type	String
   The type of access to apply. One of:
   READ
   WRITE
   EXECUTE


   ---------
   permission
   String
   Type of permission granted. Required.
   One of:
   ALLOW - Explicitly grants access to the resource.
   DENY
   * - default
   *
   *
   *
   Id	String
   Principal identifier. Required.
   The value must be one of:
   A user ID (String|number|any)
   One of the following predefined dynamic roles:
   $everyone - Everyone
   $owner - Owner of the object
   $related - Any user with a relationship to the object
   $authenticated - Authenticated user
   $unauthenticated - Unauthenticated user
   A static role name
   *
   *
   *
   *
   *
   Type	String
   Type of the principal. Required.

   One of:

   Application
   User
   Role
   *
   *
   *
   *
   *
   property	String
   Array of Strings
   Specifies a property/method/relation on a given model. It further constrains where the ACL applies.

   Can be:

   A string, for example: "create"
   An array of strings, for example: ["create", "update"]
   *
   */

  /**
   * @param type
   * @param id
   * @param action
   * @param permission
   * @param queryFilter
   * @param allowedFields
   * @param errorMessage
   */
  constructor(
    type,
    id,
    action,
    permission,
    queryFilter = {},
    allowedFields = [],
    errorMessage = "Action not allowed"
  ) {
    // TODO: validations
    this.type = type;
    this.id = id;
    this.permission = permission;
    this.action = action;
    this.allowedFields = allowedFields;
    this.queryFilter = queryFilter;
    this.errorMessage = errorMessage;
  }

  getErrorMessage() {
    return this.errorMessage;
  }

  getQueryFilter() {
    return this.queryFilter;
  }

  getAllowedFields() {
    return this.allowedFields;
  }
}

export default Rule;