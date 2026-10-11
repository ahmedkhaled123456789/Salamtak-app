import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Button } from './Button';

jest.mock('@/i18n', () => ({ useI18n: () => ({ locale: 'en', isRTL: false, dir: 'ltr', t: (k: string) => k }) }));
jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));

describe('Button', () => {
  it('fires onPress and exposes an accessible label', async () => {
    const onPress = jest.fn();
    await render(<Button onPress={onPress}>Book Care</Button>);
    await fireEvent.press(screen.getByRole('button', { name: 'Book Care' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire while loading or disabled', async () => {
    const onPress = jest.fn();
    await render(
      <Button onPress={onPress} loading>
        Pay
      </Button>,
    );
    await fireEvent.press(screen.getByRole('button'));
    await screen.rerender(
      <Button onPress={onPress} disabled>
        Pay
      </Button>,
    );
    await fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
