import { timingSafeEqual } from 'node:crypto'

interface LoginBody { email?: unknown; password?: unknown }

function safeEqual(value: string, expected: string) {
  const valueBuffer = Buffer.from(value)
  const expectedBuffer = Buffer.from(expected)
  return valueBuffer.length === expectedBuffer.length && timingSafeEqual(valueBuffer, expectedBuffer)
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const config = useRuntimeConfig(event)

  const validEmail = safeEqual(email, config.authEmail.toLowerCase())
  const validPassword = safeEqual(password, config.authPassword)
  if (!config.authEmail || !config.authPassword || !validEmail || !validPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  const user = { id: 'tunh-admin', email, name: 'Tunh Admin', role: 'admin' }
  await setUserSession(event, { user, loggedInAt: new Date().toISOString() })
  return { user }
})
