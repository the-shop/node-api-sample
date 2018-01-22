import React from "react";
import {
  Datagrid,
  EditButton,
  List,
  ReferenceField,
  TextField,
} from "admin-on-rest/lib/mui";

import ListFilter from "./ListFilter";

const idFieldStyle = {
  maxWidth: "6rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "inline-block"
};

const fieldStyle = {
  maxWidth: "6rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "inline-block"
};

const ListPage = props => (
  <List
    {...props}
    filters={<ListFilter />}
    perPage={10}
    title={"Comments"}
  >
    <Datagrid>
      <TextField source="id" elStyle={idFieldStyle} />
      <ReferenceField
        label="Owner id"
        source="ownerId"
        reference="users"
      >
        <TextField source="id" />
      </ReferenceField>
      <TextField
        source="content"
        label="Post content"
        elStyle={fieldStyle}
      />
      <EditButton />
    </Datagrid>
  </List>
);

export default ListPage;
