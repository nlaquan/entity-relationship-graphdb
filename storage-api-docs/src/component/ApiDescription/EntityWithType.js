import React from 'react';

function EntityWithType({ questionId }) {
  return (
    <div>
      Service liệt kê các thực thể có nhãn nhất định trong một tập các bản tin
    nhận đầu vào là <b>links</b> - danh sách liên kết của các bản tin, được ngăn cách với nhau
    bằng dấu "," và <b>labels</b> - danh sách các nhãn, được ngăn cách với nhau bằng dấu ","
    </div>
  );
}

export default EntityWithType;
