import React, { useState } from 'react';
import { updateLocation } from '../api/entity';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactJson from 'react-json-view';

const DEFAULT_STATE = {
  id: '',
  lat: '',
  long: '',
  result: {}
};

function Location({ question, apiDes }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const { id, lat, long, result } = state;

  const onChange = (event) => {
    const { name, value } = event.target;
    setState(state => ({ ...state, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();

    updateLocation({ id, lat, long })
      .then(res => {
        setState(state => ({ ...state, result: res }));
      })
      .catch((err) => {
        console.log('err');
      });
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Group as={Row}>
          <Form.Label column sm="3">ID của bản tin</Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              name="id"
              placeholder="ID"
              onChange={onChange}
              value={id}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="3">Vĩ độ</Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              name="lat"
              placeholder="Latitude"
              onChange={onChange}
              value={lat}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="3">Kinh độ</Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              name="long"
              placeholder="Longtitude"
              onChange={onChange}
              value={long}
            />
          </Col>
        </Form.Group>
        <Button variant="outline-primary" type="submit">
          Truy vấn
      </Button>
      </Form>
      <hr />
      <ReactJson src={result} />
    </>
  );
}

export default Location;
