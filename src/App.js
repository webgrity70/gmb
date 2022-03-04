import React from 'react';
import { hot } from 'react-hot-loader/root';
import GMB from './GMB';

const App = () => <GMB />;

export default process.env.NODE_ENV === 'development' ? hot(App) : App;
