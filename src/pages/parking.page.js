import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, ListGroup, Form } from 'react-bootstrap';
import moment from 'moment';
import AppContext from '../provider/app.provider';
import {
  bookingSlot,
  getAllBookedSlots,
  cancelBookedSlot,
} from '../firebase/firebase.methods';

// imports components
import DefaultFormGroup from '../components/form-group.component';
import DefaultButton from '../components/button.component';
import {
  dateTimeComparison,
  sendEmailAfterBooking,
} from '../utils/helper.util';

const PARKING_SLOTS = [];
for (let i = 1; i <= 12; i++) {
  PARKING_SLOTS.push({
    slotId: i,
    name: i,
    initial: true,
    booked: false,
    available: false,
    loading: false,
    userId: null,
  });
}

const Parking = (props) => {
  const store = useContext(AppContext);
  const { selectedParking } = props.location.state || {};
  const history = useHistory();

  // state
  const [validated, setValidated] = useState(false);
  const [slots, setSlots] = useState([...PARKING_SLOTS]);
  const [bookings, setBookings] = useState(null);
  const [booking, setBooking] = useState({
    date: '',
    startingTime: '',
    endingTime: '',
  });

  // Retrieve All the bookings of Sepecific Location
  const fetchAllBookedSlots = () => {
    getAllBookedSlots({
      locationId: selectedParking.id,
      callback: (allBookedSlots) => {
        if (allBookedSlots) {
          // filtered booked slots, remove all cancel booked slots
          let bookedSlots = {};
          for (const property in allBookedSlots) {
            if (!allBookedSlots[property].cancel) {
              bookedSlots[property] = allBookedSlots[property];
            }
          }

          if (booking.date && booking.startingTime && booking.endingTime) {
            const updateSlots = slots.map((slot) => {
              let bookingNotAvailable = false;
              let userId = null;

              for (const property in bookedSlots) {
                let bookedDate = bookedSlots[property].date;
                let bookedSlotId = bookedSlots[property].slotId;

                const {
                  startTimeSameCompare,
                  endTimeSameCompare,
                  startTimeToCompare,
                  endTimeToCompare,
                } = dateTimeComparison({
                  bookedSlot: bookedSlots[property],
                  booking,
                });

                if (
                  !bookedSlots[property].cancel &&
                  bookedSlotId === slot.slotId &&
                  bookedDate === booking.date &&
                  (startTimeSameCompare ||
                    endTimeSameCompare ||
                    startTimeToCompare ||
                    endTimeToCompare)
                ) {
                  bookingNotAvailable = true;
                  userId = bookedSlots[property].userId;
                  break;
                }
              }

              return {
                ...slot,
                initial: false,
                available: bookingNotAvailable ? false : true,
                booked: bookingNotAvailable,
                userId: userId ? userId : null,
              };
            });

            // update component state
            setSlots(updateSlots);
          }

          // update component state
          setBookings(allBookedSlots);
        }
      },
    });
  };

  // user effect hooks
  useEffect(() => {
    if (selectedParking) {
      fetchAllBookedSlots();
    }
  }, []);

  // set form input values
  const getFormValues = (event) => {
    setBooking({
      ...booking,
      [event.target.name]: event.target.value,
    });
  };

  const resetBookingForm = (bool) => {
    if (bool) resetParkingSlot();
    setBooking({
      date: '',
      startingTime: '',
      endingTime: '',
    });
  };

  const resetParkingSlot = () => {
    const updateSlots = slots.map((slot) => {
      return {
        ...slot,
        initial: false,
        available: false,
        booked: false,
      };
    });

    setSlots([...updateSlots]);
  };

  // Adding new Booking and Sending Email Confirmation
  const slotBooking = (e, selectedSlot) => {
    e.preventDefault();
    e.stopPropagation();

    const bookingClone = { ...booking };
    bookingClone.userId = store.user.userId;
    bookingClone.locationId = selectedParking.id;
    bookingClone.slotId = selectedSlot.slotId;
    bookingClone.cancel = false;
    bookingClone.startingTime = moment
      .utc(bookingClone.date + ' ' + bookingClone.startingTime)
      .format();
    bookingClone.endingTime = moment
      .utc(bookingClone.date + ' ' + bookingClone.endingTime)
      .format();

    toggleLoadingInSlots({
      bool: true,
      selectedSlot,
    });

    // Add new Booking to Firebase data base
    bookingSlot({
      bookingClone,
      callback: async () => {
        toggleLoadingInSlots({
          bool: false,
          selectedSlot,
        });
        fetchAllBookedSlots();
        await sendEmailAfterBooking({
          bookingClone,
          selectedSlot,
          store,
          selectedParking,
        });
      },
    });
  };

  const toggleLoadingInSlots = ({ bool, selectedSlot }) => {
    const updatedSlot = slots.map((slot) => {
      if (slot.slotId === selectedSlot.slotId) {
        return {
          ...slot,
          loading: bool,
        };
      }
      return {
        ...slot,
      };
    });
    setSlots(updatedSlot);
  };

  const checkAvailability = (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    // if bookings is null than all slots are available for booking
    if (!bookings || bookings === null) {
      const updateSlots = slots.map((slot) => {
        return {
          ...slot,
          initial: false,
          available: true,
        };
      });
      setSlots([...updateSlots]);
    }

    if (bookings && Object.keys(bookings).length) {
      fetchAllBookedSlots();
    }
  };

  const slotBookingForm = () => {
    return (
      <div className="mt-5">
        <Form validated={validated} onSubmit={checkAvailability}>
          <Row>
            <Col xs={12} md={3}>
              <DefaultFormGroup
                value={booking.date}
                onChange={getFormValues}
                name="date"
                required={true}
                type="date"
                label="Date"
                placeholder="Parking date"
                controlId="formParkingDate"
              />
            </Col>
            <Col xs={12} md={3}>
              <DefaultFormGroup
                value={booking.startingTime}
                disabled={!booking.date}
                onChange={getFormValues}
                name="startingTime"
                required={true}
                type="time"
                label="Staring Time"
                placeholder="Select time"
                controlId="formStartingParkingTime"
              />
            </Col>
            <Col xs={12} md={3}>
              <DefaultFormGroup
                value={booking.endingTime}
                min={booking.startingTime}
                required={true}
                disabled={!booking.startingTime}
                onChange={getFormValues}
                name="endingTime"
                type="time"
                label="Ending Time"
                placeholder="Select time"
                controlId="formEndingParkingTime"
              />
            </Col>
            <Col xs={12} md={3}>
              <div className="invisible">
                <label>button</label>
              </div>
              <DefaultButton
                disabled={
                  !booking.date || !booking.startingTime || !booking.endingTime
                }
                type="submit"
                title="Check Availability"
              />
              {'  '}
              <DefaultButton
                variant="info"
                disabled={
                  !booking.date && !booking.startingTime && !booking.endingTime
                }
                type="button"
                title="reset"
                onClick={() => resetBookingForm(true)}
              />
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  const cancelBooking = (e, slot) => {
    let bookedSlotId = null;
    for (const property in bookings) {
      if (
        !bookings[property].cancel &&
        bookings[property].slotId === slot.slotId &&
        bookings[property].userId === store.user.userId
      ) {
        bookedSlotId = property;
        break;
      }
    }

    cancelBookedSlot({
      bookedSlotId,
      callback: () => {
        fetchAllBookedSlots();
      },
    });
  };

  const parkingSlots = () => {
    return (
      <Row className="justify-content-center mt-5">
        {slots.map((slot) => {
          const {
            slotId,
            name,
            initial,
            available,
            booked,
            loading,
            userId,
          } = slot;
          let variant = 'secondary';

          if (initial || available) {
            variant = 'secondary';
          } else if (booked) {
            variant = 'warning';
          }

          return (
            <Col xs={12} sm={6} md={4} className="mb-2" key={slotId}>
              <ListGroup>
                <ListGroup.Item variant={variant}>
                  <div className="slot-detail">
                    <span>
                      <img
                        alt="icon"
                        className="parking-icon-image"
                        src="https://s3.amazonaws.com/conventionimages.tabletop.events/774B9F8E-2FF3-11EA-B8CD-8BC723B98859/038CF1CA-37B3-11EA-B19F-CAEA5F70F2D3/icon-parking.png"
                      />
                      parking slot {name}
                    </span>

                    {available || booked ? (
                      <span
                        className={`float-right ${
                          available ? 'text-secondary' : ''
                        } ${booked ? 'text-danger' : ''}`}
                      >
                        {available ? 'Available' : ''}
                        {booked ? 'Booked' : ''}
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                  {available || (booked && userId === store.user.userId) ? (
                    <div className="slot-buttons mt-2">
                      {available ? (
                        <DefaultButton
                          variant="secondary"
                          className="btn-block"
                          disabled={!available}
                          loading={loading}
                          type="button"
                          title="Book Slot"
                          onClick={(e) => slotBooking(e, slot)}
                        />
                      ) : (
                        ''
                      )}
                      {booked && userId === store.user.userId ? (
                        <DefaultButton
                          variant="danger"
                          className="btn-block"
                          disabled={!booked}
                          loading={loading}
                          type="button"
                          title="Cancel Booked Slot"
                          onClick={(e) => cancelBooking(e, slot)}
                        />
                      ) : (
                        ''
                      )}
                    </div>
                  ) : (
                    ''
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          );
        })}
      </Row>
    );
  };

  if (!selectedParking) {
    history.push('/');
  }

  return (
    <div>
      <h1>{selectedParking ? selectedParking.name : ''} Parking Slots</h1>
      {slotBookingForm()}
      {parkingSlots()}
    </div>
  );
};

export default Parking;
