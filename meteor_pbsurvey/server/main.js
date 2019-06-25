import { Meteor } from 'meteor/meteor';

Answers = new Mongo.Collection("answers");
Meteor.publish("answers", function() {
    return Answers.find();
});

experiment_id_counter = 0;
existing_experiment_counter = 0;

if (Answers.findOne({
        begin_experiment: true
    })) {
    existing_experiment_counter = Answers.find({
        begin_experiment: true
    }, {
        sort: {
            experiment_id: -1
        },
        limit: 1
    }).fetch();

    // function isInt(value) {
    //   return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
    // }
    value =existing_experiment_counter[0].experiment_id;
    x = parseFloat(value);
    if (!isNaN(value) && (x | 0) === x){
      experiment_id_counter = value + 1;
    }

}

Meteor.startup(function() {
  Answers._ensureIndex({ user_id: "hashed" });
});


Meteor.methods({
    getWorkerEntry: function(search, whichreturn){
      return Answers.findOne(search, whichreturn);
    },
    initialPost: function(post, status) {
        //check if already present
        if (status == 'startup') {
            if (Answers.findOne({
                    user_id: post.user_id
                })) {
                return;
            }
            var initial_time_val = new Date().getTime();
            Answers.insert({
                user_id: post.user_id,
                // ward_id: post.ward_id,
                initial_time: initial_time_val,
                latest_time: initial_time_val,
                experiment_finished: false,
                run_label: Meteor.settings.public.run_label,
                current_phase:"instructions_landing_page"
            });
            return;
        }
        if (status == 'clicked_begin'){
          // var experiment_id_value = post.user_id; //experiment_id_counter;
          var begin_time_val = new Date().getTime();
          experiment_id_counter++;
          var existing_entry = Answers.findOne({
              user_id: post.user_id
          });
          Answers.update({
              user_id: post.user_id
          }, {
              $set: {
                  user_id: post.user_id,
                  ward_id: post.ward_id,
                  initial_time: post.initial_time,
                  begin_time: begin_time_val,
                  experiment_id: experiment_id_counter,
                  experiment_finished: false,
                  latest_time: begin_time_val,
                  number_answered: 0,
                  begin_experiment:true,
                  begin_page_time: begin_time_val - existing_entry.latest_time,
                  current_phase:"phase_questions_page",
                  ward2_random_budget_index: post.ward2_random_budget_index,
                  which_budget_presented_first: post.which_budget_presented_first

              }
          }, {
              upsert: true
          });
        }
    },

    newPost: function(post) {
      //format time to UTC human readable format
      post.initial_time = new Date(post.initial_time).toLocaleString();
      var existing_entry = Answers.findOne({
          user_id: post.user_id
      });
      var answers_value = {};
      // var experiment_id_value = existing_entry.experiment_id;
      if (existing_entry.answer) {
          //worker has submitted some answers, retrieve them
          answers_value = existing_entry.answer;
      }
      var current_question = existing_entry.current_phase;
      var current_answer = post.question_answered;

      //check if the user has answered the question already
      if (!answers_value[current_question]) {
          answers_value[current_question] = {};
      }
      post.answer['time'] = new Date().getTime() - existing_entry.latest_time;
      answers_value = post.answer;

      //Add entry to Answers
      Answers.update({
          user_id: post.user_id
      }, {
          $set: {
              answer: answers_value,
              latest_time: new Date().getTime(),
              experiment_finished:true
          }
      }, {
          upsert: true
      });
      console.log('experiment num: ' + existing_entry.experiment_id)
      console.log(existing_entry)
      console.log(answers_value)
  }
});
