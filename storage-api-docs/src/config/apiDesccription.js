// eslint-disable-next-line no-unused-vars
const API_DES = {
  q1: {
    endpoint: '/entity',
    method: "GET",
    params: {
      label: 'Nhãn của thực thể',
      name: 'Tên của thực thể',
      isExact: "false - Tìm kiếm chính xác theo tên hoặc cụm từ"
    }
  },
  q2: {
    endpoint: '/news',
    method: "GET",
    params: {
      links: 'Các liên kết đến bản tin'
    }
  },
  q3: {
    endpoint: '/entity_has_rel_with_others',
    method: "GET",
    params: {
      links: 'Các liên kết đến bản tin',
      id: 'ID của thực thể'
    }
  },
  q4: {
    endpoint: '/news_with_entity_type',
    method: "GET",
    params: {
      links: 'Các liên kết đến bản tin',
      labels: 'Nhãn của các loại thực thể cần truy vấn'
    }
  },
  q5: {
    endpoint: '/entity_occurrences_in_news',
    method: "GET",
    params: {
      id: 'ID của thực thể',
      newsIds: 'Danh sách ID của các bản tin cần xét'
    }
  },
  q6: {
    endpoint: '/entity_occurrences',
    method: "GET",
    params: {
      id: 'ID của thực thể'
    }
  },
  q7: {
    endpoint: '/news_has_entity_and_relationship',
    method: "GET",
    params: {
      sId: 'ID của thực thể chủ thể',
      relationship: 'Mối quan hệ giữa 2 thực thể',
      oId: 'ID của thực thể đối tượng'
    }
  },
  q8: {
    endpoint: '/entity_with_relationship',
    method: "GET",
    params: {
      id: 'ID của thực thể',
      relationship: 'Quan hệ của thực thể cần xét với các thực thể khác'
    }
  },
  q9: {
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
    endpoint: '/merge',
    method: "POST",
    params: {
      ids: 'Danh sách id của các thực thể cần tích hợp'
    }
  },
  q12: {
    endpoint: '/news',
    method: "POST",
    params: {
      file: 'File chứa bản tin và các thực thể, quan hệ được trích xuất từ bản tin này'
    }
  },
  q13: {
    endpoint: '/news/time',
    method: "GET",
    params: {
      start: 'Thời gian bắt đầu',
      end: 'Thời gian kết thúc'
    }
  },
  q14: {
    endpoint: '/statistics',
    method: "GET",
    params: {
      ids: 'Danh sách id của các thực thể cần thống kê',
    }
  },
  q15: {
    endpoint: '/location',
    method: "PATCH",
    params: {
      id: 'ID của thực thể vị trí',
    }
  },
  q16: {
    endpoint: '/raw-query',
    method: "POST",
    params: {
      query: "Câu query cypher"
    }
  }
}


const apiDescription = {
  get: (id) => API_DES[id]
}

export default apiDescription;
