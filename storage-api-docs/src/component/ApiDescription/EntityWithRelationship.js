import React from 'react';

function EntityWithRelationship({ questionId }) {
  return (
    <div>
      Service thống kê các thực thể có quan hệ r với thực thể đang xét. Service nhận đầu vào là <b>id</b> của
    thực thể cần xét và <b>relationship</b> - chỉ quan hệ giữa thực thể cần xét
      với các thực thể khác.
  </div>
  );
}

export default EntityWithRelationship;
