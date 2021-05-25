const testObjects = require('./testObjects');
let {kukaData, kuka1} = require('./testObjects'),
    { translateKukaData } = require('../iotAgent')

describe('Check connection with KUKA', () => {
  test ('Check number of layers count correctly', () => {
    info = {
      numberOfFinishingLayers: 0
    }
    kukaData.map((item, i) => {
        translateKukaData(item, info)
    })
    expect(info.numberOfLayers).toEqual(2)
    expect(info.numberOfFinishingLayers).toEqual(1)
  })

});