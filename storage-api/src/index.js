const cors = require('cors');
const app = require('express')();
const multer = require('multer');
const bodyParser = require('body-parser');
const upload = multer({ dest: 'uploads/' });
const readNeo4jConfig = require('./neo4jConfig');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

const neo4jDriver = require('./driver').neo4j;
const services = require('./services').use(neo4jDriver(readNeo4jConfig()));

const newsAPI = require('./api/news')(services);
const entityAPI = require('./api/entity')(services);
const locationAPI = require('./api/location')(services);
const rawAPI = require('./api/raw')(services);

const base = "er-services";

app.get(`/${base}/news`, (req, res) => newsAPI.getNews(req, res));

app.get(`/${base}/news_with_entity_type`,
  (req, res) => entityAPI.entityWithType(req, res)
);

app.get(`/${base}/news/time`,
  (req, res) => newsAPI.getNewsByTime(req, res)
)

app.patch(`/${base}/location/:id`,
  (req, res) => locationAPI.updateLocation(req, res)
)

app.get(`/${base}/statistics`,
  (req, res) => entityAPI.statistic(req, res)
)

app.post(`/${base}/raw-query`,
  (req, res) => rawAPI.rawQuery(req, res)
)

app.get(`/${base}/entity`,
  (req, res) => entityAPI.entity(req, res)
);

app.get(`/${base}/entity_has_rel_with_others_in_news`,
  (req, res) => entityAPI.entityHasRelWithOthersInNews(req, res)
);

app.get(`/${base}/entity_occurrences_in_news`,
  (req, res) => entityAPI.entityOccurencesInNews(req, res)
);

app.get(`/${base}/entity_occurrences`,
  (req, res) => entityAPI.entityOccurences(req, res)
);

app.get(`/${base}/news_has_entity_and_relationship`,
  (req, res) => newsAPI.getNewsHasEntityAndRelationship(req, res)
);

app.get(`/${base}/entity_with_relationship`,
  (req, res) => entityAPI.entityWithRelationship(req, res)
)

app.get(`/${base}/entity_with_relationship_by_month`,
  (req, res) => entityAPI.entityWithRelationshipByMonth(req, res)
)

app.get(`/${base}/entity_with_relationship_by_quarter`,
  (req, res) => entityAPI.entityWithRelationshipByQuarter(req, res)
)

app.post(`/${base}/merge`,
  (req, res) => entityAPI.mergeEntity(req, res)
)

app.post(`/${base}/news`,
  upload.single('file'), (req, res) => newsAPI.createNews(req, res)
);

const server = app.listen(process.env.PORT, console.log(`dev-api listen at ${process.env.PORT}`));

process.on('SIGTERM', function () {
  server.close(function () {
    neo4jDriver.close();
  });
});
