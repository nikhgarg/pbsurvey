import { Meteor } from 'meteor/meteor';
import { Router, RouteController } from 'meteor/iron:router';

import './experiment.js'

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
    var text = "randid";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 7; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

Router.route('/', function(){
  var wid_val = this.params.query.wardid;
  var user_val = this.params.query.userid;
  // var demo = true; //demo mode
  if (!wid_val){
    // wid_val = "2"
    wid_val = getRandomInt(1, 4).toString()
  }
  if (!user_val){
    user_val = makeid();
  }
  Router.go('/user_id/'+user_val+'/ward_id/'+wid_val);
});

Router.route('/user_id/:_userid', function(){
  var userid = this.params._userid;
  var wardid = getRandomInt(1, 4).toString()
  Router.go('/user_id/'+userid+'/ward_id/'+wardid);
});

Router.route('/user_id/:_userid/ward_id/:_wardid', function(){
  var userid = this.params._userid;
  var wardid = this.params._wardid;
  var curr_experiment = Answers.findOne({user_id: userid});
  initial_time_val = new Date().getTime();

  Session.set('user_ID_value', userid);
  if ((curr_experiment && curr_experiment.experiment_finished))
  {
    Router.go('/end');  //send them to end, entry participated already.
  } else {
    Meteor.call('initialPost', {user_id: userid, initial_time: initial_time_val, ward_id: wardid}, 'startup');
    this.render('experiment');
  }

});

Router.route('/end', function(){
  this.render('end');
});
