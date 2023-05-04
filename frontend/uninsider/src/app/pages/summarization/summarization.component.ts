import { Component } from '@angular/core';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference('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');

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
    this.summarizedText = '';

    let result = null;
    try {
      this.summarizationLoading = true;
      result = await hf.summarization({
        model: 'facebook/bart-large-cnn',
        inputs: this.inputText,
      });
    } catch (e) {
      this.summarizationLoading = false;
      console.log(e);
      alert('Error occurred while summarizing the text.');
      return;
    }

    // Successfully summarized the text
    console.log(result['summary_text']);
    this.summarizedText = result['summary_text'];
    this.isSummarizationReady = true;
  }
}
