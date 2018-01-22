import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
} from "admin-on-rest/lib/mui";
import { required } from "admin-on-rest";

const CreatePage = props => (
  <Create
    {...props}
    title={"Create Post"}
  >
    <SimpleForm>
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
  </Create>
);

export default CreatePage;
