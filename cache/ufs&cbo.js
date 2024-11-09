const {Uf, Cbo, sync} = require('../config/associations');

module.exports = (async function () {
    await sync
    const ufs = await Uf.findAll({ 
        raw: true,
        order: ['name']
    })

    const cbo = await Cbo.findAll({ raw: true })

    return {ufs: ufs, cbo: cbo}
})();