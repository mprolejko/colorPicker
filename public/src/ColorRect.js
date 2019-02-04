'use strict';

export class ColorRect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isDragged: false,
        valueX: this.props.sample[this.props.channels[0]],
        valueY: this.props.sample[this.props.channels[1]]
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
    let color = this.props.sample;
    let newX = color[this.props.channels[0]];
    let newY = color[this.props.channels[1]];
    if (event.type=="mousedown"){
      let x = event.pageX - event.target.closest(".ColorRect").offsetLeft
      newX = x / this.props.width;
      let y = event.pageY - event.target.closest(".ColorRect").offsetTop
      newY = y / this.props.height;
    }
    else if(event.type=="mousemove"){
      newX += event.movementX / this.props.width;
      newY += event.movementY / this.props.height;
    }
    if(typeof newX !== "undefined" && !isNaN(newX) && typeof newY !== "undefined" && !isNaN(newY)){
      this.setState({
        valueX:newX,
        valueY:newY
      });
      color[this.props.channels[0]] = newX;
      color[this.props.channels[1]] = newY;
      this.props.update(color);
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
    
    var steps = 24;
    let channelX = this.props.channels[0];
    let channelY = this.props.channels[1];

    let col = Object.assign({}, this.props.sample); 
    for( var y=0; y < this.props.height; y+=1){
      col[channelY] = y * (1 / (this.props.width - 1));
      var grd = ctx.createLinearGradient(0, 0, this.props.width, 0);
      for (var i = 0; i < steps; i++){
          col[channelX] = i * (1 / (steps - 1));
          let color =  new this.props.model(col);
          grd.addColorStop(col[channelX], color.getHEX().hex);
      }
      ctx.fillStyle = grd;
      ctx.fillRect(0, y, this.props.width, y+1);
    }
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
    let color =  new this.props.model(this.props.sample);

    const channels = this.props.channels;

    let x = (100 * color.getRaw()[channels[0]])+"%";
    let y = (100 * color.getRaw()[channels[1]])+"%";

    const canvas = React.createElement('canvas', {
      ref: "canvas", 
      width: this.props.width, 
      height: this.props.height,
    });
    const selector = React.createElement('div', {
      className:"selector", 
      style: {
        backgroundColor: color.getHEX().hex, 
        left: x,
        top: y
      }
    });

    return React.createElement('div',{
      className:"ColorRect",
      onMouseMove: this.mouseMove,
      onMouseDown: this.mouseDown,
      onMouseUp: this.mouseUp
    },canvas,selector);
  }

}

