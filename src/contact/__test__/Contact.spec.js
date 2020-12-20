/* eslint-env jest */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { wait } from '@nti/lib-commons';

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

	test('Test contact with empty email',  async () => {
		let cmp;
		const {container:root} = render( <Contact ref={x => cmp = x }/> );

		cmp.setState({email: '', message: ''});

		await wait();

		fireEvent.click(root.querySelector('.submit-btn'));

		await waitFor(() =>
			expect(cmp.state.errorMessage).toEqual(errorMessage.email));
	});

	test('Test contact with empty message',  async () => {
		let cmp;
		const {container:root} = render( <Contact ref={x => cmp = x }/> );

		cmp.setState({email: 'test@email.com', message: ''});

		await wait();

		fireEvent.click(root.querySelector('.submit-btn'));

		await waitFor(() =>
			expect(cmp.state.errorMessage).toEqual(errorMessage.message));
	});

	test('Test contact submit success',  async () => {
		let cmp;
		const {container:root} = render( <Contact ref={x => cmp = x }/> );

		cmp.setState({email: 'test@email.com', message: 'test message'});

		await wait();

		fireEvent.click(root.querySelector('.submit-btn'));

		await waitFor(() =>
			expect(cmp.state.error).toEqual(false));
	});
});
