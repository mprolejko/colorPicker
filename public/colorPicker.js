'use strict';

import * as rgb from './lib/RGBColor.js';
const RGBColor = rgb.RGBColor;



class Strip extends React.Component{
  constructor(props) {
    super(props);
    const val = this.props.values;
    const c0 = Object.assign({}, val); 
    const c1 = Object.assign({}, val);
    c0[this.props.name] = 0;
    c1[this.props.name] = 1;
    
    this.state = {
      first: new this.props.model(c0),
      last: new this.props.model(c1)
    }
  }

  componentDidMount() {
    this.updateCanvas();
  }
  componentDidUpdate() {
      this.updateCanvas();
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');

    var grd = ctx.createLinearGradient(0, 0, this.props.width, 0);
    grd.addColorStop(0, this.state.first.getHEX().hex);
    grd.addColorStop(1, this.state.last.getHEX().hex);

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.props.width, this.props.height);
    }

  render() {
    const selector = React.createElement(Selector,{key:"selector", channel:this.props.name,color: new this.props.model(this.props.values)});
    const strip = React.createElement('canvas', {key:"strip", ref: "canvas", width:this.props.width, height:this.props.height});
    return React.createElement('div',{className:"strip"},[strip,selector]);
  }
}

class Selector extends React.Component{
  constructor(props) {
    super(props);
    var color = this.props.color;
    var channel = this.props.channel;
    this.state = {
      val : color.getRaw()[channel]
    }
  }

  render() {
    return React.createElement('div', {className:"selector", style:{backgroundColor: this.props.color.getHEX().hex, left: (100*this.state.val)+"%"}});
  }
}


class ColorBars extends React.Component {
  constructor(props) {
    super(props);
    let col = new RGBColor(this.props.sample)
    this.state = { 
      color: col, 
      style:{backgroundColor:col.getHEX().hex}};
  }

  render() {
    const model = new this.props.model();
    const channels = model.channels;

    const bars = []
    for(var i=0; i < channels.length; i++) {
      bars[i] = React.createElement(Strip,{
        key:channels[i],
        name:channels[i],
        model:this.props.model, 
        values:this.state.color.getRaw(), 
        width:this.props.width, 
        height: this.props.height
      });
    }

    return React.createElement('div', {}, bars)
  }

}

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

ReactDOM.render(React.createElement(ColorBars,{model:RGBColor, sample:{R: 70, G:130,B:220}, width:500, height: 30}), document.getElementById('stripRGB'));
