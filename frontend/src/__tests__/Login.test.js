import React from 'react';
import ReactDOM, {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, getByTestId, render, screen, waitForDomChange} from "@testing-library/react";
import {createMemoryHistory} from 'history';
import App from "../App";
import {Login} from "../pages/Login";
import {logout} from "../api/api";
import {Router} from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';
import{waitForElement} from "@testing-library/react";

let container = null;
describe('TEST LOGIN PAGE FUNCTIONALITIES:', function () {

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
        ReactDOM.render(<App/>, container);
    });

    it('should render login page correctly', function () {
        act(() => {
            ReactDOM.render(<App/>, container);
        });
        const submit = screen.getByTestId('submit');
        const reset = screen.getByTestId('reset');
        const form = container.querySelector('form');
        expect(submit.textContent).toBe("Login");
        expect(reset.textContent).toBe("Reset");
        expect(form).toBeInTheDocument();
    });
    it('should update correctly the text fields of login', function () {
        act(() => {
            ReactDOM.render(<App/>, container);
        });
        const username = screen.getByTestId('username');
        const password = screen.getByTestId('password');
        fireEvent.change(username, {target: {value: 'francesco'}});
        fireEvent.change(password, {target: {value: 'test'}});
        expect(username.value).toBe('francesco');
        expect(password.value).toBe('test');
    });
    it('should reset correctly fields username password on pressing reset button', function () {
        act(() => {
            ReactDOM.render(<App/>, container);
        });
        const username = screen.getByTestId('username');
        const password = screen.getByTestId('password');
        const reset = screen.getByTestId('reset');
        fireEvent.change(username, {target: {value: 'francesco'}});
        fireEvent.change(password, {target: {value: 'test'}});
        fireEvent.click(reset);
        expect(username.value).toBe('');
        expect(password.value).toBe('');
    });
    it('should display error login', async function () {
        act(() => {
            ReactDOM.render(<App/>, container);
        });

        const submit = screen.getByTestId('submit');
        fireEvent.click(submit);
    });
    it('should not do login when username or password are invalid,' +
        ' and is returned a text message on screen', async function () {
        act(() => {
            ReactDOM.render(<App/>, container);
        });
        const username = screen.getByTestId('username');
        const password = screen.getByTestId('password');
        const submit = screen.getByTestId('submit');
        fireEvent.change(username, {target: {value: 'francesco'}});
        fireEvent.change(password, {target: {value: 'fake'}});
        fireEvent.click(submit);
        await waitForElement(() => screen.getByText('Invalid credentials'));
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    it('should catch strange char in fields username and password', function () {
        act(() => {
            ReactDOM.render(<App/>, container);
        });
        const username = screen.getByTestId('username');
        const password = screen.getByTestId('password');
        fireEvent.change(username, {target: {value: '&'}});
        fireEvent.change(password, {target: {value: '&'}});
        expect(username.value).toBe('');
        expect(password.value).toBe('');
    });
});
describe('TEACHER TESTING PAGE', function () {
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
});
describe(' TESTING PAGE STUDENT AND TEACHER', function () {
    beforeEach(() => {
        // setup a DOM element as a render target
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach( () => {
        // cleanup on exiting
        unmountComponentAtNode(container);
        container.remove();
        container = null;
        global.sessionStorage.clear();
    });
    it('should show correctly student homePage and work correctly', async function () {
        const history=createMemoryHistory();
        history.push("/login");
        act(()=>{
            ReactDOM.render(<Router history={history}>
                <App/>
            </Router>,container);
        });
        const username=screen.getByTestId('username');
        const password=screen.getByTestId('password');
        const submit=screen.getByTestId('submit');
        fireEvent.change(username,{target: {value:'s269422' }});
        fireEvent.change(password,{target: {value:'scimmia' }});
        fireEvent.click(submit);
        await waitForElement(()=>screen.getByText('SE2 Les:4'));

        expect(screen.getByText('SE2 Les:4')).toBeInTheDocument();
        const confirmButton=screen.getByTestId('bookButton_2');

        fireEvent.click(confirmButton);
        await waitForElement(()=>screen.getByText('Do you want to book a seat for this lecture?'));
        const yes=screen.getByText('Yes');
        fireEvent.click(yes)
        await waitForElement(()=>screen.getByTestId('cancelButton_2'))
        const cancelButton=screen.getByTestId('cancelButton_2');
        fireEvent.click(cancelButton);
        await waitForElement(()=>screen.getByText('Do you want to cancel your booking for this lecture?'))
        fireEvent.click(screen.getByText('Yes'));
        await waitForElement(()=>screen.getByTestId('bookButton_2'));
        expect(screen.getByTestId('bookButton_2')).toBeInTheDocument();
        const log=screen.getByTestId('logout');
        fireEvent.click(screen.getByTestId('home'));
        fireEvent.click(screen.getByTestId('studentLectures'));
        fireEvent.click(screen.getByTestId('calendar'));
        fireEvent.click(log);
        await waitForElement(()=>screen.getByTestId('username'));
        expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('should do login teacher',  async function () {
        const history=createMemoryHistory();
        history.push("/login");
        act(()=>{
            ReactDOM.render(<Router history={history}>
                <App/>
            </Router>,container);
        });
        const username=screen.getByTestId('username');
        const password=screen.getByTestId('password');
        const submit=screen.getByTestId('submit');

        fireEvent.change(username,{target: {value:'t987654' }});
        fireEvent.change(password,{target: {value:'scimmia' }});
        fireEvent.click(submit);
        await waitForElement(()=>screen.getByTestId('teacherStudent'));
        const list=screen.getByTestId('teacherStudent');
        expect(list).toBeInTheDocument();
        fireEvent.click(list);
        await waitForElement(()=>screen.getByTestId('showList_1'));
        const showList=screen.getByTestId('showList_1');
        expect(screen.getByTestId('listTabSL')).toBeInTheDocument();
        fireEvent.click(showList);
        await waitForElement(()=>screen.getByText('s267348'));
        //expect(screen.getByTestId('studentsList')).toHaveLenght(1);
        expect(screen.getByTestId('studentsList')).toBeInTheDocument();
        const close=screen.getByTestId('close');
        expect(close).toBeInTheDocument();
        fireEvent.click(close);
        await waitForElement(()=>screen.getByTestId('showList_1'));
        const log=screen.getByTestId('logout');
        const homeRedirect=screen.getByTestId('homeRedirect');
        const lecturesPage=screen.getByTestId('lecturesPage');
        fireEvent.click(homeRedirect);
        fireEvent.click(lecturesPage);
        await waitForElement(()=>screen.getByTestId('showCourse_1'));
        const showCourse=screen.getByTestId('showCourse_1');
        fireEvent.click(showCourse);
        await waitForElement(()=>screen.getByText('CANCEL LECTURE'));
        //expect(screen.getByText('PDS Les:1')).toBeInTheDocument();
        //***********this part will be modified when we create other functionalities
        const modal1=screen.getByText('CANCEL LECTURE');
        const modal2=screen.getByText('TURN INTO DISTANCE LECTURE');
        fireEvent.click(modal1);
        fireEvent.click(modal2);
        //****************************************************
        fireEvent.click(screen.getByTestId('close'));
        fireEvent.click(log);
        await waitForElement(()=>screen.getByTestId('username'));
        expect(screen.getByTestId('username')).toBeInTheDocument();
    });
});





