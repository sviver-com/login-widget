import { TelegramLoginWidget } from './TelegramLoginWidget.ts';

export declare global {
  type LOGIN_BUTTON_SIZE = 'medium' | 'large' | 'small';

  /** Configuration for a login button */
  type WidgetConfiguration = {
    // Login button size. Default: large
    buttonStyle?: LOGIN_BUTTON_SIZE;
    // Show user photo near the button. Default: true
    showUserPhoto?: boolean;
    // Radius of buttons corners(0-20). Default: 20
    cornerRadius?: number;
    // Request for write access. Default: false
    accessToWriteMessages?: boolean
  }

  type FuncWithTgConstructor = (tgConstructor: new (...args: any[]) => TelegramLoginWidget) => void

  interface Window {
    sviverInit?: FuncWithTgConstructor;
    ___sviverInit?: FuncWithTgConstructor;
  }
}