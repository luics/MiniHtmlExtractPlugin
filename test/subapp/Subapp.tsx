import React from 'react';
import ReactDOM from 'react-dom';
import { log } from '@test/util';
import Block from './Block';

class Subapp extends React.Component {
  render() {
    log('[Subapp.render]');
    return <div className='app'>
      <h1>Subapp</h1>
      <Block content='Block' />
      <i className='fa fa-spinner fa-spin'></i>
      <i className='fa fa-cog fa-spin'></i>
    </div>;
  }
}

ReactDOM.render(
  <Subapp />,
  document.getElementById('root')
);