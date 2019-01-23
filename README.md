# colorPicker
React components for picking a color in various color spaces.

## Built With

* [Magicolors](https://github.com/mprolejko/magicolors) - Classes for managing color spaces
* [React](https://reactjs.org/) - Library for building user interface, without JSX


## Use
#### Color Bars
You can create a React.Component `ColorBars` whith parameters:
- `model`: name of the color classe from Magicolors, 
- `sample`: an object fitted to use in constructor for selected color model, 
- `width`: width of one channel strip, 
- `height`: height of one channel strip

`
React.createElement(ColorBars,{model:HSVColor, sample:{H: 70, S:100, V:100}, width:300, height: 20})
`
It will produce three channel strips, one for each channel in selected color space, with a selector. 
Color can be picked by clicking on the strip or draging the selector.

#### Color Samples
You can create a color sample by specyfying color model and first sample to show (parameters as above)
`
React.createElement(ColorSample, { model: RGBColor , sample: {R: 70, G:150, B:200}})
`

Color sample can be selected by clicking, and then automatically newly selected color on any of the ColorBars will appear.

## Example
Check working example http://prolejko.pl/colorPicker

## Acknowledgment
This is just my first React project, still full of bugs.

Thanks to http://colorizer.org/ for inspiration :-) 
