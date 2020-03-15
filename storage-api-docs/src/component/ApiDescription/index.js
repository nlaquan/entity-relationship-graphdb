import React from 'react';
import EndpointTable from '../EndpointTable';

import NewsDescription from './News';
import EntityDescription from './Entity';
import LocationDescription from './Location';
import RawQueryDescription from './RawQuery';
import StatisticsDescription from './Statistics';
import NewsByTimeDescription from './NewsByTime';
import MergeEntityDescription from './MergeEntity';
import EntityWithTypeDescription from './EntityWithType';
import EntityOccurrencesDescription from './EntityOccurrences';
import EntityWithRelationshipDecsription from './EntityWithRelationship';
import EntityOccurrencesInNewsDecription from './EntityOccurrencesInNews';
import EntityWithOtherEntityInNewsDescription from './EntityWithOtherEntityInNews';
import NewsHasEntityAndRelationshipDescription from './NewsHasEntityAndRelationship';
import EntityWithRelationshipByMonthDescription from './EntityWithRelationshipByMonth';
import EntityWithRelationshipByQuarterDescription from './EntityWithRelationshipByQuarter';

const DESCRIPTIONS = {
  q1: EntityDescription,
  q2: NewsDescription,
  q3: EntityWithOtherEntityInNewsDescription,
  q4: EntityWithTypeDescription,
  q5: EntityOccurrencesInNewsDecription,
  q6: EntityOccurrencesDescription,
  q7: NewsHasEntityAndRelationshipDescription,
  q8: EntityWithRelationshipDecsription,
  q9: EntityWithRelationshipByMonthDescription,
  q10: EntityWithRelationshipByQuarterDescription,
  q11: MergeEntityDescription,
  q12: EntityDescription,
  q13: NewsByTimeDescription,
  q14: StatisticsDescription,
  q15: LocationDescription,
  q16: RawQueryDescription
}

function Description({
  title,
  apiDes,
  element: Description
}) {
  return (
    <div className="api-describe col-md-5">
      <h3>{title}</h3>
      <b>Mô tả</b>
      <div>
        <Description />
      </div>
      <hr />
      <div className="endpoint">
        <div className="api-docs-get-method-color">{apiDes.method}</div>
        <div className="api-docs-endpoint-name-text">{apiDes.endpoint}</div>
      </div>
      <hr />
      <EndpointTable details={apiDes.params} />
    </div>
  );
}

const descriptionsComp = {
  get: id => DESCRIPTIONS[id]
}

export default Description;
export {
  descriptionsComp,
  NewsDescription,
  EntityDescription,
  LocationDescription,
  RawQueryDescription,
  StatisticsDescription,
  NewsByTimeDescription,
  MergeEntityDescription,
  EntityWithTypeDescription,
  EntityOccurrencesDescription,
  EntityWithRelationshipDecsription,
  EntityWithOtherEntityInNewsDescription,
  EntityWithRelationshipByMonthDescription,
  EntityWithRelationshipByQuarterDescription,
  NewsHasEntityAndRelationshipDescription,
};
