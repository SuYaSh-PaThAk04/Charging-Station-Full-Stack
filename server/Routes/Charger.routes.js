import express from 'express';
import {
  getAllChargers,
  createCharger,
  updateCharger,
  deleteCharger
} from '../Controller/Charger.controllers.js';
import VerifyJWT from '../Middlewares/verifyJWT.middleware.js';

const routerC = express.Router();

routerC.get('/all', VerifyJWT, getAllChargers);
routerC.post('/create', createCharger);
routerC.put('/update/:id', VerifyJWT, updateCharger);
routerC.delete('/:id', VerifyJWT, deleteCharger);

export default routerC;
