import React from "react";
import {
  DisabledInput,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
} from "admin-on-rest/lib/mui";

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
  </Edit>
);

export default EditPage;
