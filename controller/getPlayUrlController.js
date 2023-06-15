const getPlayUrlService = require('../Service/getPlayUrlService');

const getPlayUrlController = {
    get_play_url: async (req, res) => {
        let handleRes = await getPlayUrlService.get_play_url({
            episodeId: req.body.episodeId,
            token: req.headers.authorization.split(' ').pop()
        })
        res.send(handleRes)
    }
}

module.exports = getPlayUrlController