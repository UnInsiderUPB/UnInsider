import transformers
import functions_framework

"""
This function is hosted on Google Cloud Functions.
It is also saved in this repository for reference.

The summarization model is hosted on Huggingface [1]
and it accepts English text as input.
[1]: https://huggingface.co/facebook/bart-large-cnn

Reference for enabling CORS requests [2].
[2]: https://cloud.google.com/functions/docs/samples/functions-http-cors#functions_http_cors-python
"""

# `requirements.txt`
# transformers==4.27.4
# torch==2.0.0
# functions-framework==3.3.0

@functions_framework.http
def main(request):
    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    # Get the request
    request_json = request.get_json()
    print(request_json)

    # Load the summarizer
    print('Loading the tokenizer & model')
    tokenizer = transformers.AutoTokenizer.from_pretrained('facebook/bart-large-cnn', cache_dir='/tmp/', max_length=1024, truncation=True)
    model = transformers.AutoModelForSeq2SeqLM.from_pretrained('facebook/bart-large-cnn', cache_dir='/tmp/')
    summarizer = transformers.pipeline('summarization', model=model, tokenizer=tokenizer, truncation=True)
    print('Loaded the tokenizer & model')

    # Summarize the article
    print('Summarizing')
    article = request_json['article']
    summary = summarizer(article)[0]['summary_text']

    return (summary, 200, headers)
    