import React from "react";
import {
  Filter,
  TextInput
} from "admin-on-rest/lib/mui";

const ListFilter = props => (
  <Filter {...props} filterValues={{}}>
    <TextInput label="Search" source="search" alwaysOn />
  </Filter>
);

export default ListFilter;
