import { Component } from '@angular/core';

const endpoint = 'https://us-central1-bart-proj.cloudfunctions.net/uninsider-bart-cnn-cors-all'
const MIN_CHARS = 50;

// [TODO]
//
// In this current version, the first request takes a long time to respond.
// This is because the server must download the `model` and the `tokenizer`.
//
// After the first request, the server will cache the `model` and the `tokenizer` in the `/tmp/` folder.
//
// To solve this problem, we can use `prefetch` function to download the model and the tokenizer
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

  public async summarize(): Promise<any> {
    // Reset some variables
    this.isSummarizationReady = false;
    this.summarizationLoading = true;
    this.summarizedText = '';

    // [TODO]: Ensure that the summarization ends with a period (.)
    //         -> This can be done as a post-processing step in this script
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
    this.summarizedText = summary;
    this.isSummarizationReady = true;
    this.summarizationLoading = false;
  }
}
