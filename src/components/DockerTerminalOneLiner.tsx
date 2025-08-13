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
   <div className="docker-terminal-one-liner">
      <div>
        <span style={{color: "#edee7e"}}>{pathInfo} </span>
        <span>{command}</span>
      </div>
      <CopyButton text={command} />
    </div>
  );
};

export default DockerTerminalOneLiner;
