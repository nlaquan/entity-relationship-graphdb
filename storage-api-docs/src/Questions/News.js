import React, { useState } from 'react';
import { news } from '../api/news';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactJson from 'react-json-view';

const DEFAULT_STATE = {
  links: '',
  result: {}
};

function News({ question, apiDes }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const { links, result } = state;

  const onChange = (event) => {
    const { name, value } = event.target;
    setState(state => ({ ...state, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const ids = links.split(',').map(id => id.trim()).filter(id => id !== "");
    news(ids)
      .then(res => {
        setState(state => ({ ...state, result: res }));
      })
      .catch((err) => {
        console.log('err');
      });
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Group as={Row}>
          <Form.Label column sm="3">Bản tin</Form.Label>
          <Col sm="9">
            <Form.Control
              type="text"
              as="textarea"
              name="links"
              placeholder="Links"
              onChange={onChange}
              value={links}
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

export default News;
