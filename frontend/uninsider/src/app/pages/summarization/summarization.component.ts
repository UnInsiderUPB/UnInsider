import { Component } from '@angular/core';

const endpoint = 'https://us-central1-bart-proj.cloudfunctions.net/uninsider-bart-cnn-cors-all'

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

    let response = null;
    try {
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
