import { Component } from '@angular/core';

const endpoint = 'https://us-central1-bart-proj.cloudfunctions.net/uninsider-bart-cnn-cors-all-global'
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

  constructor() {}

  public async initSummarization(): Promise<any> {
    let response = null;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({article: 'init'}),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*',
        }
      });
    } catch (e) {
      console.log(e);
      alert('Could not initialize the summarization model');
      return;
    }

    if (response.ok) {
      console.log('Successfully initialized the summarization model');
    }
  }

  public async summarize(): Promise<any> {
    // Reset some variables
    this.isSummarizationReady = false;
    this.summarizationLoading = true;
    this.summarizedText = '';

    // [TODO]: ...

    let response = null;
    try {
        // If the input text is too short, then return
        if (this.inputText.length < MIN_CHARS) {
          alert('Please enter a longer text to summarize.');
          this.summarizationLoading = false;
          return;
        }

        // Send the request to the server
        this.summarizationLoading = true;
        let content = JSON.stringify({article: this.inputText});
        // console.log(content);
        response = await fetch(endpoint, {
          method: 'POST',
          body: content,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
          }
        });
    } catch (e) {
      this.summarizationLoading = false;
      // console.log(e);
      alert('Error occurred while summarizing the text.');
      return;
    }

    if (!response.ok) {
      this.summarizationLoading = false;
      alert('Error occurred while summarizing the text.');
      return;
    }
    
    // Parse the response
    if (response.body == null) {
      this.summarizationLoading = false;
      alert('Error occurred while summarizing the text.');
      return;
    }

    // Successfully summarized the text
    // Convert `ReadableStream` to `string` and update the UI
    var summary = await response.text();

    // Ensure that the summary ends with a period (.)
    // Find the last index of the period (.)
    let lastPeriodIndex = summary.lastIndexOf('.');

    // Cut the summary at the last period (.)
    if (lastPeriodIndex != -1)
      summary = summary.substring(0, lastPeriodIndex + 1);

    this.summarizedText = summary;
    this.isSummarizationReady = true;
    this.summarizationLoading = false;
  }
}
