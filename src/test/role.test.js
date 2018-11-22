const config = require('./config');
const request = require('supertest')(config.app);
const assert = require('power-assert');
const Mock = require('mockjs');
const qs=require('querystring');

/**角色接口 */
describe('/core/role', () => {
	const prefix = '/core/role';
	let token = '';
	let user_name = config.user_name
	let password = config.password
	let test_details = {
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
		const query=qs.stringify({
			role_name:'role',
		})
		res = await request.get(`${prefix}/list?${query}`).set('Accept', 'application/json')
			.expect('Content-Type', /json/).set('token', token).expect(200);
		body = res.body;
		assert.equal(body.code, 0, body.message + '|' + body.desc);
		test_details = body.data.length > 1 ? body.data[body.data.length - 1] : {}
	})

	/**新增角色 */
	describe(`POST ${prefix}/create`, () => {
		it('create role success', async () => {
			let res = await request.post(`${prefix}/create`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send(Mock.mock({
					'role_name': 'role@cword(2,10)',
					'role_desc': '@cparagraph(2)',
					'sort_no|1-100': 1
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
					'role_id': test_details.role_id,
					'role_name': /^role\d{10}$/,
					'role_desc': '@cparagraph(2)',
					'sort_no|1-100': 100
				})).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})
	})

	/**角色详情 */
	describe(`GET ${prefix}/details`, () => {
		it('get role details', async () => {
			let res = await request.get(`${prefix}/details/${test_details.role_id}`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
			assert.equal(body.data.role_id, test_details.role_id);
		})
	})

	/**角色列表 */
	describe(`GET ${prefix}/list`, () => {
		it('get role list', async () => {
			const query=qs.stringify({
				role_name:'role',
				order_by:'role_name|asc'
			})
			let res = await request.get(`${prefix}/list?${query}`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
			assert(body.data.length > 0);
		})

		it('parameter error', async () => {
			const query=qs.stringify({
				role_name:'role',
				order_by:'role_name'
			})
			let res = await request.get(`${prefix}/list?${query}`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).expect(200);
			const body = res.body;
			assert.equal(body.code, 2001, body.message + '|' + body.desc);
		})
	})
	/**角色分页列表 */
	describe(`GET ${prefix}/pageList`, () => {
		it('get role pageList', async () => {
			const query=qs.stringify({
				role_name:'role',
				page_index:1,
				page_size:20,
				order_by:'role_name|asc'
			})
			let res = await request.get(`${prefix}/pageList?${query}`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
			assert(body.data.rows.length > 0);
		})
	})
	/**删除角色 */
	describe(`DELETE ${prefix}/delete`, () => {
		it('delete role success', async () => {
			let res = await request.delete(`${prefix}/delete`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send({
					'role_id': test_details.role_id
				}).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})
	})
});