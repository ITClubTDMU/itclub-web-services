import express from "express";


const app = express();



const hostname = 'localhost';
const port = 4444


app.get('/', (req, res) => {
  res.send('<h1>alsdjflasjdlfkj</h1>')
})


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});