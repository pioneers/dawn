import React from 'react';
import { Panel } from 'react-bootstrap';

interface OwnProps {
  height: number;
  output: string[];
  shouldShow: boolean;
  toggleConsole: () => void;
}

type Props = OwnProps;

export class ConsoleOutput extends React.Component<Props> {
  outerDiv: HTMLDivElement | null;
  constructor(props: Props) {
    super(props);
  }

  componentDidMount = () => {
    this.scrollToBottom();
  };

  componentWillReceiveProps = (nextProps: Props) => {
    if (this.props.output.length !== nextProps.output.length && !this.props.shouldShow) {
      this.props.toggleConsole();
    }
  };

  componentDidUpdate = () => {
    this.scrollToBottom();
  };

  scrollToBottom = () => {
    if (this.outerDiv !== null) {
      this.outerDiv.scrollTop = this.outerDiv.scrollHeight;
    }
  };

  render() {
    const { shouldShow, output } = this.props;

    const height = `${String(this.props.height)}px`; // TODO: Use Panel.Collapse
    return (
      <div>
        <Panel
          style={{
            display: shouldShow ? 'block' : 'none',
            marginBottom: '0',
            borderRadius: '0'
          }}
        >
          <Panel.Body>
            <pre
              style={{
                position: 'relative',
                margin: '0',
                height
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: '0',
                  maxHeight: height,
                  overflowY: 'auto',
                  padding: '20px',
                  width: '99%'
                }}
                ref={(el) => {
                  this.outerDiv = el;
                }}
              >
                {output.map((line) => (
                  <code key={`${line}-Code`}>{line}</code>
                ))}
              </div>
            </pre>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}
