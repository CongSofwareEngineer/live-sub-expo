import { Switch, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';

type ToggleRowProps = {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

export function ToggleRow({ label, hint, value, onChange, disabled }: ToggleRowProps) {
  const theme = useTheme();
  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-1 gap-0.5">
        <AppText>{label}</AppText>
        {hint ? <AppText variant="caption">{hint}</AppText> : null}
      </View>
      <Switch
        accessibilityLabel={label}
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ true: theme.primary }}
      />
    </View>
  );
}
