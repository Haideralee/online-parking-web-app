import { useState } from 'react';
import { Row, Col, Form, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { auth, db } from '../firebase/firebase.index';

// imports components
import DefaultFormGroup from '../components/form-group.component';
import DefaultButton from '../components/button.component';

const Login = () => {
  // component state
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMesg, setErrorMesg] = useState('');
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const history = useHistory();

  // function for logging in the user in the app
  const login = (event) => {
    setErrorMesg('');
    const form = event.currentTarget;
    event.preventDefault();

    // check if all form fields are validated
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setLoading(true);
      setValidated(true);

      // Call Firebase method of Logging In the User
      auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          //   Retrieve newly login user in firebase database
          db.child('users/' + auth().currentUser.uid).once(
            'value',
            (snapshot) => {
              let obj = snapshot.val();
              localStorage.setItem('user', JSON.stringify(obj));
              setLoading(false);
              history.push('/');
            }
          );
        })
        .catch((err) => {
          setLoading(false);
          setErrorMesg(err.message);
        });
    }
  };

  // set Email and Password values
  const getFormValues = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={6}>
        {errorMesg.length ? (
          <Row>
            <Col xs={12}>
              <Alert variant="danger">{errorMesg}</Alert>
            </Col>
          </Row>
        ) : (
          ''
        )}
        <Form validated={validated} onSubmit={login}>
          <DefaultFormGroup
            onChange={getFormValues}
            name="email"
            required={true}
            type="email"
            label="Email Address"
            placeholder="Enter email"
            controlId="formEmail"
          />
          <DefaultFormGroup
            onChange={getFormValues}
            name="password"
            required={true}
            type="password"
            label="Password"
            placeholder="Enter password"
            controlId="formPassword"
          />
          <Link to="signup" className="d-block">
            Don't have an Account ?
          </Link>
          <DefaultButton
            disabled={loading}
            loading={loading}
            className="float-right"
            type="submit"
            title="Login"
          />
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
