let keysArray = [
    {
      keyBind: "d",
      soundName: "kick",
      soundSrc:
        "/content/f77ec5a34417df8310db5bd359275ad31b336dd48b07dcec2a7ba1fcd26fb85bi0",
    },
    {
      keyBind: "h",
      soundName: "Low Bass",
      soundSrc:
        "/content/e1527ca3b43b571972d134e3c58c63c540be56b6b3e79fc6dd86aa9e8d7974bbi0",
    },
    {
      keyBind: "j",
      soundName: "Funky Bass",
      soundSrc:
        "/content/66046fa4827d8f2c5c5b23e6668b5442b59c8057f129f73f5156fa6c8eda5a32i0",
    },
    {
      keyBind: "a",
      soundName: "clap",
      soundSrc:
        "/content/217c737bb6d09d530862fc0035420d1c10b36af0ffc1dacfc6ff0e7e9f849d52i0",
    },
    {
      keyBind: "s",
      soundName: "hihat",
      soundSrc:
        "/content/3be3fd8fa6bca0da3dd1e272b40e61d3619cbc650a4bc3c5345ff191be98f9a4i0",
    },
    {
      keyBind: "f",
      soundName: "openhat",
      soundSrc:
        "/content/c429bde78bf3287cf5fc0113bc8c2f6a5164f0e06b3509b32dee1e3664a6f7fbi0",
    },
    {
      keyBind: "g",
      soundName: "percussion",
      soundSrc:
        "/content/4e327d0a1b8c90a1b1314da9ac6e82b693fb9d7f0a8cb4afb423d100d9d31d68i0",
    },
  ];
  
  class ModalWindow {
    constructor(windowTypeStyleName, windowTitle, innerEl, okButtonEl) {
      const modalWindowOverlayEl = document.createElement("div");
      modalWindowOverlayEl.classList.add("modal-window__overlay");
  
      const modalWindowTitleEl = document.createElement("div");
      modalWindowTitleEl.classList.add("modal-window__title");
      modalWindowTitleEl.innerText = windowTitle;
  
      const modalEl = document.createElement("div");
      modalEl.classList.add("modal-window");
      modalEl.classList.add(windowTypeStyleName);
  
      const buttonCancel = document.createElement("button");
      buttonCancel.classList.add("modal-window__button");
      buttonCancel.classList.add("modal-window__button_cancel");
      buttonCancel.innerText = "x";
  
      buttonCancel.onclick = () => {
        modalWindowOverlayEl.remove();
      };
  
      okButtonEl.addEventListener("click", () => modalWindowOverlayEl.remove());
  
      modalEl.append(modalWindowTitleEl);
      modalEl.append(innerEl);
      modalEl.append(okButtonEl);
      modalEl.append(buttonCancel);
  
      modalWindowOverlayEl.append(modalEl);
      document.body.appendChild(modalWindowOverlayEl);
    }
  }
  
  class DrumKit {
    drumKitKeys = [];
    audioTracksMinPalyTime = 0.001;
    keysArray = null;
  
    drumKitContainer = null;
  
    constructor(keysArray) {
      this.createKeys(keysArray);
      this.keysArray = keysArray;
    }
  
    createKeys(arrayOfKeys) {
      if (!this.drumKitContainer) {
        this.drumKitContainer = document.createElement("div");
        this.drumKitContainer.className = "drum-kit-key-container";
        document.getElementsByTagName("main")[0].append(this.drumKitContainer);
      }
  
      arrayOfKeys.forEach((el) => {
        let insertKey = document.createElement("div");
        let keyName = document.createElement("h2");
        keyName.innerText = el.keyBind;
        let soundName = document.createElement("span");
        soundName.innerText = el.soundName;
        insertKey.append(keyName);
        insertKey.append(soundName);
        insertKey.className = "drum-kit__key";
  
        insertKey.addEventListener("click", () => {
          let drumKitKey = this.drumKitKeys.find(
            (key) => key.keyBind === el.keyBind
          );
          drumKitKey.audioTrack.currentTime = 0;
  
          drumKitKey.audioTrack.play();
          drumKitKey.keyEl.classList.add("keydown");
          setTimeout(() => drumKitKey.keyEl.classList.remove("keydown"), 100);
        });
  
        document.addEventListener("keydown", (e) => {
          if (e.code === "Key" + el.keyBind.toUpperCase()) {
            this.drumKitKeys
              .find((key) => "Key" + key.keyBind.toUpperCase() === e.code)
              .keyEl.click();
          }
        });
  
        this.drumKitKeys.push({
          keyBind: el.keyBind,
          soundName: el.soundName,
          keyEl: insertKey,
          audioTrack: new Audio(el.soundSrc),
        });
        this.drumKitContainer.append(insertKey);
      });
    }
  
    export() {
      return this.keysArray;
    }
  }
  
  class DrumKitInstrumentPads {
    colorActive = "#e74c3c";
    isPlaying = false;
    instrumentName = null;
    instrumentPads = [];
    drumKitInstrumentsContainer = null;
    instrumentContainer = null;
    instrumentContainerPads = null;
    volInput = null;
  
    instrumentTimer = null;
  
    constructor(instrumentName, size, volume) {
      this.instrumentName = instrumentName;
      this.SQUARES = size;
      this.drumKitInstrumentsContainer = document.getElementsByClassName(
        "drum-kit-rhythm-container"
      )[0];
      console.log(!this.drumKitInstrumentsContainer);
      if (!this.drumKitInstrumentsContainer) {
        this.drumKitInstrumentsContainer = document.createElement("div");
        this.drumKitInstrumentsContainer.className = "drum-kit-rhythm-container";
        document
          .getElementsByTagName("main")[0]
          .append(this.drumKitInstrumentsContainer);
      }
  
      this.instrumentContainer = document.createElement("div");
      this.instrumentContainer.className = "drum-kit-rhythm-instrument-container";
  
      this.volInput = document.createElement("input");
      this.volInput.value = volume;
      this.volInput.type = "range";
      this.volInput.min = "0";
      this.volInput.max = "1";
      this.volInput.step = "0.01";
  
      this.instrumentContainer.appendChild(this.volInput);
      const instrumentNameEl = document.createElement("span");
      instrumentNameEl.textContent = this.instrumentName;
      this.instrumentContainer.appendChild(instrumentNameEl);
  
      this.addPads(size);
    }
  
    addPads(numberOfPads) {
      if (!this.instrumentContainerPads) {
        this.instrumentContainerPads = document.createElement("div");
        this.instrumentContainerPads.className = "instrument-pads-container";
      }
  
      let padsNumber = this.instrumentPads.length;
  
      for (let i = padsNumber; i < padsNumber + numberOfPads; i++) {
        const square = document.createElement("div");
        square.classList.add("drum-kit-rhythm__pad");
  
        if ((i + 8) % 8 > 3) {
          square.classList.add("pad_black");
        } else {
          square.classList.add("pad_gray");
        }
  
        this.instrumentPads.push({ id: i, state: false, padEl: square });
  
        square.addEventListener("click", () => this.switchState(i));
  
        this.instrumentContainerPads.appendChild(square);
      }
      this.instrumentContainer.appendChild(this.instrumentContainerPads);
      this.drumKitInstrumentsContainer.append(this.instrumentContainer);
    }
  
    removePads(numberOfPads) {
      if (
        numberOfPads > 0 &&
        this.instrumentPads !== null &&
        this.instrumentPads.length >= numberOfPads
      ) {
        let padToRemove = this.instrumentPads.slice(
          this.instrumentPads.length - numberOfPads,
          this.instrumentPads.length
        );
        padToRemove.forEach((el) => el.padEl.remove());
        this.instrumentPads = this.instrumentPads.slice(
          0,
          this.instrumentPads.length - numberOfPads
        );
      }
    }
  
    remove() {
      this.isPlaying = false;
      clearInterval(this.instrumentTimer);
      this.instrumentTimer = null;
      this.instrumentContainer.remove();
    }
  
    switchState(padId) {
      let padObj = this.instrumentPads.find((el) => el.id === padId);
      if (!padObj.state) {
        padObj.padEl.classList.remove("pad_black");
        padObj.padEl.classList.add("pad_red");
      } else {
        padObj.padEl.classList.remove("pad_red");
        padObj.padEl.classList.add("pad_black");
      }
      padObj.state = !padObj.state;
    }
  
    play(interval) {
      this.isPlaying = !this.isPlaying;
      let lastPlayedPadId = 0;
      if (this.instrumentTimer == null) {
        this.instrumentTimer = setInterval(() => {
          if (this.isPlaying === false) {
            clearInterval(this.instrumentTimer);
            this.instrumentTimer = null;
            return;
          }
  
          if (lastPlayedPadId >= this.instrumentPads.length) {
            lastPlayedPadId = 0;
          }
  
          let lastPadEl = this.instrumentPads.find(
            (el) => el.id === lastPlayedPadId
          );
          lastPadEl.padEl.classList.add("pad_current-playing");
          setTimeout(
            () => lastPadEl.padEl.classList.remove("pad_current-playing"),
            interval
          );
  
          if (this.instrumentPads.find((el) => el.id === lastPlayedPadId).state) {
            let drumKitObj = drumKit.drumKitKeys.find(
              (el) => el.soundName === this.instrumentName
            );
            drumKitObj.audioTrack.volume = this.volInput.value;
            drumKitObj.keyEl.click();
          }
          lastPlayedPadId++;
        }, interval);
      }
    }
  
    export() {
      let out = {
        instrumentName: this.instrumentName,
        valueLevel: this.volInput.value,
        pads: [],
      };
      this.instrumentPads.forEach((el) =>
        out.pads.push({ id: el.id, state: el.state })
      );
      return out;
    }
  }
  
  class DrumKitRhythm {
    instruments = [];
    bpmInput = null;
    size = 0;
    drumKit = null;
    selectAddInstrument = null;
  
    constructor(instrumentsArray, size) {
      this.drumKit = new DrumKit(instrumentsArray);
  
      this.size = size;
  
      this.instrumentsArray = instrumentsArray;
  
      this.bpmInput = document.createElement("input");
      this.bpmInput.value = 120;
  
      document.getElementsByTagName("main")[0].appendChild(this.bpmInput);
  
      const btnPaly = document.createElement("button");
      btnPaly.textContent = "play";
      btnPaly.addEventListener("click", () => this.playAll());
      document.getElementsByTagName("main")[0].appendChild(btnPaly);
  
      const btnAddPads = document.createElement("button");
      btnAddPads.textContent = "add 8 pads";
      btnAddPads.addEventListener("click", () => this.addPads(8));
      document.getElementsByTagName("main")[0].appendChild(btnAddPads);
  
      const btnRemovePads = document.createElement("button");
      btnRemovePads.textContent = "delete 8 pads";
      btnRemovePads.addEventListener("click", () => this.removePads(8));
      document.getElementsByTagName("main")[0].appendChild(btnRemovePads);
  
      this.updateInstrumentSelectList();
  
      const btnAddInstrument = document.createElement("button");
      btnAddInstrument.textContent = "add instrument";
      btnAddInstrument.addEventListener("click", () =>
        this.addInstrument(
          this.selectAddInstrument.options[this.selectAddInstrument.selectedIndex]
            .value,
          1
        )
      );
      document.getElementsByTagName("main")[0].appendChild(btnAddInstrument);
    }
  
    updateInstrumentSelectList() {
      if (!this.selectAddInstrument) {
        this.selectAddInstrument = document.createElement("select");
        document
          .getElementsByTagName("main")[0]
          .appendChild(this.selectAddInstrument);
      } else {
        this.selectAddInstrument.innerText = "";
      }
  
      this.drumKit.drumKitKeys.forEach((el) => {
        let option = document.createElement("option");
        option.value = option.text = el.soundName;
        this.selectAddInstrument.add(option);
      });
    }
  
    addPads(numberOfPads) {
      this.size += numberOfPads;
      this.instruments.forEach((el) => {
        el.isPlaying = false;
        el.addPads(numberOfPads);
      });
    }
  
    removePads(numberOfPads) {
      if (this.size > numberOfPads) {
        this.size -= numberOfPads;
        this.instruments.forEach((el) => {
          el.removePads(numberOfPads);
          el.isPlaying = false;
        });
      }
    }
  
    playAll() {
      this.instruments.forEach((el) =>
        el.play(1000 / (this.bpmInput.value / 60) / 4)
      );
    }
  
    addInstrument(instrumentName, volume) {
      if (!this.instruments.find((el) => el.instrumentName === instrumentName)) {
        this.instruments.push(
          new DrumKitInstrumentPads(instrumentName, this.size, volume)
        );
      }
    }
  }
  
  class SequenceStep {
    state = null;
    id = null;
    //
    nodeEl = null;
  
    constructor(id, state = false) {
      this.state = Boolean(state);
      this.id = id;
      this.nodeEl = document.createElement("div");
      this.nodeEl.className = "sequence-step";
      this.setState(this.state);
  
      this.nodeEl.addEventListener("click", () => {
        this.switchState();
      });
  
      if ((this.id + 8) % 8 > 3) {
        this.nodeEl.classList.add("sequence-step_black");
      } else {
        this.nodeEl.classList.add("sequence-step_gray");
      }
    }
  
    switchState() {
      this.state = !this.state;
      this.nodeEl.classList.toggle("sequence-step_active");
    }
  
    setState(state) {
      this.state = state;
      if (this.state) {
        this.nodeEl.classList.add("sequence-step_active");
      } else {
        this.nodeEl.classList.remove("sequence-step_active");
      }
    }
  
    setPlayingState(state) {
      if (state) {
        this.nodeEl.classList.add("sequence-step_current-playing");
      } else {
        this.nodeEl.classList.remove("sequence-step_current-playing");
      }
    }
  
    getNodeEl() {
      return this.nodeEl;
    }
  
    remove() {
      this.nodeEl.remove();
    }
  
    export() {
      return { state: this.state, id: this.id };
    }
  }
  
  class ChannelSequence {
    channelName = null;
    sequenceSteps = [];
    stepsNumber = 0;
  
    nodeEl = null;
  
    constructor(channelName, stepsNumber = 0, sequenceSteps = null) {
      this.nodeEl = document.createElement("div");
      this.nodeEl.className = "channel-sequence";
  
      this.channelName = channelName;
      if (stepsNumber > 0 && !sequenceSteps) {
        this.addSteps(stepsNumber);
      } else if (sequenceSteps && sequenceSteps.length > 0) {
        sequenceSteps.forEach((el) => {
          let step = new SequenceStep(el.id, el.state);
          this.nodeEl.appendChild(step.getNodeEl());
          this.sequenceSteps.push();
          this.stepsNumber++;
        });
      }
    }
  
    getNodeEl() {
      return this.nodeEl;
    }
  
    addSteps(numberOfSteps) {
      for (
        let stepNumber = this.stepsNumber;
        stepNumber < this.stepsNumber + numberOfSteps;
        stepNumber++
      ) {
        let step = new SequenceStep(stepNumber);
        this.sequenceSteps.push(step);
        this.nodeEl.appendChild(step.getNodeEl());
      }
      this.stepsNumber += numberOfSteps;
    }
  
    getStepById(id) {
      return this.sequenceSteps.find((sequenceStep) => sequenceStep.id === id);
    }
  
    switchStateEvery(N) {
      this.sequenceSteps.forEach((sequenceStep) => {
        if (sequenceStep.id % N) {
          sequenceStep.setState(false);
        } else {
          sequenceStep.setState(true);
        }
      });
    }
  
    removeSteps(numberOfSteps) {
      let sequenceStepsToRemove = this.sequenceSteps.slice(
        this.stepsNumber - numberOfSteps,
        this.stepsNumber
      );
      sequenceStepsToRemove.forEach((el) => el.remove());
      this.sequenceSteps = this.sequenceSteps.slice(
        0,
        this.stepsNumber - numberOfSteps
      );
      this.stepsNumber -= numberOfSteps;
    }
  
    remove() {
      this.sequenceSteps.forEach((sequenceStep) => sequenceStep.remove());
      this.nodeEl.remove();
      this.sequenceSteps = null;
    }
  
    export() {
      let sequenceStepsArray = this.sequenceSteps.map((el) => el.export());
      return {
        channelName: this.channelName,
        sequenceSteps: sequenceStepsArray,
        stepsNumber: this.stepsNumber,
      };
    }
  }
  
  class SequencerPattern {
    channelSequences = [];
    patternName = null;
    stepsNumber = null;
    //
    nodeEl = null;
  
    constructor(patternName, stepsNumber) {
      this.nodeEl = document.createElement("div");
      this.nodeEl.className = "sequencer-pattern";
  
      this.patternName = patternName;
      this.stepsNumber = stepsNumber;
    }
  
    addChannelSequence(channelName) {
      let newChannelSequence = new ChannelSequence(channelName, this.stepsNumber);
      this.nodeEl.appendChild(newChannelSequence.getNodeEl());
      this.channelSequences.push(newChannelSequence);
      return newChannelSequence;
    }
  
    getChannelSequence(channelName) {
      return this.channelSequences.find(
        (channelSequence) => channelSequence.channelName === channelName
      );
    }
  
    addSequenceSteps(numberOfSteps) {
      this.channelSequences.forEach((channelSequence) =>
        channelSequence.addSteps(numberOfSteps)
      );
      this.stepsNumber += numberOfSteps;
      return this.channelSequences;
    }
  
    removeSequenceSteps(numberOfSteps) {
      if (
        numberOfSteps > 0 &&
        this.stepsNumber !== null &&
        this.stepsNumber >= numberOfSteps
      ) {
        this.channelSequences.forEach((channelSequence) =>
          channelSequence.removeSteps(numberOfSteps)
        );
        this.stepsNumber -= numberOfSteps;
      }
  
      return this.channelSequences;
    }
  
    removeChannelSequence(channelName) {
      this.getChannelSequence(channelName).remove();
      this.channelSequences = this.channelSequences.filter(
        (channelSequence) => channelSequence.channelName !== channelName
      );
    }
  
    getNodeEl() {
      return this.nodeEl;
    }
  
    export() {
      let channelSequencesArray = this.channelSequences.map((el) => el.export());
      return {
        channelSequences: channelSequencesArray,
        patternName: this.patternName,
        stepsNumber: this.stepsNumber,
      };
    }
  }
  
  class Channel {
    volume = null;
    name = null;
    soundSrc = null;
    audioTrack = null;
    isMuted = null;
  
    //
    nodeEl = null;
    volumeSliderEl = null;
    isMutedEl = null;
  
    constructor(name, soundSrc, volume) {
      this.volume = volume;
      this.name = name;
      this.soundSrc = soundSrc;
      this.audioTrack = new Audio(this.soundSrc);
      this.isMuted = false;
  
      this.nodeEl = document.createElement("div");
      this.nodeEl.className = "channel";
  
      let nameEl = document.createElement("div");
      nameEl.className = "channel__name";
      nameEl.innerText = this.name;
  
      this.isMutedEl = document.createElement("input");
      this.isMutedEl.type = "checkbox";
      this.isMutedEl.className = "channel__volume-mute";
      this.isMutedEl.checked = false;
      this.isMutedEl.oninput = () => {
        this.setMute(this.isMutedEl.checked);
      };
  
      this.volumeSliderEl = document.createElement("input");
      this.volumeSliderEl.className = "channel__volume-slider";
      this.volumeSliderEl.value = this.volume * 100;
      this.volumeSliderEl.type = "range";
      this.volumeSliderEl.min = "0";
      this.volumeSliderEl.max = "100";
      this.volumeSliderEl.step = "1";
      this.volumeSliderEl.oninput = () => {
        this.setVolume(this.volumeSliderEl.value / 100);
      };
  
      this.nodeEl.appendChild(nameEl);
      this.nodeEl.appendChild(this.volumeSliderEl);
      this.nodeEl.appendChild(this.isMutedEl);
    }
  
    setMute(state) {
      this.isMuted = state;
      return state;
    }
  
    setVolume(volume) {
      this.volume = volume;
      this.volumeSliderEl.value = this.volume * 100;
      return true;
    }
  
    playSound() {
      if (!this.isMuted) {
        this.audioTrack.currentTime = 0;
        this.audioTrack.volume = this.volume;
        this.audioTrack.play();
      }
    }
  
    stopSound() {
      this.audioTrack.pause();
      this.audioTrack.currentTime = 0;
    }
  
    getNodeEl() {
      return this.nodeEl;
    }
  
    remove() {
      this.nodeEl.remove();
    }
  
    export() {
      return { volume: this.volume, name: this.name, soundSrc: this.soundSrc };
    }
  }
  
  class StepSequencer {
    channels = [];
    sequencerPatterns = [];
    isPlaying = null;
    currentSelectedPatternName = null;
    bpm = 120;
    timer = null;
    lastPlayedStep = 0;
  
    nodeEl = null;
  
    channelsEl = null;
    patternEl = null;
    bodyEl = null;
    controlsEl = null;
  
    bpmInput = null;
  
    constructor() {
      this.controlsEl = document.createElement("div");
      this.controlsEl.className = "sequencer-controls";
  
      this.bodyEl = document.createElement("div");
      this.bodyEl.className = "sequencer-body";
  
      this.channelsEl = document.createElement("div");
      this.channelsEl.className = "channels";
  
      this.nodeEl = document.createElement("div");
      this.nodeEl.className = "step-sequencer";
  
      this.createControls();
    }
  
    createControls() {
      this.bpmInput = document.createElement("input");
      this.bpmInput.value = this.bpm;
  
      this.bpmInput.classList.add("sequencer-controls__bpm-input");
  
      this.controlsEl.appendChild(this.bpmInput);
  
      const btnPaly = document.createElement("button");
      btnPaly.classList.add("sequencer-controls__button");
      btnPaly.classList.add("sequencer-controls__button-play");
      btnPaly.classList.add("sequencer-controls__button-play_play");
      btnPaly.textContent = "play";
      btnPaly.addEventListener("click", () => {
        this.play();
        this.setBPM(this.bpmInput.value);
        btnPaly.classList.toggle("sequencer-controls__button-play_pause");
        btnPaly.classList.toggle("sequencer-controls__button-play_play");
      });
      this.controlsEl.appendChild(btnPaly);
  
      const btnAddSteps = document.createElement("button");
      btnAddSteps.classList.add("sequencer-controls__button");
      btnAddSteps.classList.add("sequencer-controls__button-add-steps");
      btnAddSteps.textContent = "add 8 steps";
      btnAddSteps.addEventListener("click", () =>
        this.getCurrentSequencerPattern().addSequenceSteps(8)
      );
      this.controlsEl.appendChild(btnAddSteps);
  
      const btnRemoveSteps = document.createElement("button");
      btnRemoveSteps.classList.add("sequencer-controls__button");
      btnRemoveSteps.classList.add("sequencer-controls__button-remove-steps");
      btnRemoveSteps.textContent = "remove 8 steps";
      btnRemoveSteps.addEventListener("click", () =>
        this.getCurrentSequencerPattern().removeSequenceSteps(8)
      );
      this.controlsEl.appendChild(btnRemoveSteps);
    }
  
    addChannel(name, soundSrc, volume) {
      if (!this.getChannel(name)) {
        let newChannel = new Channel(name, soundSrc, volume);
        this.channels.push(newChannel);
        this.channelsEl.appendChild(newChannel.getNodeEl());
  
        const btnRemoveChannel = document.createElement("button");
  
        if (this.getCurrentSequencerPattern()) {
          this.getCurrentSequencerPattern().addChannelSequence(name);
        }
        return newChannel;
      }
    }
  
    addSequencerPattern(patternName, stepsNumber) {
      let newSequencerPattern = new SequencerPattern(patternName, stepsNumber);
      this.channels.forEach((channel) =>
        newSequencerPattern.addChannelSequence(channel.name)
      );
      this.sequencerPatterns.push(newSequencerPattern);
      this.switchCurrentPattern(newSequencerPattern.patternName);
      return newSequencerPattern;
    }
  
    switchCurrentPattern(patternName) {
      let pattern = this.getSequencerPattern(patternName);
      if (pattern) {
        this.currentSelectedPatternName = patternName;
  
        this.patternEl = pattern.getNodeEl();
        this.draw();
      }
      return pattern;
    }
  
    draw() {
      this.nodeEl.innerHTML = "";
      this.bodyEl.innerHTML = "";
      this.bodyEl.appendChild(this.channelsEl);
      this.bodyEl.appendChild(this.patternEl);
  
      this.nodeEl.appendChild(this.controlsEl);
      this.nodeEl.appendChild(this.bodyEl);
    }
  
    removeChannelByName(name) {
      let channelToRemove = this.channels.find(
        (channel) => channel.name === name
      );
      if (channelToRemove) {
        channelToRemove.remove();
        this.sequencerPatterns.forEach((sequencerPattern) => {
          sequencerPattern.removeChannelSequence(name);
        });
        this.channels = this.channels.filter((channel) => channel.name !== name);
        return true;
      }
      return false;
    }
  
    removeSequencerPatternByName(name) {
      let sequencerPatternToRemove = this.channels.find(
        (sequencerPattern) => sequencerPattern.name === name
      );
      if (sequencerPatternToRemove) {
        console.log(sequencerPatternToRemove);
        sequencerPatternToRemove.remove();
        this.sequencerPatterns = this.sequencerPatterns.filter(
          (sequencerPattern) => sequencerPattern.name !== name
        );
        return true;
      }
      return false;
    }
  
    getSequencerPattern(patternName) {
      return this.sequencerPatterns.find(
        (sequencerPattern) => sequencerPattern.patternName === patternName
      );
    }
  
    getChannel(name) {
      return this.channels.find((channel) => channel.name === name);
    }
  
    getCurrentSequencerPattern() {
      return this.sequencerPatterns.find(
        (sequencerPattern) =>
          sequencerPattern.patternName === this.currentSelectedPatternName
      );
    }
  
    play() {
      this.isPlaying = !this.isPlaying;
  
      this.lastPlayedStep = 0;
      if (this.timer == null) {
        this.timer = setInterval(() => {
          if (this.isPlaying === false) {
            clearInterval(this.timer);
            this.timer = null;
  
            this.channels.forEach((channel) => {
              channel.stopSound();
            });
  
            return;
          }
          if (
            this.lastPlayedStep >= this.getCurrentSequencerPattern().stepsNumber
          ) {
            this.lastPlayedStep = 0;
          }
  
          this.channels.forEach((channel) => {
            let currentChannelStep = this.getCurrentSequencerPattern()
              .getChannelSequence(channel.name)
              .getStepById(this.lastPlayedStep);
            currentChannelStep.setPlayingState(true);
            setTimeout(
              () => currentChannelStep.setPlayingState(false),
              1000 / (this.bpm / 60) / 4
            );
            if (currentChannelStep.state) {
              channel.playSound();
            }
          });
  
          this.lastPlayedStep++;
          let widthEl = this.getCurrentSequencerPattern()
            .getNodeEl()
            .getBoundingClientRect().width;
          if (Math.ceil(widthEl / 20 / 2) < this.lastPlayedStep) {
            this.getCurrentSequencerPattern().getNodeEl().scrollLeft =
              20 * (this.lastPlayedStep - Math.ceil(widthEl / 20 / 2));
          }
          if (this.lastPlayedStep === 1) {
            this.getCurrentSequencerPattern().getNodeEl().scrollLeft = 0;
          }
        }, 1000 / (this.bpm / 60) / 4);
      }
    }
  
    setBPM(bpm) {
      this.bpmInput.value = bpm;
      this.bpm = bpm;
    }
  
    getNodeEl() {
      return this.nodeEl;
    }
  
    export() {
      let channelsArray = this.channels.map((el) => el.export());
      let sequencerPatternsArray = this.sequencerPatterns.map((el) =>
        el.export()
      );
      return {
        channels: channelsArray,
        sequencerPatterns: sequencerPatternsArray,
        bpm: this.bpm,
      };
    }
  
    remove() {
      this.isPlaying = false;
      clearInterval(this.timer);
      this.channels.forEach((channel) => {
        channel.stopSound();
      });
      this.channels = null;
      this.sequencerPatterns = null;
    }
  }
  
  class DrumPad {
    export() {}
  }
  
  class DigitalAudioWorkstation {
    drumPad = null;
    stepSequencer = null;
    nodeEl = null;
    controlsEl = null;
  
    constructor() {
      this.stepSequencer = new StepSequencer();
      this.drumPad = new DrumPad();
  
      keysArray.forEach((el) =>
        this.stepSequencer.addChannel(el.soundName, el.soundSrc, 1)
      );
  
      this.stepSequencer.addSequencerPattern("1", 16);
      this.stepSequencer.currentSelectedPatternName = "1";
  
      this.nodeEl = document.createElement("div");
      this.nodeEl.className = "daw-container";
  
      this.controlsEl = document.createElement("div");
      this.controlsEl.className = "daw-controls";
  
      document.getElementsByTagName("main")[0].append(this.nodeEl);
      this.render();
    }
  
    getNodeEl() {
      return this.nodeEl;
    }
  
    render() {
      this.nodeEl.innerHTML = "";
      this.nodeEl.appendChild(this.controlsEl);
      this.nodeEl.appendChild(this.stepSequencer.getNodeEl());
    }
  }
  
  let DAW = new DigitalAudioWorkstation();