import React from 'react'
import PropTypes from 'prop-types'
import { Glyphicon, Nav, NavItem, Navbar as BSNavbar } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { UserInfo } from './UserInfo'

const NavInfo = ({
  announcements,
  isAuthenticated,
  currentUsername,
  profile,
  submitLogout,
  loginPath
}) => {
  return <UserInfo {...{
      isAuthenticated,
      currentUsername,
      profile,
      submitLogout,
      loginPath
    }}></UserInfo>
};

NavInfo.propTypes = {
  isAuthenticated: PropTypes.bool,
  currentUsername: PropTypes.string,
  profile: PropTypes.object,
  submitLogout: PropTypes.func,
  loginPath: PropTypes.string
};

export default NavInfo;