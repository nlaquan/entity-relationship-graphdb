import React from 'react';

function NewsHasEntityAndRelationship({ questionId }) {
  return (
    <div>
      Service thống kê những bài báo có xuất hiện quan hệ r giữa 1 cặp thực thể. Service nhận
      đầu vào là <b>sId</b> - ID của thực thể đóng vai trò chủ thể, <b>oId</b> - ID của thực
      thể đống vài trò đối tượng và <b>relationship</b> - tên quan hệ giữa chúng.
    </div>
  );
}

export default NewsHasEntityAndRelationship;
