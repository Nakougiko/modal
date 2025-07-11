# @lukasgoulois/modal

A lightweight and modular modal component written in vanilla JavaScript.
Easily customizable, plug-and-play, and zero dependencies.

![Modal Preview](./modal.png)

---

## ✨ Features

* ✅ Vanilla JS, no dependencies
* ✅ Alert / Confirm modals
* ✅ Fully customizable (title, buttons, content)
* ✅ ESC to close
* ✅ Optional close button
* ✅ Default size: `small` (configurable)
* ✅ Clean CSS included

---

## 🚀 Installation

```bash
npm install @lukasgoulois/modal
```

or via CDN (soon)

---

## 🔧 Usage

### Import

```js
import Modal from '@lukasgoulois/modal';
import '@lukasgoulois/modal/modal.css';
```

### Alert

```js
Modal.alert('Hello world!', 'My Modal');
```

### Confirm

```js
Modal.confirm('Are you sure?', 'Please Confirm').then(confirmed => {
  if (confirmed) console.log('Confirmed!');
});
```

### Custom modal

```js
Modal.custom({
  title: 'Custom Example',
  content: '<p>You can add <strong>HTML</strong> here.</p>',
  options: {
    size: 'large', // small (default), medium, large
    showCloseButton: true // default is true
  },
  buttons: [
    {
      text: 'Cancel',
      classes: ['btn-secondary'],
      onClick: () => console.log('Cancelled')
    },
    {
      text: 'OK',
      classes: ['btn-primary'],
      onClick: () => console.log('Confirmed')
    }
  ]
});
```

---

## 🧪 Development & Testing

Clone the repo and open `test.html` in your browser.

```bash
git clone https://github.com/Nakougiko/modal.git
cd modal
npm install
```

Or link locally:

```bash
npm link
# in your other project
npm link @lukasgoulois/modal
```

---

## 📂 Project structure

```
modal-package/
├── modal.js         # Main module
├── modal.css        # Styles for the modal
├── test.html        # Demo page
├── LICENSE
└── package.json
```

---

## 📄 License

MIT © [Lukas Goulois](https://github.com/Nakougiko)
