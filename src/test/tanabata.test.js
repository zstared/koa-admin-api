const config = require('./config');
const request = require('supertest')(config.app);
const assert = require('power-assert');
const Mock = require('mockjs');
const qs = require('querystring');

/**照片接口 */
describe('/xh/tanabata', () => {
	const prefix = '/xh/tanabata';
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

	/**新增照片 */
	describe(`POST ${prefix}/create`, () => {
		it('create tanabata success', async () => {

			let res = await request.post('/core/file/upload').expect('Content-Type', /json/).set('token', token)
			.field('folder_name','banner')
			.attach('file',__dirname+`/files/${Mock.Random.integer(1,4)}.jpg`)
		    let file = res.body.data;

			res = await request.post(`${prefix}/create`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).set('language',config.language).set('language',config.language).send(Mock.mock({
					'title': '@cword(2,10)',
					'tanabata_code':file.code,
					'description': '@cparagraph(2)',
					'type|1-10':1,
					'tag|1-10':1,
					'sort_no|1-100': 1
				})).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})
	})

	/**照片分页列表 */
	describe(`GET ${prefix}/pageList`, () => {
		it('get role pageList', async () => {
			const query = qs.stringify({
				title: '',
				page_index: 1,
				page_size: 20,
			})
			let res = await request.get(`${prefix}/pageList?${query}`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).set('language',config.language).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
			assert(body.data.rows.length > 0);
		})
	})
});