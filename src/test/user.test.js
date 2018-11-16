// import assert from 'power-assert';
// import {
// 	describe,
// 	it
// } from 'mocha';
// import request from 'supertest';

// const app = require('../index.js');
const assert = require('power-assert');
const request = require('supertest')('localhost:8081');

/**用户接口 */
describe('/core/user', () => {
	const prefix = '/core/user';
	let token = '';
	let user_name = 'admin';
	let password = 'admin';
	/**每次重新登录 */
	beforeEach(async () => {
		let res = await request.post(`${prefix}/login`)
			.send({
				user_name: user_name,
				password: password
			})
		token = res.body.data.token;
	});
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
			assert.equal(body.code, 0, body.message);
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
			assert.equal(body.code, 2000, body.message);
		});
	});

	/**注销 */
	describe(`POST ${prefix}/logout`, () => {
		it('logout success', async () => {
			let res = await request.post(`${prefix}/logout`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send({
					user_name: user_name
				}).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message);
		})
	})
	/**修改密码 */
	describe(`POST ${prefix}/updatePassword`, () => {
		it('update password success', async () => {
			let res = await request.post(`${prefix}/updatePassword`).set('Accept', 'application/json')
				.expect('Content-Type', /json/).set('token', token).send({
					user_name: user_name,
					old_password: password,
					new_password: password
				}).expect(200);
			const body = res.body;
			assert.equal(body.code, 0, body.message);
		})
	})
	/**新增用户 */
	// describe(`POST ${prefix}/create`, () => {
	// 	it('update password success', async () => {
	// 		let res = await request.post(`${prefix}/create`).set('Accept', 'application/json')
	// 		.expect('Content-Type', /json/).set('token', token).send({
	// 			user_name: 'admin',
	// 			old_password: 'admin',
	// 			new_password: 'admin'
	// 		}).expect(200);
	// 		const body = res.body;
	// 		assert.equal(body.code, 0, body.message);
	// 	})
	// })
});