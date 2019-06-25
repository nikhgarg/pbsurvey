// This code only runs on the client
Meteor.subscribe("answers");
Answers = new Mongo.Collection("answers");
duration = 15000; //ms

import './routing.js';
import './experiment.js';
import './main.html';
import './main.css';
import './template_helpers.js';
import './end.html';



Session.set("answered", false);
Session.set('experiment_finished', false);
Session.set('waiting', true);

//reactively starts the experiment
Deps.autorun(function(){
    var curr_experiment = Answers.findOne({user_id: Session.get('user_ID_value')});
    // console.log(Session.get('user_ID_value'))
    // console.log(curr_experiment)
    if (curr_experiment && curr_experiment.begin_experiment){
        console.log("new experiment entry inserted for user " + Session.get('user_ID_value'));
        Session.set('initialized', true);
        Session.set('waiting', true);
        initialized_questions = false;

        if(!Session.get('ward_ID_value')){
          Session.set('ward_ID_value', curr_experiment.ward_id)
        }

        if(!Session.get('which_budget_presented_first')){
          Session.set('which_budget_presented_first', curr_experiment.which_budget_presented_first)
        }

        if(!Session.get('ward2_random_budget_index')){
          Session.set('ward2_random_budget_index', curr_experiment.ward2_random_budget_index)
        }

        if(!Session.get('phase')){
          Session.set('phase', curr_experiment.current_phase)
        }
    }
});
