import { db } from './firebase.index';

const bookingSlot = ({ bookingClone, callback }) => {
  // db.child('bookings/')
  //   .push(bookingClone)
  //   .then(async () => {
  //     toggleLoadingInSlots({
  //       bool: false,
  //       selectedSlot,
  //     });
  //     fetchAllBookedSlots();
  //     // setLoading(false);
  //     // await sendEmailAfterBooking({ bookingClone, selectedSlot });
  //     // resetBookingForm(false);
  //     // toast.success('Booking has been done successfully');
  //   });

  db.child('bookings/')
    .push(bookingClone)
    .then(() => {
      callback();
    });
};

const getAllBookedSlots = ({ locationId, callback }) => {
  // db.child('bookings')
  //   .orderByChild('locationId')
  //   .equalTo(selectedParking.id)
  //   .on('value', (snapshot) => {
  //     let allBookedSlots = snapshot.val();
  //     console.log('allBookedSlots : ', allBookedSlots);
  //     if (allBookedSlots) {
  //       // filtered booked slots remove all cancel booked slots
  //       let bookedSlots = {};
  //       for (const property in allBookedSlots) {
  //         if (!allBookedSlots[property].cancel) {
  //           bookedSlots[property] = allBookedSlots[property];
  //         }
  //       }

  //       if (booking.date && booking.startingTime && booking.endingTime) {
  //         const updateSlots = slots.map((slot) => {
  //           let bookingNotAvailable = false;
  //           let userId = null;

  //           for (const property in allBookedSlots) {
  //             let bookedDate = allBookedSlots[property].date;
  //             let bookedSlotId = allBookedSlots[property].slotId;

  //             const {
  //               startTimeSameCompare,
  //               endTimeSameCompare,
  //               startTimeToCompare,
  //               endTimeToCompare,
  //             } = dateTimeComparison({
  //               bookedSlot: allBookedSlots[property],
  //               booking,
  //             });

  //             if (
  //               bookedSlotId === slot.slotId &&
  //               bookedDate === booking.date &&
  //               (startTimeSameCompare ||
  //                 endTimeSameCompare ||
  //                 startTimeToCompare ||
  //                 endTimeToCompare)
  //             ) {
  //               bookingNotAvailable = true;
  //               userId = allBookedSlots[property].userId;
  //               break;
  //             }
  //           }

  //           return {
  //             ...slot,
  //             initial: false,
  //             available: bookingNotAvailable ? false : true,
  //             booked: bookingNotAvailable,
  //             userId: userId ? userId : null,
  //           };
  //         });
  //         console.log('updateSlots : ', updateSlots);
  //         setSlots(updateSlots);
  //       }

  //       setBookings(allBookedSlots);
  //     }
  //   });

  db.child('bookings')
    .orderByChild('locationId')
    .equalTo(locationId)
    .on('value', (snapshot) => {
      callback(snapshot.val());
    });
};

const cancelBookedSlot = async ({ bookedSlotId, callback }) => {
  //   await db.child(`bookings/${bookedSlotId}`).child('cancel').setValue(true);
  let update = {};
  update[`/bookings/${bookedSlotId}/cancel`] = true;
  db.update(update);
  callback();
};

const getBookedSlotByUserId = ({ userId, callback }) => {
  db.child('bookings')
    .orderByChild('userId')
    .equalTo(userId)
    .on('value', (snapshot) => {
      callback(snapshot.val());
    });
};

const getFeedbacksByUserId = ({ userId, callback }) => {
  db.child('feedbacks')
    .orderByChild('userId')
    .equalTo(userId)
    .on('value', (snapshot) => {
      callback(snapshot.val());
    });
};

const addFeedback = ({ feedbackClone, callback }) => {
  db.child('feedbacks/')
    .push(feedbackClone)
    .then(() => {
      callback();
    });
};

const addReply = ({ replyClone, callback }) => {
  db.child('reply/')
    .push(replyClone)
    .then(() => {
      callback();
    });
};

const getAllUsers = ({ callback }) => {
  db.child('users/')
    .orderByChild('role')
    .equalTo('user')
    .on('value', (snapshot) => {
      callback(snapshot.val());
    });
};

export {
  getAllBookedSlots,
  bookingSlot,
  cancelBookedSlot,
  getBookedSlotByUserId,
  getFeedbacksByUserId,
  addFeedback,
  addReply,
  getAllUsers,
};
