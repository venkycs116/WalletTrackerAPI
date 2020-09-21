const walletRoutes = require('./wallet');
const jsonfile = require('jsonfile');

const writeFile = (fileData, callback, filePath, encoding = 'utf8') => {
  jsonfile.writeFileSync(filePath, fileData)
  callback()
};

const appRouter = (app, fs) => {
    app.get('/api/v1/', (req, res) => {
        res.send('welcome to the api-assignment-wallet-tracker');
    });
    app.post('/api/v1/login', (req, res) => {
        const filePath = './data/wallet_'+req.body.username+'.json';
        const fileData = "{\n  \"walletBalance\": 0,\n  \"transactions\": []\n}";
        if (fs.existsSync(filePath)) {
            //file exists
          }
          else{
            writeFile(fileData, () => {
              res.status(200).send('wallet added Successfully');
          },filePath);
          }
    });
    walletRoutes(app, fs);
};

module.exports = appRouter;