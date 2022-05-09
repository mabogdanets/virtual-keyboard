const keyboard = document.querySelector("#keyboard");
const input = document.querySelector("#input");
let isShiftRight = false;
let isShiftLeft = false;
let isCapslock = false;

class Key {

  constructor( title, code, isDark, width) {
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
    const btn = this.btn;
    const onUp = this.onUp;

    function onMouseUp() {
      onUp();
      btn.removeEventListener("mouseup", onMouseUp);
      btn.removeEventListener("mouseout", onMouseUp);
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
    
  }

  onUp() {
    btn.classList.remove("active");
  }
}

class WritingKey extends Key {
  press() {
   // input.
  }
}

const keys = [
  new WritingKey( "5", "Digit5", true, "large" ),
  new ShiftKey(true),
  new ShiftKey(false),
];
