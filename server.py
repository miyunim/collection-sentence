# This file provided by Facebook is for non-commercial testing and evaluation
# purposes only. Facebook reserves all rights not expressly granted.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
# ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import json
import os
import time
from flask import Flask, Response, request

app = Flask(__name__, static_url_path='', static_folder='public')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))

@app.route('/api/sentence/delete', methods=['POST'])
def comments_handler():
    with open('sentences.json', 'r') as file:
        sentences = json.loads(file.read())

    if request.method == 'POST':
        newSentence = request.form.to_dict()

        _new = []
        for sentence in sentences:
          if str(sentence.get('id')) != str(newSentence.get('id')):
            _new.append(sentence)

        with open('sentences.json', 'w') as file:
            file.write(json.dumps(_new, indent=4, separators=(',', ': ')))

    return Response(json.dumps(_new),
                    mimetype='application/json',
                    headers={
                        'Cache-Control': 'no-cache',
                        'Access-Control-Allow-Origin': '*'
                    })


@app.route('/api/sentences', methods=['GET', 'POST'])
def sentences_handler():
    with open('sentences.json', 'r') as file:
        sentences = json.loads(file.read())

    if request.method == 'POST':
        newSentence = request.form.to_dict()
        newSentence['id'] = int(time.time() * 1000)
        sentences.append(newSentence)

        with open('sentences.json', 'w') as file:
            file.write(json.dumps(sentences, indent=4, separators=(',', ': ')))

    return Response(json.dumps(sentences),
                    mimetype='application/json',
                    headers={
                        'Cache-Control': 'no-cache',
                        'Access-Control-Allow-Origin': '*'
                    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 3000)))
