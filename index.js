const keyboard = document.querySelector("#keyboard");
const input = document.querySelector("#input");
const keys = [];
let isShiftRight = false;
let isShiftLeft = false;
let isCapsLock = false;
let lang = "ru";

class Key {

  constructor(title, code, isDark, width) {
    this.width = width;
    this.isDark = isDark;
    this.code = code;

    this.title = document.createElement("span");
    this.title.classList.add("btn__inner");
    this.title.innerText = title;

    this.createBtn();
    this.setMouseEvents();
    this.setKeyboardEvents();
  }

  createBtn() {
    this.btn = document.createElement("div");
    this.btn.classList.add("keyboard__btn");
    if (this.isDark) { 
      this.btn.classList.add("dark");
    }
    if (this.width) {
      this.btn.classList.add(this.width);
    }
    this.btn.setAttribute("id", this.code);
    this.btn.append(this.title);
    keyboard.append(this.btn);
  }

  setMouseEvents() {
    const self = this;

    function onMouseUp() {
      self.onUp();
      self.btn.removeEventListener("mouseup", onMouseUp);
      self.btn.removeEventListener("mouseout", onMouseUp);
    }

    this.btn.addEventListener("mousedown", () => {
      this.btn.classList.add("active");
      this.press();
      this.btn.addEventListener("mouseup", onMouseUp);
      this.btn.addEventListener("mouseout", onMouseUp);
    });
  }

  onUp() {
    this.btn.classList.remove("active");
  }

  setKeyboardEvents(){
    window.addEventListener('keydown', (event) => {
      if (event.code === this.code) {
        this.btn.classList.add("active");
        this.press();

        window.addEventListener('keyup', (event) => {
          if (event.code === this.code) {
            this.onUp();
          }
        }, true);
      }      
    });
  }

  press() {
    throw new Error("press() not defined");
  }
}

class ShiftKey extends Key {
  constructor(isLeft) {
    if(isLeft) {
      super("Shift", "ShiftLeft", true, "large"); 
    } else {
      super("Shift", "ShiftRight", true);
    }  
  }

  press() {
    this.code === "ShiftLeft" ? isShiftLeft = true : isShiftRight = true;
    for (let key of keys) {
      if (key.shift) {
        key.shift();
      }
    }
  }

  onUp() {
    this.code === "ShiftLeft" ? isShiftLeft = false : isShiftRight = false;
    this.btn.classList.remove("active");

    if (!isShiftLeft && !isShiftRight) {
      for (let key of keys) {
        if (key.unshift) {
          key.unshift();
        }
      }
    }
  }
}

class CapsLock extends Key {
  constructor() {
    super("Caps Lock", "CapsLock", true, "large"); 
  }

  press() {
    if (isCapsLock) {
      this.btn.classList.remove("active");
      isCapsLock = false;
    } else {
      this.btn.classList.add("active");
      isCapsLock = true;
    }
    //меняем буквы
    for (let key of keys) {
      if (key.caps) {
        key.caps();
      }
    }
  }

  setMouseEvents() {
    this.btn.addEventListener("mousedown", () => {
      this.press();
    });
  } 

  setKeyboardEvents() {
    window.addEventListener('keydown', (event) => {
      if (event.code === this.code && !event.repeat) {
        this.press(); 
      }
    });
  }
}

class WritingKey extends Key {
  constructor(values, code, isDark, width) {
    let value = values[lang].regular;
    super(value, code, isDark, width);
    this.values = values;
    this.value = value;
  }

  press() {
    input.value += this.value;
  }

  shift() {
    if (this.values[lang].capsable) {
      this.value = this.values[lang][isCapsLock ? "regular" : "shifted"];
    } else {
      this.value = this.values[lang].shifted;
    }
    this.title.innerText = this.value;
  }

  unshift() {
    if (this.values[lang].capsable) {
      this.value = this.values[lang][isCapsLock ? "shifted" : "regular"];
    } else {
      this.value = this.values[lang].regular;
    }
    this.title.innerText = this.value;
  }

  caps() {
    if (this.values[lang].capsable) {
      if (!isShiftLeft && !isShiftRight) {
        this.unshift();
      } else {
        this.shift();
      }
    }
  }
}

keys.push(
  new WritingKey( {
    en: {
      regular: "`",
      shifted: "~",
      capsable: false,
    },
    ru: {
      regular: "ё",
      shifted: "Ё",
      capsable: true,
    },
  }, "Backquote", false ),

  new ShiftKey(true),
  new ShiftKey(false),
  new CapsLock(),
);
