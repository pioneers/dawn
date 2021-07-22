import React, { useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
import { useStores } from '../hooks';

interface OwnProps {
  toggleConsole: () => void;
  height: number;
  output: string[];
  show: boolean;
}

type Props = OwnProps;

export function ConsoleOutput(props: Props) {
  let outerDiv: HTMLDivElement | HTMLPreElement | null;
  const { show, output } = props;

  const {console} = useStores();

  const prevOutputRef = useRef([] as string[]);
  const prevOutput = prevOutputRef.current;
  useEffect(() => {
    prevOutputRef.current = output;
    scrollToBottom();
    if (prevOutput.length === 0 && output.length > 0 && !show) {
      props.toggleConsole();
    }
  });

  const scrollToBottom = () => {
    if (!console.disableScroll) {
      if (outerDiv !== null) {
        outerDiv.scrollTop = outerDiv.scrollHeight;
      }
    }
  };

  const height = `${String(props.height)}px`;
  return (
    <div>
      <Card
        style={{
          display: show ? 'block' : 'none',
          marginBottom: '0',
          borderRadius: '0'
        }}
      >
        <Card.Body>
          <pre
            style={{
              position: 'relative',
              margin: '0',
              height
            }}
            ref={(el) => {
              outerDiv = el;
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
                outerDiv = el;
              }}
            >
              {output.map((line) => (
                <code key={`${line}-Code-${Math.random()}`}>{line}</code>
              ))}
            </div>
          </pre>
        </Card.Body>
      </Card>
    </div>
  );
}
