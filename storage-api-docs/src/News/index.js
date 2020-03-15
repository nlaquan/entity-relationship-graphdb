import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { createNews } from '../api/news';
import ReactJson from 'react-json-view';
import { EndpointTable } from '../component';

const DEFAULT_STATE = {
  file: null,
  result: {}
};

function NewArticle({ question, apiDes }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const { file, result } = state;

  const onChange = (event) => {
    const { files } = event.target;
    setState(state => ({ ...state, file: files[0] }));
  }

  const onSubmit = (event) => {
    event.preventDefault();
    createNews(file)
      .then(res => {
        console.log('res', res);
        setState(state => ({ ...state, result: res }))
      })
      .catch(err => console.log('err', err));
  }

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group as={Row}>
        <Form.Label column sm="3">Chọn file</Form.Label>
        <Col sm="5">
          <Form.Control type="file" name="file" onChange={onChange} />
        </Col>
      </Form.Group>
      <Button type="submit" variant="outline-primary">Lưu trữ</Button>
    </Form>
  );
}

export default NewArticle;
