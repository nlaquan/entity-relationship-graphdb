import React, { useState } from 'react';
import { entityOccurrences } from '../api/entity';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { EndpointTable } from '../component';
import ReactJson from 'react-json-view';

const DEFAULT_STATE = {
  id: '',
  result: {}
};

function EntityOccurrences({ question, apiDes }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const { id, result } = state;

  const onChange = (event) => {
    const { name, value } = event.target;
    setState(state => ({ ...state, [name]: value }));
  }

  const onSubmit = (event) => {
    event.preventDefault();
    entityOccurrences(id)
      .then(res => {
        setState(state => ({ ...state, result: res }));
      })
      .catch((err) => {
        console.log('err', err);
      })
  }

  return (
    <div className="api-describe-and-demo row">
      <div className="api-describe col-md-5">
        <h3>{question.content}</h3>
        <div>
        </div>
        <b>Mô tả</b>
        <div>
          Service thống kê các bài báo mà thực thể xuất hiện nhận đầu vào là <b>id</b> của thực thể
        </div>
        <hr />
        <div className="endpoint">
          <div className="api-docs-get-method-color">{apiDes.method}</div>
          <div className="api-docs-endpoint-name-text">{apiDes.endpoint}</div>
        </div>
        <hr />
        <EndpointTable details={apiDes} />
      </div>
      <div className="col-md-7 h-100 overflow-scroll">
        <h3>Demo</h3>
        <Form onSubmit={onSubmit}>
          <Form.Group as={Row}>
            <Form.Label column sm="3">Thực thể</Form.Label>
            <Col sm="9">
              <Form.Control
                name="id"
                type="text"
                value={id}
                onChange={onChange}
                placeholder="Node ID"
              />
            </Col>
          </Form.Group>
          <Button variant="outline-primary" type="submit">Truy vấn</Button>
        </Form>
        <hr />
        <ReactJson src={result} />
      </div>
    </div>
  );
}

export default EntityOccurrences;
