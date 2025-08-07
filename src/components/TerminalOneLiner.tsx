
import React from 'react';
import '../styles/terminal.css';

import CommandLine from './CommandLine';

interface TerminalOnelinerProps {
  command: string;
  inTerminal: boolean;
}

const TerminalOneliner: React.FC<TerminalOnelinerProps> = ({ command, inTerminal }) => {
  return <CommandLine command={command} showCursor={false} inTerminal={inTerminal} />;
};

export { TerminalOneliner as default};