
const jsonfile = require('jsonfile');

const walletRoutes = (app, fs) => {
    const dataPath = './data/wallet.json';
    const apiPrefix = "/api/v1";
    const readFile = (callback, returnJson = false, req, filePath = dataPath, encoding = 'utf8') => {
        const username = req.headers.authorization;
        if(username!==undefined && username!=='')
        {
            filePath = './data/wallet_'+username+'.json';
        }
        data = jsonfile.readFileSync(filePath);
        data = JSON.parse(data);
        callback(data);
    };

    const writeFile = (fileData, callback, req, filePath = dataPath, encoding = 'utf8') => {
        const username = req.headers.authorization;
        if(username!==undefined && username!=='')
        {
            filePath = './data/wallet_'+username+'.json';
        }
        jsonfile.writeFileSync(filePath, fileData)
        callback();
    };

    // function 
    // All wallets
    app.get(apiPrefix+'/wallets', (req, res) => {
        readFile(data => {
            let transactions = [];
            if(data.transactions.length!==0)
            {
                transactions = data.transactions.filter(i=>i.isDelete===false);
            }
            let wallet = {
                walletBalance : data.walletBalance,
                transactions:transactions
            }
            res.send(wallet);
        },
            true,req);
    });

    // Get wallet
    app.get(apiPrefix+'/wallet/:id', (req, res) => {
        readFile(data => {
            const walletId = req.params["id"];
            // get the wallet
            let wallet = data.transactions.filter(i=>i.id===parseInt(walletId))[0];
            res.status(200).send(wallet);
        },
            true,req);
    });

    // Create Wallet
    app.post(apiPrefix+'/wallets', (req, res) => {
        readFile(data => {
            const walletId = data.transactions.length + 1;
            // add the new wallet
           var input= req.body;
           input.id=walletId;
           input.isDelete = false;
         if(input.expense!==0){
            data.walletBalance= data.walletBalance- parseInt(input.expense);
         }
         else{
            data.walletBalance= data.walletBalance + parseInt(input.income);
         } 
           data.transactions.push(input);
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send('wallet added Successfully');
            },req);
        },true,req);
    });


    // Update wallet
    app.put(apiPrefix+'/wallet/:id', (req, res) => {
        readFile(data => {
          let totalincome=0;
          let totalexpense=0;
            // update the wallet
            const walletId = req.params["id"];
            var input= req.body;
            input.id=walletId;
            input.isDelete=false;
            let currentdata = data.transactions.filter(i=>i.id===parseInt(walletId))[0];
            var balcal=data.transactions.filter(i=>i.isDelete===false);
            for(let k=0;k<balcal.length;k++)
            {
                totalincome +=balcal[k].income;
                totalexpense +=balcal[k].expense;
            }
            if(currentdata.expense!==input.expense || currentdata.income!==input.income)
            {
            if(input.expense!==0){
                data.walletBalance= totalincome - (totalexpense-currentdata.expense+parseInt(input.expense));
             }
             else{
                data.walletBalance= (totalincome-currentdata.income+parseInt(input.income))-totalexpense;
             }                
            }
            data.transactions[walletId-1] = input;
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`wallet id:${walletId} updated Successfully`);
            },req);
        },
            true,req);
    });


    // delete the wallet
    app.delete(apiPrefix+'/wallet/:id', (req, res) => {
        readFile(data => {
            // delete the wallet
            const walletId = req.params["id"];
            let input = data.transactions.filter(i=>i.id===parseInt(walletId));
            input.isDelete = true;
            if(input.expense!==0){
                data.walletBalance= data.walletBalance + parseInt(input.expense);
             }
             else{
                data.walletBalance= data.walletBalance - parseInt(input.income);
             } 
             data.transactions[walletId-1] = input;
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send(`wallet id removed Successfully`);
            },req);
        },
            true,req);
    });
};

module.exports = walletRoutes;