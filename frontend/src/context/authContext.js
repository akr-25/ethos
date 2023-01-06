import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./authReducer";

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isFetching: false,
    error: false,
};


export const AuthContext = createContext(INITIAL_STATE);

const AuthContextProvider = (props) => {
    const [userState, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(userState.user));
    }, [userState]);

    return (
        <AuthContext.Provider
            value={{
                user: userState.user,
                isFetching: userState.isFetching,
                error: userState.error,
                dispatch
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;