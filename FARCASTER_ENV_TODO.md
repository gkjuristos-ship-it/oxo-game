# 🔐 Farcaster Environment Variables - Инструкция

## ✅ Уже настроено:

- **NEXT_PUBLIC_APP_URL** = `https://oxo-game.vercel.app` (добавлено для всех сред)

---

## 🎯 Что нужно сделать:

### Шаг 1: Подписать Farcaster манифест

1. Откройте: https://warpcast.com/~/developers/frames
2. Нажмите **"New Frame"** или **"Add Frame"**
3. Введите URL манифеста:
   ```
   https://oxo-game.vercel.app/.well-known/farcaster.json
   ```
4. Нажмите **"Verify & Sign"**
5. Скопируйте **ТРИ** значения, которые вам выдадут

---

### Шаг 2: Добавить переменные через CLI

После получения значений, выполните команды:

```bash
cd /Users/vaceslav/Documents/oxo-game

# Добавить FARCASTER_HEADER
echo "ВАШ_HEADER_ЗНАЧЕНИЕ" | vercel env add FARCASTER_HEADER production
echo "ВАШ_HEADER_ЗНАЧЕНИЕ" | vercel env add FARCASTER_HEADER preview
echo "ВАШ_HEADER_ЗНАЧЕНИЕ" | vercel env add FARCASTER_HEADER development

# Добавить FARCASTER_PAYLOAD
echo "ВАШ_PAYLOAD_ЗНАЧЕНИЕ" | vercel env add FARCASTER_PAYLOAD production
echo "ВАШ_PAYLOAD_ЗНАЧЕНИЕ" | vercel env add FARCASTER_PAYLOAD preview
echo "ВАШ_PAYLOAD_ЗНАЧЕНИЕ" | vercel env add FARCASTER_PAYLOAD development

# Добавить FARCASTER_SIGNATURE
echo "ВАШ_SIGNATURE_ЗНАЧЕНИЕ" | vercel env add FARCASTER_SIGNATURE production
echo "ВАШ_SIGNATURE_ЗНАЧЕНИЕ" | vercel env add FARCASTER_SIGNATURE preview
echo "ВАШ_SIGNATURE_ЗНАЧЕНИЕ" | vercel env add FARCASTER_SIGNATURE development
```

**Замените** `ВАШ_*_ЗНАЧЕНИЕ` на реальные значения, полученные на Шаге 1.

---

### Шаг 3: Редеплой

После добавления всех переменных:

```bash
cd /Users/vaceslav/Documents/oxo-game
vercel --prod
```

---

## 📋 Альтернатива: Через Vercel Dashboard

Если предпочитаете веб-интерфейс:

1. Откройте: https://vercel.com/dashboard
2. Проект: **oxo-game**
3. **Settings** → **Environment Variables**
4. Нажмите **"Add New"** для каждой переменной:
   - `FARCASTER_HEADER`
   - `FARCASTER_PAYLOAD`
   - `FARCASTER_SIGNATURE`
5. Для каждой выберите все три среды: ✅ Production ✅ Preview ✅ Development

---

## ✅ Проверка

После редеплоя проверьте манифест:
```
https://oxo-game.vercel.app/.well-known/farcaster.json
```

Должен вернуть JSON с `accountAssociation` данными.

---

## 🎯 Текущий статус:

- ✅ **NEXT_PUBLIC_APP_URL** - настроено
- ⏳ **FARCASTER_HEADER** - ожидает подписания
- ⏳ **FARCASTER_PAYLOAD** - ожидает подписания
- ⏳ **FARCASTER_SIGNATURE** - ожидает подписания

**Production URL:** https://oxo-game.vercel.app
