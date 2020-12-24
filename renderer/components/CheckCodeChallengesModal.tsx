import React from "react";
import { Modal, Row } from "react-bootstrap";

interface OwnProps {
    shouldShow: boolean;
    hide: () => void;
}
  
type Props = OwnProps;
  
interface State {
    inputs: Object;
}

class CheckCodeChallengesModal extends React.Component<Props,State>{
    constructor(props: Props){
        super(props);

        this.state= {
            inputs: {}, //this will be the objects that keeps the function names
        }
        
    }

    loadFunctions() {
        //this is where we will parse the code. Regex time maaaaaaannnn
    }

    render() {
        
        this.loadFunctions();

        return(
            <div>
                <Modal show={shouldShow} onHide={hide}>
                <Modal.Title> Challenge Inputs</Modal.Title>
                <Modal.Body>
                { Object.keys(functions).map((functionName) => (
                    <Row>
                    </Row>
        ))}
                </Modal.Body>     
                </Modal>
            </div>
        
        );
    };

};