import '../styles/global.css';

import CommandLine from './CommandLine';

interface TerminalOnelinerProps {
  user?: string;
  host?: string;
  path?: string;
  showCursor?: boolean;
  command: string;
  inTerminal?: boolean;
}

const TerminalOneliner: React.FC<TerminalOnelinerProps> = ({
  user = 'ln-history',
  host = 'host',
  path = '~',
  showCursor = false,
  command,
  inTerminal = false,
}) => {
  return (
    <CommandLine
      user={user}
      host={host}
      path={path}
      command={command}
      showCursor={showCursor}
      inTerminal={inTerminal}
    />
  );
};

export { TerminalOneliner as default };
