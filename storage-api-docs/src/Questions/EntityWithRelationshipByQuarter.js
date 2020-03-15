import React, { useState } from 'react';
import {
  entityWithRelationshipByQuarter
} from '../api/entity';
import { RELATIONSHIP_TYPE, YEARS } from '../config';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ReactJson from 'react-json-view';

const QUARTERS = ['1', '2', '3', '4'];

const DEFAULT_STATE = {
  id: '',
  relationship: RELATIONSHIP_TYPE[0],
  quarter: '1',
  year: '2019',
  result: {}
}

function EntityWithRelationshipByMonth({ question, apiDes }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const { id, relationship, quarter, year, result } = state;

  const onChange = (event) => {
    const { name, value } = event.target;
    setState(state => ({ ...state, [name]: value }));
  }

  const onSubmit = (event) => {
    event.preventDefault();
    entityWithRelationshipByQuarter({
      id,
      relationship,
      quarter, year
    })
      .then(res => {
        // setResult(result);
        setState(state => ({ ...state, result: res }));
      })
      .catch((err) => {
        console.log('err', err);
      })

  }

  return (
    <>
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
          <Form.Label column sm="1">Quý</Form.Label>
          <Col sm="3">
            <Form.Control as="select" name="quarter" value={quarter} onChange={onChange}>
              {
                QUARTERS.map(m =>
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
    </>
  );
}

export default EntityWithRelationshipByMonth;
