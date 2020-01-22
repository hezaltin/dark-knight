import React from 'react'
import PropTypes from 'prop-types'
import { Navbar as BSNavbar } from 'react-bootstrap'
import TextLoop from "react-text-loop"
import UserInfo from './UserInfo'

const MNLavbar = ({
  logo,
  logoStyle,
  title,
  titleLogo,
  children,
  withoutUser,
  appModel,
  ...props
}) => (
  <BSNavbar fluid={true}>
    <BSNavbar.Header>
      {logo && (
        <BSNavbar.Brand>
          <div className="navbar-left">
            <img
              src={logo} alt="DuPont de Nemours, Inc."
              style={logoStyle || { maxWidth: '100px', maxHeight: '45px' }}
            />
          </div>
        </BSNavbar.Brand>
      )}
      <BSNavbar.Brand>
        <div style={{padding: "8px"}}>
          {titleLogo ?
            <img
              src={titleLogo} alt={title}  
              style={{ maxWidth: '110px', maxHeight: '50px' }}
            /> : <span>{title}</span>
          }
        </div>
      </BSNavbar.Brand>
      <BSNavbar.Toggle />
    </BSNavbar.Header>
    <BSNavbar.Collapse style={{padding: 0}}>
      {children}
      <div className="pull-right">
        <div style={{display: 'inline-block', height: '40px'}}>
          {
            !!appModel.annoucements && <TextLoop interval={10000} mask={true}>
              {
                appModel.annoucements.map((item, index) => (
                  <BSNavbar.Text key={`announcement-${index}`} style={{ width: '360px', overflow: 'hidden', textAlign: 'right'}}>
                    <BSNavbar.Link href={item.link} target={item.external ? '__blank' : null} style={{color: '#d9230f'}}>{item.title}</BSNavbar.Link>
                  </BSNavbar.Text>
                ))
              }
            </TextLoop>
          }
        </div>
        <div className="pull-right">
          {!withoutUser && (
            <UserInfo
              isAuthenticated={props.isAuthenticated}
              currentUsername={props.currentUsername}
              profile={props.profile}
              submitLogout={props.submitLogout}
              loginPath={props.loginPath}
            />
          )}
        </div>
      </div>
    </BSNavbar.Collapse>
  </BSNavbar>
);

const defaultBrandLink = props => <a href="/" {...props} />;

MNLavbar.defaultProps = {
  brandLink: defaultBrandLink
};

MNLavbar.propTypes = {
  title: PropTypes.string,
  brandLink: PropTypes.func,
  withoutUser: PropTypes.bool
};

export default MNLavbar;