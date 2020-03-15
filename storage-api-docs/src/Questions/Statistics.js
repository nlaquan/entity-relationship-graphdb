import React, { useState } from 'react';
import { statism } from '../api/entity';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactJson from 'react-json-view';

const DEFAULT_STATE = {
  ids: '',
  result: {}
};

function Statistics({ question, apiDes }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const { ids, result } = state;

  const onChange = (event) => {
    const { name, value } = event.target;
    setState(state => ({ ...state, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const _ids = ids.split(',').map(id => id.trim()).filter(id => id !== "");

    statism(_ids)
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
          <Form.Label column sm="3">Bản tin</Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              as="textarea"
              name="ids"
              placeholder="IDs"
              onChange={onChange}
              value={ids}
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

export default Statistics;
