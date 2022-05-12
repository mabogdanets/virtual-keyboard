const keyboard = document.querySelector("#keyboard");
const input = document.querySelector("#textarea");
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
      input.focus();
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
        event.preventDefault();
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

class BackSpace extends Key {
  constructor() {
    super("Back Space", "Backspace", true, "large");
  }
  press() {
    input.value = input.value.slice(0, -1);
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
   // console.log(input.value, this.value, lang);
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

class Space extends WritingKey {
  constructor() {
    super( {
      en: {
        regular: " ",
        shifted: " ",
        capsable: false,
      },
      ru: {
        regular: " ",
        shifted: " ",
        capsable: false,
      },
    },
     "Space", false, "space");
  }
  press() {
    input.value += this.value;
  }
  shift() {};
  unshift() {};
  caps() {};
}

class Tab extends WritingKey {
  constructor() {
    super( {
      en: {
        regular: "Tab",
        capsable: false,
      },
      ru: {
        regular: "Tab",
        capsable: false,
      },
    },
     "Tab", false, "medium");
  }
  press() {
    input.value += "  ";
  }

  setKeyboardEvents() {
    window.addEventListener('keydown', (event) => {
      if (event.code === this.code) {
        event.preventDefault()
        this.press(); 
      }
    });    
  }

  shift() {};
  unshift() {};
  caps() {};
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

  new WritingKey( {
    en: {
      regular: "1",
      shifted: "!",
      capsable: false,
    },
    ru: {
      regular: "1",
      shifted: "!",
      capsable: false,
    },
  }, "Digit1", false),

  new WritingKey( {
    en: {
      regular: "2",
      shifted: "@",
      capsable: false,
    },
    ru: {
      regular: "2",
      shifted: '"',
      capsable: false,
    },
  }, "Digit2", false),
  
  new WritingKey( {
    en: {
      regular: "3",
      shifted: "№",
      capsable: false,
    },
    ru: {
      regular: "3",
      shifted: "#",
      capsable: false,
    },
  }, "Digit3", false),

  new WritingKey( {
    en: {
      regular: "4",
      shifted: ";",
      capsable: false,
    },
    ru: {
      regular: "4",
      shifted: "$",
      capsable: false,
    },
  }, "Digit4", false),

  new WritingKey( {
    en: {
      regular: "5",
      shifted: "%",
      capsable: false,
    },
    ru: {
      regular: "5",
      shifted: "%",
      capsable: false,
    },    
  }, "Digit5", false),

  new WritingKey( {
    en: {
      regular: "6",
      shifted: ":",
      capsable: false,
    },
    ru: {
      regular: "6",
      shifted: "^",
      capsable: false,
    },
  }, "Digit6", false),

  new WritingKey( {
    en: {
      regular: "7",
      shifted: "?",
      capsable: false,
    },
    ru: {
      regular: "7",
      shifted: "&",
      capsable: false,
    },
  }, "Digit7", false),

  new WritingKey( {
    en: {
      regular: "8",
      shifted: "*",
      capsable: false,
    },
    ru: {
      regular: "8",
      shifted: "*",
      capsable: false,
    },
  }, "Digit8", false),

  new WritingKey( {
    en: {
      regular: "9",
      shifted: "(",
      capsable: false,
    },
    ru: {
      regular: "9",
      shifted: "(",
      capsable: false,
    },
  }, "Digit9", false),

  new WritingKey( {
    en: {
      regular: "0",
      shifted: ")",
      capsable: false,
    },
    ru: {
      regular: "0",
      shifted: ")",
      capsable: false,
    },
  }, "Digit0", false),

  new WritingKey( {
    en: {
      regular: "-",
      shifted: "_",
      capsable: false,
    },
    ru: {
      regular: "-",
      shifted: "_",
      capsable: false,
    },
  }, "Minus", false),

  new WritingKey( {
    en: {
      regular: "=",
      shifted: "+",
      capsable: false,
    },
    ru: {
      regular: "=",
      shifted: "+",
      capsable: false,
    },
  }, "Equal", false),

  new BackSpace(),
//буквы, ряд 2

  new Tab(),

  new WritingKey( {
    en: {
      regular: "q",
      shifted: "Q",
      capsable: true,
    },
    ru: {
      regular: "й",
      shifted: "Й",
      capsable: true,
    },
  }, "KeyQ", false ),

  new WritingKey( {
    en: {
      regular: "w",
      shifted: "W",
      capsable: true,
    },
    ru: {
      regular: "ц",
      shifted: "Ц",
      capsable: true,
    },
  }, "KeyW", false),
  new WritingKey( {
    en: {
      regular: "e",
      shifted: "E",
      capsable: true,
    },
    ru: {
      regular: "у",
      shifted: "У",
      capsable: true,
    },
  }, "KeyE", false),
  new WritingKey( {
    en: {
      regular: "r",
      shifted: "R",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyR", false),
  new WritingKey( {
    en: {
      regular: "t",
      shifted: "T",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyT", false),
  new WritingKey( {
    en: {
      regular: "y",
      shifted: "Y",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyY", false),
  new WritingKey( {
    en: {
      regular: "u",
      shifted: "U",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyU", false),
  new WritingKey( {
    en: {
      regular: "i",
      shifted: "I",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyI", false),
  new WritingKey( {
    en: {
      regular: "o",
      shifted: "O",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyO", false),
  new WritingKey( {
    en: {
      regular: "p",
      shifted: "P",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyP", false),
  new WritingKey( {
    en: {
      regular: "[",
      shifted: "{",
      capsable: false,
    },
    ru: {
      regular: "]",
      shifted: "}",
      capsable: false,
    },
  }, "BracketLeft", false),

  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "BracketRight", false),
  
  new WritingKey( {
    en: {
      regular: "\\",
      shifted: "|",
      capsable: false,
    },
    ru: {
      regular: "\\",
      shifted: "/",
      capsable: false,
    },
  }, "Backslash", false),

  // ряд три
  new CapsLock(),

  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyA", false),
  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyS", false),
  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyD", false),
  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyF", false),
  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyG", false),
  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyH", false),
  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyJ", false),
  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyK", false),
  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyL", false),
  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "Semicolon", false),
  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "Quote", false),

  //enter

  new ShiftKey(true),
  
  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyZ", false),

  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyC", false),

  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyV", false),

  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyB", false),

  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyN", false),

  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "KeyM", false),

  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "Comma", false),

  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "Period", false),

  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: true,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: true,
    },
  }, "Slash", false),

  //arrow top 

  new ShiftKey(true),

  //ctrl
  //win(ничего не делает)
  //alt
  
  new Space(),

  //alt
  //arrow left
  //arrow down
  //arrow right
  //ctrl
  
/*
  new WritingKey( {
    en: {
      regular: "",
      shifted: "",
      capsable: false,
    },
    ru: {
      regular: "",
      shifted: "",
      capsable: false,
    },
  }, "", false),

*/

);
