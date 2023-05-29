import { Component } from '@angular/core';
import { GuidelinesService } from 'src/app/services/guidelines.service';

const MIN_WORDS = 50;
const MAX_WORDS = 300;
const MAX_UPPERCASE_PERCENTAGE = 10;
const MAX_NONALPHA_PERCENTAGE = 10;
const MAX_MISSPELLED_WORDS_PERCENTAGE = 20;

@Component({
  selector: 'app-guidelines',
  templateUrl: './guidelines.component.html',
  styleUrls: ['./guidelines.component.css']
})
export class GuidelinesComponent {
  inputText: string = '';
  mapping: Map<string, Function>;
  passed: [string];
  detectedLanguage: string = 'none';
  detectedProfanity: boolean = false;
  detectedMisspelling: boolean = false;

  constructor(private guidelinesService: GuidelinesService) {
    this.mapping = new Map<string, Function>();
    this.mapping.set(`Minimum ${MIN_WORDS} words`, this.minWords);
    this.mapping.set(`Maximum ${MAX_WORDS} words`, this.maxWords);
    this.mapping.set(`Maximum ${MAX_UPPERCASE_PERCENTAGE}% uppercase letters`, this.maxUppercase);
    this.mapping.set(`Maximum ${MAX_NONALPHA_PERCENTAGE}% non-alpha characters`, this.maxNonAlpha);
    this.mapping.set(`English text`, this.languageDetection);
    this.mapping.set(`No profanity`, this.profanityDetection);
    this.mapping.set(`No spelling or grammar errors`, this.spellCheck);
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

  // Language detection
  languageDetection(): boolean {
    this.guidelinesService.getLanguage(this.inputText).subscribe({
      next: (data: any) => {
        if (data.language === 'english')
          this.detectedLanguage = 'english';
        else
          this.detectedLanguage = 'none';
      },
      error: (_: any) => {
        this.detectedLanguage = 'none';
      }
    })

    return this.detectedLanguage === 'english';
  }

  // Profanity detection
  profanityDetection(): boolean {
    this.guidelinesService.getProfanityWords(this.inputText).subscribe({
      next: (data: any) => {
        if (data.profanity === 'true')
          this.detectedProfanity = true;
        else
          this.detectedProfanity = false;
      },
      error: (_: any) => {
        this.detectedProfanity = false;
      }
    })

    return this.detectedProfanity === false;
  }

  // Spelling and grammar errors
  spellCheck(): boolean {
    this.guidelinesService.getSpellCheck(this.inputText).subscribe({
      next: (data: any) => {
        if (data.misspelledWordsPerc <= MAX_MISSPELLED_WORDS_PERCENTAGE)
          this.detectedMisspelling = false;
        else
          this.detectedMisspelling = true;
      },
      error: (_: any) => {
        this.detectedMisspelling = false;
      }
    })

    return this.detectedMisspelling === false;
  }

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
