import React, { useState } from "react";
import { Modal, Row, Col, FormControl, Form, FormGroup } from "react-bootstrap";
import { connect } from "react-redux";

interface OwnProps {
    shouldShow: boolean;
    hide: () => void;
}
  
type Props = OwnProps;
  

const CheckCodeChallengesModalComponent = (props: Props) => {

    const [inputs, changeInputs] = useState({});
    const [outputs, changeOutputs] = useState({}); //to be done later. 


    const loadFunctions = () => {
        //this is where we will parse the code. Regex time maaaaaaannnn
    }

    const handleInputChange = (functionName: string) => {
        const handleInputChangeEvent = (e: React.FormEvent<FormControl & HTMLInputElement>) => {
            changeInputs({ [functionName]: parseInt(e.currentTarget.value) })
        }
        
        return handleInputChangeEvent
    }

    return(
            <div>
                <Modal show={props.shouldShow} onHide={props.hide}>
                <Form>
                    <Modal.Title> Challenge Inputs</Modal.Title>
                    <Modal.Body>
                    <FormGroup>
                        {Object.keys(inputs).map((functionName) => (
                            <Row>
                                <Col>{functionName}</Col>
                                <Col><FormControl type="text" placeholder="Input" onChange = {handleInputChange(functionName)}/></Col> 
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

const mapStateToProps = (state: ApplicationState) => {
    //redux ;)
}

export const CheckCodeChallengesModal = connect(mapStateToProps)(CheckCodeChallengesModalComponent);