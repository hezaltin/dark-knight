import React from 'react';
import PropTypes from 'prop-types';
import { Glyphicon, Nav, NavItem, Navbar as BSNavbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const UserInfo = ({
  isAuthenticated,
  currentUsername,
  profile,
  submitLogout,
  loginPath
}) => {
  return isAuthenticated ? <>
    <BSNavbar.Text>
      <Glyphicon glyph="user" /> {profile && profile.name.fullName || currentUsername}
    </BSNavbar.Text>
        <Nav>
          <NavItem
            onClick={e => {
              e.preventDefault();
              submitLogout(currentUsername);
            }}
          >
            Logout
          </NavItem>
        </Nav>
    </> : 
    <Nav pullRight>
      <LinkContainer exact to={loginPath || '/login'}>
        <NavItem>Login</NavItem>
      </LinkContainer>
    </Nav>
}

UserInfo.propTypes = {
  isAuthenticated: PropTypes.bool,
  currentUsername: PropTypes.string,
  profile: PropTypes.object,
  submitLogout: PropTypes.func,
  loginPath: PropTypes.string
};

export default UserInfo;