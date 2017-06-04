let util = require('util')
let robot = require('robotjs')
let async = require('async')
let SensorTag = require('sensortag')

console.log('Looking for near Sensor Tags...')

SensorTag.discover(sensorTag => {
  sensorTag.on('disconnect', () => {
    console.log('>>> disconnected')
    process.exit(0)
  })

  console.log('discovered: ' + sensorTag)

  async.series([
    callback => {
      sensorTag.connectAndSetUp(callback);
    },
    callback => {
      console.log('receiving button press...')
      sensorTag.on('simpleKeyChange', (left, right) => {
        if (left && right) {
          callback()
        } else if (left) {
          robot.keyTap('left')
        } else if (right) {
          robot.keyTap('right')
        }
      })
      sensorTag.notifySimpleKey()
    },
    callback => {
      console.log('disconnect...')
      sensorTag.disconnect(callback)
    }
  ])
})
