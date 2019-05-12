'use strict';

const path = require('path');
const fsPromises = require('fs').promises;
const bodyParser = require('body-parser');

module.exports = function mockerDataWebpack(options = {}) {
  options.prefix = options.prefix || '/api';
  options.path = options.path || 'mock';

  return function mockerDataMiddleware(app) {
    app.use(bodyParser.json());

    const { prefix } = options;
    app.all(`${prefix}/*`, async (req, res) => {
      res.set('Cache-Control', 'no-store');

      let apis = {};
      try {
        let dir = options.path;
        if (!path.isAbsolute(dir)) {
          dir = path.join(process.cwd(), dir);
        }
        const files = await fsPromises.readdir(dir);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          delete require.cache[filePath];
          apis = { ...apis, ...require(filePath) };
        });
      } catch (error) {
        return res.sendStatus(404);
      }

      const pathname = req.path.replace(prefix, '');
      const api = apis[pathname];

      if (api === undefined) {
        return res.sendStatus(404);
      }

      let params;
      if (req.method === 'GET') {
        params = req.query;
      } else if (req.method === 'POST') {
        params = req.body;
      } else {
        return res.sendStatus(405);
      }

      const data = typeof api === 'function' ? api(params) : api;
      if (!data || typeof data !== 'object') {
        return res.sendStatus(500);
      } else {
        res.json(data);
      }
    });
  };
};
