import React, { useState } from 'react';
import { View } from 'react-native';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';
import { Text } from './Text';
import { TextField } from './TextField';

interface ConfirmSheetProps {
  visible: boolean;
  title: string;
  body?: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
  loading?: boolean;
  /** Optional free-text field (e.g. rejection reason). */
  inputLabel?: string;
  error?: string;
  onConfirm: (input: string) => void;
  onCancel: () => void;
}

/** Cross-platform confirmation (React Native's Alert is a no-op on web, and sheets match the app's look). */
export function ConfirmSheet({ visible, title, body, confirmLabel, cancelLabel, destructive, loading, inputLabel, error, onConfirm, onCancel }: ConfirmSheetProps) {
  const [input, setInput] = useState('');
  return (
    <BottomSheet visible={visible} title={title} onClose={onCancel}>
      <View style={{ gap: 16, paddingBottom: 8 }}>
        {body ? (
          <Text variant="body" color="muted">
            {body}
          </Text>
        ) : null}
        {inputLabel ? <TextField label={inputLabel} value={input} onChangeText={setInput} multiline /> : null}
        {error ? (
          <Text variant="small" weight="medium" color="#9A3B22" accessibilityRole="alert">
            {error}
          </Text>
        ) : null}
        <Button fullWidth size="lg" variant={destructive ? 'danger' : 'primary'} loading={loading} onPress={() => onConfirm(input.trim())}>
          {confirmLabel}
        </Button>
        <Button fullWidth variant="secondary" onPress={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
      </View>
    </BottomSheet>
  );
}
