import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Post from './Post';

// Get the element by ID (matches your Blade div)
const container = document.getElementById('post');

// Render React component without JSX
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Post));

