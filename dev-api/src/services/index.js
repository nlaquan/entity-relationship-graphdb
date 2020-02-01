function Service() {
  let internalServices = null;
  const use = services => internalServices = services;

  return {
    use
  }
}

module.exports = new Service();
