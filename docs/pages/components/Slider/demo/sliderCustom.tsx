import * as React from 'react';
import { Slider } from '@yoshino/components/';

export default class App extends React.Component {
  state = {
    value: 30,
  };

  render() {
    return (
      <Slider
          value={this.state.value}
          min={-100}
          max={100}
          step={5}
          onChange={(value) => {
          console.log('当前值:', value);
          this.setState({value});
        }}
      />
    );
  }
}
