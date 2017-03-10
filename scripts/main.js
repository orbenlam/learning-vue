Vue.component('todo-list', {
  props: ['todo'],
  template: '<li>{{ todo.text }}</li>'
})

var app = new Vue({
  el: '#app',
  data: {
    message: 'Mustaches cannot be used inside HTML attributes, instead use a v-bind directive',
    textcolor: 'cyan-text',
    loadtime: 'You loaded this page on ' + new Date(),
    input: '(default)',
    inputState: 'true',
    groceryList: [
      { text: 'Vegetables' },
      { text: 'Cheese' },
      { text: 'Whatever else humans are supposed to eat' }
    ],
    question: '',
    answer: 'I cannot give you an answer until you ask a question!'
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
        if (this.question.indexOf('?') === -1) {
          this.answer = 'Questions usually contain a question mark. ;-)'
          return
        }
        this.answer = 'Thinking...'
        var vm = this
        axios.get('https://yesno.wtf/api')
          .then(function (response) {
            vm.answer = _.capitalize(response.data.answer)
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
      this.getAnswer();
    }
  }
})
