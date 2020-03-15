import React, { useState } from 'react';
import { newsByTime } from '../api/news';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactJson from 'react-json-view';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

const DEFAULT_STATE = {
  start: new Date(),
  end: new Date(),
  result: {}
};

function NewsByTime({ question, apiDes }) {
  const [state, setState] = useState(DEFAULT_STATE);
  const { start, end, result } = state;

  const setStartDate = (date) => {
    setState(state => ({ ...state, start: date }))
  }

  const setEndDate = (date) => {
    setState(state => ({ ...state, end: date }))
  }

  const onSubmit = (event) => {
    event.preventDefault();
    const startDate = start.toLocaleDateString('sv-SE');
    const endDate = end.toLocaleDateString('sv-SE');

    newsByTime(startDate, endDate)
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
          <Form.Label column sm="3">Thời gian bắt đầu</Form.Label>
          <Col sm="9">
            <DatePicker
              selected={start}
              onChange={date => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="3">Thời gian kết thúc</Form.Label>
          <Col sm="9">
            <DatePicker
              selected={end}
              onChange={date => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
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

export default NewsByTime;
