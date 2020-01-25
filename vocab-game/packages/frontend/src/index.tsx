import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { hot } from "react-hot-loader";
import AppRoutes from './routes';
import Settings from "./models/Settings";
import store from "./store";
import "semantic-ui-css/semantic.min.css";
import './reset.css';

const HotRoutes = hot(module)(AppRoutes);

interface IBuilderOptions {
  backendUrl: string;
}

export class Builder {
  readonly container: HTMLElement;
  constructor(container: HTMLElement, options: IBuilderOptions) {
    this.container = container;
    // Initialize settings
    if (options.backendUrl) {
      console.log(options.backendUrl);
      console.log(process.env.NODE_ENV);
      Settings.setBackend(options.backendUrl);
    } else {
      throw new Error("Missing backend URL");
    }
  }
  public render(): HTMLElement {
    ReactDOM.render(
      <Provider store={store}>
        <HotRoutes />
      </Provider>,
      this.container
    );

    return this.container;
  }
}