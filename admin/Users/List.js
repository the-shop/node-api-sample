import React from "react";
import {
  Datagrid,
  EditButton,
  List,
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

const enumFieldStyle = {
  maxWidth: "6rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  display: "inline-block",
  textTransform: "uppercase"
};

const ListPage = props => (
  <List
    {...props}
    filters={<ListFilter />}
    perPage={10}
    title={"Users"}
  >
    <Datagrid>
      <TextField source="id" elStyle={idFieldStyle} />
      <TextField
        source="firstName"
        label="User's first name"
        elStyle={fieldStyle}
      />
      <TextField
        source="lastName"
        label="User's last name"
        elStyle={fieldStyle}
      />
      <TextField
        source="email"
        label="User's description"
        elStyle={fieldStyle}
      />
      <TextField
        source="role"
        label="User's role"
        elStyle={enumFieldStyle}
      />
      <EditButton />
    </Datagrid>
  </List>
);

export default ListPage;
