import React from 'react'
import { Grid } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { AppContainer } from './containers'
import Routes from './components/Routes'
import Navbar from './components/Navbar/Navbar'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

const App = appProps => { 
  return (
  <AppContainer
    {...appProps}
    render={props => {
      return (
        <div>
          <Navbar
            isAuthenticated={props.isAuthenticated}
            currentUsername={props.currentUser}
            profile={props.profile}
            submitLogout={props.submitLogout}
            appModel={props.appModel}
          />
          <Grid fluid={true}>
            <Routes {...props} />
          </Grid>
          <ToastContainer hideProgressBar={true}/>
        </div>
      )
    }}
  />
)}

export default withRouter(App);