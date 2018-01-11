import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
} from "admin-on-rest/lib/mui";

const CreatePage = props => (
  <Create
    {...props}
    title={"Create Comment"}
  >
    <SimpleForm>
      <TextInput
        source="owner"
        label="Comment owner"
      />
      <TextInput
        source="content"
        label="Post content"
      />
    </SimpleForm>
  </Create>
);

export default CreatePage;
