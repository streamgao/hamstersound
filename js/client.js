let oscillators = [];
let bassFreq = 64;
for (let i = 0; i < 8; i++){
    oscillators.push(new Tone.FatOscillator({
        "frequency" : bassFreq * i,
        "type" :  "sawtooth10",
        "volume" : -Infinity,
        "detune" : Math.random() * 30 - 15,
        'modulationFrequency': 0.4
    }).start().toMaster());
}
Interface.Slider({
    name: "harmony",
    parent : $("#baseOsc"),
    min: 0.2,
    max: 2,
    value: 1,
    drag: value => {
        const fValue = bassFreq * i * value.toFixed(2);
        oscillators.forEach((osc, i) => {
            osc.frequency.rampTo(fValue, 0.4);
        });
        document.querySelector('#baseOsc p').textContent = 'Base frequency: ' + fValue;
    }
});
Interface.Slider({
    name: "volume",
    parent : $("#baseOsc"),
    min: -60,
    max: 20,
    value: 0,
    drag: value => {
        oscillators.forEach(osc => {
            osc.volume.rampTo(value, 0);
        });
    }
});
Interface.Button({
    text: 'Unmute Base',
    parent : $("#baseOsc"),
    activeText: 'Mute Base',
    type: 'toggle',
    key: 32, //spacebar
    start: () => {
        oscillators.forEach(osc => {
            osc.volume.rampTo(-20, 0);
        });
    },
    end: () => {
        oscillators.forEach(osc => {
            osc.volume.rampTo(-Infinity, 0);
        });
    }
});

// let harmonyValue = document.getElementById('harmony').value;
// document.getElementById('harmonyBTN').addEventListener('click', e => {
// 		e.preventDefault();
// 		harmonyValue = document.getElementById('harmony').value;
// 		console.log('Setting harmony value', harmonyValue);
// 		oscillators.forEach((osc, i) => {
// 				osc.frequency.rampTo(bassFreq * i * harmonyValue, 0.4);
// 		});
// });





//set the bpm and time signature first
Tone.Transport.timeSignature = [6, 2];
Tone.Transport.bpm.value = 100;

//L/R channel merging
const merge = new Tone.Merge();
//a little reverb
const reverb = new Tone.Freeverb({
    "roomSize" : 0.5,
    "wet" : 0.4
});
merge.chain(reverb, Tone.Master);

//the synth settings
let synthSettingsL = {
    "oscillator": {
        "detune": 0,
        "type": "custom",
        "partials" : [2, 1, 2, 2],
        "phase": 0,
        "volume": 40
    },
    "envelope": {
        "attack": 0.1,
        "decay": 0.8,
        "sustain": 15,
        "release": 1,
    },
    "portamento": 0.5,
    "volume": 10
};
let synthSettingsR = {
    "oscillator": {
        "detune": 0,
        "type": "custom",
        "partials" : [2, 1, 2, 2],
        "phase": 0,
        "volume": 0
    },
    "envelope": {
        "attack": 0.005,
        "decay": 0.02,
        "sustain": 0.02,
        "release": 1,
    },
    "portamento": 0.01,
    "volume": 10
};

//left and right synthesizers
const synthL = new Tone.PolySynth(synthSettingsL).connect(merge.left);
const synthR = new Tone.PolySynth(synthSettingsR).connect(merge.right);

// the two Tone.Sequences
// var partL = new Tone.Sequence(function(time, note){
// 	synthL.triggerAttackRelease(note, "8n", time);
// }, ["E4", "F#4", "B4", "C#5", "D5", "F#4", "E4", "C#5", "B4", "F#4", "D5", "C#5"], "8n").start();
const partL = new Tone.Sequence((time, note) => {
    synthL.triggerAttackRelease(note, "8n", time.toFixed(2));
}, ["E4", "F#4", "B4", 'C#5', "D5", "F#4", "E4", "C#5", "B4", "F#4", "D5", "C#5"], "8n").start();

const partR = new Tone.Sequence((time, note) => {
    synthR.triggerAttackRelease(note, "8n", time.toFixed(2));
}, ["E4", "F#4", "B4", "C#5", "D5", "F#4", "E4", "C#5", "B4", "F#4", "D5", "C#5"], "8n").start('1m');

partL.playbackRate = 0.5; // start slow
Interface.Slider({
    name: "LP Rate",
    parent: $("#leftpiano"),
    min: 0.1,
    max: 2,
    value: 0.5,
    drag: value => {
        const lRate = value.toFixed(2);
        partL.playbackRate = lRate;
        document.querySelector('#leftpiano p').textContent = 'L Piano rate: ' + lRate;
    }
});
Interface.Slider({
    name: "RP Rate",
    parent: $("#rightpiano"),
    min: 0.1,
    max: 2,
    value: 1,
    drag: value => {
        const rRate = value.toFixed(2);
        partR.playbackRate = rRate;
        document.querySelector('#rightpiano p').textContent = 'R Piano rate: ' + rRate;
    }
});
Interface.Slider({
    name: "LP Volume",
    parent: $("#leftpiano"),
    min: -50,
    max: 20,
    value: 1,
    drag: value => {
        synthL.set('volume', value);
    }
});
Interface.Slider({
    name: "RP Volume",
    parent: $("#rightpiano"),
    min: -50,
    max: 20,
    value: 1,
    drag: function(value){
        synthR.set('volume', value);
    }
});
Interface.Button({
    parent: $('#pianophase'),
    key: 32,
    type: "toggle",
    text: "Start Piano Phase",
    activeText : "Stop Piano Phase",
    start: () => {
        Tone.Transport.start("+0.1");
    },
    end: () => {
        Tone.Transport.stop();
    }
});
