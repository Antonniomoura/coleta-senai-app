function returnServer() {
  return process.env.REACT_APP_NODE_ENV === 'development' ?
    process.env.REACT_APP_URL_SERVER_DEV : process.env.REACT_APP_URL_SERVER_PROD;
}

export default returnServer;
