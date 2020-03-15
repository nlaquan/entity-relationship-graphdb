import React, { useState } from 'react';
import { executeRawQuery } from '../api/entity';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactJson from 'react-json-view';

const DEFAULT_STATE = {
  query: '',
  result: {}
};

function RawQuery({ question, apiDes }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const { query, result } = state;

  const onChange = (event) => {
    const { name, value } = event.target;
    setState(state => ({ ...state, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();

    executeRawQuery(query)
      .then(res => setState(state => ({ ...state, result: res })))
      .catch(err => console.log('err', err));
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Group as={Row}>
          <Form.Label column sm="3">Câu truy vấn</Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              as="textarea"
              name="query"
              placeholder="match (n) ..."
              onChange={onChange}
              value={query}
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

export default RawQuery;
