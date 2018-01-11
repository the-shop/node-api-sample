import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
} from "admin-on-rest/lib/mui";

const CreatePage = props => (
  <Create
    {...props}
    title={"Create Post"}
  >
    <SimpleForm>
      <TextInput
        source="title"
        label="Post title"
      />
      <TextInput
        source="content"
        label="Post content"
      />
    </SimpleForm>
  </Create>
);

export default CreatePage;
