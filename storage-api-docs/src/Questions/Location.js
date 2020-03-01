import React, { useState } from 'react';
import { updateLocation } from '../api/entity';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactJson from 'react-json-view';
import { EndpointTable } from '../component';

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
    <div className="api-describe-and-demo row">
      <div className="api-describe col-md-5">
        <h3>{question.content}</h3>
        <div>
        </div>
        <b>Mô tả</b>
        <div>
          Service liệt kê các thực thể và mối quan hệ giữa chúng trong một bản tin
          nhận đầu vào là danh sách <b>links</b> của các bản tin cần truy vấn.
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
      </div>
    </div>
  );
}

export default Location;
