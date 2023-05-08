class RandomTool {
    // 随机生成四位数字
    static randomCode() {
        return Math.floor((Math.random() * (9999 - 1000))) + 1000;
    }

    static randomAvatar() {
        let imgList = [
            'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/10.jpeg',
            'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/11.jpeg',
            'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/12.jpeg',
            'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/13.jpeg',
            'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/14.jpeg',
            'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/15.jpeg',
            'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/16.jpeg',
            'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/17.jpeg',
            'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/18.jpeg',
            'https://xd-video-pc-img.oss-cn-beijing.aliyuncs.com/xdclass_pro/default/head_img/19.jpeg',
        ];
        let num = Math.floor(Math.random() * 10);
        return imgList[num];
    }

    static randomName() {
        let name = [
            '编程小白23423',
            '编程小白94352',
            '编程小白46597',
            '编程小白46236',
            '编程小白73453',
            '编程小白07848',
            '编程小白44462',
            '编程小白36688',
            '编程小白23665',
            '编程小白84562',
        ];

        let num = Math.floor(Math.random() * 10);
        return name[num];
    }
}

module.exports = RandomTool;