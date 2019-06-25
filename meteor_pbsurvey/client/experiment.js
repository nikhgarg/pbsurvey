import './main.html';
import './main.css';

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

getRandomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

add_unspent_value_for_budget = function(projects, budgetleft){
  var value = 0
  projects.forEach(function(project){
    value += parseInt(project[1].replace(/\D/g,''))
  });
  newprojects = projects.slice(); /* how to create copy */
  console.log(budgetleft - value)
  newprojects.push(["Unspent budget: saved for next year", "$" + numberWithCommas(budgetleft - value), ""]);
  return newprojects;
}

create_table_for_budget = function (projects){
  var str = '<table style="max-width:1000px;""><tr><th width="70%">'+ 'Project Name' + '</th><th width="30%">' + 'Project Cost' + '</th></tr>'
  projects.forEach(function(project) {
    // str += '<tr><td width="70%">'+ '<div class="tooltip" >' + project[0] + '<span class="tooltiptext">' + project[2] + '</span></div>' + '</td><td width="30%">' + project[1] + '</td></tr>';
    str += '<tr><td width="70%">'+ '<a href="#" data-toggle="tooltip" style="color:#000;" title="'+ project[2] + '">' + project[0] + '</a>' + '</td><td width="30%">' + project[1] + '</td></tr>';
  });
  str += '</table>'
  return str;
}

create_table_for_budgetrandom = function (projects){
  projects_actual = []
  projects.forEach(function(project) {
    projects_actual.push(Meteor.settings.public.ward2_projects[project])
  });
  return create_table_for_budget(add_unspent_value_for_budget(projects_actual, 800000))
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
shuffleArray = function (oldarray) {
    array = oldarray.slice();
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

Template.experiment.onCreated(function() {
   this.buttonStateDisabled = new ReactiveVar(false);
});

Template.experiment.events({
    'click #begin_experiment': function (event) {
      // Template.instance().buttonStateDisabled.set(true);
      // setTimeout(function() { Template.instance().buttonDisabled.set(false); }, 2000);
        user_ID_value = Session.get("user_ID_value");
        var curr_experiment = Answers.findOne({user_id: Session.get('user_ID_value')});
        if (curr_experiment){
            if(!Session.get('ward_ID_value')){
              Session.set('ward_ID_value', curr_experiment.ward_id)
            }
        }


        initial_time_value = Session.get('initial_time_value');
        ward_ID_value = Session.get('ward_ID_value');
        which_budget_presented_first = getRandomInt(0, 2);

        Session.set('initialized', true);
        Session.set('waiting', true);

        Session.set('which_budget_presented_first', which_budget_presented_first);

        var random_budget_ind = -1;
        if (ward_ID_value == '2'){
          // Ward where want to use a random budget generated
          random_budget_ind = getRandomInt(0, Meteor.settings.public.ward2RandomBudgetsLength)
          Session.set('ward2_random_budget_index', random_budget_ind)
        }

        Session.set('phase', 'phase_questions_page')

        Meteor.call('initialPost', {user_id: user_ID_value, initial_time: initial_time_value, ward_id: ward_ID_value, ward2_random_budget_index:random_budget_ind, which_budget_presented_first:which_budget_presented_first}, 'clicked_begin', function(error, result){
            if (error){
                console.log("error "+error);
            } else {
            }
        });
    },

    'click #submit_feedback':function(event){
      event.preventDefault();
      event.stopPropagation()
      // console.log('feedbacksubmission')

        var answer_value = {};
        var form = $("form").children();
        //for checkboxes, radio buttons
        form.filter("label").children().filter(":checked").each(function(index, element){
            //append the values to the answer array
            if (!answer_value[$(element)[0].form.name]){
                answer_value[$(element)[0].form.name]= [$(element).val()];
            } else {
                answer_value[$(element)[0].form.name].push($(element).val());
            }
        });
        //for the button
        if (event.target.parentNode.name){
            answer_value[event.target.parentNode.name] = event.target.value;
        }
        //for textares
        form.filter("textarea").each(function(index, element){
            if ($(element).val() != " "){
                if (!answer_value[$(element).parent().attr('name')]){
                    answer_value[$(element).parent().attr('name')]= [$(element).val()];
                } else {
                    answer_value[$(element).parent().attr('name')].push($(element).val());
                }
            }
        });
        // if (Object.keys(answer_value).length != $("form").length){
        //     alert("Please make sure to answer every question.");
        //     return;
        // }
        user_ID_value = Session.get('user_ID_value');
        Session.set("answered", true);
        Session.set("waiting", true);
        //
        // if (Session.equals('phase', 'phase_instructions_page')){
        //   Session.set('phase', 'ask_paragraph_question')
        // }

        Meteor.call('submitFeedback', {answer: answer_value, user_id: user_ID_value}, function(error, result){
            if (error) {
                console.log("Error " + error + " occured. Please contact the administrators with the issue.");
            } else{
                Session.set('experiment_finished', true);
                Router.go('/end');
              }
        });

    },
    'click #answer_submission': function(event) {
      // Template.instance().buttonStateDisabled.set(true);
      // setTimeout(function() { instance.buttonDisabled.set(false); }, 2000);
      // $("#answer_submission").prop('disabled', true);

      event.preventDefault();
      event.stopPropagation()
      console.log('in answer submission')

        var answer_value = {};
        var form = $("form").children();
        console.log(form)
        //for checkboxes, radio buttons
        form.filter("label").children().filter(":checked").each(function(index, element){
            //append the values to the answer array
            if (!answer_value[$(element)[0].form.name]){
                answer_value[$(element)[0].form.name]= [$(element).val()];
            } else {
                answer_value[$(element)[0].form.name].push($(element).val());
            }
        });
        //for the button
        if (event.target.parentNode.name){
            answer_value[event.target.parentNode.name] = event.target.value;
        }
        //for textares
        form.filter("textarea").each(function(index, element){
            if ($(element).val() != " "){
                if (!answer_value[$(element).parent().attr('name')]){
                    answer_value[$(element).parent().attr('name')]= [$(element).val()];
                } else {
                    answer_value[$(element).parent().attr('name')].push($(element).val());
                }
            }
        });

        console.log(answer_value)
        // if (Object.keys(answer_value).length != $("form").length){
        //     alert("Please make sure to answer every question.");
        //     return;
        // }
        user_ID_value = Session.get('user_ID_value');
        Session.set("answered", true);
        Session.set("waiting", true);
        //
        // if (Session.equals('phase', 'phase_instructions_page')){
        //   Session.set('phase', 'ask_paragraph_question')
        // }

        Meteor.call('newPost', {answer: answer_value, user_id: user_ID_value}, function(error, result){
            if (error) {
                console.log("Error " + error + " occured. Please contact the administrators with the issue.");
            } else if (Answers.findOne({user_id: user_ID_value}).experiment_finished){
                Session.set('experiment_finished', true);
                Router.go('/end');

            } else{
                Session.set('waiting', false);
                var curr_experiment = Answers.findOne({user_id: user_ID_value}, {number_answered:1});
                // console.log(curr_experiment)
                // console.log(Session.get(''))
                if (Session.equals('phase', 'ask_paragraph_question') && curr_experiment.number_answered >= Meteor.settings.public.number_paragraphs_to_ask){
                  Session.set('phase', 'ask_feedback_question')
                }
                // console.log(Session.get('phase'));
                // console.log(Session.get('initialized'));
            }
        });

    }
});
