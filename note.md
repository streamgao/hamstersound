rampTo.html  -- single modifier



shiny.html  -- based on beats  ---- hum no
grainPlayer
http://localhost:8000/examples/#signal --- Control Voltage


把rampTo的效果作为背景音持续
然后加上signal调节




var merge = new Tone.Merge().toMaster();
//two oscillators panned hard left / hard right
var rightOsc = new Tone.Oscillator({
		"type" : "sawtooth2",
		"volume" : -Infinity
}).connect(merge.right).start();
var leftOsc = new Tone.Oscillator({
		"type" : "triangle3",
		"volume" : -Infinity
}).connect(merge.left).start();

//create an oscillation that goes from 0 to 1200
//connection it to the detune of the two oscillators
var detuneLFO = new Tone.LFO({
    "type" : "triangle8",
    "min" : 300,
    "max" : 800
}).fan(rightOsc.detune, leftOsc.detune).start();

//the frequency signal
var frequency = new Tone.Signal(1);
//the move the 0 to 1 value into frequency range
var scale = new Tone.ScaleExp(30, 100);
//multiply the frequency by 2.5 to get a 10th above
var mult = new Tone.Multiply(1.5);
var delay = new Tone.FeedbackDelay(5);

// lowpass, highpass, “bandpass”, “lowshelf”, “highshelf”, “notch”, “allpass”, or “peaking”
let fbCombFilterLeft = new Tone.Filter(100, 'highpass');
let fbCombFilterRight = new Tone.FeedbackCombFilter(0.1, 0.5);

//chain the components together
frequency.chain(scale, mult);
// frequency.chain(delay, fbCombFilterLeft);
// frequency.chain(fbCombFilterLeft, fbCombFilterRight);
scale.connect(rightOsc.frequency);
mult.connect(leftOsc.frequency);

//multiply the frequency by 2 to 	get the octave above
var detuneScale = new Tone.Scale(2, 8);
frequency.chain(detuneScale, detuneLFO.frequency);
Interface.Button({
    text : 'Unmute Frequency',
    activeText : 'Mute Frequency',
    type : 'toggle',
    key : 33,
    start : function(){
        leftOsc.volume.rampTo(-10, 3);
        rightOsc.volume.rampTo(-10, 3);
    },
    end : function(){
        leftOsc.volume.rampTo(-Infinity, 1);
        rightOsc.volume.rampTo(-Infinity, 1);
    },
});
// GUI //
Interface.Slider({
    drag : function(value){
        frequency.rampTo(value, 0.1);
    },
    name : "frequency",
    min : 0,
    max : 1,
    exp : 0.5,
    value : 1,
    position: 1
});
