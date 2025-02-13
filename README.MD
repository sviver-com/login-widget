# Sviver telegram widget

Это обертка над https://core.telegram.org/widgets/login. 
Позволяет работать с виджетом программно.

## Как использовать
### Включение загрузки внешних скриптов.
На странице своего сайта добавить
```html
<script defer src="https://sviver.com/login-widget/widget.js"></script>
<script>
    window.sviverInit = t => (new t( // 't' в данном случае это класс 'TelegramLoginWidget'
            'example_bot', // username бота в telegram
            'https://example.com/app/api/widget/success', // Адрес для редиректа, при успешной аутентификации
            {accessToWriteMessages: true, buttonStyle: 'large'} // Дополнительные конфигурации кнопки аутентификации можно посмотреть в типе WidgetConfiguration
    )).appendTo('#some-id'); // Селектор или конечный HTML элемент
    
    // Так же можно установить значение в window.sviverInit асинхронно, когда понадобится. 
</script>
``` 
> **Для тестирования**
> 
> А для тестовой среды нужно использовать скрипт по адресу  
> [`https://beta.sviver.com/login-widget/widget.js`](https://beta.sviver.com/login-widget/widget.js)


### Использование исходного кода этого репозитория
Скопировать код из `src` в свой проект, удалив/изменив `src/Index.ts`.
Можно использовать только [TelegramLoginWidget](src/TelegramLoginWidget.ts)

### Использование npm пакета
TODO...

# API

## [TelegramLoginWidget](src/TelegramLoginWidget.ts)

### 🚀 Создание экземпляра
```ts
const widget = new TelegramLoginWidget("my_bot", "https://mywebsite.com/auth", {
  accessToWriteMessages: true,
  cornerRadius: 10,
  showUserPhoto: false,
  buttonStyle: "large",
});
```

### 📖 Свойства
- **`onScriptLoad`** (`EventEmitter<void>`) – вызывается после загрузки скрипта.
- **`onScriptLoadError`** (`EventEmitter<void>`) – вызывается при ошибке.

### 🎯 Методы
#### 📌 `getIframe(): Promise<HTMLIFrameElement>`
Получает `iframe`, в котором лежит кнопка аутентификации.
```ts
const iframe = await widget.getIframe();
```

#### 📌 `appendTo(elementOrSelector: HTMLElement | string): Promise<void>`
Перемещает `iframe` в указанный элемент.
```ts
await widget.appendTo("#login-container");
```

### 🔧 Конфигурация `WidgetConfiguration`
| Свойство             | Тип                   | Описание |
|----------------------|----------------------|----------|
| `accessToWriteMessages` | `boolean` | Запрос на отправку сообщений. |
| `cornerRadius`      | `number`  | Радиус скругления кнопки. |
| `showUserPhoto`     | `boolean` | Показывать фото пользователя. |
| `buttonStyle`       | `"small" \| "medium" \| "large"` | Размер кнопки. |

### ⚠️ Ошибки
| Ошибка | Причина                            |
|--------|------------------------------------|
| `[sviver] Контейнер виджета уже инициализирован` | При повторном создании экземляра TelegramLoginWidget. |
| `[sviver] Логин бота не указан` | Не передан `botName`.              |
| `[sviver] URL для редиректа не указан` | Не передан `redirectUrl`.          |
| `[sviver] Элемент не найден` | `appendTo()` не нашёл контейнер.   |