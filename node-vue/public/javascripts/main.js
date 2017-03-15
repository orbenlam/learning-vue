Vue.config.devtools = true;
Vue.config.debug = true;

Vue.component('todo-list', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})
var appConstants = {
  statusCode: { // ready, yes, valid, invalid, typing
    ready: 'ready',
    yes: 'yes',
    typing: 'typing',
    valid: 'valid',
    invalid: 'invalid'
  },
}
var app = new Vue({
  el: '#app',
  data: {
    message: 'Mustaches cannot be used inside HTML attributes, instead use a v-bind directive',
    textcolor: 'cyan-text',
    isbold: true,
    loadtime: 'You loaded this page on ' + new Date(),
    input: '(default)',
    inputState: 'true',
    groceryList: [
      { text: 'Vegetables' },
      { text: 'Cheese' },
      { text: 'Whatever else humans are supposed to eat' }
    ],
    question: '',
    answer: 'I cannot give you an answer until you ask a question!',
    image: '',
    statusCode: appConstants.statusCode,
    qstate: appConstants.statusCode.ready
  },
  filters: {
    reverse: function(str) {
      // filter used in Mustaches text
      // === {{ str.split('').reverse().join('') }}
      return str.split('').reverse().join('');
    },
    uppercase: function(str) {
      return str.toUpperCase();
    }
  },
  computed: {
    computedClass: function() {
      // obj for T/F ; ary for classname
      var resultantClass = '';
      switch (this.qstate) {
        case this.statusCode.ready:
          resultantClass = 'cyan-text'
          break;
        case this.statusCode.invalid:
          resultantClass = 'brown-text'
          break;
        case this.statusCode.valid:
        resultantClass = 'gray-text'
          break;
        case this.statusCode.typing:
          resultantClass = 'italic-text'
          break;
        case this.statusCode.yes:
          resultantClass = 'green-text bold-text'
          break;
      }
      return resultantClass;
      // return {
      //   'cyan-text': this.qstate === this.statusCode.ready,
      //   'brown-text': this.qstate === this.statusCode.invalid,
      //   'gray-text': this.qstate === this.statusCode.valid,
      //   'italic-text': this.qstate === this.statusCode.typing,
      //   'green-text': this.qstate === this.statusCode.yes,
      //   'bold-text': this.qstate === this.statusCode.yes,
      // }
    },
    uppercaseInput: function() {
      //The value of app.uppercaseInput is always dependent on the value of app.input
      //And the best part is that we’ve created this dependency relationship declaratively: the computed getter function has no side effects, which makes it easy to test and reason about.
      return ( this.input ).toUpperCase();
    }
  },
  methods: {
    currentTime: function() {
      return Date();
    },
    getAnswer: _.debounce(
      function () {
        var vm = this
        if (vm.question.indexOf('?') === -1) {
          vm.answer = 'Questions usually contain a question mark. ;-)'
          vm.qstate = 'invalid'
          vm.image = ''
          return
        }
        vm.answer = 'Thinking...'
        vm.qstate = 'valid';
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
            vm.qstate = response.data.answer === 'yes' ? vm.statusCode.yes : vm.statusCode.ready;
            vm.image = response.data.image
          })
          .catch(function (error) {
            vm.answer = 'Error! Could not reach the API. ' + error
          })
      },
      // This is the number of milliseconds we wait for the
      // user to stop typing.
      500
    )
  },
  watch: {
    question: function() {
      this.answer = 'Waiting for you to stop typing...',
      this.qstate = this.statusCode.typing;
      this.getAnswer()
    }
  }
})
