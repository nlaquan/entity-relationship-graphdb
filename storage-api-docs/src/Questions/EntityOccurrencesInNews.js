import React, { useState } from 'react';
import { entityOccurrencesInNews } from '../api/entity';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactJson from 'react-json-view';
import { EndpointTable } from '../component';

const DEFAULT_STATE = {
  links: '',
  id: '',
  result: {}
};

function EntityOccurrencesInNews({ question, apiDes }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const { links, id, result } = state;

  const onChange = (event) => {
    const { name, value } = event.target;
    setState(state => ({ ...state, [name]: value }));
  }

  const onSubmit = (event) => {
    event.preventDefault();
    const _links = links.split(',').map(id => id.trim()).filter(id => id !== '');

    entityOccurrencesInNews({ links: _links, id })
      .then(res => {
        // setResult(result);
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
          Service thống kê số lần một thực thể được đề cập đến trong một tập các bản tin
          nhận đầu vào là <b>id</b> của thực thể và <b>links</b> là danh sách các links
          của các bản tin, ngăn cách với nhau bằng dấu ",".
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
            <Form.Label column sm="3">Bản tin</Form.Label>
            <Col sm="9">
              <Form.Control
                type="text"
                as="textarea"
                name="links"
                value={links}
                onChange={onChange}
                placeholder="Links"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="3">Thực thể</Form.Label>
            <Col sm="4">
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

export default EntityOccurrencesInNews;
