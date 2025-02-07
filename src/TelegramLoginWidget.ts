import { EventEmitter } from './EventEmitter';

const TELEGRAM_WIDGET_VERSION = 22;
const randomSeed = parseInt(`${Math.random() * 1e7}`);

const HIDDEN_DIV_ID = `sviver_widget_container_${randomSeed}`;

const FNAME_onTelegramWidgetLoad = `onTelegramWidgetLoad_${randomSeed}`;
const FNAME_onTelegramWidgetLoadFail = `onTelegramWidgetLoadFail_${randomSeed}`;

export class TelegramLoginWidget {
  public readonly onScriptLoad = new EventEmitter<void>();
  public readonly onScriptLoadError = new EventEmitter<void>();

  private defaultConfigs = {
    src: `https://telegram.org/js/telegram-widget.js?${TELEGRAM_WIDGET_VERSION}`,
    onerror: `${FNAME_onTelegramWidgetLoadFail}()`,
    onload: `${FNAME_onTelegramWidgetLoad}()`,
    defer: 'defer',
  };
  private readonly script: HTMLScriptElement;
  private readonly divContainer: HTMLDivElement;
  private iframeElement: HTMLIFrameElement | undefined;

  constructor(
    private readonly botName: string,
    private readonly redirectUrl: string,
    private readonly config: WidgetConfiguration = {},
  ) {
    const container = document.querySelector(`div#${HIDDEN_DIV_ID}`);
    if (container) {
      throw new Error(`[sviver] Контейнер виджета уже инициализирован: #${HIDDEN_DIV_ID}`);
    }

    const scriptAttrs = this.compileConfigs();
    this.script = document.createElement('script');

    for (let key in scriptAttrs) {
      if (scriptAttrs.hasOwnProperty(key)) {
        this.script.setAttribute(key, scriptAttrs[key]);
      }
    }

    // @ts-ignore
    window[FNAME_onTelegramWidgetLoad] = () => this.onScriptLoad.emit();
    // @ts-ignore
    window[FNAME_onTelegramWidgetLoadFail] = () => this.onScriptLoadError.emit();

    this.divContainer = document.createElement('div');
    this.divContainer.id = HIDDEN_DIV_ID;
    this.divContainer.style.display = 'none';
    this.divContainer.appendChild(this.script);

    document.body.appendChild(this.divContainer);
  }

  async getIframe(): Promise<HTMLIFrameElement> {
    if (this.iframeElement) {
      return this.iframeElement;
    }

    this.iframeElement = await this.waitForElement<HTMLIFrameElement>(`iframe`, 3000, this.divContainer);

    return this.iframeElement;
  }

  async appendTo(elementOrSelector: HTMLElement | string): Promise<void> {
    let targetElement: Element | undefined | null;
    if (typeof elementOrSelector === 'string') {
      targetElement = document.querySelector(elementOrSelector);
    } else {
      targetElement = elementOrSelector;
    }

    if (!targetElement) {
      throw new Error(`[sviver] Элемент не найден: ${elementOrSelector}`);
    }

    targetElement.appendChild(await this.getIframe());
  }

  private async waitForElement<T extends Element>(selector: string, timeout = 3000, root: HTMLElement = document.body): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const element = root.querySelector(selector);
      if (element) {
        resolve(element as T);
        return;
      }

      let timeoutId: number | undefined;
      const observer = new MutationObserver((_, obs) => {
        const element = root.querySelector(selector);
        if (element) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          obs.disconnect();
          resolve(element as T);
        }
      });

      observer.observe(root, {childList: true, subtree: true});

      // Опционально: таймаут для остановки ожидания
      timeoutId = setTimeout(() => {
        observer.disconnect();
        reject(`Элемент не появился: ${selector}`);
      }, timeout);
    });
  }

  private compileConfigs(): Record<string, string> {
    const configs: Record<string, string> = this.defaultConfigs ?? {};

    if (!this.botName) {
      throw new Error('[sviver] Логин бота не указан');
    }

    if (!this.redirectUrl) {
      throw new Error('[sviver] URL для редиректа не указан');
    }

    configs['data-telegram-login'] = this.botName;
    configs['data-auth-url'] = this.rebuildRedirectUrl(this.redirectUrl, this.botName);

    if (this.config?.accessToWriteMessages) {
      configs['data-request-access'] = 'write';
    }

    if (this.config?.cornerRadius) {
      configs['data-radius'] = `${this.config.cornerRadius}`;
    }

    if (this.config?.showUserPhoto === false) {
      configs['data-userpic'] = 'false';
    }

    if (this.config?.buttonStyle) {
      configs['data-size'] = this.config.buttonStyle;
    } else {
      configs['data-size'] = 'large';
    }

    return configs;
  }

  private rebuildRedirectUrl(redirectUrl: string, botName: string): string {
    const url = new URL(redirectUrl);
    url.searchParams.set('bot_username', botName);

    console.log(url.toString());
    return url.toString();
  }
}