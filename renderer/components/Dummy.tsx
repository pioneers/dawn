import { Observer } from 'mobx-react';
import React from 'react';
import { useStores } from '../hooks';

// Use as an example of how to use the useStores hook - will delete later
export const Dummy = () => {
  const { console } = useStores();

  return <Observer>{() => <div>{console.consoleUnread}</div>}</Observer>
}