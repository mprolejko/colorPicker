'use strict';

export class ColorSample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      selected: false
    };
    this.select = this.select.bind(this);
  }

  select(){
    this.setState({ selected : !this.state.selected});
  }
  
  render() {
    let col = new this.props.model(this.props.sample)
    let style = {backgroundColor:col.getHEX().hex}
    return React.createElement('div',
        {
          style:style,
          className: "ColorSample" + (this.state.selected? " selected":""),
          onClick: this.select
        },
        style.backgroundColor
    )
  }
}
