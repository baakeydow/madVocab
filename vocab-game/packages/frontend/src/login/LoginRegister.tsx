import React from "react";
import { compose } from 'redux';
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { Redirect, withRouter } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

import './login.scss'

import { getCred, createCred } from './action'

interface LoginProps extends RouteComponentProps {
  onGetCred: (data:any) => Promise<any>
  onCreateCred: (data:any) => Promise<any>
  auth: any
}

interface UserForm {
  username: string
  email: string
  passwd: string
  passwdConf: string
}

interface LoginState {
  current_user: any
  form: UserForm
  error_message: string
}

class LoginRegister extends React.Component<LoginProps, LoginState> {

  constructor(props) {
    super(props);
    this.state = {
      current_user: props.auth.logged_user,
      form: {
        username: '',
        email: '',
        passwd: '',
        passwdConf: ''
      },
      error_message: ''
    };
  }

  handleChange = (event) => {
    this.setState({
      form: {
        username: event.target.name === 'username' ? event.target.value : this.state.form.username,
        email: event.target.name === 'email' ? event.target.value : this.state.form.email,
        passwd: event.target.name === 'passwd' ? event.target.value : this.state.form.passwd,
        passwdConf: event.target.name === 'passwdConf' ? event.target.value : this.state.form.passwdConf
      }
    });
    event.preventDefault();
  }

  handleLogin = (e) => {
    const { email, passwd } = this.state.form;
    if (email && passwd) {
      this.props.onGetCred({data: this.state.form}).then(() => {
        this.props.history.push('/')
      }).catch((err) => {
        this.setState({
          form: {
            username: '',
            email: '',
            passwd: '',
            passwdConf: ''
          },
          error_message: 'Wrong email or password'
        })
      });
    }
    e.preventDefault();
  }

  handleRegister = (e) => {
    const { username, email, passwd, passwdConf } = this.state.form;
    if (username && email && passwd && passwdConf) {
      this.props.onCreateCred({data: this.state.form}).then(() => {
        this.props.history.push('/')
      }).catch(() => {
        this.setState({
          form: {
            username: '',
            email: '',
            passwd: '',
            passwdConf: ''
          },
          error_message: `Failed to register user`
        })
      });
    }
    e.preventDefault();
  }

  getFormRequest = (form: UserForm) => {
    const { username, email, passwd, passwdConf } = form;
    const { location } = this.props;
    return location.pathname === '/login' ?
    <Form onSubmit={this.handleLogin} size='large'>
      <Segment stacked={true}>
        <Form.Input
          fluid={true}
          autoFocus={true}
          value={email}
          onChange={this.handleChange}
          name="email" type="email" icon='user' iconPosition='left' placeholder='E-mail address' />
        <Form.Input
          fluid={true}
          icon='lock'
          iconPosition='left'
          placeholder='Password'
          type='password'
          value={passwd} onChange={this.handleChange} name="passwd"
        />
        <Button type="submit" color='teal' fluid={true} size='large'>
          Play !
        </Button>
      </Segment>
    </Form> :
    <Form onSubmit={this.handleRegister} size='large'>
      <Segment stacked={true}>
        <Form.Input
          fluid={true}
          autoFocus={true}
          value={username}
          onChange={this.handleChange}
          name="username" required={true} icon='universal access' iconPosition='left' placeholder='Nickname' />
        <Form.Input
          fluid={true}
          value={email}
          onChange={this.handleChange}
          name="email" type="email" icon='user' iconPosition='left' placeholder='E-mail address' />
        <Form.Input
          fluid={true}
          icon='lock'
          iconPosition='left'
          placeholder='Password'
          type='password'
          value={passwd} onChange={this.handleChange} name="passwd" />
        <Form.Input
          fluid={true}
          icon='lock'
          iconPosition='left'
          placeholder='Confirm your Password'
          type='password'
          value={passwdConf} onChange={this.handleChange} name="passwdConf" />
        <Button type="submit" color='teal' fluid={true} size='large'>
          Create !
        </Button>
      </Segment>
    </Form>
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { logged_user } = nextProps.auth;
    if (logged_user?.uid !== prevState.current_user?.uid) {
      return { current_user: logged_user }
    }
    return null;
  }

  render() {
    const { auth, location } = this.props;
    if (auth.logged_user?.uid) {
      return (
        <Redirect to={{
          pathname: '/',
        }} />
      )
    }
    const ctaHeader = location.pathname === '/login' ? 'Log in to continue playing' : 'Create your account to start playing !'
    const navMessage = location.pathname === '/login' ? <p>New to us ? <a href='/register'>Sign Up</a></p> : <p>Already registered ?<a href='/login'> - Log In !</a></p>
    return (
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Image size='massive' src={location.pathname === '/login' ? 'resources/images/words_in_space.gif' : 'resources/images/alien.gif' } />
        <Header as='h2' color='teal' textAlign='center'>
          {ctaHeader}
        </Header>
        {this.getFormRequest(this.state.form)}
        {this.state.error_message}
        <Message>
          {navMessage}
        </Message>
      </Grid.Column>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  onGetCred: (loginData) => dispatch(getCred(loginData)),
  onCreateCred: (loginData) => dispatch(createCred(loginData))
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(LoginRegister);
