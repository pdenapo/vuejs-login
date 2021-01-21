// authorization code for Luca

import { store } from '../main.js'
import { API_URL } from '../main.js'

const LOGIN_URL = API_URL + 'login'
const SIGNUP_URL = API_URL + 'signup'

async function getTokenAsync(creds) {

    console.log("Method getTokenAsync")
    console.log("We get data from " + API_URL + 'sign_in')
    let response = await fetch(API_URL + 'sign_in', {
        method: 'POST',
        headers: {
            'username': creds.username,
            'password': creds.password
        }
    })

    if (await response.status == 200) {
        let data = await response.json();
        return data.AuthToken
    }
    else
        return null
}


export default {
    API_URL: API_URL,

    /* Devuelve true si el login tiene éxito, false sino */
    login(context, creds) {
        var resultado

        var token = getTokenAsync(creds)

        if (token != null) {
            console.log("login exitoso! token=", token)
            store.commit('set_token', token)
            resultado = true
        }
        else {
            console.log("login fallido");
            resultado = false;
        }
        console.log("resultado=", resultado)
        return resultado;
    },

    /*
    signup(context, creds, redirect) {
        console.log("signup Method")

        context.$http.post(SIGNUP_URL, creds, (token) => {
            localStorage.setItem('AuthToken', token)

            user_authenticated = true

            if (redirect) {
                router.go(redirect)
            }

        }).error((err) => {
            context.error = err
        })
    },*/


}

