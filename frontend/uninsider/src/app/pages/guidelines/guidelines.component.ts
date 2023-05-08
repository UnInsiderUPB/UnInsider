import { Component } from '@angular/core';
import { GuidelinesService } from 'src/app/services/guidelines.service';

const MIN_WORDS = 30;
const MAX_WORDS = 300;
const MAX_UPPERCASE_PERCENTAGE = 10;
const MAX_NONALPHA_PERCENTAGE = 10;

@Component({
  selector: 'app-guidelines',
  templateUrl: './guidelines.component.html',
  styleUrls: ['./guidelines.component.css']
})
export class GuidelinesComponent {
  inputText: string = '';
  mapping: Map<string, Function>;
  passed: [string];

  constructor(private guidelinesService: GuidelinesService) {
    this.mapping = new Map<string, Function>();
    this.mapping.set(`Minimum ${MIN_WORDS} words`, this.minWords);
    this.mapping.set(`Maximum ${MAX_WORDS} words`, this.maxWords);
    this.mapping.set(`Maximum ${MAX_UPPERCASE_PERCENTAGE}% uppercase letters`, this.maxUppercase);
    this.mapping.set(`Maximum ${MAX_NONALPHA_PERCENTAGE}% non-alpha characters`, this.maxNonAlpha);
    this.passed = [''];
  }

  ngOnInit() { }

  get getMappingKeys() {
    return Array.from(this.mapping.keys());
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

  // Non-alpha excluding spaces
  maxNonAlpha(): boolean {
    let nonAlphanumericCount = 0;
    for (let i = 0; i < this.inputText.length; i++) {
      const char = this.inputText[i];
      if (!char.match(/^[a-zA-Z]+$/) && char !== ' ')
        nonAlphanumericCount++;
    }
    
    return nonAlphanumericCount / this.inputText.length * 100 <= MAX_NONALPHA_PERCENTAGE;
  }

  nlp() {
    console.log('nlp');
    this.guidelinesService.getAll()
      .subscribe(
        (data: any) => {
          console.log(data);
        },
        (error: any) => {
          console.log(error);
        });
  }

  // [TODO]: Check for language (English)
  // [TODO]: Profanity (`google-profanity-words`)
  // [TODO]: Spelling and grammar errors (in English)

  verifyText() {
    this.passed = [''];
    // Iterate over all keys from the map
    for (let key of this.mapping.keys()) {
      // If the function returns true, add the key to the result
      let fn = this.mapping.get(key);
      if (fn && fn.call(this)) {
        this.passed.push(key);
      }
    }
  }
}
