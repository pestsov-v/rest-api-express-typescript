import {Express, Request, Response} from "express";
import {createUserHandler} from "./controller/user.controller";
import validateResourse from "./middleware/validateResourse";
import {createUserSchema} from "./schema/user.schema";
import {createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler} from "./controller/session.controller";
import {createSessionSchema} from "./schema/session.schema";
import requireUser from "./middleware/requireUser";

function routes (app: Express) {
    app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200))


    app.post('/api/users', validateResourse(createUserSchema), createUserHandler)
    app.post('/api/sessions', validateResourse(createSessionSchema), createUserSessionHandler)
    app.get('/api/sessions', requireUser, getUserSessionsHandler)
    app.delete('/api/sessions', requireUser, deleteSessionHandler)

}

export default routes