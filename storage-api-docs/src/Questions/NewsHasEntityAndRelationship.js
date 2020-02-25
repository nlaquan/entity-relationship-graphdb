import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { newsHasEntityAndRelationship } from '../api/news';
import { RELATIONSHIP_TYPE } from '../config';
import { EndpointTable } from '../component';

import ReactJson from 'react-json-view';

const DEFAULT_STATE = {
  sId: '',
  oId: '',
  relationship: RELATIONSHIP_TYPE[0],
  result: {}
}

function NewsHasEntityAndRelationship({ question, apiDes }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const { sId, oId, relationship, result } = state;

  const onChange = (event) => {
    const { name, value } = event.target;
    setState(state => ({ ...state, [name]: value }));
  }

  const onSubmit = (event) => {
    event.preventDefault();

    newsHasEntityAndRelationship({ sId, oId, relationship })
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
          Service thống kê những bài báo có xuất hiện quan hệ r giữa 1 cặp thực thể. Service nhận
          đầu vào là <b>sId</b> - ID của thực thể đóng vai trò chủ thể, <b>oId</b> - ID của thực
          thể đống vài trò đối tượng và <b>relationship</b> - tên quan hệ giữa chúng.
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
            <Form.Label column sm="3">Chủ thể</Form.Label>
            <Col sm="4">
              <Form.Control
                type="text"
                name="sId"
                value={sId}
                onChange={onChange}
                placeholder="Node ID"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="3">Quan hệ</Form.Label>
            <Col sm="4">
              <Form.Control as="select" name="relationship" value={relationship} onChange={onChange}>
                {
                  RELATIONSHIP_TYPE.map(l =>
                    <option key={l} value={l}>{l}</option>
                  )
                }
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="3">Đối tượng</Form.Label>
            <Col sm="4">
              <Form.Control
                type="text"
                name="oId"
                value={oId}
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

export default NewsHasEntityAndRelationship;
