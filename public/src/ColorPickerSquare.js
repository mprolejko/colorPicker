'use strict';

import * as cr from './ColorRect.js';
const ColorRect = cr.ColorRect;

import * as cb from './ColorBars.js';
const Strip = cb.Strip;

import * as cs from './ColorSample.js';
const ColorSample = cs.ColorSample;


export class ColorPickerSquare extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      sample:this.props.sample,
      color: new this.props.model(this.props.sample)
    }
    this.update = this.update.bind(this);
  }

  update(newSample){
    this.setState({
      sample: newSample,
      color: new this.props.model(newSample)
    });
  }


  render() {
    let singleChannel = this.props.channel;
    const channels = this.state.color.channels;
    var index = channels.indexOf(singleChannel);
    if (index > -1) {
      channels.splice(index, 1);
    }

    let square = React.createElement(ColorRect,{
      model:this.props.model, 
      channels: channels, 
      sample:this.state.sample, 
      width:this.props.width, 
      height: this.props.width, 
      update: this.update
    });
    let bars = React.createElement(Strip,{
      key:singleChannel,
      name:singleChannel,
      updateColor: this.update,
      model:this.props.model, 
      values: this.state.color.getRaw(), 
      width:this.props.width, 
      height: this.props.height
    }, square);
    let sample = React.createElement(ColorSample, { 
      model: this.props.model , 
      sample: this.state.sample
    });


    return React.createElement('div',{
      className:"ColorPicker",
    }, bars,square, React.createElement("div",{className:"color-sample"},sample));
  }
}

