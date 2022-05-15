const keyboard = document.querySelector("#keyboard");
const input = document.querySelector("#textarea");
const keys = [];
let isShiftRight = false;
let isShiftLeft = false;
let isCapsLock = false;
let isCtrl = false;
let isAlt = false;
let lang = "ru";

window.onunload = function() {
  // onUp();  
   console.log("sxdfv");
 }

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
      super("Shift", "ShiftLeft", true, "shift_left"); 
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

class Ctrl extends Key {
  constructor(isLeft) {
    if(isLeft) {
      super("Ctrl", "ControlLeft", true, "medium_ctrl"); 
    } else {
      super("Ctrl", "ControlRight", true, "medium_ctrl");
    }  
  }
  press() {
    isCtrl = true;
    switchLang();
  }

  onUp() {
    this.btn.classList.remove("active");
    isCtrl = false;   
  }
}

class Alt extends Key {
  constructor(isLeft) {
    if(isLeft) {
      super("Alt", "AltLeft", true); 
    } else {
      super("Alt", "AltRight", true);
    }  
  }
  press() {
    isAlt = true;
    switchLang();

  }

  onUp() {
    this.btn.classList.remove("active");
    isAlt = false;
  }
}

function switchLang() {
  if (isAlt && isCtrl) {
    lang = (lang === "en") ? "ru" : "en";
    for (let key of keys) {
      if (key.shift) {
        key.unshift();
      }
    }
    console.log(lang);
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
   input.setRangeText("", input.selectionStart-1, input.selectionEnd, "end");
  }

}
class Del extends Key {
  constructor() {
    super("Del", "Delete", true, "del");
  }
  press() {
    input.setRangeText("", input.selectionStart, input.selectionStart+1, "end");

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
   // input.value += this.value;      
    input.setRangeText(this.value, input.selectionStart, input.selectionEnd, "end");
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
    input.setRangeText(this.value, input.selectionStart, input.selectionEnd, "end");
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
     "Tab", true, "medium_tab");
  }
  press() {
    input.setRangeText("  ", input.selectionStart, input.selectionEnd, "end");
  }

  setKeyboardEvents() {
    window.addEventListener('keydown', (event) => {
      if (event.code === this.code) {
        event.preventDefault();
        this.press(); 
      }
    });    
  }

  shift() {};
  unshift() {};
  caps() {};
}

class Enter extends WritingKey {
  constructor() {
    super( {
      en: {
        regular: "Enter",
        shifted: "Enter",
        capsable: false,
      },
      ru: {
        regular: "Enter",
        shifted: "Enter",
        capsable: false,
      },
    },
     "Enter", true, "enter");
  }
  press() {
    input.setRangeText("\n", input.selectionStart, input.selectionEnd, "end");
  }
  shift() {};
  unshift() {};
  caps() {};
}

class Win extends Key {
  constructor() {
    super("Win", "MetaLeft", true);
  }
  press() {

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
  }, "Backquote", true ),

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
      regular: "к",
      shifted: "К",
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
      regular: "е",
      shifted: "Е",
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
      regular: "н",
      shifted: "Н",
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
      regular: "г",
      shifted: "Г",
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
      regular: "ш",
      shifted: "Ш",
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
      regular: "щ",
      shifted: "Щ",
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
      regular: "з",
      shifted: "З",
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
      regular: "х",
      shifted: "Х",
      capsable: true,
    },
  }, "BracketLeft", false),

  new WritingKey( {
    en: {
      regular: "]",
      shifted: "}",
      capsable: false,
    },
    ru: {
      regular: "ъ",
      shifted: "Ъ",
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

  /// DEL
  new Del(),
  // ряд три
  new CapsLock(),

  new WritingKey( {
    en: {
      regular: "a",
      shifted: "A",
      capsable: true,
    },
    ru: {
      regular: "ф",
      shifted: "Ф",
      capsable: true,
    },
  }, "KeyA", false),
  new WritingKey( {
    en: {
      regular: "s",
      shifted: "S",
      capsable: true,
    },
    ru: {
      regular: "ы",
      shifted: "Ы",
      capsable: true,
    },
  }, "KeyS", false),
  new WritingKey( {
    en: {
      regular: "d",
      shifted: "D",
      capsable: true,
    },
    ru: {
      regular: "в",
      shifted: "В",
      capsable: true,
    },
  }, "KeyD", false),
  new WritingKey( {
    en: {
      regular: "f",
      shifted: "F",
      capsable: true,
    },
    ru: {
      regular: "а",
      shifted: "А",
      capsable: true,
    },
  }, "KeyF", false),
  new WritingKey( {
    en: {
      regular: "g",
      shifted: "G",
      capsable: true,
    },
    ru: {
      regular: "п",
      shifted: "П",
      capsable: true,
    },
  }, "KeyG", false),
  new WritingKey( {
    en: {
      regular: "h",
      shifted: "H",
      capsable: true,
    },
    ru: {
      regular: "р",
      shifted: "Р",
      capsable: true,
    },
  }, "KeyH", false),
  new WritingKey( {
    en: {
      regular: "j",
      shifted: "J",
      capsable: true,
    },
    ru: {
      regular: "о",
      shifted: "О",
      capsable: true,
    },
  }, "KeyJ", false),
  new WritingKey( {
    en: {
      regular: "k",
      shifted: "K",
      capsable: true,
    },
    ru: {
      regular: "л",
      shifted: "Л",
      capsable: true,
    },
  }, "KeyK", false),
  new WritingKey( {
    en: {
      regular: "l",
      shifted: "L",
      capsable: true,
    },
    ru: {
      regular: "д",
      shifted: "Д",
      capsable: true,
    },
  }, "KeyL", false),

  new WritingKey( {
    en: {
      regular: ";",
      shifted: ":",
      capsable: false,
    },
    ru: {
      regular: "ж",
      shifted: "Ж",
      capsable: true,
    },
  }, "Semicolon", false),

  new WritingKey( {
    en: {
      regular: "'",
      shifted: "\"",
      capsable: false,
    },
    ru: {
      regular: "э",
      shifted: "Э",
      capsable: true,
    },
  }, "Quote", false),

  new Enter(),

  new ShiftKey(true),

  new WritingKey( {
    en: {
      regular: "z",
      shifted: "Z",
      capsable: true,
    },
    ru: {
      regular: "я",
      shifted: "Я",
      capsable: true,
    },
  }, "KeyZ", false),

  new WritingKey( {
    en: {
      regular: "x",
      shifted: "X",
      capsable: true,
    },
    ru: {
      regular: "ч",
      shifted: "Ч",
      capsable: true,
    },
  }, "KeyX", false),

  new WritingKey( {
    en: {
      regular: "c",
      shifted: "C",
      capsable: true,
    },
    ru: {
      regular: "с",
      shifted: "С",
      capsable: true,
    },
  }, "KeyC", false),

  new WritingKey( {
    en: {
      regular: "v",
      shifted: "V",
      capsable: true,
    },
    ru: {
      regular: "м",
      shifted: "М",
      capsable: true,
    },
  }, "KeyV", false),

  new WritingKey( {
    en: {
      regular: "b",
      shifted: "B",
      capsable: true,
    },
    ru: {
      regular: "и",
      shifted: "И",
      capsable: true,
    },
  }, "KeyB", false),

  new WritingKey( {
    en: {
      regular: "n",
      shifted: "N",
      capsable: true,
    },
    ru: {
      regular: "т",
      shifted: "Т",
      capsable: true,
    },
  }, "KeyN", false),

  new WritingKey( {
    en: {
      regular: "m",
      shifted: "M",
      capsable: true,
    },
    ru: {
      regular: "ь",
      shifted: "Ь",
      capsable: true,
    },
  }, "KeyM", false),

  new WritingKey( {
    en: {
      regular: ",",
      shifted: "<",
      capsable: true,
    },
    ru: {
      regular: "б",
      shifted: "Б",
      capsable: true,
    },
  }, "Comma", false),

  new WritingKey( {
    en: {
      regular: ".",
      shifted: ">",
      capsable: true,
    },
    ru: {
      regular: "ю",
      shifted: "Ю",
      capsable: true,
    },
  }, "Period", false),

  new WritingKey( {
    en: {
      regular: "/",
      shifted: "?",
      capsable: false,
    },
    ru: {
      regular: ".",
      shifted: ",",
      capsable: false,
    },
  }, "Slash", false),

  new WritingKey( {
    en: {
      regular: "↑",
      shifted: "↑",
      capsable: false,
    },
    ru: {
      regular: "↑",
      shifted: "↑",
      capsable: false,
    },
  }, "ArrowUp", true),

  new ShiftKey(false),

  new Ctrl(true),

  new Win(),

  new Alt(true),
  
  new Space(),

  new Alt(false),


  new Ctrl(false),  

  new WritingKey( {
    en: {
      regular: "←",
      shifted: "←",
      capsable: false,
    },
    ru: {
      regular: "←",
      shifted: "←",
      capsable: false,
    },
  }, "ArrowLeft", true),


  new WritingKey( {
    en: {
      regular: "↓",
      shifted: "↓",
      capsable: false,
    },
    ru: {
      regular: "↓",
      shifted: "↓",
      capsable: false,
    },
  }, "ArrowDown", true),

   new WritingKey( {
    en: {
      regular: "→",
      shifted: "→",
      capsable: false,
    },
    ru: {
      regular: "→",
      shifted: "→",
      capsable: false,
    },
  }, "ArrowRight", true),


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
