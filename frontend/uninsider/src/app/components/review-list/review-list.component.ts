import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReviewService } from '../../services/review.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { GuidelinesService } from 'src/app/services/guidelines.service';
import { SummarizationService } from 'src/app/services/summarization.service';
import { UniversityService } from 'src/app/services/university.service';

const MIN_WORDS = 50;
const MAX_WORDS = 300;
const MAX_UPPERCASE_PERCENTAGE = 10;
const MAX_NONALPHA_PERCENTAGE = 10;
const MAX_MISSPELLED_WORDS_PERCENTAGE = 35;

const MIN_CHARS = 50;
const SUMMARIZATION_REVIEWS_PERCENTAGE = 30;

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css'],
})
export class ReviewListComponent implements OnInit {
  university: any = undefined;
  user = this.login.getUser();
  ownReviews: any = [];
  allReviews: any = [];
  universityId: any;
  userId: any;
  likedReviews: any = [];
  dislikedReviews: any = [];

  searchItem: string = '';

  inputText: string = '';
  mapping: Map<string, Function>;
  passed: [string];
  detectedLanguage: string = 'none';
  detectedProfanity: boolean = false;
  detectedMisspelling: boolean = false;

  articleText: string = '';
  summarizedText: string = '';
  isSummarizationReady: boolean = false;
  summarizationLoading: boolean = false;

  constructor(
    private login: LoginService,
    private reviewService: ReviewService,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    private guidelinesService: GuidelinesService,
    private summarizationService: SummarizationService,
    private universityService: UniversityService
  ) {
    this.mapping = new Map<string, Function>();
    this.mapping.set(`Minimum ${MIN_WORDS} words`, this.minWords);
    this.mapping.set(`Maximum ${MAX_WORDS} words`, this.maxWords);
    this.mapping.set(
      `Maximum ${MAX_UPPERCASE_PERCENTAGE}% uppercase letters`,
      this.maxUppercase
    );
    this.mapping.set(
      `Maximum ${MAX_NONALPHA_PERCENTAGE}% non-alpha characters`,
      this.maxNonAlpha
    );
    this.mapping.set(`English text`, this.languageDetection);
    this.mapping.set(`No profanity`, this.profanityDetection);
    this.mapping.set(`No spelling or grammar errors`, this.spellCheck);
    this.passed = [''];
  }

  hydrateAllReviews() {
    if (this.universityId && this.userId) {
      // Get reviews by university id and author id
      this.reviewService
        .getReviewsByUniversityIdAndAuthorId(this.universityId, this.userId)
        .subscribe({
          next: (data) => {
            this.allReviews = data;
          },
        });
    } else if (this.universityId) {
      // Get reviews by university id
      this.reviewService.getReviewsByUniversityId(this.universityId).subscribe({
        next: (data) => {
          this.allReviews = data;
        },
      });
    } else if (this.userId) {
      // Get reviews by author id
      this.reviewService.getReviewsByAuthorId(this.userId).subscribe({
        next: (data) => {
          this.allReviews = data;
        },
      });
    } else {
      // Get all reviews
      this.reviewService.getAllReviews().subscribe({
        next: (data) => {
          this.allReviews = data;
        },
      });
    }
  }

  ngOnInit(): void {
    this.user = this.login.getUser();
    this.universityId =
      JSON.parse(this.route.snapshot.paramMap.get('universityId') || 'null') ||
      undefined;

    this.userId =
      JSON.parse(this.route.snapshot.paramMap.get('userId') || 'null') ||
      undefined;

    this.university = this.universityId
      ? this.universityService.getUniversityById(this.universityId).subscribe({
        next: (data) => {
          this.university = data;
        },
      })
      : undefined;

    this.hydrateAllReviews();

    // Get own reviews
    this.reviewService.getReviewsByAuthorId(this.user.id).subscribe({
      next: (data) => {
        this.ownReviews = data;
      },
    });

    this.reviewService.getReviewsLikedByUser(this.user.id).subscribe({
      next: (data) => {
        this.likedReviews = data;
      },
    });

    this.reviewService.getReviewsDislikedByUser(this.user.id).subscribe({
      next: (data) => {
        this.dislikedReviews = data;
      },
    });
  }

  public enableSummOnlyOnUniver() {
    return this.router.url.includes('universityId');
  }

  public getUserRole() {
    return this.login.getUserRole();
  }

  public goToAddReview() {
    const user_role = this.login.getUserRole();
    if (user_role == 'ADMIN')
      this.router
        .navigate([
          '/admin/university-reviews/add',
          { universityId: this.universityId },
        ])
        .then((_) => { });
    else if (user_role == 'NORMAL')
      this.router
        .navigate([
          '/user-dashboard/university-reviews/add',
          { universityId: this.universityId },
        ])
        .then((_) => { });
  }

  public isLiked(review: any) {
    return this.likedReviews.some((r: any) => r.id === review.id);
  }

  public isDisliked(review: any) {
    return this.dislikedReviews.some((r: any) => r.id === review.id);
  }

  public likeReview(review: any) {
    this.reviewService.likeReview(review.id, this.user.id).subscribe({
      next: (updatedReview: any) => {
        // Update liked reviews
        this.reviewService.getReviewsLikedByUser(this.user.id).subscribe({
          next: (data) => {
            this.likedReviews = data;
          },
        });

        // Update disliked reviews
        this.reviewService.getReviewsDislikedByUser(this.user.id).subscribe({
          next: (data) => {
            this.dislikedReviews = data;
          },
        });

        review.likes = updatedReview.likes;
        review.dislikes = updatedReview.dislikes;
      },
      error: (error) => {
        console.log(error);
        this.snack.open(error.error.message, 'OK', {
          duration: 3000,
        });
      },
    });
  }

  public dislikeReview(review: any) {
    this.reviewService.dislikeReview(review.id, this.user.id).subscribe({
      next: (updatedReview: any) => {
        // Update liked reviews
        this.reviewService.getReviewsLikedByUser(this.user.id).subscribe({
          next: (data) => {
            this.likedReviews = data;
          },
        });

        // Update disliked reviews
        this.reviewService.getReviewsDislikedByUser(this.user.id).subscribe({
          next: (data) => {
            this.dislikedReviews = data;
          },
        });

        review.likes = updatedReview.likes;
        review.dislikes = updatedReview.dislikes;
      },
      error: (error) => {
        console.log(error);
        this.snack.open(error.error.message, 'OK', {
          duration: 3000,
        });
      },
    });
  }

  public hasEditRights(review: any) {
    return (
      this.login.getUserRole() == 'ADMIN' ||
      this.ownReviews.some((r: any) => r.id == review.id)
    );
  }

  public editReview(review: any) {
    Swal.fire({
      width: '800px',
      title: 'Edit review',
      html: `
      <textarea
        id="swal-input"
        class="swal2-input"
        style="width: 90%; height: 300px; font-size: 16px;"
        placeholder="Text">
        ${review.text}
      </textarea>
      <div id="checkboxes">
        ${this.getMappingKeys
          .map(
            (key, i) =>
              `
          <div>
            <input type="checkbox" id="checkbox${i}" name="${key}"}>
            <label for="checkbox${i}">${key}</label>
          </div>
          `
          )
          .join('')}
      </div>
      `,
      focusConfirm: false,
      didOpen: () => {
        const textarea = document.getElementById('swal-input');
        const checkboxes = document.querySelectorAll('[id^="checkbox"]');

        // Event listener for `textarea` element
        textarea?.addEventListener('input', () => {
          this.inputText = (
            document.getElementById('swal-input') as HTMLInputElement
          ).value;
          // console.log(this.inputText);
          this.verifyText();

          // Update checkboxes in real time
          checkboxes.forEach((checkbox) => {
            var checkboxName = (checkbox as HTMLInputElement).name;
            if (this.passed.includes(checkboxName)) {
              (checkbox as HTMLInputElement).checked = true;
            } else {
              (checkbox as HTMLInputElement).checked = false;
            }
          });
        });
      },
      preConfirm: () => {
        const text = (document.getElementById('swal-input') as HTMLInputElement)
          .value;

        this.inputText = text;
        this.verifyText();
        if (!this.isFormValid()) {
          Swal.showValidationMessage(`Please enter a valid text.`);
        }

        return { text };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        review.text = result.value.text;

        this.reviewService.updateReview(review).subscribe({
          next: (_) => {
            this.allReviews = this.allReviews.map((r: any) => {
              if (r.id === review.id) {
                r = review;
              }
              return r;
            });
            Swal.fire('Edited!', 'The review has been edited.', 'success');
          },
          error: (error) => {
            console.log(error);
            this.snack.open(error.error.message, 'OK', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  public deleteReview(review: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this review!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it.',
    }).then((result) => {
      if (result.isConfirmed) {
        this.reviewService.deleteReviewById(review.id).subscribe({
          next: (_) => {
            this.allReviews = this.allReviews.filter(
              (r: any) => r.id !== review.id
            );
            Swal.fire('Deleted!', 'The review has been deleted.', 'success');
          },
          error: (error) => {
            console.log(error);
            this.snack.open(error.error.message, 'OK', {
              duration: 3000,
            });
          },
        });
      }
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

    return (
      (uppercaseCount / this.inputText.length) * 100 <= MAX_UPPERCASE_PERCENTAGE
    );
  }

  // Non-alpha excluding spaces
  maxNonAlpha(): boolean {
    let nonAlphanumericCount = 0;
    for (let i = 0; i < this.inputText.length; i++) {
      const char = this.inputText[i];
      if (!char.match(/^[a-zA-Z]+$/) && char !== ' ') nonAlphanumericCount++;
    }

    return (
      (nonAlphanumericCount / this.inputText.length) * 100 <=
      MAX_NONALPHA_PERCENTAGE
    );
  }

  // Language detection
  languageDetection(): boolean {
    this.guidelinesService.getLanguage(this.inputText).subscribe({
      next: (data: any) => {
        // console.log(data);
        if (data.language === 'english') this.detectedLanguage = 'english';
        else this.detectedLanguage = 'none';
      },
      error: (_: any) => {
        this.detectedLanguage = 'none';
      },
    });

    return this.detectedLanguage === 'english';
  }

  // Profanity detection
  profanityDetection(): boolean {
    this.guidelinesService.getProfanityWords(this.inputText).subscribe({
      next: (data: any) => {
        if (data.profanity === 'true') this.detectedProfanity = true;
        else this.detectedProfanity = false;
      },
      error: (_: any) => {
        this.detectedProfanity = false;
      },
    });

    return this.detectedProfanity === false;
  }

  // Spelling and grammar errors
  spellCheck(): boolean {
    this.guidelinesService.getSpellCheck(this.inputText).subscribe({
      next: (data: any) => {
        // console.log(data);
        if (data.misspelledWordsPerc <= MAX_MISSPELLED_WORDS_PERCENTAGE)
          this.detectedMisspelling = false;
        else this.detectedMisspelling = true;
      },
      error: (_: any) => {
        this.detectedMisspelling = false;
      },
    });

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

  /**
   * Summarization
   */

  public initSummarization() {
    this.summarizationService.initSummarizationModule().subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (_: any) => {
        alert('Could not initialize the summarization model');
      },
    });
  }

  public summarize() {
    // Reset some variables
    this.isSummarizationReady = false;
    this.summarizationLoading = true;
    this.summarizedText = '';

    // Sort the `this.allReviews` array by `likes` in descending order
    // and `dislikes` in ascending order (to get the most appreciated reviews)
    let sortedReviews = [...this.allReviews].sort((r1: any, r2: any) => {
      if (r1.likes > r2.likes) return -1;
      if (r1.likes < r2.likes) return 1;
      if (r1.dislikes > r2.dislikes) return 1;
      if (r1.dislikes < r2.dislikes) return -1;
      return 0;
    });

    // Get the first `SUMMARIZATION_REVIEWS_PERCENTAGE` reviews
    let reviews = sortedReviews.slice(
      0,
      Math.ceil((sortedReviews.length * SUMMARIZATION_REVIEWS_PERCENTAGE) / 100)
    );

    // Concate all the reviews into a single string, separated by `=====`
    this.articleText = reviews.map((r: any) => r.text).join('\n\n=====\n\n');
    // console.log(this.articleText);

    // If the input text is too short, then return
    if (this.articleText.length < MIN_CHARS) {
      alert('Please provide a longer text to summarize.');
      this.summarizationLoading = false;
      return;
    }

    // [TODOs]: ...

    // Make the `summarization` request
    this.summarizationService.getSummary(this.articleText).subscribe({
      next: (data: any) => {
        // console.log(data);

        // Append the `data.summary` character by character to the `this.summarizedText` variable
        // this will make the text appear as if it is being typed
        for (let i = 0; i < data.summary.length; i++) {
          setTimeout(() => {
            this.summarizedText += data.summary[i];
          }, i * 25);
        }

        // Wait `data.summary.length * 25` milliseconds before setting the `isSummarizationReady` variable to true
        setTimeout(() => {
          this.isSummarizationReady = true;
          this.summarizationLoading = false;
        }, data.summary.length * 25);
      },
      error: (_: any) => {
        alert('Error occurred while summarizing the text.');
      },
    });
  }
}
