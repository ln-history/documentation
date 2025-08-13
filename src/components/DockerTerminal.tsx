import type React from 'react';

interface DockerTerminalProps {
  pathInfo: string;
  command: string;
  children: React.ReactNode;
}

const DockerTerminal: React.FC<DockerTerminalProps> = ({
  pathInfo,
  command,
  children,
}) => {
  return (
    <div className="docker-terminal">
      <div style={{ marginBottom: '8px' }}>
        <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{pathInfo}</span>
        <span style={{ color: '#93c5fd' }}> ₿ </span>
        <span>{command}</span>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default DockerTerminal;
