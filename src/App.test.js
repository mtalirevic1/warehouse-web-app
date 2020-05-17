import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import App from './App';
import Login from "./components/login/Login";
import ProductsTable from "./components/productsTable/ProductsTable";

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

test('Login Screen Render Test', () => {
  const div = document.createElement("div");
  ReactDOM.render(<Login/>,div);
  ReactDOM.unmountComponentAtNode(div);
});

test('Login Form Render Test', () => {
  const layout=render(<Login/>);
  expect(layout.container.querySelector("form")).not.toBeNull();
});

test('Login Button Test', () => {
  const layout=render(<Login/>);
  expect(layout.container.querySelector("button")).not.toBeNull();
});
