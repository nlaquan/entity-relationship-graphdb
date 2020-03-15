import React, { useState } from 'react';
import Select from 'react-select';
import { entityWithType } from '../api/entity';
import { ENTITY_LABEL } from '../config';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactJson from 'react-json-view';

const LABEL_OPTIONS = ENTITY_LABEL.map(label => ({
  value: label, label: label
}));

const DEFAULT_STATE = {
  links: '',
  multi: false,
  labels: [LABEL_OPTIONS[0]],
  result: {}
};

function EntityWithType({ question, apiDes }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const { links, labels, result } = state;

  const onChange = (event) => {
    const { name, value } = event.target;
    setState(state => ({ ...state, [name]: value }))
  }

  const onChangeLabel = selectedOption => {
    setState(state => ({ ...state, labels: selectedOption }));
  }

  const onSubmit = (event) => {
    event.preventDefault();
    const _labels = labels.map(l => l.value);
    const _links = links.split(',').map(id => id.trim()).filter(id => id !== "");
    entityWithType({ links: _links, labels: _labels })
      .then(res => {
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
          <Form.Label column sm="3">Bản tin</Form.Label>
          <Col sm="9">
            <Form.Control
              text="text"
              as="textarea"
              name="links"
              value={links}
              onChange={onChange}
              placeholder="Links"
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="3">Loại thực thể</Form.Label>
          <Col sm="9">
            <Select
              closeMenuOnSelect={false}
              defaultValue={[LABEL_OPTIONS[0]]}
              isMulti
              onChange={onChangeLabel}
              options={LABEL_OPTIONS}
            />
          </Col>
        </Form.Group>
        <Button variant="outline-primary" type="submit">Truy vấn</Button>
      </Form>
      <hr />
      <ReactJson src={result} />
    </>
  );
}

export default EntityWithType;
