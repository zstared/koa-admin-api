
// const app = require('../index.js');
const request = require('supertest')('localhost:8081');
const assert = require('power-assert');
const Mock = require('mockjs');
const config=require('./config');
/**用户接口 */
describe('/core/role', () => {
	const prefix = '/core/role';
	let token = '';
	let user_name = config.user_name
	let password = config.password
	let test_role = {
		role_id: 0,
		role_name: ''
	}
	/**运行前执行 */
	before(async () => {
		//获取token
		let res = await request.post(`/core/user/login`)
			.send({
				user_name: user_name,
				password: password
			}).expect(200);
		let body = res.body;
		assert.equal(body.code, 0, body.message + '|' + body.desc);
		token = body.data.token;
		//获取角色信息
		res = await request.get(`${prefix}/list`).set('Accept', 'application/json')
			.expect('Content-Type', /json/).set('token', token).send({
				role_name: 'role'
			}).expect(200);
		body = res.body;
		assert.equal(body.code, 0, body.message + '|' + body.desc);
		test_role = body.data.length > 1 ? body.data[body.data.length - 1] : {}
	})

	/**新增角色 */
	describe(`POST ${prefix}/create`, () => {
		it('create role success', async () => {
			let res = await request.post(`${prefix}/create`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send(Mock.mock({
					'role_name': /^role\d{10}$/,
                    'role_desc':'@cparagraph(2)',
                    'sort_no|1-100':1
				})).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})
	})
	/**修改角色 */
	describe(`POST ${prefix}/update`, () => {
		it('update role success', async () => {
			let res = await request.post(`${prefix}/update`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send(Mock.mock({
					'role_id': test_role.role_id,
					'role_name': /^role\d{10}$/,
                    'role_desc':'@cparagraph(2)',
                    'sort_no|1-100':100
				})).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})
	})

	/**角色详情 */
	describe(`GET ${prefix}/details`, () => {
		it('get role details', async () => {
			let res = await request.get(`${prefix}/details/${test_role.role_id}`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
			assert.equal(body.data.role_id, test_role.role_id);
		})
	})

	/**角色列表 */
	describe(`GET ${prefix}/list`, () => {
		it('get role list', async () => {
			let res = await request.get(`${prefix}/list`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send({
					role_name: 'role'
				}).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
			assert(body.data.length > 0);
		})
	})
	/**删除角色 */
	describe(`DELETE ${prefix}/delete`, () => {
		it('delete role success', async () => {
			let res = await request.delete(`${prefix}/delete`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send({
					'role_id': test_role.role_id
				}).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})
	})
});