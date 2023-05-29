import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ReviewService } from '../../services/review.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UniversityService } from 'src/app/services/university.service';
import { GuidelinesService } from 'src/app/services/guidelines.service';

const MIN_WORDS = 50;
const MAX_WORDS = 300;
const MAX_UPPERCASE_PERCENTAGE = 10;
const MAX_NONALPHA_PERCENTAGE = 10;
const MAX_MISSPELLED_WORDS_PERCENTAGE = 35;

@Component({
  selector: 'app-review-add',
  templateUrl: './review-add.component.html',
  styleUrls: ['./review-add.component.css'],
})
export class ReviewAddComponent implements OnInit {
  user = this.login.getUser();
  reviews: any = [];
  universityId: any = undefined;
  university: any = undefined;

  inputText: string = '';
  mapping: Map<string, Function>;
  passed: [string];
  detectedLanguage: string = 'none';
  detectedProfanity: boolean = false;
  detectedMisspelling: boolean = false;

  public review: any = {
    university: undefined,
    author: undefined,
  };

  constructor(
    private login: LoginService,
    private snack: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private universityService: UniversityService,
    private guidelinesService: GuidelinesService
  ) {
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

  ngOnInit(): void {
    this.user = this.login.getUser();
    this.universityId = JSON.parse(
      this.route.snapshot.paramMap.get('universityId') || '{}'
    );
    this.university = this.universityService
      .getUniversityById(this.universityId)
      .subscribe({
        next: (data) => {
          this.university = data;
        },
      });
  }

  public isFormValid() {
    // A form is valid if all keys from `mapping` are present in `passed`
    for (let key of this.mapping.keys()) {
      if (!this.passed.includes(key)) {
        return false;
      }
    }
    return true;
  }

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

  formSubmit() {
    this.review['text'] = this.inputText;

    // Remove authorities from user object before sending to server, as the server cannot deserialize it (for now)
    const backedUpUserAuthorities = this.user.authorities;
    this.user.authorities = undefined;

    this.review.author = this.user;
    this.review.university = this.university;

    // Remove authorities from university admin object before sending to server, as the server cannot deserialize it (for now)
    const backedUpAdminAuthorities = this.university.admin.authorities;
    this.university.admin.authorities = undefined;

    this.reviewService.addReview(this.review).subscribe({
      next: (data) => {
        // Restore authorities, maybe it will be needed later
        this.user.authorities = backedUpUserAuthorities;
        this.university.admin.authorities = backedUpAdminAuthorities;

        Swal.fire('Success!', 'Review added successfully', 'success').then(
          (_) => {
            const user_role = this.login.getUserRole();
            if (user_role == 'ADMIN')
              this.router
                .navigate([
                  '/admin/university-reviews',
                  { universityId: this.universityId },
                ])
                .then((_) => { });
            else if (user_role == 'NORMAL')
              this.router
                .navigate([
                  '/user-dashboard/university-reviews',
                  { universityId: this.universityId },
                ])
                .then((_) => { });
          }
        );
      },
      error: (error) => {
        this.snack.open(error.error.message, 'OK', {
          duration: 3000,
        });
      },
    });
  }
}
