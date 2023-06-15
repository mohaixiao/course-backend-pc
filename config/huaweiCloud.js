const { BasicCredentials, Region } = require('@huaweicloud/huaweicloud-sdk-core')
const { ShowAssetDetailRequest, VodClient } = require('@huaweicloud/huaweicloud-sdk-vod')


class HuaweiCloud {
    static AK = 'SBVXVIGAFFZYXFG2ZOUT'
    static SK = 'FnL3U1j8LyyF8hYjaRuriZnVLoiLjJU3pVUfgrlG'
    static PROJECT_ID = '6e42f42a69ca4308b75a76b157e39ad9'
    static REGION = 'cn-north-4'
    static ENDPOINT = 'https://vod.cn-north-4.myhuaweicloud.com'

    // https://console.huaweicloud.com/apiexplorer/#/sdkcenter/VOD?lang=NodeJs
    static getVodClient() {
        // 使用永久AK、SK Region级服务 
        const auth = new BasicCredentials().withAk(HuaweiCloud.AK).withSk(HuaweiCloud.SK).withProjectId(HuaweiCloud.PROJECT_ID)
        // 初始化指定云服务的客户端
        return VodClient.newBuilder().withCredential(auth).withRegion(new Region(HuaweiCloud.REGION, HuaweiCloud.ENDPOINT)).build()
    }

    // 获取视频播放地址
    // https://console.huaweicloud.com/apiexplorer/#/openapi/VOD/sdk?api=ShowAssetDetail
    static async getVideoUrl(assetId) {
        let vodClient = HuaweiCloud.getVodClient()
        let detailRequest = new ShowAssetDetailRequest()
        detailRequest.withAssetId(assetId)
        let detail = await vodClient.showAssetDetail(detailRequest)
        let outputs = detail.transcode_info?.output
        if (!outputs || outputs.length <= 0) return ['']
        let urlList = []
        for (let output of outputs) {
            let { bit_rate, duration, video_size } = output.meta_data
            bit_rate > 0 && duration && duration > 0 && video_size > 0 && urlList.push(output.url)
        }
        return urlList
    }
}
module.exports = HuaweiCloud