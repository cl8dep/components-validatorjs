import React from 'react';
import { shallow } from 'enzyme';
import FormHandler from "../src";

describe('FormHandler should render', () => {
    let withFormHandler;

    beforeEach(() => {
        const mockedComponent = jest.fn();

        const rules = {

        }

        withFormHandler = FormHandler(rules)(mockedComponent);
    });

    it('Not should render without rules', () => {
        const wrapper = shallow(<withFormHandler/>);
        expect(wrapper);
    });

});