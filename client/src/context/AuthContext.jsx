import React, {createContext, useState, useEffect} from 'react';
import api from '../utils/axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("userInfo");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const {data} = await api.post('/auth/login', {email, password});
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem("token", data?.token);
            return data;
        } catch(error) {
            if (error.response?.data?.needsVerification) throw error.response.data;
            throw error.response?.data?.message || "Login failed";
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            return data;
        } catch (error) {
            throw error.response?.data?.error || error.response?.data?.message || 'Registration failed';
        }
    };

    const verifyOTP = async (email, otp) => {
        try {
            const {data} = await api.post('/auth/verify-otp', {
                email,
                otp: String(otp).replace(/\D/g, '').trim(),
            });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('token', data?.token);
            return data;
        } catch(error) {
            throw error.response?.data?.message || "OTP verification failed";
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
    };

    const resendAccountOTP = async (email, password) => {
        try {
            await api.post('/auth/login', { email, password });
        } catch (error) {
            if (error.response?.status === 503 && error.response?.data?.needsVerification) {
                throw error.response?.data?.message || 'Unable to send verification email';
            }
            if (error.response?.data?.needsVerification) {
                return { message: 'OTP sent successfully' };
            }
            throw error.response?.data?.message || error.response?.data?.error || 'Failed to resend OTP';
        }
        throw new Error('Account is already verified. Please sign in.');
    };

    return (
        <AuthContext.Provider value={{user, login, register, verifyOTP, resendAccountOTP, logout, loading}}>
            {!loading && children}
        </AuthContext.Provider>
    );
};