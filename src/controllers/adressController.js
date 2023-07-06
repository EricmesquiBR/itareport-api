const adressService = require('../services/adressService');

async function findAllAdresses(req, res) {
    try {
        const adresses = await adressService.findAllAdresses()
        return res.json({
            success: true,
            data: adresses,
            message: "Adresses found successfully"
        })
    } catch (error) {
        return res.json({ error })
    }
}

module.exports = {
    findAllAdresses
}