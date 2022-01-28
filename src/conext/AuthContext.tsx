import Router from "next/router"
import { createContext, ReactNode, useEffect, useState } from "react"

import { setCookie, parseCookies } from 'nookies'
import { api } from "../services/api"

interface AuthProviderProps{
    children: ReactNode
    // reactNode e quando o component pode receber qualquer coisa__
    // component number, string etc.. 
}

type User = {
    email: string;
    permissions: string[];
    roles: string[];
}

type SignCredentils = {
    email: string;
    password: string;
   
}

type AuthContextData = {
    signIn(credentils: SignCredentils): Promise<void>;
    user: User
    isAuthenticated: boolean;
}
  
  type SignInCredentials = {
    email: string;
    password: string
  }
    
  
  export const AuthContext = createContext({} as AuthContextData)
  
  export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>(null)
    const isAuthenticated = !!user
  
    useEffect(() => {
      const { 'nextauth.token': token } = parseCookies();
      if (token) {
        api.get('/me')
          .then(response => {
            const { email, permissions, roles } = response.data;
            setUser({ email, permissions, roles })
  
          }).catch(console.log)
      }
    }, [])
  
  
  
    async function signIn({ email, password }: SignInCredentials) {
  
      try {
        const response = await api.post('/sessions', { email, password })
  
        const { token, refreshToken, permissions, roles } = response.data
  
        setCookie(undefined, 'nextauth.token', token, {
          maxAge: 60 * 60 * 24 * 30, //30 days
          path: '/'
        })
        setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
          maxAge: 60 * 60 * 24 * 30, //30 days
          path: '/'
        })
  
        setUser({
          email,
          permissions,
          roles
        })
  
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        // atulizar o token
        
        Router.push("/dashboard")
      } catch (error) {
        console.warn(error)
      }
  
    }
  
    return (
      <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
        {children}
      </AuthContext.Provider>
    )
  }