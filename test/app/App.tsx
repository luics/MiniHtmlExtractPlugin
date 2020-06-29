import React from 'react';
import ReactDOM from 'react-dom';
import { log } from '@test/util';
import Block from './BLock';
import './App.scss';

class App extends React.Component {
  render() {
    log('[App.render]');
    return <div className='app'>
      <h1>App</h1>
      <Block content='Hello' />
      <Block content='World' />
      <Block content='!!!' />
      <i className='fa fa-spinner fa-spin'></i>
      <i className='fa fa-cog fa-spin'></i>
      <br/><br/>
      <a href="./subapp">Subapp</a>
    </div>;
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);