import React, { useState } from 'react';
import {
  entityWithRelationshipByMonth
} from '../api/entity';
import { RELATIONSHIP_TYPE, YEARS } from '../config';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactJson from 'react-json-view';
import { EndpointTable } from '../component';

const MONTHS = Array.from(new Array(12), (_, i) => `${i + 1}`);

const DEFAULT_STATE = {
  id: '',
  relationship: RELATIONSHIP_TYPE[0],
  month: '1',
  year: '2019',
  result: {}
}

function EntityWithRelationshipByMonth({ question, apiDes }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const { id, relationship, month, year, result } = state;

  const onChange = (event) => {
    const { name, value } = event.target;
    setState(state => ({ ...state, [name]: value }));
  }

  const onSubmit = (event) => {
    event.preventDefault();

    entityWithRelationshipByMonth({
      id,
      relationship,
      month, year
    })
      .then(res => {
        setState(state => ({ ...state, result: res }));
      })
      .catch(err => {
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
          Service thống kê các thực thể có quan hệ r với thực thể đang xét trong tháng m.
          Service nhận đầu vào là <b>id</b> của thực thể cần xét; <b>relationship</b> - chỉ quan
          hệ giữa thực thể cần xét với các thực thể khác; <b>month</b>, <b>year</b> xác định tháng
          cần thống kê.
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
                type="text"
                name="id"
                value={id}
                onChange={onChange}
                placeholder="Node ID"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label column sm="3">Quan hệ</Form.Label>
            <Col sm="9">
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
            <Form.Label column sm="3">Thời gian</Form.Label>
            <Form.Label column sm="1">Tháng</Form.Label>
            <Col sm="3">
              <Form.Control as="select" name="month" value={month} onChange={onChange}>
                {
                  MONTHS.map(m =>
                    <option key={m} value={m}>{m}</option>
                  )
                }
              </Form.Control>
            </Col>
            <Form.Label column sm="1">Năm</Form.Label>
            <Col sm="4">
              <Form.Control as="select" name="year" value={year} onChange={onChange}>
                {
                  YEARS.map(y =>
                    <option key={y} value={y}>{y}</option>
                  )
                }
              </Form.Control>
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

export default EntityWithRelationshipByMonth;
