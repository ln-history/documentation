import { Badge } from "@rspress/theme-default";

interface TitleProps {
  text: string;
  badgeText: string;
  badgeType: "info" | "warning" | "tip" | "danger";
}

export const Title: React.FC<TitleProps> = ({ text, badgeText, badgeType }) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: "2em", fontWeight: "bold", margin: 0 }}>
        {text}
      </span>
      <div>
        <Badge text={badgeText} type={badgeType} />
      </div>
    </div>
  );
};

export default Title;