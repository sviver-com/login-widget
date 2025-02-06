import { TelegramLoginWidget } from './TelegramLoginWidget.ts';

if (window.sviverInit) {
  window.sviverInit(TelegramLoginWidget);
  window.___sviverInit = window.sviverInit;
}

Object.defineProperty(window, 'sviverInit', {
  set(fun: FuncWithTgConstructor) {
    fun(TelegramLoginWidget);
    this.___sviverInit = fun;
  },
  get(): FuncWithTgConstructor {
    return this.___sviverInit;
  },
  enumerable: true,
  configurable: true,
});