import '../css/main.less';
import React from 'react';
import ReactDOM from 'react-dom';

// Required for work on iOS 9b
import 'babel-polyfill';

import LoyaltyApp from './loyalty';


ReactDOM.render(<LoyaltyApp />, document.getElementById('app-container'));
