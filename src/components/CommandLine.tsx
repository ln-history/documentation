import CopyButton from './CopyButton';

interface CommandLineProps {
  user: string;
  host: string;
  path: string;
  command: string;
  showCursor?: boolean;
  inTerminal?: boolean;
}

const CommandLine: React.FC<CommandLineProps> = ({
  user,
  host,
  path,
  command,
  showCursor = false,
  inTerminal = false,
}) => {
  return (
    <div
      className={`command-line ${inTerminal ? 'command-line--in-terminal' : ''}`}
    >
      <span className="command-path">
        <span className="command-user">
          {user}@{host}
        </span>
        <span className="command-location">:{path}</span>
        <span className="command-symbol">₿ </span>
      </span>
      <span className="command-text">{command}</span>
      {showCursor && <span className="terminal-cursor" />}
      <CopyButton text={command} />
    </div>
  );
};

export { CommandLine as default };
