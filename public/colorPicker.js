'use strict';

import * as c from './lib/RGBColor.js';
const RGBColor = c.RGBColor;



class ColorSample extends React.Component {
  constructor(props) {
    super(props);
    let col = new RGBColor(this.props.sample)
    this.state = { 
      color: col, 
      selected: false,
      style:{backgroundColor:col.getHEX().hex}};
  }

  render() {
    return React.createElement('div',
        {style:this.state.style},
        this.state.style.backgroundColor
    )
  }
}

document.querySelectorAll('.color-sample')
  .forEach(domContainer => {

    const sampleID = parseInt(domContainer.dataset.sampleid, 10);
    const channels = domContainer.dataset.sample.split(",")
    const sample = {R:parseInt(channels[0], 10), G:parseInt(channels[1], 10), B:parseInt(channels[1], 10)};
    ReactDOM.render(
      React.createElement(ColorSample, { sampleID: sampleID , sample: sample}),
      domContainer
    );
});