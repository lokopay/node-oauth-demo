// Fill in your client ID and client secret that you obtained
// while registering the application
const clientID = 'f31c93f8e1dacd2c5870'
const clientSecret = '39842fd9d53d31f5d0fca2497be439b526c30ad5'

const Koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const route = require('koa-route');
const axios = require('axios');

const app = new Koa();

const main = serve(path.join(__dirname + '/public'));

const oauth = async ctx => {
  const requestToken = ctx.request.query.code;
  console.log('authorization code:', requestToken);

  const tokenResponse = await axios({
    method: 'post',
    url: 'https://github.com/login/oauth/access_token?' +
      `client_id=${clientID}&` +
      `client_secret=${clientSecret}&` +
      `code=${requestToken}`,
    headers: {
      accept: 'application/json'
    }
  });

  const accessToken = tokenResponse.data.access_token;
  console.log(`access token: ${accessToken}`);

  const result = await axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      accept: 'application/json',
      Authorization: `token ${accessToken}`
    }
  });
  console.log(result.data);
  const name = result.data.name;
  const avatarUrl = result.data.avatar_url;
  
  ctx.response.redirect(`/welcome.html?name=${name}&avatar=${avatarUrl}`);
  // in prod, reidrect to a page, then on page mount, another user info request to get the name & avatar
};

app.use(main);
app.use(route.get('/oauth/redirect', oauth));

app.listen(8080);

console.log(`app running on http://localhost:8080`)
