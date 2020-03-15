import React, { useState } from 'react';
import {
  News,
  Entity,
  RawQuery,
  Location,
  Statistics,
  NewsByTime,
  MergeEntity,
  EntityWithType,
  EntityOccurrences,
  EntityWithRelationship,
  EntityOccurrencesInNews,
  EntityWithOtherEntityInNews,
  NewsHasEntityAndRelationship,
  EntityWithRelationshipByMonth,
  EntityWithRelationshipByQuarter
} from './Questions';
import NewArticle from './News';
import { apiDes, questions } from './config';
import ListGroup from 'react-bootstrap/ListGroup';
import Description, { NewsDescription, descriptionsComp } from './component/ApiDescription';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

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
  q12: NewArticle,
  q13: NewsByTime,
  q14: Statistics,
  q15: Location,
  q16: RawQuery
};

function App() {
  const [currentQuestion, setQuestion] = useState(questions.default);

  const setCurrentQuestion = id => () => setQuestion(questions.get(id));

  const Details = QUESTION_COMPONENTS[currentQuestion.id];
  const DescriptionComp = descriptionsComp.get(currentQuestion.id);

  return (
    <div className="app container-fluid">
      <div className="row">
        <div className="col-md-2 h-100 overflow-scroll">
          <ListGroup>
            {
              questions.all().map((q, i) => (
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
        <div className="col-md-10 h-100">
          <div className="api-describe-and-demo row">
            <Description
              title={currentQuestion.content}
              apiDes={apiDes.get(currentQuestion.id)}
              element={() => <DescriptionComp />}
            />
            <div className="col-md-7 h-100 overflow-scroll">
              <h3>Demo</h3>
              <Details question={currentQuestion} apiDes={apiDes.get(currentQuestion.id)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
