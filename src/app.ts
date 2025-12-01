import { sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { sign, verify } from 'hono/jwt'
import { db } from './core/db/index.js'
import { sendAcceptanceEmail } from './utils/email.js'
import { JWT_SECRET } from './utils/constants.js'

const app = new Hono()

app.use('*', cors({
  origin: '*',
}))

app.get('/', (c) => {
  return c.json({
    message: 'Hello World',
  })
})

app.get('/notify', async (c) => {
  const isAcceptedParam = c.req.query('isAccepted')
  
  if (!isAcceptedParam) {
    return c.json({
      success: false,
      message: 'Missing isAccepted query parameter',
    }, 400)
  }

  const isAccepted = isAcceptedParam.toLowerCase() === 'true'
  
  const result = await sendAcceptanceEmail(isAccepted)
  
  if (result.success) {
    return c.json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId,
    }, 200)
  }
  else {
    return c.json({
      success: false,
      message: 'Failed to send email',
      error: result.error,
    }, 500)
  }
})

app.post('/secure/login', async (c) => {
  const body = await c.req.json()
  const response = await db.run(sql`select username, password from users where username = ${body.username} and password = ${body.password}`)
  try {
    const username = response.rows[0].username
    const payload = {
      sub: username,
      exp: Math.floor(Date.now() / 1000) + 60 * 5,
    }
    const token = await sign(payload, JWT_SECRET)
    return c.json({
      username,
      token,
    }, { status: 201 })
  }
  catch (e) {
    return c.json({
      username: null,
      token: null,
    }, 401)
  }
})

app.get('/secure/validtoken', async (c) => {
  const tokenToVerify: string | undefined = c.req.query('token')
  try {
    await verify(tokenToVerify || '', JWT_SECRET)
    return c.json({
      isValidToken: true,
    }, 200)
  }
  catch (e) {
    return c.json({
      isValidToken: false,
    }, 200)
  }
})

app.post('/login', async (c) => {
  const body = await c.req.json()
  const response = await db.$client.execute(`select username, password from users where username = '${body.username}' and password = '${body.password}'`)
  try {
    const username = response.rows[0].username
    const payload = {
      sub: username,
      exp: Math.floor(Date.now() / 1000) + 60 * 5,
    }
    const token = await sign(payload, JWT_SECRET)
    return c.json({
      token,
    })
  }
  catch (e) {
    return c.json({
      token: null,
    }, 401)
  }
})

app.get('/generatetoken', async (c) => {
  const tokenToVerify: string | undefined = c.req.query('token')
  try {
    await verify(tokenToVerify || '', JWT_SECRET)
  }
  catch (e) {
    return c.json({
      message: 'Invalid token',
    }, 401)
  }

  const response = await fetch('https://glitch-operation.vercel.app/api/v1/contest-submission/1')
  const { uniqueGeneratedCode } = await response.json()

  return c.json({
    message: uniqueGeneratedCode,
  }, 200)
})

app.get('/generatetoken/source-map-exploitation', async (c) => {
  const tokenToVerify: string | undefined = c.req.query('token')
  try {
    await verify(tokenToVerify || '', JWT_SECRET)
  }
  catch (e) {
    return c.json({
      message: 'Invalid token',
    }, 401)
  }

  const response = await fetch('https://glitch-operation.vercel.app/api/v1/contest-submission/4')
  const { uniqueGeneratedCode } = await response.json()

  return c.json({
    message: uniqueGeneratedCode,
  }, 200)
})

export default app
