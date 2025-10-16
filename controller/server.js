const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.disable('view cache');
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`ComputeNet frontend running on port ${port}`);
});
