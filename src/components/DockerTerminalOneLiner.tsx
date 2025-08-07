import type React from 'react';
import '../styles/global.css';
import CopyButton from '../components/CopyButton';

interface DockerTerminalOneLinerProps {
  pathInfo: string;
  command: string;
  inTerminal?: boolean;
}

const DockerTerminalOneLiner: React.FC<DockerTerminalOneLinerProps> = ({
  pathInfo,
  command,
  inTerminal = false,
}) => {
  return (
    <div className="docker-terminal">
      <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{pathInfo}</span>
      <span style={{ color: '#add8e6' }}>{command}</span>
      <CopyButton text={command} />
    </div>
  );
};

export default DockerTerminalOneLiner;
