/* eslint-env jest */
import React from 'react';
import { mount } from 'enzyme';

import Contact from '../View';

const mockService = () => ({
	getAppUser: () => {
		return Promise.resolve({
			Links: [{rel: 'feedback'}]
		});
	}
});

const onBefore = () => {
	global.$AppConfig = {
		...(global.$AppConfig || {}),
		nodeService: mockService(),
	};
};

const onAfter = () => {
	//unmock getService()
	const {$AppConfig} = global;
	delete $AppConfig.nodeInterface;
	delete $AppConfig.nodeService;
};

const errorMessage = {
	message :{
		title: 'Message: ',
		desc: ' Message cannot be empty.'
	},
	email :{
		title: 'Email:',
		desc: ' Invalid email address.'
	}
};

describe('Contact', () => {
	beforeEach(onBefore);
	afterEach(onAfter);

	const getCmp = () => mount(
		<Contact/>
	);

	test('Test contact with empty email',  async () => {
		const cmp = getCmp();
		cmp.setState({email: '', message: ''});
		cmp.find('.submit-btn').simulate('click');
		await new Promise(resolve => {
			setTimeout(() => {
				resolve();
			}, 300);
		});

		expect(cmp.state().errorMessage).toEqual(errorMessage.email);
	});

	test('Test contact with empty message',  async () => {
		const cmp = getCmp();
		cmp.setState({email: 'test@email.com', message: ''});
		cmp.find('.submit-btn').simulate('click');
		await new Promise(resolve => {
			setTimeout(() => {
				resolve();
			}, 300);
		});

		expect(cmp.state().errorMessage).toEqual(errorMessage.message);
	});

	test('Test contact submit success',  async () => {
		const cmp = getCmp();
		cmp.setState({email: 'test@email.com', message: 'test message'});
		cmp.find('.submit-btn').simulate('click');
		await new Promise(resolve => {
			setTimeout(() => {
				resolve();
			}, 300);
		});

		expect(cmp.state().error).toEqual(false);
	});
});
