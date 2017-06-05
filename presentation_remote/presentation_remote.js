let robot = require('robotjs')
let SensorTag = require('sensortag')

console.log('>>> Looking for near Sensor Tags...')

SensorTag.discover(sensorTag => {
  // Bind Events
  sensorTag.on('disconnect', () => {
    console.log('>>> Disconnected')
    process.exit(0)
  })
  sensorTag.on('simpleKeyChange', (left, right) => {
    if (left && right) {
      sensorTag.disconnect()
    } else if (left) {
      robot.keyTap('left')
    } else if (right) {
      robot.keyTap('right')
    }
  })

  console.log('>>> Discovered: ' + sensorTag)

  sensorTag.connectAndSetUp(() => sensorTag.notifySimpleKey())
})
