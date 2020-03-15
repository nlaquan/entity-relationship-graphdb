import React from 'react';

function EntityWithRelationshipByQuarter({ questionId }) {
  return (
    <div>
      Service thống kê các thực thể có quan hệ r với thực thể đang xét trong tháng m.
    Service nhận đầu vào là <b>id</b> của thực thể cần xét; <b>relationship</b> - chỉ quan
    hệ giữa thực thể cần xét với các thực thể khác; <b>quarter</b>, <b>year</b> xác định quý
      cần thống kê.
    </div>
  );
}

export default EntityWithRelationshipByQuarter;
