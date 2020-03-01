import React, { useState } from 'react';
import { statism } from '../api/entity';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactJson from 'react-json-view';
import { EndpointTable } from '../component';

const DEFAULT_STATE = {
  ids: '',
  result: {}
};

function Statistics({ question, apiDes }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const { ids, result } = state;

  const onChange = (event) => {
    const { name, value } = event.target;
    setState(state => ({ ...state, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const _ids = ids.split(',').map(id => id.trim()).filter(id => id !== "");

    statism(_ids)
      .then(res => {
        setState(state => ({ ...state, result: res }));
      })
      .catch((err) => {
        console.log('err');
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
          Service thống kê các thực thể kèm theo xuất hiện trong bao nhiêu bản tin,
          xuất hiện bao nhiêu lần. Service nhận đầu vào là <b>ids</b> - danh sách id của các thực
          thể cần thống kê
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
            <Form.Label column sm="3">Bản tin</Form.Label>
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
      </div>
    </div>
  );
}

export default Statistics;
