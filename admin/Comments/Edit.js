import React from "react";
import {
  DisabledInput,
  Edit,
  SimpleForm,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "admin-on-rest/lib/mui";
import { required } from "admin-on-rest";

const EditPage = props => (
  <Edit
    title={"Edit Comment"}
    {...props}
  >
    <SimpleForm>
      <DisabledInput source="id" />
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
  </Edit>
);

export default EditPage;
