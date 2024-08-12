import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import Header from '../header.js';
import Footer from '../footer.js';

export default function PageLogout() {
    const secureStorage = secureLocalStorage.default;
    const navigate = useNavigate();

    useEffect(() => {
        secureStorage.clear();
        navigate('/');
    }, [])

    return (
        <>
            <Header />

            <Footer />
        </>
    )
} 