
interface OwnProps {
    shouldShow: boolean;
    hide: () => void;
}
  
type Props = OwnProps;
  
interface State {
    //To be updated...
}

class CheckCodeChallengesModal extends React.Component<Props,State>{
    constructor(props: Props){
        super(props);

        this.state= {
            
        }
    }

}