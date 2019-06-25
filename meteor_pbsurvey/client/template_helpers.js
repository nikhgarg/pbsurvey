import './experiment.js'

Template.registerHelper('experiment_finished', function(){return Session.get('experiment_finished');});
Template.registerHelper('initialized', function(){
    if(Session.equals('initialized', true)){
        return true;
    } else {
        return false;
    }
});

Template.registerHelper('questionphase', function(){
  // console.log(Session.get('phase'));
    if(Session.equals('phase', "phase_questions_page")){
        return true;
    } else {
        return false;
    }
});


Template.registerHelper('ward_question_beginning', function(){
  ward_id =  Session.get('ward_ID_value');
  if (ward_id != 2){
    existing_budget = create_table_for_budget(Meteor.settings.public.existingbudgets[ward_id-1])
    return '<h4>Suppose that the following projects are funded (costs are listed). </h4><br>'
    + '<div class="btnanswerchoice" style="background-color: #a5daeb;">' + existing_budget + '</div>'
    + '<br><br><h4>Which of the following two sets of additional project(s) would you prefer to fund?</h4><br>'
  }
  else{
    return '<h4>Which of the following two sets of projects would you prefer to fund? (costs are listed) </h4>'
  }


});

Template.registerHelper('ward_budget0', function(){
  ward_id =  Session.get('ward_ID_value');
  whichone = Session.get('which_budget_presented_first');
  if ((ward_id != 2) || (whichone!=1)){
    return create_table_for_budget(add_unspent_value_for_budget(Meteor.settings.public.budgetchoices[ward_id-1][whichone], Meteor.settings.public.budgetleft[ward_id-1])) + '<br><strong> Option A </strong>'
  }
  else{
    random_budget_index = Session.get('ward2_random_budget_index')
    return create_table_for_budgetrandom(Meteor.settings.public.ward2_random_budgets[random_budget_index]) + '<br><strong> Option A </strong>'
  }
});

Template.registerHelper('ward_budget1', function(){
  ward_id =  Session.get('ward_ID_value');
  whichone = 1 - Session.get('which_budget_presented_first');
  if ((ward_id != 2) || (whichone!=1)){
    return create_table_for_budget(add_unspent_value_for_budget(Meteor.settings.public.budgetchoices[ward_id-1][whichone], Meteor.settings.public.budgetleft[ward_id-1])) + '<br><strong> Option B </strong>'
  }
  else{
    random_budget_index = Session.get('ward2_random_budget_index')
    return create_table_for_budgetrandom(Meteor.settings.public.ward2_random_budgets[random_budget_index]) + '<br><strong> Option B </strong>'
  }
});

Template.registerHelper('IRBText', function(){
  return Meteor.settings.public.IRBText;
});


Template.registerHelper('waiting', function(){
    return Session.get('waiting');
});

Template.experiment.helpers({
    form_phases:function(){
      user_ID_value = Session.get('user_ID_value');
      var curr_experiment = Answers.findOne({user_id: user_ID_value});
      if (curr_experiment.experiment_done == false){
        return {"phase": Session.get("phase")};
      }
    },
    buttonStateDisabled: function() { return Template.instance().buttonStateDisabled.get(); }

});


Template.registerHelper('current_phase', function(){
  return Answers.findOne({user_id: Session.get("user_ID_value")}).current_phase;
});
