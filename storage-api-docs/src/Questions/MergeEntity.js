import React, { useState } from 'react';
import { mergeEntity } from '../api/entity';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactJson from 'react-json-view';
import { ENTITY_LABEL } from '../config';

const DEFAULT_STATE = {
  ids: '',
  label: ENTITY_LABEL[0],
  result: {}
};

function MergeEntity({ question, apiDes }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const { ids, result, label } = state;

  const onChange = (event) => {
    const { name, value } = event.target;
    setState(state => ({ ...state, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const _ids = ids.split(',').map(id => id.trim()).filter(id => id !== "");

    mergeEntity({ label, ids: _ids })
      .then(res => setState(state => ({ ...state, result: res })))
      .catch((err) => {
        console.log('err');
      });
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
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
          <Form.Label column sm="3">Danh sách thực thể</Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              as="textarea"
              name="ids"
              placeholder="IDs"
              onChange={onChange}
              value={ids}
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

export default MergeEntity;
