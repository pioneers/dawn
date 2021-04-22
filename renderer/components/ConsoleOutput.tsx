import React from 'react';
import { Card } from 'react-bootstrap';

interface StateProps {
  toggleConsole: () => void;
  disableScroll: boolean;
}

interface OwnProps {
  height: number;
  output: Array<any>
  show: boolean;
}

type Props = StateProps & OwnProps;

export class ConsoleOutput extends React.Component<Props> {
  outerDiv: HTMLDivElement | null;
  constructor(props: Props) {
    super(props);
  }

  componentDidMount = () => {
    this.scrollToBottom();
  }

  componentWillReceiveProps = (nextProps: Props) => {
    if (this.props.output.length === 0 && nextProps.output.length > 0 && !this.props.show) {
      this.props.toggleConsole();
    }
  }

  componentDidUpdate = () => {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    if (!this.props.disableScroll) {
      if (this.outerDiv !== null) {
        this.outerDiv.scrollTop = this.outerDiv.scrollHeight;
      }
    }
  }


  render() {
    const { show, output } = this.props;

    const height = `${String(this.props.height)}px`; // TODO: Use Panel.Collapse
    return (
      <div>
        <Card
          style={{
            display: show ? 'block' : 'none',
            marginBottom: '0',
            borderRadius: '0',
          }}
        >
          <Card.Body>
            <pre
              style={{
                position: 'relative',
                margin: '0',
                height,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: '0',
                  maxHeight: height,
                  overflowY: 'auto',
                  padding: '20px',
                  width: '99%',
                }}
                ref={(el) => { this.outerDiv = el; }}
              >
                {output.map(line => (
                  <code key={`${line}-Code-${Math.random()}`}>{line}</code>
                ))}
              </div>
            </pre>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
