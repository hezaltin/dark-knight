import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, FormControl, Button , Alert} from 'react-bootstrap'
import defaultAPI from '../../redux/user/api';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      alert: false,
      alertMessage: ''
    }
    this.handleLoginSubmission = this.handleLoginSubmission.bind(this)
    this.setUsername = this.setUsername.bind(this)
    this.setPassword = this.setPassword.bind(this)
  }

  handleLoginSubmission(e) {
    e.preventDefault()
    this.props.submitLogin(this.state.username, this.state.password)
    defaultAPI.login(this.state.username, this.state.password)
    .then(res => {
      if(res.ok == true){
        this.setState({alert: false})
      }else{
        this.setState({alert: true})
      }
      return res.json()
    })
    .then(data => this.setState({alertMessage: data['message']}))
  }

  setUsername(e) {
    this.setState({ username: e.target.value })
  }

  setPassword(e) {
    this.setState({ password: e.target.value })
  }

  render() {
    return (
      <div style={{}}>
        <form onSubmit={this.handleLoginSubmission}>
          <FormGroup>
            <FormControl
              type="text"
              name="username"
              placeholder="Username"
              autoComplete="off"
              onChange={this.setUsername}
            />
          </FormGroup>
          <FormGroup>
            <FormControl
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.setPassword}
            />
          </FormGroup>
          <Button type="submit" bsStyle="primary" className="btn-raised">
            Log in
          </Button>

        </form>

        {this.state.alert ? <Alert bsStyle="danger">{this.state.alertMessage}</Alert> : null}
      </div>
    )
  }
}

Login.propTypes = {
  submitLogin: PropTypes.func
}

export default Login