import { Card } from 'react-bootstrap';
import React, { useEffect, useRef } from 'react';

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

export function ConsoleOutput(props: Props) {
  let outerDiv: HTMLDivElement | HTMLPreElement|  null;
  let { show, output } = props;

  const prevOutputRef = useRef([] as string[]);
  const prevOutput = prevOutputRef.current;
  useEffect(() => {
    prevOutputRef.current = output;
    scrollToBottom();
    if (prevOutput.length === 0 && output.length > 0 && !show) {
      props.toggleConsole();
    }
  });
  
  function scrollToBottom() {
    if (!props.disableScroll) {
      if (outerDiv !== null) {
        outerDiv.scrollTop = outerDiv.scrollHeight;
      }
    }
  }
    
  const height = `${String(props.height)}px`; // TODO: Use Panel.Collapse
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
              position: 'absolute',
              bottom: '0',
              maxHeight: height,
              overflowY: 'auto',
              padding: '20px',
              width: '99%',
            }}
            ref={(el) => { outerDiv = el; }}
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
              ref={(el) => { outerDiv = el; }}
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
