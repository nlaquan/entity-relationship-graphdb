import React from 'react';

function Statistics({ questionId }) {
  return (
    <div>
      Service thống kê các thực thể kèm theo xuất hiện trong bao nhiêu bản tin,
      xuất hiện bao nhiêu lần. Service nhận đầu vào là <b>ids</b> - danh sách id của các thực
      thể cần thống kê
    </div>
  );
}

export default Statistics;
