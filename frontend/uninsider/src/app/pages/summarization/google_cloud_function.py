# `requirements.txt`
# transformers==4.27.4
# torch==2.0.0
# functions-framework==3.3.0

"""
This function is hosted on Google Cloud Functions.
It is also saved in this repository for reference.

The summarization model is hosted on Huggingface [1]
and it accepts English text as input.
[1]: https://huggingface.co/facebook/bart-large-cnn

Reference for enabling CORS requests [2].
[2]: https://cloud.google.com/functions/docs/samples/functions-http-cors#functions_http_cors-python

Reference for caching the `tokenizer` and `model` [3].
[3]: https://cloud.google.com/functions/docs/bestpractices/tips#do_lazy_initialization_of_global_variables
"""

import transformers
import functions_framework

def cold_start_tokenier():
    print('Loading the tokenizer')
    tokenizer = transformers.AutoTokenizer.from_pretrained('facebook/bart-large-cnn',
                                                           cache_dir='/tmp/',
                                                           max_length=1024,
                                                           truncation=True)
    print('Loaded the tokenizer')
    return tokenizer

def cold_start_model():
    print('Loading the model')
    model = transformers.AutoModelForSeq2SeqLM.from_pretrained('facebook/bart-large-cnn',
                                                               cache_dir='/tmp/')
    print('Loaded the model')
    return model

# Lazy initialization
tokenizer, model = None, None

@functions_framework.http
def main(request):
    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
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

    request_json = request.get_json()
    print(request_json)

    # Do lazy initialization of `tokenizer` and `model`
    global tokenizer, model
    if not tokenizer:
        tokenizer = cold_start_tokenier()
    if not model:
        model = cold_start_model() 

    print('Constructing the summarizer')
    summarizer = transformers.pipeline('summarization',
                                       model=model,
                                       tokenizer=tokenizer,
                                       truncation=True)
    print('Constructed the summarizer')

    print('Summarizing')
    article = request_json['article']
    summary = summarizer(article)[0]['summary_text']
    print('Summarized')

    return (summary, 200, headers)
    