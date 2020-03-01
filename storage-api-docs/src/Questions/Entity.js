import React, { useState } from 'react';
import { entity } from '../api/entity';
import { ENTITY_LABEL } from '../config';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactJson from 'react-json-view';
import { EndpointTable } from '../component';

const DEFAULT_ENTITY = {
  label: 'Person',
  name: 'Obama',
  exact: true,
  result: {}
};


function Entity({ question, apiDes }) {
  const [state, setState] = useState(DEFAULT_ENTITY);
  const { label, name, exact, result } = state;

  const onChange = (event) => {
    const { name, value } = event.target;
    setState(state => ({ ...state, [name]: value }));
  }

  const onCheckExact = (event) => {
    const { checked } = event.target;
    setState(state => ({ ...state, exact: checked }));
  }

  const onSubmit = (event) => {
    event.preventDefault();

    entity({ label, name: name.trim(), isExact: exact })
      .then(res => {
        setState(state => ({ ...state, result: res }));
      })
      .catch(err => {
        console.log('err', err);
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
          Service truy vấn thông tin về một thực thể nhận đầu vào là <b>label</b> - nhãn của thực thể của cần truy vấn kèm <b>name</b> - tên của thực thể đó; người dùng có thể tuỳ chọn truyền thêm tham số <b>isExact</b> để truy vấn thực thể với thuộc tính name chính xác hoặc chỉ cần chứa một cụm từ.
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
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Tìm kiếm chính xác"
              defaultChecked
              onClick={onCheckExact}
            />
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="3">Nhãn</Form.Label>
            <Col sm="9">
              <Form.Control as="select" name="label" value={label} onChange={onChange}>
                {
                  ENTITY_LABEL.map(l =>
                    <option key={l} value={l}>{l}</option>
                  )
                }
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="3">Tên</Form.Label>
            <Col sm="9">
              <Form.Control
                type="text"
                name="name"
                placeholder="Name"
                onChange={onChange}
                value={name}
              />
            </Col>
          </Form.Group>
          <Button variant="outline-primary" type="submit">
            Truy vấn
          </Button>
        </Form>
        <hr />
        {/* <h3>Code</h3>
        <Embed source={code} /> */}
        <hr />
        <ReactJson src={result} />
      </div>
    </div>
  );
}

export default Entity;
