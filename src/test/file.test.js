const config = require('./config');
const request = require('supertest')(config.app);
const assert = require('power-assert');
const Mock = require('mockjs');
const qs = require('querystring')

/**文件接口 */
describe('/core/file', () => {
	const prefix = '/core/file';
	let token = '';
	let user_name = config.user_name
	let password = config.password

	/**运行前执行 */
	before(async () => {
		//获取token
        let res = await request.post(`/core/oauth/login`)
			.send({
				user_name: user_name,
				password: password
			}).expect(200);
		let body = res.body;
		assert.equal(body.code, 0, body.message + '|' + body.desc);
		token = body.data.token;

	})

	/**上传文件 */
    describe(`POST ${prefix}/up
    load`, () => {
		it('upload file success', async () => {

			let res = await request.post(`${prefix}/upload`).expect('Content-Type', /json/).set('token', token)
			.field('folder_name','banner')
			.attach('file',__dirname+`/files/${Mock.Random.integer(1,4)}.jpg`)
            let file = res.body.data;
            console.log(file)
			assert.equal(res.body.code, 0, res.body.message + '|' + res.body.desc);
		})
	})
});