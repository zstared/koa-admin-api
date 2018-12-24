const config = require('./config');
const request = require('supertest')(config.app);
const assert = require('power-assert');
const Mock = require('mockjs');
const program = require('commander');

program
    .version('0.0.1')
    .option('-m, --module <string>', 'init module data')
    .parse(process.argv);

/**
 * 模拟数据
 */
class MockData {
    constructor() {
        this.token = '';
        this.user_name = config.user_name
        this.password = config.password
    }

    /**
     * 初始化
     */
    async init() {
        //获取token
        let res = await request.post(`/core/user/login`)
            .send({
                user_name: this.user_name,
                password: this.password
            }).expect(200);
        let body = res.body;
        assert.equal(body.code, 0, body.message + '|' + body.desc);
        this.token = body.data.token;
    }

    /**
     * 模拟resouce数据
     */
    async resource() {
        await this.init();
        let prefix = '/core/resource'
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 20; j++) {
                let data = {}
                if (i == 0) {
                    //模拟一级菜单 
                    data = Mock.mock({
                        'resource_name': '@cword(2,20)',
                        'resource_code': '@word(2,20)',
                        'resource_type': 1,
                        'path': '',
                        'parent_id': 0,
                        'is_visiable|1': [0, 1],
                        'sort_no|0-10': 10,
                    })
                } else if (i == 1) {
                    //模拟二级菜单
                    data = Mock.mock({
                        'resource_name': '@cword(2,20)',
                        'resource_code': '@word(2,20)',
                        'resource_type': 1,
                        'path|1': ['', '@url'],
                        'parent_id|1-20': 20,
                        'is_visiable|1': [0, 1],
                        'sort_no|0-20': 20,
                    })
                } else if (i == 2) {
                    //模拟权限
                    data = Mock.mock({
                        'resource_name': '@cword(2,20)',
                        'resource_code': '@word(2,20)',
                        'resource_type': 2,
                        'path': '',
                        'parent_id|20-40': 20,
                        'is_visiable|1': 1,
                        'sort_no|0-20': 20,
                    })
                } else if (i == 3) {
                    //模拟接口
                    data = Mock.mock({
                        'resource_name': '@cword(2,20)',
                        'resource_code': '@word(2,20)',
                        'resource_type': 3,
                        'path': '@url',
                        'parent_id|40-60': 40,
                        'is_visiable|1': 1,
                        'sort_no|0-20': 20,
                    })
                } else {
                    //随机模拟
                    data = Mock.mock({
                        'resource_name': '@cword(2,20)',
                        'resource_code': '@word(2,20)',
                        'resource_type|1': [1, 2, 3],
                        'path|1': ['', '@url'],
                        'parent_id|1-200': 100,
                        'is_visiable|1': [0, 1],
                        'sort_no|0-20': 20,
                    })
                }

                let res = await request.post(`${prefix}/create`).set('Accept', 'application/json')
                    .expect('Content-Type', /json/).set('token', this.token).send(data).expect(200);
                //assert.equal(res.body.code, 0, res.body.message | res.body.desc)
                console.log(res.body.code,res.body.message,res.body.desc)
            }
        }
    }
}

const mockData = new MockData();

async function run() {
    switch (program.module) {
        case 'resource':
            await mockData.resource();
            break;
        default:
            break;
    }
}
run();