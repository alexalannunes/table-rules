import { Bold, Italic, LucideProps, Underline } from "lucide-react";
import { ComponentType, createElement, CSSProperties, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export type RuleFontType = "bold" | "italic" | "underline";

export interface RuleFontValue {
  value: RuleFontType;
  styles: CSSProperties;
}

interface RuleFontProps {
  value: RuleFontValue[];
  onChange: (value: RuleFontValue[]) => void;
}

interface ButtonStylesType extends RuleFontValue {
  icon: ComponentType<LucideProps>;
}
const buttonStyles: ButtonStylesType[] = [
  {
    value: "bold",
    icon: Bold,
    styles: {
      fontWeight: "bold",
    },
  },
  {
    value: "italic",
    icon: Italic,
    styles: {
      fontStyle: "italic",
    },
  },
  {
    value: "underline",
    icon: Underline,
    styles: {
      textDecoration: "underline",
    },
  },
];

function useRuleFont({ value }: { value: RuleFontProps["value"] }) {
  const [groupValue, setGroupValue] = useState<string[]>(() => {
    return value.map((v) => v.value);
  });

  const onValueChange = (newValue: string[]) => {
    setGroupValue(newValue);
    const styles = buttonStyles.filter((btn) => {
      return newValue.includes(btn.value);
    });
    return styles;
  };

  return {
    groupValue,
    onValueChange,
  };
}

export function RuleFont({ onChange, value }: RuleFontProps) {
  const { groupValue, onValueChange } = useRuleFont({ value });

  return (
    <ToggleGroup
      size={"sm"}
      type="multiple"
      variant="outline"
      value={groupValue}
      onValueChange={(newValue) => {
        const result = onValueChange(newValue);
        onChange(result);
      }}
    >
      {buttonStyles.map((btn) => (
        <ToggleGroupItem
          key={btn.value}
          value={btn.value}
          aria-label="Toggle style"
        >
          {createElement(btn.icon, {
            className: "h-4 w-4",
          })}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
