import React from "react";

import {
  DisabledInput,
  Edit,
  SimpleForm,
  TextInput,
} from "admin-on-rest/lib/mui";
import { required } from "admin-on-rest";

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
        validate={required}
      />

      <TextInput
        source="content"
        label="Post content"
        validate={required}
      />
    </SimpleForm>
  </Edit>
);

export default EditPage;
