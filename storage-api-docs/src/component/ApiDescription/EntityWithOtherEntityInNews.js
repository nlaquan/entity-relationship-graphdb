import React from 'react';

function EntityWithOtherEntityInNews({ questionId }) {
  return (
    <div>
      Service truy vấn các thực thể có quan hệ với về một thực thể cần xét trong một tập các
    bản tin nhận đầu vào là <b>id</b> của thực thể của cần xét và
    <b>links</b> - danh sách liên kết của các bản tin cần xét
  </div>
  );
}

export default EntityWithOtherEntityInNews;
