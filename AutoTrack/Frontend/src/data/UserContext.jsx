import { createContext, useContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("autotube-user");
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("Autotube-user", JSON.stringify(user));
        }
    }, [user]);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);