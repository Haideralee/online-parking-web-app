import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import AppContext from '../provider/app.provider';
import { Table } from 'react-bootstrap';

// imports components
import DefaultButton from '../components/button.component';
import {
  cancelBookedSlot,
  getBookedSlotByUserId,
} from '../firebase/firebase.methods';

const BookedSlots = (props) => {
  const { selectedUser } = props.location.state || {};
  const history = useHistory();
  const [bookedSlots, setBookedSlots] = useState(null);

  // useEffect
  useEffect(() => {
    if (selectedUser) {
      fetchBookedSlots();
    }
  }, []);

  const fetchBookedSlots = () => {
    getBookedSlotByUserId({
      userId: selectedUser.userId,
      callback: (slots) => {
        setBookedSlots({ ...slots });
      },
    });
  };

  const renderBookedSlots = () => {
    return (
      <div className="bg-white mt-5">
        <Table striped bordered hover responsive className="mb-0">
          <thead>
            <tr>
              <th>#Index</th>
              <th>Date</th>
              <th>Starting Time</th>
              <th>Ending Time</th>
              <th>Location</th>
              <th>Slot</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookedSlots
              ? Object.keys(bookedSlots).map(
                  (bookedSlotId, bookedSlotIndex) => {
                    let loading = false;
                    return (
                      <tr key={bookedSlotId}>
                        <td>{bookedSlotIndex + 1}</td>
                        <td>{bookedSlots[bookedSlotId].date}</td>
                        <td>
                          {moment
                            .utc(bookedSlots[bookedSlotId].startingTime)
                            .format('HH:mm')}
                        </td>
                        <td>
                          {moment
                            .utc(bookedSlots[bookedSlotId].endingTime)
                            .format('HH:mm')}
                        </td>
                        <td className="text-capitalize">
                          {bookedSlots[bookedSlotId].locationId
                            .split('_')
                            .join(' ')}
                        </td>
                        <td>Slot #{bookedSlots[bookedSlotId].slotId}</td>
                        <td className="">
                          {!bookedSlots[bookedSlotId].cancel ? (
                            <DefaultButton
                              title="Cancel Booking"
                              variant="danger"
                              loading={loading}
                              onClick={() => {
                                loading = true;
                                cancelBookedSlot({
                                  bookedSlotId,
                                  callback: () => {
                                    loading = false;
                                  },
                                });
                              }}
                            />
                          ) : (
                            <DefaultButton
                              title="Booking Canceled"
                              variant="outline-secondary"
                              disabled={true}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  }
                )
              : null}
          </tbody>
        </Table>
      </div>
    );
  };

  if (!selectedUser) {
    history.push('/');
  }

  return (
    <div>
      <h1>Booked Slots list</h1>
      {renderBookedSlots()}
    </div>
  );
};

export default BookedSlots;
