const {Uf, Cbo} = require('../config/associations');

module.exports = (async function () {

    const ufs = await Uf.findAll({ 
        raw: true,
        order: ['name']
    })

    const cbo = JSON.stringify(await Cbo.findAll())

    return {ufs: ufs, cbo: cbo}
})();