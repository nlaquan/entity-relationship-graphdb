const updateLocation = driver => ({ id, lat, long }) => {
  const session = driver.session();

  const queryString =
    `match (l:Location) where ID(l) = ${id}
     set l += {lat: "${lat}", long: "${long}"}
    `

  return session.run(queryString)
    .then(result => {
      session.close();
      return { response: true };
    }).catch(err => {
      console.log('err', err);
      return { response: false }
    })
}

module.exports = {
  updateLocation
}
