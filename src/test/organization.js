const config = require('./config');
const request = require('supertest')(config.app);
const assert = require('power-assert');
const Mock = require('mockjs');
const qs = require('querystring')
const reg_mobile = config.reg_mobile
/**组织接口 */
describe('/core/organization', () => {
	const prefix = '/core/organization';
	let token = '';
	let name = config.user_name
	let password = config.password
	const default_password = config.default_password
	let test_details = {
		id: 1011,
		name: ''
	}
	/**运行前执行 */
	before(async () => {
		//获取token
		let res = await request.post(`/core/oauth/login`)
			.send({
				user_name: name,
				password: password
			}).expect(200);
		let body = res.body;
		assert.equal(body.code, 0, body.message + '|' + body.desc);
		//token = body.data.token;
		token='123456';
		//获取组织信息
		const query = qs.stringify({
			name: 'test',
			mobile: '',
			status: ''
		})
		// res = await request.get(`${prefix}/list?${query}`).set('Accept', 'application/json')
		// 	.expect('Content-Type', /json/).set('token', token).set('language',config.language).expect(200);
		// body = res.body;
		// assert.equal(body.code, 0, body.message + '|' + body.desc);
		// test_details = body.data.length > 1 ? body.data[body.data.length - 1] : {}
	})
	/**新增组织 */
	describe(`POST ${prefix}/create`, () => {
		it('createorganization success', async () => {

			let res = await request.post('/core/file/upload').expect('Content-Type', /json/).set('token', token)
			.field('folder_name','banner')
			.attach('file',__dirname+`/files/${Mock.Random.integer(1,4)}.jpg`)
		    let file = res.body.data;

			res = await request.post(`${prefix}/create`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).set('language',config.language).send(Mock.mock({
					'company_id':'900000',
					'parent_id':1000,
					'name': '@cword(4)',
					'name_short':'@cword(2)',
					'type':'3',
					'sort_no':'1',
				})).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})
	})
	/**修改组织 */
	describe(`POST ${prefix}/update`, () => {
		it('updateorganization success', async () => {
			let res = await request.post(`${prefix}/update`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).set('language',config.language).send(Mock.mock({
					'id':test_details.id,
					'company_id':'900000',
					'parent_id':1000,
					'name': '@cword(4)',
					'name_short':'@cword(2)',
					'type':'3',
					'sort_no':'1',
				})).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})
	})

	/**组织详情 */
	describe(`GET ${prefix}/details`, () => {
		it('get organizationdetails', async () => {
			let res = await request.get(`${prefix}/details/${test_details.id}`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).set('language',config.language).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
			assert.equal(body.data.id, test_details.id);
			console.log(body)
		})
	})

	/**组织列表 */
	describe(`GET ${prefix}/treeList`, () => {
		it('get organizationtreeList', async () => {
			const query = qs.stringify({
				company_id:900000
			})
			let res = await request.get(`${prefix}/treeList?${query}`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).set('language',config.language).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
			assert(body.data.length > 0);
		})
	})

	/**删除组织 */
	describe(`DELETE ${prefix}/delete`, () => {
		it('deleteorganization success', async () => {
			let res = await request.post(`${prefix}/delete`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).set('language',config.language).send({
					'id': test_details.id
				}).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message + '|' + body.desc);
		})
	})
});