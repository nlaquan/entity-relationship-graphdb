import React, { useState } from 'react';
import BoCollapse from 'react-bootstrap/Collapse';
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

function Collapse({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span
        className="api-describe"
        onClick={() => setOpen(!open)}
      >
        Mô tả API
        {
          open
          ? <FaCaretUp className="caret" />
          : <FaCaretDown className="caret" />
        }
      </span>
      <BoCollapse in={open}>
        <div id="collapse-text">
          {children}
        </div>
      </BoCollapse>
    </>
  )
}

export default Collapse;
