import React from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Header } from 'semantic-ui-react';
import MadVocab from '../game/MadVocab';
import { getLoggedUser } from '../misc/utils';
import { AppFooter } from './Footer';
import './app.scss';

export default class App extends React.Component {

  logout = () => {
    sessionStorage.removeItem('MadVocab-User');
    window.location.reload()
  }

  render() {
    if (!getLoggedUser()) {
      return (
        <Redirect to={{
          pathname: '/login',
        }} />
      )
    }
    return (
      <>
        <Container className="MainAppContainer">
          <Header as='h1'><span>MADVOCAB</span></Header>
          <MadVocab />
        </Container>
        <AppFooter logout={this.logout}/>
      </>
    );
  }
}

