// add mode in validator
// walking1 = walker
// walking2 = wheelchair
var validator = {
    mode: {format: 'among', values:['driving', 'cycling', 'walking',
    'walking1', 'walking2'], required: false, default: 'driving'}
}

    if (parameter.mode === 'walking1') {
      parameter.mode = 'walking'
      for (t in state.timeTravel) {
        var incline = (abs(h/(x2 - x1)) + abs(h/(y2 - y1))) / 2 // calcuate the incline
        if (incline >= 0.06 || incline <= -0.06) {  // for steep slope, change the timeTravel
          t = t * 1.4
        } else { // default timeTravel for walker
          t = t * 1.1
        }
      }
    }

    if (parameter.mode === 'walking2') {
      parameter.mode = 'walking'
      for (t in state.timeTravel) {
        var incline = (abs(h/(x2 - x1)) + abs(h/(y2 - y1))) / 2
        if (incline >= 0.06 || incline <= -0.06) {
          t = t * 1.3
        } // else t = t
      }
    }
