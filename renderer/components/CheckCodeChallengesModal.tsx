import React, { useState } from "react";
import { Modal, Row, Col, FormControl, Form, FormGroup } from "react-bootstrap";

interface OwnProps {
    shouldShow: boolean;
    hide: () => void;
}
  
type Props = OwnProps;
  

const CheckCodeChallengesModal = (props: Props) => {

    const [inputs, changeInputs] = useState({});
    const [outputs, changeOutputs] = useState({}); //to be done later. 


    const loadFunctions = () => {
        //this is where we will parse the code. Regex time maaaaaaannnn
    }

    const handleInputChange = (e: React.FormEvent<FormControl & HTMLInputElement>) => {
        //changeInputs({ *FunctionNameHere* : parseInt(e.currentTarget.value) });
    }

    return(   
            <div>
                <Modal show={shouldShow} onHide={hide}>
                <Form>
                    <Modal.Title> Challenge Inputs</Modal.Title>
                    <Modal.Body>
                    <FormGroup>
                        {Object.keys(inputs).map((functionName) => (
                            <Row>
                                <Col>{functionName}</Col>
                                <Col><FormControl type="text" placeholder="Input" onChange = {handleInputChange}/></Col> 
                                <Col><FormControl type="text" placeholder="Output"/> </Col>
                            </Row>
                        ))}
                    </FormGroup>
                    </Modal.Body>
                </Form>   
                </Modal>
            </div>
        
        );
};