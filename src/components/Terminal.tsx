import '../styles/global.css';

import CommandLine from './CommandLine';

interface TerminalProps {
  user?: string;
  host?: string;
  path?: string;
  command: string;
  children: React.ReactNode;
}

const Terminal: React.FC<TerminalProps> = ({
  user = 'ln-history',
  host = 'host',
  path = '~/ln-history',
  command,
  children,
}) => {
  return (
    <div className="terminal">
      {/* Terminal Header */}
      {/* <div className="terminal-header">
        <div className="terminal-controls">
          <div className="terminal-dot terminal-dot--red"></div>
          <div className="terminal-dot terminal-dot--yellow"></div>
          <div className="terminal-dot terminal-dot--green"></div>
        </div>
        <div className="terminal-title">
          <span className="terminal-title-text">Terminal</span>
        </div>
      </div> */}

      {/* Terminal Content */}
      <div className="terminal-content">
        <CommandLine
          user={user}
          host={host}
          path={path}
          command={command}
          showCursor={false}
          inTerminal={true}
        />

        {/* Command Output */}
        <div className="terminal-output">{children}</div>
      </div>
    </div>
  );
};

export default Terminal;
