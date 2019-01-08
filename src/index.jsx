// Application entrypoint.

// Load up the application styles
require("../styles/application.scss");

// Render the top-level React component
import React from 'react';
import ReactDOM from 'react-dom';
// import Message from './Message.jsx';
import App from './App.jsx';

// ReactDOM.render(<ChatBar />, document.getElementById(''));
ReactDOM.render(<App />, document.getElementById('react-root'));
// ReactDOM.render(<Message />, document.getElementById('message'));


