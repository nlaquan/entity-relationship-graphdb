import React from 'react';
import { isEmpty } from 'lodash';
import { IoIosRemoveCircle } from 'react-icons/io';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function Result({ result, clearResult, text = 'Không có thông tin về thực thể này' }) {
  return (
    <div className="result">
      <Form.Group as={Row} className="result-bar">
        <Form.Label column sm="2">Kết quả</Form.Label>
        <Col sm="1" onClick={clearResult}>
          <IoIosRemoveCircle
            size="1.5rem"
            className="clear"
            style={{ cursor: 'pointer' }}
          />
        </Col>
      </Form.Group>
      {
        !result
          ? <div></div>
          : isEmpty(result)
            ? <span>{text}</span>
            : (
              <div className="result-content">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )
      }
    </div>
  )
}

export default Result;
