import { Hono } from 'hono';
import { db } from './core/db/index.js';
import { sign, verify } from 'hono/jwt';
import { JWT_SECRET } from './utils/constants.js';
import { v4 as uuidv4 } from 'uuid';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors({
    origin: "*"
}));

app.get('/', (c) => {
    return c.json({
        message: 'Hello World',
    });
})

app.post("/login", async (c) => {
    const body = await c.req.json();
    const response = await db.$client.execute(`select username, password from users where username = '${body.username}' and password = '${body.password}'`);
    try {
        const username = response.rows[0]['username']
        const payload = {
          sub: username,
          exp: Math.floor(Date.now() / 1000) + 60 * 5,
        }
        const token = await sign(payload, JWT_SECRET);
        return c.json({
            token: token
        });
    } catch(e) {
        return c.json({
            token: null
        }, 401);
    }

})

app.get("/generatetoken", async (c) => {
    let tokenToVerify: string | undefined = c.req.query("token");
    try {
        await verify(tokenToVerify || "", JWT_SECRET);
    } catch (e) {
        return c.json({
            message: "Invalid token",
        }, 401);
    }

    const response = await fetch('https://glitch-operation.vercel.app/api/v1/contest-submission/1');
    const { uniqueGeneratedCode } = await response.json();

    return c.json({
        message: uniqueGeneratedCode,
    }, 200);

})

export default app;
