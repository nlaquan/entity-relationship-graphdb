const API = require('../base');

function EntityAPI(service) {
  API.call(this, service);

  async function entity(req, res) {
    const { label, name, isExact } = req.query;

    try {
      const responsedData = await service.entity({ label, name, isExact: isExact ? true : false });
      res.send(responsedData);
    } catch (err) {
      console.log('err', err);
      res.send(err);
    }
  }

  async function entityOccurencesInNews(req, res) {
    const { id, links } = req.query;
    const _links = links.split(',');

    try {
      const responsedData = await service.entityOccurencesInNews({ links: _links, id });
      res.send(responsedData);
    } catch (err) {
      console.log('err', err);
      res.send(err);
    }
  }

  async function entityOccurences(req, res) {
    const { id } = req.query;

    try {
      const responsedData = await service.entityOccurences(id);
      res.send(responsedData);
    } catch (err) {
      console.log('err', err);
      res.send(err);
    }
  }

  async function entityWithType(req, res) {
    const { labels: labelsString, links: linksString } = req.query;

    const links = linksString.trim().split(',');
    const labels = labelsString.trim().split(',');

    try {
      const responsedData = await service.entityWithType({ labels, links });
      res.send(responsedData);
    } catch (err) {
      console.log('err', err);
      res.send(err);
    }
  }

  async function entityHasRelWithOthersInNews(req, res) {
    const { links, id } = req.query;
    const _links = links.split(',');

    try {
      const responsedData = await service.entityHasRelWithOthersInNews({ links: _links, id });
      res.send(responsedData);
    } catch (err) {
      console.log('err', err);
      res.send(err);
    }
  }

  async function mergeEntity(req, res) {
    // console.log('req.query', req.query);
    const _ids = req.query.ids.split(',');

    try {
      const responsedData = await service.mergeEntity(_ids);
      res.send(responsedData);
    } catch (err) {
      console.log('err', err);
      res.send(err);
    }
  }

  async function entityWithRelationship(req, res) {
    const { id, relationship } = req.query;
    // console.log('query', req.query);
    // console.log('id', id);
    // console.log('rel', relationship);

    try {
      const responsedData = await service.entityWithRelationship({ id, relationship });
      res.send(responsedData);
    } catch (err) {
      console.log('err', err);
      res.send(err);
    }
  }

  async function entityWithRelationshipByMonth(req, res) {
    const { id, relationship, month, year } = req.query;

    try {
      const responsedData = await service.entityWithRelationshipByMonth({
        id, relationship, month, year
      });
      res.send(responsedData);
    } catch (err) {
      console.log('err', err);
      res.send(err);
    }
  }

  async function entityWithRelationshipByQuarter(req, res) {
    const { id, relationship, quarter, year } = req.query;

    try {
      const responsedData = await service.entityWithRelationshipByQuarter({
        id, relationship, quarter, year
      });
      res.send(responsedData);
    } catch (err) {
      console.log('err', err);
      res.send(err);
    }
  }

  async function statistic(req, res) {
    const { ids: rawIds } = req.query;
    const idsString = rawIds.split(',');

    const ids = idsString.map(id => parseInt(id, 10));

    try {
      const responsedData = await service.statistic(ids);
      res.send(responsedData);
    } catch (err) {
      console.log('err', err);
      res.send(err);
    }
  }

  return {
    entity,
    mergeEntity,
    entityWithType,
    entityOccurences,
    entityHasRelWithOthersInNews,
    entityOccurencesInNews,
    entityWithRelationship,
    entityWithRelationshipByMonth,
    entityWithRelationshipByQuarter,
    statistic
  }
}

module.exports = EntityAPI;
