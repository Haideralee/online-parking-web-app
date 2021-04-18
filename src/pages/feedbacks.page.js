import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import AppContext from '../provider/app.provider';
import { Col, Form, Row, Table } from 'react-bootstrap';

// imports components
import DefaultButton from '../components/button.component';
import {
  getFeedbacksByUserId,
  addFeedback,
  addReply,
} from '../firebase/firebase.methods';
import DefaultFormGroup from '../components/form-group.component';

const Feedbacks = (props) => {
  const store = useContext(AppContext);
  const history = useHistory();
  const { selectedUser } = props.location.state || {};
  const [feedbacks, setFeedbacks] = useState(null);
  const [feedback, setFeedback] = useState({
    feedback: '',
  });
  const [reply, setReply] = useState({
    reply: '',
  });
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  // useEffect
  useEffect(() => {
    if (selectedUser) {
      fetchFeedbacks();
    }
  }, []);

  const fetchFeedbacks = () => {
    getFeedbacksByUserId({
      userId: selectedUser.userId,
      callback: (feedbacks) => {
        setFeedbacks({ ...feedbacks });
      },
    });
  };

  const submitFeedback = (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    const feedbackClone = { ...feedback };
    feedbackClone.userId = selectedUser.userId;
    setLoading(true);
    setValidated(true);

    addFeedback({
      feedbackClone,
      callback: () => {
        console.log('feedback : ', feedback);
        setFeedback({
          feedback: '',
        });
        setLoading(false);
      },
    });
  };

  const getFormValues = (ev) => {
    setFeedback({
      ...feedback,
      [ev.target.name]: ev.target.value,
    });
  };

  const getReplyFormValues = (ev) => {
    setReply({
      ...reply,
      [ev.target.name]: ev.target.value,
    });
  };

  const feedbackForm = () => {
    return (
      <div className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <Form validated={validated} onSubmit={submitFeedback}>
              <Row>
                <Col xs={12} md={12}>
                  <DefaultFormGroup
                    className="feedback-textarea"
                    as="textarea"
                    onChange={getFormValues}
                    name="feedback"
                    required={true}
                    label="Feedback"
                    placeholder="Enter feedback"
                    controlId="feedback"
                    value={feedback.feedback}
                  />
                </Col>

                <Col xs={12} md={12}>
                  <DefaultButton
                    disabled={!feedback}
                    type="submit"
                    title="submit"
                    loading={loading}
                  />
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    );
  };

  const renderFeedbacks = () => {
    return (
      <div className="bg-white mt-5">
        <Table striped bordered hover responsive className="mb-0">
          <thead>
            <tr>
              <th>#index</th>
              <th>Feedback</th>
              {store.user && store.user.role === 'admin' ? (
                <th>reply</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {feedbacks &&
              Object.keys(feedbacks).map((feedback, feedbackIndex) => (
                <tr key={feedback} className="clickable-item">
                  <td>{feedbackIndex + 1}</td>
                  <td>{feedbacks[feedback].feedback}</td>
                  {store.user && store.user.role === 'admin' ? (
                    <td>
                      <DefaultButton
                        className="m-2"
                        variant="secondary"
                        type="button"
                        title="Reply"
                        onClick={(e) => {
                          doReply({
                            ...feedbacks[feedback],
                            feedbackId: feedback,
                          });
                        }}
                      />
                    </td>
                  ) : null}
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    );
  };

  const submitReply = (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    const replyClone = { ...reply };
    replyClone.userId = store.user.userId;
    replyClone.feedbackId = selectedFeedback.feedbackId;
    setLoading(true);
    setValidated(true);

    addReply({
      replyClone,
      callback: () => {
        setReply({
          reply: '',
        });
        setShowReplyForm(false);
        setSelectedFeedback(null);
        setLoading(false);
      },
    });
  };

  const replyForm = () => {
    return (
      <div className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <Form validated={validated} onSubmit={submitReply}>
              <Row>
                <Col xs={12} md={12}>
                  <DefaultFormGroup
                    className="feedback-textarea"
                    as="textarea"
                    onChange={getReplyFormValues}
                    name="reply"
                    required={true}
                    label="Reply"
                    placeholder="Enter reply"
                    controlId="reply"
                    value={reply.reply}
                  />
                </Col>

                <Col xs={12} md={12}>
                  <DefaultButton
                    disabled={!feedback}
                    type="submit"
                    title="Reply"
                    loading={loading}
                  />
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    );
  };

  const doReply = (selectedFeedback) => {
    setShowReplyForm(true);
    setSelectedFeedback({ ...selectedFeedback });
  };

  if (!selectedUser) {
    history.push('/');
  }

  return (
    <div>
      <h1>Feedbacks</h1>
      {store.user && store.user.role === 'user' && feedbackForm()}
      {store.user &&
        store.user.role === 'admin' &&
        showReplyForm &&
        replyForm()}
      {renderFeedbacks()}
    </div>
  );
};

export default Feedbacks;
