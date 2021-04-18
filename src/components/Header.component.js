import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { auth } from '../firebase/firebase.index';
import AppContext from '../provider/app.provider';

const Header = () => {
  const { user } = useContext(AppContext);
  const history = useHistory();

  const logout = () => {
    auth()
      .signOut()
      .then(
        function () {
          // Sign-out successful.
        },
        function (error) {
          // An error happened.
        }
      );
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand
        className="clickable-item cursor-pointer"
        onClick={() => history.push('/')}
      >
        Parking
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />

      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          {user && user.role === 'user' ? (
            <Nav.Link
              onClick={() => {
                history.push({
                  pathname: '/booked-slots',
                  state: { selectedUser: user },
                });
              }}
            >
              Booked Slots
            </Nav.Link>
          ) : (
            ''
          )}

          {user && user.role === 'user' ? (
            <Nav.Link
              onClick={() => {
                history.push({
                  pathname: '/feedbacks',
                  state: { selectedUser: user },
                });
              }}
            >
              Feedbacks
            </Nav.Link>
          ) : (
            ''
          )}
        </Nav>
        <Nav>
          <Navbar.Text>
            Signed in as:{' '}
            <a
              href="#user"
              onClick={(e) => {
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
              }}
            >
              {user ? user.name : ''}
            </a>
          </Navbar.Text>
          <Nav.Link className="clickable-item" onClick={logout}>
            Logout
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
