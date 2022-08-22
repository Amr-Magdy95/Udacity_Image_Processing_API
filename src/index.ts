import express, { Request, Response } from 'express';
import * as path from 'path';
import routes from './routes/index';

// server constants
const app = express();
const port = 3000;

// setting up assets folder and ejs engine for displaying images
app.use(express.static(path.join(__dirname, '..', 'assets')));
app.set('view engine', 'ejs');

// project routes
app.use('/resize', routes);

// start server
app.listen(port, () => {
  console.log(`the server has now started listening on port : ${port}`);
});
