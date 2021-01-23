import React, { useState } from 'react';
import {Col, FormControl, Row, Tab, Tabs} from 'react-bootstrap';
import { connect } from 'react-redux';
import { keyboardMap as map } from '../consts/keyboard-map'


const keyboardComponent = () => {

    const [key, setKey] = useState(0);

    const handleKeyDown = (e: any) => {
        setKey(e.key);
    }

    window.addEventListener("keydown", handleKeyDown);

    /** 

    //We will have students define the code for us and put it into an object. How to do that though?

    const buttons = {}; // button will have the format of : button name -> the mapped key
    const track = [];

    const handleKeyDown = (e: any) => {
        track[map[buttons[e.key]]] = true;
    }

    const handleKeyUp = (e: any) => {
        
    }

    const handleButtonChange = (button: string) => {
        const handleButtonChangeEvent = (e: React.FormEvent<FormControl & HTMLInputElement>) => {
            buttons[button] = e.currentTarget.value; //change the assigned key to the button
        }

        return handleButtonChangeEvent;
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
*/
    return (
        <Tabs defaultActiveKey={1} animation={false} id="keyboard-tab">
            <Tab eventKey={1} title="Keyboard">
            </Tab>
            <Tab eventKey={2} title="Button Config">
                {Object.keys(map).map(button => (
                    <Row>
                        <Col> {button} </Col>
                        <Col><FormControl type="text" value = {buttons[button]} onChange = {handleButtonChange(button)}/></Col>
                    </Row>
                ))}
            </Tab>
        </Tabs>
    )
}

export const keyboard = connect(keyboardComponent); //react-redux to be done later...