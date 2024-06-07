import React from 'react';
import Header from '../header.js';
import Footer from '../footer.js';
import Category from '../category.js';

export default class CodeList extends React.Component {
    render() {
        return (
            <React.StrictMode>
                <Header />
                <main>
                    <Category />
                </main>
                <Footer />
            </React.StrictMode>
        );
    }
}