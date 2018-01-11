import React, { Component } from "react";

import { Admin, Resource } from "admin-on-rest";
import { Delete } from "admin-on-rest/lib/mui";

import routes from "./AORUpdates/routes";
import Login from "./AORUpdates/Login";

import UsersList from "./Users/List";
import UsersEdit from "./Users/Edit";
import UsersCreate from "./Users/Create";

import PostsList from "./Posts/List";
import PostsEdit from "./Posts/Edit";
import PostsCreate from "./Posts/Create";

import CommentsList from "./Comments/List";
import CommentsEdit from "./Comments/Edit";
import CommentsCreate from "./Comments/Create";

import Utility from "./Utility";
import Dashboard from "./Dashboard/Component";
import translationMessages from "./translation";

class AdminPage extends Component {
  render() {
    return (
      <Admin
        title="Admin Dashboard"
        dashboard={Dashboard}
        authClient={Utility.authClient}
        locale="en"
        customRoutes={routes}
        loginPage={Login}
        messages={translationMessages}
        restClient={Utility.jsonServer("/api/v1", Utility.httpClient)}
      >

        <Resource
          name="users"
          options={{ label: "Users" }}
          list={UsersList}
          edit={UsersEdit}
          create={UsersCreate}
          remove={Delete}
        />

        <Resource
          name="posts"
          options={{ label: "Posts" }}
          list={PostsList}
          edit={PostsEdit}
          create={PostsCreate}
          remove={null}
        />

        <Resource
          name="comments"
          options={{ label: "Comments" }}
          list={CommentsList}
          edit={CommentsEdit}
          create={CommentsCreate}
          remove={null}
        />

      </Admin>
    );
  }
}

export default AdminPage;
