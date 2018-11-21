
const config=require('./config');
const request = require('supertest')(config.app);
const assert = require('power-assert');
const Mock = require('mockjs');

/**资源接口 */
describe('/core/resource', () => {
	const prefix = '/core/resource';
	let token = '';
	let user_name = config.user_name
	let password = config.password
	let test_details = {
		resource_id: 0,
		resource_name: ''
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
		//获取详情信息
		res = await request.get(`${prefix}/treeList`).set('Accept', 'application/json')
			.expect('Content-Type', /json/).set('token', token).send({
				resource_name: 'role'
			}).expect(200);
		body = res.body;
		assert.equal(body.code, 0, body.message + '|' + body.desc);
		test_details = body.data.length > 1 ? body.data[body.data.length - 1] : {}
	})

	/**新增资源 */
	describe(`POST ${prefix}/create`, () => {
		it('create role success', async () => {
			let res = await request.post(`${prefix}/create`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send(Mock.mock({
					'resource_name': '@cword(2,20)',
                    'resource_type|1':[1,2,3],
                    'path':'@url',
                    'parent_id|1-100':10,
                    'is_visiable|1':[0,1],
                    'sort_no|0-20':20,
				})).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})
	})
	/**修改资源 */
	describe(`POST ${prefix}/update`, () => {
		it('update role success', async () => {
			let res = await request.post(`${prefix}/update`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send(Mock.mock({
					'resource_id': test_details.resource_id,
					'resource_name': '@cword(2,20)',
                    'resource_type':test_details.resource_type,
                    'path':test_details.path,
                    'parent_id':test_details.parent_id,
                    'is_visiable|1':[0,1],
                    'sort_no|0-20':20,
				})).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})
	})

	/**资源详情 */
	describe(`GET ${prefix}/details`, () => {
		it('get role details', async () => {
			let res = await request.get(`${prefix}/details/${test_details.resource_id}`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
			assert.equal(body.data.resource_id, test_details.resource_id);
		})
	})

	/**资源列表 */
	describe(`GET ${prefix}/treeList`, () => {
		it('get role treeList', async () => {
			let res = await request.get(`${prefix}/treeList`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send({
					resource_name: 'role'
				}).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
			assert(body.data.length > 0);
		})
	})
	/**删除资源 */
	describe(`DELETE ${prefix}/delete`, () => {
		it('delete role success', async () => {
			let res = await request.delete(`${prefix}/delete`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send({
					'resource_id': test_details.resource_id
				}).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})
	})
});