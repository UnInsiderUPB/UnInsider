import { Component } from '@angular/core';
import { SummarizationService } from 'src/app/services/summarization.service';

const MIN_CHARS = 50;

// [TODO]
//
// In this current version, the first request takes a long time to respond.
// This is because the server must download the `model` and the `tokenizer`.
//
// After the first request (cold-start), because we use global lazy-initialization,
// the server will cache the `model` and the `tokenizer` in the `/tmp/` folder.
//
// To solve this problem, we can use a `prefetch` function to download the model and the tokenizer
// when our app starts. This will give time for the server to download the required files.

@Component({
  selector: 'app-summarization',
  templateUrl: './summarization.component.html',
  styleUrls: ['./summarization.component.css']
})
export class SummarizationComponent {
  inputText: string = '';
  summarizedText: string = '';
  isSummarizationReady: boolean = false;
  summarizationLoading: boolean = false;

  constructor(private summarizationService: SummarizationService) {}

  public initSummarization() {
    this.summarizationService.initSummarizationModule().subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (_: any) => {
        alert('Could not initialize the summarization model');
      }
    })
  }

  public summarize() {
    // Reset some variables
    this.isSummarizationReady = false;
    this.summarizationLoading = true;
    this.summarizedText = '';

      // If the input text is too short, then return
      if (this.inputText.length < MIN_CHARS) {
        alert('Please enter a longer text to summarize.');
        this.summarizationLoading = false;
        return;
      }

    // [TODOs]: ...

    // Make the `summarization` request
    this.summarizationService.getSummary(this.inputText).subscribe({
      next: (data: any) => {
        // console.log(data);
        this.summarizedText = data.summary;
        this.isSummarizationReady = true;
        this.summarizationLoading = false;
      },
      error: (_: any) => {
        alert('Error occurred while summarizing the text.');
      }
    })
  }
}
