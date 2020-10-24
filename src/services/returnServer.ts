function returnServer() {
  return process.env.REACT_APP_NODE_ENV !== 'development' ?
    process.env.REACT_APP_URL_SERVER_PROD : process.env.REACT_APP_URL_SERVER_DEV;
}

export default returnServer;
