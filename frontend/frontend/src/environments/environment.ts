export const environment = {
  production: false,
  auth0: {
    domain: 'dev-fdjyqqnyvd12ig7u.us.auth0.com',
    clientId: 'CwYWpwjJ16FcrBiZqQ4nDABWYpMf4cZT',
    authorizationParams: {
      audience: 'https://myapp-api',
      redirect_uri: window.location.origin
    },
    httpInterceptor: {
      allowedList: [
        {
          uri: 'http://localhost:5114/api/*',
          tokenOptions: {
            authorizationParams: {
              audience: 'https://myapp-api',
            }
          }
        },
        {
          uri: 'https://localhost:7114/api/*',
          tokenOptions: {
            authorizationParams: {
              audience: 'https://myapp-api',
            }
          }
        }
      ]
    }
  }
};
