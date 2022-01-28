import { useContext, useEffect } from "react"
import { AuthContext } from "../conext/AuthContext"
import { api } from "../services/api"


export default function Dashboard  (){

    const {user} = useContext(AuthContext)

    useEffect(()=>{
        // token e o novo nome desse nextauth.token

            api.get('me').then(res =>{
              console.log(res)
            }).catch(console.log)
        
    },[])

    return(
        <h1>Ola mundo dashboard. teu e email e {user?.email}</h1>
    )
}