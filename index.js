require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./src/routes');
const app = express();

const port = process.env.PORT_ENV || 5000;
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use('/api/v1', router);
app.use('/', (req, res) => {
    res.json({ msg: 'Welcome Kawan' });
  });
  

app.listen(port, () => console.log(`server running on port : ${port}`));
