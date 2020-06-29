import React from 'react';

type P = { content: string };
type S = { value: number };

export default class Block extends React.Component<P, S> {

  state: S = { value: 0 };
  private timerId: any;

  componentDidMount() {
    this.timerId = setInterval(() => {
      this.setState({ value: this.state.value + 1 })
    }, 500 + Math.random() * 500);
  }

  componentWillUnmount() {
    if (this.timerId) clearInterval(this.timerId);
  }

  render() { 
    return <div className="block">
      {this.props.content} - {this.state.value}
    </div>;
  }

}