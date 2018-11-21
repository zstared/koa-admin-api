
const config=require('./config');
const request = require('supertest')(config.app);
const assert = require('power-assert');
const Mock = require('mockjs');
const reg_mobile =config.reg_mobile
/**用户接口 */
describe('/core/user', () => {
	const prefix = '/core/user';
	let token = '';
	let user_name = config.user_name
	let password = config.password
	const default_password = config.default_password
	let test_details = {
		user_id: 0,
		user_name: ''
	}
	/**运行前执行 */
	before(async () => {
		//获取token
		let res = await request.post(`${prefix}/login`)
			.send({
				user_name: user_name,
				password: password
			}).expect(200);
		let body = res.body;
		assert.equal(body.code, 0, body.message + '|' + body.desc);
		token = body.data.token;
		//获取用户信息
		res = await request.get(`${prefix}/list`).set('Accept', 'application/json')
			.expect('Content-Type', /json/).set('token', token).send({
				user_name: 'test'
			}).expect(200);
		body = res.body;
		assert.equal(body.code, 0, body.message + '|' + body.desc);
		test_details = body.data.length > 1 ? body.data[body.data.length - 1] : {}
	})
	/**登录 */
	describe(`POST ${prefix}/login`, () => {
		it('login success', async () => {
			let res = await request.post(`${prefix}/login`)
				.send({
					user_name: user_name,
					password: password
				}).set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
			assert.ok(/^\w{32}$/.test(body.data.token), 'token error');
			token = body.data.token;
		});
		it('login error', async () => {
			let res = await request.post(`${prefix}/login`)
				.send({
					user_name: user_name,
					password: password + 'adcde',
				}).set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200);
			const body = res.body;
			assert.equal(body.code, 2000, body.message + '|' + body.desc);
		});
	});

	/**注销 */
	describe(`POST ${prefix}/logout`, () => {
		it('logout success', async () => {
			let res = await request.post(`${prefix}/login`)
				.send({
					user_name: test_details.user_name,
					password: default_password
				}).expect(200);
			let body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
			let test_token = body.data.token;

			res = await request.post(`${prefix}/logout`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', test_token).send({
					user_name: test_details.user_name
				}).expect(200);
			body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})

	})
	/**修改密码 */
	describe(`POST ${prefix}/updatePassword`, () => {
		it('update password success', async () => {
			let res = await request.post(`${prefix}/updatePassword`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send({
					user_name: test_details.user_name,
					old_password: default_password,
					new_password: default_password
				}).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})
	})
	/**新增用户 */
	describe(`POST ${prefix}/create`, () => {
		it('create user success', async () => {
			let res = await request.post(`${prefix}/create`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send(Mock.mock({
					'user_name': /^test\d{10}$/,
					'sex|1': [1, 2],
					'mobile': reg_mobile,
					'mail': '',
				})).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})
	})
	/**修改用户 */
	describe(`POST ${prefix}/update`, () => {
		it('update user success', async () => {
			let res = await request.post(`${prefix}/update`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send(Mock.mock({
					'user_id': test_details.user_id,
					'password': password,
					'sex|1': [1, 2],
					'mobile': reg_mobile,
					'mail': '@email',
				})).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})
	})
	/**修改用户状态 */
	describe(`POST ${prefix}/updateState`, () => {
		it('update user state success', async () => {
			let res = await request.post(`${prefix}/updateState`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send({
					'user_id': test_details.user_id,
					'state': test_details.state ? 0 : 1
				}).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})
	})

	/**用户详情 */
	describe(`GET ${prefix}/details`, () => {
		it('get user details', async () => {
			let res = await request.get(`${prefix}/details/${test_details.user_id}`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
			assert.equal(body.data.user_id, test_details.user_id);
		})
	})

	/**用户列表 */
	describe(`GET ${prefix}/list`, () => {
		it('get user list', async () => {
			let res = await request.get(`${prefix}/list`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send({
					user_name: 'test'
				}).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
			assert(body.data.length > 0);
		})
	})
	/**删除用户 */
	describe(`DELETE ${prefix}/delete`, () => {
		it('delete user success', async () => {
			let res = await request.delete(`${prefix}/delete`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send({
					'user_id': test_details.user_id
				}).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})
	})
});