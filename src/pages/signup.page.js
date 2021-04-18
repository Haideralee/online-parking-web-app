import { useState } from 'react';
import { Row, Col, Form, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { auth, db } from '../firebase/firebase.index';

// import components
import DefaultButton from '../components/button.component';
import DefaultFormGroup from '../components/form-group.component';

const Signup = () => {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [errorMesg, setErrorMesg] = useState('');
  const history = useHistory();

  // function for registering the user in the app
  const register = async (event) => {
    setErrorMesg('');
    const form = event.currentTarget;
    event.preventDefault();

    // check if all form fields are validated
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setLoading(true);
      setValidated(true);

      // Call Firebase method of Registering the User
      auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const userObj = { ...user };
          delete userObj.password;

          // Add newly registered user in firebase database
          db.child('users/' + auth().currentUser.uid)
            .set({ ...userObj, userId: auth().currentUser.uid })
            .then(() => {
              db.child('users/' + auth().currentUser.uid).once(
                'value',
                (snapshot) => {
                  let obj = snapshot.val();
                  localStorage.setItem('user', JSON.stringify(obj));
                  history.push('/');
                }
              );
            });
        })
        .catch((err) => {
          setLoading(false);
          setErrorMesg(err.message);
        });
    }
  };

  // Set Name, Email, and Password values
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
        <Form validated={validated} onSubmit={register} className="auth-form">
          <DefaultFormGroup
            onChange={getFormValues}
            name="name"
            value={user.name}
            required={true}
            type="text"
            label="Name"
            placeholder="Enter name"
            controlId="formName"
          />
          <DefaultFormGroup
            onChange={getFormValues}
            name="email"
            value={user.email}
            required={true}
            type="email"
            label="Email Address"
            placeholder="Enter email"
            controlId="formEmail"
          />
          <DefaultFormGroup
            onChange={getFormValues}
            name="password"
            value={user.password}
            required={true}
            type="password"
            label="Password"
            placeholder="Enter password"
            controlId="formPassword"
          />
          <Link to="login" className="d-block">
            Already have an Account ?
          </Link>
          <DefaultButton
            disabled={loading}
            loading={loading}
            className="float-right"
            type="submit"
            title="Signup"
          />
          {/* <ToastContainer /> */}
        </Form>
      </Col>
    </Row>
  );
};

export default Signup;
