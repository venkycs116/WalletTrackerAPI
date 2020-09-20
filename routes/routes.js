const walletRoutes = require('./wallet');

const appRouter = (app, fs) => {

    app.get('/', (req, res) => {
        res.send('welcome to the api-assignment-wallet-tracker');
    });

    app.post('/api/v1/login', (req, res) => {
        const filePath = './data/wallet_'+req.body.username+'.json';
        const sampleData = {
            "walletBalance": 0,
            "transactions": []
          };
        const fileData = JSON.stringify(sampleData);
        if (fs.existsSync(filePath)) {
            //file exists
          }
          else{
            fs.writeFile(filePath, fileData, 'utf8', (err) => {
            });
          }
          res.status(200).send("LoggedIn Successfully");
    });
    
    walletRoutes(app, fs);

};

module.exports = appRouter;