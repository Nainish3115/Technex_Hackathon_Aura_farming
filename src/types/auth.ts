export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    phoneNumber?: string
    userType: 'patient' | 'caregiver' | 'family'
    dateOfBirth?: string
    createdAt: string
    updatedAt: string
  }
  
  export interface AuthState {
    user: User | null
    loading: boolean
    error: string | null
  }