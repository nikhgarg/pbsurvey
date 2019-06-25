import { Meteor } from 'meteor/meteor';
import { Router, RouteController } from 'meteor/iron:router';

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
};

function makeid()
{
    var text = "fakeid";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 14; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

Router.route('/', function(){
  console.log('in routing')
  var asg_val = this.params.query.assignmentId;
  var wid = this.params.query.workerId;
  var hit_val = this.params.query.hitId;
  // var demo = true; //demo mode
  if (!wid){
    wid = makeid();
  }
  if (!asg_val){
    asg_val = makeid();
  }
  if (!hit_val){
    hit_val = makeid();
  }
  console.log(this.params)
  Router.go('/hitId/'+hit_val+'/workerId/'+wid+'/assignmentId/'+asg_val);
});

// Router.route('/?workerId=:_wid&hitId=:_hit&assignmentId=:_asg', function(){
//   var wid = this.params._wid;
//   var asg_val = this.params._asg
//   var hit_val = this.params._hit
//   Router.go('/hitId/'+hit_val+'/workerId/'+wid+'/assignmentId/'+asg_val);
// });

Router.route('/workerId/:_wid', function(){
  var wid = this.params._wid;
  var asg_val = makeid();
  var hit_val = makeid();
  Router.go('/hitId/'+makeid()+'/workerId/'+wid+'/assignmentId/'+makeid());
});

Router.route('/hitId/:_hit/workerId/:_wid/assignmentId/:_asg', function(){
  var wid = this.params._wid;
  var asg_val = this.params._asg;
  var hit_val = this.params._hit;

  var curr_experiment = Answers.findOne({user_id: wid});
  initial_time_val = new Date().getTime();

  Session.set('user_ID_value', wid);
  Session.set('initial_time_value', initial_time_val);
  Session.set('ward_ID_value', asg_val);
  Session.set('hit_ID_value', hit_val)
  // Session.set('initialized', false)

  if ((curr_experiment && curr_experiment.experiment_finished))
  {
    Router.go('/end');  //send them to end, entry participated already.
  } else {
    Meteor.call('initialPost', {user_id: wid, initial_time: initial_time_val, ward_id: asg_val, hit_ID: hit_val}, 'startup');
    this.render('experiment');
  }

});

Router.route('/end', function(){
  this.render('end');
});
