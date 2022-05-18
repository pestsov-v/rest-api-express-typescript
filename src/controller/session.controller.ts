import {Request, Response} from 'express'
import {validatePassword} from "../service/user.service";
import {createSession, findSessions, updateSession} from "../service/session.service";
import {signJwt} from "../utils/jwt.utils";
import config from "config";

export async function createUserSessionHandler (req: Request, res: Response) {
    const user = await validatePassword(req.body)
    if (!user) return res.status(401).send('Неверный логин или пароль')

    const session = await createSession(user._id, req.get('user-agent') || '')

    console.log(session)

    const accessToken = signJwt({
            ...user,
            session: session._id
        },
        {
            expiresIn: config.get('accessTokenTtl')
        }
    )

    const refreshToken = signJwt({
            ...user,
            session: session._id
        },
        {
            expiresIn: config.get('refreshTokenTtl')
        }
    )

    return res.send({
        accessToken,
        refreshToken
    })
}

export async function getUserSessionsHandler(req: Request, res: Response) {
    const userId = res.locals.user._id;

    const sessions = await findSessions({ user: userId, valid: true });

    return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
    const sessionId = res.locals.user.session

    await updateSession({_id: sessionId}, { valid: false })

    return res.status(200).send({
        accessToken: null,
        refreshToken: null
    })
}