import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import AppContext from './provider/app.provider';
import { auth, db } from './firebase/firebase.index';

// import styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// imports components
import DefaultLoader from './components/loader.component';
import Header from './components/Header.component';
import PublicRoute from './routes/public.route';
import PrivateRoute from './routes/protected.route';
import Login from './pages/login.page';
import Signup from './pages/signup.page';
import Dashboard from './pages/dashboard.page';
import Parking from './pages/parking.page';
import BookedSlots from './pages/bookedSlots.page';
import Feedbacks from './pages/feedbacks.page';

const App = () => {
  // component state
  const [user, setUser] = useState(null);
  const [authentication, setAuthState] = useState({
    authenticated: false,
    initializing: true,
  });

  //
  const onAuthStateChange = () => {
    auth().onAuthStateChanged((user) => {
      // Check if the user is authenticated or not
      if (user) {
        setAuthState({
          authenticated: true,
          initializing: false,
        });

        db.child('users/' + user.uid)
          .once('value', (snapshot) => {
            let obj = snapshot.val();
            setUser(obj);
          })
          .then(() => {});
      } else {
        setAuthState({
          authenticated: false,
          initializing: false,
        });
      }
    });
  };

  // useEffect
  useEffect(() => {
    onAuthStateChange();
  }, []);

  // Show loading while checking authorization of User
  if (authentication.initializing) {
    return <DefaultLoader className="app-loader" size="lg" />;
  }

  if (authentication.authenticated && !user) {
    return <DefaultLoader className="app-loader" size="lg" />;
  }

  return (
    //value={{ user, locations, slots, }}
    <AppContext.Provider value={{ user }}>
      {/* switch allows switching which components render.  */}
      <BrowserRouter>
        {authentication.authenticated && <Header />}
        <Container fluid className="py-5">
          <Row>
            <Col>
              <Switch>
                {/* private routes only for authenticated users  */}
                <PrivateRoute
                  path="/"
                  authenticated={authentication.authenticated}
                  exact={true}
                  component={Dashboard}
                />
                <PrivateRoute
                  path="/parking/:id"
                  authenticated={authentication.authenticated}
                  exact={true}
                  component={Parking}
                />
                <PrivateRoute
                  path="/booked-slots"
                  authenticated={authentication.authenticated}
                  exact={true}
                  component={BookedSlots}
                />

                <PrivateRoute
                  path="/feedbacks"
                  authenticated={authentication.authenticated}
                  exact={true}
                  component={Feedbacks}
                />

                {/* public routes for everyone  */}
                <PublicRoute
                  path="/login"
                  authenticated={authentication.authenticated}
                  exact={true}
                  component={Login}
                />
                <PublicRoute
                  path="/signup"
                  authenticated={authentication.authenticated}
                  exact={true}
                  component={Signup}
                />
              </Switch>
            </Col>
          </Row>
        </Container>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
