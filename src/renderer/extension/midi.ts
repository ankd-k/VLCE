interface IMIDIDevice {
  name: string;
  value: any;
}

export default class MIDI {
  private midiDevices: {
    inputs: IMIDIDevice[],
    outputs: IMIDIDevice[]
  };

  constructor() {
    this.midiDevices = {
      inputs: [],
      outputs: [],
    };
    this.request();
    // console.log('midiDevices ', this.midiDevices);
  }

  get inputDevices(): IMIDIDevice[] { return this.midiDevices.inputs; }
  get outputDevices(): IMIDIDevice[] { return this.midiDevices.outputs; }

  public request() {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
      .then(this.requestSuccess, this.requestError);
    } else {
      this.requestError();
    }
  }
  public send(name: string, message: number[], timeOffset?: number) {
    console.log('midi.send()');
    const od = this.outputDevices.find(o => o.name === name);
    if (od) {
      od.value.send(message);
    } else {
      console.error('device "' + name + '" is not exist.');
    }
  }

  private requestSuccess = (data?: any) => {
    console.log('requestMIDI() success.', data);
    // get input devices
    const inputIterator = data.inputs.values();
    for (let input = inputIterator.next(); !input.done; input = inputIterator.next()) {
      const device = {name: input.value.name, value: input.value};
      this.midiDevices.inputs.push(device);
      device.value.addEventListener('midimessage', this.inputEvent, false);
    }
    // get ouput devices
    const outputIterator = data.outputs.values();
    for (let output = outputIterator.next(); !output.done; output = outputIterator.next()) {
      const device = {name: output.value.name, value: output.value};
      this.midiDevices.outputs.push(device);
    }
    console.log('input :', this.inputDevices, 'output :', this.outputDevices);
  }
  private requestError = (error?: any) => {
    console.error('MIDIController.request() error.', error);
  }
  private inputEvent = (e: any) => {
    console.log('input.', e);
  }
}
