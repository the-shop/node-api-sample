import React from "react";
import {
  Create,
  SimpleForm,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "admin-on-rest/lib/mui";
import { required } from "admin-on-rest";

const CreatePage = props => (
  <Create
    {...props}
    title={"Create Comment"}
  >
    <SimpleForm>
      <ReferenceInput
        label="Owner id"
        source="ownerId"
        reference="users"
        allowEmpty
        validate={required}
      >
        <SelectInput optionText="id" />
      </ReferenceInput>
      <TextInput
        source="content"
        label="Post content"
        validate={required}
      />
    </SimpleForm>
  </Create>
);

export default CreatePage;
