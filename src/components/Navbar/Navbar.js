import React from 'react';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import MLNavbar from './MLNavbar'
// import DropdownMenu, { NestedDropdownMenu } from 'react-dd-menu';

const brandLink = props => <Link to="/" {...props} />;
const Navbar = props => {
  if (!props.appModel || !props.appModel.navigation) {
    return null
  }
  const navigation = props.appModel.navigation
  const titleLogo = `/logos/${process.env.REACT_APP_ID}-logo.svg` 

  // const navigation = props.appModel.navigation
  return <MLNavbar logo='/logos/dupont.png' logoStyle={{ maxHeight: '22px' }}
    title={process.env.REACT_APP_HEADING} titleLogo={titleLogo} appMode={PushSubscriptionOptions.appModel} {...props}
    brandLink={brandLink}>
    <Nav>
      {
        navigation.map((menuItem, menuIndex) => {
          switch(menuItem['@type']) {
            case 'Nav_Item':
              return <LinkContainer key={`nav-linkContainer-${menuIndex}`} exact to={ menuItem.link }>
                <NavItem>{ menuItem.name }</NavItem>
              </LinkContainer>
            
            case 'Nav_Dropdown':
              return <NavDropdown eventKey="4" title={menuItem.name} id="nav-dropdown" key={`nav-dropdown-${menuIndex}`}>
                {
                  menuItem.items.map((dropdownItem, dropdownIndex) => {
                    switch(dropdownItem['@type']) {
                      case 'Nav_Heading':
                        return <span key={`nav-heading-${menuIndex}.${dropdownIndex}`} style={{fontSize: '10px', marginLeft: '20px', color: '#d9230f'}}>{dropdownItem.name}</span>

                      case 'Menu_Item':
                        return <LinkContainer key={`nav-menuItem-${menuIndex}.${dropdownIndex}`} exact to={dropdownItem.link}>
                          <MenuItem title={dropdownItem.description} eventKey={`${menuIndex}.${dropdownIndex}`} disabled={dropdownItem.disabled}>{dropdownItem.name}</MenuItem>
                        </LinkContainer>

                      case 'Nav_Divider':
                        return <MenuItem key={`menu-divider-${menuIndex}.${dropdownIndex}`} divider />

                      default:
                        return null
                    }
                  })
                }
              </NavDropdown>

            default:
              return null
          }
        })
      }      
    </Nav>
  </MLNavbar>
};

export default Navbar;
