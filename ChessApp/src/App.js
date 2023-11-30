import React from 'react';
import Chessboard from './components/Chessboard';

const App = () => {
    return (
        <div>
            <h1>Chessboard Example</h1>
            <Chessboard size={10} />
        </div>
    );
};

export default App;