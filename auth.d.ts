declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    name: string
    role: 'admin'
  }
  interface UserSession {
    loggedInAt: string
  }
}

export {}
