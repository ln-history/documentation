import type React from 'react';
import '../styles/global.css';

import CommandLine from './CommandLine';

interface TerminalOnelinerProps {
  user?: string;
  host?: string;
  path?: string;
  command: string;
  inTerminal?: boolean;
}

const TerminalOneliner: React.FC<TerminalOnelinerProps> = ({
  user = 'ln-history',
  host = 'host',
  path = '~',
  command,
  inTerminal = false,
}) => {
  return (
    <CommandLine
      user={user}
      host={host}
      path={path}
      command={command}
      showCursor={false}
      inTerminal={inTerminal}
    />
  );
};

export { TerminalOneliner as default };
