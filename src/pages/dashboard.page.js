import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import AppContext from '../provider/app.provider';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { getAllUsers } from '../firebase/firebase.methods';
// imports components
import DefaultButton from '../components/button.component';

const PARKING_AREAS = [
  {
    name: 'Lucky One',
    id: 'lucky_one',
    cover: 'https://live.staticflickr.com/1774/29040002247_ebe1a201d7_b.jpg',
  },
  {
    name: 'Parking Plaza',
    id: 'parking_plaza',
    cover: 'https://mapio.net/images-p/40084457.jpg',
  },
  {
    name: 'Aga Khan Hospital',
    id: 'aga_khan_hospital',
    cover: 'https://i.dawn.com/primary/2019/08/5d479c9ba433e.jpg',
  },
];

const Dashboard = () => {
  const store = useContext(AppContext);
  const history = useHistory();
  console.log('store : ', store);

  const [users, setUsers] = useState(null);

  useEffect(() => {
    if (store.user && store.user.role === 'admin') {
      fetchAllUsers();
    }
  }, []);

  const fetchAllUsers = () => {
    getAllUsers({
      callback: (users) => {
        console.log('users : ', users);
        setUsers({ ...users });
      },
    });
  };

  const parkingAreas = () => {
    return (
      <Row className="justify-content-center mt-5">
        {PARKING_AREAS.map((item) => {
          return (
            <Col xs={12} md={4} className="mb-2" key={item.id}>
              <Card className="bg-dark">
                <Card.Img variant="top" src={item.cover} />
                <Card.Body>
                  <Card.Title className="text-center">{item.name}</Card.Title>
                  <DefaultButton
                    block
                    variant="outline-secondary"
                    type="button"
                    title="Parking"
                    onClick={() =>
                      history.push({
                        pathname: `parking/${item.id}`,
                        state: { selectedParking: item },
                      })
                    }
                  />
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  const renderUsers = () => {
    return (
      <div className="bg-white mt-5">
        <Table striped bordered hover responsive className="mb-0">
          <thead>
            <tr>
              <th>#index</th>
              <th>Name</th>
              <th>Email</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              Object.keys(users).map((userId, userIndex) => (
                <tr key={userId} className="clickable-item">
                  <td>{userIndex + 1}</td>
                  <td>{users[userId].name}</td>
                  <td>{users[userId].email}</td>
                  <td>
                    <DefaultButton
                      variant="secondary"
                      type="button"
                      title="View Bookings"
                      onClick={(e) =>
                        history.push({
                          pathname: 'booked-slots',
                          state: { selectedUser: users[userId] },
                        })
                      }
                    />{' '}
                    <DefaultButton
                      variant="secondary"
                      type="button"
                      title="View Feedbacks"
                      onClick={(e) => {
                        history.push({
                          pathname: 'feedbacks',
                          state: { selectedUser: users[userId] },
                        });
                      }}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    );
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {store.user && store.user.role === 'user' ? parkingAreas() : ''}
      {store.user && store.user.role === 'admin' ? renderUsers() : ''}
    </div>
  );
};

export default Dashboard;
