import React from 'react';
import ReactDOM, {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, screen} from "@testing-library/react";
import App from "../App";
import {Login} from "../pages/Login";

let container = null;
describe('TEST LOGIN PAGE:', function () {

    beforeEach(() => {
        // setup a DOM element as a render target
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        // cleanup on exiting
        unmountComponentAtNode(container);
        container.remove();
        container = null;
        global.sessionStorage.clear();
    });
    it('should render app without crash', function () {
        ReactDOM.render(<App/>,container);
    });

    it('should render login page correctly', function () {
        act(()=>{
            ReactDOM.render(<App/>,container);
        });
        const submit=screen.getByTestId('submit');
        const reset=screen.getByTestId('reset');
        const form=container.querySelector('form');
        expect(submit.textContent).toBe("Login");
        expect(reset.textContent).toBe("Reset");
    });
    it('should update correctly the text fields of login',  function () {
        act(()=>{
            ReactDOM.render(<App/>,container);
        });
        const username=screen.getByTestId('username');
        const password=screen.getByTestId('password');
        fireEvent.change(username, {target: {value:'francesco' }});
        fireEvent.change(password,{target:{value:'test'}});
        expect(username.value).toBe('francesco');
        expect(password.value).toBe('test');
    });
    it('should reset correctly fields username password on pressing reset button',  function () {
        act(()=>{
            ReactDOM.render(<App/>,container);
        });
        const username=screen.getByTestId('username');
        const password=screen.getByTestId('password');
        const reset=screen.getByTestId('reset');
        fireEvent.change(username, {target: {value:'francesco' }});
        fireEvent.change(password,{target:{value:'test'}});
        fireEvent.click(reset);
        expect(username.value).toBe('');
        expect(password.value).toBe('');
    });
    it('should display error login',  function () {
        act(()=>{
            ReactDOM.render(<App/>,container);
        });

        const submit=screen.getByTestId('submit');
        const username=screen.getByTestId('username');
        const password=screen.getByTestId('password');
        fireEvent.click(submit);
    });
    /*it('should redirect teacher page',  function () {
        global.sessionStorage.setItem("userName", "francesco");
        global.sessionStorage.setItem("userType", "t");
        act(()=>{
            ReactDOM.render(
                <App/>
                ,container);
        });
    });
    it('should redirect student page', function () {
        global.sessionStorage.setItem("userName", "francesco");
        global.sessionStorage.setItem("userType", "s");
        act(()=>{
            ReactDOM.render(<App/>,container);
        })
    });*/
    it('should do login ',  function (done) {
        act(()=>{
            ReactDOM.render(<App/>,container);
        });
        const username=screen.getByTestId('username');
        const password=screen.getByTestId('password');
        const submit=screen.getByTestId('submit');

        fireEvent.change(username,{target: {value:'francesco' }});
        fireEvent.change(password,{target: {value:'scimmia' }});
        act((doneFn)=>{
            fireEvent.click(submit);
            setTimeout(function () {
                done();
            },3000);
        });

    });
    it('should not do login', function (done) {
        act(()=>{
            ReactDOM.render(<App/>,container);
        });
        const username=screen.getByTestId('username');
        const password=screen.getByTestId('password');
        const submit=screen.getByTestId('submit');
        fireEvent.change(username,{target: {value:'francesco' }});
        fireEvent.change(password,{target: {value:'fake' }});
        act((doneFn)=>{
            fireEvent.click(submit);
            setTimeout(function () {
                done();
            },3000);
        });
    });

    it('should catch strange char in fields username and password', function () {
        act(()=>{
            ReactDOM.render(<App/>,container);
        });
        const username=screen.getByTestId('username');
        const password=screen.getByTestId('password');
        fireEvent.change(username,{target: {value:'&' }});
        fireEvent.change(password,{target: {value:'&' }});
        expect(username.value).toBe('');
        expect(password.value).toBe('');
    });

})
