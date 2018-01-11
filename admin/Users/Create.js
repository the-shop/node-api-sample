import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
} from "admin-on-rest/lib/mui";

const CreatePage = props => (
  <Create
    {...props}
    title={"Create User"}
  >
    <SimpleForm>
      <TextInput
        source="firstName"
        label="User's first name"
      />
      <TextInput
        source="lastName"
        label="User's last name"
      />
      <TextInput
        source="email"
        label="User's description"
      />
      <SelectInput source="role" choices={[
        { id: "admin", name: "Admin" },
        { id: "user", name: "User" },
      ]}
      />
    </SimpleForm>
  </Create>
);

export default CreatePage;
