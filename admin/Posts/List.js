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

const ListPage = props => (
  <List
    {...props}
    filters={<ListFilter />}
    perPage={10}
    title={"Posts"}
  >
    <Datagrid>
      <TextField source="id" elStyle={idFieldStyle} />
      <TextField
        source="title"
        label="Post title"
        elStyle={fieldStyle}
      />
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
