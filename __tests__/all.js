const getBabelConfig = require('../index');

describe('should work', () => {
    it('should return object when called getBabelConfig', ()=>{
        expect(getBabelConfig()).toBeInstanceOf(Object)
    })
})