import express, { Router } from 'express';
import { redirect, shortenUrl } from './controllers/index.controllers';

const app = express();

const taskRouter = Router();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

taskRouter.post('/shorten', shortenUrl);
taskRouter.get('/redirect/:code', redirect);


app.use(taskRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
