import React, { useState } from 'react';
import {
  Entity,
  News,
  EntityWithType,
  EntityWithOtherEntityInNews,
  EntityOccurrencesInNews,
  EntityOccurrences,
  EntityWithRelationship,
  NewsHasEntityAndRelationship,
  EntityWithRelationshipByMonth,
  EntityWithRelationshipByQuarter,
  MergeEntity,
  NewsByTime,
  Statistics,
  Location,
  RawQuery
} from './Questions';
import ListGroup from 'react-bootstrap/ListGroup';
import CreateNews from './News';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

const questions = [{
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
  id: 'q12',
  content: 'Lưu trữ thực thể (import json file)'
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

function getQuestion(questionId) {
  const question = questions.filter(q => q.id === questionId)[0];
  return question;
}

const defaultQuestion = questions[0];

const QUESTION_COMPONENTS = {
  q1: Entity,
  q2: News,
  q3: EntityWithOtherEntityInNews,
  q4: EntityWithType,
  q5: EntityOccurrencesInNews,
  q6: EntityOccurrences,
  q7: NewsHasEntityAndRelationship,
  q8: EntityWithRelationship,
  q9: EntityWithRelationshipByMonth,
  q10: EntityWithRelationshipByQuarter,
  q11: MergeEntity,
  q12: CreateNews,
  q13: NewsByTime,
  q14: Statistics,
  q15: Location,
  q16: RawQuery
};

// eslint-disable-next-line no-unused-vars
const API_DES = {
  q1: {
    title: "Endpoint cho việc lấy thông tin của một thực thể",
    description: "Lấy thông tin của một thực thể",
    endpoint: '/entity',
    method: "GET",
    params: {
      label: 'Nhãn của thực thể',
      name: 'Tên của thực thể',
      isExact: "false - Tìm kiếm chính xác theo tên hoặc cụm từ"
    }
  },
  q2: {
    title: "Endpoint cho việc lấy thông tin của một hoặc nhiều bản tin",
    description: "Lấy thông tin của bản tin",
    endpoint: '/news',
    method: "GET",
    params: {
      links: 'Các liên kết đến bản tin'
    }
  },
  q3: {
    title: "Endpoint cho việc lấy thông tin về các thực thể mà có quan hệ r với thực thể e trong một hoặc bản tin",
    description: "Lấy thông tin về các thực thể mà có quan hệ r với thực thể e trong nhiều bản tin",
    endpoint: '/entity_has_rel_with_others',
    method: "GET",
    params: {
      links: 'Các liên kết đến bản tin',
      id: 'ID của thực thể'
    }
  },
  q4: {
    title: "Endpoint cho việc lấy thông tin về các loại thực thể nhất định và mối quan hệ giữa chúng trong một hoặc nhiều bản tin",
    description: "Lấy thông tin về các loại thực thể nhất định và mối quan hệ giữa chúng trong một hoặc nhiều bản tin",
    endpoint: '/news_with_entity_type',
    method: "GET",
    params: {
      links: 'Các liên kết đến bản tin',
      labels: 'Nhãn của các loại thực thể cần truy vấn'
    }
  },
  q5: {
    title: "Endpoint cho việc lấy thông tin về số lần một thực thể được đề cập đến trong một hoặc nhiều bản tin",
    description: "Lấy thông tin về số lần một thực thể được đề cập đến trong một hoặc nhiều bản tin",
    endpoint: '/entity_occurrences_in_news',
    method: "GET",
    params: {
      id: 'ID của thực thể',
      newsIds: 'Danh sách ID của các bản tin cần xét'
    }
  },
  q6: {
    title: "Endpoint cho việc liệt kê các bản tin mà có sự xuất hiện của thực thể e",
    description: "Liệt kê các bài báo mà có sự xuất hiện của thực thể e",
    endpoint: '/entity_occurrences',
    method: "GET",
    params: {
      id: 'ID của thực thể'
    }
  },
  q7: {
    title: "Endpoint cho việc liệt kê các bản tin trong đó thực thể e1 có quan hệ r với thực thể e2",
    description: "Liệt kê các bản tin mà trong đó thực thể e1 có quan hệ r với thực thể e2",
    endpoint: '/news_has_entity_and_relationship',
    method: "GET",
    params: {
      sId: 'ID của thực thể chủ thể',
      relationship: 'Mối quan hệ giữa 2 thực thể',
      oId: 'ID của thực thể đối tượng'
    }
  },
  q8: {
    title: "Endpoint cho việc kê các thực thể e2 mà có quan hệ r với thực thể e1",
    description: "Liệt kê các thực thể (chủ thể) e1 mà có quan hệ r với thực thể e2 (đối tượng)",
    endpoint: '/entity_with_relationship',
    method: "GET",
    params: {
      id: 'ID của thực thể',
      relationship: 'Quan hệ của thực thể cần xét với các thực thể khác'
    }
  },
  q9: {
    description: "Liệt kê các thực thể (chủ thể) e1 mà có quan hệ r với thực thể e2 (đối tượng) trong tháng m",
    endpoint: '/entity_with_relationship_by_month',
    method: "GET",
    params: {
      id: 'ID của thực thể',
      relationship: 'Quan hệ của thực thể cần xét với các thực thể khác',
      month: 'Tháng cần xét',
      year: 'Năm cần xét'
    }
  },
  q10: {
    description: "Liệt kê các thực thể (chủ thể) e1 mà có quan hệ r với thực thể e2 (đối tượng) trong tháng m",
    endpoint: '/entity_with_relationship_by_quarter',
    method: "GET",
    params: {
      id: 'ID của thực thể',
      relationship: 'Quan hệ của thực thể cần xét với các thực thể khác',
      quarter: 'Quý cần xét',
      year: 'Năm cần xét'
    }
  },
  q11: {
    description: "Tích hợp thực thể",
    endpoint: '/merge',
    method: "POST",
    params: {
      ids: 'Danh sách id của các thực thể cần tích hợp'
    }
  },
  q12: {
    description: "Lưu trữ bản tin",
    endpoint: '/news',
    method: "POST",
    params: {
      file: 'File chứa bản tin và các thực thể, quan hệ được trích xuất từ bản tin này'
    }
  },
  q13: {
    description: "Truy vấn bản tin theo thời gian",
    endpoint: '/news/time',
    method: "GET",
    params: {
      start: 'Thời gian bắt đầu',
      end: 'Thời gian kết thúc'
    }
  },
  q14: {
    description: "Thống kê thông tin về một tập các thực thể kèm theo xuất hiện trong bao nhiêu bản tin, xuất hiện bao nhiêu lần",
    endpoint: '/statistics',
    method: "GET",
    params: {
      ids: 'Danh sách id của các thực thể cần thống kê',
    }
  },
  q15: {
    description: "Cập nhật toạ độ cho các thực thể vị trí",
    endpoint: '/location',
    method: "PATCH",
    params: {
      id: 'ID của thực thể vị trí',
    }
  },
  q16: {
    description: "Thực hiện câu truy vấn cypher",
    endpoint: '/raw-query',
    method: "POST",
    params: {
      query: "Câu query cypher"
    }
  }
}

function App() {
  const [currentQuestion, setQuestion] = useState(defaultQuestion);

  const setCurrentQuestion = id => () => {
    setQuestion(getQuestion(id));
  }
  const Details = QUESTION_COMPONENTS[currentQuestion.id];

  return (
    <div className="app container-fluid">
      <div className="row">
        <div className="col-md-2">
          <ListGroup>
            {
              questions.map((q, i) => (
                <ListGroup.Item
                  key={q.id}
                  active={currentQuestion.id === q.id}
                  onClick={setCurrentQuestion(q.id)}>
                  {i + 1}. {q.content}
                </ListGroup.Item>
              ))
            }
          </ListGroup>
        </div>
        <div className="col-md-10">
          <Details question={currentQuestion} apiDes={API_DES[currentQuestion.id]} />
        </div>
      </div>
    </div>
  );
}

export default App;
