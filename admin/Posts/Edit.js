import React from "react";
import {
  DisabledInput,
  Edit,
  SimpleForm,
  TextInput,
} from "admin-on-rest/lib/mui";

const EditPage = props => (
  <Edit
    title={"Edit Post"}
    {...props}
  >
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput
        source="title"
        label="Post title"
      />
      <TextInput
        source="content"
        label="Post content"
      />
    </SimpleForm>
  </Edit>
);

export default EditPage;
