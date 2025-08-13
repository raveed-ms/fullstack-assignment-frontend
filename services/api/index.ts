import { createAuthClient, createNakamaClient } from './client'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { NakamaService } from './nakama.service'

// Create singleton instances
const authClient = createAuthClient()
const nakamaClient = createNakamaClient()

export const authService = new AuthService(authClient)
export const usersService = new UsersService(authClient)
export const nakamaService = new NakamaService(nakamaClient)

// Export the services for use in composables
export { AuthService, UsersService, NakamaService }
export { createAuthClient, createNakamaClient } 