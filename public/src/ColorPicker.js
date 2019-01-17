'use strict';

import * as rgb from '../lib/RGBColor.js';
const RGBColor = rgb.RGBColor;
import * as hsv from '../lib/HSVColor.js';
const HSVColor = hsv.HSVColor;
import * as hsl from '../lib/HSLColor.js';
const HSLColor = hsl.HSLColor;

import * as cb from './ColorBars.js';
const ColorBars = cb.ColorBars;

import * as cs from './ColorSample.js';
const ColorSample = cs.ColorSample;



export class Picker extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      sample:this.props.sample
    }
    this.update = this.update.bind(this);
  }

  update(newSample){
    this.setState({sample: newSample});
  }

  render() {
    let bars = React.createElement(ColorBars,{model:this.props.model, sample:this.state.sample, width:this.props.width, height: this.props.height, update: this.update});
    let sample = React.createElement(ColorSample, { model: this.props.model , sample: this.state.sample})


    return React.createElement('div',{
      className:"ColorPicker",
    },React.createElement("div",{className:"color-sample"},sample), bars)
  }
}

