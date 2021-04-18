import moment from 'moment';
import emailjs from 'emailjs-com';
import { emailJS } from '../constants/emailJs.constant';

const dateTimeComparison = ({ bookedSlot, booking }) => {
  // const startTimeToCompare = moment
  //   .utc(allBookedSlots[property].startingTime)
  //   .isBetween(
  //     moment.utc(booking.date + ' ' + booking.startingTime),
  //     moment.utc(booking.date + ' ' + booking.endingTime)
  //   );
  // const endTimeToCompare = moment
  //   .utc(allBookedSlots[property].endingTime)
  //   .isBetween(
  //     moment.utc(booking.date + ' ' + booking.startingTime),
  //     moment.utc(booking.date + ' ' + booking.endingTime)
  //   );

  // const startTimeSameCompare = moment
  //   .utc(allBookedSlots[property].startingTime)
  //   .isSame(
  //     moment.utc(booking.date + ' ' + booking.startingTime)
  //   );

  // const endTimeSameCompare = moment
  //   .utc(allBookedSlots[property].endingTime)
  //   .isSame(moment.utc(booking.date + ' ' + booking.endingTime));

  const startTimeToCompare = moment
    .utc(bookedSlot.startingTime)
    .isBetween(
      moment.utc(booking.date + ' ' + booking.startingTime),
      moment.utc(booking.date + ' ' + booking.endingTime)
    );
  const endTimeToCompare = moment
    .utc(bookedSlot.endingTime)
    .isBetween(
      moment.utc(booking.date + ' ' + booking.startingTime),
      moment.utc(booking.date + ' ' + booking.endingTime)
    );

  const startTimeSameCompare = moment
    .utc(bookedSlot.startingTime)
    .isSame(moment.utc(booking.date + ' ' + booking.startingTime));

  const endTimeSameCompare = moment
    .utc(bookedSlot.endingTime)
    .isSame(moment.utc(booking.date + ' ' + booking.endingTime));

  return {
    startTimeSameCompare,
    endTimeSameCompare,
    startTimeToCompare,
    endTimeToCompare,
  };
};

const sendEmailAfterBooking = async ({
  bookingClone,
  selectedSlot,
  store,
  selectedParking,
}) => {
  try {
    const templateParams = {
      date: bookingClone.date,
      from_name: 'Online Parking System',
      to_name: store.user.name,
      receiverEmail: store.user.email,
      parking_location: selectedParking.name,
      slotId: selectedSlot.slotId,
      message: `Parking Slot successfully booked at ${selectedParking.name}`,
      startingTime: moment.utc(bookingClone.startingTime).format('HH:mm'),
      endingTime: moment.utc(bookingClone.endingTime).format('HH:mm'),
    };

    // Send Email to User
    const emailResponse = await emailjs.send(
      emailJS.serviceId,
      emailJS.templateId,
      templateParams,
      emailJS.userId
    );

    console.log('emailResponse : ', emailResponse);
  } catch (error) {
    console.log('sendEmailAfterBooking error :: ', error);
  }
};

export { dateTimeComparison, sendEmailAfterBooking };
