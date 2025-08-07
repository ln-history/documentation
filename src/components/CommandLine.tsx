
import React from 'react';
import '/src/styles/terminal.css';

import CopyButton from './CopyButton';

interface CommandLineProps {
  command: string;
  showCursor?: boolean;
  inTerminal?: boolean;
}

const CommandLine: React.FC<CommandLineProps> = ({ command, showCursor = false, inTerminal = false }) => {
  return (
    <div className={`command-line ${inTerminal ? 'command-line--in-terminal' : ''}`}>
      <span className="command-prompt">$</span>
      <span className="command-text">{command}</span>
      {showCursor && <span className="terminal-cursor"></span>}
      <CopyButton text={command} />
    </div>
  );
};

export {CommandLine as default}