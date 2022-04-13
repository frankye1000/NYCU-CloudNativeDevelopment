const { jwt } = require('config');
const express = require('express');
const { sign, verify } = require('jsonwebtoken');

const router = express.Router();

const checkAPIKey = (req, res, next) => {
  let accessToken = req.headers.authorization;

  // check the accessToken existence
  if (!accessToken) {
    return res.status(401).send({
      ok: false,
      message: 'the accessToken is not existed',
    });
  }

  // check the accessToken is compitable with Bearer one
  if (!accessToken.startsWith(`Bearer `)) {
    return res.status(401).send({
      ok: false,
      message: 'the accessToken is not bearer token',
    });
  }

  // verify the accessToken with secret
  accessToken = accessToken.split(' ')[1];
  try {
    const user = verify(accessToken, jwt.secret);
    req.headers.user = user;
  } catch (err) {
    return res.status(401).send({
      ok: false,
      message: 'the accessToken verification is failed',
    });
  }

  next();
};

router.post('/api/v1/jwts/generation', async (req, res) => {
  const { username, password, role } = req.body;

  if (password !== 'abcd1234') {
    return res.status(401).send({
      ok: false,
      message: 'the password is missing or not corrected',
    });
  }

  const accessToken = sign({ username, role }, jwt.secret);

  res.status(200).send({
    accessToken,
  });
});

router.post('/api/v1/jwts/verification', checkAPIKey, async (req, res) => {
  const user = req.headers.user;

  if (user.role === 'super' || user.role === 'admin') {
    return res.status(200).send({
      ok: true,
      message: 'the user is authenticated and authorized',
      user,
    });
  } else {
    return res.status(200).send({
      ok: false,
      message: 'the user is authenticted, but not authorized',
      user,
    });
  }
});

module.exports = router;
