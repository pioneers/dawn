import React, { useEffect, useRef } from 'react';
import { Panel } from 'react-bootstrap';

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
  let outerDiv: HTMLDivElement | null;
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
      <Panel
        style={{
          display: show ? 'block' : 'none',
          marginBottom: '0',
          borderRadius: '0',
        }}
      >
        <Panel.Body>
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
              ref={(el) => { outerDiv = el; }}
            >
              {output.map((line: string) => (
                <code key={`${line}-Code-${Math.random()}`}>{line}</code>
              ))}
            </div>
          </pre>
        </Panel.Body>
      </Panel>
    </div>
  );
}
