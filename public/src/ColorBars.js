'use strict';

export class Strip extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
        isDragged: false,
        value: this.props.values[this.props.name]
      }
    this.setColor = this.setColor.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
  }
  mouseDown(event){
      this.setState({isDragged: true});
      this.setColor(event)
  }
  mouseUp(){
    this.setState({isDragged: false});
  }
  mouseMove(e){
    if(this.state.isDragged){
      this.setColor(e);
    }
  }

  setColor(event){
    let color = this.props.values;
    let newVal = color[this.props.name];
    if (event.type=="mousedown"){
      let x= event.pageX - event.target.closest(".strip").offsetLeft
      newVal = x / this.props.width;
    }
    else if(event.type=="mousemove"){
      newVal += event.movementX / this.props.width;
    }
    if(typeof newVal !== "undefined" && !isNaN(newVal)){
      this.setState({value:newVal});
      color[this.props.name] = newVal;
      this.props.updateColor(color);
    }
  };

  componentDidMount() {
    this.updateCanvas();
  }
  componentDidUpdate() {
    this.updateCanvas();
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    var grd = ctx.createLinearGradient(0, 0, this.props.width, 0);
    var steps = 24;
    for (var i = 0; i < steps; i++){
        let col = Object.assign({}, this.props.values); 
        col[this.props.name] = i * (1 / (steps - 1));
        let color =  new this.props.model(col);
        grd.addColorStop(col[this.props.name], color.getHEX().hex);
    }
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.props.width, this.props.height);
  }

  render() {
    let color =  new this.props.model(this.props.values);
    let left = (100 * color.getRaw()[this.props.name])+"%";
    const selector = React.createElement('div', {
      className:"selector", 
      style: {
        backgroundColor: color.getHEX().hex, 
        left: left
      }
    });
    const strip = React.createElement('canvas', {
      ref: "canvas", 
      width: this.props.width, 
      height: this.props.height,
     
    });
    return React.createElement('div',{
      className:"Strip",
      onMouseMove: this.mouseMove,
      onMouseDown: this.mouseDown,
      onMouseUp: this.mouseUp
    },strip,selector);
  }
}


export class ColorBars extends React.Component {
  constructor(props) {
    super(props);
    this.updateColor = this.updateColor.bind(this)
    this.state = { 
      color: new this.props.model(this.props.sample)
    };
  }

  updateColor(newColor){
    let color =  new this.props.model(newColor);
    this.setState({
      color: color
    });
    if(typeof this.props.update == 'function')
      this.props.update(newColor);
  };

  render() {
    const model = new this.props.model();
    const channels = model.channels;

    const bars = []
    for(var i=0; i < channels.length; i++) {
      bars[i] = React.createElement(Strip,{
        key:channels[i],
        name:channels[i],
        updateColor: this.updateColor.bind(this),
        model:this.props.model, 
        values:this.state.color.getRaw(), 
        width:this.props.width, 
        height: this.props.height
      });
    }

    return React.createElement('div', {className:"ColorBars"}, bars)
  }

}
