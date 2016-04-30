var Sentence = React.createClass({
  handleClick: function(id) {
    this.props.onDelete(id);
  },
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.text.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },
  render: function() {
    return (
      <div ref="myInput" className="sentence row">
        <h5 className="pull-left" dangerouslySetInnerHTML={this.rawMarkup()} />
        <a className="pull-right text-danger h5"
                onClick={this.handleClick.bind(this, this.props.children.id)}
                key={this.props.children.id}
                name="id">
          <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
        </a>
      </div>
    );
  }
});

var SentenceBox = React.createClass({
  deleteSentence: function(id) {
    $.ajax({
      url: '/api/sentence/delete',
      dataType: 'json',
      type: 'POST',
      data: {id: id},
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  loadSentencesFormServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data, data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handelSentenceSubmit: function(sentence) {
    var sentences = this.state.data;
    sentence.id = Date.now();
    var newSentences = sentences.concat([sentence]);
    this.setState({data: newSentences});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: sentence,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadSentencesFormServer();
  },
  render: function() {
    return (
      <div className="sentenceBox">
        <SentenceList onSentenceDelete={this.deleteSentence}
                      data={this.state.data} />
        <SentenceForm onSentenceSubmit={this.handelSentenceSubmit} />
      </div>
    );
  }
});

var SentenceList = React.createClass({
  handelDelete: function(id) {
    this.props.onSentenceDelete(id);
  },
  render: function() {
    var sentenceNodes = this.props.data.map(function(sentence) {
      return (
        <Sentence key={sentence.id} onDelete={this.handelDelete}>
          {sentence}
        </Sentence>
      );
    }.bind(this));
    return (
      <div className="sentenceList">
        {sentenceNodes}
      </div>
    );
  }
});

var SentenceForm = React.createClass({
  getInitialState: function() {
    return {text: ''};
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var text = this.state.text.trim();
    if(!text) {
      return;
    }
    this.props.onSentenceSubmit({text: text});
    this.setState({text: ''});
  },
  render: function() {
    return (
      <form className="sentenceForm" onSubmit={this.handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Input sentence"
            value={this.state.text}
            onChange={this.handleTextChange}
            className="form-control"
          />
          <div className="input-group-btn">
            <input className="btn btn-success" type="submit" value="Post" />
          </div>
        </div>
      </form>
    );
  }
});

ReactDOM.render(
  <SentenceBox url="/api/sentences" />,
  document.getElementById('content')
);
