import React from 'react';
// import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import { FaQuestionCircle } from 'react-icons/fa';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

const popover = (content) => (
  <Popover id="popover-basic">
    <Popover.Title as="h3">Ví dụ</Popover.Title>
    <Popover.Content>
      {content}
    </Popover.Content>
  </Popover>
);

const Example = ({ content }) => (
  <OverlayTrigger trigger="click" placement="right" overlay={popover(content)}>
    <FaQuestionCircle variant="success">Click me to see</FaQuestionCircle>
  </OverlayTrigger>
);

export default Example;
