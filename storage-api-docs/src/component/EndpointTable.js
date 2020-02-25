import React from 'react';

function EndpointTable({ details }) {
  // eslint-disable-next-line no-unused-vars
  const { title, description, endpoint, method, params } = details;

  return (
    <>
      <b>Tham số</b>
      <table className="endpoint-table">
        <tbody>
          {
            Object.entries(params).map((p, i) => (
              <tr key={i}>
                <td><b>{p[0]}</b></td>
                <td>{p[1]}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  );
}

export default EndpointTable;
