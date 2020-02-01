import React, { useState } from 'react';
import { executeRawQuery } from '../api/entity';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactJson from 'react-json-view';
import { EndpointTable } from '../component';

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
    <div className="api-describe-and-demo row">
      <div className="api-describe col-md-5">
        <h3>{question.content}</h3>
        <div>
        </div>
        <b>Mô tả</b>
        <div>
          Service nhận đầu vào là một câu truy vấn cypher
        </div>
        <hr />
        <div className="endpoint">
          <div className="api-docs-get-method-color">{apiDes.method}</div>
          <div className="api-docs-endpoint-name-text">{apiDes.endpoint}</div>
        </div>
        <hr />
        <EndpointTable details={apiDes} />
      </div>
      <div className="col-md-7">
        <h3>Demo</h3>
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
      </div>
    </div>
  );
}

export default RawQuery;
