import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import queryString from 'query-string'
import Entry from "./EditView/EditView"
import Manufacturers from './HomeView/Manufacturers'
import Profile from './HomeView/Profile'
import CatchAll from './CatchAll/CatchAll'
import Team from './AboutView/Team'
import Technology from './AboutView/Technology'
import BusinessValue from './AboutView/BusinessValue'

import {
  SearchContainer,
  DetailContainer,
  CreateContainer,
  LoginContainer,
  EditContainer,
  HomeContainer,
  AboutContainer,
} from '../containers';

const PrivateRoute = ({
  component: Component,
  render,
  isAuthenticated,
  ...rest
}) => {
  // console.log({isAuthenticated})
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          render ? (
            render(props)
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

const Routes = ({ isAuthenticated }, ...rest) => {
  return (
    <Switch>
      <Route
        exact
        path="/login"
        render={props => {
          return isAuthenticated ? (
            <Redirect
              to={(props.location.state && props.location.state.from) || '/'}
            />
          ) : (
            <LoginContainer />
          );
        }}
      />
      <Route exact path = "/" 
        render={() => <Redirect to="/home" />}
      ></Route>

      <PrivateRoute 
        exact path = "/home"
        isAuthenticated={isAuthenticated}
        render={() => <HomeContainer/>}
      ></PrivateRoute>
 
      <PrivateRoute 
        exact path = "/contribute/new-entry/:type"
        isAuthenticated={isAuthenticated}
        render={(props) => <CreateContainer {...props}/>}
      >
      </PrivateRoute>
      <PrivateRoute 
        exact path = "/contribute/update-entries/nbd"
        isAuthenticated={isAuthenticated}
        render={(props) => {
          const uri = 
            (props.location.state && props.location.state.uri) ||
            queryString.parse(props.location.search).uri
          return <EditContainer uri={uri} {...props}/>
        }}
      >
      </PrivateRoute>

      <PrivateRoute 
        exact path = "/edit"
        isAuthenticated={isAuthenticated}
        render={(props) => {
          const type = 
            (props.location.state && props.location.state.type) ||
            queryString.parse(props.location.search).type
          const uri = 
            (props.location.state && props.location.state.uri) ||
            queryString.parse(props.location.search).uri
          return <EditContainer type={type} uri={uri} view='group--profile' {...props}/>
        }}
      >
      </PrivateRoute>

      {/* <PrivateRoute 
        isAuthenticated={isAuthenticated}
        exact 
        path = "/about"
        render={(props) => <AboutContainer {...props}/>}
      >
      </PrivateRoute> */}

      {/* <PrivateRoute 
        isAuthenticated={isAuthenticated}
        exact 
        path = "/about"
        render={(props) => <AboutContainer {...props}>
            <Route exact path="/about/team" render={(props) => <Team {...props}/>} />
            <Route exact path="/about/technology" render={(props) => <Technology {...props}/>} />
            <Route exact path="/about/business" render={(props) => <BusinessValue {...props}/>} />
          </AboutContainer>}
      >
      </PrivateRoute> */}

      <PrivateRoute
        isAuthenticated={isAuthenticated}
        exact
        path="/search/:type(customer-related|product-compliance|technical-reports|technical-documents|nbd|insight|compas|external-content|internal-content)"
        render={(props) => {
          const scope = queryString.parse(props.location.search).scope
          const message = queryString.parse(props.location.search).message
          return <SearchContainer scope={scope} message={message} {...props} />
        }}
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        exact
        path="/detail"
        render={props => {
          // Prefer to get uri from the state
          const uri =
            (props.location.state && props.location.state.uri) ||
            queryString.parse(props.location.search).uri
          const type = (props.location.state && props.location.state.type) ||
          queryString.parse(props.location.search).type
          return <DetailContainer uri={uri} type={type} />
        }}
      />

      <AboutContainer>
        <PrivateRoute isAuthenticated={isAuthenticated} exact 
          path="/about/team" render={(props) => <Team {...props}/>} 
        />
        <PrivateRoute isAuthenticated={isAuthenticated} exact 
          path="/about/technology" render={(props) => <Technology {...props}/>} 
        />
        <PrivateRoute isAuthenticated={isAuthenticated} exact 
          path="/about/business-value" render={(props) => <BusinessValue {...props}/>} 
        />
      </AboutContainer>

      <PrivateRoute 
        isAuthenticated={isAuthenticated}
        exact 
        path = "/predict/compliance-status"
        render={(props) => <BusinessValue {...props}/>}
      >
      </PrivateRoute>

      {/* <PrivateRoute 
        isAuthenticated={isAuthenticated}
        exact 
        path = "/about/technology"
        render={(props) => <Technology {...props}/>}
      >
      </PrivateRoute>

      <PrivateRoute 
        isAuthenticated={isAuthenticated}
        exact 
        path = "/about/business-value"
        render={(props) => <BusinessValue {...props}/>}
      >
      </PrivateRoute> */}

      {/* <PrivateRoute 
        exact path = "/entry/templates"
        isAuthenticated={isAuthenticated}
        render={() => <Template/>}
      >
      </PrivateRoute>

      <PrivateRoute 
        exact path = "/entry/product"
        isAuthenticated={isAuthenticated}
        render={() => <Product/>}
      ></PrivateRoute> */}


      <PrivateRoute
        isAuthenticated={isAuthenticated}
        exact
        path="/create"
        render={() => <CreateContainer redirectPath="/detail" />}
      />
      <PrivateRoute 
        isAuthenticated={isAuthenticated}
        render={() => <CatchAll/>}
      >
      </PrivateRoute>
    </Switch>
  );
};

export default Routes;
