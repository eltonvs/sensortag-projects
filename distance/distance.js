let util = require('util')
let SensorTag = require('sensortag')

console.log('Looking for near SensorTags...')

let calculateDistance = rssi => {
  // hard coded power value. Usually ranges between -59 to -65
  var txPower = -59

  if (rssi === 0) {
    return -1.0;
  }

  let ratio = rssi * 1.0 / txPower;

  if (ratio < 1.0) {
    return Math.pow(ratio,10);
  } else {
    let distance =  (0.89976)*Math.pow(ratio,7.7095) + 0.111;
    return distance;
  }
}

SensorTag.discover(sensorTag => {
  sensorTag.on('disconnect', () => {
    console.log('>>> disconnected')
    process.exit(0)
  })
  sensorTag.on('simpleKeyChange', (left, right) => {
    console.log('click')
    sensorTag.readBatteryLevel((err, batteryLevel) => console.log(batteryLevel))
    if (left && right) {
      sensorTag.disconnect()
    }
  })

  console.log('discovered: ' + sensorTag)

  sensorTag.connectAndSetUp(() => sensorTag.notifySimpleKey())

  setInterval(() => {
    sensorTag._peripheral.updateRssi((err, rssi) => {
      console.log(calculateDistance(rssi))
    });
  }, 1000);
})
