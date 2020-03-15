const QUESTIONS = [{
  id: 'q12',
  content: 'Lưu trữ thực thể (import json file)'
}, {
  id: 'q1',
  content: 'Lấy thông tin của một thực thể e'
}, {
  id: 'q2',
  content: 'Liệt kê các thực thể và mối quan hệ giữa chúng trong một hoặc nhiều bản tin'
}, {
  id: 'q3',
  content: 'Liệt kê các thực thể có quan hệ với thực thể e trong một hoặc nhiều bản tin'
}, {
  id: 'q4',
  content: 'Liệt kê ra các thực thể loại T (Person, Country)  và mối quan hệ giữa chúng trong một hoặc nhiều bản tin',
}, {
  id: 'q5',
  content: 'Số lần một thực thể e được đề cập đến trong một hoặc nhiều bản tin',
}, {
  id: 'q6',
  content: 'Thực thể e xuất hiện trong những bài báo nào',
}, {
  id: 'q7',
  content: 'Thực thể e1 và thực thể e2 với quan hệ r trích xuất từ những bài báo nào',
}, {
  id: 'q8',
  content: 'Thực thể e1 có quan hệ r với những thực thể e2(s) nào'
}, {
  id: 'q9',
  content: 'Thực thể e1 có quan hệ r với những thực thể e2(s) nào trong tháng m'
}, {
  id: 'q10',
  content: 'Thực thể e1 có quan hệ r với những thực thể e2(s) nào trong quý q'
}, {
  id: 'q11',
  content: 'Tích hợp thực thể'
}, {
  id: 'q13',
  content: 'Liệt kê các thực thể và mối quan hệ giữa chúng trong một hoặc nhiều bản tin theo thời gian'
}, {
  id: 'q14',
  content: 'Thống kê thông tin về một tập các thực thể kèm theo xuất hiện trong bao nhiêu bản tin, xuất hiện bao nhiêu lần'
}, {
  id: 'q15',
  content: 'Cập nhật thông tin về tạo độ của thực thể vị trí'
}, {
  id: 'q16',
  content: 'Cho phép developer thực hiện câu truy vấn cypher'
}];

const questions = {
  default: QUESTIONS[0],
  all: () => QUESTIONS,
  get: (questionId) => QUESTIONS.find(q => q.id === questionId),
}

export default questions;
