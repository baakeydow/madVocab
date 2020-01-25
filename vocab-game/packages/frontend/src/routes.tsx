import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = React.lazy(() => import(/* webpackChunkName: "welcome" */ "./app/App"));
const LoginRegister = React.lazy(() => import(/* webpackChunkName: "login" */ "./login/LoginRegister"));

export default class AppRoutes extends React.Component {
  render() {
    return (
      <Router>
        <React.Suspense fallback={<div>loading...</div>}>
          <Switch>
            <Route
              exact={true}
              path="/"
              component={App}
            />
            <Route
              path="/login"
              component={LoginRegister}
            />
            <Route
              path="/register"
              component={LoginRegister}
            />
          </Switch>
        </React.Suspense>
      </Router>
    );
  }
}
