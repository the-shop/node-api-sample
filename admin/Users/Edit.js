import React from "react";

import {
  DisabledInput,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
} from "admin-on-rest/lib/mui";
import { required } from "admin-on-rest";

const EditPage = props => (
  <Edit
    title={"Edit User"}
    {...props}
  >
    <SimpleForm>
      <DisabledInput source="id" /> 

      <TextInput
        source="firstName"
        label="User's first name"
        validate={required}
      />

      <TextInput
        source="lastName"
        label="User's last name"
        validate={required}
      />

      <TextInput
        source="email"
        label="User's description"
        validate={required}
      />

      <SelectInput source="role" choices={[
        { id: "admin", name: "Admin" },
        { id: "user", name: "User" },
      ]}
        validate={required}
      />
    </SimpleForm>
  </Edit>
);

export default EditPage;
