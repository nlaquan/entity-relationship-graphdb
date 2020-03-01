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
    <div className="api-describe-and-demo row">
      <div className="api-describe col-md-5">
        <h3>{question.content}</h3>
        <div>
        </div>
        <b>Mô tả</b>
        <div>
          Service lưu trữ thông tin về bản tin và các thực thể - quan hệ trích xuất tự động từ bản tin.
          Service nhận đầu vào là 1 file json chứa thông tin về các bản tin và các thực thể - quan hệ
          trong các bản tin đó.
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
            <Form.Label column sm="3">Chọn file</Form.Label>
            <Col sm="5">
              <Form.Control type="file" name="file" onChange={onChange} />
            </Col>
          </Form.Group>
          <Button type="submit" variant="outline-primary">Lưu trữ</Button>
        </Form>
        <hr />
        <ReactJson src={result} />
      </div>
    </div>
  );
}

export default NewArticle;
