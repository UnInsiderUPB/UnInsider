import { Component } from '@angular/core';

const MIN_WORDS = 30;
const MAX_WORDS = 300;
const MAX_UPPERCASE_PERCENTAGE = 20;
const MAX_NONALPHANUMERIC_PERCENTAGE = 40;

@Component({
  selector: 'app-guidelines',
  templateUrl: './guidelines.component.html',
  styleUrls: ['./guidelines.component.css']
})

export class GuidelinesComponent {

  inputText: string = '';
  verificationResult: string = '';
  mapping: Map<string, Function>;

  constructor() {    
    this.mapping = new Map<string, Function>();
    this.mapping.set('minWords', this.minWords);
    this.mapping.set('maxWords', this.maxWords);
    this.mapping.set('maxUppercase', this.maxUppercase);
    this.mapping.set('maxNonAlphanumeric', this.maxNonAlpha);
  }

  // Minimum words
  minWords(): boolean {
    return this.inputText.split(' ').length >= MIN_WORDS;
  }

  // Maximum words
  maxWords(): boolean {
    return this.inputText.split(' ').length <= MAX_WORDS;
  }

  // Uppercase
  maxUppercase(): boolean {
    let uppercaseCount = 0;
    for (let i = 0; i < this.inputText.length; i++) {
      const char = this.inputText[i];
      if (char === char.toUpperCase() && char !== char.toLowerCase())
        uppercaseCount++;
    }

    return uppercaseCount / this.inputText.length * 100 <= MAX_UPPERCASE_PERCENTAGE;
  }

  // Non-alpha
  maxNonAlpha(): boolean {
    let nonAlphanumericCount = 0;
    for (let i = 0; i < this.inputText.length; i++) {
      if (!this.inputText[i].match(/^[a-zA-Z]+$/))
        nonAlphanumericCount++;
    }

    return nonAlphanumericCount / this.inputText.length * 100 <= MAX_NONALPHANUMERIC_PERCENTAGE;
  }

  // [TODO]: Profanity (`google-profanity-words`)

  // [TODO-ONLY-IF-ROMANIAN]: Check for language (Romanian)
  // [TODO-ONLY-IF-ROMANIAN]: Spelling and grammar errors (in Romanian)

  verifyText() {
    this.verificationResult = '';
    // Iterate over all keys from the map
    for (let key of this.mapping.keys()) {
      // If the function returns true, add the key to the result
      let fn = this.mapping.get(key);
      if (fn && fn.call(this)) {
        this.verificationResult += key + ', ';
      }
    }
  }
}
