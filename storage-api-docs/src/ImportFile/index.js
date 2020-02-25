import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { importFile } from '../api/news';
import Toast from 'react-bootstrap/Toast';

const DEFAULT_STATE = {
  file: null,
  showToast: false
};

function ImportFile({ question }) {
  const [state, setState] = useState(DEFAULT_STATE);

  const { file, showToast, result } = state;

  const onChange = (event) => {
    const { files } = event.target;
    setState(state => ({ ...state, file: files[0] }));
  }

  const onSubmit = (event) => {
    event.preventDefault();
    importFile(file)
      .then(res => setState(state => ({ ...state, result: true, showToast: true })))
      .catch(err => console.log('err', err));
  }

  const closeToast = () => setState(state => ({ ...state, showToast: false }))

  return (
    <>
      {
        result === true && (
          <div
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: 'relative',
              zIndex: 100
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0
              }}
            >
              <Toast style={{ backgroundColor: 'green' }} onClose={closeToast} show={showToast}>
                <Toast.Header>
                  <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                  <strong className="mr-auto">Thành công</strong>
                </Toast.Header>
                <Toast.Body>Tạo bản tin thành công</Toast.Body>
              </Toast>
            </div>
          </div>
        )
      }
      <Form onSubmit={onSubmit}>
        <Form.Group as={Row}>
          <Form.Label column sm="3">Chọn file</Form.Label>
          <Col sm="5">
            <Form.Control type="file" name="file" onChange={onChange} />
          </Col>
        </Form.Group>
        <Button type="submit" variant="outline-primary">Lưu trữ</Button>
      </Form>
    </>
  );
}

export default ImportFile;
