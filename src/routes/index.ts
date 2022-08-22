import express from 'express';
const routes = express.Router();
import { resizeController } from '../controllers/index';

routes.get('/', resizeController);

export default routes;
