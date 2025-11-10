// src/App.js
import React, { useEffect, useState } from 'react';

const App = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/details')
            .then((response) => response.json())
            .then((data) => {
                setUsers(data);
            })
            .catch((error) => {
                console.error('出错:', error);
            });
    }, []);

    return (
        <div>
           
        </div>
    );
};

export default App;