import React, { useState } from 'react';
import { entity } from '../api/entity';
import { ENTITY_LABEL } from '../config';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactJson from 'react-json-view';

const INIT_STATE = {
  label: 'Person',
  name: 'Obama',
  exact: true,
  result: {}
};

function Entity({ question, apiDes }) {
  const [state, setState] = useState(INIT_STATE);
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
    <>
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
      <ReactJson src={result} />
    </>
  );
}

export default Entity;
