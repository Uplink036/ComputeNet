const express = require('express');
const app = express();
const port = 3000;

let currentTask = 0;

app.set('view engine', 'pug');
app.disable('view cache');
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api/task', (req, res) => {
  res.json({ task: currentTask });
  currentTask += 1
});

app.listen(port, () => {
  console.log(`ComputeNet frontend running on port ${port}`);
});
