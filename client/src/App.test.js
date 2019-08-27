import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import { Provider } from 'react-redux';
import { findByTestAttr, testStore } from './utils';

const setUp = (initialState={}) => {
  const store = testStore(initialState);
  const wrapper = shallow(<Provider store={store} />).childAt(0).dive();
  console.log(wrapper.debug())
  return wrapper;
}

describe('Top level app test', () => {
  let wrapper;
  beforeEach(() => {
    const initialState = { };
    wrapper = setUp(initialState);
  })
  
  
  it('renders without crashing', () => {
    const app = shallow(<Provider />);
    const wrapper = findByTestAttr(app, 'app');
    expect(wrapper.length).toBe(1);
  });
})